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
  { id: 5, text: "Боится метки" },
  { id: 6, text: "Ищет стаю" },
  { id: 7, text: "Одиночка и так хочет" },
  { id: 8, text: "Есть близкие в городе" },
  { id: 9, text: "Никого здесь не знает" },
  { id: 10, text: "Работает на складе / в баре" },
  { id: 11, text: "Без постоянной работы" },
  { id: 12, text: "Живёт в мотеле" },
  { id: 13, text: "Живёт в жилом районе" },
  { id: 14, text: "Первое обращение ещё впереди" },
  { id: 15, text: "Притворяется обычным человеком" },
  { id: 16, text: "Скрывает, кто он на самом деле" },
  { id: 17, text: "Не скрывает вид от своих" },
  { id: 18, text: "Не верит мэрии ни на грош" },
  { id: 19, text: "Готов помогать сопротивлению" },
  { id: 20, text: "Не хочет лезть в чужие войны" },
  { id: 21, text: "Ищет, кому можно доверять" },
  { id: 22, text: "Приехал ради кого-то" },
  { id: 23, text: "Хочет тихой жизни" },
  { id: 24, text: "Готов на сделку, если прижмёт" },
  { id: 25, text: "Лучше сядет, чем подпишет договор" },
];



/* ————————————————————————————————————————————
   СОСТОЯНИЕ
———————————————————————————————————————————— */

export type SheetState = {
  name: string;
  sliders: Record<string, number>;
  bingo: number[];
};

export function emptyState(): SheetState {
  return {
    name: "",
    sliders: Object.fromEntries(ALL_AXES.map((a) => [a.id, 50])),
    bingo: [],
  };
}

export function clamp(v: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, v));
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
