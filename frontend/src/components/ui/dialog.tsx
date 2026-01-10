"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

const DialogContext = React.createContext<{ open: boolean }>({ open: false });

function useDialogContext() {
    const v = React.useContext(DialogContext);
    if (v === undefined) {
        throw new Error("useDialogContext must be used within a Dialog");
    }
    return v;
}

function Dialog({
    open: controlledOpen,
    defaultOpen,
    onOpenChange,
    children,
    ...rest
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
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
        <DialogPrimitive.Root open={open} onOpenChange={handleChange} {...rest}>
            <DialogContext.Provider value={{ open }}>
                {children}
            </DialogContext.Provider>
        </DialogPrimitive.Root>
    );
}

function DialogTrigger({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay asChild {...props}>
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
        </DialogPrimitive.Overlay>
    );
}

function DialogContent({
    className,
    children,
    showCloseButton = true,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
}) {
    const { open } = useDialogContext();
    React.useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    return (
        <DialogPortal data-slot="dialog-portal" forceMount>
            <AnimatePresence initial={false} mode="wait">
                {open && (
                    <>
                        <DialogOverlay key={"overlay"} />

                        <div className="fixed [perspective:800px] [transform-style:preserve-3d] inset-0 h-full w-full  flex items-center justify-center z-50">
                            <DialogPrimitive.Content asChild forceMount {...props}>
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
                                    {children}
                                    {showCloseButton && (
                                        <DialogPrimitive.Close
                                            data-slot="dialog-close"
                                            className="absolute right-4 top-4 rounded-xs opacity-80 transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 text-black dark:text-white"
                                        >
                                            <XIcon />
                                            <span className="sr-only">Close</span>
                                        </DialogPrimitive.Close>
                                    )}
                                </motion.div>
                            </DialogPrimitive.Content>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </DialogPortal>
    );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-header"
            className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
            {...props}
        />
    );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-footer"
            className={cn(
                "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
                className,
            )}
            {...props}
        />
    );
}

function DialogTitle({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            data-slot="dialog-title"
            className={cn("text-lg font-semibold leading-none", className)}
            {...props}
        />
    );
}

function DialogDescription({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
    return (
        <DialogPrimitive.Description
            data-slot="dialog-description"
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    );
}

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
    useDialogContext,
};
