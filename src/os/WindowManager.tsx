import { useEffect, useMemo, useRef, useState } from "react";
import { nanoid } from "nanoid";

import type { AppId, WindowState } from "./types";
import { appTitles } from "./apps";

import { DesktopIcon } from "./DesktopIcon";
import { TopBar } from "./TopBar";
import { Taskbar } from "./TaskBar";
import { StartMenu } from "./StartMenu";

import { getWallpaperCss, useTheme } from "./theme";
import { emitQuestEvent } from "./questEvents";

import { Pokedex } from "../apps/Pokedex";
import { TrainerCard } from "../apps/TrainerCard";
import { Quests } from "../apps/Quests";
import { Settings } from "../apps/Settings";

function AppView({ appId }: { appId: AppId }) {
  switch (appId) {
    case "pokedex":
      return <Pokedex />;
    case "trainerCard":
      return <TrainerCard />;
    case "quests":
      return <Quests />;
    case "settings":
      return <Settings />;
    default:
      return <div>Unknown app</div>;
  }
}

type DragState = {
  winId: string;
  startMouseX: number;
  startMouseY: number;
  startWinX: number;
  startWinY: number;
} | null;

type ResizeState = {
  winId: string;
  startMouseX: number;
  startMouseY: number;
  startW: number;
  startH: number;
} | null;

type AppDef = { id: AppId; icon: string; desc: string };

