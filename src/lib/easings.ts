// Custom easing curves inspired by motion design portfolios
// Use these for smoother, more natural animations

export const easings = {
  // Smooth and natural - good for most animations
  easeOutExpo: [0.16, 1, 0.3, 1],
  easeOutQuint: [0.22, 1, 0.36, 1],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeOutCubic: [0.33, 1, 0.68, 1],
  
  // Snappy and energetic
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  
  // Elastic and bouncy
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeInOutBack: [0.68, -0.6, 0.32, 1.6],
  
  // Smooth acceleration
  easeInQuad: [0.11, 0, 0.5, 0],
  easeInCubic: [0.32, 0, 0.67, 0],
  
  // For scroll-triggered reveals
  easeOutCirc: [0, 0.55, 0.45, 1],
  
  // For magnetic effects
  magnetic: [0.65, 0.05, 0.36, 1],
  
  // For page transitions
  pageTransition: [0.83, 0, 0.17, 1],
  
  // For image hovers
  imageHover: [0.43, 0.13, 0.23, 0.96],
} as const

export type EasingName = keyof typeof easings

// Convert to CSS for use in CSS animations
export const easingsToCss = (easing: EasingName): string => {
  const values = easings[easing]
  return `cubic-bezier(${values.join(', ')})`
}

// Presets for common use cases
export const animationPresets = {
  fadeIn: {
    duration: 0.6,
    ease: easings.easeOutQuint,
  },
  slideUp: {
    duration: 0.8,
    ease: easings.easeOutExpo,
  },
  scaleIn: {
    duration: 0.5,
    ease: easings.easeOutBack,
  },
  magnetic: {
    duration: 0.3,
    ease: easings.magnetic,
  },
  imageHover: {
    duration: 0.4,
    ease: easings.imageHover,
  },
  pageTransition: {
    duration: 0.7,
    ease: easings.pageTransition,
  },
}
