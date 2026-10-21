import { useRef } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import type { AppState } from '../../shared/type.d.ts';
import { Button } from './ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu.tsx';

export function ListSelector({
  snapshot,
  disabled,
  onSelect,
  onClear,
  clearDisabled,
}: {
  snapshot: AppState;
  disabled: boolean;
  onSelect: (listId: string) => void;
  onClear: (trigger: HTMLElement | null) => void;
  clearDisabled: boolean;
}) {
  const currentList = snapshot.lists.find(
    (list) => list.id === snapshot.currentListId,
  );
  const menuTrigger = useRef<HTMLButtonElement>(null);
  return (
    <DropdownMenu disabled={disabled}>
      <DropdownMenuTrigger
        ref={menuTrigger}
        render={<Button className="list-trigger" variant="ghost" />}
        aria-label={
          currentList ? `현재 리스트: ${currentList.name}` : '현재 리스트 선택'
        }
      >
        <span>{currentList?.name ?? '리스트 선택'}</span>
        <ChevronDown aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent aria-label="리스트 선택">
        <DropdownMenuRadioGroup
          value={snapshot.currentListId ?? ''}
          onValueChange={onSelect}
        >
          {snapshot.lists.map((list) => (
            <DropdownMenuRadioItem key={list.id} value={list.id} closeOnClick>
              <span className="menu-label">
                <Check
                  aria-hidden="true"
                  className={list.id === snapshot.currentListId ? undefined : 'menu-check-hidden'}
                />
                <span>{list.name}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          data-destructive
          disabled={clearDisabled}
          onClick={() => onClear(menuTrigger.current)}
        >
          문장 전체 삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
