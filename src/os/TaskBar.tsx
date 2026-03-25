import type { AppId, WindowState } from "./types";
import { appTitles } from "./apps";

type DockItem = { id: AppId; icon: string };

export function Taskbar({
  pinned,
  windows,
  focusedWinId,
  onLaunch,
  onFocusWin,
  onStart,
}: {
  pinned: DockItem[];
  windows: WindowState[];
  focusedWinId: string | null;
  onLaunch: (appId: AppId) => void;
  onFocusWin: (winId: string) => void; // should restore if minimized (WindowManager will handle)
  onStart: () => void;
}) {
  const runningByApp = new Map<AppId, number>();
  windows.forEach((w) => runningByApp.set(w.appId, (runningByApp.get(w.appId) ?? 0) + 1));

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[2000] h-14 px-3 flex items-center justify-between bg-black/40 backdrop-blur border-t border-white/10">
      {/* Left: Start */}
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 font-semibold"
          onClick={onStart}
          title="Start"
        >
          Start
        </button>
      </div>

      {/* Center: pinned */}
      <div className="flex-1 flex items-center justify-center gap-2">
        {pinned.map((p) => {
          const running = runningByApp.get(p.id) ?? 0;
          return (
            <button
              key={p.id}
              className="relative h-10 w-12 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/10 transition"
              onClick={() => onLaunch(p.id)}
              title={appTitles[p.id]}
            >
              <div className="h-full w-full flex items-center justify-center text-xl">{p.icon}</div>
              {running > 0 ? (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-6 rounded bg-pokeBlue/80" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Right: running windows (now shows minimized state) */}
      <div className="flex items-center gap-2 max-w-[45%] overflow-auto">
        {windows
          .slice()
          .sort((a, b) => a.z - b.z)
          .map((w) => (
            <button
              key={w.winId}
              onClick={() => onFocusWin(w.winId)}
              className={[
                "px-2 py-1 rounded-lg text-xs border transition whitespace-nowrap",
                w.winId === focusedWinId ? "bg-white/15 border-white/20" : "bg-white/5 hover:bg-white/10 border-white/10",
                w.minimized ? "opacity-60" : "opacity-100",
              ].join(" ")}
              title={w.minimized ? `${w.title} (minimized)` : w.title}
            >
              {w.title}
            </button>
          ))}
      </div>
    </div>
  );
}