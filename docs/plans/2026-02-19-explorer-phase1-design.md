# Explorer Phase 1: Foundation Design

**Date:** 2026-02-19
**Status:** Approved
**Parent:** docs/plans/2026-02-10-space-explorer-portfolio-design.md

## Overview

Phase 1 establishes the core exploration loop: scan planets to reveal data, then land.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Scan requirement | Gates landing | Creates exploration loop (arrive → scan → land) |
| HUD style | Ultra-minimal | Validate interaction first, add chrome later |
| Landing animation | Camera swoop | Fast, satisfying, matches existing camera system |
| Scan data display | Floating 3D beside planet | Maintains immersion, no 2D panels |

## State Management

Extend `useViewStore` in `src/lib/store.ts`:

```typescript
// New state fields
scannedPlanets: Set<string>      // Planets user has scanned
scanningPlanet: string | null    // Currently scanning (hold in progress)
scanProgress: number             // 0-1 progress during hold

// New actions
startScan: (planetId: string) => void
updateScanProgress: (progress: number) => void
completeScan: (planetId: string) => void
cancelScan: () => void
```

## Scan Interaction

### Detection
- Check distance from camera to all planets each frame
- Scan range: 15 units
- Only nearest planet scannable at a time

### Interaction
- Keyboard: Hold `Space` for 1.5s
- Mobile: Hold tap on planet
- Visual: Circular progress ring around planet

### After Scan
- Floating data appears beside planet:
  - Project name (3D text)
  - 2-3 tech icons as sprites
  - "Press Enter to land" prompt
- Already-scanned planets show faint data outline, can land immediately

## Minimal HUD

### Location Indicator (bottom-left)
- Current galaxy name
- Exploration progress: "3/7 explored"
- Fades when still, visible when moving

### Scan Prompt (center-bottom)
- "[Hold SPACE] to scan" when planet in range
- "[ENTER] to land" after scan complete
- "[Hold] to scan" on mobile

## Landing Transition

### Animation (1.2s total)
1. **Zoom toward planet** (0-0.8s) - ease-out curve
2. **Brief pause** (0.8-1.0s) - optional atmosphere tint
3. **Transition to surface** (1.0-1.2s) - fade/wipe

### Return
- `exitExploration()` triggers reverse animation
- Camera pulls back to orbit position

## File Structure

### New Files
```
src/components/3d/ScanSystem.tsx      # Scan detection + interaction
src/components/ui/ExplorerHUD.tsx     # Location + prompts
```

### Modified Files
```
src/lib/store.ts                      # Add scan state + actions
src/components/3d/GalaxyScene.tsx     # Integrate ScanSystem
src/components/3d/RealisticPlanet.tsx # Gate clicks behind scan
src/components/3d/EnhancedProjectStars.tsx # Pass scan state to planets
```

## Implementation Order

1. State management (store.ts)
2. Scan detection logic (ScanSystem.tsx)
3. Visual feedback (progress ring, floating data)
4. HUD components (ExplorerHUD.tsx)
5. Gate planet clicks (RealisticPlanet.tsx)
6. Landing animation refinement

## Out of Scope (Phase 2+)

- Radar/minimap with blips
- Cockpit frame chrome
- Atmosphere entry effects
- Planet surface exploration
- Artifact collection
