import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Elizabeth Stein - Full-Stack Developer & AI Integration Specialist'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
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
          backgroundColor: '#000000',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #1e1b4b 0%, transparent 50%), radial-gradient(circle at 75% 75%, #312e81 0%, transparent 50%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Stars background effect */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.8) 1px, transparent 1px), radial-gradient(circle at 30% 60%, rgba(255,255,255,0.6) 1px, transparent 1px), radial-gradient(circle at 50% 30%, rgba(255,255,255,0.7) 1px, transparent 1px), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.5) 1px, transparent 1px), radial-gradient(circle at 90% 40%, rgba(255,255,255,0.8) 1px, transparent 1px), radial-gradient(circle at 15% 85%, rgba(255,255,255,0.6) 1px, transparent 1px), radial-gradient(circle at 85% 15%, rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '200px 200px',
          }}
        />

        {/* Decorative rings */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            border: '1px solid rgba(168, 85, 247, 0.15)',
          }}
        />

        {/* Planet/Star icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
            marginBottom: '32px',
            boxShadow: '0 0 60px rgba(168, 85, 247, 0.5)',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e879f9 0%, #8b5cf6 100%)',
            }}
          />
        </div>

        {/* Name */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontSize: '72px',
              fontWeight: 800,
              letterSpacing: '-2px',
              background: 'linear-gradient(to right, #ffffff, rgba(255,255,255,0.8))',
              backgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1.1,
            }}
          >
            ELIZABETH
          </span>
          <span
            style={{
              fontSize: '72px',
              fontWeight: 800,
              letterSpacing: '-2px',
              background: 'linear-gradient(to right, #ffffff, rgba(255,255,255,0.8))',
              backgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1.1,
            }}
          >
            STEIN
          </span>
        </div>

        {/* Gradient line */}
        <div
          style={{
            width: '200px',
            height: '2px',
            background: 'linear-gradient(to right, transparent, #6366f1, transparent)',
            marginTop: '24px',
            marginBottom: '24px',
          }}
        />

        {/* Title */}
        <span
          style={{
            fontSize: '24px',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.7)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          Full-Stack Developer
        </span>

        {/* Subtitle */}
        <span
          style={{
            fontSize: '18px',
            fontWeight: 400,
            color: 'rgba(129, 140, 248, 0.8)',
            marginTop: '8px',
          }}
        >
          50+ Projects | AI Integration | Design Systems
        </span>
      </div>
    ),
    {
      ...size,
    }
  )
}
