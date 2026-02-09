import Link from 'next/link'
import type { Metadata } from 'next'
import { Code2, Palette, Cpu, Sparkles, Github, Linkedin } from 'lucide-react'
import { StarryBackground } from '@/components/ui/StarryBackground'

export const metadata: Metadata = {
  title: 'About | Elizabeth Stein',
  description: 'Full-stack engineer and UX-minded builder specializing in modern web experiences, AI integration, and thoughtful design systems.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About | Elizabeth Stein',
    description: 'Full-stack engineer and UX-minded builder specializing in modern web experiences, AI integration, and thoughtful design systems.',
    url: '/about',
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white relative">
      {/* Skip Link for Accessibility */}
      <a href="#about-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium">
        Skip to main content
      </a>
      <StarryBackground />
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top-4 duration-500">
        <div
          className="mx-auto px-6 py-4 flex items-center justify-between backdrop-blur-md bg-black/40 border-b border-white/10"
        >
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent hover:from-white/90 hover:to-white/70 transition-all duration-300"
          >
            Elizabeth Stein
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 rounded"
            >
              ← Back to Galaxy
            </Link>
            <Link
              href="/work"
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-sm font-medium hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            >
              View All Work
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div id="about-content" className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              Hi, I'm Liz
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 leading-relaxed max-w-3xl">
              I build modern web experiences with thoughtful UX and solid engineering.
            </p>
          </div>

          {/* Bio Section */}
          <section className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20" aria-hidden="true">
                <Sparkles className="w-6 h-6 text-purple-300" />
              </div>
              About Me
            </h2>
            <div className="space-y-4 text-lg text-white/80 leading-relaxed bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
              <p>
                I'm a software development student and UX/UI-minded builder who loves turning messy ideas into clean,
                usable products. I care deeply about design details, accessibility, and making things feel fast and
                intuitive — but I also enjoy the backend puzzle of APIs, data flows, and systems that actually hold up in real life.
              </p>
              <p>
                I work best in small, shippable steps, with clear commits and documentation so future me
                (and teammates) don't suffer. Currently pursuing my B.S. in Software Development at Capella University
                with a 3.98 GPA while working as Design Team Lead at Flo Labs.
              </p>
            </div>
          </section>

          {/* What I Do */}
          <section className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
            <h2 className="text-3xl font-semibold mb-8">What I Do</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all hover:-translate-y-1 hover:shadow-xl group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl group-hover:scale-110 transition-transform">
                    <Palette className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Frontend Excellence</h3>
                    <p className="text-white/70">
                      Polished, responsive interfaces with reusable components and consistent UI patterns.
                      I bridge design intent and implementation details—spacing, typography, states, responsiveness.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all hover:-translate-y-1 hover:shadow-xl group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl group-hover:scale-110 transition-transform">
                    <Code2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Full-Stack Features</h3>
                    <p className="text-white/70">
                      End-to-end feature development from UI to API integration and data flow.
                      Comfortable with Java/Spring Boot services, REST APIs, and production-ready backends.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all hover:-translate-y-1 hover:shadow-xl group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl group-hover:scale-110 transition-transform">
                    <Cpu className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">CMS & Content Systems</h3>
                    <p className="text-white/70">
                      CMS-driven sites and content workflows, including Craft CMS environments.
                      Content modeling, migrations, and template architecture that makes editors' lives easier.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all hover:-translate-y-1 hover:shadow-xl group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">AI Integration</h3>
                    <p className="text-white/70">
                      AI-powered interfaces and workflows, including MCP-based tool connections and OpenAI API integrations.
                      Built production AI travel planner with 22+ specialized prompts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tech Snapshot */}
          <section className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
            <h2 className="text-3xl font-semibold mb-6">Tech Snapshot</h2>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/[0.07] transition-colors">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white/90">Frontend</h3>
                  <p className="text-white/70 leading-relaxed">
                    Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Three.js, GSAP
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white/90">Backend</h3>
                  <p className="text-white/70 leading-relaxed">
                    Java, Spring Boot, Node.js, REST APIs, Python
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white/90">CMS & Platforms</h3>
                  <p className="text-white/70 leading-relaxed">
                    Craft CMS, Strapi, WordPress, Vercel, Firebase
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white/90">AI & Integration</h3>
                  <p className="text-white/70 leading-relaxed">
                    Claude/Anthropic, OpenAI GPT-4, Stable Diffusion, MCP Protocol, Algolia Agent Studio
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white/90">Data & Infrastructure</h3>
                  <p className="text-white/70 leading-relaxed">
                    PostgreSQL, Supabase, MongoDB, Redis, Prisma, Docker, Git/GitHub
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white/90">Process</h3>
                  <p className="text-white/70 leading-relaxed">
                    Agile/Scrum, CI/CD, Testing (1,200+ automated tests), Documentation
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Highlights */}
          <section className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700 fill-mode-both">
            <h2 className="text-3xl font-semibold mb-6">Highlights</h2>
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-all hover:translate-x-2">
                <p className="text-white/80">
                  ✨ Built and deployed 40+ production projects including enterprise SaaS platforms,
                  AI-powered applications, and educational tools with 1,200+ automated tests
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-all hover:translate-x-2">
                <p className="text-white/80">
                  🎨 Led complete redesign of Flo Labs web ecosystem with unified design system and modern architecture
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-all hover:translate-x-2">
                <p className="text-white/80">
                  🤖 Built sophisticated AI systems including autonomous artist with 400+ tests,
                  multi-agent platforms, and GPT-4 Vision integrations with Algolia Agent Studio
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-all hover:translate-x-2">
                <p className="text-white/80">
                  📚 Created full educational platforms: Portfolio-Pro (205 lessons), Finance Quest (17 chapters, 30+ calculators, 85% retention rate)
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-all hover:translate-x-2">
                <p className="text-white/80">
                  🏗️ Navigated 64,806-file enterprise codebase (Coulson One) and built monorepo architectures with NestJS, Next.js, and React Native
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-all hover:translate-x-2">
                <p className="text-white/80">
                  🎓 Maintaining 3.98 GPA while working full-time, Dean's List all quarters
                </p>
              </div>
            </div>
          </section>

          {/* What I'm Looking For */}
          <section className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-1000 fill-mode-both">
            <h2 className="text-3xl font-semibold mb-6">What I'm Looking For</h2>
            <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-white/20 rounded-2xl p-8 backdrop-blur-3xl shadow-[0_0_50px_rgba(168,85,247,0.1)]">
              <p className="text-xl text-white/90 leading-relaxed">
                Roles where I can blend UI craftsmanship with real engineering—frontend, UX engineering,
                or full-stack work with a strong product focus. I thrive in environments that value both
                beautiful, accessible interfaces and solid, maintainable code.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center animate-in fade-in zoom-in duration-700 delay-1000 fill-mode-both">
            <h2 className="text-3xl font-semibold mb-6">Let's Build Something</h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Whether you're looking to collaborate on a project or just want to chat about web development,
              AI integration, or design systems—I'd love to hear from you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:purplegumdropz@gmail.com"
                className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/30 text-white font-semibold hover:bg-white/20 hover:border-white/40 transition-all duration-300 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105"
              >
                Get in Touch
              </a>
              <Link
                href="/work"
                className="px-8 py-4 bg-black/30 backdrop-blur-xl border border-white/20 text-white/80 hover:bg-black/40 hover:text-white hover:border-white/30 transition-all duration-300 rounded-xl shadow-xl hover:scale-105"
              >
                View My Work
              </Link>
            </div>
            <div className="flex justify-center gap-6 mt-8">
              <a
                href="https://github.com/forbiddenlink"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/in/elizabeth-stein"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 relative z-10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-sm">
          <p>© {new Date().getFullYear()} Elizabeth Stein. Built with Next.js, React, Three.js, and a lot of coffee.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/forbiddenlink"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/elizabeth-stein"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
