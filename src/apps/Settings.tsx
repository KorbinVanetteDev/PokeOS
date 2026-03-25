import { useTheme } from "../os/theme";

export function Settings() {
  const { theme, patchTheme } = useTheme();

  return (
    <div className="h-full w-full flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-lg font-extrabold">Settings</div>
          <div className="text-xs opacity-70">Theme changes save automatically.</div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <label className="text-sm">
            <div className="opacity-70 mb-1">Mode</div>
            <select
              className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none"
              value={theme.mode}
              onChange={(e) => patchTheme({ mode: e.target.value as any })}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>

          <label className="text-sm">
            <div className="opacity-70 mb-1">Accent</div>
            <input
              type="color"
              className="w-full h-10 rounded-lg bg-black/30 border border-white/10 px-2 py-1"
              value={theme.accent}
              onChange={(e) => patchTheme({ accent: e.target.value })}
            />
          </label>

          <label className="text-sm md:col-span-2">
            <div className="opacity-70 mb-1">Wallpaper</div>
            <select
              className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none"
              value={theme.wallpaper}
              onChange={(e) => patchTheme({ wallpaper: e.target.value as any })}
            >
              <option value="kanto-night">Kanto Night</option>
              <option value="kanto-day">Kanto Day</option>
              <option value="aurora">Aurora</option>
            </select>
          </label>
        </div>

        <div className="text-xs opacity-70">
          Next: per-app accent, font scaling, and wallpaper images.
        </div>
      </div>
    </div>
  );
}