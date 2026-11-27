// SoulHaven mark — one-color inline SVG from the theme proposal:
// an enveloping circle, a roofline, and a sheltered figure. No emoji.
export default function HavenMark({
  size = 64,
  color = 'currentColor',
  style,
}: {
  size?: number
  color?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-label="SoulHaven mark"
    >
      <circle cx="24" cy="24" r="17" />
      <path d="M15.5 26.5 L24 18.5 L32.5 26.5" />
      <circle cx="24" cy="31.5" r="1.8" fill={color} stroke="none" />
    </svg>
  )
}
