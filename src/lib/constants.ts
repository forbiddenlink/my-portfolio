// Contact and social links - single source of truth
export const CONTACT = {
  email: 'purplegumdropz@gmail.com',
  linkedin: 'https://linkedin.com/in/imkindageeky',
  github: 'https://github.com/forbiddenlink',
} as const

// Site metadata
export const SITE = {
  name: 'Elizabeth Stein',
  title: 'Full-Stack Developer & AI Integration Specialist',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://elizabethstein.com',
} as const

// Portfolio stats
export const STATS = {
  projectCount: '40+',
  testCount: '1,200+',
  yearsExperience: '6+',
} as const
