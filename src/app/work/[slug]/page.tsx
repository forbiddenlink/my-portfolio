import { allProjects, getProjectById } from '@/lib/galaxyData'
import { ProjectCaseStudy } from '@/components/projects/ProjectCaseStudy'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link' // Check if Link is imported, if not use a tag or import it. The original file uses 'a' tags. Better to use Link.
import { StarryBackground } from '@/components/ui/StarryBackground'
import { TiltCard } from '@/components/ui/TiltCard'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export async function generateStaticParams() {
  return allProjects.map((project) => ({
    slug: project.id,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectById(slug)

  if (!project) {
    return {}
  }

  return {
    title: `${project.title} | Elizabeth Stein`,
    description: project.description,
    alternates: {
      canonical: `/work/${project.id}`,
    },
    openGraph: {
      title: project.title,
      description: project.description,
      url: `/work/${project.id}`,
      images: [
        {
          url: `/api/og/${project.id}`,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [`/api/og/${project.id}`],
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProjectById(slug)

  if (!project) {
    notFound()
  }

  // Find next/prev projects for navigation
  const currentIndex = allProjects.findIndex(p => p.id === project.id)
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length]
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length]

  return (
    <div className="min-h-screen bg-black text-white relative">
      <StarryBackground />

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top-4 duration-500">
        <div className="mx-auto px-6 py-4 flex items-center justify-between backdrop-blur-md bg-black/40 border-b border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            {/* Star icon */}
            <span className="relative w-7 h-7 flex-shrink-0 inline-flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600" />
              <span className="absolute inset-0.5 rounded-full bg-gradient-to-br from-fuchsia-300 to-purple-500" />
              <span className="absolute inset-[4px] rounded-full bg-white/80" />
            </span>
            <span className="text-2xl font-bold bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent group-hover:from-purple-200 group-hover:via-white group-hover:to-purple-200 transition-all duration-300">
              Elizabeth Stein
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/work"
              className="text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium hover:scale-105"
            >
              ← All Projects
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-sm font-medium hover:scale-105"
            >
              About
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content with top padding for fixed header */}
      <div className="pt-32 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <ProjectCaseStudy project={project} />

        {/* Navigation Footer */}
        <div className="max-w-7xl mx-auto px-6 mt-32">
          <h2 className="text-2xl font-bold mb-8 text-white/50">Explore More</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <TiltCard className="h-full">
              <Link
                href={`/work/${prevProject.id}`}
                className="block p-8 h-full bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2 text-white/40 mb-4 text-sm font-mono">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Previous Project
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{prevProject.title}</h3>
                <p className="text-white/60 line-clamp-2">{prevProject.description}</p>
              </Link>
            </TiltCard>

            <TiltCard className="h-full">
              <Link
                href={`/work/${nextProject.id}`}
                className="block p-8 h-full bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-end gap-2 text-white/40 mb-4 text-sm font-mono">
                  Next Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 text-right">{nextProject.title}</h3>
                <p className="text-white/60 line-clamp-2 text-right">{nextProject.description}</p>
              </Link>
            </TiltCard>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-24 relative z-10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/40 mb-6 font-mono text-sm">
            © {new Date().getFullYear()} Elizabeth Stein.
          </p>
        </div>
      </footer>
    </div>
  )
}
