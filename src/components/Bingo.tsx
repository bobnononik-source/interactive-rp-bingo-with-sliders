import { cn } from "@/utils/cn";
import { BINGO_POOL, type SheetState } from "@/data/sheet";

export function Bingo({
  state,
  toggle,
}: {
  state: SheetState;
  toggle: (id: number) => void;
}) {
  const marked = state.bingo;

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-2">
      {BINGO_POOL.map((cell) => {
        const on = marked.includes(cell.id);
        return (
          <button
            key={cell.id}
            type="button"
            onClick={() => toggle(cell.id)}
            aria-pressed={on}
            className={cn(
              "group flex cursor-pointer items-start gap-2.5 border-t py-2.5 text-left transition-colors",
              on ? "border-accent/50" : "border-line hover:border-ink/25",
            )}
          >
            <span
              className={cn(
                "mt-[5px] grid h-[11px] w-[11px] shrink-0 place-items-center rounded-full transition-all",
                on ? "dot-on" : "dot-off group-hover:shadow-[inset_0_0_0_1px_rgba(244,233,231,0.6)]",
              )}
            />
            <span className={cn("text-[12.5px] leading-snug", on ? "text-ink" : "text-muted group-hover:text-ink")}>
              {cell.text}
            </span>
          </button>
        );
      })}
    </div>
  );
}
