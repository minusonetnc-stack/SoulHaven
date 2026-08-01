import { useEffect, useRef, useState } from 'react'

interface PixelWipeProps {
  isActive: boolean
  onComplete?: () => void
  onReverseComplete?: () => void
}

const BLOCK = '█'
const THIN_BLOCK = '▓'
const FADE_BLOCK = '░'

export default function PixelWipe({ isActive, onComplete, onReverseComplete }: PixelWipeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<'idle' | 'wiping' | 'revealed' | 'reversing'>('idle')
  const [showContent, setShowContent] = useState(false)
  const animationRef = useRef<number>(0)
  const dropsRef = useRef<number[]>([])
  const cutProgressRef = useRef(0)
  const canvasSizeRef = useRef({ w: 0, h: 0 })

  useEffect(() => {
    if (isActive && phase === 'idle') {
      setPhase('wiping')
      setShowContent(false)
      cutProgressRef.current = 0
    } else if (!isActive && phase === 'revealed') {
      setPhase('reversing')
      setShowContent(false)
    }
  }, [isActive, phase])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.scale(dpr, dpr)
      canvasSizeRef.current = { w, h }
      const columns = Math.floor(w / 16)
      dropsRef.current = new Array(columns).fill(0)
    }
    resize()
    window.addEventListener('resize', resize)

    let lastTime = 0
    const wipeSpeed = 0.004
    const reverseSpeed = 0.008

    const draw = (time: number) => {
      if (!ctx || !canvas) return
      const elapsed = time - lastTime
      if (elapsed < 16) {
        animationRef.current = requestAnimationFrame(draw)
        return
      }
      lastTime = time

      const { w, h } = canvasSizeRef.current
      const drops = dropsRef.current
      const cutProgress = cutProgressRef.current

      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, w, h)

      ctx.fillStyle = '#0f0'
      ctx.font = 'bold 14px monospace'

      for (let i = 0; i < drops.length; i++) {
        const char = Math.random() > 0.7 ? BLOCK : (Math.random() > 0.5 ? THIN_BLOCK : FADE_BLOCK)
        const x = i * 16
        const y = drops[i] * 16

        const centerX = w / 2
        const centerY = h / 2
        const dx = (x - centerX) / (w * 0.3 * cutProgress + 1)
        const dy = (y - centerY) / (h * 0.3 * cutProgress + 1)
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 1.0 && cutProgress > 0.05) {
          ctx.globalAlpha = Math.max(0, dist - 0.3)
        } else {
          ctx.globalAlpha = Math.min(1, 0.3 + cutProgress * 0.7)
        }

        ctx.fillText(char, x, y)
        ctx.globalAlpha = 1

        if (y > h && Math.random() > 0.985) {
          drops[i] = 0
        }
        drops[i] += 0.5 + Math.random() * 0.5
      }

      if (phase === 'wiping') {
        cutProgressRef.current = Math.min(1, cutProgressRef.current + wipeSpeed)
        if (cutProgressRef.current >= 1) {
          setPhase('revealed')
          setTimeout(() => setShowContent(true), 300)
          onComplete?.()
        }
      } else if (phase === 'reversing') {
        cutProgressRef.current = Math.max(0, cutProgressRef.current - reverseSpeed)
        if (cutProgressRef.current <= 0) {
          setPhase('idle')
          onReverseComplete?.()
        }
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    animationRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [phase, onComplete, onReverseComplete])

  if (phase === 'idle') return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9998,
      pointerEvents: phase === 'revealed' ? 'none' : 'auto',
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase === 'revealed' ? 0.15 : 1,
          transition: 'opacity 2s ease',
          zIndex: 1,
        }}
      />

      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        opacity: cutProgressRef.current > 0.3 ? 1 : 0,
        transition: 'opacity 1s ease',
        zIndex: 0,
        overflow: 'hidden',
      }}>
        {showContent && (
          <div style={{
            animation: 'logoFadeIn 2s ease-out forwards',
            textAlign: 'center',
            maxWidth: '90vw',
            padding: '2rem',
          }}>
            <svg 
              width="140" 
              height="160" 
              viewBox="0 0 140 160" 
              style={{ margin: '0 auto 1.5rem', display: 'block' }}
            >
              <g fill="none" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
                <path d="M70 15 C70 15, 25 40, 25 85 C25 125, 45 145, 70 150 C95 145, 115 125, 115 85 C115 40, 70 15, 70 15Z" />
                <path d="M70 25 C70 25, 35 45, 35 85 C35 120, 50 138, 70 142 C90 138, 105 120, 105 85 C105 45, 70 25, 70 25Z" opacity="0.7" />
                <path d="M70 35 C70 35, 45 50, 45 85 C45 115, 55 130, 70 134 C85 130, 95 115, 95 85 C95 50, 70 35, 70 35Z" opacity="0.5" />
              </g>

              <g fill="none" stroke="#4ade80" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M70 134 L70 90" />
                <path d="M70 110 Q55 100, 50 85 Q48 75, 55 70 Q62 68, 68 80 L70 85" />
                <path d="M55 70 Q52 78, 58 82" opacity="0.6" />
                <path d="M70 100 Q85 90, 90 75 Q92 65, 85 60 Q78 58, 72 70 L70 75" />
                <path d="M85 60 Q88 68, 82 72" opacity="0.6" />
                <path d="M70 90 Q65 70, 68 55 Q70 45, 75 50 Q78 55, 72 65 L70 75" />
                <path d="M70 55 Q73 62, 70 68" opacity="0.6" />
                <path d="M55 70 L62 78" opacity="0.4" strokeWidth="0.6" />
                <path d="M85 60 L78 68" opacity="0.4" strokeWidth="0.6" />
                <path d="M70 55 L70 65" opacity="0.4" strokeWidth="0.6" />
              </g>

              <circle cx="30" cy="80" r="1" fill="#4ade80" opacity="0.3" />
              <circle cx="110" cy="80" r="1" fill="#4ade80" opacity="0.3" />
              <circle cx="70" cy="155" r="1.5" fill="#4ade80" opacity="0.4" />
            </svg>

            <h1 style={{
              fontFamily: '"Courier New", monospace',
              fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
              color: '#4ade80',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
              fontWeight: 300,
              textShadow: '0 0 20px rgba(74, 222, 128, 0.3)',
            }}>
              SoulHaven
            </h1>
            <p style={{
              fontFamily: '"Courier New", monospace',
              fontSize: 'clamp(0.625rem, 2vw, 0.875rem)',
              color: '#4ade80',
              opacity: 0.6,
              letterSpacing: '0.3em',
              fontWeight: 300,
            }}>
              SECURE LAYER ACTIVE
            </p>
          </div>
        )}

        {showContent && (
          <div style={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'noticeSlideUp 1.5s ease-out 0.5s forwards',
            opacity: 0,
            textAlign: 'center',
            width: '90vw',
            maxWidth: '400px',
          }}>
            <div style={{
              padding: '1rem 1.5rem',
              border: '1px solid #4ade80',
              borderRadius: '2px',
              background: 'rgba(0, 255, 0, 0.03)',
            }}>
              <p style={{
                fontFamily: '"Courier New", monospace',
                fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                color: '#4ade80',
                margin: 0,
                fontWeight: 300,
                letterSpacing: '0.1em',
                textShadow: '0 0 10px #0f060',
              }}>
                ✓ You're safe
              </p>
              <p style={{
                fontFamily: '"Courier New", monospace',
                fontSize: 'clamp(0.5rem, 1.5vw, 0.625rem)',
                color: '#4ade80',
                opacity: 0.5,
                marginTop: '0.5rem',
                letterSpacing: '0.15em',
                fontWeight: 300,
              }}>
                End-to-end encrypted • No logs • Anonymous
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes logoFadeIn {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes noticeSlideUp {
          0% { opacity: 0; transform: translateX(-50%) translateY(30px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
