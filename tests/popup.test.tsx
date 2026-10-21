import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import axe from 'axe-core';
import { Popup } from '../src/popup/Popup.tsx';
import { installChrome } from './chrome.ts';

describe('Popup user flows', () => {
  it('creates a list, selects it and saves an original multiline snippet', async () => {
    const api = installChrome({});
    const user = userEvent.setup();
    render(<Popup />);
    await user.click(await screen.findByRole('button', { name: '리스트 만들기' }));
    const name = await screen.findByRole('textbox', { name: '리스트 이름' });
    await waitFor(() => expect(name).toHaveFocus());
    await user.type(name, '업무 메일');
    await user.click(screen.getByRole('button', { name: '저장' }));
    await user.click(await screen.findByRole('button', { name: '현재 리스트 선택' }));
    const item = await screen.findByRole('menuitemradio', { name: '업무 메일' });
    await waitFor(() => expect(getComputedStyle(item).pointerEvents).not.toBe('none'));
    await user.click(item);
    await user.click(await screen.findByRole('button', { name: '문장 추가' }));
    const text = '  안녕하세요.\n자료를 전달드립니다.  ';
    await user.type(await screen.findByRole('textbox', { name: '내용' }), text);
    await user.click(screen.getByRole('button', { name: '저장' }));
    expect(await screen.findByText(text, { normalizer: (value) => value })).toBeVisible();
    expect(api.state().lists[0]?.commands[0]?.text).toBe(text);
  });

  it('keeps a failed save draft and existing data, then retries successfully', async () => {
    const api = installChrome();
    const before = api.state();
    const user = userEvent.setup();
    render(<Popup />);
    await user.click(await screen.findByRole('button', { name: '문장 추가' }));
    const input = await screen.findByRole('textbox', { name: '내용' });
    await user.type(input, '보존할 입력');
    api.storage.writeError = new Error('disk write failed');
    await user.click(screen.getByRole('button', { name: '저장' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('입력과 기존 데이터는 유지됩니다');
    expect(input).toHaveValue('보존할 입력');
    expect(input).toHaveFocus();
    expect(api.state()).toEqual(before);
    api.storage.writeError = null;
    await user.click(screen.getByRole('button', { name: '저장' }));
    expect(await screen.findByText('보존할 입력')).toBeVisible();
  });

  it('focuses retry on a read failure without writing an empty state', async () => {
    const api = installChrome();
    const before = api.state();
    api.storage.readError = new Error('read failed');
    const user = userEvent.setup();
    render(<Popup />);
    expect(await screen.findByRole('alert')).toHaveTextContent('불러오지 못했습니다');
    const retry = screen.getByRole('button', { name: '다시 시도' });
    await waitFor(() => expect(retry).toHaveFocus());
    expect(api.set).not.toHaveBeenCalled();
    api.storage.readError = null;
    await user.click(retry);
    expect(await screen.findByRole('button', { name: '현재 리스트: 업무 메일' })).toBeVisible();
    expect(api.state()).toEqual(before);
  });

  it('requires checking the latest result after a lost delete reply instead of repeating deletion', async () => {
    const api = installChrome();
    const user = userEvent.setup();
    render(<Popup />);
    await user.click(await screen.findByRole('button', { name: '현재 리스트: 업무 메일' }));
    await user.click(await screen.findByRole('menuitem', { name: '문장 전체 삭제' }));
    const dialog = await screen.findByRole('alertdialog');
    await waitFor(() => expect(within(dialog).getByRole('button', { name: '취소' })).toHaveFocus());
    api.storage.loseNextReply = true;
    await user.click(within(dialog).getByRole('button', { name: '삭제' }));
    expect(await screen.findByRole('button', { name: '저장 결과 확인' })).toBeVisible();
    expect(within(dialog).getByRole('button', { name: '삭제' })).toBeDisabled();
    const current = api.storage.data.cvState as ReturnType<typeof api.state>;
    current.lists[0]!.commands.push({ id: 'new-after-delete', text: '다른 창의 새 문장' });
    await user.click(screen.getByRole('button', { name: '저장 결과 확인' }));
    expect(await screen.findByText('다른 창의 새 문장')).toBeVisible();
    expect(api.set).toHaveBeenCalledTimes(1);
  });

  it('starts keyboard dragging and cancels without changing saved commands', async () => {
    const api = installChrome();
    const before = api.state();
    const user = userEvent.setup();
    render(<Popup />);
    const handle = await screen.findByRole('button', { name: '1번 Command 이동' });
    handle.focus();
    // jsdom has no Web Animations API; only the keyboard sensor needs it here.
    Object.defineProperty(document, 'getAnimations', { value: () => [], configurable: true });
    Object.defineProperty(Element.prototype, 'getAnimations', { value: () => [], configurable: true });
    try {
      await user.keyboard('[Space]');
      await waitFor(() => expect(handle).toHaveAttribute('aria-pressed', 'true'));
      await user.keyboard('[Escape]');
      await waitFor(() => expect(handle).not.toHaveAttribute('aria-pressed', 'true'));
    } finally {
      Reflect.deleteProperty(document, 'getAnimations');
      Reflect.deleteProperty(Element.prototype, 'getAnimations');
    }
    expect(api.state()).toEqual(before);
    expect(api.set).not.toHaveBeenCalled();
  });

  it('has named controls, traps dialog focus, restores Escape focus and passes semantic accessibility checks', async () => {
    installChrome();
    const user = userEvent.setup();
    render(<Popup />);
    const add = await screen.findByRole('button', { name: '문장 추가' });
    await user.click(add);
    const dialog = await screen.findByRole('dialog', { name: '문장 추가' });
    await waitFor(() => expect(screen.getByRole('textbox', { name: '내용' })).toHaveFocus());
    const close = within(dialog).getByRole('button', { name: '닫기' });
    const save = within(dialog).getByRole('button', { name: '저장' });
    await user.tab({ shift: true });
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    await waitFor(() => expect(save).toHaveFocus());
    await user.tab();
    await waitFor(() => expect(close).toHaveFocus());
    const result = await axe.run(document.body, { rules: { 'color-contrast': { enabled: false } } });
    // jsdom cannot measure contrast; browser checks cover real colors and motion.
    expect(result.violations).toEqual([]);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(add).toHaveFocus();
  });
});
