import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Plus,
  RefreshCw,
  Settings,
  TriangleAlert,
  Trash2,
} from 'lucide-react';
import { Button } from './components/ui/button.tsx';
import { ListSelector } from './components/ListSelector.tsx';
import { ListManager } from './components/ListManager.tsx';
import { ListDialog } from './components/ListDialog.tsx';
import type { ListDialogAction } from './components/ListDialog.tsx';
import { getErrorMessage } from './errorMessage.ts';
import { usePopupState } from './usePopupState.ts';
import type { PopupMutation } from './usePopupState.ts';
import { CommandContent } from './components/CommandContent.tsx';
import { CommandDialog } from './components/CommandDialog.tsx';
import type { CommandDialogAction } from './components/CommandDialog.tsx';

export function Popup() {
  const { loadState, saving, save, reload, refresh } = usePopupState();
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
        ? { message: '저장했습니다.' }
        : { message: getErrorMessage(response.error), retry: request },
    );
  }

  return (
    <div className="popup-shell">
      <header className="popup-header">
        <h1 className="sr-only">C:V — 빠른 텍스트 복사</h1>
        {managing ? (
          <>
            <Button
              ref={navigationButton}
              variant="ghost"
              size="icon"
              disabled={saving}
              aria-label="Command 목록으로 돌아가기"
              onClick={() => {
                setManaging(false);
                setFeedback(null);
              }}
            >
              <ArrowLeft aria-hidden="true" />
            </Button>
            <strong>리스트 관리</strong>
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
              onManage={() => {
                setManaging(true);
                setFeedback(null);
              }}
            />
            <Button
              ref={navigationButton}
              variant="ghost"
              size="icon"
              disabled={saving}
              aria-label="리스트 관리"
              onClick={() => {
                setManaging(true);
                setFeedback(null);
              }}
            >
              <Settings aria-hidden="true" />
            </Button>
          </>
        ) : (
          <>
            <strong>C:V</strong>
            <span className="header-caption">
              {loadState.status === 'error'
                ? '데이터를 불러오지 못함'
                : '빠른 텍스트 복사'}
            </span>
          </>
        )}
      </header>

      <main
        className="popup-content"
        tabIndex={0}
        aria-label={managing ? '리스트 관리' : '저장된 Command'}
      >
        {!dialog && (saving || feedback) ? (
          <div
            className="save-feedback"
            role={feedback?.retry || feedback?.refresh ? 'alert' : 'status'}
          >
            <p>{saving ? '저장 중…' : feedback?.message}</p>
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
                {feedback.refresh ? '다시 불러오기' : '다시 시도'}
              </Button>
            ) : null}
          </div>
        ) : null}
        {loadState.status === 'loading' ? (
          <section
            className="skeleton-list"
            role="status"
            aria-label="불러오는 중"
          >
            <div className="skeleton skeleton-row" aria-hidden="true" />
            <div className="skeleton skeleton-row" aria-hidden="true" />
            <div className="skeleton skeleton-row" aria-hidden="true" />
            <p className="loading-copy">
              <span className="spinner" aria-hidden="true" />
              저장된 command를 불러오고 있습니다.
            </p>
          </section>
        ) : loadState.status === 'error' ? (
          <section className="status-panel error-state" role="alert">
            <span className="status-icon">
              <TriangleAlert aria-hidden="true" />
            </span>
            <h2>저장된 데이터를 불러오지 못했습니다</h2>
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
            다시 시도
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
              ? '리스트는 최대 10개입니다'
              : hasLists || managing
                ? '리스트 추가'
                : '리스트 만들기'}
          </Button>
        ) : currentList ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              disabled={saving || currentList.commands.length === 0}
              aria-label="현재 리스트의 Command 전체 삭제"
              onClick={(event) =>
                openCommandDialog(
                  { type: 'clear', list: currentList },
                  event.currentTarget,
                )
              }
            >
              <Trash2 aria-hidden="true" />
            </Button>
            <Button
              className="button-grow"
              disabled={saving || currentList.commands.length >= 10}
              onClick={(event) =>
                openCommandDialog(
                  { type: 'create', list: currentList },
                  event.currentTarget,
                )
              }
            >
              <Plus aria-hidden="true" />
              {currentList.commands.length >= 10
                ? 'Command는 최대 10개입니다'
                : 'Command 추가'}
            </Button>
          </>
        ) : (
          <Button className="button-full" disabled>
            {loadState.status === 'ready' ? <Plus aria-hidden="true" /> : null}
            Command 추가
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
