import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";

const AlertDialogContext = React.createContext<{ open: boolean }>({
    open: false,
});

function useAlertDialogContext() {
    const v = React.useContext(AlertDialogContext);
    if (v === undefined) {
        throw new Error("useAlertDialogContext must be used within a Dialog");
    }
    return v;
}

function AlertDialog({
    open: controlledOpen,
    defaultOpen,
    onOpenChange,
    children,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState<boolean>(
        defaultOpen ?? false,
    );
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? (controlledOpen as boolean) : uncontrolledOpen;

    const handleChange = (v: boolean) => {
        onOpenChange?.(v);
        if (!isControlled) setUncontrolledOpen(v);
    };

    return (
        <AlertDialogPrimitive.Root
            data-slot="alert-dialog"
            {...props}
            open={open}
            onOpenChange={handleChange}
        >
            <AlertDialogContext.Provider value={{ open }}>
                {children}
            </AlertDialogContext.Provider>
        </AlertDialogPrimitive.Root>
    );
}

function AlertDialogTrigger({
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
    return (
        <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
    );
}

function AlertDialogPortal({
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
    return (
        <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
    );
}

function AlertDialogOverlay({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
    return (
        <AlertDialogPrimitive.Overlay
            data-slot="alert-dialog-overlay"
            {...props}
            asChild
        >
            <motion.div
                data-slot="dialog-overlay"
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                    backdropFilter: "blur(5px)",
                }}
                exit={{
                    opacity: 0,
                    backdropFilter: "blur(0px)",
                }}
                className={`fixed inset-0 h-full w-full bg-black/20  z-50 ${className}`}
            />
        </AlertDialogPrimitive.Overlay>
    );
}

function AlertDialogContent({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
    const { open } = useAlertDialogContext();
    return (
        <AlertDialogPortal forceMount>
            <AnimatePresence initial={false} mode="wait">
                {open && (
                    <>
                        <AlertDialogOverlay key={"overlay"} />
                        <div className="fixed [perspective:800px] [transform-style:preserve-3d] inset-0 h-full w-full  flex items-center justify-center z-50">
                            <AlertDialogPrimitive.Content
                                data-slot="alert-dialog-content"
                                {...props}
                                forceMount={true}
                            >
                                <motion.div
                                    key={"content"}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.5,
                                        rotateX: 40,
                                        y: 40,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        rotateX: 0,
                                        y: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.8,
                                        rotateX: 10,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 15,
                                    }}
                                    className={cn(
                                        "fixed left-1/2 top-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-transparent bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-950 sm:max-w-lg md:max-w-[50%] min-h-[30%] max-h-[90%] overflow-hidden",
                                        className,
                                    )}
                                >
                                    {props.children}
                                </motion.div>
                            </AlertDialogPrimitive.Content>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </AlertDialogPortal>
    );
}

function AlertDialogHeader({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-dialog-header"
            className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
            {...props}
        />
    );
}

function AlertDialogFooter({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-dialog-footer"
            className={cn(
                "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
                className,
            )}
            {...props}
        />
    );
}

function AlertDialogTitle({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
    return (
        <AlertDialogPrimitive.Title
            data-slot="alert-dialog-title"
            className={cn("text-lg font-semibold", className)}
            {...props}
        />
    );
}

function AlertDialogDescription({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
    return (
        <AlertDialogPrimitive.Description
            data-slot="alert-dialog-description"
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    );
}

function AlertDialogAction({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
    return (
        <AlertDialogPrimitive.Action
            className={cn(buttonVariants(), className)}
            {...props}
        />
    );
}

function AlertDialogCancel({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
    return (
        <AlertDialogPrimitive.Cancel
            className={cn(buttonVariants({ variant: "outline" }), className)}
            {...props}
        />
    );
}

export {
    AlertDialog,
    AlertDialogPortal,
    AlertDialogOverlay,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
};
