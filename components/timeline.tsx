"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface TimelineItem {
  title: string
  company: string
  period: string
  description: string
  logo?: string
}

interface TimelineProps {
  items: TimelineItem[]
}

export default function Timeline({ items }: TimelineProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div ref={ref} className="mx-auto max-w-3xl">
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-border md:before:mx-auto md:before:right-0 md:before:left-0">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className={cn(
              "relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse",
              index === 0 ? "pt-2" : "",
            )}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center md:mx-auto md:order-1"
            >
              {item.logo ? (
                <img
                  src={item.logo || "/placeholder.svg"}
                  alt={item.company}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-lg font-bold">{index + 1}</span>
                </div>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              transition={{ duration: 0.5, delay: index * 0.2 + 0.1 }}
              className="w-full rounded-lg border border-primary/20 bg-background/80 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:border-primary hover:shadow-lg md:w-5/12 md:order-2"
            >
              <div className="flex flex-col space-y-1">
                <h3 className="font-bold">{item.title}</h3>
                <div className="flex flex-col text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-2">
                  <span>{item.company}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{item.period}</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

