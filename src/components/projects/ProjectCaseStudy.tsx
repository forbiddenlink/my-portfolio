import type { Project } from '@/lib/types'
import { formatDateRange } from '@/lib/utils'
import { ExternalLink, Github } from 'lucide-react'
import { GenerativeHero } from '@/components/ui/GenerativeHero'
import Image from 'next/image'

// Map project IDs to their screenshot paths
// Screenshots should be 1280x720 PNG files in public/screenshots/
const PROJECT_SCREENSHOTS: Record<string, string> = {
  'flo-labs': '/screenshots/flo-labs.png',
  'caipo-ai': '/screenshots/caipo-ai.png',
  'finance-quest': '/screenshots/finance-quest.png',
  'portfolio-pro': '/screenshots/portfolio-pro.png',
  'stancestream': '/screenshots/stance-stream.png',
  'explainthiscode': '/screenshots/explain-this-code.png',
  'moodchanger-ai': '/screenshots/moodchanger-ai.png',
  'hephaestus': '/screenshots/hephaestus.png',
  'robocollective-ai': '/screenshots/robocollective-ai.png',
  'tubedigest': '/screenshots/tubedigest.png',
  'contradictme': '/screenshots/contradictme.png',
  'create-surveys': '/screenshots/create-surveys.png',
  'reprise': '/screenshots/reprise.png',
  'componentcompass': '/screenshots/componentcompass.png',
  'security-trainer': '/screenshots/security-trainer.png',
  'goodstuff-foodtruck': '/screenshots/goodstuff-foodtruck.png',
  'pollyglot': '/screenshots/pollyglot.png',
  'guts-and-glory': '/screenshots/guts-and-glory.png',
  'plant-therapy': '/screenshots/plant-therapy.png',
  'timeslip-search': '/screenshots/timeslip-search.png',
}

interface ProjectCaseStudyProps {
  project: Project
}

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const screenshotPath = PROJECT_SCREENSHOTS[project.id]

  return (
    <article className="max-w-5xl mx-auto px-6 md:px-8 py-12 md:py-16 space-y-12">
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="flex-1">
            <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent leading-tight">{project.title}</h1>
            {project.company && (
              <p className="text-2xl text-white/70 font-medium">{project.company}</p>
            )}
          </div>
          <div
            className="w-20 h-20 rounded-2xl shrink-0 shadow-lg"
            style={{
              backgroundColor: project.color,
              opacity: project.brightness * 0.6,
              boxShadow: `0 0 40px ${project.color}40`,
            }}
          />
        </div>

        <div className="flex flex-wrap gap-3 text-base text-white/70">
          <span className="px-3 py-1 bg-white/5 rounded-full">{project.role}</span>
          <span className="px-3 py-1 bg-white/5 rounded-full">{formatDateRange(project.dateRange)}</span>
        </div>
      </header>

      {/* Description */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Overview</h2>
        <p className="text-xl leading-relaxed text-white/90 font-light mb-6">
          {project.description}
        </p>

        {/* Add more detailed sections based on project type */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-white/20">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span>Challenge</span>
            </h3>
            <p className="text-white/70 leading-relaxed">
              {project.metrics?.files ?
                `Building and maintaining a large-scale application with ${project.metrics.files.toLocaleString()} files${project.metrics.team ? ` across a team of ${project.metrics.team} developers` : ''}.` :
                `Developing a robust solution for ${project.company || 'the client'} that meets complex business requirements and delivers exceptional user experience.`
              }
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-white/20">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span>Solution</span>
            </h3>
            <p className="text-white/70 leading-relaxed">
              {project.tags.includes('React') || project.tags.includes('Next.js') ?
                'Architected a modern, performant application using cutting-edge web technologies and best practices.' :
                project.tags.includes('AI') || project.tags.includes('Machine Learning') ?
                  'Integrated advanced AI capabilities to enhance functionality and user experience.' :
                  'Delivered a comprehensive solution leveraging the latest tools and frameworks in the ecosystem.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Links */}
      {project.links && (
        <div className="flex flex-wrap gap-4 mb-16">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-xl hover:bg-white/90 hover:scale-105 transition-all duration-200 font-semibold shadow-xl"
            >
              <ExternalLink className="w-5 h-5" />
              <span>View Live</span>
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white/30 rounded-xl hover:bg-white/10 hover:border-white/50 hover:scale-105 transition-all duration-200 font-semibold backdrop-blur-sm"
            >
              <Github className="w-5 h-5" />
              <span>Source Code</span>
            </a>
          )}
        </div>
      )}

      {/* Live Preview with Screenshot or Generative Schematic */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
          {screenshotPath ? 'Live Preview' : 'System Architecture'}
        </h2>
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm relative group">
          <div className="aspect-video relative overflow-hidden">
            {screenshotPath ? (
              <Image
                src={screenshotPath}
                alt={`Screenshot of ${project.title}`}
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900">
                <GenerativeHero name={project.title} color={project.color} />
              </div>
            )}

            {/* Overlay Content */}
            <div className="absolute inset-0 flex items-center justify-center p-8 bg-black/20 group-hover:bg-black/40 transition-colors duration-500">
              <div className="text-center z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="w-16 h-16 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                  <span className="text-2xl">⚡</span>
                </div>

                {project.links?.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Launch System</span>
                  </a>
                )}

                <p className="mt-4 text-xs font-mono text-white/40 tracking-widest uppercase">
                  {screenshotPath ? 'Live Site Preview' : 'Generative Data Visualization'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      {project.metrics && Object.keys(project.metrics).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {project.metrics.files && (
            <MetricCard label="Files" value={project.metrics.files.toLocaleString()} color={project.color} />
          )}
          {project.metrics.tests && (
            <MetricCard label="Tests" value={project.metrics.tests.toString()} color={project.color} />
          )}
          {project.metrics.team && (
            <MetricCard label="Team Size" value={project.metrics.team.toString()} color={project.color} />
          )}
          {project.metrics.users && (
            <MetricCard label="Users" value={project.metrics.users} color={project.color} />
          )}
        </div>
      )}

      {/* Tech Stack */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Tech Stack</h2>
        <div className="flex flex-wrap gap-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm font-medium hover:bg-white/15 hover:border-white/30 transition-all duration-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="pt-8 border-t border-white/10">
        <a
          href="/work"
          className="text-white/60 hover:text-white transition-colors"
        >
          ← Back to all projects
        </a>
      </nav>
    </article>
  )
}

function MetricCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div
      className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6 hover:border-white/30 hover:from-white/15 hover:to-white/10 transition-all duration-200"
      style={{
        boxShadow: color ? `0 0 20px ${color}15` : undefined,
      }}
    >
      <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">{value}</div>
      <div className="text-sm text-white/60 font-medium uppercase tracking-wider">{label}</div>
    </div>
  )
}
