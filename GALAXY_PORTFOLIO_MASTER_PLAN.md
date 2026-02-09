# 🌌 Galaxy Portfolio - Master Implementation Plan
**Project:** Elizabeth Stein's Portfolio  
**Goal:** Awwwards-quality 3D galaxy portfolio showcasing 30+ projects  
**Stack:** Next.js 15, React Three Fiber, GSAP, TypeScript  
**Timeline:** 4-6 weeks (MVP first, iterate second)

---

## 🎯 NON-NEGOTIABLES (MVP - Must Ship)

**These are locked. Everything else is backlog.**

### **Core Experience**
1. ✅ **Fast First Paint** - HTML shell loads < 1s, 3D lazy-loads after
2. ✅ **List View Route** (`/work`) - Crawlable, accessible, normal webpage
3. ✅ **6 Galaxy Taxonomy** - Enterprise, AI, Full-Stack, DevTools, Design, Experimental
4. ✅ **Shareable Case Study URLs** - `/work/coulson-one`, `/work/caipo`, etc.
5. ✅ **Mobile Works** - 30 FPS minimum, touch gestures, no postprocessing

### **3 Signature Interactions (The "Wow")**
1. ⭐️ **Supernova Centerpiece** - Coulson One massive star with "64,806 files" badge
2. 🕸️ **Flo Labs Constellation** - 9 connected projects showing leadership + systems thinking
3. 🔍 **3-Level Zoom** - Universe → Galaxy → Project (Google Earth style navigation)

**Everything else goes to "Season 2" backlog.**

### **Performance Budgets (Hard Caps)**
- **Draw Calls:** Desktop < 150, Mobile < 80
- **Triangles:** < 1.5M visible at once
- **Texture Memory:** Desktop < 200MB, Mobile < 80MB
- **FPS:** Desktop 60, Tablet 45, Mobile 30
- **Initial Bundle:** < 200KB (landing page, no framer-motion/heavy UI libs)
- **3D Scene Load:** Interactive in < 2s on 4G, < 4-6s on Fast 3G (acceptable)

### **Accessibility (Not Optional)**
- Keyboard navigation with roving focus (arrows + Enter)
- Visible focus indicators on all interactive elements
- List View doubles as screen reader experience
- Focus management on modal open/close
- `prefers-reduced-motion`: Default to List View, but toggle still available

### **SEO & Discoverability**
- Meta tags + OG images for every project
- `/work` route with all projects (SSG - static generation at build)
- Individual `/work/[slug]` routes (SSG from galaxyData.ts)
- JSON-LD structured data
- Sitemap.xml with all case studies
- **OG images:** Pre-made per project (simple, reliable)

### **Deep-Linking Behavior (Prevent Routing Chaos)**
- **Canonical case study URL:** `/work/[slug]` (indexable, OG images, JSON-LD)
- **3D selection URL:** `/?p=[slug]` (client-only state, supports back/forward navigation)
- **Escape hatch:** If user lands on `/?p=[slug]`, show 3D mode if available, otherwise redirect to `/work/[slug]` (handles WebGL failure/reduced-motion/old devices)

---

## 📦 Season 2 Catalog (Do NOT Build in MVP)

**Ship first, iterate second. These are great ideas for v2:**

- 🚀 Journey Mode with audio narration (2-3 day project)
- 🥚 Easter eggs (Konami code, Matrix mode) (1 day)
- ⏰ Time-of-day dynamic colors (4 hours)
- 🔥 Skill Heatmap Mode (1-2 days)
- 📱 Device shake gesture (2 hours)
- 🎵 Sound design & ambient audio (1 day)
- 🪐 Tech Stack Orbit (filterable) (2 days)
- 📊 Performance stats overlay (4 hours)
- 🎨 Custom shaders for effects (1-3 days)
- 💬 Real-time status indicators (4 hours)
- 🌐 Advanced particle interactions (1-2 days)
- 📈 Auto-generated OG images via Next.js (1 day)

**Why backlog?** Each adds 2-10 hours of dev + testing. MVP gets you hired; backlog keeps you interesting.

**Do NOT build these during Weeks 1-6.** They are scope grenades.

---

## 📊 PROJECT RESEARCH & ANALYSIS

### Research Findings (Dec 29, 2025)

#### 1. **Awwwards 3D Portfolio Insights**
- **Winning Examples:**
  - Bruno Simon's portfolio (car driving mechanics)
  - techinz.dev (Milky Way zoom journey)
  - SINGULARITY demo (performance + quality balance)
  - Unconventional Gallery by Ruinart
  
- **Key Success Factors:**
  - **Storytelling through interaction** (not just pretty visuals)
  - **Purposeful navigation** (scroll-based or click-driven)
  - **Performance-first** (60fps on desktop, 30fps mobile minimum)
  - **Accessibility considerations** (reduced motion, keyboard nav)
  - **Unique interaction model** (not generic template)

