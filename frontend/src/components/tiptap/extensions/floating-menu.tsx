// "use client";
//
// import {
//   Heading1,
//   Heading2,
//   Heading3,
//   ListOrdered,
//   List,
//   Code2,
//   ChevronRight,
//   Quote, ImageIcon,
//   Minus, AlignLeft,
//   AlignCenter,
//   AlignRight,
//   CodeSquare,
//   TextQuote
// } from "lucide-react";
// import { FloatingMenu } from "@tiptap/react/menus";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { cn } from "@/lib/utils";
// import type { Editor } from "@tiptap/core";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useDebounce } from "@/hooks/use-debounce";
//
// export function TipTapFloatingMenu({ editor }: { editor: Editor }) {
//   return (
//     <FloatingMenu
//       editor={editor}
//       shouldShow={({ state }) => {
//         if (!editor) return false;
//
//         const { $from } = state.selection;
//         const currentLineText = $from.parent.textBetween(
//           0,
//           $from.parentOffset,
//           "\n",
//           " "
//         );
//
//         const isSlashCommand =
//           currentLineText.startsWith("/") &&
//           $from.parent.type.name !== "codeBlock" &&
//           $from.parentOffset === currentLineText.length;
//
//         if (!isSlashCommand) {
//           if (isOpen) setIsOpen(false);
//           return false;
//         }
//
//         const query = currentLineText.slice(1).trim();
//         if (query !== search) setSearch(query);
//         if (!isOpen) setIsOpen(true);
//         return true;
//       }}
//       tippyOptions={{
//         placement: "bottom-start",
//         interactive: true,
//         appendTo: () => document.body,
//         onHide: () => {
//           setIsOpen(false);
//           setSelectedIndex(-1);
//         },
//       }}
//     >
//       <Command role="listbox" ref={commandRef} className="z-50 w-72 overflow-hidden rounded-lg border bg-popover shadow-lg">
//         <ScrollArea className="max-h-[330px]">
//           <CommandList>
//             <CommandEmpty className="py-3 text-center text-sm text-muted-foreground">
//               No results found
//             </CommandEmpty>
//
//             {filteredGroups.map((group, groupIndex) => (
//               <CommandGroup
//                 key={`${group.group}-${groupIndex}`}
//                 heading={
//                   <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
//                     {group.group}
//                   </div>
//                 }
//               >
//                 {group.items.map((item, itemIndex) => {
//                   const flatIndex =
//                     filteredGroups
//                       .slice(0, groupIndex)
//                       .reduce((acc, g) => acc + g.items.length, 0) + itemIndex;
//
//                   return (
//                     <CommandItem
//                       role="option"
//                       key={`${group.group}-${item.title}-${itemIndex}`}
//                       value={`${group.group}-${item.title}`}
//                       onSelect={() => executeCommand(item.command)}
//                       className={cn(
//                         "gap-3 aria-selected:bg-accent/50",
//                         flatIndex === selectedIndex ? "bg-accent/50" : ""
//                       )}
//                       aria-selected={flatIndex === selectedIndex}
//                       ref={(el) => {
//                         itemRefs.current[flatIndex] = el;
//                       }}
//                       tabIndex={flatIndex === selectedIndex ? 0 : -1}
//                     >
//                       <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background">
//                         <item.icon className="h-4 w-4" />
//                       </div>
//                       <div className="flex flex-1 flex-col">
//                         <span className="text-sm font-medium">
//                           {item.title}
//                         </span>
//                         <span className="text-xs text-muted-foreground">
//                           {item.description}
//                         </span>
//                       </div>
//                       <kbd className="ml-auto flex h-5 items-center rounded bg-muted px-1.5 text-xs text-muted-foreground">
//                         ↵
//                       </kbd>
//                     </CommandItem>
//                   );
//                 })}
//               </CommandGroup>
//             ))}
//           </CommandList>
//         </ScrollArea>
//       </Command>
//     </FloatingMenu>
//   );
// }
