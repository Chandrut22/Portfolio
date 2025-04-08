"use client"

import { motion } from "framer-motion"
import { Logo } from "@/components/logo"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Logo className="h-20 w-20" />
      </motion.div>

      <div className="relative h-1 w-60 overflow-hidden rounded-full bg-secondary">
        <div className="absolute inset-0 h-full w-full bg-primary animate-loading"></div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-6 text-muted-foreground"
      >
        Loading portfolio...
      </motion.p>
    </div>
  )
}

