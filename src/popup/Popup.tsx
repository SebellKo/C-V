import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Plus,
  RefreshCw,
  Settings,
  TriangleAlert,
} from 'lucide-react';
import { t } from '../shared/i18n.ts';
import { Button } from './components/ui/button.tsx';
import { ListSelector } from './components/ListSelector.tsx';
import { ListManager } from './components/ListManager.tsx';
import { ListDialog } from './components/ListDialog.tsx';
import type { ListDialogAction } from './components/ListDialog.tsx';
import { getErrorMessage } from './errorMessage.ts';
import { usePopupState } from './hooks/usePopupState.ts';
import type { PopupMutation } from './hooks/usePopupState.ts';
import { CommandContent } from './components/CommandContent.tsx';
import { CommandDialog } from './components/CommandDialog.tsx';
import type { CommandDialogAction } from './components/CommandDialog.tsx';

export function Popup() {
  const { loadState, saving, selecting, save, reload, refresh } = usePopupState();
  const [managing, setManaging] = useState(false);
  const [dialog, setDialog] = useState<
    | ({ trigger: HTMLElement | null } & (
        | { kind: 'list'; action: ListDialogAction }
        | { kind: 'command'; action: CommandDialogAction }
      ))
    | null
  >(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    retry?: PopupMutation;
    refresh?: boolean;
  } | null>(null);
  const retryButton = useRef<HTMLButtonElement>(null);
  const navigationButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (loadState.status === 'error') retryButton.current?.focus();
  }, [loadState.status]);

  useEffect(() => {
    navigationButton.current?.focus();
  }, [managing]);

  const snapshot =
    loadState.status === 'ready' ? loadState.snapshot : undefined;
  const currentList = snapshot?.lists.find(
    (list) => list.id === snapshot.currentListId,
  );
  const hasLists = snapshot !== undefined && snapshot.lists.length > 0;

  function openDialog(action: ListDialogAction, trigger: HTMLElement | null) {
    setFeedback(null);
    setDialog({ kind: 'list', action, trigger });
  }

  function openCommandDialog(
    action: CommandDialogAction,
    trigger: HTMLElement | null,
  ) {
    setFeedback(null);
    setDialog({ kind: 'command', action, trigger });
  }

  async function saveFromScreen(request: PopupMutation) {
    setFeedback(null);
    const response = await save(request);
    if (!response) return;
    // 응답 유실 또는 metadata 충돌에서는 재전송 전에 최신 목록부터 확인한다.
    if (
      !response.ok &&
      (response.error === 'MESSAGE_UNAVAILABLE' ||
        response.error === 'LIST_METADATA_CONFLICT')
    ) {
      setFeedback({
        message: getErrorMessage(response.error),
        refresh: true,
      });
      return;
    }
    setFeedback(
      response.ok
        ? { message: t('saved') }
        : { message: getErrorMessage(response.error), retry: request },
    );
  }

  return (
    <div className="popup-shell" data-selecting={selecting || undefined}>
      <header className={`popup-header${managing ? ' page-header' : ''}`}>
        <h1 className="sr-only">{t('appTitle')}</h1>
        {managing ? (
          <>
            <Button
              ref={navigationButton}
              variant="ghost"
              size="icon"
              disabled={saving}
              aria-label={t('backToSnippets')}
              onClick={() => {
                setManaging(false);
                setFeedback(null);
              }}
            >
              <ArrowLeft aria-hidden="true" />
            </Button>
            <strong>{t('manageLists')}</strong>
            <span className="header-caption">
              {snapshot?.lists.length ?? 0}/10
            </span>
          </>
        ) : loadState.status === 'loading' ? (
          <div className="loading-header" aria-hidden="true">
            <span className="skeleton skeleton-select" />
            <span className="skeleton skeleton-icon" />
          </div>
        ) : snapshot && hasLists ? (
          <>
            <ListSelector
              snapshot={snapshot}
              disabled={saving}
              onSelect={(listId) => {
                void saveFromScreen({ type: 'list.select', listId });
              }}
              clearDisabled={!currentList || currentList.commands.length === 0}
              onClear={(trigger) => {
                if (currentList)
                  openCommandDialog({ type: 'clear', list: currentList }, trigger);
              }}
            />
            <Button
              ref={navigationButton}
              variant="ghost"
              size="icon"
              disabled={saving}
              aria-label={t('manageLists')}
              onClick={() => {
                setManaging(true);
                setFeedback(null);
              }}
            >
              <Settings aria-hidden="true" />
            </Button>
          </>
        ) : (
          <strong>C:V</strong>
        )}
      </header>

      <main
        className="popup-content"
        tabIndex={0}
        aria-label={managing ? t('manageLists') : t('savedSnippets')}
      >
        {!dialog && (saving || feedback) ? (
          <div
            className={
              (saving && !selecting) || feedback?.retry || feedback?.refresh
                ? 'save-feedback'
                : 'sr-only'
            }
            role={feedback?.retry || feedback?.refresh ? 'alert' : 'status'}
          >
            <p>{saving ? t('saving') : feedback?.message}</p>
            {!saving && (feedback?.retry || feedback?.refresh) ? (
              <Button
                variant="outline"
                onClick={() => {
                  if (feedback.refresh) {
                    setFeedback(null);
                    reload();
                  } else if (feedback.retry)
                    void saveFromScreen(feedback.retry);
                }}
              >
                {feedback.refresh ? t('reload') : t('retry')}
              </Button>
            ) : null}
          </div>
        ) : null}
        {loadState.status === 'loading' ? (
          <section
            className="skeleton-list"
            role="status"
            aria-label={t('loading')}
          >
            <div className="skeleton skeleton-row" aria-hidden="true" />
            <div className="skeleton skeleton-row" aria-hidden="true" />
            <div className="skeleton skeleton-row" aria-hidden="true" />
          </section>
        ) : loadState.status === 'error' ? (
          <section className="status-panel error-state" role="alert">
            <span className="status-icon">
              <TriangleAlert aria-hidden="true" />
            </span>
            <h2>{t('loadFailed')}</h2>
            <p>{getErrorMessage(loadState.error)}</p>
          </section>
        ) : managing ? (
          <ListManager
            snapshot={loadState.snapshot}
            saving={saving}
            onReorder={(lists) => {
              void saveFromScreen({
                type: 'lists.updateMetadata',
                expectedLists: loadState.snapshot.lists.map(({ id, name }) => ({
                  id,
                  name,
                })),
                lists,
              });
            }}
            onDialog={openDialog}
          />
        ) : (
          <CommandContent
            key={currentList?.id ?? 'unselected'}
            hasLists={hasLists}
            list={currentList}
            saving={saving}
            onSwap={(sourceId, targetId) => {
              if (currentList)
                void saveFromScreen({
                  type: 'command.swap',
                  listId: currentList.id,
                  sourceId,
                  targetId,
                });
            }}
            onDialog={openCommandDialog}
          />
        )}
      </main>

      <footer className="popup-footer">
        {loadState.status === 'error' ? (
          <Button
            ref={retryButton}
            variant="outline"
            className="button-full"
            onClick={reload}
          >
            <RefreshCw aria-hidden="true" />
            {t('retry')}
          </Button>
        ) : snapshot && (managing || !hasLists) ? (
          <Button
            className="button-full"
            disabled={saving || snapshot.lists.length >= 10}
            onClick={(event) =>
              openDialog({ type: 'create' }, event.currentTarget)
            }
          >
            <Plus aria-hidden="true" />
            {snapshot.lists.length >= 10
              ? t('limitReached')
              : hasLists || managing
                ? t('add')
                : t('createList')}
          </Button>
        ) : currentList ? (
          <Button
            className="button-full"
            aria-label={
              currentList.commands.length >= 10
                ? t('snippetLimit')
                : t('addSnippet')
            }
            disabled={saving || currentList.commands.length >= 10}
            onClick={(event) =>
              openCommandDialog(
                { type: 'create', list: currentList },
                event.currentTarget,
              )
            }
          >
            <Plus aria-hidden="true" />
            {currentList.commands.length >= 10 ? t('limitReached') : t('add')}
          </Button>
        ) : (
          <Button className="button-full" disabled aria-label={t('addSnippet')}>
            {loadState.status === 'ready' ? <Plus aria-hidden="true" /> : null}
            {t('add')}
          </Button>
        )}
      </footer>
      {dialog?.kind === 'list' && snapshot ? (
        <ListDialog
          action={dialog.action}
          lists={snapshot.lists}
          saving={saving}
          save={save}
          refresh={refresh}
          onClose={() => setDialog(null)}
          returnFocus={dialog.trigger}
          fallbackFocus={navigationButton}
        />
      ) : null}
      {dialog?.kind === 'command' ? (
        <CommandDialog
          action={dialog.action}
          saving={saving}
          save={save}
          refresh={refresh}
          onClose={() => setDialog(null)}
          returnFocus={dialog.trigger}
          fallbackFocus={navigationButton}
        />
      ) : null}
    </div>
  );
}
