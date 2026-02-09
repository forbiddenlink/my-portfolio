# 🎯 Quick Integration Examples

Here are copy-paste examples to immediately improve your portfolio pages.

## 1. Enhanced Hero Section

Replace your current hero text with split text animations:

```tsx
import { SplitText, SplitWords } from '@/components/ui/SplitText'

export function Hero() {
  return (
    <section className="hero">
      <SplitText 
        className="text-7xl font-bold mb-4"
        delay={0.3}
      >
        Elizabeth Stein
      </SplitText>
      
      <SplitWords 
        className="text-2xl text-white/80"
        delay={0.8}
      >
        Full-Stack Developer & AI Integration Specialist
      </SplitWords>
    </section>
  )
}
```

## 2. Project Grid with Scroll Reveals

Add scroll-triggered animations to your project grid:

```tsx
import { ScrollReveal, ScrollStagger } from '@/components/ui/ScrollReveal'
import { EnhancedImage } from '@/components/ui/EnhancedImage'

export function ProjectGrid({ projects }) {
  return (
    <ScrollStagger staggerDelay={0.15} className="grid grid-cols-3 gap-8">
      {projects.map((project, index) => (
        <ScrollReveal key={project.id} direction="up">
          <div className="project-card">
            <EnhancedImage
              src={project.image}
              alt={project.title}
              hoverScale={1.08}
              hoverRotate={3}
              className="rounded-lg"
            />
            <h3 className="mt-4">{project.title}</h3>
          </div>
        </ScrollReveal>
      ))}
    </ScrollStagger>
  )
}
```

## 3. Enhanced Magnetic Buttons

Update your CTA buttons:

```tsx
import { MagneticButton } from '@/components/ui/MagneticButton'

export function CTAButtons() {
  return (
    <div className="flex gap-4">
      <MagneticButton 
        className="bg-purple-600 px-8 py-4 rounded-full font-semibold"
        strength={0.5}
        tiltStrength={15}
        glowOnHover={true}
      >
        View Projects
      </MagneticButton>
      
      <MagneticButton 
        className="border border-white/20 px-8 py-4 rounded-full"
        strength={0.3}
        tiltStrength={10}
        href="/contact"
      >
        Get in Touch
      </MagneticButton>
    </div>
  )
}
```

## 4. Smooth About Section

Add reveals to your about section:

```tsx
import { ScrollReveal, ScrollScale } from '@/components/ui/ScrollReveal'

export function AboutSection() {
  return (
    <section className="py-20">
      <ScrollReveal direction="up" delay={0.2}>
        <h2 className="text-5xl font-bold mb-8">About Me</h2>
      </ScrollReveal>
      
      <div className="grid grid-cols-2 gap-12">
        <ScrollScale delay={0.4}>
          <img src="/profile.jpg" alt="Elizabeth" className="rounded-2xl" />
        </ScrollScale>
        
        <ScrollReveal direction="right" delay={0.6}>
          <p className="text-lg leading-relaxed">
            I'm a full-stack developer specializing in creating 
            exceptional digital experiences...
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
```

## 5. Use Custom Easings in Existing Animations

Update your existing Framer Motion animations:

```tsx
import { motion } from 'framer-motion'
import { easings } from '@/lib/easings'

// Before
<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
/>

// After  
<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, ease: easings.easeOutExpo }}
/>
```

## 6. Enhanced Image Gallery

Create a smooth image gallery:

```tsx
import { EnhancedImage, MagneticImage } from '@/components/ui/EnhancedImage'

export function ImageGallery({ images }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {images.map((img, i) => (
        <MagneticImage
          key={i}
          src={img.src}
          alt={img.alt}
          width={400}
          height={300}
          magneticStrength={0.2}
          className="rounded-lg"
        />
      ))}
    </div>
  )
}
```

## 7. Page Transitions

Add to your page layouts for smooth transitions:

```tsx
'use client'

import { motion } from 'framer-motion'
import { animationPresets } from '@/lib/easings'

export default function PageLayout({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={animationPresets.pageTransition}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  )
}
```

## 8. Skills Section with Stagger

Animate your skills list:

```tsx
import { ScrollStagger } from '@/components/ui/ScrollReveal'

export function SkillsSection() {
  const skills = ['React', 'Next.js', 'TypeScript', 'Three.js', 'Node.js']
  
  return (
    <ScrollStagger staggerDelay={0.1} className="flex flex-wrap gap-4">
      {skills.map(skill => (
        <div 
          key={skill}
          className="px-6 py-3 rounded-full bg-white/5 border border-white/10"
        >
          {skill}
        </div>
      ))}
    </ScrollStagger>
  )
}
```

## 9. Contact Form Enhancement

Make your contact form feel alive:

```tsx
import { MagneticButton } from '@/components/ui/MagneticButton'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function ContactForm() {
  return (
    <ScrollReveal direction="up" delay={0.2}>
      <form className="space-y-6">
        <input 
          type="text"
          placeholder="Your Name"
          className="w-full px-6 py-4 rounded-lg glass-effect"
        />
        <input 
          type="email"
          placeholder="Your Email"
          className="w-full px-6 py-4 rounded-lg glass-effect"
        />
        <textarea 
          placeholder="Your Message"
          className="w-full px-6 py-4 rounded-lg glass-effect h-32"
        />
        
        <MagneticButton
          className="bg-purple-600 px-10 py-4 rounded-full font-semibold"
          strength={0.4}
          glowOnHover={true}
        >
          Send Message
        </MagneticButton>
      </form>
    </ScrollReveal>
  )
}
```

## 10. Footer with Smooth Reveals

Animate your footer elements:

```tsx
import { ScrollReveal, ScrollStagger } from '@/components/ui/ScrollReveal'

export function Footer() {
  const socialLinks = [
    { name: 'GitHub', url: '...' },
    { name: 'LinkedIn', url: '...' },
    { name: 'Twitter', url: '...' },
  ]
  
  return (
    <footer className="py-20">
      <ScrollReveal direction="up" delay={0.2}>
        <h3 className="text-3xl font-bold mb-8">Let's Connect</h3>
      </ScrollReveal>
      
      <ScrollStagger staggerDelay={0.1} className="flex gap-6">
        {socialLinks.map(link => (
          <a 
            key={link.name}
            href={link.url}
            className="text-lg hover:text-purple-400 transition-colors"
          >
            {link.name}
          </a>
        ))}
      </ScrollStagger>
    </footer>
  )
}
```

## 🎯 Priority Updates

Start with these for maximum impact:

1. ✅ **Hero section** - Replace with SplitText
2. ✅ **Project images** - Use EnhancedImage
3. ✅ **CTA buttons** - Upgrade to MagneticButton with glow
4. ✅ **Add ScrollReveal** to main sections
5. ✅ **Update easings** in existing animations

These changes will immediately make your portfolio feel smoother and more polished! 🚀
