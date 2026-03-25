import type { AppId } from "./types";
import { appTitles } from "./apps";

export function TopBar({
  focusedAppId,
  onOpenLauncher,
  timeText,
}: {
  focusedAppId: AppId | null;
  onOpenLauncher: () => void;
  timeText: string;
}) {
  return (
    <div className="absolute top-0 left-0 right-0 z-[2000] h-11 px-3 flex items-center justify-between bg-black/35 backdrop-blur border-b border-white/10">
      {/* Left: Apple-like */}
      <div className="flex items-center gap-2">
        <button
          className="px-2 py-1 rounded hover:bg-white/10"
          onClick={onOpenLauncher}
          title="Open Launcher"
        >
          ◼︎
        </button>
        <div className="font-semibold">PokeOS</div>
        <div className="text-xs opacity-60 hidden sm:block">Kanto Classic</div>
      </div>

      {/* Center: active app name */}
      <div className="text-sm font-semibold opacity-90">
        {focusedAppId ? appTitles[focusedAppId] : "Desktop"}
      </div>

      {/* Right: “tray” */}
      <div className="flex items-center gap-3 text-sm opacity-90">
        <span className="hidden sm:inline">Wi‑Fi</span>
        <span className="hidden sm:inline">Sound</span>
        <span className="tabular-nums">{timeText}</span>
      </div>
    </div>
  );
}