import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  badge?: ReactNode;
}

export function Accordion({ items, defaultOpenId }: { items: AccordionItem[]; defaultOpenId?: string }) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? items[0]?.id ?? null);

  return (
    <div className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
      {items.map((item) => {
        const isOpen = item.id === openId;
        return (
          <div key={item.id}>
            <h3>
              <button
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 dark:hover:bg-slate-800"
              >
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {item.title}
                </span>
                <span className="flex items-center gap-2">
                  {item.badge}
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </span>
              </button>
            </h3>
            {isOpen && (
              <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}