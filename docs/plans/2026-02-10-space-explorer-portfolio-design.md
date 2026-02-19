# Space Explorer Portfolio - Design Document

**Date:** 2026-02-10
**Status:** Approved
**Goal:** Transform the portfolio from passive viewing to active exploration

---

## Overview

The portfolio becomes an explorable space experience where visitors pilot through your universe of work, scan planets to reveal project data, land on surfaces to discover story artifacts, and build a personal captain's log of their journey.

### Core Experience Loop

```
ARRIVE → CRUISE → SCAN → LAND → DISCOVER → RETURN → CRUISE...
```

1. **Arrive** - Enter the galaxy map, see universe of work from distance
2. **Cruise** - Travel between planets/galaxies (enhanced tour or free-fly)
3. **Scan** - Approach planet, hold to scan, reveal project data
4. **Land** - Swoop down through atmosphere to planet surface
5. **Discover** - Explore surface, find artifacts, collect story pieces
6. **Return** - Launch back to orbit, planet marked as explored

---

## Cruising & Scanning

### Ship HUD (Lightweight)

Subtle cockpit frame during exploration:
- Thin border/vignette suggesting viewport
- Bottom-left: mini scanner showing nearby planets as blips
- Bottom-right: current location ("AI Constellation")
- Top: subtle heading indicator

HUD fades when still, intensifies when moving. Never obstructs view.

### Scanning Mechanic

When approaching a planet within range:

1. Scanner blip pulses, optional audio ping
2. "Hold [Space] to Scan" prompt appears
3. 1-2 second scan with visual sweep effect
4. Data materializes around planet:
   - Project name in stylized text
   - 2-3 floating icons (tech stack)
   - Key metric if impressive ("702 tests", "64k files")
   - Surface preview glimpse
5. "Press [Enter] to Land" becomes available

**Visual States:**
- Unscanned: default planet appearance
- Scanned (not landed): faint data outline
- Landed: glowing "explored" marker

---

## Procedural Landing Environments

Non-hero planets generate environments from project metadata.

### Generation Layers

```
BASE TERRAIN    →  derived from galaxy (rocky, gaseous, crystalline)
ATMOSPHERE      →  project color + galaxy color blend
STRUCTURES      →  generated from project.tags
ARTIFACTS       →  placed from project.challenge/solution
AMBIENT LIFE    →  based on project.size and metrics
```

### Tag → Visual Library

| Tag | Visual Element |
|-----|----------------|
| AI / ML | Neural network nodes, data streams |
| React / Next.js | Component blocks, interconnected modules |
| TypeScript | Crystalline type-structures |
| Database | Data cylinders, query pulses |
| Real-time | Flowing rivers of light, live pulses |
| Testing | Shield generators, verification gates |
| Redis | Red pulsing data nodes |
| Stripe | Payment portals, transaction streams |
| Education | Book structures, knowledge paths |
| Security | Firewall walls, scanning beams |

### Galaxy Base Terrains

| Galaxy | Terrain Style |
|--------|---------------|
| Enterprise | Polished metal platforms, city structures |
| AI | Smooth data-planes, neural pathways |
| Full-Stack | Layered architecture, connected systems |
| DevTools | Workshop surfaces, tool racks |
| Design | Artistic landscapes, color gradients |
| Experimental | Wild terrain, unexpected forms |

---

## Hero Planets (Custom Experiences)

6 projects get fully hand-crafted landing experiences.

### Hero Selection

| Project | Concept |
|---------|---------|
| **Aria (AI Artist)** | Meet Aria creating art. Interact with mood system, see memories |
| **Coulson One** | Vast command center. Screens showing scale. Fly through 64k file tree |
| **Finance Quest** | Academy/dojo. See spaced-repetition in action. Test shields visible |
| **StanceStream** | Debate arena. Watch AI agents argue. Jump between perspectives |
| **Portfolio-Pro** | Transforming classroom. Walk through lesson environments |
| **TimeSlipSearch** | Retro time machine room. Dials showing different eras |

### What Makes Heroes Different

- Custom geometry (hand-modeled, not procedural)
- Interactive moments unique to that planet
- Narrated or discovered story beats
- Signature memorable visual/scene

---

## Discovery System

