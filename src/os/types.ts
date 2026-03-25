export type AppId = "pokedex" | "trainerCard" | "quests" | "settings";

export type WindowState = {
  winId: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;

  maximized: boolean;
  snapped: "left" | "right" | null;

  restoreX: number | null;
  restoreY: number | null;
  restoreW: number | null;
  restoreH: number | null;
};