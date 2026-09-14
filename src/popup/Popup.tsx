import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Copy,
  GripVertical,
  List as ListIcon,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Settings,
  TriangleAlert,
} from 'lucide-react';
import type { List } from '../shared/type.d.ts';
import { Button } from './components/ui/button.tsx';
import { ListSelector } from './components/ListSelector.tsx';
import { ListManager } from './components/ListManager.tsx';
import { ListDialog } from './components/ListDialog.tsx';
import type { ListDialogAction } from './components/ListDialog.tsx';
import { getErrorMessage } from './errorMessage.ts';
import { usePopupState } from './usePopupState.ts';
import type { ListMutation } from './usePopupState.ts';

export function Popup() {
  const { loadState, saving, save, reload } = usePopupState();
  const [managing, setManaging] = useState(false);
  const [dialog, setDialog] = useState<{
    action: ListDialogAction;
    trigger: HTMLElement | null;
  } | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    retry?: ListMutation;
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
    setDialog({ action, trigger });
  }

  async function saveFromScreen(request: ListMutation) {
    setFeedback(null);
    const response = await save(request);
    if (!response) return;
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
              onManage={() => setManaging(true)}
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
            role={feedback?.retry ? 'alert' : 'status'}
          >
            <p>{saving ? '저장 중…' : feedback?.message}</p>
            {!saving && feedback?.retry ? (
              <Button
                variant="outline"
                onClick={() => {
                  if (feedback.retry) void saveFromScreen(feedback.retry);
                }}
              >
                다시 시도
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
              void saveFromScreen({ type: 'lists.updateMetadata', lists });
            }}
            onDialog={openDialog}
          />
        ) : (
          <PopupContent hasLists={hasLists} currentList={currentList} />
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
        ) : (
          // Command 관리는 #75에서 연결한다.
          <Button className="button-full" disabled>
            {loadState.status === 'ready' ? <Plus aria-hidden="true" /> : null}
            Command 추가
          </Button>
        )}
      </footer>
      {dialog && snapshot ? (
        <ListDialog
          action={dialog.action}
          lists={snapshot.lists}
          saving={saving}
          save={save}
          onClose={() => setDialog(null)}
          returnFocus={dialog.trigger}
          fallbackFocus={navigationButton}
        />
      ) : null}
    </div>
  );
}

function PopupContent({
  hasLists,
  currentList,
}: {
  hasLists: boolean;
  currentList: List | undefined;
}) {
  if (currentList && currentList.commands.length > 0) {
    return (
      <ol className="command-list" aria-label="Command 목록">
        {currentList.commands.map((command, index) => (
          <li key={command.id} className="command-row">
            <Button
              variant="ghost"
              size="compact"
              disabled
              aria-label={`${index + 1}번 Command 이동`}
            >
              <GripVertical aria-hidden="true" />
            </Button>
            {/* 숫자 키 0은 10번 위치에 대응한다. */}
            <kbd className="command-number">{(index + 1) % 10}</kbd>
            <p>{command.text}</p>
            <Button
              variant="ghost"
              size="compact"
              disabled
              aria-label={`${index + 1}번 Command 메뉴`}
            >
              <MoreHorizontal aria-hidden="true" />
            </Button>
          </li>
        ))}
      </ol>
    );
  }

  const emptyState = !hasLists
    ? {
        Icon: Copy,
        title: '첫 리스트를 만들어보세요',
        description:
          '자주 사용하는 문장을 리스트별로 저장하고 숫자 단축키로 복사할 수 있습니다.',
      }
    : !currentList
      ? {
          Icon: ListIcon,
          title: '리스트를 선택해주세요',
          description: '선택한 리스트에 저장된 command가 여기에 표시됩니다.',
        }
      : {
          Icon: Plus,
          title: '저장된 command가 없습니다',
          description: '자주 사용하는 문장을 이 리스트에 저장해보세요.',
        };
  return (
    <section className="status-panel" aria-labelledby="empty-title">
      <span className="status-icon">
        <emptyState.Icon aria-hidden="true" />
      </span>
      <h2 id="empty-title">{emptyState.title}</h2>
      <p>{emptyState.description}</p>
    </section>
  );
}
