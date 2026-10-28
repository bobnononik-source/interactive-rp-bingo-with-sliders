/**
 * Онплэс, 2002. Анкета отношения персонажа.
 */

export type AxisGroupId = "power" | "own" | "personal";

export type Axis = {
  id: string;
  label: string;
  left: string;
  right: string;
  group: AxisGroupId;
};

export const AXIS_GROUPS: { id: AxisGroupId; title: string }[] = [
  { id: "power", title: "Власть" },
  { id: "own", title: "Свои и чужие" },
  { id: "personal", title: "Личное" },
];

export const WORLD_AXES: Axis[] = [
  // Власть
  { id: "w_surety", label: "Программа поручительства", left: "за", right: "против", group: "power" },
  { id: "w_vampires", label: "Вампиры", left: "свои", right: "враги", group: "power" },
  { id: "w_police", label: "Полиция и суд", left: "помогаю", right: "мешаю", group: "power" },
  { id: "w_secret", label: "Тайна видов", left: "храню", right: "раскрываю", group: "power" },

  // Свои и чужие
  { id: "w_werewolves", label: "Оборотни и стаи", left: "доверяю", right: "ненавижу", group: "own" },
  { id: "w_humans", label: "Люди", left: "защищаю", right: "использую", group: "own" },
  { id: "w_hunters", label: "Охотники", left: "союзники", right: "угроза", group: "own" },
  { id: "w_resistance", label: "Сопротивление", left: "с ними", right: "против них", group: "own" },

  // Личное
  { id: "w_mark", label: "Метка", left: "принимаю", right: "ненавижу", group: "personal" },
  { id: "w_blood", label: "Кровь", left: "пакет", right: "живая", group: "personal" },
  { id: "w_moon", label: "Полнолуние", left: "контроль", right: "срыв", group: "personal" },
  {
    id: "w_city",
    label: "Красная луна",
    left: "избегает",
    right: "охота и поиск жертв",
    group: "personal",
  },
];

export const ALL_AXES: Axis[] = WORLD_AXES;

/* ————————————————————————————————————————————
   БИНГО — кто персонаж на старте (новый РП)
———————————————————————————————————————————— */

export const BINGO_POOL: { id: number; text: string }[] = [
  { id: 1, text: "Только приехал в Онплэс" },
  { id: 2, text: "Живёт здесь с детства" },
  { id: 3, text: "Ещё не знает, кто здесь кто" },
  { id: 4, text: "Уже слышал про поручительство" },
  { id: 5, text: "Сам под меткой" },
  { id: 6, text: "Боится метки" },
  { id: 7, text: "Хочет стать поручителем" },
  { id: 8, text: "Ищет стаю" },
  { id: 9, text: "Одиночка и так хочет" },
  { id: 10, text: "Есть близкие в городе" },
  { id: 11, text: "Никого здесь не знает" },
  { id: 12, text: "Работает в мэрии / участке / клинике" },
  { id: 13, text: "Работает на складе / в баре" },
  { id: 14, text: "Без постоянной работы" },
  { id: 15, text: "Живёт в лесу" },
  { id: 16, text: "Живёт в мотеле" },
  { id: 17, text: "Первое обращение ещё впереди" },
  { id: 18, text: "Уже контролирует полнолуние" },
  { id: 19, text: "Пьёт только донорские пакеты" },
  { id: 20, text: "Не отказывается от живой крови" },
  { id: 21, text: "Притворяется обычным человеком" },
  { id: 22, text: "Скрывает, кто он на самом деле" },
  { id: 23, text: "Не скрывает вид от своих" },
  { id: 24, text: "Верит, что в городе всё честно" },
  { id: 25, text: "Не верит мэрии ни на грош" },
  { id: 26, text: "Готов помогать сопротивлению" },
  { id: 27, text: "Не хочет лезть в чужие войны" },
  { id: 28, text: "Ищет, кому можно доверять" },
  { id: 29, text: "Никому не доверяет" },
  { id: 30, text: "Приехал ради кого-то" },
  { id: 31, text: "Сбежал сюда от прошлого" },
  { id: 32, text: "Хочет тихой жизни" },
  { id: 33, text: "Ищет власть или влияние" },
  { id: 34, text: "Готов на сделку, если прижмёт" },
  { id: 35, text: "Лучше сядет, чем подпишет договор" },
  { id: 36, text: "Живёт в жилом районе" },
];

export const BINGO_SIZE = 5;

/* ————————————————————————————————————————————
   СОСТОЯНИЕ
———————————————————————————————————————————— */

export type SheetState = {
  name: string;
  sliders: Record<string, number>;
  bingo: number[];
  bingoSet: number[];
};

export function defaultBingoSet(): number[] {
  return shuffle(BINGO_POOL.map((i) => i.id)).slice(0, BINGO_SIZE * BINGO_SIZE);
}

export function emptyState(): SheetState {
  return {
    name: "",
    sliders: Object.fromEntries(ALL_AXES.map((a) => [a.id, 50])),
    bingo: [],
    bingoSet: defaultBingoSet(),
  };
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function clamp(v: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, v));
}

export function bingoLines(card: number[], marked: number[]): number {
  const set = new Set(marked);
  const idx = (r: number, c: number) => r * BINGO_SIZE + c;
  const ok = (cells: number[]) => cells.every((i) => set.has(card[i]));
  let lines = 0;
  for (let r = 0; r < BINGO_SIZE; r++) if (ok(Array.from({ length: BINGO_SIZE }, (_, c) => idx(r, c)))) lines++;
  for (let c = 0; c < BINGO_SIZE; c++) if (ok(Array.from({ length: BINGO_SIZE }, (_, r) => idx(r, c)))) lines++;
  if (ok(Array.from({ length: BINGO_SIZE }, (_, i) => idx(i, i)))) lines++;
  if (ok(Array.from({ length: BINGO_SIZE }, (_, i) => idx(i, BINGO_SIZE - 1 - i)))) lines++;
  return lines;
}

export function buildText(state: SheetState): string {
  const L: string[] = [];
  if (state.name.trim()) L.push(state.name.trim());
  L.push("ONPLAS · 2002", "");
  for (const g of AXIS_GROUPS) {
    L.push(g.title.toUpperCase());
    for (const a of WORLD_AXES) {
      if (a.group !== g.id) continue;
      const v = state.sliders[a.id] ?? 50;
      L.push(`  ${a.label}: ${v}/100  (${a.left} ← → ${a.right})`);
    }
    L.push("");
  }
  if (state.bingo.length) {
    L.push("", "БИНГО");
    for (const id of state.bingo) {
      const item = BINGO_POOL.find((b) => b.id === id);
      if (item) L.push(`  ✕ ${item.text}`);
    }
  }
  return L.join("\n");
}
