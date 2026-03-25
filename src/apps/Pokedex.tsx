import { useEffect, useMemo, useState } from "react";

type Entry = { label: string; value: string };

function yesNo(v: boolean) {
  return v ? "Yes" : "No";
}

export function Pokedex() {
  const [now, setNow] = useState(() => new Date());
  const [storage, setStorage] = useState<string>("Unknown");

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const navAny = navigator as any;
    if (navAny?.storage?.estimate) {
      navAny.storage
        .estimate()
        .then((est: any) => {
          const quota =
            typeof est.quota === "number" ? (est.quota / 1024 / 1024 / 1024).toFixed(2) + " GB" : "Unknown";
          const usage =
            typeof est.usage === "number" ? (est.usage / 1024 / 1024 / 1024).toFixed(2) + " GB" : "Unknown";
          setStorage(`Usage: ${usage} / Quota: ${quota}`);
        })
        .catch(() => setStorage("Unavailable"));
    } else {
      setStorage("Unavailable");
    }
  }, []);

  const entries = useMemo<Entry[]>(() => {
    const navAny = navigator as any;
    return [
      { label: "Entry Type", value: "SYSTEM" },
      { label: "Online", value: yesNo(navigator.onLine) },
      { label: "Language", value: navigator.language },
      { label: "Platform", value: navAny.platform ?? "Unknown" },
      { label: "User Agent", value: navigator.userAgent },
      { label: "CPU Cores", value: String(navAny.hardwareConcurrency ?? "Unknown") },
      { label: "Device Memory (GB)", value: String(navAny.deviceMemory ?? "Unknown") },
      { label: "Screen", value: `${window.screen.width}×${window.screen.height}` },
      { label: "Window", value: `${window.innerWidth}×${window.innerHeight}` },
      { label: "Local Storage Estimate", value: storage },
      { label: "Time", value: now.toLocaleString() },
    ];
  }, [now, storage]);

  return (
    <div className="h-full w-full flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-extrabold">Pokédex</div>
          <div className="text-xs opacity-70">
            MVP note: Browsers can’t read real processes/CPU temps without a local backend service.
          </div>
        </div>
        <div className="text-xs px-2 py-1 rounded bg-white/10 border border-white/10">Dex ID: SYS-001</div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
        <div className="px-3 py-2 bg-black/30 border-b border-white/10 text-sm font-semibold">System Entries</div>
        <div className="p-3 space-y-2 text-sm">
          {entries.map((e) => (
            <div key={e.label} className="grid grid-cols-3 gap-3">
              <div className="opacity-70">{e.label}</div>
              <div className="col-span-2 break-words">{e.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}