import { ImageResponse } from 'next/og'
import { galaxies } from '@/lib/galaxyData'

export const runtime = 'edge'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Find project
  const project = galaxies
    .flatMap(g => g.projects)
    .find(p => p.id === slug)

  if (!project) {
    return new Response('Project not found', { status: 404 })
  }

  // Find galaxy
  const galaxy = galaxies.find(g => 
    g.projects.some(p => p.id === slug)
  )

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.15), transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.15), transparent 50%)',
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: 20,
            textAlign: 'center',
            maxWidth: '90%',
          }}
        >
          {project.title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: '#94a3b8',
            marginBottom: 40,
            textAlign: 'center',
          }}
        >
          {project.role} • {project.company}
        </div>

        {/* Tags */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          {project.tags.slice(0, 4).map((tag: string) => (
            <div
              key={tag}
              style={{
                padding: '8px 20px',
                background: `${project.color}20`,
                border: `2px solid ${project.color}`,
                borderRadius: 999,
                color: project.color,
                fontSize: 24,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Galaxy badge */}
        {galaxy && (
          <div
            style={{
              position: 'absolute',
              top: 40,
              right: 40,
              padding: '12px 24px',
              background: `${galaxy.color}30`,
              border: `2px solid ${galaxy.color}`,
              borderRadius: 12,
              color: galaxy.color,
              fontSize: 24,
            }}
          >
            {galaxy.name}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: '#64748b',
            fontSize: 24,
          }}
        >
          <span>Elizabeth Stein</span>
          <span>•</span>
          <span>Portfolio</span>
        </div>

        {/* Decorative stars */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            opacity: 0.3,
          }}
        >
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: '#fff',
              }}
            />
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
