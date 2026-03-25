import { useEffect, useMemo, useState } from "react";

type TrainerProfile = {
    trainerName: string;
    region: string;
    starter: string;
    badges: number;
};

const KEY = "pokeos.trainer.v1";

function loadProfile(): TrainerProfile {
    try {
        const raw = localStorage.getItem(KEY);
        if(!raw) return { trainerName: "New Trainer", region: "Kanto", starter: "Bulbasaur", badges: 0 };
        return JSON.parse(raw);
    } catch {
        return { trainerName: "New Trainer", region: "Kanto", starter: "Bulbasaur", badges: 0 };
    }
}

export function TrainerCard() {
    const [profile, setProfile] = useState<TrainerProfile>(() => loadProfile());

    useEffect(() => {
        localStorage.setItem(KEY, JSON.stringify(profile));
    }, [profile]);

    const rank = useMemo(() => {
        if(profile.badges >= 8) return "Champion";
        if(profile.badges >= 4) return "Veteran";
        if(profile.badges >= 1) return "Rookie";
        return "New Trainer";
    }, [profile.badges]);

    return (
        <div className="h-full w-full flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="text-lg font-extrabold">Trainer Card</div>
                </div>
                <div className="text-xs px-2 py-1 rounded bg-white/10 border border-white/10">Rank: {rank}</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <label className="text-sm">
                        <div className="opacity-70 mb-1">Trainer Name</div>
                        <input className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none" value={profile.trainerName} onChange={(e) => setProfile((p) => ({ ...p, trainerName: e.target.value}))} />
                    </label>

                    <label className="text-sm">
                        <div className="opacity-70 mb-1">Region</div>
                        <select className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none" value={profile.region} onChange={(e) => setProfile((p) => ({ ...p, region: e.target.value }))}>
                            <option>Kanto</option>
                            <option>Johto</option>
                            <option>Hoenn</option>
                            <option>Sinnoh</option>
                            <option>Unova</option>
                            <option>Kalos</option>
                            <option>Alola</option>
                            <option>Galar</option>
                            <option>Paldea</option>
                        </select>
                    </label>

                    <label className="text-sm">
                        <div className="opacity-70 mb-1">Starter (original / inspired by)</div>
                        <input className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none" value={profile.starter} onChange={(e) => setProfile((p) => ({ ...p, starter: e.target.value }))} />
                    </label>

                    <label className="text-sm">
                        <div className="opacity-70 mb-1">Badges Earned</div>
                        <input type="number" min={0} max={99} className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none" value={profile.badges} onChange={(e) => setProfile((p) => ({ ...p, badges:Number(e.target.value)}))}/>
                    </label>
                </div>

                <div className="mt-4 text-xs opacity-70">Possible Update: badge icons + achievements + optional Pi backend sync.</div>
            </div>
        </div>
    )
}