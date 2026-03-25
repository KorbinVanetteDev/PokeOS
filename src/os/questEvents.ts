export type QuestEvent =
  | { type: "app_opened"; appId: string; via: "desktop" | "start" | "taskbar" }
  | { type: "window_minimized" }
  | { type: "window_restored" }
  | { type: "window_snapped"; side: "left" | "right" }
  | { type: "window_maximized" }
  | { type: "theme_changed"; mode: "dark" | "light"; wallpaper: string };

type Listener = (e: QuestEvent) => void;

const listeners = new Set<Listener>();

export function emitQuestEvent(e: QuestEvent) {
  listeners.forEach((fn) => fn(e));
}

export function onQuestEvent(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}