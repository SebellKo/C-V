import { useEffect, useId, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { X } from 'lucide-react';
import type { Command, List } from '../../shared/type.d.ts';
import { getErrorMessage } from '../errorMessage.ts';
import type { PopupMutation, usePopupState } from '../usePopupState.ts';
import { Button } from './ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog.tsx';

export type CommandDialogAction = { list: List } & (
  { type: 'create' | 'clear' } | { type: 'edit' | 'delete'; command: Command }
);

export function CommandDialog({
  action,
  saving,
  save,
  refresh,
  onClose,
  returnFocus,
  fallbackFocus,
}: {
  action: CommandDialogAction;
  saving: boolean;
  save: ReturnType<typeof usePopupState>['save'];
  refresh: ReturnType<typeof usePopupState>['refresh'];
  onClose: () => void;
  returnFocus: HTMLElement | null;
  fallbackFocus: RefObject<HTMLButtonElement | null>;
}) {
  const [open, setOpen] = useState(true);
  const [text, setText] = useState(
    action.type === 'edit' ? action.command.text : '',
  );
  const [error, setError] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const fieldId = useId();
  const deleting = action.type === 'delete' || action.type === 'clear';
  const title =
    action.type === 'create'
      ? 'Command 추가'
      : action.type === 'edit'
        ? 'Command 수정'
        : action.type === 'delete'
          ? 'Command를 삭제할까요?'
          : 'Command를 모두 삭제할까요?';

  useEffect(() => {
    if (error && !saving) (input.current ?? cancelButton.current)?.focus();
  }, [error, saving]);

  async function submit() {
    if (checkResult) return;
    setError(null);
    const listId = action.list.id;
    let request: PopupMutation;
    switch (action.type) {
      case 'create':
        request = { type: 'command.create', listId, text };
        break;
      case 'edit':
        request = {
          type: 'command.update',
          listId,
          commandId: action.command.id,
          text,
        };
        break;
      case 'delete':
        request = {
          type: 'command.delete',
          listId,
          commandId: action.command.id,
        };
        break;
      case 'clear':
        request = { type: 'command.clear', listId };
        break;
    }
    const response = await save(request);
    if (!response) return;
    if (response.ok) setOpen(false);
    else {
      setError(getErrorMessage(response.error));
      if (response.error === 'MESSAGE_UNAVAILABLE') setCheckResult(true);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!saving) setOpen(nextOpen);
      }}
      // 포커스 복원을 마친 뒤 부모가 대화상자를 제거한다.
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent
        role={deleting ? 'alertdialog' : 'dialog'}
        initialFocus={deleting ? cancelButton : input}
        finalFocus={() =>
          returnFocus?.isConnected &&
          !returnFocus.matches(':disabled, [data-disabled]')
            ? returnFocus
            : fallbackFocus.current
        }
      >
        <form
          className="dialog-form"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            if (!saving) void submit();
          }}
        >
          <div className="dialog-header">
            <DialogTitle>{title}</DialogTitle>
            <Button
              variant="ghost"
              size="compact"
              disabled={saving}
              onClick={() => setOpen(false)}
              aria-label="닫기"
            >
              <X aria-hidden="true" />
            </Button>
          </div>
          <div className="dialog-body">
            <DialogDescription>
              {action.type === 'clear'
                ? `‘${action.list.name}’의 Command를 모두 삭제합니다. 리스트는 유지되며 삭제한 내용은 되돌릴 수 없습니다.`
                : action.type === 'delete'
                  ? `‘${action.list.name}’에서 아래 Command를 삭제합니다. 뒤의 번호는 한 칸씩 당겨지며 삭제는 되돌릴 수 없습니다.`
                  : '앞뒤 공백과 줄바꿈은 입력한 그대로 보존합니다.'}
            </DialogDescription>
            {action.type === 'delete' ? (
              <div className="command-delete-preview">
                {action.command.text}
              </div>
            ) : null}
            {!deleting ? (
              <div className="field">
                <label htmlFor={fieldId}>Command 내용</label>
                <textarea
                  ref={input}
                  id={fieldId}
                  className="input command-textarea"
                  value={text}
                  disabled={saving}
                  aria-invalid={error !== null}
                  aria-describedby={error ? `${fieldId}-error` : undefined}
                  onChange={(event) => {
                    setText(event.target.value);
                    if (!checkResult) setError(null);
                  }}
                />
              </div>
            ) : null}
            {error ? (
              <p id={`${fieldId}-error`} className="inline-error" role="alert">
                {error}
              </p>
            ) : null}
            {checkResult ? (
              <Button
                variant="outline"
                disabled={saving}
                onClick={async () => {
                  const response = await refresh();
                  if (!response) return;
                  if (response.ok) setOpen(false);
                  else setError(getErrorMessage(response.error));
                }}
              >
                저장 결과 확인
              </Button>
            ) : null}
          </div>
          <div className="dialog-footer">
            <Button
              ref={cancelButton}
              variant="outline"
              disabled={saving}
              onClick={() => setOpen(false)}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant={deleting ? 'destructive' : 'default'}
              disabled={saving || checkResult}
            >
              {saving ? '저장 중…' : deleting ? '삭제' : '저장'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
