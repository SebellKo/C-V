import { Check, ChevronDown, Settings } from 'lucide-react';
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
  onManage,
}: {
  snapshot: AppState;
  disabled: boolean;
  onSelect: (listId: string) => void;
  onManage: () => void;
}) {
  const currentList = snapshot.lists.find(
    (list) => list.id === snapshot.currentListId,
  );
  return (
    <DropdownMenu disabled={disabled}>
      <DropdownMenuTrigger
        render={<Button className="list-trigger" variant="outline" />}
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
          {snapshot.lists.map((list, index) => (
            <DropdownMenuRadioItem key={list.id} value={list.id} closeOnClick>
              <span className="menu-label">
                {list.id === snapshot.currentListId ? (
                  <Check aria-hidden="true" />
                ) : null}
                <span>{list.name}</span>
              </span>
              <kbd>⇧{(index + 1) % 10}</kbd>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onManage}>
          <Settings aria-hidden="true" />
          리스트 관리
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
