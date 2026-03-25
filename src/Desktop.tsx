import { useMemo, useState } from "react";

type AppId = "routeMap" | "pokedex" | "trainerCard" | "quests" | "settings";

type AppDef = {
  id: AppId;
  title: string;
  subtitle: string;
};

export function Desktop() {
  const apps = useMemo<AppDef[]>(
    () => [
      { id: "pokedex", title: "Pokédex", subtitle: "System + files" },
      { id: "trainerCard", title: "Trainer Card", subtitle: "Profile + stats + badges" },
      { id: "quests", title: "Quests", subtitle: "Onboarding + achievements" },
      { id: "settings", title: "Settings", subtitle: "Theme + about" },
    ],
    []
  );

  const [active, setActive] = useState<AppId>("routeMap");

  return (
    <div className="h-full w-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/30 border-b border-white/10">
        <div className="font-bold tracking-wide">PokeOS</div>
        <div className="text-sm opacity-80">{new Date().toLocaleString()}</div>
      </div>

      {/* Main */}
      <div className="p-6">
        <h1 className="text-3xl font-extrabold">Route Map</h1>
        <p className="opacity-80 mt-2">Choose a destination (app) to open.</p>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {apps.map((a) => (
            <button
              key={a.id}
              onClick={() => setActive(a.id)}
              className="text-left rounded-xl p-5 bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              <div className="text-xl font-bold">{a.title}</div>
              <div className="text-sm opacity-80 mt-1">{a.subtitle}</div>
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-white/10 bg-black/20 p-5">
          <div className="font-bold">Active app:</div>
          <div className="mt-1 opacity-80">{active}</div>
          <div className="mt-4 text-sm opacity-70">
            Next step: render each app in a window manager instead of this placeholder.
          </div>
        </div>
      </div>
    </div>
  );
}