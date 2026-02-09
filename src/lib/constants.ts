// Contact and social links - single source of truth
export const CONTACT = {
  email: 'purplegumdropz@gmail.com',
  linkedin: 'https://linkedin.com/in/imkindageeky',
  github: 'https://github.com/forbiddenlink',
} as const

// Site metadata - single source of truth
export const SITE = {
  name: 'Elizabeth Stein',
  title: 'Full-Stack Developer & AI Integration Specialist',
  fullTitle: 'Elizabeth Stein | Full-Stack Developer & AI Integration Specialist',
  description: 'Full-stack development, AI integration, design systems, and enterprise-scale applications. Explore 50+ projects across 6 galaxies with 1,200+ automated tests.',
  shortDescription: 'Full-stack development, AI integration, design systems, and enterprise-scale applications.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://elizabethstein.com',
  keywords: [
    'Full-Stack Developer',
    'AI Integration',
    'React',
    'Next.js',
    'TypeScript',
    'Three.js',
    'Claude AI',
    'OpenAI GPT-4',
    'Design Systems',
    'Enterprise Applications',
    'Web Development',
    'Supabase',
    'Portfolio',
  ],
  knowsAbout: [
    'Full-Stack Development',
    'AI Integration',
    'Claude AI',
    'OpenAI GPT-4',
    'Stable Diffusion',
    'React',
    'Next.js',
    'TypeScript',
    'Three.js',
    'Design Systems',
    'Enterprise Applications',
    'Supabase',
    'PostgreSQL',
  ],
} as const

// Portfolio stats
export const STATS = {
  projectCount: '50+',
  testCount: '1,200+',
  yearsExperience: '3+',
} as const
