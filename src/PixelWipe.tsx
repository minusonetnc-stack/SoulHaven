import { useEffect, useRef, useState, useCallback } from 'react'

interface PixelWipeProps {
  isActive: boolean
  onComplete?: () => void
  onReverseComplete?: () => void
}

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF'
const LOGO_TEXT = 'SOULHAVEN'
const TOR_TEXT = 'TOR'

export default function PixelWipe({ isActive, onComplete, onReverseComplete }: PixelWipeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<'idle' | 'wiping' | 'revealed' | 'reversing'>('idle')
  const [showLogo, setShowLogo] = useState(false)
  const [showNotice, setShowNotice] = useState(false)
  const animationRef = useRef<number>(0)
  const dropsRef = useRef<number[]>([])
  const cutProgressRef = useRef(0)

  // Track phase changes
  useEffect(() => {
    if (isActive && phase === 'idle') {
      setPhase('wiping')
      setShowLogo(false)
      setShowNotice(false)
      cutProgressRef.current = 0
    } else if (!isActive && phase === 'revealed') {
      setPhase('reversing')
      setShowNotice(false)
    }
  }, [isActive, phase])

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const columns = Math.floor(canvas.width / 14)
      dropsRef.current = new Array(columns).fill(1)
    }
    resize()
    window.addEventListener('resize', resize)

    let frameCount = 0

    const draw = () => {
      if (!ctx || !canvas) return
      frameCount++

      // Semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#0f0'
      ctx.font = '14px monospace'

      const drops = dropsRef.current
      const cutProgress = cutProgressRef.current

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const x = i * 14
        const y = drops[i] * 14

        // "Cut through" effect — in the center area, characters fade to reveal layer
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
        const maxDist = Math.min(canvas.width, canvas.height) * 0.4 * cutProgress

        if (distFromCenter < maxDist && cutProgress > 0.1) {
          // Inside the "cut" — fade out or skip
          ctx.globalAlpha = Math.max(0, (distFromCenter / maxDist) - 0.3)
        } else {
          ctx.globalAlpha = 1
        }

        ctx.fillText(char, x, y)
        ctx.globalAlpha = 1

        // Reset drop to top randomly
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      // Handle phase transitions
      if (phase === 'wiping') {
        cutProgressRef.current = Math.min(1, cutProgressRef.current + 0.008)
        if (cutProgressRef.current >= 1) {
          setPhase('revealed')
          setTimeout(() => setShowLogo(true), 200)
          setTimeout(() => setShowNotice(true), 800)
          onComplete?.()
        }
      } else if (phase === 'reversing') {
        cutProgressRef.current = Math.max(0, cutProgressRef.current - 0.015)
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
      zIndex: 9999,
      pointerEvents: phase === 'revealed' ? 'none' : 'auto',
    }}>
      {/* Canvas pixel rain */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase === 'revealed' ? 0.3 : 1,
          transition: 'opacity 1s ease',
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
        opacity: cutProgressRef.current > 0.5 ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}>
        {/* Logo reveal */}
        {showLogo && (
          <div style={{
            animation: 'logoReveal 1.5s ease-out forwards',
            textAlign: 'center',
          }}>
            {/* Tor onion style logo */}
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 1.5rem',
              borderRadius: '50%',
              border: '3px solid #0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              color: '#0f0',
              boxShadow: '0 0 40px #0f040, inset 0 0 40px #0f020',
              animation: 'pulse 2s ease-in-out infinite',
            }}>
              🧅
            </div>
            <h1 style={{
              fontFamily: '"Courier New", monospace',
              fontSize: '1.5rem',
              color: '#0f0',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
              textShadow: '0 0 20px #0f0',
            }}>
              {LOGO_TEXT}
            </h1>
            <p style={{
              fontFamily: '"Courier New", monospace',
              fontSize: '0.75rem',
              color: '#0f0aa',
              letterSpacing: '0.2em',
            }}>
              SECURE LAYER ACTIVE
            </p>
          </div>
        )}

        {/* "You're safe" notice */}
        {showNotice && (
          <div style={{
            position: 'absolute',
            bottom: '20%',
            animation: 'fadeUp 1s ease-out forwards',
            textAlign: 'center',
          }}>
            <div style={{
              padding: '1rem 2rem',
              border: '1px solid #0f0',
              borderRadius: '4px',
              background: 'rgba(0, 255, 0, 0.05)',
            }}>
              <p style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '1rem',
                color: '#0f0',
                margin: 0,
                textShadow: '0 0 10px #0f0',
              }}>
                ✓ You're safe
              </p>
              <p style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '0.625rem',
                color: '#0f0aa',
                marginTop: '0.5rem',
              }}>
                End-to-end encrypted • No logs • Anonymous
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes logoReveal {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 40px #0f040, inset 0 0 40px #0f020; }
          50% { box-shadow: 0 0 60px #0f080, inset 0 0 60px #0f040; }
        }
      `}</style>
    </div>
  )
}
