"use client"

"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"

interface BackgroundShapesProps {
  variant?: "hero" | "projects" | "skills" | "experience" | "education" | "certificates" | "gallery" | "contact"
}

export default function BackgroundShapes({ variant = "hero" }: BackgroundShapesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const [isVisible, setIsVisible] = useState(false)

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
        transitionPattern: "radial",
      },
      projects: {
        particleCount: 55,
        colors: isDark ? ["#6366f1", "#8b5cf6", "#d946ef", "#ec4899"] : ["#818cf8", "#a78bfa", "#e879f9", "#f472b6"],
        speed: 0.5,
        size: { min: 2, max: 9 },
        opacity: { min: 0.1, max: isDark ? 0.6 : 0.4 },
        transitionPattern: "horizontal",
      },
      skills: {
        particleCount: 50,
        colors: isDark ? ["#10b981", "#3b82f6", "#6366f1", "#0ea5e9"] : ["#34d399", "#60a5fa", "#818cf8", "#38bdf8"],
        speed: 0.4,
        size: { min: 3, max: 10 },
        opacity: { min: 0.1, max: isDark ? 0.5 : 0.4 },
        transitionPattern: "vertical",
      },
      experience: {
        particleCount: 55,
        colors: isDark ? ["#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"] : ["#fbbf24", "#f87171", "#a78bfa", "#f472b6"],
        speed: 0.5,
        size: { min: 2, max: 7 },
        opacity: { min: 0.1, max: isDark ? 0.5 : 0.3 },
        transitionPattern: "diagonal",
      },
      education: {
        particleCount: 50,
        colors: isDark ? ["#0ea5e9", "#6366f1", "#8b5cf6", "#3b82f6"] : ["#38bdf8", "#818cf8", "#a78bfa", "#60a5fa"],
        speed: 0.45,
        size: { min: 2, max: 9 },
        opacity: { min: 0.1, max: isDark ? 0.5 : 0.4 },
        transitionPattern: "spiral",
      },
      certificates: {
        particleCount: 55,
        colors: isDark ? ["#f59e0b", "#10b981", "#3b82f6", "#6366f1"] : ["#fbbf24", "#34d399", "#60a5fa", "#818cf8"],
        speed: 0.55,
        size: { min: 2, max: 8 },
        opacity: { min: 0.1, max: isDark ? 0.6 : 0.4 },
        transitionPattern: "wave",
      },
      gallery: {
        particleCount: 50,
        colors: isDark ? ["#ec4899", "#8b5cf6", "#3b82f6", "#d946ef"] : ["#f472b6", "#a78bfa", "#60a5fa", "#e879f9"],
        speed: 0.5,
        size: { min: 3, max: 9 },
        opacity: { min: 0.1, max: isDark ? 0.5 : 0.4 },
        transitionPattern: "explosion",
      },
      contact: {
        particleCount: 45,
        colors: isDark ? ["#10b981", "#6366f1", "#ec4899", "#3b82f6"] : ["#34d399", "#818cf8", "#f472b6", "#60a5fa"],
        speed: 0.45,
        size: { min: 2, max: 8 },
        opacity: { min: 0.1, max: isDark ? 0.5 : 0.4 },
        transitionPattern: "convergence",
      },
    }

    return configs[variant] || configs.hero
  }

  useEffect(() => {
    // Set visible after a small delay to trigger animations
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [variant])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = Math.floor(window.innerWidth * dpr)
        canvas.height = Math.floor(window.innerHeight * dpr)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions, { passive: true })

    // Configuration
    const config = getConfig()
    const area = (canvas.width * canvas.height) / 1e6
    const densityFactor = Math.max(0.5, Math.min(1, area / 2))
    const targetCount = Math.max(20, Math.floor(config.particleCount * densityFactor))

    // Define centerX and centerY here so they're available throughout the effect
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Create particles
    const particles: {
      x: number
      y: number
      radius: number
      color: string
      speedX: number
      speedY: number
      opacity: number
      initialX?: number
      initialY?: number
      targetX?: number
      targetY?: number
      angle?: number
      distance?: number
      amplitude?: number
      frequency?: number
      phase?: number
    }[] = []

    // Initialize particles based on transition pattern
    const initializeParticles = () => {
      particles.length = 0 // Clear existing particles

      for (let i = 0; i < targetCount; i++) {
        const radius = Math.random() * (config.size.max - config.size.min) + config.size.min
        let x = 0,
          y = 0,
          speedX = 0,
          speedY = 0
        const color = config.colors[Math.floor(Math.random() * config.colors.length)]
        const speedFactor = config.speed
        const opacity = Math.random() * (config.opacity.max - config.opacity.min) + config.opacity.min

        // Different initialization based on transition pattern
        switch (config.transitionPattern) {
          case "radial":
            // Start from center and move outward
            const angle = Math.random() * Math.PI * 2
            const distance = (Math.random() * Math.min(canvas.width, canvas.height)) / 2
            x = centerX + Math.cos(angle) * distance
            y = centerY + Math.sin(angle) * distance
            speedX = Math.cos(angle) * speedFactor
            speedY = Math.sin(angle) * speedFactor
            break

          case "horizontal":
            // Move horizontally across the screen
            x = Math.random() < 0.5 ? -radius : canvas.width + radius
            y = Math.random() * canvas.height
            speedX = (Math.random() * 0.5 + 0.5) * speedFactor * (x < 0 ? 1 : -1)
            speedY = (Math.random() - 0.5) * speedFactor * 0.2
            break

          case "vertical":
            // Move vertically across the screen
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? -radius : canvas.height + radius
            speedX = (Math.random() - 0.5) * speedFactor * 0.2
            speedY = (Math.random() * 0.5 + 0.5) * speedFactor * (y < 0 ? 1 : -1)
            break

          case "diagonal":
            // Move diagonally across the screen
            const startCorner = Math.floor(Math.random() * 4)
            if (startCorner === 0) {
              // Top-left
              x = -radius
              y = -radius
              speedX = (Math.random() * 0.5 + 0.5) * speedFactor
              speedY = (Math.random() * 0.5 + 0.5) * speedFactor
            } else if (startCorner === 1) {
              // Top-right
              x = canvas.width + radius
              y = -radius
              speedX = -(Math.random() * 0.5 + 0.5) * speedFactor
              speedY = (Math.random() * 0.5 + 0.5) * speedFactor
            } else if (startCorner === 2) {
              // Bottom-left
              x = -radius
              y = canvas.height + radius
              speedX = (Math.random() * 0.5 + 0.5) * speedFactor
              speedY = -(Math.random() * 0.5 + 0.5) * speedFactor
            } else {
              // Bottom-right
              x = canvas.width + radius
              y = canvas.height + radius
              speedX = -(Math.random() * 0.5 + 0.5) * speedFactor
              speedY = -(Math.random() * 0.5 + 0.5) * speedFactor
            }
            break

          case "spiral":
            // Spiral pattern
            const spiralAngle = Math.random() * Math.PI * 2
            const spiralDistance = (Math.random() * Math.min(canvas.width, canvas.height)) / 3
            x = centerX + Math.cos(spiralAngle) * spiralDistance
            y = centerY + Math.sin(spiralAngle) * spiralDistance
            particles.push({
              x,
              y,
              radius,
              color,
              opacity,
              speedX: Math.cos(spiralAngle + Math.PI / 2) * speedFactor,
              speedY: Math.sin(spiralAngle + Math.PI / 2) * speedFactor,
              angle: spiralAngle,
              distance: spiralDistance,
            })
            continue

          case "wave":
            // Wave pattern
            x = Math.random() * canvas.width
            y = centerY + (Math.random() - 0.5) * 100
            particles.push({
              x,
              y,
              radius,
              color,
              opacity,
              speedX: (Math.random() - 0.5) * speedFactor,
              speedY: (Math.random() - 0.5) * speedFactor * 0.5,
              amplitude: Math.random() * 50 + 20,
              frequency: Math.random() * 0.02 + 0.01,
              phase: Math.random() * Math.PI * 2,
              initialY: y,
            })
            continue

          case "explosion":
            // Explosion from center
            x = centerX
            y = centerY
            const explosionAngle = Math.random() * Math.PI * 2
            speedX = Math.cos(explosionAngle) * speedFactor * 2
            speedY = Math.sin(explosionAngle) * speedFactor * 2
            break

          case "convergence":
            // Converge to center
            x = Math.random() * canvas.width
            y = Math.random() * canvas.height
            const dx = centerX - x
            const dy = centerY - y
            const dist = Math.sqrt(dx * dx + dy * dy)
            speedX = (dx / dist) * speedFactor * 0.5
            speedY = (dy / dist) * speedFactor * 0.5
            break

          default:
            // Default random movement
            x = Math.random() * canvas.width
            y = Math.random() * canvas.height
            speedX = (Math.random() - 0.5) * speedFactor
            speedY = (Math.random() - 0.5) * speedFactor
        }

        particles.push({ x, y, radius, color, speedX, speedY, opacity })
      }
    }

    initializeParticles()

    // Animation loop
    let animationFrameId: number

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        // Update position based on pattern
        if (config.transitionPattern === "spiral") {
          if (particle.angle !== undefined && particle.distance !== undefined) {
            particle.angle += 0.01
            particle.distance += 0.1
            particle.x = centerX + Math.cos(particle.angle) * particle.distance
            particle.y = centerY + Math.sin(particle.angle) * particle.distance

            // Reset particles that go too far
            if (particle.distance > Math.max(canvas.width, canvas.height)) {
              particle.distance = 0
            }
          }
        } else if (
          config.transitionPattern === "wave" &&
          particle.initialY !== undefined &&
          particle.amplitude !== undefined &&
          particle.frequency !== undefined &&
          particle.phase !== undefined
        ) {
          // Wave movement
          particle.x += particle.speedX
          particle.phase += particle.frequency
          particle.y = particle.initialY + Math.sin(particle.phase) * particle.amplitude
        } else {
          // Standard movement
          particle.x += particle.speedX
          particle.y += particle.speedY
        }

        // Bounce off edges or wrap around
        if (
          config.transitionPattern === "horizontal" ||
          config.transitionPattern === "vertical" ||
          config.transitionPattern === "diagonal"
        ) {
          // Wrap around for these patterns
          if (particle.x < -particle.radius) particle.x = canvas.width + particle.radius
          if (particle.x > canvas.width + particle.radius) particle.x = -particle.radius
          if (particle.y < -particle.radius) particle.y = canvas.height + particle.radius
          if (particle.y > canvas.height + particle.radius) particle.y = -particle.radius
        } else {
          // Bounce for other patterns
          if (particle.x < 0 || particle.x > canvas.width) {
            particle.speedX = -particle.speedX
          }
          if (particle.y < 0 || particle.y > canvas.height) {
            particle.speedY = -particle.speedY
          }
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

  // Get decorative shape variants based on section
  const getShapeVariants = () => {
    switch (variant) {
      case "hero":
        return [
          {
            initial: { opacity: 0, scale: 0 },
            animate: { opacity: 0.15, scale: 1 },
            transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" as "reverse" },
            className: "absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-primary/20 blur-3xl",
          },
          {
            initial: { opacity: 0, scale: 0 },
            animate: { opacity: 0.15, scale: 1 },
            transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" as "reverse", delay: 0.5 },
            className: "absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl",
          },
          {
            initial: { opacity: 0, scale: 0, rotate: 0 },
            animate: { opacity: 0.1, scale: 1, rotate: 180 },
            transition: { duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" as "reverse", delay: 1 },
            className: "absolute top-1/2 right-1/3 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl",
          },
        ]
      case "projects":
        return [
          {
            initial: { opacity: 0, scale: 0, x: -100 },
            animate: { opacity: 0.15, scale: 1, x: 0 },
            transition: { duration: 2.1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
            className: "absolute top-1/4 right-1/4 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl",
          },
          {
            initial: { opacity: 0, scale: 0, x: 100 },
            animate: { opacity: 0.15, scale: 1, x: 0 },
            transition: { duration: 1.6, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.3 },
            className: "absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl",
          },
          {
            initial: { opacity: 0, scale: 0, y: 100 },
            animate: { opacity: 0.1, scale: 1, y: 0 },
            transition: { duration: 2.3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.7 },
            className: "absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl",
          },
        ]
      case "skills":
        return [
          {
            initial: { opacity: 0, scale: 0, rotate: -45 },
            animate: { opacity: 0.15, scale: 1, rotate: 0 },
            transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
            className: "absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-green-500/20 blur-3xl",
          },
          {
            initial: { opacity: 0, scale: 0, rotate: 45 },
            animate: { opacity: 0.15, scale: 1, rotate: 0 },
            transition: { duration: 1.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.3 },
            className: "absolute bottom-1/3 left-1/4 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl",
          },
          {
            initial: { opacity: 0, scale: 0, y: -100 },
            animate: { opacity: 0.1, scale: 1, y: 0 },
            transition: { duration: 2.4, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.6 },
            className: "absolute bottom-1/4 right-1/3 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl",
          },
        ]
      case "experience":
        return [
          {
            initial: { opacity: 0, x: -200 },
            animate: { opacity: 0.15, x: 0 },
            transition: { duration: 1.7, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
            className: "absolute top-1/4 right-1/3 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl",
          },
          {
            initial: { opacity: 0, x: 200 },
            animate: { opacity: 0.15, x: 0 },
            transition: { duration: 2.2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.4 },
            className: "absolute bottom-1/4 left-1/3 h-96 w-96 rounded-full bg-red-500/20 blur-3xl",
          },
          {
            initial: { opacity: 0, y: 200 },
            animate: { opacity: 0.1, y: 0 },
            transition: { duration: 2.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.8 },
            className: "absolute top-1/3 left-1/4 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl",
          },
        ]
      case "education":
        return [
          {
            initial: { opacity: 0, borderRadius: "0%" },
            animate: { opacity: 0.1, borderRadius: "50%" },
            transition: { duration: 1.9, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
            className: "absolute top-1/3 left-1/3 h-72 w-72 bg-sky-500/20 blur-3xl",
          },
          {
            initial: { opacity: 0, borderRadius: "0%" },
            animate: { opacity: 0.1, borderRadius: "50%" },
            transition: { duration: 2.3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.5 },
            className: "absolute bottom-1/3 right-1/3 h-64 w-64 bg-indigo-500/20 blur-3xl",
          },
          {
            initial: { opacity: 0, width: 0, height: 0 },
            animate: { opacity: 0.1, width: 300, height: 300 },
            transition: { duration: 2.7, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.8 },
            className: "absolute top-1/2 right-1/4 rounded-full bg-blue-500/20 blur-3xl",
          },
        ]
      case "certificates":
        return [
          {
            initial: { opacity: 0, scale: 0, skewX: 30 },
            animate: { opacity: 0.1, scale: 1, skewX: 0 },
            transition: { duration: 2.1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
            className: "absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl",
          },
          {
            initial: { opacity: 0, scale: 0, skewX: -30 },
            animate: { opacity: 0.1, scale: 1, skewX: 0 },
            transition: { duration: 1.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.3 },
            className: "absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl",
          },
          {
            initial: { opacity: 0, scale: 0, skewY: 30 },
            animate: { opacity: 0.1, scale: 1, skewY: 0 },
            transition: { duration: 2.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.6 },
            className: "absolute top-1/2 center h-64 w-64 rounded-full bg-blue-500/20 blur-3xl",
          },
        ]
      case "gallery":
        return [
          {
            initial: { opacity: 0, scale: 0, rotate: 90 },
            animate: { opacity: 0.1, scale: 1, rotate: 0 },
            transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
            className: "absolute top-1/3 right-1/3 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl",
          },
          {
            initial: { opacity: 0, scale: 0, rotate: -90 },
            animate: { opacity: 0.1, scale: 1, rotate: 0 },
            transition: { duration: 1.7, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.4 },
            className: "absolute bottom-1/3 left-1/3 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl",
          },
          {
            initial: { opacity: 0, scale: 0, rotate: 180 },
            animate: { opacity: 0.1, scale: 1, rotate: 0 },
            transition: { duration: 2.3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.8 },
            className: "absolute center h-72 w-72 rounded-full bg-purple-500/20 blur-3xl",
          },
        ]
      case "contact":
        return [
          {
            initial: { opacity: 0, y: -100, x: -100 },
            animate: { opacity: 0.1, y: 0, x: 0 },
            transition: { duration: 1.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
            className: "absolute top-1/4 right-1/4 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl",
          },
          {
            initial: { opacity: 0, y: 100, x: 100 },
            animate: { opacity: 0.1, y: 0, x: 0 },
            transition: { duration: 2.2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.5 },
            className: "absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl",
          },
          {
            initial: { opacity: 0, scale: 0, borderRadius: "0%" },
            animate: { opacity: 0.1, scale: 1, borderRadius: "50%" },
            transition: { duration: 2.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 1 },
            className: "absolute center h-80 w-80 bg-blue-500/20 blur-3xl",
          },
        ]
      default:
        return []
    }
  }

  const shapeVariants = getShapeVariants()

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ pointerEvents: "none" }} />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-background/30" />

      {/* Decorative shapes based on variant with AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={variant}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {shapeVariants.map((shape, index) => (
              <motion.div
                key={`${variant}-shape-${index}`}
                initial={shape.initial}
                animate={shape.animate}
                transition={{ ...shape.transition, repeatType: shape.transition.repeatType as "reverse" | "loop" | "mirror" | undefined }}
                className={shape.className}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
