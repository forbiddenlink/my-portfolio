# Manual Testing Checklist - Portfolio Galaxy

**Date:** February 21, 2026  
**Tester:** Ready for manual verification

---

## 🎯 Critical Functionality

### Planet Interactions
- [ ] **Click any planet** → Should zoom to project view
- [ ] **Click during zoom** → Should not double-trigger
- [ ] **Hover over planet** → Should show scale effect (1.1x) and enhanced glow
- [ ] **Cursor changes** → Pointer on hover, auto on leave
- [ ] **Supernova planet** (Coulson One) → Special glow effect visible

### Navigation
- [ ] **Arrow Keys** → Navigate between projects/galaxies
- [ ] **Number keys 1-6** → Jump to specific galaxy
- [ ] **Enter key** → Select highlighted project/galaxy
- [ ] **Escape key** → Zoom out to previous view
- [ ] **H key** → Return to universe view
- [ ] **CMD/CTRL + K** → Open command palette

### Command Palette (CMD+K)
- [ ] **Opens smoothly** → Modal appears with search
- [ ] **Search projects** → Filters results in real-time
- [ ] **Select project** → Zooms to selected project
- [ ] **Explore command** → Triggers landing/exploration mode
- [ ] **ESC closes** → Command palette dismisses

### View States
- [ ] **Universe view** → All 6 galaxies visible
- [ ] **Galaxy view** → Single galaxy with planets
- [ ] **Project view** → Zoomed into specific project
- [ ] **Exploration mode** → First-person planetary surface (if enabled)

---

## 🎨 Visual Quality

### 3D Scene
- [ ] **No flickering** → Scene renders stably
- [ ] **Smooth transitions** → Camera moves are fluid
- [ ] **60 FPS** → Check performance monitor (if visible)
- [ ] **Planet shaders** → Procedural surfaces render correctly
- [ ] **Atmosphere glow** → Visible around planets
- [ ] **Star field** → Background stars visible and twinkling

### Connection Lines (ProjectRelationships)
- [ ] **Visible in galaxy view** → Lines connect related projects
- [ ] **Flowing particles** → When project selected, particles animate
- [ ] **Correct colors** → Lines match technology type (AI = cyan, etc.)
- [ ] **Labels on hover** → Shared tags display (e.g., "AI • Next.js")

### UI Elements
- [ ] **Header visible** → Name and title appear top-left
- [ ] **"View all work" button** → Bottom-left, properly styled
- [ ] **Glassmorphism effects** → Backdrop blur on cards
- [ ] **Contact section** → Email/LinkedIn/GitHub buttons (right side)
- [ ] **Instructions** → Bottom-right (desktop only)

---

## 📱 Mobile Experience

### Touch Interactions
- [ ] **Tap planet** → Zooms to project
- [ ] **Pinch to zoom** → Camera moves closer/farther
- [ ] **Swipe to rotate** → Galaxy rotates
- [ ] **Two-finger pan** → Camera pans
- [ ] **Double-tap** → Zooms in/out

### Mobile UI
- [ ] **Header readable** → Text not too small
- [ ] **"View all work" button** → Visible and clickable
- [ ] **No horizontal scroll** → Page fits screen width
- [ ] **Touch targets** → At least 44x44px (accessible)
- [ ] **Galaxy navigation** → Accessible on mobile (bottom nav)

### Performance (Mobile)
- [ ] **Loads in < 5 seconds** → On 4G connection
- [ ] **No jank** → Smooth scrolling and interactions
- [ ] **30 FPS minimum** → Acceptable frame rate
- [ ] **No memory leaks** → App doesn't slow down over time

---

## 🔗 Links & Content

### Navigation Links
- [ ] **"View all work"** → Goes to /work page
- [ ] **"More about me"** → Goes to /about page
- [ ] **Contact email** → Opens mail client
- [ ] **LinkedIn** → Opens profile in new tab
- [ ] **GitHub** → Opens profile in new tab

### Project Links (Sample Check)
Test 5-10 projects:
- [ ] **Flo Labs** → https://flolabs.international (works)
- [ ] **StanceStream** → https://stancestream.vercel.app (works)
- [ ] **Finance Quest** → https://financequest.fyi (works)
- [ ] **MCP Server Studio** → https://mcp-server-studio.vercel.app (works)
- [ ] **Portfolio Pro** → https://www.portfoliopro.dev (works)

### Project Data Accuracy
- [ ] **Project titles** → Correct and up-to-date
- [ ] **Descriptions** → Accurate and compelling
- [ ] **Technologies** → Match actual tech stack
- [ ] **Date ranges** → Current (2024-2026)

---

## ⚙️ Technical Checks

### Console Errors
- [ ] **No React errors** → Check browser console
- [ ] **No 404s** → All assets load correctly
- [ ] **No warnings** → Or only expected warnings

### SEO
- [ ] **Page title** → "Elizabeth Stein | Full-Stack Developer..."
- [ ] **Meta description** → Present and accurate
- [ ] **Open Graph tags** → Social sharing works
- [ ] **Sitemap exists** → /sitemap.xml accessible

### Accessibility
- [ ] **Keyboard navigation** → All interactive elements reachable
- [ ] **Focus indicators** → Visible focus states
- [ ] **Screen reader** → Proper aria labels (if tested)
- [ ] **Color contrast** → Text readable (WCAG AA)

---

## 🌐 Cross-Browser Testing

### Desktop Browsers
- [ ] **Chrome (latest)** → All features work
- [ ] **Firefox (latest)** → All features work
- [ ] **Safari (latest)** → All features work
- [ ] **Edge (latest)** → All features work

### Mobile Browsers
- [ ] **iOS Safari** → Touch and visuals work
- [ ] **Android Chrome** → Touch and visuals work

---

## 🎬 User Flows

### First Visit (New User)
1. [ ] Entrance screen appears (if enabled)
2. [ ] User clicks "Enter" or waits
3. [ ] Universe view loads smoothly
4. [ ] Instructions visible (desktop)
5. [ ] User can explore galaxies

### Project Discovery
1. [ ] User clicks a planet
2. [ ] Camera zooms to project
3. [ ] Project details visible
4. [ ] Links work correctly
5. [ ] User can zoom out (ESC)

### Command Palette Flow
1. [ ] User presses CMD+K
2. [ ] Search field focused
3. [ ] Types project name
4. [ ] Results filter in real-time
5. [ ] Selects project → zooms correctly

---

## 🐛 Known Issues to Check

From previous testing:
- [ ] **No scene flickering** → Fixed in previous commits
- [ ] **Planets all clickable** → Recently fixed (scan removed)
- [ ] **All links working** → Recently verified (100%)
- [ ] **No broken repos** → GitHub 404s removed

---

## ✅ Final Approval Checklist

Before sharing with recruiters:
- [ ] **Build passes** → `pnpm build` succeeds
- [ ] **No console errors** → Clean console
- [ ] **All links work** → Verified with link checker
- [ ] **Mobile works** → Tested on real device
- [ ] **Performance good** → 60 FPS desktop, 30+ FPS mobile
- [ ] **Content accurate** → All project info correct
- [ ] **Visually impressive** → "Wow" factor present

---

## 📝 Testing Notes

Use this space to record findings:

```
Desktop Chrome (MacBook Pro):
- [ ] 

Mobile Safari (iPhone):
- [ ] 

Issues Found:
- [ ] 

Suggestions:
- [ ] 
```

---

**Status:** Ready for manual testing  
**Next Step:** Run through checklist and document any issues found
