import { useCallback, useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import {
  AXIS_GROUPS,
  BINGO_POOL,
  WORLD_AXES,
  emptyState,
  type SheetState,
} from "@/data/sheet";
import { AxisSlider, GhostBtn } from "@/components/controls";
import { Bingo } from "@/components/Bingo";
import { downloadCard } from "@/lib/card";

const STORAGE_KEY = "onplas-attitude-v4";
const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

function loadState(): SheetState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SheetState;
      const base = emptyState();
      const validIds = new Set(BINGO_POOL.map((b) => b.id));
      return {
        ...base,
        name: parsed.name ?? "",
        sliders: { ...base.sliders, ...parsed.sliders },
        bingo: (parsed.bingo ?? []).filter((id) => validIds.has(id)),
      };
    }
  } catch {
    /* ignore */
  }
  return emptyState();
}

export default function App() {
  const [state, setState] = useState<SheetState>(loadState);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* ignore */
      }
    }, 250);
    return () => window.clearTimeout(t);
  }, [state]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const setSlider = useCallback((id: string, v: number) => {
    setState((s) => {
      if (s.sliders[id] === v) return s;
      return { ...s, sliders: { ...s.sliders, [id]: v } };
    });
  }, []);

  const toggleBingo = useCallback((id: number) => {
    setState((s) => ({
      ...s,
      bingo: s.bingo.includes(id) ? s.bingo.filter((x) => x !== id) : [...s.bingo, id],
    }));
  }, []);

  const patch = useCallback((fn: (s: SheetState) => SheetState) => setState((s) => fn(s)), []);

  const done = WORLD_AXES.filter((a) => (state.sliders[a.id] ?? 50) !== 50).length;

  return (
    <div className="min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 70% at 50% -10%, #2b0a11 0%, #170609 45%, #0b0405 100%)",
        }}
      />

      <main className="mx-auto max-w-2xl px-5 pb-20">
        {/* ——— ник ——— */}
        <section className="pt-16 sm:pt-24">
          <input
            className="input-line text-center font-heading text-[22px] tracking-[0.06em] sm:text-[30px]"
            placeholder="Ник персонажа"
            value={state.name}
            onChange={(e) => patch((s) => ({ ...s, name: e.target.value }))}
            autoFocus
          />
        </section>

        {/* ——— шкалы ——— */}
        <div className="mt-10 border border-accent/50 bg-accent/10 px-4 py-3.5 text-center">
          <p className="text-[13.5px] leading-snug text-ink sm:text-[15px]">
            Если персонаж чего-то не знает или не пробовал —{" "}
            <span className="font-medium text-accent">оставляйте на 50</span>
          </p>
        </div>

        {AXIS_GROUPS.map((g, gi) => (
          <section key={g.id} className="mt-12">
            <div className="mb-7 flex items-baseline gap-3">
              <span className="font-heading text-[15px] font-medium text-accent tabular-nums">{ROMAN[gi]}</span>
              <h2 className="font-heading text-[14px] font-medium tracking-[0.22em] text-ink uppercase">{g.title}</h2>
            </div>

            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {WORLD_AXES.filter((a) => a.group === g.id).map((a) => (
                <div key={a.id}>
                  <h3 className="mb-1 text-[13.5px] text-ink">{a.label}</h3>
                  <AxisSlider axis={a} value={state.sliders[a.id] ?? 50} onChange={(v) => setSlider(a.id, v)} />
                </div>
              ))}
            </div>
            {gi === AXIS_GROUPS.length - 1 && (
              <p className="mt-6 text-right text-[11px] text-faint">заполнено {done} из {WORLD_AXES.length}</p>
            )}
          </section>
        ))}

        {/* ——— бинго ——— */}
        <section className="mt-14">
          <div className="mb-3 flex items-baseline gap-3">
            <span className="font-heading text-[15px] font-medium text-accent tabular-nums">{ROMAN[AXIS_GROUPS.length]}</span>
            <h2 className="font-heading text-[14px] font-medium tracking-[0.22em] text-ink uppercase">Бинго</h2>
            <span className="ml-auto text-[11px] text-faint">
              {state.bingo.length} из {BINGO_POOL.length}
            </span>
          </div>
          <p className="mb-5 text-[12.5px] text-faint">Отметь, что верно для персонажа сейчас</p>
          <Bingo state={state} toggle={toggleBingo} />
        </section>

        {/* ——— скачать ——— */}
        <div className="mt-14 flex justify-center">
          <GhostBtn
            main
            onClick={() => {
              downloadCard(state);
              setToast("Сохранено");
            }}
          >
            Скачать
          </GhostBtn>
        </div>
      </main>

      <div
        className={cn(
          "pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border border-line bg-bg px-4 py-2 text-[12.5px] text-ink transition-all duration-300",
          toast ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        )}
      >
        {toast}
      </div>
    </div>
  );
}
