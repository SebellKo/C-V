import { useRef, useState } from 'react';
import {
  DragDropProvider,
  KeyboardSensor,
  PointerSensor,
} from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/react';
import { Accessibility, Feedback } from '@dnd-kit/dom';
import { arrayMove } from '@dnd-kit/helpers';
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { AppState, List, ListMetadata } from '../../shared/type.d.ts';
import { Button } from './ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu.tsx';
import type { ListDialogAction } from './ListDialog.tsx';

const dragAccessibility = Accessibility.configure({
  screenReaderInstructions: {
    draggable:
      'Space로 잡고 방향키로 이동한 뒤 Space로 놓으세요. Escape로 취소합니다.',
  },
  announcements: {
    dragstart: ({ operation }: DragStartEvent) =>
      `${operation.source?.data.name} 리스트를 잡았습니다.`,
    dragover: ({ operation }: DragOverEvent) =>
      operation.target
        ? `${operation.target.data.position}번 위치로 이동합니다.`
        : '목록 밖입니다. 놓으면 순서를 변경하지 않습니다.',
    dragend: ({ canceled, operation }: DragEndEvent) =>
      canceled
        ? '이동을 취소했습니다.'
        : operation.target && operation.source?.id !== operation.target.id
          ? '순서 변경을 요청했습니다.'
          : '순서를 변경하지 않았습니다.',
  },
});

type ListManagerProps = {
  snapshot: AppState;
  saving: boolean;
  onReorder: (lists: ListMetadata[]) => void;
  onDialog: (action: ListDialogAction, trigger: HTMLElement | null) => void;
};

export function ListManager({
  snapshot,
  saving,
  onReorder,
  onDialog,
}: ListManagerProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const { lists } = snapshot;
  const sourceIndex = lists.findIndex((list) => list.id === draggedId);

  function moveList(sourceId: string, targetId: string) {
    if (saving) return;
    const from = lists.findIndex((list) => list.id === sourceId);
    const to = lists.findIndex((list) => list.id === targetId);
    if (from < 0 || to < 0 || from === to) return;
    onReorder(arrayMove(lists, from, to).map(({ id, name }) => ({ id, name })));
  }

  return (
    <DragDropProvider
      sensors={[PointerSensor, KeyboardSensor]}
      plugins={(defaults) => [
        ...defaults,
        dragAccessibility,
        Feedback.configure({
          dropAnimation: { duration: 0 },
          keyboardTransition: null,
        }),
      ]}
      onBeforeDragStart={(event) => {
        if (saving) event.preventDefault();
      }}
      onDragStart={({ operation }) =>
        setDraggedId(String(operation.source?.id))
      }
      // DOM의 낙관적 정렬 대신 삽입 위치만 표시하고, 저장 응답으로 순서를 확정한다.
      onDragOver={(event) => {
        event.preventDefault();
        // 고정 Popup에서는 다음 키보드 이동 대상이 본문 밖에 가려질 수 있다.
        if (event.operation.activatorEvent instanceof KeyboardEvent) {
          event.operation.target?.element?.scrollIntoView({ block: 'nearest' });
        }
      }}
      onDragEnd={(event) => {
        setDraggedId(null);
        const { source, target } = event.operation;
        if (!event.canceled && source && target)
          moveList(String(source.id), String(target.id));
      }}
    >
      {lists.length === 0 ? (
        <section className="status-panel">
          <h2>저장된 리스트가 없습니다</h2>
          <p>아래 버튼으로 리스트를 추가해주세요.</p>
        </section>
      ) : (
        <ol className="list-manager" aria-label="리스트 목록">
          {lists.map((list, index) => (
            <ListRow
              key={list.id}
              list={list}
              index={index}
              sourceIndex={sourceIndex}
              current={list.id === snapshot.currentListId}
              saving={saving}
              dragging={draggedId !== null}
              onDialog={onDialog}
              onMove={(direction) => {
                const target = lists[index + direction];
                if (target) moveList(list.id, target.id);
              }}
              first={index === 0}
              last={index === lists.length - 1}
            />
          ))}
        </ol>
      )}
    </DragDropProvider>
  );
}

function ListRow({
  list,
  index,
  sourceIndex,
  current,
  saving,
  dragging,
  onDialog,
  onMove,
  first,
  last,
}: {
  list: List;
  index: number;
  sourceIndex: number;
  current: boolean;
  saving: boolean;
  dragging: boolean;
  onDialog: ListManagerProps['onDialog'];
  onMove: (direction: -1 | 1) => void;
  first: boolean;
  last: boolean;
}) {
  const { ref, handleRef, isDragSource, isDropTarget } = useSortable({
    id: list.id,
    index,
    data: { name: list.name, position: index + 1 },
    disabled: saving,
    transition: null,
  });
  const menuTrigger = useRef<HTMLButtonElement>(null);
  return (
    <li
      ref={ref}
      className="list-row"
      data-current={current || undefined}
      data-dragging={isDragSource || undefined}
      data-insert={
        isDropTarget && !isDragSource
          ? sourceIndex < index
            ? 'after'
            : 'before'
          : undefined
      }
    >
      <Button
        ref={handleRef}
        variant="ghost"
        size="compact"
        className="drag-handle"
        disabled={saving}
        focusableWhenDisabled
        aria-label={`${list.name} 리스트 이동`}
      >
        <GripVertical aria-hidden="true" />
      </Button>
      <div className="list-details">
        <strong title={list.name}>{list.name}</strong>
        <span>
          <kbd>⇧{(index + 1) % 10}</kbd> ·{' '}
          {current ? '현재 리스트' : `${list.commands.length} Commands`}
        </span>
      </div>
      <div className="row-actions">
        <Button
          variant="ghost"
          size="compact"
          disabled={saving || dragging}
          aria-label={`${list.name} 이름 변경`}
          onClick={(event) =>
            onDialog({ type: 'rename', list }, event.currentTarget)
          }
        >
          <Pencil aria-hidden="true" />
        </Button>
        <DropdownMenu disabled={saving || dragging}>
          <DropdownMenuTrigger
            ref={menuTrigger}
            render={<Button variant="ghost" size="compact" />}
            aria-label={`${list.name} 리스트 메뉴`}
          >
            <MoreHorizontal aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" aria-label={`${list.name} 관리`}>
            <DropdownMenuItem disabled={first} onClick={() => onMove(-1)}>
              <ArrowUp aria-hidden="true" />
              위로 이동
            </DropdownMenuItem>
            <DropdownMenuItem disabled={last} onClick={() => onMove(1)}>
              <ArrowDown aria-hidden="true" />
              아래로 이동
            </DropdownMenuItem>
            <DropdownMenuItem
              data-destructive
              onClick={() =>
                onDialog({ type: 'delete', list }, menuTrigger.current)
              }
            >
              <Trash2 aria-hidden="true" />
              리스트 삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}
