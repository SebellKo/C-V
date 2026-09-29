import { useRef } from 'react';
import { useSortable } from '@dnd-kit/react/sortable';
import {
  defaultCollisionDetection,
  pointerIntersection,
} from '@dnd-kit/collision';
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { Command } from '../../shared/type.d.ts';
import { Button } from './ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu.tsx';

export function CommandRow({
  command,
  index,
  saving,
  dragging,
  first,
  last,
  onMove,
  onEdit,
  onDelete,
}: {
  command: Command;
  index: number;
  saving: boolean;
  dragging: boolean;
  first: boolean;
  last: boolean;
  onMove: (direction: -1 | 1) => void;
  onEdit: (trigger: HTMLElement | null) => void;
  onDelete: (trigger: HTMLElement | null) => void;
}) {
  const { ref, handleRef, isDragSource, isDropTarget } = useSortable({
    collisionDetector: (args) => {
      if (args.dragOperation.activatorEvent instanceof KeyboardEvent) {
        return defaultCollisionDetection(args);
      }
      // 스크롤로 가려진 행이나 목록 밖에 놓으면 취소한다.
      const { x, y } = args.dragOperation.position.current;
      if (!document.elementFromPoint(x, y)?.closest('.command-row')) return null;
      return pointerIntersection(args);
    },
    id: command.id,
    index,
    data: { position: index + 1 },
    disabled: saving,
    transition: null,
  });
  const menuTrigger = useRef<HTMLButtonElement>(null);
  return (
    <li
      ref={ref}
      className="command-row"
      data-dragging={isDragSource || undefined}
      data-swap-target={(isDropTarget && !isDragSource) || undefined}
    >
      <Button
        ref={handleRef}
        variant="ghost"
        size="compact"
        className="drag-handle"
        disabled={saving}
        // 저장 중에도 dnd-kit이 이동한 핸들로 키보드 포커스를 복원할 수 있게 한다.
        focusableWhenDisabled
        aria-label={`${index + 1}번 Command 이동`}
      >
        <GripVertical aria-hidden="true" />
      </Button>
      <kbd className="command-number">{(index + 1) % 10}</kbd>
      <p>{command.text}</p>
      <DropdownMenu disabled={saving || dragging}>
        <DropdownMenuTrigger
          ref={menuTrigger}
          render={<Button variant="ghost" size="compact" />}
          aria-label={`${index + 1}번 Command 메뉴`}
        >
          <MoreHorizontal aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          aria-label={`${index + 1}번 Command 관리`}
        >
          <DropdownMenuItem onClick={() => onEdit(menuTrigger.current)}>
            <Pencil aria-hidden="true" />
            내용 수정
          </DropdownMenuItem>
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
            onClick={() => onDelete(menuTrigger.current)}
          >
            <Trash2 aria-hidden="true" />
            Command 삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}
