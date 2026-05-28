# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Run the Electron app
npm run dev        # Run in dev mode (enables DevTools via --dev flag)
npm test           # Run all tests (vitest)
npm run lint       # Lint src/ with ESLint

# Run a single test file
npx vitest run tests/CardSystem.test.js

# Build distributables
npm run build:win   # Windows NSIS installer
npm run build:mac   # macOS DMG (x64 + arm64)
npm run build:linux # Linux AppImage
```

## Architecture

Runewarden is an Electron desktop game: a Tower Defense × Deck Builder × Roguelike hybrid. The renderer process runs `index.html` which loads `src/core/GameEngine.js` as an ES module entry point. `main.js` is the Electron main process (BrowserWindow, Steam IPC, app lifecycle).

### Shared state pattern

`src/core/GameState.js` exports a single `shared` object. All modules — `GameEngine`, `HUDUpdater`, `UIOrchestrator` — reference game systems through this object rather than direct imports. `GameEngine` populates `shared.state`, `shared.renderer`, `shared.enemySystem`, etc. at the start of each run and replaces them on restart.

### Game loop and phase state machine

`GameEngine.js` drives a `requestAnimationFrame` loop and owns a phase state machine on `state.phase`:

```
pre → wave → post → node (shop | event | rest) → pre
```

- `pre`: player places towers/plays cards, presses Start Wave
- `wave`: RAF loop calls `enemySystem.update(delta)` and `towerSystem.update(delta)`
- `post`/`node`: between-wave screens (node selection, shop, event, rest site)
- `over`: game ended (victory or defeat)

Wave clear auto-saves to `localStorage` key `rw_autosave`. Meta progression persists to `localStorage` key `runewarden_meta_v1`.

### Core systems

| Module | Responsibility |
|--------|---------------|
| `src/core/GameEngine.js` | Orchestrates everything: wave lifecycle, callbacks, event listeners, keyboard shortcuts. This file is intentionally monolithic and marked as a gradual refactor target. |
| `src/core/SpellResolver.js` | Handler map for all spell effects. Adding a new spell means adding one entry to `BASE_HANDLERS`. Receives a `ctx` object injected by GameEngine. |
| `src/systems/CardSystem.js` | Draw/discard/play deck mechanics. Stateless logic — no DOM access. |
| `src/systems/EnemySystem.js` | Enemy spawning from `WAVE_CONFIGS`, movement along `WAYPOINTS`, HP/status effects (slow, freeze, burn, solar DoT). |
| `src/systems/TowerSystem.js` | Tower placement, targeting (nearest/farthest/strongest), attack ticks, relic multiplier accumulation. |
| `src/systems/MetaSystem.js` | Cross-run XP, rank (1–20), card unlocks, run history. Codex unlocks gate which cards appear in the shop. |
| `src/systems/DLCRegistry.js` | Thin `Set`-based registry. `hasDLC(id)` / `registerDLC(id)` / `clearDLCs()`. Queried by GameEngine at run start to set `maxWaves` and `bossWaves`. |
| `src/systems/SteamSystem.js` | Achievement/stat calls bridged to `main.js` via Electron IPC. |
| `src/rendering/MapRenderer.js` | SVG hex-grid renderer. Exports `ENEMY_PATH`, `hexToPixel`, `isPlaceableCell`. |

### UI layer

`src/ui/UIOrchestrator.js` manages screen visibility. `src/ui/HUDUpdater.js` owns `updateHUD()` and `renderHand()` — both are called frequently and read from `shared`. Each between-wave screen (Shop, Node, Event, Rest, Relic, RunSummary) is its own class that receives callbacks from GameEngine.

### Data layer

`src/data/` contains static definitions (no logic): `cards.js`, `towers.js`, `wardens.js`, `relics.js`, `maps.js`, `difficulty.js`, `ascension.js`, `challenges.js`. DLC cards/towers/wardens are **statically imported** and merged in these base files (e.g., `CARD_DEFS = [...BASE_CARD_DEFS, ...SHADOW_CARDS, ...SOLAR_CARDS]`).

### DLC structure

Each DLC lives under `src/dlc/{id}/` with the same file layout:

```
src/dlc/shadow_realm/   # Act 4 (Waves 16–23), Shadow Warden
src/dlc/solar_dominion/ # Act 5 (Waves 24–31), Solar Warden
```

Each DLC directory contains `cards.js`, `towers.js`, `wardens.js`, `relics.js`, `maps.js`, `events.js`, `index.js`, and `i18n/{en,ko}.js`. The DLC i18n files are merged into the main i18n in `src/i18n/i18n.js`.

### i18n

`src/i18n/i18n.js` exports a singleton `i18n`. All UI strings go through `i18n.t('key', ...args)`. English strings are in `src/i18n/en.js`, Korean in `ko.js`. Both Warden and card definitions carry parallel `name`/`nameKo` and `desc`/`descKo` fields; display code reads `i18n.lang === 'ko' ? nameKo : name`.

### Testing

Tests run in a pure Node environment (no DOM, no Electron). Tests live in `tests/` and only cover pure-logic systems: `CardSystem`, `EnemySystem`, `MetaSystem`, `SpellResolver`, `TowerSystem`. DOM-dependent code (`GameEngine`, all `src/ui/`) is not tested.

### Dev helpers

`window.__dev` is available in the renderer during development:

```js
window.__dev.openShop()    // jump to shop screen
window.__dev.clearWave()   // immediately clear current wave
window.__dev.endGame(true) // force victory
window.__dev.metaReset()   // wipe all meta progression
window.__dev.tutReset()    // reset tutorial flags
```
