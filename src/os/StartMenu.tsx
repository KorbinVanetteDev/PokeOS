import { useEffect, useMemo, useRef, useState } from "react";
import type { AppId } from "./types";
import { appTitles } from "./apps";

type AppDef = { id: AppId; icon: string; desc: string };

export function StartMenu({
  open,
  apps,
  pinned,
  onClose,
  onLaunch,
}: {
  open: boolean;
  apps: AppDef[];
  pinned: AppDef[];
  onClose: () => void;
  onLaunch: (appId: AppId) => void;
}) {
  const [q, setQ] = useState("");
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setQ("");
    // Focus search field on open
    const t = setTimeout(() => {
      const el = panelRef.current?.querySelector<HTMLInputElement>("input[data-start-search]");
      el?.focus();
    }, 0);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const onMouseDown = (e: MouseEvent) => {
      // Close when clicking outside the panel
      const panel = panelRef.current;
      if (!panel) return;
      if (!panel.contains(e.target as Node)) onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return apps;
    return apps.filter((a) => {
      const title = appTitles[a.id].toLowerCase();
      return title.includes(s) || a.desc.toLowerCase().includes(s);
    });
  }, [q, apps]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-[2500]">
      {/* dim */}
      <div className="absolute inset-0 bg-black/30" />

      {/* panel */}
      <div
        ref={panelRef}
        className="absolute left-3 bottom-16 w-[min(520px,calc(100vw-24px))] rounded-2xl border border-white/10 bg-[#0b1220]/92 backdrop-blur shadow-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-white/10 bg-black/20">
          <div className="text-sm font-semibold opacity-90">Start</div>
          <div className="mt-2">
            <input
              data-start-search
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search apps…"
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none text-sm text-pokeCream placeholder:text-white/40"
            />
          </div>
        </div>

        {/* pinned */}
        <div className="p-4 border-b border-white/10">
          <div className="text-xs font-semibold opacity-70 mb-2">Pinned</div>
          <div className="grid grid-cols-4 gap-2">
            {pinned.map((a) => (
              <button
                key={a.id}
                className="rounded-xl p-2 hover:bg-white/10 border border-transparent hover:border-white/10 transition text-left"
                onClick={() => {
                  onLaunch(a.id);
                  onClose();
                }}
                title={appTitles[a.id]}
              >
                <div className="text-2xl">{a.icon}</div>
                <div className="text-xs font-semibold mt-1 leading-tight">{appTitles[a.id]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* all apps */}
        <div className="p-4 max-h-[50vh] overflow-auto">
          <div className="text-xs font-semibold opacity-70 mb-2">All apps</div>

          <div className="space-y-2">
            {filtered.map((a) => (
              <button
                key={a.id}
                className="w-full flex items-center gap-3 rounded-xl p-3 bg-white/5 hover:bg-white/10 border border-white/10 transition text-left"
                onClick={() => {
                  onLaunch(a.id);
                  onClose();
                }}
              >
                <div className="text-2xl w-8">{a.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold">{appTitles[a.id]}</div>
                  <div className="text-xs opacity-70 mt-0.5">{a.desc}</div>
                </div>
              </button>
            ))}

            {filtered.length === 0 ? (
              <div className="text-sm opacity-70">No apps match your search.</div>
            ) : null}
          </div>
        </div>

        <div className="p-3 border-t border-white/10 bg-black/20 flex items-center justify-between">
          <div className="text-xs opacity-70">Esc to close</div>
          <button
            className="text-xs px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}