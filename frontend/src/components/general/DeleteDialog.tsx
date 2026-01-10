import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { OctagonAlert } from "lucide-react";

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
}

export default function DeleteDialog({
    open,
    onOpenChange,
    onConfirm,
    title,
    message,
}: DeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="md:max-w-lg">
                <>
                    <AlertDialogHeader className="items-center">
                        <AlertDialogTitle>
                            <div className="mb-2 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                                <OctagonAlert className="h-7 w-7 text-destructive" />
                            </div>
                            {title ? title : "Bạn có chắc chắn muốn xóa không?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[15px] text-center">
                            {message
                                ? message
                                : "Hành động này không thể hoàn tác. Dữ liệu bị xóa sẽ không thể khôi phục."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-2 sm:justify-center">
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => onConfirm()}
                            className={
                                buttonVariants({ variant: "destructive" }) + " bg-rose-500"
                            }
                        >
                            Tiếp tục
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </>
            </AlertDialogContent>
        </AlertDialog>
    );
}
