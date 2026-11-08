import type { SimpleIcon } from 'simple-icons'
import {
  siGithub,
  siGithubactions,
  siReact,
  siTailwindcss,
  siTypescript,
  siVite,
} from 'simple-icons'

const brandIcons: Record<string, SimpleIcon> = {
  'GitHub Actions': siGithubactions,
  GitHub: siGithub,
  React: siReact,
  'Tailwind CSS': siTailwindcss,
  TypeScript: siTypescript,
  Vite: siVite,
}

type BrandIconProps = {
  name: string
  size?: number
  className?: string
}

export default function BrandIcon({ name, size = 16, className }: BrandIconProps) {
  if (name === 'Microsoft Office') {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path fill="#f25022" d="M1 1h10v10H1z" />
        <path fill="#7fba00" d="M13 1h10v10H13z" />
        <path fill="#00a4ef" d="M1 13h10v10H1z" />
        <path fill="#ffb900" d="M13 13h10v10H13z" />
      </svg>
    )
  }

  const icon = brandIcons[name]
  if (!icon) return null

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill={`#${icon.hex}`}
    >
      <path d={icon.path} />
    </svg>
  )
}
