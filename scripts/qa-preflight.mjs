import { existsSync } from 'node:fs'

// Automated QA worktrees must not silently consume a developer's service files.
const envFiles = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.development.local',
  '.env.production',
  '.env.production.local',
]
if (process.env.PLAYWRIGHT_LOAD_ENV !== '1' && envFiles.some((file) => existsSync(file))) {
  throw new Error(
    'Use a clean QA worktree. Set PLAYWRIGHT_LOAD_ENV=1 only for explicitly isolated test service files.'
  )
}
