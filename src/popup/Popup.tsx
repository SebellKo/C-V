import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Copy,
  GripVertical,
  List as ListIcon,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Settings,
  TriangleAlert,
} from 'lucide-react';
import { sendMessage } from '../shared/messageClient.ts';
import type { AppState, List, MessageErrorCode } from '../shared/type.d.ts';
import { Button } from './components/ui/button.tsx';

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; snapshot: AppState }
  | { status: 'error'; error: MessageErrorCode };

function getLoadErrorMessage(error: MessageErrorCode): string {
  switch (error) {
    case 'INVALID_STATE':
      return '저장된 데이터 형식을 확인할 수 없습니다. 기존 데이터는 변경하지 않았습니다.';
    case 'MESSAGE_UNAVAILABLE':
      return '확장 프로그램에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.';
    case 'STORAGE_ERROR':
      return '저장소에서 데이터를 읽지 못했습니다. 잠시 후 다시 시도해주세요.';
    default:
      return '데이터를 불러오지 못했습니다. 팝업을 다시 열거나 다시 시도해주세요.';
  }
}

export function Popup() {
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' });
  const [loadAttempt, setLoadAttempt] = useState(0);
  const retryButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadState({ status: 'loading' });

    void sendMessage({ type: 'state.get' }).then((response) => {
      // 닫힌 Popup이나 이전 조회의 응답은 현재 화면에 반영하지 않는다.
      if (cancelled) return;
      setLoadState(
        response.ok
          ? { status: 'ready', snapshot: response.data }
          : { status: 'error', error: response.error },
      );
    });

    return () => {
      cancelled = true;
    };
  }, [loadAttempt]);

  useEffect(() => {
    if (loadState.status === 'error') retryButton.current?.focus();
  }, [loadState.status]);

  const snapshot =
    loadState.status === 'ready' ? loadState.snapshot : undefined;
  const currentList = snapshot?.lists.find(
    (list) => list.id === snapshot.currentListId,
  );
  const hasLists = snapshot !== undefined && snapshot.lists.length > 0;

  return (
    <div className="popup-shell">
      <header className="popup-header">
        <h1 className="sr-only">C:V — 빠른 텍스트 복사</h1>
        {loadState.status === 'loading' ? (
          <div className="loading-header" aria-hidden="true">
            <span className="skeleton skeleton-select" />
            <span className="skeleton skeleton-icon" />
          </div>
        ) : hasLists ? (
          <>
            <Button
              className="list-trigger"
              variant="outline"
              disabled
              aria-label={
                currentList
                  ? `현재 리스트: ${currentList.name}`
                  : '현재 리스트 선택'
              }
            >
              <span>{currentList?.name ?? '리스트 선택'}</span>
              <ChevronDown aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled
              aria-label="리스트 관리"
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

      <main className="popup-content" tabIndex={0} aria-label="저장된 Command">
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
            <p>{getLoadErrorMessage(loadState.error)}</p>
          </section>
        ) : (
          <SnapshotContent hasLists={hasLists} currentList={currentList} />
        )}
      </main>

      <footer className="popup-footer">
        {loadState.status === 'error' ? (
          <Button
            ref={retryButton}
            variant="outline"
            className="button-full"
            onClick={() => setLoadAttempt((attempt) => attempt + 1)}
          >
            <RefreshCw aria-hidden="true" />
            다시 시도
          </Button>
        ) : (
          // 생성·선택·편집·DnD는 #74와 #75에서 연결한다.
          <Button className="button-full" disabled>
            {loadState.status === 'ready' ? <Plus aria-hidden="true" /> : null}
            {snapshot && !hasLists ? '리스트 만들기' : 'Command 추가'}
          </Button>
        )}
      </footer>
    </div>
  );
}

function SnapshotContent({
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
            <span className="command-number">{index + 1}</span>
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
