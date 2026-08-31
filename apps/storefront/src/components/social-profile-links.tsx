import type { ReactElement } from "react"
import type { SocialProfileId } from "@/lib/social-profiles"
import { resolveSocialProfileLinks } from "@/lib/social-profiles"

const iconClass = "h-[18px] w-[18px] shrink-0"

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.5 8.5V6.8c0-.7.5-1.3 1.2-1.3H17V3h-2.1C12.4 3 11 4.5 11 6.6v1.9H9v2.7h2V21h3.2v-9.8h2.2l.4-2.7h-2.6Z"
      />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.5 9.5H3.8V20h2.7V9.5ZM5.1 4C4.2 4 3.5 4.7 3.5 5.6c0 .9.7 1.6 1.6 1.6.9 0 1.6-.7 1.6-1.6C6.7 4.7 6 4 5.1 4ZM20.2 13.2c0-2.6-1.4-4-3.3-4-1.3 0-2.1.7-2.5 1.4h-.1V9.5H12v10.5h2.7v-5.2c0-1.4.3-2.7 2-2.7 1.6 0 1.7 1.5 1.7 2.8V20H21v-6.8h-.8Z"
      />
    </svg>
  )
}

function MediumIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
      <path
        fill="currentColor"
        d="M4.2 7.4c.1-.3 0-.6-.2-.8L3 5.2V5h5.2l4 8.8L16 5h5v.2l-1.1 1c-.1.1-.2.3-.2.5v10.6c0 .2 0 .4.2.5l1.1 1V19h-7.4v-.2l1.2-1.1c.1-.1.1-.2.1-.5V8.2l-4.6 11.6h-.6L4.7 8.2v7.8c-.1.4.1.8.4 1.1l1.6 1.9v.2H3v-.2l1.6-1.9c.3-.3.4-.7.4-1.1V7.4Z"
      />
    </svg>
  )
}

function QuoraIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.1 4.2c-3.8 0-6.7 2.8-6.7 6.9 0 4 2.8 6.8 6.5 6.8 1.1 0 2.1-.2 2.8-.6l1.6 2.2c.3.4.7.7 1.4.7h.8v-3.3c1-.9 1.6-2.4 1.6-4.2 0-4.5-2.8-8.5-8-8.5Zm-.2 11.2c-2.4 0-4-1.8-4-4.4 0-2.6 1.6-4.4 4-4.4s4 1.8 4 4.4c0 2.6-1.6 4.4-4 4.4Z"
      />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.7 10.3 21.2 3h-1.5l-5.6 6.4L9.6 3H3.8l6.9 10 6.4 9.3h1.5l-5.6-8.1L19.4 22h1.5l-6.2-11.7ZM8.8 4.2h1.8l9.5 15.6h-1.8L8.8 4.2Z"
      />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
      <path
        fill="currentColor"
        d="M8.5 3h7A5.5 5.5 0 0 1 21 8.5v7A5.5 5.5 0 0 1 15.5 21h-7A5.5 5.5 0 0 1 3 15.5v-7A5.5 5.5 0 0 1 8.5 3Zm0 1.8A3.7 3.7 0 0 0 4.8 8.5v7a3.7 3.7 0 0 0 3.7 3.7h7a3.7 3.7 0 0 0 3.7-3.7v-7a3.7 3.7 0 0 0-3.7-3.7h-7ZM17.2 6.4a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7.6A4.4 4.4 0 1 1 7.6 12 4.4 4.4 0 0 1 12 7.6Zm0 1.8A2.6 2.6 0 1 0 14.6 12 2.6 2.6 0 0 0 12 9.4Z"
      />
    </svg>
  )
}

const ICONS: Record<SocialProfileId, () => ReactElement> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  medium: MediumIcon,
  quora: QuoraIcon,
  x: XIcon
}

type Props = {
  className?: string
}

export function SocialProfileLinks({ className = "" }: Props) {
  const profiles = resolveSocialProfileLinks()
  if (!profiles.length) return null

  return (
    <ul className={`space-y-2 ${className}`.trim()}>
      {profiles.map((profile) => {
        const Icon = ICONS[profile.id]
        return (
          <li key={profile.id}>
            <a
              href={profile.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2.5 text-[#475569] transition-colors hover:text-[#0D9488]"
            >
              <Icon />
              <span>{profile.label}</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
