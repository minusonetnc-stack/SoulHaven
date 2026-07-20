import { useEffect, useRef, useState, useCallback } from 'react'

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

  // Track phase changes
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

  // Canvas animation
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
    const wipeSpeed = 0.004  // Slower reveal
    const reverseSpeed = 0.008

    const draw = (time: number) => {
      if (!ctx || !canvas) return
      const elapsed = time - lastTime
      if (elapsed < 16) {  // Cap at ~60fps
        animationRef.current = requestAnimationFrame(draw)
        return
      }
      lastTime = time

      const { w, h } = canvasSizeRef.current
      const drops = dropsRef.current
      const cutProgress = cutProgressRef.current

      // Semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, w, h)

      ctx.fillStyle = '#0f0'
      ctx.font = 'bold 14px monospace'

      for (let i = 0; i < drops.length; i++) {
        const char = Math.random() > 0.7 ? BLOCK : (Math.random() > 0.5 ? THIN_BLOCK : FADE_BLOCK)
        const x = i * 16
        const y = drops[i] * 16

        // "Cut through" effect — carve a widening oval from center
        const centerX = w / 2
        const centerY = h / 2
        const dx = (x - centerX) / (w * 0.3 * cutProgress + 1)
        const dy = (y - centerY) / (h * 0.3 * cutProgress + 1)
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 1.0 && cutProgress > 0.05) {
          // Inside the cut — fade to black (reveals layer underneath)
          ctx.globalAlpha = Math.max(0, dist - 0.3)
        } else {
          ctx.globalAlpha = Math.min(1, 0.3 + cutProgress * 0.7)
        }

        ctx.fillText(char, x, y)
        ctx.globalAlpha = 1

        // Reset drop to top randomly
        if (y > h && Math.random() > 0.985) {
          drops[i] = 0
        }
        drops[i] += 0.5 + Math.random() * 0.5
      }

      // Handle phase transitions
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
      {/* Canvas pixel rain */}
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

      {/* Revealed layer underneath */}
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
        {/* Fine-line SVG Logo */}
        {showContent && (
          <div style={{
            animation: 'logoFadeIn 2s ease-out forwards',
            textAlign: 'center',
            maxWidth: '90vw',
            padding: '2rem',
          }}>
            {/* SVG: Fine-line onion + SH monogram */}
            <svg
              width="120"
              height="140"
              viewBox="0 0 120 140"
              style={{ margin: '0 auto 1.5rem', display: 'block' }}
            >
              {/* Onion outline — fine lines */}
              <g fill="none" stroke="#0f0" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
                {/* Onion body */}
                <path d="M60 20 C60 20, 30 35, 30 70 C30 105, 45 125, 60 130 C75 125, 90 105, 90 70 C90 35, 60 20, 60 20Z" />
                {/* Inner layers */}
                <path d="M60 30 C60 30, 40 42, 40 70 C40 98, 50 115, 60 120 C70 115, 80 98, 80 70 C80 42, 60 30, 60 30Z" opacity="0.6" />
                <path d="M60 42 C60 42, 48 50, 48 70 C48 90, 54 105, 60 108 C66 105, 72 90, 72 70 C72 50, 60 42, 60 42Z" opacity="0.4" />
                {/* Stem */}
                <path d="M58 20 L58 8 L62 8 L62 20" />
                <path d="M56 12 L64 12" opacity="0.5" />
                {/* Roots */}
                <path d="M55 128 Q52 135 50 138" opacity="0.4" />
                <path d="M60 130 L60 138" opacity="0.4" />
                <path d="M65 128 Q68 135 70 138" opacity="0.4" />
              </g>

              {/* SH monogram inside — fine, elegant */}
              <text
                x="60"
                y="85"
                textAnchor="middle"
                fill="none"
                stroke="#0f0"
                strokeWidth="0.6"
                fontFamily="Georgia, serif"
                fontSize="28"
                fontStyle="italic"
                opacity="0.9"
              >
                SH
              </text>

              {/* Decorative dots */}
              <circle cx="60" cy="110" r="1.5" fill="#0f0" opacity="0.6" />
              <circle cx="45" cy="60" r="1" fill="#0f0" opacity="0.3" />
              <circle cx="75" cy="60" r="1" fill="#0f0" opacity="0.3" />
            </svg>

            <h1 style={{
              fontFamily: '"Courier New", monospace',
              fontSize: 'clamp(1rem, 3vw, 1.5rem)',
              color: '#0f0',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
              fontWeight: 300,
              textShadow: '0 0 15px #0f040',
            }}>
              SOULHAVEN
            </h1>
            <p style={{
              fontFamily: '"Courier New", monospace',
              fontSize: 'clamp(0.625rem, 2vw, 0.875rem)',
              color: '#0f0',
              opacity: 0.6,
              letterSpacing: '0.3em',
              fontWeight: 300,
            }}>
              SECURE LAYER ACTIVE
            </p>
          </div>
        )}

        {/* "You're safe" notice */}
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
              border: '1px solid #0f0',
              borderRadius: '2px',
              background: 'rgba(0, 255, 0, 0.03)',
            }}>
              <p style={{
                fontFamily: '"Courier New", monospace',
                fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                color: '#0f0',
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
                color: '#0f0',
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

        {/* Exit button — click to toggle off */}
        {showContent && (
          <button
            onClick={() => {
              // We need to toggle back off — but this component doesn't have access to toggleSecure
              // So we dispatch a custom event that App.tsx listens for
              window.dispatchEvent(new CustomEvent('toggleSecureMode'))
            }}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'transparent',
              border: '1px solid #0f0',
              color: '#0f0',
              padding: '0.5rem 1rem',
              fontFamily: '"Courier New", monospace',
              fontSize: '0.75rem',
              cursor: 'pointer',
              opacity: 0.6,
              transition: 'opacity 0.3s',
              zIndex: 10,
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
          >
            [EXIT]
          </button>
        )}
      </div>

      {/* Keyframe styles */}
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