#### 2. **Three.js/R3F Performance Best Practices**
- ✅ **Instanced rendering** for repeated objects (100+ stars)
- ✅ **Minimize draw calls** (merge geometries, reuse materials)
- ✅ **LOD (Level of Detail)** for distant objects
- ✅ **Frustum culling** (automatic in Three.js)
- ✅ **Texture optimization** (WebP, power-of-2 sizes)
- ✅ **Disable post-processing on mobile** (conditional rendering)
- ✅ **Use `useFrame` with delta**, not setState
- ✅ **Cache Vector3/objects** outside components
- ✅ **Monitor performance** with r3f-perf package
- ❌ **Avoid:** Creating new objects in render loops
- ❌ **Avoid:** Too many materials (batch similar objects)
- ❌ **Avoid:** Heavy shadows (use baked lighting)

#### 3. **Galaxy Navigation Patterns**
- **Zoom-based:** Milky Way → Galaxy → Star System (Google Earth style)
- **Click-based:** Select galaxy → Camera transitions → Modal appears
- **Scroll-based:** Vertical scroll controls camera position
- **Hybrid:** Click to select + GSAP smooth transitions

**Decision:** **Hybrid click + GSAP** (most intuitive, best performance)

---

## 🗂️ COMPLETE PROJECT INVENTORY

### **🏢 ENTERPRISE SUPERNOVA** (Production Work)
**Size:** Supermassive | **Color:** `#FF6B35` | **Position:** Center (0, 0, 0)

| Project | Tech Stack | Your Role | Key Metrics | Status |
|---------|-----------|-----------|-------------|--------|
| **Coulson One** | TypeScript, React, Next.js | Software Engineer | 64,806 files | Production (Private) |
| **Flo Labs International** | Next.js 16, Strapi CMS | Design Team Lead | Main site | Live |
| **CAIPO.ai** | React, Next.js, Strapi | Design Team Lead | AI platform | Live |
| **FloStudios.ai** | React, Next.js | Design Team Lead | Studio site | Live |
| **MoodChanger.ai** | Next.js, Strapi | Design Team Lead | AI mood tool | Live |
| **Hephaestus International** | Next.js 16, Strapi | Design Team Lead | Corporate site | Live |
| **RoboCollective.ai** | Next.js, Strapi | Design Team Lead | AI collective | Live |
| **Space Ventures Institute** | Next.js 14, Strapi | Design Team Lead | Educational | Live |
| **TARRL** | Custom stack | Design Team Lead | Research site | Live |
| **Rocket Park Clients** | Craft CMS, Twig, Tailwind | Software Engineer | Multiple sites | Production |

**Your Contributions:**
- Led redesign of 6-site Flo Labs ecosystem
- Architected AI Travel Planner (22 AI prompts, 18 functions, 270 tests)
- Manage 3-4 developers, WordPress specialists, SEO team
- Craft CMS upgrades, Figma → Twig implementation
- MCP wrapper development

---

### **🤖 AI CONSTELLATION** (AI/ML Projects)
**Size:** Large | **Color:** `#00D9FF` | **Position:** (-20, 10, -5)

