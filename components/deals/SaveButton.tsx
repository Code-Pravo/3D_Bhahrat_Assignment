"use client";

import { Bookmark } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsInterested, toggleInterest } from "@/store/slices/interestsSlice";

export function SaveButton({
  dealId,
  size = "md",
}: {
  dealId: string;
  size?: "sm" | "md";
}) {
  const dispatch = useAppDispatch();
  const isSaved = useAppSelector(selectIsInterested(dealId));

  const sizing = size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm";

  return (
    <button
      onClick={() => dispatch(toggleInterest(dealId))}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Remove from saved deals" : "Save deal to interests"}
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${sizing} ${
        isSaved
          ? "border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-800 dark:bg-brand-950/50 dark:text-brand-300"
          : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      }`}
    >
      <Bookmark
        className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
        aria-hidden
      />
      {isSaved ? "Saved" : "Save"}
    </button>
  );
}
