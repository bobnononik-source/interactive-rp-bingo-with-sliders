import { useCallback, useRef, useState, type ReactNode } from "react";
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
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(false);
  const live = dragging || hover;
  const pct = clamp(value);

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0) return;
      onChange(clamp(Math.round(((clientX - r.left) / r.width) * 100)));
    },
    [onChange],
  );

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 1 : 5;
    const map: Record<string, number> = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step };
    if (e.key in map) {
      e.preventDefault();
      onChange(clamp(value + map[e.key]));
    } else if (e.key === "Home") onChange(0);
    else if (e.key === "End") onChange(100);
  };

  return (
    <div className={cn("select-none", !accent && "opacity-40")}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-[10px] tracking-[0.1em] text-faint uppercase">{axis.left}</span>
        <span className={cn("text-[10px] tabular-nums transition-colors", live ? "text-blood" : "text-transparent")}>
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
        onPointerDown={(e) => {
          e.currentTarget.focus();
          e.currentTarget.setPointerCapture?.(e.pointerId);
          setDragging(true);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => dragging && setFromClientX(e.clientX)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        onLostPointerCapture={() => setDragging(false)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative -my-3 cursor-grab touch-none py-3 outline-none active:cursor-grabbing"
      >
        <div className="track h-[2px] w-full" />
        <span className="pointer-events-none absolute top-1/2 left-1/2 h-[9px] w-px -translate-x-1/2 -translate-y-1/2 bg-ink/15" />

        <span
          className="pointer-events-none absolute top-1/2 h-[2px] -translate-y-1/2"
          style={{
            left: pct <= 50 ? `${pct}%` : "50%",
            width: `${Math.abs(pct - 50)}%`,
            background: "#a51127",
            opacity: 0.75,
            transition: dragging ? "none" : "all .16s ease-out",
          }}
        />

        <span
          className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${pct}%`, transition: dragging ? "none" : "left .16s ease-out" }}
        >
          {live && <span className="pulse-ring absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blood/50" />}
          <span className={cn("knob block h-[15px] w-[15px] rounded-full", live && "knob-hot scale-110")} />
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
