import { useEffect, useId, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { X } from 'lucide-react';
import type { List } from '../../shared/type.d.ts';
import { getErrorMessage } from '../errorMessage.ts';
import type { usePopupState } from '../usePopupState.ts';
import { Button } from './ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog.tsx';
import { Input } from './ui/input.tsx';

export type ListDialogAction =
  | { type: 'create' }
  | { type: 'rename'; list: List }
  | { type: 'delete'; list: List };

export function ListDialog({
  action,
  lists,
  saving,
  save,
  refresh,
  onClose,
  returnFocus,
  fallbackFocus,
}: {
  action: ListDialogAction;
  lists: List[];
  saving: boolean;
  save: ReturnType<typeof usePopupState>['save'];
  refresh: ReturnType<typeof usePopupState>['refresh'];
  onClose: () => void;
  returnFocus: HTMLElement | null;
  fallbackFocus: RefObject<HTMLButtonElement | null>;
}) {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState(
    action.type === 'rename' ? action.list.name : '',
  );
  const [error, setError] = useState<string | null>(null);
  const [recovery, setRecovery] = useState<'refresh' | 'check' | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const fieldId = useId();
  const deleting = action.type === 'delete';
  const title =
    action.type === 'create'
      ? '리스트 만들기'
      : action.type === 'rename'
        ? '리스트 이름 변경'
        : '리스트를 삭제할까요?';

  useEffect(() => {
    // 실패 후 disabled가 해제된 DOM에 포커스를 돌려 입력을 바로 고칠 수 있게 한다.
    if (!saving && (error || recovery === null))
      (input.current ?? cancelButton.current)?.focus();
  }, [error, saving, recovery]);

  async function submit() {
    if (recovery) return;
    setError(null);
    if (
      action.type !== 'create' &&
      !lists.some((list) => list.id === action.list.id)
    ) {
      setError(getErrorMessage('LIST_NOT_FOUND'));
      return;
    }
    // Command snapshot은 보내지 않는다. Background가 최신 Command를 보존한다.
    const response = await save(
      action.type === 'create'
        ? { type: 'list.create', name }
        : {
            type: 'lists.updateMetadata',
            expectedLists: lists.map(({ id, name }) => ({ id, name })),
            lists: lists
              .filter(
                (list) =>
                  action.type !== 'delete' || list.id !== action.list.id,
              )
              .map((list) => ({
                id: list.id,
                name:
                  action.type === 'rename' && list.id === action.list.id
                    ? name
                    : list.name,
              })),
          },
    );
    if (!response) return;
    if (response.ok) {
      setOpen(false);
    } else {
      setError(getErrorMessage(response.error));
      if (response.error === 'LIST_METADATA_CONFLICT') setRecovery('refresh');
      if (response.error === 'MESSAGE_UNAVAILABLE') setRecovery('check');
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!saving) setOpen(nextOpen);
      }}
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
              {deleting
                ? `‘${action.list.name}’와 저장된 Command ${action.list.commands.length}개를 함께 삭제합니다. 되돌릴 수 없습니다.`
                : action.type === 'rename'
                  ? `현재 이름: ${lists.find((list) => list.id === action.list.id)?.name ?? '삭제된 리스트'}. 이름은 앞뒤 공백을 제외하고 1자 이상 100자 이하로 입력해주세요.`
                  : '이름은 앞뒤 공백을 제외하고 1자 이상 100자 이하로 입력해주세요.'}
            </DialogDescription>
            {!deleting ? (
              <div className="field">
                <label htmlFor={fieldId}>리스트 이름</label>
                <Input
                  ref={input}
                  id={fieldId}
                  value={name}
                  disabled={saving}
                  aria-invalid={error !== null}
                  aria-describedby={error ? `${fieldId}-error` : undefined}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (!recovery) setError(null);
                  }}
                  onKeyDown={(event) => {
                    // 한글 조합 확정 Enter가 저장까지 실행되지 않게 한다.
                    if (
                      event.key === 'Enter' &&
                      (event.nativeEvent.isComposing || event.keyCode === 229)
                    )
                      event.preventDefault();
                  }}
                />
                <small>{name.trim().length}/100자</small>
              </div>
            ) : null}
            {error ? (
              <p id={`${fieldId}-error`} className="inline-error" role="alert">
                {error}
              </p>
            ) : null}
            {recovery ? (
              <Button
                variant="outline"
                disabled={saving}
                onClick={async () => {
                  const response = await refresh();
                  if (!response) return;
                  if (response.ok) {
                    if (recovery === 'check') setOpen(false);
                    else {
                      setRecovery(null);
                      setError(null);
                    }
                  } else setError(getErrorMessage(response.error));
                }}
              >
                {recovery === 'check' ? '저장 결과 확인' : '최신 목록 불러오기'}
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
              disabled={saving || recovery !== null}
            >
              {saving ? '저장 중…' : deleting ? '리스트 삭제' : '저장'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
