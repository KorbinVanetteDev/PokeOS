import { onQuestEvent } from "../os/questEvents";

export type QuestId =
  | "open_pokedex"
  | "open_from_start"
  | "minimize_a_window"
  | "snap_a_window"
  | "change_theme";

export type Quest = {
  id: QuestId;
  title: string;
  desc: string;
  done: boolean;
  doneAt: string | null;
};

const KEY = "pokeos.quests.v1";

const defaults: Quest[] = [
  { id: "open_pokedex", title: "Open Pokédex", desc: "Launch the Pokédex app", done: false, doneAt: null },
  { id: "open_from_start", title: "Use Start Menu", desc: "Launch any app from Start", done: false, doneAt: null },
  { id: "minimize_a_window", title: "Minimize a window", desc: "Minimize then restore a window", done: false, doneAt: null },
  { id: "snap_a_window", title: "Snap a window", desc: "Snap left or right", done: false, doneAt: null },
  { id: "change_theme", title: "Change theme", desc: "Change mode or wallpaper in Settings", done: false, doneAt: null },
];

export function loadQuests(): Quest[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Quest[];
    const map = new Map(parsed.map((q) => [q.id, q]));
    return defaults.map((d) => map.get(d.id) ?? d);
  } catch {
    return defaults;
  }
}

export function saveQuests(qs: Quest[]) {
  localStorage.setItem(KEY, JSON.stringify(qs));
}

export function wireQuestAutoComplete(
  setQuests: (updater: (prev: Quest[]) => Quest[]) => void
) {
  return onQuestEvent((e) => {
    // DEBUG: prove listener is receiving events
    console.log("[QuestEvent recv in questsModel]", e);

    setQuests((prev) => {
      const now = new Date().toISOString();

      const mark = (id: QuestId) =>
        prev.map((q) => (q.id === id && !q.done ? { ...q, done: true, doneAt: now } : q));

      switch (e.type) {
        case "app_opened":
          if (e.appId === "pokedex") return mark("open_pokedex");
          if (e.via === "start") return mark("open_from_start");
          return prev;

        case "window_minimized":
        case "window_restored":
          return mark("minimize_a_window");

        case "window_snapped":
          return mark("snap_a_window");

        case "theme_changed":
          return mark("change_theme");

        default:
          return prev;
      }
    });
  });
}