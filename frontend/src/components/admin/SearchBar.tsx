import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (value: string) => void;
  className?: string;
  delay?: number;
}

export default function SearchBar({
  onSearch,
  className,
  delay = 300,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // debounce
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), delay);
    return () => clearTimeout(handler);
  }, [query, delay]);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <div className="relative w-full sm:max-w-xl">
      <Input
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(
          "relative rounded-full pr-12 pl-5 py-2",
          "bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm",
          "border border-blue-500/80",
          "placeholder:text-blue-300 dark:placeholder:text-purple-300",
          "focus:outline-none transition-all duration-300 focus-visible:border-blue-500",
          className,
        )}
        onFocus={(e) => {
          (e.target as HTMLInputElement).style.boxShadow = `
            0 0 0 2px transparent,
            0 0 4px rgba(59,130,246,0.6),
            0 0 8px rgba(139,92,246,0.6)
          `;
        }}
        onBlur={(e) => {
          (e.target as HTMLInputElement).style.boxShadow = `
            0 0 0 2px transparent,
            0 0 0 rgba(59,130,246,0.3),
            0 0 0 rgba(139,92,246,0.3)
          `;
        }}
      />
      <Search
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5",
          "text-blue-400 dark:text-purple-400",
          "transition-transform duration-300 ease-out",
          query.length > 0 && "rotate-20 scale-125",
        )}
      />
    </div>
  );
}
