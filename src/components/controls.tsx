import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { clamp, type Axis } from "@/data/sheet";

export function AxisSlider({
  axis,
  value,
  onChange,
  accent = true,
}: {
  axis: Axis;
  value: number;
  onChange: (v: number) => void;
  accent?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(false);
  const live = dragging || hover;
  const pct = clamp(value);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const setFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    onChangeRef.current(clamp(Math.round(((clientX - r.left) / r.width) * 100)));
  }, []);

  const stopDrag = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    document.body.classList.remove("is-dragging");
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      setFromClientX(e.clientX);
    };
    const onUp = () => stopDrag();

    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("blur", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onUp);
    };
  }, [setFromClientX, stopDrag]);

  const startDrag = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    draggingRef.current = true;
    setDragging(true);
    document.body.classList.add("is-dragging");
    setFromClientX(e.clientX);
    trackRef.current?.focus({ preventScroll: true });
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 1 : 5;
    const map: Record<string, number> = {
      ArrowLeft: -step,
      ArrowDown: -step,
      ArrowRight: step,
      ArrowUp: step,
    };
    if (e.key in map) {
      e.preventDefault();
      onChange(clamp(value + map[e.key]));
    } else if (e.key === "Home") onChange(0);
    else if (e.key === "End") onChange(100);
  };

  return (
    <div className={cn("select-none", !accent && "opacity-40")} style={{ WebkitUserSelect: "none", userSelect: "none" }}>
      <div className="mb-2 flex items-baseline justify-between gap-3 pointer-events-none">
        <span className="text-[10px] tracking-[0.1em] text-faint uppercase">{axis.left}</span>
        <span className={cn("text-[10px] tabular-nums transition-colors", live ? "text-accent" : "text-transparent")}>
          {pct}
        </span>
        <span className="text-[10px] tracking-[0.1em] text-faint uppercase">{axis.right}</span>
      </div>

      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={axis.label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={`${axis.left} — ${pct} — ${axis.right}`}
        onKeyDown={onKey}
        onPointerDown={startDrag}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative -my-3 cursor-grab touch-none py-4 outline-none active:cursor-grabbing"
        style={{ touchAction: "none", WebkitUserSelect: "none", userSelect: "none" }}
      >
        <div className="track h-[2px] w-full pointer-events-none" />
        <span className="pointer-events-none absolute top-1/2 left-1/2 h-[9px] w-px -translate-x-1/2 -translate-y-1/2 bg-ink/15" />

        <span
          className="pointer-events-none absolute top-1/2 h-[2px] -translate-y-1/2"
          style={{
            left: pct <= 50 ? `${pct}%` : "50%",
            width: `${Math.abs(pct - 50)}%`,
            background: "#e5233f",
            opacity: 0.75,
            transition: dragging ? "none" : "left .12s ease-out, width .12s ease-out",
          }}
        />

        <span
          className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${pct}%`,
            transition: dragging ? "none" : "left .12s ease-out",
          }}
        >
          <span className={cn("knob block h-[15px] w-[15px] rounded-full", live && "knob-hot")} />
        </span>
      </div>
    </div>
  );
}

export function GhostBtn({
  active,
  main,
  onClick,
  children,
  className,
}: {
  active?: boolean;
  main?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-on={active ? "1" : "0"}
      data-main={main ? "1" : "0"}
      className={cn("ghost-btn", className)}
    >
      {children}
    </button>
  );
}
