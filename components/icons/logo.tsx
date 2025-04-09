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
        <div className="absolute inset-0 rounded-md bg-gradient-to-br from-primary to-purple-600 shadow-lg"></div>
        <div className="absolute inset-[2px] flex items-center justify-center rounded-md bg-background font-bold text-xl text-primary">
          JD
        </div>
      </div>
    </motion.div>
  )
}