export function WindowManager() {
  const { theme } = useTheme();

  const [zTop, setZTop] = useState(10);
  const [wins, setWins] = useState<WindowState[]>([]);
  const [focusedWinId, setFocusedWinId] = useState<string | null>(null);

  const [startOpen, setStartOpen] = useState(false);

  const dragRef = useRef<DragState>(null);
  const resizeRef = useRef<ResizeState>(null);

  // Layout constants
  const TOPBAR_H = 44;
  const TASKBAR_H = 56;
  const EDGE = 24;

  // Resize constraints
  const MIN_W = 520;
  const MIN_H = 320;

  const allApps = useMemo<AppDef[]>(
    () => [
      { id: "pokedex", icon: "📟", desc: "System" },
      { id: "trainerCard", icon: "🪪", desc: "Your profile" },
      { id: "quests", icon: "📜", desc: "Onboarding quests" },
      { id: "settings", icon: "⚙️", desc: "Theme" },
    ],
    []
  );

  const pinnedApps = useMemo<AppDef[]>(() => allApps.slice(0, 4), [allApps]);
  const pinned = useMemo(() => pinnedApps.map(({ id, icon }) => ({ id, icon })), [pinnedApps]);

  const focusedAppId: AppId | null = useMemo(() => {
    if (!focusedWinId) return null;
    const w = wins.find((x) => x.winId === focusedWinId);
    return w ? w.appId : null;
  }, [wins, focusedWinId]);

  const getWorkArea = () => {
    const x = 0;
    const y = TOPBAR_H;
    const w = window.innerWidth;
    const h = window.innerHeight - TOPBAR_H - TASKBAR_H;
    return { x, y, w, h };
  };

  const launchFocused = (appId: AppId, via: "desktop" | "start" | "taskbar") => {
    const title = appTitles[appId];
    const id = nanoid();
    const z = zTop + 1;

    setZTop(z);
    setWins((prev) => [
      ...prev,
      {
        winId: id,
        appId,
        title,
        x: 120 + prev.length * 24,
        y: 120 + prev.length * 24,
        w: 760,
        h: 520,
        z,

        minimized: false,

        maximized: false,
        snapped: null,

        restoreX: null,
        restoreY: null,
        restoreW: null,
        restoreH: null,
      },
    ]);
    setFocusedWinId(id);

    emitQuestEvent({ type: "app_opened", appId, via });
  };

  const close = (winId: string) => {
    setWins((prev) => prev.filter((w) => w.winId !== winId));
    setFocusedWinId((cur) => (cur === winId ? null : cur));
  };

  const focus = (winId: string) => {
    setFocusedWinId(winId);
    const z = zTop + 1;
    setZTop(z);
    setWins((prev) => prev.map((w) => (w.winId === winId ? { ...w, z } : w)));
  };

  const minimize = (winId: string) => {
    setWins((prev) => prev.map((w) => (w.winId === winId ? { ...w, minimized: true } : w)));
    setFocusedWinId((cur) => (cur === winId ? null : cur));
    emitQuestEvent({ type: "window_minimized" });
  };

  const restoreFromMinimize = (winId: string) => {
    const z = zTop + 1;
    setZTop(z);
    setWins((prev) => prev.map((w) => (w.winId === winId ? { ...w, minimized: false, z } : w)));
    setFocusedWinId(winId);
    emitQuestEvent({ type: "window_restored" });
  };

  const maximize = (winId: string) => {
    const z = zTop + 1;
    setZTop(z);

    const wa = getWorkArea();

    setWins((prev) =>
      prev.map((w) => {
        if (w.winId !== winId) return w;

        const shouldSave = !w.maximized && w.snapped === null;

        return {
          ...w,
          z,
          minimized: false,
          maximized: true,
          snapped: null,
          restoreX: shouldSave ? w.x : w.restoreX,
          restoreY: shouldSave ? w.y : w.restoreY,
          restoreW: shouldSave ? w.w : w.restoreW,
          restoreH: shouldSave ? w.h : w.restoreH,
          x: wa.x,
          y: wa.y,
          w: wa.w,
          h: wa.h,
        };
      })
    );

    setFocusedWinId(winId);
    emitQuestEvent({ type: "window_maximized" });
  };

  const snap = (winId: string, side: "left" | "right") => {
    const z = zTop + 1;
    setZTop(z);

    const wa = getWorkArea();
    const halfW = Math.floor(wa.w / 2);

    setWins((prev) =>
      prev.map((w) => {
        if (w.winId !== winId) return w;

        const shouldSave = !w.maximized && w.snapped === null;

        return {
          ...w,
          z,
          minimized: false,
          maximized: false,
          snapped: side,
          restoreX: shouldSave ? w.x : w.restoreX,
          restoreY: shouldSave ? w.y : w.restoreY,
          restoreW: shouldSave ? w.w : w.restoreW,
          restoreH: shouldSave ? w.h : w.restoreH,
          x: side === "left" ? wa.x : wa.x + halfW,
          y: wa.y,
          w: halfW,
          h: wa.h,
        };
      })
    );

    setFocusedWinId(winId);
    emitQuestEvent({ type: "window_snapped", side });
  };

  const unmaximizeRestore = (winId: string) => {
    const z = zTop + 1;
    setZTop(z);

    setWins((prev) =>
      prev.map((w) => {
        if (w.winId !== winId) return w;

        const rx = w.restoreX ?? 120;
        const ry = w.restoreY ?? 120;
        const rw = w.restoreW ?? 760;
        const rh = w.restoreH ?? 520;

        return {
          ...w,
          z,
          minimized: false,
          maximized: false,
          snapped: null,
          x: rx,
          y: ry,
          w: rw,
          h: rh,
        };
      })
    );

    setFocusedWinId(winId);
  };

  const toggleMaximize = (winId: string) => {
    const w = wins.find((x) => x.winId === winId);
    if (!w) return;

    if (w.maximized || w.snapped !== null) unmaximizeRestore(winId);
    else maximize(winId);
  };

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const beginDrag = (e: React.PointerEvent, winId: string) => {
    if (e.button !== 0) return;

    const w = wins.find((x) => x.winId === winId);
    if (!w) return;

    if (w.maximized || w.snapped !== null) {
      unmaximizeRestore(winId);
    }

    focus(winId);

    dragRef.current = {
      winId,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startWinX: w.x,
      startWinY: w.y,
    };

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onDragMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;

    const dx = e.clientX - d.startMouseX;
    const dy = e.clientY - d.startMouseY;

    const margin = 10;
    const maxX = window.innerWidth - margin;
    const maxY = window.innerHeight - margin;

    setWins((prev) =>
      prev.map((w) => {
        if (w.winId !== d.winId) return w;

        const newX = d.startWinX + dx;
        const newY = d.startWinY + dy;

        const clampedX = clamp(newX, margin, maxX - 80);
        const clampedY = clamp(newY, TOPBAR_H, maxY - 44);

        return { ...w, x: clampedX, y: clampedY };
      })
    );
  };

  const beginResize = (e: React.PointerEvent, winId: string) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    const w = wins.find((x) => x.winId === winId);
    if (!w) return;

    if (w.maximized || w.snapped !== null) {
      unmaximizeRestore(winId);
    }

    focus(winId);

    resizeRef.current = {
      winId,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startW: w.w,
      startH: w.h,
    };

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onResizeMove = (e: React.PointerEvent) => {
    const r = resizeRef.current;
    if (!r) return;

    const dx = e.clientX - r.startMouseX;
    const dy = e.clientY - r.startMouseY;

    const wa = getWorkArea();

    setWins((prev) =>
      prev.map((w) => {
        if (w.winId !== r.winId) return w;

        const maxW = wa.x + wa.w - w.x;
        const maxH = wa.y + wa.h - w.y;

        const nextW = clamp(r.startW + dx, MIN_W, Math.max(MIN_W, maxW));
        const nextH = clamp(r.startH + dy, MIN_H, Math.max(MIN_H, maxH));

        return { ...w, w: nextW, h: nextH, maximized: false, snapped: null };
      })
    );
  };

  const endInteractions = () => {
    const hadDrag = dragRef.current !== null;
    const d = dragRef.current;

    dragRef.current = null;
    resizeRef.current = null;

    if (!hadDrag || !d) return;

    const w = wins.find((x) => x.winId === d.winId);
    if (!w) return;

    const wa = getWorkArea();

    const left = w.x;
    const right = w.x + w.w;
    const top = w.y;

    if (top <= wa.y + EDGE) {
      maximize(w.winId);
      return;
    }
    if (left <= wa.x + EDGE) {
      snap(w.winId, "left");
      return;
    }
    if (right >= wa.x + wa.w - EDGE) {
      snap(w.winId, "right");
      return;
    }
  };

  useEffect(() => {
    const onUp = () => endInteractions();
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [wins]);

  const desktopIcons = useMemo(
    () => [
      { id: "pokedex" as const, title: "Pokédex", subtitle: "System", icon: "📟" },
      { id: "trainerCard" as const, title: "Trainer Card", subtitle: "Profile", icon: "🪪" },
      { id: "quests" as const, title: "Quests", subtitle: "Achievements", icon: "📜" },
      { id: "settings" as const, title: "Settings", subtitle: "Theme", icon: "⚙️" },
    ],
    []
  );

  const [timeText, setTimeText] = useState(() => new Date().toLocaleString());
  useEffect(() => {
    const t = setInterval(() => setTimeText(new Date().toLocaleString()), 1000);
    return () => clearInterval(t);
  }, []);

  const visibleWins = useMemo(() => wins.filter((w) => !w.minimized), [wins]);

  return (
    <div className="h-full w-full relative overflow-hidden text-pokeCream">
      <div className="absolute inset-0" style={{ background: getWallpaperCss(theme.wallpaper) }} />

      <TopBar
        focusedAppId={focusedAppId}
        onOpenLauncher={() => setStartOpen((v) => !v)}
        timeText={timeText}
      />

      <div className="relative pt-14 pb-16 p-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl font-extrabold">Desktop</h1>
            <p className="opacity-80 mt-1 text-sm">Quests auto-complete based on real actions.</p>
          </div>

          <div className="text-xs px-3 py-2 rounded-xl bg-black/30 border border-white/10">
            Tip: Use Start, snap windows, and change theme
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 max-w-4xl">
          {desktopIcons.map((a) => (
            <DesktopIcon
              key={a.id}
              title={a.title}
              subtitle={a.subtitle}
              icon={a.icon}
              onOpen={() => launchFocused(a.id, "desktop")}
            />
          ))}
        </div>
      </div>

      <StartMenu
        open={startOpen}
        apps={allApps}
        pinned={pinnedApps}
        onClose={() => setStartOpen(false)}
        onLaunch={(appId) => launchFocused(appId, "start")}
      />

      {visibleWins
        .slice()
        .sort((a, b) => a.z - b.z)
        .map((w) => {
          const isFocused = w.winId === focusedWinId;

          return (
            <div
              key={w.winId}
              className={[
                "absolute rounded-2xl border backdrop-blur shadow-2xl",
                isFocused ? "border-white/25" : "border-white/10",
                "bg-[var(--poke-panel)]",
              ].join(" ")}
              style={{ left: w.x, top: w.y, width: w.w, height: w.h, zIndex: w.z }}
              onMouseDown={() => focus(w.winId)}
            >
              <div
                className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-black/25 rounded-t-2xl cursor-grab active:cursor-grabbing select-none"
                onPointerDown={(e) => beginDrag(e, w.winId)}
                onPointerMove={onDragMove}
              >
                <div className="flex items-center gap-2">
                  <button
                    className="h-3 w-3 rounded-full bg-red-500/90"
                    title="Close"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      close(w.winId);
                    }}
                  />
                  <button
                    className="h-3 w-3 rounded-full bg-yellow-400/90"
                    title="Minimize"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      minimize(w.winId);
                    }}
                  />
                  <button
                    className="h-3 w-3 rounded-full bg-green-500/90"
                    title={w.maximized || w.snapped ? "Restore" : "Maximize"}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMaximize(w.winId);
                    }}
                  />
                </div>

                <div className="text-sm font-semibold opacity-95">{w.title}</div>
                <div className="w-[60px]" />
              </div>

              <div className="p-4 text-sm h-[calc(100%-44px)] overflow-auto relative">
                <AppView appId={w.appId} />

                <div
                  className="absolute bottom-1 right-1 h-5 w-5 cursor-nwse-resize opacity-60 hover:opacity-100"
                  title="Resize"
                  onPointerDown={(e) => beginResize(e, w.winId)}
                  onPointerMove={onResizeMove}
                >
                  <div className="absolute inset-0">
                    <div className="absolute bottom-0 right-0 h-[2px] w-3 bg-white/40" />
                    <div className="absolute bottom-0 right-0 h-3 w-[2px] bg-white/40" />
                    <div className="absolute bottom-1 right-1 h-[2px] w-2 bg-white/30" />
                    <div className="absolute bottom-1 right-1 h-2 w-[2px] bg-white/30" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      <Taskbar
        pinned={pinned}
        windows={wins}
        focusedWinId={focusedWinId}
        onLaunch={(appId) => launchFocused(appId, "taskbar")}
        onFocusWin={(id) => {
          const w = wins.find((x) => x.winId === id);
          if (!w) return;
          if (w.minimized) restoreFromMinimize(id);
          else focus(id);
        }}
        onStart={() => setStartOpen((v) => !v)}
      />
    </div>
  );
}