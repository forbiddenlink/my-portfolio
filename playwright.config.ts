import './scripts/qa-preflight.mjs'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { realpathSync } from 'node:fs'
import { defineConfig, devices } from '@playwright/test'

// Give separate worktrees their own port; retain the CI origin used by auth fixtures.
const checkoutPort =
  15000 +
  (createHash('sha256').update(realpathSync(process.cwd())).digest().readUInt32BE(0) % 30000)
const e2ePort = Number(process.env.PLAYWRIGHT_PORT ?? (process.env.CI ? 3100 : checkoutPort))
if (!Number.isInteger(e2ePort) || e2ePort < 1024 || e2ePort > 65535) {
  throw new Error('PLAYWRIGHT_PORT must be an integer from 1024 through 65535')
}
process.env.PLAYWRIGHT_PORT = String(e2ePort)
const baseURL = process.env.BASE_URL || `http://127.0.0.1:${e2ePort}`
const isCI = !!process.env.CI

/** Exclude visual regression specs from multi-browser runs — snapshots are Chrome-only in `visual` project */
const ignoreVisualDir = /\/e2e\/visual\//

export default defineConfig({
  metadata: {
    checkout: realpathSync(process.cwd()),
    revision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    dirty: Boolean(execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim()),
  },
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        ['github'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'test-results/results.json' }],
      ]
    : [
        ['list'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'test-results/results.json' }],
      ],

  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Configure visual regression snapshot settings
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
    },
  },

  projects: [
    // Visual regression tests on Chrome (stable baseline)
    {
      name: 'visual',
      testDir: './e2e/visual',
      use: {
        ...devices['Desktop Chrome'],
        // Consistent viewport for snapshots
        viewport: { width: 1280, height: 720 },
      },
    },
    // Smoke tests run first on Chrome only
    {
      name: 'smoke',
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    // Regression tests on multiple browsers
    {
      name: 'chromium',
      testMatch: /.*\.spec\.ts/,
      testIgnore: [/.*\.smoke\.spec\.ts/, /.*\.mobile\.spec\.ts/, ignoreVisualDir],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testMatch: /.*\.spec\.ts/,
      testIgnore: [/.*\.smoke\.spec\.ts/, /.*\.mobile\.spec\.ts/, ignoreVisualDir],
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testMatch: /.*\.spec\.ts/,
      testIgnore: [/.*\.smoke\.spec\.ts/, /.*\.mobile\.spec\.ts/, ignoreVisualDir],
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile viewport tests
    {
      name: 'mobile-chrome',
      testMatch: /.*\.mobile\.spec\.ts/,
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      testMatch: /.*\.mobile\.spec\.ts/,
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Each run owns its server. CI requires a fresh `pnpm build` first.
  webServer: process.env.BASE_URL
    ? undefined
    : isCI
      ? {
          command: `pnpm exec next start -H 127.0.0.1 -p ${e2ePort}`,
          url: baseURL,
          reuseExistingServer: false,
          timeout: 180 * 1000,
        }
      : {
          command: `pnpm dev --hostname 127.0.0.1 --port ${e2ePort}`,
          url: baseURL,
          reuseExistingServer: false,
          timeout: 120 * 1000,
        },
})
