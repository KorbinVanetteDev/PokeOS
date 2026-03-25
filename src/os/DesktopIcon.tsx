type DesktopIconProps = {
  title: string;
  subtitle?: string;
  icon: string; // Emojiiii for now. Maybe use svg later.
  onOpen: () => void;
};

export function DesktopIcon({ title, subtitle, icon, onOpen }: DesktopIconProps) {
  return (
    <button
      onClick={onOpen}
      className="group w-[120px] select-none rounded-xl p-3 hover:bg-white/10 focus:bg-white/10 border border-transparent hover:border-white/10 transition text-left"
      title={subtitle ?? title}
    >
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border border-white/10 flex items-center justify-center text-3xl shadow">
        {icon}
      </div>
      <div className="mt-2 text-sm font-semibold leading-tight">{title}</div>
      {subtitle ? <div className="text-xs opacity-70 mt-0.5 line-clamp-2">{subtitle}</div> : null}
    </button>
  );
}