| Project | Description | Tech | Links |
|---------|-------------|------|-------|
| **StanceStream** | Real-time multi-agent AI platform | Redis, AI agents | Local project |
| **AI Travel Planner** | GPT-4, Whisper API, Mapbox integration | OpenAI, WebSockets | Part of Flo Labs |
| **Finance Quest** | AI financial literacy platform | TypeScript, AI coaching | [GitHub](https://github.com/forbiddenlink/finance-quest) |
| **ExplainThisCode.ai** | AI code explanation tool | TypeScript, OpenAI | Vercel deployment |
| **Dev Assistant Pro** | CI/CD + testing assistant | AI integration | Local project |
| **Autodocs AI** | Documentation generator | AI-powered | Local project |

---

### **💻 FULL-STACK NEBULA** (Complete Apps)
**Size:** Large | **Color:** `#9D4EDD` | **Position:** (15, 5, -8)

| Project | Description | Tech | Complexity |
|---------|-------------|------|------------|
| **Portfolio-Pro** | Learning platform (198 lessons, 96 projects) | Next.js 15, Stripe, Auth | ⭐️⭐️⭐️ |
| **Codebase Onboarding** | AI-powered dev onboarding (10x faster) | TypeScript, AI | ⭐️⭐️ |
| **TubeDigest** | Video content platform | Next.js | ⭐️⭐️ |
| **Quantum Forge** | Employee portal | Next.js | ⭐️ |

---

### **🛠️ DEV TOOLS SECTOR** (Developer Utilities)
**Size:** Medium | **Color:** `#06FFA5` | **Position:** (20, -5, 10)

| Project | Description | Status |
|---------|-------------|--------|
| **Accessibility Checker** | WCAG compliance testing (MIT License) | Open-source |
| **Claude Continuity Kit** | Session continuity for Claude Code | Open-source |
| **Claude Quickstarts** | 20+ AI agent templates | Open-source |
| **MCP Wrapper** | Model Context Protocol tooling | Flo Labs project |

---

### **🎨 DESIGN & CREATIVE CLUSTER** (UI/UX)
**Size:** Medium | **Color:** `#FF006E` | **Position:** (-15, -8, 12)

| Project | Type | Description |
|---------|------|-------------|
| **Color Studio** | Design tool | Color manipulation for designers |
| **Space Travel Website** | Showcase | Immersive space tourism site |
| **Scenic Forests** | Website | Modern cabin rental site |
| **Coding Jokes** | Fun project | 400+ jokes, 3D effects |
| **Grid & Go** | Client work | Food truck website |

---

### **🎮 EXPERIMENTAL ZONE** (Side Projects)
**Size:** Small | **Color:** `#FFB800` | **Position:** (10, -10, 15)

- Blackjack Game
- Spiral Sounds
- Zoom Grid Mayhem
- PixelForge Test

---

## 🏗️ TECHNICAL ARCHITECTURE

### **Core Architecture Rules**

**No Modal Content Duplication:**
- **Single source of truth:** `lib/galaxyData.ts` (all project data)
- `/work/[slug]` and the 3D modal both render the same `ProjectCaseStudy` component
- Prevents maintaining two versions of every case study

**Camera/Navigation State Machine:**
- `view = universe | galaxy | project` (3 states, no more)
- Transitions only happen via GSAP camera controller
- UI changes driven by `view` (not scattered booleans)

### **File Structure**
```
my-portfolio/
├── app/                          # Next.js 15 App Router
│   ├── page.tsx                  # Landing (loads 3D lazy)
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Tailwind + custom styles
│   ├── work/                     # CRITICAL: Crawlable routes
│   │   ├── page.tsx              # List view (all projects)
│   │   └── [slug]/               # Individual case studies
│   │       └── page.tsx          # SSG project detail
│   └── api/                      # API routes (analytics, contact)
│
├── components/
│   ├── 3d/                       # Three.js components (lazy loaded)
│   │   ├── GalaxyScene.tsx       # Main R3F Canvas
│   │   ├── GalaxySystem.tsx      # All galaxies container
│   │   ├── GalaxyCluster.tsx     # Individual galaxy
│   │   ├── StarField.tsx         # Instanced stars (1000s)
│   │   ├── CameraController.tsx  # GSAP camera animations
│   │   ├── PostProcessing.tsx    # Bloom (desktop only)
│   │   ├── TouchControls.tsx     # Mobile gestures
│   │   └── PerformanceMonitor.tsx # FPS tracking (DEV mode)
│   │
│   ├── projects/                 # Project display components
│   │   ├── ProjectCard.tsx       # For list view
│   │   ├── ProjectModal.tsx      # For 3D scene
│   │   └── ProjectGrid.tsx       # Responsive grid
│   │
│   ├── ui/                       # UI overlays
│   │   ├── GalaxyNavigation.tsx  # Sidebar galaxy selector
│   │   ├── LoadingScreen.tsx     # Initial load animation
│   │   ├── MobileMenu.tsx        # Responsive navigation
│   │   ├── ViewToggle.tsx        # Switch: 3D ⇄ List
│   │   └── FocusIndicator.tsx    # Keyboard navigation highlight
│   │
│   └── layout/
│       ├── Header.tsx            # Minimal header
│       └── Footer.tsx            # Contact info
│
├── lib/
│   ├── galaxyData.ts             # All project data
│   ├── types.ts                  # TypeScript interfaces
│   ├── utils.ts                  # Helper functions
│   └── constants.ts              # Colors, positions, config
│
├── public/
│   ├── textures/                 # Star textures, particles
│   └── models/                   # 3D assets (if any)
│
├── styles/
│   └── glassmorphism.css         # Custom glass effects
│
└── docs/
    ├── GALAXY_PORTFOLIO_MASTER_PLAN.md  # This file
    ├── PERFORMANCE.md            # Optimization notes
    └── DEPLOYMENT.md             # Vercel setup
```

---

### **Tech Stack Deep Dive**

#### Core
- **Next.js 15** (App Router, Server Components)
- **React 19** (Concurrent features)
- **TypeScript 5** (Strict mode)
- **Tailwind CSS 4** (JIT, custom design tokens)

#### 3D & Animation
- **@react-three/fiber** ^8.15.0 (R3F renderer)
- **@react-three/drei** ^9.100.0 (Helpers: Stars, PerspectiveCamera, etc.)
- **@react-three/postprocessing** ^2.16.0 (Bloom, Vignette)
- **three** ^0.160.0 (Core Three.js)
- **gsap** ^3.12.0 (Camera transitions)
- **@use-gesture/react** ^10.3.0 (Mobile touch)

#### Performance & Monitoring
- **r3f-perf** ^7.2.0 (FPS monitoring)
- **zustand** ^4.5.0 (Lightweight state)

#### UI & UX
- **framer-motion** ^11.0.0 (Modal animations ONLY - lazy loaded, never in landing bundle)
- **lucide-react** ^0.320.0 (Icons)
- **clsx** + **tailwind-merge** (Class management)

**Bundle Rule:** framer-motion must be code-split into modal/case-study chunk. Consider CSS + GSAP instead for MVP to keep landing < 200KB.

#### Developer Experience
- **ESLint** + **Prettier**
- **TypeScript strict mode**
- **Husky** (Git hooks)

---

### **Data Structure**

```typescript
// lib/types.ts
export interface Project {
  id: string;
  title: string;
  description: string;
  role: string;                    // "Design Team Lead", "Software Engineer"
  company?: string;                // "Flo Labs", "Rocket Park"
  tags: string[];                  // ["React", "Next.js", "AI"]
  // Position: Generated algorithmically from id + galaxy (not hand-coded)
  color: string;                   // Galaxy color
  brightness: number;              // 0.5 - 2.0
  size: 'small' | 'medium' | 'large' | 'supermassive';
  galaxy: string;                  // Galaxy ID
  metrics?: {                      // Optional stats
    files?: number;
    tests?: number;
    team?: number;
    users?: string;
  };
  links: {
    live?: string;
    github?: string;
    case_study?: string;
  };
  status: 'production' | 'live' | 'open-source' | 'local';
  featured?: boolean;              // Highlight important projects
}

// Position generation (deterministic)
function generateStarPosition(projectId: string, galaxyId: string, index: number): [number, number, number] {
  const seed = hashCode(projectId + galaxyId);
  const rng = seededRandom(seed);
  const angle = (index / projectsInGalaxy.length) * Math.PI * 2;
  const radius = 3 + rng() * 5;
  const x = Math.cos(angle) * radius;
  const y = (rng() - 0.5) * 2;
  const z = Math.sin(angle) * radius;
  return [x, y, z];
}

export interface Galaxy {
  id: string;
  name: string;
  tagline: string;                 // Short description
  color: string;                   // Primary color
  position: [number, number, number];
  projects: Project[];
  icon?: string;                   // Lucide icon name
}
```

---

## 🎨 DESIGN SYSTEM

### **Color Palette**
```css
:root {
  /* Galaxy Colors */
  --enterprise: #FF6B35;     /* Orange - Production work */
  --ai: #00D9FF;             /* Cyan - AI projects */
  --fullstack: #9D4EDD;      /* Purple - Complete apps */
  --devtools: #06FFA5;       /* Mint - Utilities */
  --design: #FF006E;         /* Hot Pink - Creative */
  --experimental: #FFB800;   /* Gold - Fun stuff */
  
  /* UI */
  --background: #000510;     /* Deep space blue-black */
  --text: #FFFFFF;
  --text-muted: rgba(255, 255, 255, 0.6);
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  
  /* Accents */
  --glow: rgba(0, 217, 255, 0.3);
  --highlight: #FFFFFF;
}
```

### **Typography**
- **Primary:** Inter (clean, modern)
- **Mono:** JetBrains Mono (code snippets)
- **Sizes:**
  - Hero: 4rem (64px)
  - H1: 3rem (48px)
  - H2: 2rem (32px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)

### **Spacing**
- Base unit: 8px
- Consistent use of Tailwind spacing scale

---

## 🎯 WOW FACTORS (Awwwards-Worthy)

### **CORE INTERACTIVE EXPERIENCES**

#### 1. **Supernova Effect for Coulson One** ⭐️⭐️⭐️
**The Centerpiece - Your Biggest Achievement**

- **Visual:** 
  - Massive pulsing star (3x larger than others)
  - Animated particle corona with color cycling
  - Volumetric glow effect (custom shader)
  - Floating metric badges: "64,806 files" • "Enterprise Platform" • "Production"
  
- **Interactions:**
  - **Hover:** Particle burst erupts outward
  - **Click:** Camera zooms VERY close, dramatic music swell
  - **Modal:** Full-screen takeover with screenshots, metrics, tech stack
  - **Easter egg:** Hold SHIFT + click = shows actual file structure visualization
  - Labels render as HTML overlays (screen-space, not 3D text)
- **Why it's unique:** Makes your biggest project feel MASSIVE and important
- **Implementation:** Custom GLSL shader + THREE.Points system

---

#### 2. **Constellation Lines - Flo Labs Network** ⭐️⭐️⭐️
**Visual Storytelling of Your Leadership**

- **Visual:**
  - 9 Flo Labs sites form interconnected web
  - Lines pulse with light traveling between projects
  - Each connection labeled with relationship ("Strapi Backend" → "All Sites")
  
- **Interactions:**
  - **Hover one project:** All connected projects highlight
  - **Click network:** Zoom to "system view" showing all 9 sites
  - **Data flow animation:** Particles travel along lines showing data architecture
  
- **Why it's unique:** Shows you don't just build projects, you build ECOSYSTEMS
- **Implementation:** THREE.Line with custom vertex shader for pulsing

---

#### 3. **Galaxy Zoom Levels** ⭐️⭐️⭐️
**Three Levels of Exploration**

- **Level 1 - Universe View (Default):**
  - See all 6 galaxies from distance
  - Gentle rotation, ambient particles
  - Galaxy names float in 3D space
  
- **Level 2 - Galaxy View:**
  - Camera glides into selected galaxy (2s GSAP animation)
  - Stars cluster by project type
  - Can see individual star sizes
  - "Constellation mode" - lines connect related projects
  
- **Level 3 - Project Focus:**
  - Camera zooms to individual star
  - Everything else blurs (depth of field)
  - Tech stack icons orbit the star
  - Modal slides in from right
  
- **Why it's unique:** Google Earth-style navigation but for your career
- **Implementation:** GSAP camera controller with easing functions

---

#### 4. **Tech Stack Orbit System** ⭐️⭐️
**Interactive Technology Filter**

- **Visual:**
  - When viewing a project, tech icons orbit like planets
  - React, TypeScript, Next.js, AI icons as 3D sprites
  - Orbit speed varies by "importance" to project
  
- **Interactions:**
  - **Hover icon:** Shows all projects using that tech
  - **Click icon:** Filters entire portfolio to only that tech stack
  - **Double-click:** Jump to largest project using that tech
  
- **Example Flow:**
  1. Click "TypeScript" icon on Finance Quest
  2. Universe zooms out, highlights ALL TypeScript projects
  3. See your TypeScript expertise across 20+ projects
  4. Click "Next.js" - further filters to Next.js projects only
  
- **Why it's unique:** Makes recruiters' job easy - "Show me all your React work"
- **Implementation:** Simple CSS transforms + Zustand filtering

---

#### 5. **Journey Mode** ⭐️⭐️⭐️ (Guided Tour)
**Automated Storytelling**

- **Button:** "🚀 Take the Journey" in header
- **Duration:** 2-3 minutes
- **Flow:**
  1. **Start:** "Hi, I'm Elizabeth. Let me show you my work..."
  2. **Enterprise Supernova:** Zooms to Coulson One - "Led development of 64K file platform..."
  3. **Flo Labs Network:** "I manage a team building 9 interconnected sites..."
  4. **AI Constellation:** "I specialize in AI integration..." (shows 6 AI projects)
  5. **Full-Stack Nebula:** "From learning platforms to dev tools..."
  6. **Finale:** Camera pulls back to universe view - "Want to explore more?"
  
- **Features:**
  - Voice-over narration (text-to-speech or recorded audio)
  - Background music (toggle-able)
  - Progress bar at bottom
  - Skip to any section
  - ESC to exit anytime
  
- **Why it's unique:** Recruiters can understand your work in 2 minutes without clicking
- **Implementation:** GSAP timeline + audio sync

---

#### 6. **Particle Interaction System** ⭐️⭐️
**Living, Breathing Universe**

- **Ambient Particles:**
  - 5,000 tiny stars drift slowly
  - React to camera movement (parallax)
  - Some particles are "shooting stars" that streak across periodically
  
- **Interactive Particles:**
  - **Mouse movement:** Nearby particles repel slightly
  - **Click anywhere:** Particle burst at cursor
  - **Galaxy selection:** Particles swirl toward selected galaxy
  - **Project hover:** Particles orbit the star
  
- **Why it's unique:** Makes empty space feel alive and responsive
- **Implementation:** THREE.Points with CPU-based animation for interactivity

---

#### 7. **Project Size = Importance** ⭐️⭐️
**Visual Hierarchy Through Scale**

| Size | Projects | Visual Scale |
|------|----------|--------------|
| **Supermassive** | Coulson One | 3x normal, bright glow |
| **Large** | Flo Labs sites (9), Portfolio-Pro, StanceStream | 2x normal, medium glow |
| **Medium** | Finance Quest, Dev tools, Major projects | 1x normal, subtle glow |
| **Small** | Side projects, experiments | 0.5x normal, dim |

- **Why it's unique:** Instantly shows what matters most
- **Implementation:** Simple scale values in project data

---

#### 8. **Performance Stats Overlay** ⭐️
**Show Your Technical Prowess**

- **Toggle:** Press `P` key or click icon
- **Display:**
  - FPS (60 target)
  - Draw calls (optimization metric)
  - Triangles rendered
  - Memory usage
  - Star count (instanced)
  
- **Purpose:** 
  - Shows you understand performance
  - Demonstrates optimization skills
  - Impressive to technical recruiters
  
- **Why it's unique:** Few portfolios show the "behind the scenes"
- **Implementation:** r3f-perf + custom UI overlay

---

#### 9. **Easter Eggs** 🥚 (Hidden Features)
**Delight for Curious Recruiters**

1. **Konami Code:** `↑ ↑ ↓ ↓ ← → ← → B A`
   - Activates "Matrix Mode" - green stars rain down
   - Shows you're fun + know gaming culture
   
2. **Click Background 10 Times:**
   - "Secret Developer Mode" unlocks
   - Shows wireframe view, camera position, debug info
   
3. **Type "HIRE ME":**
   - All stars spell out "HIRE ME" in formation
   - Then return to normal positions
   
4. **Long Press Any Star (3s):**
   - Shows "commit history" for that project
   - How many hours worked, lines of code (estimated)
   
- **Why it's unique:** Rewards exploration, shows personality
- **Implementation:** Event listeners + state changes

---

#### 10. **Mobile Gesture Magic** 📱
**Touch-Optimized Interactions**

- **Pinch Zoom:** Smooth zoom in/out
- **Swipe:** Rotate camera around universe
- **Tap:** Select star
- **Double Tap:** Quick zoom to project
- **Two-finger tap:** Galaxy selector menu
- **Long press:** Quick info tooltip (no modal)
- **Shake device:** Shuffle to random project

- **Why it's unique:** Most 3D portfolios suck on mobile - yours won't
- **Implementation:** @use-gesture/react library

---

#### 11. **Dynamic Time of Day** ⏰
**Subtle Environmental Storytelling**

- **Morning (6am-12pm):** Warm golden stars, sunrise colors
- **Afternoon (12pm-6pm):** Bright white stars, high contrast
- **Evening (6pm-10pm):** Purple/orange gradient, sunset vibes
- **Night (10pm-6am):** Deep blues, cooler tones, more atmospheric

- **Detects:** User's local time via JavaScript
- **Why it's unique:** Portfolio adapts to when recruiter visits
- **Implementation:** Simple color interpolation based on time

---

#### 12. **Project Status Indicators** 🟢
**Real-Time Status Badges**

- **🟢 Live/Production:** Pulsing green glow
- **🔵 In Development:** Animated blue shimmer
- **🟡 Open Source:** Yellow star icon
- **⚪️ Archived:** Dim, grayscale

- **Why it's unique:** Shows what's active RIGHT NOW
- **Implementation:** Different material emissive values

---

#### 13. **Skill Heatmap Mode** 🔥 (Optional Toggle)
**Visual Skills Breakdown**

- **Button:** "Skills View" in navigation
- **Effect:** 
  - Galaxies rearrange by skill type (React, AI, Design, etc.)
  - Color intensity = proficiency level
  - Shows skill distribution across work
  
- **Example:** "AI" view shows all AI projects grouped together
- **Why it's unique:** Different way to explore your expertise
- **Implementation:** Smooth position transitions with GSAP

---

### **UNIQUENESS FACTORS** 🌟

#### **What Makes This Different from Other 3D Portfolios:**

1. **Storytelling Through Grouping** - Not random stars, but meaningful galaxies representing career phases
2. **Scale = Importance** - Visual hierarchy instantly shows what matters
3. **Interconnected Work** - Constellation lines show you build systems, not just apps
4. **Multiple Zoom Levels** - Universe → Galaxy → Project (like Google Earth)
5. **Journey Mode** - Passive experience for busy recruiters
6. **Tech Stack as Navigation** - Filter by technology interactively
7. **Easter Eggs** - Personality and fun
8. **Performance Showcase** - Meta-technical feature
9. **Time-Aware** - Adapts to when it's viewed
10. **Mobile-First 3D** - Most 3D portfolios ignore mobile - you don't

---

### **COMPARISON TO EXISTING PORTFOLIOS**

| Portfolio | What They Do | What You'll Do Better |
|-----------|--------------|----------------------|
| **Bruno Simon (bruno-simon.com)** | Car drives around, fun interactions | Your galaxy has PURPOSE - each star = real work |
| **techinz.dev** | Zoom from galaxy to desk | You zoom to MULTIPLE galaxies, each meaningful |
| **Generic 3D portfolios** | Pretty but static | Yours has 13 interactive features |
| **Traditional portfolios** | Boring grid of cards | Yours is an EXPERIENCE |

---

### **THE "WOW" MOMENT SEQUENCE**

**First 10 Seconds:**
1. Site loads → Beautiful space scene fades in
2. Ambient particles drift by
3. 6 galaxies gently rotate
4. Text appears: "Elizabeth Stein - Full-Stack Engineer"
5. Soft "whoosh" sound (if audio enabled)

**First Click:**
1. User clicks "Enterprise Supernova"
2. Camera glides smoothly (GSAP magic)
3. Coulson One grows massive
4. Particles swirl around it
5. Badge appears: "64,806 files"
6. User thinks: "Holy shit, this is impressive"

**30 Seconds In:**
1. User discovers Journey Mode
2. OR clicks tech stack icon
3. OR hovers constellation lines
4. Realizes: "This isn't just pretty, it's FUNCTIONAL"

**1 Minute In:**
1. User on mobile tries pinch zoom
2. Works perfectly
3. Taps a star, smooth modal appears
4. Thinks: "This person knows how to build UX"

**Result:** Recruiter spends 5+ minutes exploring instead of 30 seconds on a traditional portfolio.

---

## 📱 MOBILE STRATEGY

### **Performance Budgets (Hard Caps)**

**Draw Calls:**
- Desktop: < 150 (target: ~100)
- Mobile: < 80 (target: ~50)
- How: Instanced rendering, merged geometries

**Geometry:**
- Total triangles visible: < 1.5M
- Instanced stars: 3000 (mobile) → 8000 (desktop)
- **Star rendering:** Points/sprites (no mesh spheres) for MVP
- LOD: Swap high-poly → low-poly beyond 50 units

**Materials:**
- Reuse small set of shared materials (one per galaxy + one highlight + one dim)
- Avoid per-star materials (use instancing + vertex colors instead)
- Draw calls = unique material + geometry combos

**Textures:**
- Desktop: < 200MB VRAM
- Mobile: < 80MB VRAM
- Format: WebP, power-of-2 sizes
- No textures > 2048×2048

**FPS Targets:**
- Desktop: 60 FPS (locked)
- Tablet: 45 FPS (acceptable)
- Mobile: 30 FPS (minimum)
- Monitoring: r3f-perf in DEV mode

### **Adaptive Quality Tiers**
```typescript
const isMobile = window.innerWidth < 768;
const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

const QUALITY_TIERS = {
  mobile: {
    starCount: 3000,
    postProcessing: false,
    dpr: [1, 1],
    shadows: false,
    particleCount: 500,
    drawCallTarget: 50,
  },
  tablet: {
    starCount: 5000,
    postProcessing: false,
    dpr: [1, 1.5],
    shadows: false,
    particleCount: 1500,
    drawCallTarget: 80,
  },
  desktop: {
    starCount: 8000,
    postProcessing: true, // Bloom only
    dpr: [1, 2],
    shadows: false, // Still expensive
    particleCount: 3000,
    drawCallTarget: 100,
  },
};
```

### **Touch Controls**
- **Pinch:** Zoom in/out
- **Swipe:** Rotate camera
- **Tap:** Select star
- **Long press:** Quick info tooltip

### **Mobile UI**
- **Bottom sheet:** Project details (not modal)
- **Hamburger menu:** Galaxy selector
- **Simplified nav:** Essential links only

---

## 🚀 IMPLEMENTATION PHASES

### **Phase 1: Foundation** (Week 1)
**Goal:** Fast-loading site with List View + basic 3D

- [ ] Next.js 15 + TypeScript setup
- [ ] Create `/work` route with SSG (generateStaticParams + build-time data)
- [ ] Create `/work/[slug]` routes for each project
- [ ] Add meta tags, OG images, JSON-LD
- [ ] Lighthouse score 95+ on `/work` route
- [ ] Install R3F, Drei, GSAP (lazy loaded)
- [ ] Basic Canvas with camera (loads after HTML)
- [ ] Create galaxy data structure (all projects)
- [ ] Implement static star placement
- [ ] Simple click detection
- [ ] View toggle: 3D ⇄ List

**Deliverable:** Fast List View + basic 3D scene

---

### **Phase 2: MVP Interactions** (Week 2)
**Goal:** 3 signature interactions working

- [ ] **Supernova:** Coulson One 3x size + badge
- [ ] **Constellation:** Flo Labs connection lines
- [ ] **Zoom levels:** Universe → Galaxy → Project (state machine: `view` enum)
- [ ] GSAP camera controller
- [ ] Galaxy selector sidebar
- [ ] Project modal (renders shared `ProjectCaseStudy` component)
- [ ] Keyboard navigation with roving focus
- [ ] Focus indicators visible

**Deliverable:** Core "wow" experience complete

---

### **Phase 3: Polish & Performance** (Week 3)
**Goal:** Hit performance budgets

- [ ] Instanced rendering (8000 stars desktop)
- [ ] Post-processing (Bloom, desktop only)
- [ ] Particle system (ambient background)
- [ ] Glassmorphism UI components
- [ ] Loading screen animation
- [ ] Performance profiling with r3f-perf
- [ ] Draw calls < 150 desktop, < 80 mobile
- [ ] FPS: 60 desktop, 30 mobile
- [ ] Bundle size check

**Deliverable:** Fast + beautiful

---

### **Phase 4: Mobile & Accessibility** (Week 4)
**Goal:** Works great on all devices

- [ ] Touch gestures (pinch, swipe, tap)
- [ ] Mobile quality tier (3000 stars, no FX)
- [ ] Tablet quality tier
- [ ] Keyboard navigation complete
- [ ] Focus management (modals, traps)
- [ ] Screen reader testing on List View
- [ ] `prefers-reduced-motion` → default to List View (toggle available)
- [ ] WebGL context loss handler + "Reload 3D" button
- [ ] Cross-device testing

**Deliverable:** Mobile + accessible

---

### **Phase 5: Content & SEO** (Week 5)
**Goal:** Complete project information + discoverable

- [ ] Write descriptions for all projects
- [ ] Add screenshots/videos to case studies
- [ ] Tech stack badges
- [ ] Create pre-made OG images (1200×630) for each project
- [ ] Project metrics display (files, tests, team size)
- [ ] Sitemap.xml generation
- [ ] JSON-LD structured data
- [ ] Submit to Google Search Console

**Deliverable:** Crawlable, indexable, shareable

---

### **Phase 6: Launch** (Week 6)
**Goal:** Ship MVP to production

- [ ] Analytics integration (Vercel Analytics)
- [ ] Lighthouse audit: Perf 90+, A11y 100
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] WebPageTest on 3G (Fast 3G baseline)
- [ ] Deploy to Vercel
- [ ] Custom domain setup
- [ ] Share on LinkedIn, Twitter
- [ ] Submit to Awwwards (if confident)

