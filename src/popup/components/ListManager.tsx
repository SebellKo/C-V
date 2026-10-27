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
import { Check, MoreHorizontal } from 'lucide-react';
import { t } from '../../shared/i18n.ts';
import type { AppState, List, ListMetadata } from '../../shared/type.d.ts';
import { Button } from './ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu.tsx';
import type { ListDialogAction } from './ListDialog.tsx';

const dragAccessibility = Accessibility.configure({
  screenReaderInstructions: {
    draggable: t('listDragInstructions'),
  },
  announcements: {
    dragstart: ({ operation }: DragStartEvent) =>
      t('listPickedUp', operation.source?.data.name),
    dragover: ({ operation }: DragOverEvent) =>
      operation.target
        ? t('listMoveTarget', String(operation.target.data.position))
        : t('dragOutside'),
    dragend: ({ canceled, operation }: DragEndEvent) =>
      canceled
        ? t('listDragCanceled')
        : operation.target && operation.source?.id !== operation.target.id
          ? t('listDragRequested')
          : t('dragUnchanged'),
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
          <h2>{t('noLists')}</h2>
        </section>
      ) : (
        <ol className="list-manager" aria-label={t('listCollection')}>
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
}: {
  list: List;
  index: number;
  sourceIndex: number;
  current: boolean;
  saving: boolean;
  dragging: boolean;
  onDialog: ListManagerProps['onDialog'];
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
      aria-current={current ? 'true' : undefined}
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
        aria-label={t('moveList', list.name)}
      >
        {(index + 1) % 10}
      </Button>
      <div className="list-details">
        <strong title={list.name}>{list.name}</strong>
        {current ? <Check className="current-mark" aria-hidden="true" /> : null}
      </div>
      <div className="row-actions">
        <DropdownMenu disabled={saving || dragging}>
          <DropdownMenuTrigger
            ref={menuTrigger}
            render={<Button variant="ghost" size="compact" />}
            aria-label={t('listMenu', list.name)}
          >
            <MoreHorizontal aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" aria-label={t('listActions', list.name)}>
            <DropdownMenuItem
              onClick={() => onDialog({ type: 'rename', list }, menuTrigger.current)}
            >
              {t('renameList')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              data-destructive
              onClick={() =>
                onDialog({ type: 'delete', list }, menuTrigger.current)
              }
            >
              {t('deleteList')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}
