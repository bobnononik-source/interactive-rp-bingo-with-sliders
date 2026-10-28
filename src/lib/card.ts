import {
  AXIS_GROUPS,
  BINGO_POOL,
  WORLD_AXES,
  type SheetState,
} from "@/data/sheet";

const W = 1080;
const PAD = 80;
const CW = W - PAD * 2;

const C = {
  bgTop: "#2b0a11",
  bgBottom: "#0b0405",
  text: "#f6ecea",
  soft: "#c9adad",
  faint: "#8f6f71",
  accent: "#e5233f",
  line: "rgba(246,236,234,0.15)",
  lineSoft: "rgba(246,236,234,0.09)",
};

const SERIF = 'Georgia, "Times New Roman", serif';
const FOOTER_TEXT = "кто прочитал тот няшка";

function setSpacing(ctx: CanvasRenderingContext2D, px: number) {
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${px}px`;
  } catch {
    /* ignore */
  }
}

function vLine(ctx: CanvasRenderingContext2D, x: number, y1: number, y2: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 0.5, y1);
  ctx.lineTo(x + 0.5, y2);
  ctx.stroke();
}

function hLine(ctx: CanvasRenderingContext2D, y: number, x1: number, x2: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y + 0.5);
  ctx.lineTo(x2, y + 0.5);
  ctx.stroke();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines = 2): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(next).width > maxWidth && cur) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, maxLines);
}

/** Рисует карточку персонажа и возвращает canvas. */
export function buildCard(state: SheetState): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const measure = document.createElement("canvas").getContext("2d")!;

  const name = state.name.trim() || "Без имени";
  measure.font = `600 54px ${SERIF}`;
  const nameLines = wrap(measure, name, CW, 2);

  const rowH = 96;
  let contentH = 96; // top padding before name
  contentH += nameLines.length * 62;
  contentH += 46; // line under name + gap

  for (const g of AXIS_GROUPS) {
    contentH += 74;
    contentH += WORLD_AXES.filter((a) => a.group === g.id).length * rowH;
    contentH += 20;
  }

  const items = state.bingo
    .map((id) => BINGO_POOL.find((b) => b.id === id)?.text)
    .filter((t): t is string => !!t);
  const colW = (CW - 46) / 2;
  measure.font = `400 21px ${SERIF}`;
  const itemRows: string[][] = items.map((t) => wrap(measure, t, colW - 34, 2));
  const bingoRowH = 34;
  const rowsPerCol = Math.max(1, Math.ceil(itemRows.length / 2));
  const bingoH = items.length ? 74 + rowsPerCol * bingoRowH + 20 : 0;
  contentH += bingoH;

  const footH = 160;
  const H = contentH + footH;

  canvas.width = W * 2;
  canvas.height = H * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(2, 2);

  /* ——— фон ——— */
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, C.bgTop);
  grad.addColorStop(0.55, "#170609");
  grad.addColorStop(1, C.bgBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, 620);
  glow.addColorStop(0, "rgba(229,35,63,0.22)");
  glow.addColorStop(1, "rgba(229,35,63,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, 620);

  ctx.strokeStyle = "rgba(246,236,234,0.1)";
  ctx.lineWidth = 1;
  ctx.strokeRect(28.5, 28.5, W - 57, H - 57);

  let y = 96;
  ctx.textBaseline = "alphabetic";

  /* ——— имя ——— */
  setSpacing(ctx, 1);
  ctx.font = `600 54px ${SERIF}`;
  ctx.fillStyle = C.text;
  for (const line of nameLines) {
    ctx.fillText(line, PAD, y);
    y += 62;
  }
  setSpacing(ctx, 0);

  y += 6;
  hLine(ctx, y, PAD, PAD + CW, C.line);
  y += 40;

  /* ——— шкалы ——— */
  for (const g of AXIS_GROUPS) {
    setSpacing(ctx, 4);
    ctx.font = `600 15px ${SERIF}`;
    ctx.fillStyle = C.soft;
    ctx.fillText(g.title.toUpperCase(), PAD, y);
    const tw = ctx.measureText(g.title.toUpperCase()).width;
    setSpacing(ctx, 0);
    hLine(ctx, y - 5, PAD + tw + 22, PAD + CW, C.lineSoft);
    y += 46;

    for (const a of WORLD_AXES.filter((x) => x.group === g.id)) {
      const v = state.sliders[a.id] ?? 50;

      ctx.font = `400 22px ${SERIF}`;
      ctx.fillStyle = C.text;
      ctx.fillText(a.label, PAD, y);

      ctx.textAlign = "right";
      ctx.fillStyle = C.faint;
      ctx.fillText(`${v}`, PAD + CW, y);
      ctx.textAlign = "left";

      const by = y + 22;
      ctx.fillStyle = "rgba(246,236,234,0.13)";
      ctx.fillRect(PAD, by, CW, 2);

      const kx = PAD + (CW * v) / 100;
      const half = Math.abs(kx - (PAD + CW / 2));
      ctx.fillStyle = "rgba(229,35,63,0.75)";
      ctx.fillRect(kx <= PAD + CW / 2 ? kx : PAD + CW / 2, by, half, 2);
      vLine(ctx, PAD + CW / 2, by - 6, by + 8, C.lineSoft);

      ctx.beginPath();
      ctx.arc(kx, by + 1, 7, 0, Math.PI * 2);
      ctx.fillStyle = C.accent;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.stroke();

      setSpacing(ctx, 2);
      ctx.font = `400 13px ${SERIF}`;
      ctx.fillStyle = C.faint;
      ctx.fillText(a.left.toUpperCase(), PAD, by + 34);
      ctx.textAlign = "right";
      ctx.fillText(a.right.toUpperCase(), PAD + CW, by + 34);
      ctx.textAlign = "left";
      setSpacing(ctx, 0);

      y += rowH;
    }
    y += 20;
  }

  /* ——— бинго ——— */
  if (items.length) {
    setSpacing(ctx, 4);
    ctx.font = `600 15px ${SERIF}`;
    ctx.fillStyle = C.soft;
    ctx.fillText("БИНГО", PAD, y);
    const tw = ctx.measureText("БИНГО").width;
    setSpacing(ctx, 0);
    ctx.font = `400 14px ${SERIF}`;
    ctx.fillStyle = C.faint;
    ctx.fillText(`${items.length} из ${BINGO_POOL.length}`, PAD + tw + 22, y);
    hLine(ctx, y - 5, PAD + tw + 120, PAD + CW, C.lineSoft);
    y += 40;

    const colW2 = (CW - 46) / 2;
    for (let i = 0; i < itemRows.length; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = PAD + col * (colW2 + 46);
      const iy = y + row * bingoRowH;

      ctx.fillStyle = C.accent;
      ctx.font = `400 18px ${SERIF}`;
      ctx.fillText("✕", x, iy);

      ctx.font = `400 19px ${SERIF}`;
      ctx.fillStyle = C.soft;
      const parts = itemRows[i];
      ctx.fillText(parts[0], x + 26, iy);
      if (parts[1]) {
        ctx.font = `400 15px ${SERIF}`;
        ctx.fillStyle = C.faint;
        ctx.fillText(parts[1], x + 26, iy + 16);
      }
    }
    y += rowsPerCol * bingoRowH + 20;
  }

  /* ——— нижняя плашка с надписью ——— */
  const bannerTop = H - 120;
  const bannerH = 72;

  // тёмная подложка, чтобы текст всегда читался
  ctx.fillStyle = "rgba(10, 3, 5, 0.85)";
  ctx.fillRect(PAD - 10, bannerTop, CW + 20, bannerH);

  ctx.strokeStyle = C.accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(PAD - 10.5, bannerTop + 0.5, CW + 20, bannerH - 1);

  ctx.fillStyle = C.accent;
  ctx.font = `700 28px ${SERIF}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  setSpacing(ctx, 1);
  ctx.fillText(FOOTER_TEXT, W / 2, bannerTop + bannerH / 2);
  setSpacing(ctx, 0);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  return canvas;
}

export function downloadCard(state: SheetState) {
  const canvas = buildCard(state);
  const safe = (state.name.trim() || "personazh").replace(/[^\p{L}\p{N}_-]+/gu, "_");
  const filename = `onplas-${safe}.png`;

  canvas.toBlob((blob) => {
    if (!blob) {
      // fallback, если toBlob недоступен
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = filename;
      a.click();
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }, "image/png");
}
