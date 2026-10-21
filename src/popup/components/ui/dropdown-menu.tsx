import { Menu as MenuPrimitive } from '@base-ui/react/menu';

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;
export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup;

// shadcn Base UI/Nova의 portal/positioner 구조를 고정 크기 Popup에 맞춘다.
export function DropdownMenuContent({
  align = 'start',
  ...props
}: MenuPrimitive.Popup.Props & Pick<MenuPrimitive.Positioner.Props, 'align'>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="menu-positioner"
        sideOffset={4}
        align={align}
        collisionPadding={8}
      >
        <MenuPrimitive.Popup className="dropdown-menu" {...props} />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

export function DropdownMenuItem(props: MenuPrimitive.Item.Props) {
  return <MenuPrimitive.Item className="menu-item" {...props} />;
}

export function DropdownMenuRadioItem(props: MenuPrimitive.RadioItem.Props) {
  return <MenuPrimitive.RadioItem className="menu-item" {...props} />;
}

export function DropdownMenuSeparator() {
  return <MenuPrimitive.Separator className="menu-separator" />;
}
