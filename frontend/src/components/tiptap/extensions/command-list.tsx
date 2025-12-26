"use client";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Editor } from "@tiptap/core";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import type { CommandItemType } from "./suggestion";

interface SlashCommandListProps {
    items: CommandItemType[];
    command: (item: CommandItemType) => void;
    editor: Editor;
}

export const SlashCommandList = forwardRef(
    (props: SlashCommandListProps, ref) => {
        const [selectedIndex, setSelectedIndex] = useState(0);

        const selectItem = (index: number) => {
            const item = props.items[index];
            if (item) {
                props.command(item);
            }
        };

        useEffect(() => setSelectedIndex(0), [props.items]);

        useImperativeHandle(ref, () => ({
            onKeyDown: ({ event }: { event: KeyboardEvent }) => {
                if (event.key === "ArrowUp") {
                    setSelectedIndex(
                        (selectedIndex + props.items.length - 1) % props.items.length,
                    );
                    return true;
                }
                if (event.key === "ArrowDown") {
                    setSelectedIndex((selectedIndex + 1) % props.items.length);
                    return true;
                }
                if (event.key === "Enter") {
                    selectItem(selectedIndex);
                    return true;
                }
                return false;
            },
        }));

        if (props.items.length === 0) {
            return null;
        }

        const groupedItems = props.items.reduce(
            (groups, item) => {
                const group = groups.find((g) => g.title === item.group);
                if (group) {
                    group.items.push(item);
                } else {
                    groups.push({ title: item.group, items: [item] });
                }
                return groups;
            },
            [] as { title: string; items: CommandItemType[] }[],
        );

        return (
            <Command
                role="listbox"
                className="z-50 w-72 overflow-hidden rounded-lg border bg-popover shadow-lg"
            >
                <ScrollArea className="max-h-[330px]">
                    <CommandList>
                        <CommandEmpty className="py-3 text-center text-sm text-muted-foreground">
                            No results found
                        </CommandEmpty>
                        {groupedItems.map((group, groupIndex) => (
                            <CommandGroup
                                key={`${group.title}-${groupIndex}`}
                                heading={
                                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                        {group.title}
                                    </div>
                                }
                            >
                                {group.items.map((item, itemIndex) => {
                                    const flatIndex =
                                        groupedItems
                                            .slice(0, groupIndex)
                                            .reduce((acc, g) => acc + g.items.length, 0) + itemIndex;

                                    return (
                                        <CommandItem
                                            role="option"
                                            key={`${group.title}-${item.title}-${itemIndex}`}
                                            value={`${group.title}-${item.title}`}
                                            onSelect={() => selectItem(flatIndex)}
                                            className={cn(
                                                "gap-3 aria-selected:bg-accent/50",
                                                flatIndex === selectedIndex ? "bg-accent/50" : "",
                                            )}
                                            aria-selected={flatIndex === selectedIndex}
                                            tabIndex={flatIndex === selectedIndex ? 0 : -1}
                                        >
                                            <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background">
                                                <item.icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-1 flex-col">
                                                <span className="text-sm font-medium">
                                                    {item.title}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {item.description}
                                                </span>
                                            </div>
                                            <kbd className="ml-auto flex h-5 items-center rounded bg-muted px-1.5 text-xs text-muted-foreground">
                                                ↵
                                            </kbd>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </ScrollArea>
            </Command>
        );
    },
);

SlashCommandList.displayName = "SlashCommandList";
