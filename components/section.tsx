"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import BackgroundShapes from "@/components/background-shapes"

interface SectionProps {
  id: string
  variant?: "hero" | "projects" | "skills" | "experience" | "education" | "certificates" | "gallery" | "contact"
  title?: string
  subtitle?: string
  children: ReactNode
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
}

export default function Section({ id, variant = "hero", title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <BackgroundShapes variant={variant} />
      <div className="container z-10 px-4 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mx-auto max-w-6xl"
        >
          {title && (
            <motion.h2 variants={fadeInUp} className="mb-8 text-center text-4xl font-bold tracking-tight md:text-5xl">
              {title}
            </motion.h2>
          )}

          {subtitle && (
            <motion.p variants={fadeInUp} className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              {subtitle}
            </motion.p>
          )}

          {children}
        </motion.div>
      </div>
    </section>
  )
}
