import { useDeleteDialogStore } from "@/stores/useDeleteDialogStore";
import DeleteDialog from "./DeleteDialog";

export const DeleteDialogGlobal = () => {
    const isOpen = useDeleteDialogStore((s) => s.isOpen);
    const title = useDeleteDialogStore((s) => s.title);
    const message = useDeleteDialogStore((s) => s.message);
    const closeDialog = useDeleteDialogStore((s) => s.closeDialog);
    const confirmAndClose = useDeleteDialogStore((s) => s.confirmAndClose);

    return (
        <DeleteDialog
            open={isOpen}
            onConfirm={confirmAndClose}
            onOpenChange={closeDialog}
            title={title}
            message={message}
        />
    );
};
