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
}

export default function DeleteDialog({
    open,
    onOpenChange,
    onConfirm,
}: DeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="md:max-w-lg">
                <AlertDialogHeader className="items-center">
                    <AlertDialogTitle>
                        <div className="mb-2 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                            <OctagonAlert className="h-7 w-7 text-destructive" />
                        </div>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[15px] text-center">
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-2 sm:justify-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => onConfirm()}
                        className={
                            buttonVariants({ variant: "destructive" }) + " bg-rose-500"
                        }
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
