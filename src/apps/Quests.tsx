import { useEffect, useState } from "react";
import { loadQuests, saveQuests, type Quest, wireQuestAutoComplete } from "./questsModel.ts";

export function Quests() {
  const [quests, setQuests] = useState<Quest[]>(() => loadQuests());

  useEffect(() => {
    saveQuests(quests);
  }, [quests]);

  useEffect(() => {
    const unsub = wireQuestAutoComplete((updater) => setQuests(updater));
    return () => unsub();
  }, []);

  return (
    <div className="space-y-3">
      <div className="text-lg font-extrabold">Quests</div>
      <div className="text-xs opacity-70">Quests auto-complete when you actually do them.</div>

      <div className="space-y-2">
        {quests.map((q) => (
          <div
            key={q.id}
            className={[
              "rounded-xl border p-3",
              q.done ? "border-white/15 bg-white/5" : "border-white/10 bg-black/20",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">
                  {q.done ? "✅ " : "⬜ "}
                  {q.title}
                </div>
                <div className="text-xs opacity-70 mt-1">{q.desc}</div>
              </div>

              <div className="text-[10px] opacity-60 text-right whitespace-nowrap">
                {q.doneAt ? `Done ${new Date(q.doneAt).toLocaleString()}` : "Not done"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="text-xs px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10"
        onClick={() => {
          localStorage.removeItem("pokeos.quests.v1");
          setQuests(loadQuests());
        }}
      >
        Reset quests (dev)
      </button>
    </div>
  );
}