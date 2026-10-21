import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';

// shadcn Base UI/Nova 구조에서 사용하는 부분만 semantic CSS로 구성한다.
export const Dialog = DialogPrimitive.Root;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export function DialogContent(props: DialogPrimitive.Popup.Props) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="dialog-backdrop" />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className="dialog"
        {...props}
      />
    </DialogPrimitive.Portal>
  );
}