**Deliverable:** Live MVP

---

### **Phase 7+: "Season 2" Features** (Post-Launch)
**Goal:** Iterate based on feedback

- [ ] Journey Mode with audio
- [ ] Easter eggs (if fun)
- [ ] Tech stack filtering
- [ ] Performance stats overlay
- [ ] Time-of-day colors
- [ ] Additional polish based on user feedback

**Deliverable:** Continuous improvement

---

## ⚠️ RISKS & MITIGATIONS

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Performance on mobile** | High | Adaptive quality settings, extensive testing |
| **Too many projects = cluttered** | Medium | Prioritize featured projects, algorithmic positioning |
| **3D intimidating for recruiters** | Low | List View default for reduced motion, always available |
| **Accessibility concerns** | High | Keyboard nav, ARIA labels, screen reader testing |
| **Long load time** | Medium | Code splitting, lazy loading, List View instant |
| **Browser compatibility** | Low | Three.js widely supported, graceful degradation |
| **WebGL context loss (mobile)** | Medium | Context loss handler, "Reload 3D" button, List View still works |

---

## 📈 SUCCESS METRICS

### **Technical (MVP)**
- [ ] Lighthouse Performance: 90+ (`/work` route)
- [ ] Lighthouse Accessibility: 100 (all routes)
- [ ] FPS: 60 (desktop), 30 (mobile) in 3D scene
- [ ] TTI: < 2s on `/work` (SSG)
- [ ] Landing route: FCP < 1s (HTML shell), 3D loads after
- [ ] 3D scene: Interactive in < 2s on 4G, < 6s on Fast 3G
- [ ] Draw calls: < 150 desktop, < 80 mobile
- [ ] Triangles: < 1.5M visible

