import type { Editor, Range } from "@tiptap/core";
import { posToDOMRect, ReactRenderer } from "@tiptap/react";
import {
    Heading1,
    Heading2,
    Heading3,
    ListOrdered,
    List,
    Code2,
    ChevronRight,
    Quote,
    ImageIcon,
    Minus,
    AlignLeft,
    AlignCenter,
    AlignRight,
    CodeSquare,
    TextQuote,
} from "lucide-react";
import { SlashCommandList } from "./command-list";
import { computePosition, flip, shift } from "@floating-ui/dom";

export interface CommandItemType {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    keywords: string;
    command: ({ editor, range }: { editor: Editor; range: Range }) => void;
    group: string;
}

type CommandGroupType = {
    group: string;
    items: Omit<CommandItemType, "group">[];
};

const groups: CommandGroupType[] = [
    {
        group: "Basic blocks",
        items: [
            {
                title: "Text",
                description: "Just start writing with plain text",
                icon: ChevronRight,
                keywords: "paragraph text",
                command: ({ editor, range }) =>
                    editor.chain().focus().deleteRange(range).run(),
            },
            {
                title: "Heading 1",
                description: "Large section heading",
                icon: Heading1,
                keywords: "h1 title header",
                command: ({ editor, range }) =>
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .toggleHeading({ level: 1 })
                        .run(),
            },
            {
                title: "Heading 2",
                description: "Medium section heading",
                icon: Heading2,
                keywords: "h2 subtitle",
                command: ({ editor, range }) =>
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .toggleHeading({ level: 2 })
                        .run(),
            },
            {
                title: "Heading 3",
                description: "Small section heading",
                icon: Heading3,
                keywords: "h3 subheader",
                command: ({ editor, range }) =>
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .toggleHeading({ level: 3 })
                        .run(),
            },
            {
                title: "Bullet List",
                description: "Create a simple bullet list",
                icon: List,
                keywords: "unordered ul bullets",
                command: ({ editor, range }) =>
                    editor.chain().focus().deleteRange(range).toggleBulletList().run(),
            },
            {
                title: "Numbered List",
                description: "Create a ordered list",
                icon: ListOrdered,
                keywords: "numbered ol",
                command: ({ editor, range }) =>
                    editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
            },
            {
                title: "Code Block",
                description: "Capture code snippets",
                icon: Code2,
                keywords: "code snippet pre",
                command: ({ editor, range }) =>
                    editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
            },
            {
                title: "Image",
                description: "Insert an image",
                icon: ImageIcon,
                keywords: "image picture photo",
                command: ({ editor, range }) =>
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .insertImagePlaceholder()
                        .run(),
            },
            {
                title: "Horizontal Rule",
                description: "Add a horizontal divider",
                icon: Minus,
                keywords: "horizontal rule divider",
                command: ({ editor, range }) =>
                    editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
            },
        ],
    },
    {
        group: "Inline",
        items: [
            {
                title: "Quote",
                description: "Capture a quotation",
                icon: Quote,
                keywords: "blockquote cite",
                command: ({ editor, range }) =>
                    editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
            },
            {
                title: "Code",
                description: "Inline code snippet",
                icon: CodeSquare,
                keywords: "code inline",
                command: ({ editor, range }) =>
                    editor.chain().focus().deleteRange(range).toggleCode().run(),
            },
            {
                title: "Blockquote",
                description: "Block quote",
                icon: TextQuote,
                keywords: "blockquote quote",
                command: ({ editor, range }) =>
                    editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
            },
        ],
    },
    {
        group: "Alignment",
        items: [
            {
                title: "Align Left",
                description: "Align text to the left",
                icon: AlignLeft,
                keywords: "align left",
                command: ({ editor, range }) =>
                    editor.chain().focus().deleteRange(range).setTextAlign("left").run(),
            },
            {
                title: "Align Center",
                description: "Center align text",
                icon: AlignCenter,
                keywords: "align center",
                command: ({ editor, range }) =>
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setTextAlign("center")
                        .run(),
            },
            {
                title: "Align Right",
                description: "Align text to the right",
                icon: AlignRight,
                keywords: "align right",
                command: ({ editor, range }) =>
                    editor.chain().focus().deleteRange(range).setTextAlign("right").run(),
            },
        ],
    },
];

const allItems: CommandItemType[] = groups.flatMap(
    (group) => group.items.map((item) => ({ ...item, group: group.group }))
);

const updatePosition = (editor: Editor, element: HTMLElement) => {
    const virtualElement = {
        getBoundingClientRect: () =>
            posToDOMRect(
                editor.view,
                editor.state.selection.from,
                editor.state.selection.to,
            ),
    };

    computePosition(virtualElement, element, {
        placement: "bottom-start",
        strategy: "absolute",
        middleware: [shift(), flip()],
    }).then(({ x, y, strategy }) => {
        element.style.width = "max-content";
        element.style.position = strategy;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    });
};

export const suggestion = {
    items: ({ query }: { query: string }) => {
        return allItems
            .filter((item) =>
                item.keywords.toLowerCase().includes(query.toLowerCase()),
            )
            .slice(0, 10);
    },

    render: () => {
        let component: ReactRenderer;

        return {
            onStart: (props) => {
                component = new ReactRenderer(SlashCommandList, {
                    // parent: this,
                    // propsData: props,
                    props,
                    editor: props.editor,
                });

                if (!props.clientRect) {
                    return;
                }

                component.element.style.position = "absolute";

                document.body.appendChild(component.element);

                updatePosition(props.editor, component.element);
            },

            onUpdate(props) {
                component.updateProps(props);

                if (!props.clientRect) {
                    return;
                }

                updatePosition(props.editor, component.element);
            },

            onKeyDown(props) {
                if (props.event.key === "Escape") {
                    component.destroy();
                    component.element.remove();

                    return true;
                }

                return component.ref?.onKeyDown(props);
            },

            onExit() {
                component.destroy();
                component.element.remove();
            },
        };
    },
};