### Captain's Log

Persistent journal filling as you explore:
- Records each planet scanned and landed
- Stores collected story fragments
- Tracks exploration stats
- Accessible via hotkey or HUD button

### Artifacts

Glowing collectibles on planet surfaces:

| Type | Content | Visual |
|------|---------|--------|
| **Challenge Orb** | The problem solved | Red/orange glow |
| **Solution Crystal** | How you solved it | Blue/green glow |
| **Learning Shard** | What you learned | Purple glow |
| **Secret** | Easter egg, hidden story | Gold glow, harder to find |

Collection triggers animation, adds to log.

### Progress Tracking

- Galaxy completion rings (3/7 planets in AI Constellation)
- Total discovery percentage
- Optional achievements:
  - "Visited all 6 galaxies"
  - "Found 10 secrets"
  - "Completed a hero planet"
  - "100% explorer"

Non-punishing: rewards curiosity, doesn't block casual visitors.

---

## Technical Architecture

### New Components

```
src/components/3d/
├── ExplorerHUD.tsx              # Ship UI, scanner, minimap
├── ScanningSystem.tsx           # Scan interaction, data reveal
├── LandingTransition.tsx        # Atmosphere entry animation
├── PlanetSurface/
│   ├── ProceduralSurface.tsx    # Generated environments
│   ├── SurfaceElements.tsx      # Tag → visual mappings
│   └── heroes/
│       ├── AriaWorld.tsx
│       ├── CoulsonCommand.tsx
│       ├── FinanceAcademy.tsx
│       ├── StanceArena.tsx
│       ├── PortfolioClassroom.tsx
│       └── TimeSlipMachine.tsx
├── Artifacts.tsx                # Collectible orbs/crystals
└── CaptainsLog.tsx              # Journal UI overlay

src/lib/
├── explorerState.ts             # Zustand store for progress
├── proceduralGenerator.ts       # Tag → visual logic
└── artifactData.ts              # Story content for artifacts
```

### State Management

Extend existing Zustand store:

```typescript
interface ExplorerState {
  // Progress
  scannedPlanets: Set<string>
  landedPlanets: Set<string>
  collectedArtifacts: Set<string>

  // Journal
  captainsLog: LogEntry[]

  // Current state
  currentMode: 'cruise' | 'scanning' | 'landing' | 'surface'
  currentPlanet: string | null

  // Actions
  scanPlanet: (id: string) => void
  landOnPlanet: (id: string) => void
  collectArtifact: (id: string) => void
  returnToOrbit: () => void
}
```

### Data Extension

Add to each project in galaxyData.ts:

```typescript
artifacts: {
  challenge: "The problem this project solved...",
  solution: "How you approached and solved it...",
  learning: "Key insight or skill gained...",
  secret?: "Optional easter egg or hidden story..."
}
```

---

## Implementation Phases

### Phase 1: Foundation
- [ ] Explorer state management
- [ ] Basic HUD frame
- [ ] Scan interaction on existing planets
- [ ] Landing transition animation

### Phase 2: Procedural Surfaces
- [ ] Base terrain generator (per galaxy)
- [ ] Tag → visual element library (10-15 mappings)
- [ ] Basic surface exploration
- [ ] Return-to-orbit mechanic

### Phase 3: Discovery Layer
- [ ] Artifact placement on surfaces
- [ ] Collection interaction/animation
- [ ] Captain's Log UI
- [ ] Progress tracking

### Phase 4: Hero Planets
- [ ] Aria's World (proof of concept)
- [ ] Remaining 5 heroes
- [ ] Custom interactions per hero

### Phase 5: Polish
- [ ] Sound design
- [ ] Achievements system
- [ ] Secrets and easter eggs
- [ ] Mobile performance optimization

---

## Success Criteria

- Visitors spend 3x longer exploring than current passive tour
- Every project feels discoverable, not just viewable
- Hero planets create "screenshot moments" people share
- The experience feels like a game, not a slideshow
- Works smoothly on mobile (may have reduced features)

---

## Open Questions

- Keyboard vs mouse controls for surface exploration?
- Should there be a "quick tour" option for impatient visitors?
- How to handle 50+ artifact texts (need content strategy)?
- Persist progress across sessions (localStorage)?
