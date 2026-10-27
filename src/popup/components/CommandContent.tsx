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
import { t } from '../../shared/i18n.ts';
import type { List } from '../../shared/type.d.ts';
import { CommandRow } from './CommandRow.tsx';
import type { CommandDialogAction } from './CommandDialog.tsx';

const dragAccessibility = Accessibility.configure({
  screenReaderInstructions: {
    draggable: t('snippetDragInstructions'),
  },
  announcements: {
    dragstart: ({ operation }: DragStartEvent) =>
      t('snippetPickedUp', String(operation.source?.data.position)),
    dragover: ({ operation }: DragOverEvent) =>
      operation.target
        ? t('snippetSwapTarget', String(operation.target.data.position))
        : t('dragOutside'),
    dragend: ({ canceled, operation }: DragEndEvent) =>
      canceled
        ? t('snippetDragCanceled')
        : operation.target && operation.source?.id !== operation.target.id
          ? t('snippetDragRequested')
          : t('dragUnchanged'),
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
      ? t('noLists')
      : !list
        ? t('selectListPrompt')
        : t('noSnippets');
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
      <ol className="command-list" aria-label={t('snippetCollection')}>
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
