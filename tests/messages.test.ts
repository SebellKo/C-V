import { describe, expect, it } from 'vitest';
import { handleMessage } from '../src/background/dispatcher.ts';
import { sendMessage } from '../src/shared/messageClient.ts';
import { installChrome, sampleState } from './chrome.ts';

describe('Chrome message and storage integration', () => {
  it.each([null, {}, { type: 'unknown' }, { type: 'shortcut.command.get', position: 0 }, { type: 'shortcut.command.get', position: 1.5 }, { type: 'lists.updateMetadata', lists: [], expectedLists: [null] }])('rejects malformed payload %j before reading storage', async (request) => {
    const api = installChrome();
    expect(await handleMessage(request)).toEqual({ ok: false, error: 'INVALID_REQUEST' });
    expect(api.get).not.toHaveBeenCalled();
    expect(api.set).not.toHaveBeenCalled();
  });

  it('does not write an empty state on first read or overwrite an unsupported schema', async () => {
    const api = installChrome({});
    expect(await handleMessage({ type: 'state.get' })).toEqual({ ok: true, data: { schemaVersion: 1, currentListId: null, lists: [] } });
    api.storage.data = { cvState: { ...sampleState(), schemaVersion: 2 } };
    const before = structuredClone(api.storage.data);
    expect(await handleMessage({ type: 'list.create', name: '새 목록' })).toEqual({ ok: false, error: 'UNSUPPORTED_SCHEMA_VERSION' });
    expect(api.storage.data).toEqual(before);
    expect(api.set).not.toHaveBeenCalled();
  });

  it('serializes concurrent writes and waits for durable storage before reporting success', async () => {
    const api = installChrome();
    let release!: () => void;
    let entered!: () => void;
    const writing = new Promise<void>((resolve) => { entered = resolve; });
    const gate = new Promise<void>((resolve) => { release = resolve; });
    api.storage.beforeWrite = () => { entered(); return gate; };
    let completed = false;
    const first = handleMessage({ type: 'command.create', listId: 'mail', text: '동시 문장 A' }).then((r) => { completed = true; return r; });
    await writing;
    const second = handleMessage({ type: 'command.create', listId: 'mail', text: '동시 문장 B' });
    expect(completed).toBe(false);
    expect(api.state().lists[0]?.commands).toHaveLength(3);
    api.storage.beforeWrite = undefined;
    release();
    expect((await first).ok).toBe(true);
    expect((await second).ok).toBe(true);
    expect(api.state().lists[0]?.commands.slice(-2).map(({ text }) => text)).toEqual(['동시 문장 A', '동시 문장 B']);
  });

  it.each([['storage unavailable with private text', 'STORAGE_WRITE_ERROR'], ['QUOTA_BYTES exceeded', 'STORAGE_QUOTA_EXCEEDED']])('preserves data after %s and recovers for the next request', async (message, code) => {
    const api = installChrome();
    const before = api.state();
    api.storage.writeError = new Error(message);
    expect(await handleMessage({ type: 'command.clear', listId: 'mail' })).toEqual({ ok: false, error: code });
    expect(api.state()).toEqual(before);
    api.storage.writeError = null;
    expect((await handleMessage({ type: 'command.create', listId: 'mail', text: '복구 확인' })).ok).toBe(true);
  });

  it('returns positions and original text consistently through shortcut messages', async () => {
    const api = installChrome();
    expect(await handleMessage({ type: 'shortcut.command.get', position: 1 })).toMatchObject({ ok: true, data: { listName: '업무 메일', position: 1, text: sampleState().lists[0]?.commands[0]?.text } });
    const before = api.state();
    expect(await handleMessage({ type: 'shortcut.command.set', position: 7, text: '건너뛰기' })).toEqual({ ok: false, error: 'POSITION_NOT_FOUND' });
    expect(api.state()).toEqual(before);
    expect((await handleMessage({ type: 'shortcut.command.set', position: 4, text: '  새 문장\n  ' })).ok).toBe(true);
    expect(api.state().lists[0]?.commands[3]?.text).toBe('  새 문장\n  ');
  });

  it('treats a lost reply as unknown outcome without replaying the mutation', async () => {
    const api = installChrome();
    api.storage.loseNextReply = true;
    expect(await sendMessage({ type: 'command.swap', listId: 'mail', sourceId: 'intro', targetId: 'thanks' })).toEqual({ ok: false, error: 'MESSAGE_UNAVAILABLE' });
    expect(api.state().lists[0]?.commands.map(({ id }) => id)).toEqual(['thanks', 'review', 'intro']);
    expect((await sendMessage({ type: 'state.get' })).ok).toBe(true);
    expect(api.set).toHaveBeenCalledTimes(1);
  });
});
