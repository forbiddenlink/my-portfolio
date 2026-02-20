import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Elizabeth Stein - Full-Stack Developer & AI Integration Specialist'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#030014', // Deep space void
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Background Gradients */}
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '80%', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '70%', height: '90%', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />

        {/* Technical Grid Overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Main Layout Container */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '80px', justifyContent: 'space-between', zIndex: 10 }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {/* Logo Mark + Text */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Satori-safe Icon Replica */}
              <div style={{ display: 'flex', width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #030014, #0f0b29)', border: '2px solid rgba(168,85,247,0.4)', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                 <div style={{ position: 'absolute', width: '28px', height: '28px', border: '2px solid rgba(6,182,212,0.6)', transform: 'rotate(45deg)', borderRadius: '6px' }} />
                 <div style={{ position: 'absolute', width: '12px', height: '12px', background: '#06b6d4', backgroundImage: 'linear-gradient(135deg, #06b6d4, #a855f7)', transform: 'rotate(45deg)', borderRadius: '3px', boxShadow: '0 0 10px #06b6d4' }} />
              </div>
              <span style={{ color: 'white', fontSize: '32px', fontWeight: 600, letterSpacing: '4px' }}>V.2.0.4</span>
            </div>
            
            {/* Right Badge */}
            <div style={{ display: 'flex', padding: '12px 28px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', color: '#cbd5e1', fontSize: '20px', letterSpacing: '4px' }}>
              STATUS: ONLINE
            </div>
          </div>

          {/* Center Content */}
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', marginBottom: 'auto' }}>
            <span style={{ color: '#06b6d4', fontSize: '32px', fontWeight: 600, letterSpacing: '8px', textTransform: 'uppercase', marginBottom: '24px' }}>
              Digital Portfolio
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontSize: '130px', fontWeight: 800, color: 'white', letterSpacing: '-0.04em' }}>
                ELIZABETH
              </span>
              <span style={{ fontSize: '130px', fontWeight: 800, backgroundImage: 'linear-gradient(135deg, #a855f7, #06b6d4, #f8fafc)', backgroundClip: 'text', color: 'transparent', letterSpacing: '-0.04em', paddingBottom: '20px' }}>
                STEIN
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginTop: '40px' }}>
              <span style={{ color: '#f8fafc', fontSize: '36px', fontWeight: 500 }}>Full-Stack Developer</span>
              <span style={{ color: '#475569', fontSize: '36px' }}>/</span>
              <span style={{ color: '#cbd5e1', fontSize: '36px', fontWeight: 500 }}>AI Integration</span>
              <span style={{ color: '#475569', fontSize: '36px' }}>/</span>
              <span style={{ color: '#94a3b8', fontSize: '36px', fontWeight: 500 }}>UX Eng</span>
            </div>
          </div>

          {/* Footer Coordinates */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: '22px' }}>COORD: 34.0522° N, 118.2437° W</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: '22px' }}>SYS.INIT_CHRONO: 2026.02.20</span>
            </div>
            {/* Tech bars */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
               <div style={{ width: '8px', height: '40px', background: 'rgba(168,85,247,0.6)', borderRadius: '4px' }} />
               <div style={{ width: '8px', height: '24px', background: 'rgba(168,85,247,0.4)', borderRadius: '4px' }} />
               <div style={{ width: '8px', height: '60px', background: 'rgba(6,182,212,0.6)', borderRadius: '4px' }} />
               <div style={{ width: '8px', height: '32px', background: 'rgba(6,182,212,0.4)', borderRadius: '4px' }} />
            </div>
          </div>

        </div>
      </div>
    ),
    { ...size }
  )
}
