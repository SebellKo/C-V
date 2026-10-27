import { useEffect, useId, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { X } from 'lucide-react';
import { t } from '../../shared/i18n.ts';
import type { Command, List } from '../../shared/type.d.ts';
import { getErrorMessage } from '../errorMessage.ts';
import type { PopupMutation, usePopupState } from '../hooks/usePopupState.ts';
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
      ? t('addSnippet')
      : action.type === 'edit'
        ? t('editSnippet')
        : action.type === 'delete'
          ? t('deleteSnippetTitle')
          : t('clearSnippetsTitle');

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
              aria-label={t('close')}
            >
              <X aria-hidden="true" />
            </Button>
          </div>
          <div className="dialog-body">
            <DialogDescription className={deleting ? undefined : 'sr-only'}>
              {action.type === 'clear'
                ? t('clearSnippetsDescription', action.list.name)
                : action.type === 'delete'
                  ? t('deleteSnippetDescription', action.list.name)
                  : t('snippetContentHint')}
            </DialogDescription>
            {action.type === 'delete' ? (
              <div className="command-delete-preview">
                {action.command.text}
              </div>
            ) : null}
            {!deleting ? (
              <div className="field">
                <label htmlFor={fieldId}>{t('content')}</label>
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
                {t('checkSaveResult')}
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
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              variant={deleting ? 'destructive' : 'default'}
              disabled={saving || checkResult}
            >
              {saving ? t('saving') : deleting ? t('delete') : t('save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
