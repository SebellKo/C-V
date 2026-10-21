import { useState } from 'react';
import {
  DragDropProvider,
  KeyboardSensor,
  PointerSensor,
} from '@dnd-kit/react';
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/react';
import { Accessibility, Feedback } from '@dnd-kit/dom';
import type { List } from '../../shared/type.d.ts';
import { CommandRow } from './CommandRow.tsx';
import type { CommandDialogAction } from './CommandDialog.tsx';

const dragAccessibility = Accessibility.configure({
  screenReaderInstructions: {
    draggable:
      'Space로 잡고 방향키로 교환 대상을 고른 뒤 Space로 놓으세요. Escape로 취소합니다.',
  },
  announcements: {
    dragstart: ({ operation }: DragStartEvent) =>
      `${operation.source?.data.position}번 Command를 잡았습니다.`,
    dragover: ({ operation }: DragOverEvent) =>
      operation.target
        ? `${operation.target.data.position}번 Command와 교환합니다.`
        : '목록 밖입니다. 놓으면 순서를 변경하지 않습니다.',
    dragend: ({ canceled, operation }: DragEndEvent) =>
      canceled
        ? '교환을 취소했습니다.'
        : operation.target && operation.source?.id !== operation.target.id
          ? 'Command 교환을 요청했습니다.'
          : '순서를 변경하지 않았습니다.',
  },
});

export function CommandContent({
  hasLists,
  list,
  saving,
  onSwap,
  onDialog,
}: {
  hasLists: boolean;
  list: List | undefined;
  saving: boolean;
  onSwap: (sourceId: string, targetId: string) => void;
  onDialog: (action: CommandDialogAction, trigger: HTMLElement | null) => void;
}) {
  const [dragging, setDragging] = useState(false);

  if (!list || list.commands.length === 0) {
    const title = !hasLists
      ? '리스트가 없습니다'
      : !list
        ? '리스트를 선택해주세요'
        : '저장된 문장이 없습니다';
    return (
      <section className="status-panel empty-state" aria-labelledby="empty-title">
        <h2 id="empty-title">{title}</h2>
      </section>
    );
  }

  return (
    <DragDropProvider
      sensors={[PointerSensor, KeyboardSensor]}
      plugins={(defaults) => [
        ...defaults,
        dragAccessibility,
        // null로 끄면 라이브러리의 키보드 포커스 복원도 생략되므로 duration만 0으로 둔다.
        Feedback.configure({
          dropAnimation: { duration: 0 },
          keyboardTransition: null,
        }),
      ]}
      onBeforeDragStart={(event) => {
        if (saving) event.preventDefault();
      }}
      onDragStart={() => setDragging(true)}
      onDragOver={(event) => {
        // 삽입 정렬을 막고 교환 대상만 표시한다. 저장 결과가 도착해야 순서를 바꾼다.
        event.preventDefault();
        if (event.operation.activatorEvent instanceof KeyboardEvent) {
          event.operation.target?.element?.scrollIntoView({ block: 'nearest' });
        }
      }}
      onDragEnd={(event) => {
        setDragging(false);
        const { source, target } = event.operation;
        if (
          !saving &&
          !event.canceled &&
          source &&
          target &&
          source.id !== target.id
        ) {
          onSwap(String(source.id), String(target.id));
        }
      }}
    >
      <ol className="command-list" aria-label="Command 목록">
        {list.commands.map((command, index) => (
          <CommandRow
            key={command.id}
            command={command}
            index={index}
            saving={saving}
            dragging={dragging}
            onEdit={(trigger) =>
              onDialog({ type: 'edit', list, command }, trigger)
            }
            onDelete={(trigger) =>
              onDialog({ type: 'delete', list, command }, trigger)
            }
          />
        ))}
      </ol>
    </DragDropProvider>
  );
}
