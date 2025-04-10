"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  onClick?: () => void
}

export function Logo({ className, onClick }: LogoProps) {
  return (
    <motion.div
      className={cn("flex items-center cursor-pointer", className)}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative h-10 w-10 overflow-hidden">
        <img src="/logo.png" alt="logo" />
      </div>
    </motion.div>
  )
}