### **User Experience**
- [ ] Intuitive navigation (no tutorial needed)
- [ ] Works on 95%+ devices
- [ ] Zero critical accessibility issues
- [ ] Positive feedback from 3+ designers/developers

### **Career Impact**
- [ ] Submittable to Awwwards
- [ ] Showcases technical + design skills
- [ ] Demonstrates leadership (Flo Labs work)
- [ ] Unique enough to stand out

---

## 🔗 RESOURCES & REFERENCES

### **Inspiration**
- https://bruno-simon.com (iconic portfolio)
- https://techinz.dev (galaxy zoom concept)
- https://unconventionalgallery.ruinart.com/ (luxury + 3D)
- https://www.kodeclubs.com (high performance)

### **Documentation**
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Manual](https://threejs.org/manual/)
- [GSAP Docs](https://greensock.com/docs/)
- [R3F Performance Guide](https://r3f.docs.pmnd.rs/advanced/pitfalls)

### **Tools**
- [r3f-perf](https://github.com/utsuboco/r3f-perf) - Performance monitoring
- [Blender](https://www.blender.org/) - 3D asset creation (if needed)
- [gltf.report](https://gltf.report/) - Optimize 3D models

---

## 📝 DECISION LOG

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-12-29 | MVP = 3 interactions only | Prevent scope creep, ship faster |
| 2025-12-29 | `/work` List View required | SEO, accessibility, fast path for recruiters |
| 2025-12-29 | Lazy-load 3D scene | HTML shell < 1s, meets realistic perf targets |
| 2025-12-29 | No shadows, limited postprocessing | Performance budget prioritization |
| 2025-12-29 | SSG (not SSR) for `/work` routes | Faster TTFB, better caching, static from galaxyData.ts |
| 2025-12-29 | Algorithmic star positioning | Deterministic from project ID + galaxy, avoids hand-coding |
| 2025-12-29 | Constellation labels as HTML overlays | Cheaper than 3D text, better on mobile |
| 2025-12-29 | Pre-made OG images | Simpler than auto-generation, locks Week 5 scope |
| 2025-12-29 | WebGL context loss handler | Mobile Safari resilience, List View always works |
| 2025-12-29 | Individual `/work/[slug]` routes | Shareable links, OG images, indexing |
| 2025-12-29 | Use fresh Next.js setup, not portfolio-pro | Portfolio-pro is a project TO showcase, not the portfolio itself |
| 2025-12-29 | Hybrid click + GSAP navigation | Best balance of performance and UX |
| 2025-12-29 | 6 galaxies (not 5) | Better categorization for 30+ projects |
| 2025-12-29 | Instanced rendering for stars | Essential for 1000s of objects |
| 2025-12-29 | Reduced motion fallback required | WCAG AAA compliance |
| 2025-12-29 | Deep-linking strategy | 3D scene stays on `/` but updates URL with query param (`/?p=coulson-one`) on star selection for back/forward navigation. Canonical shareable page remains `/work/[slug]`. Best of both worlds without routing complexity |

---

## ✅ NEXT ACTIONS

**Ready to proceed when you approve:**

1. **Review this plan** - Any changes to structure/galaxies/phases?
2. **Confirm priorities** - Which projects to feature most prominently?
3. **Design preferences** - Any specific visual references you love?
4. **Start Phase 1** - Scaffold the Next.js project with dependencies

**Your call! What do you think of this plan?**
