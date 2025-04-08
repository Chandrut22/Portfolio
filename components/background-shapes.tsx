"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

interface BackgroundShapesProps {
  variant?: "hero" | "projects" | "skills" | "experience" | "education" | "certificates" | "gallery" | "contact"
}

export default function BackgroundShapes({ variant = "hero" }: BackgroundShapesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  // Different background configurations based on variant
  const getConfig = () => {
    const isDark = theme === "dark"

    const configs = {
      hero: {
        particleCount: 60,
        colors: isDark ? ["#3b82f6", "#8b5cf6", "#ec4899"] : ["#3b82f6", "#8b5cf6", "#ec4899"],
        speed: 0.6,
        size: { min: 2, max: 8 },
        opacity: { min: 0.1, max: isDark ? 0.6 : 0.4 },
      },
      projects: {
        particleCount: 55,
        colors: isDark ? ["#6366f1", "#8b5cf6", "#d946ef", "#ec4899"] : ["#818cf8", "#a78bfa", "#e879f9", "#f472b6"],
        speed: 0.5,
        size: { min: 2, max: 9 },
        opacity: { min: 0.1, max: isDark ? 0.6 : 0.4 },
      },
      skills: {
        particleCount: 50,
        colors: isDark ? ["#10b981", "#3b82f6", "#6366f1", "#0ea5e9"] : ["#34d399", "#60a5fa", "#818cf8", "#38bdf8"],
        speed: 0.4,
        size: { min: 3, max: 10 },
        opacity: { min: 0.1, max: isDark ? 0.5 : 0.4 },
      },
      experience: {
        particleCount: 55,
        colors: isDark ? ["#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"] : ["#fbbf24", "#f87171", "#a78bfa", "#f472b6"],
        speed: 0.5,
        size: { min: 2, max: 7 },
        opacity: { min: 0.1, max: isDark ? 0.5 : 0.3 },
      },
      education: {
        particleCount: 50,
        colors: isDark ? ["#0ea5e9", "#6366f1", "#8b5cf6", "#3b82f6"] : ["#38bdf8", "#818cf8", "#a78bfa", "#60a5fa"],
        speed: 0.45,
        size: { min: 2, max: 9 },
        opacity: { min: 0.1, max: isDark ? 0.5 : 0.4 },
      },
      certificates: {
        particleCount: 55,
        colors: isDark ? ["#f59e0b", "#10b981", "#3b82f6", "#6366f1"] : ["#fbbf24", "#34d399", "#60a5fa", "#818cf8"],
        speed: 0.55,
        size: { min: 2, max: 8 },
        opacity: { min: 0.1, max: isDark ? 0.6 : 0.4 },
      },
      gallery: {
        particleCount: 50,
        colors: isDark ? ["#ec4899", "#8b5cf6", "#3b82f6", "#d946ef"] : ["#f472b6", "#a78bfa", "#60a5fa", "#e879f9"],
        speed: 0.5,
        size: { min: 3, max: 9 },
        opacity: { min: 0.1, max: isDark ? 0.5 : 0.4 },
      },
      contact: {
        particleCount: 45,
        colors: isDark ? ["#10b981", "#6366f1", "#ec4899", "#3b82f6"] : ["#34d399", "#818cf8", "#f472b6", "#60a5fa"],
        speed: 0.45,
        size: { min: 2, max: 8 },
        opacity: { min: 0.1, max: isDark ? 0.5 : 0.4 },
      },
    }

    return configs[variant] || configs.hero
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Configuration
    const config = getConfig()

    // Create particles
    const particles: {
      x: number
      y: number
      radius: number
      color: string
      speedX: number
      speedY: number
      opacity: number
    }[] = []

    for (let i = 0; i < config.particleCount; i++) {
      const radius = Math.random() * (config.size.max - config.size.min) + config.size.min
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const color = config.colors[Math.floor(Math.random() * config.colors.length)]
      const speedFactor = config.speed
      const speedX = (Math.random() - 0.5) * speedFactor
      const speedY = (Math.random() - 0.5) * speedFactor
      const opacity = Math.random() * (config.opacity.max - config.opacity.min) + config.opacity.min

      particles.push({
        x,
        y,
        radius,
        color,
        speedX,
        speedY,
        opacity,
      })
    }

    // Animation loop
    let animationFrameId: number

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      })
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [variant, theme])

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ pointerEvents: "none" }} />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-background/30" />

      {/* Decorative shapes based on variant */}
      {variant === "hero" && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-primary/20 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.5 }}
            className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{ opacity: 0.1, scale: 1, rotate: 180 }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 1 }}
            className="absolute top-1/2 right-1/3 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl"
          />
        </>
      )}

      {variant === "projects" && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 2.1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            className="absolute top-1/4 right-1/4 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.3 }}
            className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0, x: -100 }}
            animate={{ opacity: 0.1, scale: 1, x: 0 }}
            transition={{ duration: 2.3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.7 }}
            className="absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl"
          />
        </>
      )}

      {variant === "skills" && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            className="absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-green-500/20 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.3 }}
            className="absolute bottom-1/3 left-1/4 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0, x: 100 }}
            animate={{ opacity: 0.1, scale: 1, x: 0 }}
            transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.6 }}
            className="absolute bottom-1/4 right-1/3 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"
          />
        </>
      )}

      {variant === "experience" && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 1.7, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            className="absolute top-1/4 right-1/3 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.4 }}
            className="absolute bottom-1/4 left-1/3 h-96 w-96 rounded-full bg-red-500/20 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 100 }}
            animate={{ opacity: 0.1, scale: 1, y: 0 }}
            transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.8 }}
            className="absolute top-1/3 left-1/4 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl"
          />
        </>
      )}

      {variant === "education" && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1.9, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            className="absolute top-1/3 left-1/3 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 2.3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.5 }}
            className="absolute bottom-1/3 right-1/3 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"
          />
        </>
      )}

      {variant === "certificates" && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 2.1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.3 }}
            className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl"
          />
        </>
      )}

      {variant === "gallery" && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            className="absolute top-1/3 right-1/3 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1.7, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.4 }}
            className="absolute bottom-1/3 left-1/3 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl"
          />
        </>
      )}

      {variant === "contact" && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            className="absolute top-1/4 right-1/4 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.5 }}
            className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"
          />
        </>
      )}
    </>
  )
}

