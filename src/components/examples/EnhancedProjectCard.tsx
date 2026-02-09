'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { EnhancedImage } from '@/components/ui/EnhancedImage'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { SplitWords } from '@/components/ui/SplitText'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { easings } from '@/lib/easings'

interface ProjectCardProps {
  id: string
  title: string
  description: string
  image?: string
  tags: string[]
  featured?: boolean
}

/**
 * Example: Enhanced Project Card
 * 
 * This is a reference implementation showing how to use all the new
 * smooth animation components together. Use this as inspiration for
 * updating your existing project cards.
 */
export function EnhancedProjectCard({
  id,
  title,
  description,
  image = '/placeholder-project.jpg',
  tags,
  featured = false
}: ProjectCardProps) {
  return (
    <ScrollReveal direction="up" delay={0.1}>
      <motion.div
        className="group relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: easings.easeOutQuint }}
      >
        {/* Image with smooth hover effect */}
        <Link href={`/work/${id}`}>
          <EnhancedImage
            src={image}
            alt={title}
            width={600}
            height={400}
            className="w-full aspect-video"
            hoverScale={1.08}
            hoverRotate={2}
          />
          
          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-2xl font-bold group-hover:text-purple-300 transition-colors">
                <SplitWords delay={0.1}>{title}</SplitWords>
              </h3>
              
              {featured && (
                <motion.span
                  className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                >
                  Featured
                </motion.span>
              )}
            </div>

            <p className="text-white/70 mb-4 leading-relaxed">
              {description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag, index) => (
                <motion.span
                  key={tag}
                  className="px-3 py-1 text-xs uppercase tracking-wider rounded-full bg-white/5 border border-white/10 text-white/60"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 0.1 + (index * 0.05),
                    ease: easings.easeOutBack
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            {/* CTA Button */}
            <MagneticButton 
              strength={0.4}
              tiltStrength={12}
              glowOnHover={true}
              href={`/work/${id}`}
            >
              <span className="inline-block px-6 py-3 bg-purple-600 rounded-full font-semibold text-sm hover:bg-purple-500 transition-colors">
                View Project →
              </span>
            </MagneticButton>
          </div>
        </Link>
      </motion.div>
    </ScrollReveal>
  )
}

/**
 * Usage Example:
 * 
 * import { EnhancedProjectCard } from '@/components/examples/EnhancedProjectCard'
 * 
 * export function ProjectGrid({ projects }) {
 *   return (
 *     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 *       {projects.map(project => (
 *         <EnhancedProjectCard
 *           key={project.id}
 *           id={project.id}
 *           title={project.title}
 *           description={project.description}
 *           image={project.image}
 *           tags={project.tags}
 *           featured={project.featured}
 *         />
 *       ))}
 *     </div>
 *   )
 * }
 */
