"use client";

import { ChevronDownIcon } from "lucide-react";

import { type FC, forwardRef } from "react";
import { AssistantModalPrimitive } from "@assistant-ui/react";

import { Thread } from "@/components/assistant-ui/thread";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { motion } from "motion/react";
import { IconMessageChatbot } from "@tabler/icons-react";

export const AssistantModal: FC = () => {
    return (
        <AssistantModalPrimitive.Root>
            <AssistantModalPrimitive.Anchor className="aui-root aui-modal-anchor fixed right-5 bottom-20 size-15">
                <AssistantModalPrimitive.Trigger asChild>
                    <AssistantModalButton />
                </AssistantModalPrimitive.Trigger>
            </AssistantModalPrimitive.Anchor>
            <AssistantModalPrimitive.Content
                sideOffset={16}
                className="aui-root aui-modal-content z-50 h-[600px] w-[600px] overflow-clip rounded-xl border bg-popover p-0 text-popover-foreground shadow-md outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-1/2 data-[state=closed]:slide-out-to-right-1/2 data-[state=closed]:zoom-out data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-1/2 data-[state=open]:slide-in-from-right-1/2 data-[state=open]:zoom-in [&>.aui-thread-root]:bg-inherit"
            >
                <Thread />
            </AssistantModalPrimitive.Content>
        </AssistantModalPrimitive.Root>
    );
};

type AssistantModalButtonProps = { "data-state"?: "open" | "closed" };

const AssistantModalButton = forwardRef<
    HTMLButtonElement,
    AssistantModalButtonProps
>(({ "data-state": state, ...rest }, ref) => {
    const tooltip = state === "open" ? "Close Assistant" : "Open Assistant";

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            whileFocus={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="size-full rounded-full"
        >
            <TooltipIconButton
                variant="default"
                tooltip={tooltip}
                side="left"
                {...rest}
                className="aui-modal-button size-full rounded-full shadow bg-blue-700 hover:bg-blue-400 backdrop-blur-lg"
                ref={ref}
            >
                <IconMessageChatbot
                    data-state={state}
                    className="aui-modal-button-closed-icon absolute size-6 transition-all data-[state=closed]:scale-100 data-[state=closed]:rotate-0 data-[state=open]:scale-0 data-[state=open]:rotate-90"
                />

                <ChevronDownIcon
                    data-state={state}
                    className="aui-modal-button-open-icon absolute size-6 transition-all data-[state=closed]:scale-0 data-[state=closed]:-rotate-90 data-[state=open]:scale-100 data-[state=open]:rotate-0"
                />
                <span className="aui-sr-only sr-only">{tooltip}</span>
            </TooltipIconButton>
        </motion.div>
    );
});

AssistantModalButton.displayName = "AssistantModalButton";
