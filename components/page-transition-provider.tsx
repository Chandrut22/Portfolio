"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { getTransitionVariants, type TransitionType } from "@/lib/transition-utils"

interface PageTransitionContextType {
  setTransition: (enter: TransitionType, exit: TransitionType) => void
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  setTransition: () => {},
})

export const usePageTransition = () => useContext(PageTransitionContext)

interface PageTransitionProviderProps {
  children: React.ReactNode
  defaultEnter?: TransitionType
  defaultExit?: TransitionType
}

export function PageTransitionProvider({
  children,
  defaultEnter = "in:square:center",
  defaultExit = "out:square:center",
}: PageTransitionProviderProps) {
  const pathname = usePathname()
  const [enterTransition, setEnterTransition] = useState<TransitionType>(defaultEnter)
  const [exitTransition, setExitTransition] = useState<TransitionType>(defaultExit)
  const [isAnimating, setIsAnimating] = useState(false)

  const setTransition = (enter: TransitionType, exit: TransitionType) => {
    setEnterTransition(enter)
    setExitTransition(exit)
  }

  // Reset animation state when pathname changes
  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 1000) // Animation duration

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <PageTransitionContext.Provider value={{ setTransition }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={isAnimating ? getTransitionVariants(enterTransition) : {}}
          className="w-full h-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </PageTransitionContext.Provider>
  )
}
