"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface GalleryImage {
  src: string
  alt: string
  title: string
  category: string
  description?: string
  width?: number
  height?: number
}

interface GalleryGridProps {
  images: GalleryImage[]
  autoSlideInterval?: number
}

export default function GalleryGrid({ images, autoSlideInterval = 5000 }: GalleryGridProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const filteredImages = images

  // Auto-slide functionality
  useEffect(() => {
    if (filteredImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % filteredImages.length)
    }, autoSlideInterval)

    return () => clearInterval(interval)
  }, [filteredImages, autoSlideInterval])

  // Handle manual navigation
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % filteredImages.length)
  }, [filteredImages.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + filteredImages.length) % filteredImages.length)
  }, [filteredImages.length])

  return (
    <div className="w-full">
      {/* Auto-sliding carousel for horizontal view */}
      <div className="relative overflow-hidden rounded-lg">
        <div className="relative h-[600px] w-full">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img
                src={filteredImages[currentSlide]?.src || "/placeholder.svg"}
                alt={filteredImages[currentSlide]?.alt || "Gallery image"}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl font-medium text-white">{filteredImages[currentSlide]?.title}</h3>
                  <Badge variant="secondary" className="mt-2">
                    {filteredImages[currentSlide]?.category}
                  </Badge>
                  {filteredImages[currentSlide]?.description && (
                    <p className="mt-2 max-w-lg text-sm text-white/80">{filteredImages[currentSlide]?.description}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {filteredImages.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  currentSlide === index ? "bg-white w-4" : "bg-white/50"
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
