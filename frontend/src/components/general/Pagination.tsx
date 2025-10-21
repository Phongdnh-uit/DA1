"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
}

interface PageItem {
    render: React.ReactNode;
    onChange: () => void;
}

export default function PaginationTabs({
    currentPage,
    totalPages,
    onPageChange,
}: Props) {
    const getPageNumbers = () => {
        const pages: PageItem[] = [];
        const lastPageIndex = totalPages - 1;

        if (totalPages <= 7) {
            for (let i = 0; i < totalPages; i++)
                pages.push({
                    render: i + 1,
                    onChange: () => onPageChange && onPageChange(i),
                });
        } else {
            if (currentPage <= 1) {
                // pages.push(0, 1, 2, "...", lastPageIndex);
                pages.push(
                    { render: 1, onChange: () => onPageChange && onPageChange(0) },
                    { render: 2, onChange: () => onPageChange && onPageChange(1) },
                    { render: 3, onChange: () => onPageChange && onPageChange(2) },
                    { render: "...", onChange: () => onPageChange && onPageChange(3) },
                    {
                        render: lastPageIndex + 1,
                        onChange: () => onPageChange && onPageChange(lastPageIndex),
                    },
                );
            } else if (currentPage >= lastPageIndex - 1) {
                pages.push(
                    { render: 1, onChange: () => onPageChange && onPageChange(0) },
                    {
                        render: "...",
                        onChange: () => onPageChange && onPageChange(lastPageIndex - 3),
                    },
                    {
                        render: lastPageIndex - 1,
                        onChange: () => onPageChange && onPageChange(lastPageIndex - 2),
                    },
                    {
                        render: lastPageIndex,
                        onChange: () => onPageChange && onPageChange(lastPageIndex - 1),
                    },
                    {
                        render: lastPageIndex + 1,
                        onChange: () => onPageChange && onPageChange(lastPageIndex),
                    },
                );
            } else {
                pages.push(
                    { render: 1, onChange: () => onPageChange && onPageChange(0) },
                    {
                        render: "...",
                        onChange: () => onPageChange && onPageChange(currentPage - 2),
                    },
                    {
                        render: currentPage,
                        onChange: () => onPageChange && onPageChange(currentPage - 1),
                    },
                    {
                        render: currentPage + 1,
                        onChange: () => onPageChange && onPageChange(currentPage),
                    },
                    {
                        render: currentPage + 2,
                        onChange: () => onPageChange && onPageChange(currentPage + 1),
                    },
                    {
                        render: "...",
                        onChange: () => onPageChange && onPageChange(currentPage + 2),
                    },
                    {
                        render: lastPageIndex + 1,
                        onChange: () => onPageChange && onPageChange(lastPageIndex),
                    },
                );
            }
        }

        return pages;
    };

    const pages = getPageNumbers();
    return (
        <>
            <div className="hidden items-center rounded-full px-0.5 shadow-sm ring-1 ring-inset ring-slate-200 dark:shadow-sm dark:ring-slate-800 sm:inline-flex h-10">
                <TextButton
                    onClick={() => onPageChange && onPageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className={"group"}
                >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft
                        className="size-5 text-slate-500 group-hover:text-slate-900 dark:text-slate-400 group-hover:dark:text-slate-50"
                        aria-hidden={true}
                    />
                </TextButton>
                <span
                    className="h-5 border-r border-slate-200 dark:border-slate-800"
                    aria-hidden={true}
                />
                <div className="flex items-center gap-2">
                    {pages.map((page, index) => (
                        <NumberButton
                            key={index}
                            onClick={() => page.onChange()}
                            active={page.render === currentPage + 1}
                        >
                            {page.render}
                        </NumberButton>
                    ))}
                </div>
                <span className="h-5 border-r border-slate-200 dark:border-slate-800" />
                <TextButton
                    onClick={() => onPageChange && onPageChange(currentPage + 1)}
                    disabled={!(totalPages - 1 > currentPage)}
                    className="group"
                >
                    <span className="sr-only">Next</span>
                    <ChevronRight
                        className="size-5 text-slate-500 group-hover:text-slate-900 dark:text-slate-400 group-hover:dark:text-slate-50"
                        aria-hidden={true}
                    />
                </TextButton>
            </div>
        </>
    );
}

const TextButton = ({
    onClick,
    disabled,
    children,
    className,
}: {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <button
            type="button"
            className={cn(
                "group rounded-md p-2 text-base text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-50",
                className,
            )}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

const NumberButton = ({
    active,
    onClick,
    children,
    position,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    position?: "left" | "right";
}) => {
    return (
        <button
            type="button"
            className={cn(
                "min-w-[30px] border-b-2 p-2 text-base text-zinc-900 dark:text-zinc-50 hover:cursor-pointer",
                active
                    ? "border-blue-500 font-semibold dark:border-blue-500"
                    : "border-transparent hover:border-slate-200 hover:dark:border-slate-800",
                position === "left"
                    ? "rounded-l-md"
                    : position === "right"
                        ? "rounded-r-md"
                        : "",
            )}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

// const MobileButton = ({
//     onClick,
//     disabled,
//     children,
// }: {
//     onClick: () => void;
//     disabled: boolean;
//     children: React.ReactNode;
// }) => {
//     return (
//         <button
//             type="button"
//             className="group px-2.5 py-2 text-tremor-default disabled:cursor-not-allowed disabled:opacity-50"
//             onClick={onClick}
//             disabled={disabled}
//         >
//             {children}
//         </button>
//     );
// };
