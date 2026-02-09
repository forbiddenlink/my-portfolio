// Core data types for the galaxy portfolio

export interface Project {
  id: string
  title: string
  description: string
  role: string // "Design Team Lead", "Software Engineer", etc.
  company?: string // "Flo Labs", "Rocket Park", etc.
  tags: string[] // ["React", "Next.js", "AI", "TypeScript"]
  color: string // Galaxy color (inherited)
  brightness: number // 0.5 - 2.0 for visual hierarchy
  size: 'small' | 'medium' | 'large' | 'supermassive'
  galaxy: string // Galaxy ID
  metrics?: {
    files?: number
    tests?: number
    team?: number
    users?: string
  }
  links?: {
    live?: string
    github?: string
    case_study?: string
  }
  featured: boolean // For homepage highlights
  dateRange: string // "2023-2024", "2022", etc.
}

export interface Galaxy {
  id: string
  name: string
  description: string
  color: string // Primary color for this galaxy's stars
  size: number // Relative size/importance
  projects: Project[]
}

export type ViewState = 'universe' | 'galaxy' | 'project' | 'exploration'

export interface CameraState {
  view: ViewState
  selectedGalaxy?: string
  selectedProject?: string
}
