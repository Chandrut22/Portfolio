"use client"

import type React from "react"
import { trackLinkClick } from "@/lib/click-tracker"

interface TrackedLinkProps {
  href: string
  id: string
  children: React.ReactNode
  className?: string
}

export default function TrackedLink({ href, id, children, className = "" }: TrackedLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackLinkClick(id, href)
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`hover:underline ${className}`}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
