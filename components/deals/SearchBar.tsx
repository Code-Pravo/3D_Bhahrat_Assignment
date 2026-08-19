"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * Debounced search input. Local raw input is kept in sync while the debounced
 * value is emitted via `onSearch` after a quiet period.
 */
export function SearchBar({
  onSearch,
  placeholder = "Search by company, industry or location…",
  className = "",
}: {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [raw, setRaw] = useState("");
  const debounced = useDebounce(raw, 350);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
      <input
        type="search"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder={placeholder}
        aria-label="Search deals"
        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
      {raw && (
        <button
          onClick={() => setRaw("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:text-slate-200"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}