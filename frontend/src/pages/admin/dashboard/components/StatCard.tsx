import { cn } from "@/lib/utils";

interface StatCardProps {
    className?: string;
}

export default function StatCard({ className }: StatCardProps) {
    return (
        <div
            className={cn(
                "h-[100px] w-full rounded-3xl animate-pulse bg-zinc-200 dark:bg-neutral-800",
                className,
            )}
        >

        </div>
    );
}
