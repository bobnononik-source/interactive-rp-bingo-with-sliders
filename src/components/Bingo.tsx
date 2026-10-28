import { cn } from "@/utils/cn";
import { BINGO_POOL, BINGO_SIZE, type SheetState } from "@/data/sheet";
import { GhostBtn } from "./controls";

export function Bingo({
  state,
  toggle,
  reshuffle,
  clear,
}: {
  state: SheetState;
  toggle: (id: number) => void;
  reshuffle: () => void;
  clear: () => void;
}) {
  const card = state.bingoSet;
  const cells = card.map((id) => BINGO_POOL.find((b) => b.id === id) ?? { id: 0, text: "—" });
  const marked = state.bingo;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-[11px] tracking-[0.14em] text-faint uppercase">
          {marked.length} из {BINGO_SIZE * BINGO_SIZE}
        </span>
        <div className="flex gap-2">
          <GhostBtn onClick={reshuffle}>Другой набор</GhostBtn>
          <GhostBtn onClick={clear}>Очистить</GhostBtn>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-2">
        {cells.map((cell, i) => {
          const on = marked.includes(cell.id);
          return (
            <button
              key={`${cell.id}-${i}`}
              type="button"
              onClick={() => cell.id && toggle(cell.id)}
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
    </div>
  );
}
