"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getTransitionVariants, sectionTransitions, type TransitionType } from "@/lib/transition-utils"

interface SectionTransitionProps {
  children: React.ReactNode
  id: string
  className?: string
  transitionType?: TransitionType
}

export default function SectionTransition({ children, id, className = "", transitionType }: SectionTransitionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when the section enters/exits the viewport
        const isIntersecting = entry.isIntersecting

        if (isIntersecting) {
          setIsExiting(false)
          setIsVisible(true)
          setHasBeenVisible(true)
        } else if (hasBeenVisible) {
          // Only trigger exit animations if the section has been visible before
          setIsExiting(true)
          setTimeout(() => {
            setIsVisible(false)
          }, 300) // Small delay to ensure exit animation plays
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1, // Trigger when 10% of the element is visible
      },
    )

    const element = document.getElementById(id)
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [id, hasBeenVisible])

  // Get transition variants based on section ID or custom transition type
  const getVariants = () => {
    // If a custom transition type is provided, use it
    if (transitionType) {
      return getTransitionVariants(transitionType)
    }

    // Otherwise, get the transition from the section mapping
    const sectionTransition = sectionTransitions[id]
    if (sectionTransition) {
      return getTransitionVariants(isExiting ? sectionTransition.exit : sectionTransition.enter)
    }

    // Default fallback transitions based on section ID
    switch (id) {
      case "hero":
        return getTransitionVariants("in:square:center")
      case "skills":
        return getTransitionVariants("in:wipe:right")
      case "experience":
        return getTransitionVariants("in:wipe:up")
      case "projects":
        return getTransitionVariants("in:diamond:center")
      case "education":
        return getTransitionVariants("in:square:top-left")
      case "certificates":
        return getTransitionVariants("in:wipe:cinematic")
      case "gallery":
        return getTransitionVariants("in:polygon:opposing-corners")
      case "contact":
        return getTransitionVariants("in:square:hesitate")
      default:
        return getTransitionVariants("fade")
    }
  }

  return (
    <section id={id} className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {(isVisible || hasBeenVisible) && (
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            exit="hidden"
            variants={getVariants()}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
