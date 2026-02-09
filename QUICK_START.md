# 🚀 Quick Start Guide - New Features

## Test Your New Portfolio Features in 2 Minutes

### 1️⃣ Start Development Server
```bash
npm run dev
# or
pnpm dev
```

### 2️⃣ Command Palette (30 seconds)
1. Press `CMD+K` (Mac) or `CTRL+K` (Windows/Linux)
2. Type "coulson" - watch it filter instantly
3. Use ↑↓ arrow keys to navigate
4. Press `Enter` to select
5. Press `ESC` to close

**Expected:** Instant project search, smooth animations

---

### 3️⃣ Particle Trail (10 seconds)
1. Just move your mouse around the screen
2. Watch the galaxy-colored particles follow

**Expected:** Smooth stardust trail with purple/pink/blue glow

---

### 4️⃣ Minimap Navigator (20 seconds)
1. Look at **bottom-right corner**
2. See the galaxy overview map
3. Hover over colored dots - see project names
4. Click any dot - instantly teleport
5. Click expand icon to enlarge

**Expected:** 2D map showing all projects, instant navigation

---

### 5️⃣ Enhanced Micro-interactions (30 seconds)
1. Hover over any project star in 3D space
2. Watch it "breathe" (scale pulse)
3. See particles orbit around it
4. See orbital ring spin
5. Notice the glow effect

**Expected:** Multi-layered hover effects, feels premium

---

### 6️⃣ Post-Processing Effects (10 seconds)
1. Look at the overall scene
2. Notice the cinematic depth of field
3. See the subtle vignette (darkened edges)
4. Watch the bloom glow on bright objects

**Expected:** Hollywood-quality visual polish

---

### 7️⃣ Share View Feature (30 seconds)
1. Navigate to an interesting position in 3D
2. Click **"Share View"** button (bottom-left)
3. See "Copied!" confirmation
4. Open new browser tab
5. Paste the URL
6. Watch camera animate to exact same position!

**Expected:** Shareable URL restores exact camera view

---

### 8️⃣ Dynamic OG Images (20 seconds)
1. Visit: `http://localhost:3000/api/og/coulson-one`
2. See beautiful auto-generated social preview
3. Try other project slugs:
   - `/api/og/flo-labs`
   - `/api/og/caipo-ai`
   - `/api/og/cosmic-web`

**Expected:** Unique OG image per project, 1200x630px

---

## 🎯 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `CMD+K` / `CTRL+K` | Open command palette |
| `↑` `↓` | Navigate command palette |
| `Enter` | Select command |
| `ESC` | Close command palette |
| `?` | Show keyboard shortcuts help |

---

## 🐛 Troubleshooting

### Command Palette not opening?
- Make sure you're pressing `CMD` (not `CTRL`) on Mac
- Check browser console for errors
- Try refreshing the page

### Particle trail not showing?
- Feature is **desktop-only**
- Touch devices won't show trail (prevents interference)
- Check if `matchMedia('(pointer: coarse)')` returns true

### Minimap not visible?
- It's in **bottom-right corner**
- Try scrolling down if hidden
- Check z-index conflicts

### Share View not working?
- Need to be in 3D scene (not list view)
- Check clipboard permissions
- Try the Web Share API on mobile

### OG Images not generating?
- Route is `/api/og/[slug]` not `/og/[slug].png`
- Must be valid project slug from galaxyData.ts
- Check Next.js server is running

---

## ✅ Success Checklist

- [ ] Command palette opens and searches
- [ ] Particle trail follows mouse
- [ ] Minimap shows all projects
- [ ] Clicking minimap dots jumps to projects
- [ ] Project stars breathe on hover
- [ ] Particles orbit hovered stars
- [ ] Share View copies URL
- [ ] Shared URLs restore camera position
- [ ] OG images generate correctly
- [ ] Everything works on mobile (except particle trail)

---

## 🎨 Customization Tips

### Change Particle Colors
Edit `/src/components/ui/ParticleTrail.tsx`:
```typescript
const colors = [
  '#YOUR_COLOR_1',
  '#YOUR_COLOR_2',
  // Add more colors
]
```

### Adjust Minimap Size
Edit `/src/components/ui/MinimapNavigator.tsx`:
```typescript
const size = isExpanded ? 400 : 220  // Change these values
```

### Modify Command Palette Shortcuts
Edit `/src/components/ui/CommandPalette.tsx`:
```typescript
// Change the shortcut key
if ((e.metaKey || e.ctrlKey) && e.key === 'p') {  // CMD+P instead
```

### Customize Post-Processing Intensity
Edit `/src/components/3d/GalaxyScene.tsx`:
```typescript
<Bloom
  intensity={0.9}  // Increase for more glow
  luminanceThreshold={0.3}  // Lower for more bloom
/>
```

---

## 📊 Performance Tips

If you experience frame drops:

1. **Reduce particle count**
   ```typescript
   // ParticleTrail.tsx
   if (particlesRef.current.length > 30) {  // Lower from 50
   ```

2. **Disable post-processing on mobile**
   ```typescript
   // GalaxyScene.tsx
   const isMobile = window.matchMedia('(max-width: 768px)').matches
   {!isMobile && <EffectComposer>...</EffectComposer>}
   ```

3. **Lower bloom quality**
   ```typescript
   <Bloom mipmapBlur={false} />  // Faster but less smooth
   ```

---

## 🚀 Deploy to Production

All features work out of the box:
```bash
npm run build
npm run start
```

Or deploy to Vercel:
```bash
vercel deploy
```

**Note:** OG images will generate on-demand via Edge runtime.

---

## 🎉 You're Ready!

Your portfolio now has:
- ✅ Modern quick navigation
- ✅ Delightful micro-interactions
- ✅ Cinematic visual quality
- ✅ Unique shareable views
- ✅ Professional social previews
- ✅ Spatial navigation aids

**Go impress some recruiters! 🌟**

---

## 📚 Documentation

- Full feature list: `NEW_FEATURES.md`
- Implementation details: `ENHANCEMENT_SUMMARY.md`
- Master plan: `GALAXY_PORTFOLIO_MASTER_PLAN.md`

---

## 💡 Need Help?

If something isn't working:
1. Check browser console for errors
2. Verify Node.js version (16+)
3. Clear `.next` cache: `rm -rf .next`
4. Reinstall dependencies: `npm install`

**Have fun exploring your new features! 🎊**
