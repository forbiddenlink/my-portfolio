# 🌌 Galaxy Portfolio

Elizabeth Stein's interactive 3D portfolio - an Awwwards-quality experience showcasing 60+ projects across 6 galaxies with planetary exploration.

## ✨ Features

### 🚀 3D Galaxy Experience
- **Interactive Solar System**: Navigate 60+ projects represented as realistic planets
- **Planetary Exploration**: Land on planets and walk around in first-person mode (WASD controls)
- **Cinematic Animations**: GSAP-powered camera transitions and landing sequences
- **Procedural Planets**: GLSL shaders with realistic atmospheres, clouds, and ring systems

### ⌨️ Advanced Navigation
- **Command Palette** (CMD/CTRL+K): Quick search and exploration commands
- **Keyboard Shortcuts**: Arrow keys, 1-6 for galaxies, Enter/Escape navigation
- **Deep Linking**: Share direct links to projects with `/?p=[slug]`
- **Minimap Navigator**: Overview of entire galaxy system

### 🎨 Modern UI/UX
- Glassmorphism design with backdrop blur effects
- Custom cursor with spotlight and particle trails
- Touch gesture support for mobile devices
- Holographic project panels in exploration mode
- Ambient glow orbs and morphing backgrounds

### 🎯 SEO & Performance
- **< 200KB Initial Bundle**: 3D scene lazy-loaded for instant FCP
- **SSG for All Routes**: `/work` and `/work/[slug]` pre-rendered
- **Comprehensive SEO**: Sitemap, robots.txt, JSON-LD, Open Graph, Twitter Cards
- **Error Boundaries**: Graceful WebGL fallback for unsupported browsers
- **Analytics Ready**: Google Analytics integration

## 🚀 Quick Start

```bash
# Install dependencies
npm install  # or: pnpm install, bun install

# Copy environment template
cp .env.example .env.local

# Run development server
npm run dev

# Build for production
npm run build
npm run start
```

Visit [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **UI**: React 19.2.3, TypeScript 5.9.3, Tailwind CSS 4.1.18
- **3D**: Three.js, React Three Fiber, React Three Drei
- **Animation**: GSAP, Framer Motion
- **State**: Zustand
- **Fonts**: Space Grotesk, JetBrains Mono (Google Fonts)

## 🌟 What's Built

- ✅ Full 3D galaxy visualization with realistic planet shaders
- ✅ First-person planetary exploration mode with WASD controls
- ✅ Command Palette with search and quick actions
- ✅ Keyboard navigation and shortcuts
- ✅ Deep linking support (`/?p=[project-id]`)
- ✅ `/work` list view (SSG, crawlable)
- ✅ `/work/[slug]` case study pages (SSG with OG images)
- ✅ Sitemap + robots.txt generation
- ✅ JSON-LD structured data for SEO
- ✅ Contact section with email/LinkedIn/GitHub
- ✅ Resume download button
- ✅ Google Analytics integration
- ✅ Error boundaries for WebGL fallback
- ✅ PWA manifest

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout + SEO + Error Boundary
│   ├── page.tsx                # 3D Galaxy homepage
│   ├── globals.css             # Tailwind + custom styles
│   ├── sitemap.ts              # Auto-generated sitemap
│   ├── robots.ts               # SEO robots config
│   ├── manifest.ts             # PWA manifest
│   └── work/
│       ├── page.tsx            # SSG list view
│       └── [slug]/
│           └── page.tsx        # SSG case studies with OG images
├── components/
│   ├── 3d/
│   │   ├── GalaxyScene.tsx           # Main 3D container
│   │   ├── RealisticPlanet.tsx       # Procedural planet shaders
│   │   ├── PlanetSurfaceExplorer.tsx # First-person exploration
│   │   ├── SpaceshipLanding.tsx      # Cinematic landing animation
│   │   └── CameraController.tsx      # GSAP camera transitions
│   ├── ui/
│   │   ├── CommandPalette.tsx        # CMD+K quick actions
│   │   ├── KeyboardNavigation.tsx    # Arrow key controls
│   │   ├── ProjectModal.tsx          # Project detail modal
│   │   ├── ContactSection.tsx        # Email/social links
│   │   ├── ResumeDownload.tsx        # Resume PDF download
│   │   ├── ExplorationOverlay.tsx    # Planetary exploration UI
│   │   └── HolographicProjectPanel.tsx
│   ├── projects/
│   │   └── ProjectCaseStudy.tsx      # Shared case study component
│   ├── Analytics.tsx                 # Google Analytics
│   └── ErrorBoundary.tsx             # WebGL fallback
└── lib/
    ├── types.ts                # TypeScript interfaces
    ├── galaxyData.ts           # Single source of truth (60+ projects)
    ├── store.ts                # Zustand state management
    └── utils.ts                # Helper functions
```

## ⚙️ Configuration

### Environment Variables

Create `.env.local`:

```env
# Required
NEXT_PUBLIC_SITE_URL=https://elizabethstein.com

# Optional - Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Customization

**Add Projects**: Edit `src/lib/galaxyData.ts`:

```typescript
{
  id: 'my-project',
  title: 'My Project',
  description: 'Description here',
  role: 'Developer',
  tags: ['React', 'TypeScript'],
  color: '#FF6B35',
  brightness: 1.5,
  size: 'large',
  galaxy: 'fullstack',
  links: { github: '...', live: '...' },
  featured: true,
  dateRange: '2024',
}
```

**Update Contact Info**:
- Edit `src/components/ui/ContactSection.tsx` with your links
- Update `src/app/layout.tsx` JSON-LD schema

**Add Resume**: Place PDF at `public/resume.pdf`

## ⌨️ Keyboard Shortcuts

- **Arrow Keys**: Navigate between projects/galaxies
- **1-6**: Jump to specific galaxy
- **Enter**: Select/zoom into project or galaxy
- **Escape**: Zoom out / return to previous view
- **H**: Return home (universe view)
- **CMD/CTRL + K**: Open command palette
- **?**: Show keyboard shortcuts help

## 🎮 Exploration Mode

Use Command Palette (CMD+K) → "🚀 Explore [Project]" to:
- Watch cinematic landing animation
- Walk around planet surface with **WASD controls**
- **Mouse**: Look around (pointer lock)
- View holographic project details
- Leave footprint trails

## 🔗 Routes

- `/` - 3D Galaxy experience (lazy-loaded)
- `/work` - Project list view (SSG, fast path)
- `/work/[slug]` - Individual project pages (SSG)
- `/sitemap.xml` - Auto-generated sitemap
- `/robots.txt` - SEO configuration

## 🎯 Performance

- ✅ **< 200KB** initial bundle (3D lazy-loaded)
- ✅ **SSG** for all `/work` routes
- ✅ **60 FPS** 3D rendering on desktop
- ✅ **AVIF/WebP** image optimization
- ✅ **Code splitting** for optimal loading

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Requires WebGL**. Error boundary provides fallback for unsupported browsers.

## 🚀 Deployment

```bash
# Build
npm run build

# Deploy to Vercel (recommended)
vercel deploy
```

## 📝 Notes

**Single Source of Truth**: All project data in `src/lib/galaxyData.ts`

**Deep Linking**: 3D selection updates URL with `/?p=[slug]`. Canonical URL is `/work/[slug]`

**State Management**: Zustand store tracks view state (universe | galaxy | project | exploration)

---

**Elizabeth Stein** - Full-Stack Developer & AI Integration Specialist
[GitHub](https://github.com/forbiddenlink) • [LinkedIn](https://linkedin.com/in/imkindageeky)
