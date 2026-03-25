# PokeOS WebOS

A Pokémon-themed web “desktop OS” built with **React + TypeScript + Vite**.  
It includes movable/resizable windows, a Start menu launcher, taskbar, theming, and an auto-completing quest system (quests complete only when the user actually performs the actions).

## Features

- **Desktop + Windows**
  - Draggable windows (title bar drag)
  - Resizable windows (bottom-right resize handle)
  - Focus/z-index management
  - Minimize + restore
  - Maximize + restore
  - Snap left/right by dragging to screen edges

- **Start Menu / Launcher**
  - Pinned apps + all apps list
  - Search filter
  - Click outside / `Esc` to close

- **Taskbar**
  - Start button
  - Pinned app icons
  - Running window list (supports restore from minimized)

- **Themes**
  - Light/Dark mode
  - Accent color
  - Wallpaper selection
  - Persisted in `localStorage`

- **Quests (Auto-complete)**
  - Quests complete via real events (open app, snap window, theme change, etc.)
  - No manual “checkbox” completion
  - Persisted in `localStorage`

## Tech Stack

- React
- TypeScript
- Vite
- TailwindCSS
- nanoid

## Getting Started

### Install
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## Project Structure (high level)

```text
src/
  apps/
    Pokedex.tsx
    TrainerCard.tsx
    Quests.tsx
    Settings.tsx
    questsModel.ts
  os/
    WindowManager.tsx
    StartMenu.tsx
    TopBar.tsx
    TaskBar.tsx
    DesktopIcon.tsx
    apps.ts
    types.ts
    theme.tsx
    questEvents.ts
```

## Quests: How Auto-Completion Works

Quests are event-driven:

- The OS emits events when the user does real actions (open apps, minimize, snap, change theme).
- The Quests app subscribes and marks quests complete when it receives those events.

Key files:
- `src/os/questEvents.ts` — tiny event bus (`emitQuestEvent`, `onQuestEvent`)
- `src/apps/questsModel.ts` — quest definitions + auto-complete logic
- `src/apps/Quests.tsx` — UI; displays quest status (no manual toggles)

### Reset quest progress (dev)
In the Quests app UI there is a **Reset quests (dev)** button, or you can clear storage:
- `localStorage.removeItem("pokeos.quests.v1")`

## Theme System

Theme is provided globally by `ThemeProvider` and persisted in `localStorage`:

- Key: `pokeos.theme.v1`
- CSS variables:
  - `--poke-accent`
  - `--poke-bg`
  - `--poke-fg`
  - `--poke-panel`

Main files:
- `src/os/theme.tsx`
- `src/apps/Settings.tsx`

## Notes / Tips

- If you use `"type": "module"` in `package.json`, config files should be ESM:
  - `tailwind.config.js` should use `export default { ... }`
  - `postcss.config.js` should use `export default { ... }`

- If something “doesn’t update,” restart the dev server:
```bash
# Ctrl+C
npm run dev
```

## Roadmap Ideas

- Alt+Tab switcher overlay
- Notifications/toasts (quest completed, app launched)
- Desktop right-click menu
- Per-app settings + app installs
- Workspace/multiple desktops

Private project (for now).
