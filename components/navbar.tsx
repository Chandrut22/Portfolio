"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { trackNavigationClick } from "@/lib/click-tracker"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import sectionsData from "@/data/sections.json"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Sections from JSON data
  const sections = sectionsData

  // Make sure theme toggle only renders on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // Add shadow to navbar when scrolled
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      // Update active section based on scroll position
      const sectionElements = sections.map((section) => ({
        id: section.id,
        element: document.getElementById(section.id),
      }))

      const currentPosition = window.scrollY + 100

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i]
        if (section.element) {
          const sectionTop = section.element.offsetTop
          if (currentPosition >= sectionTop) {
            if (activeSection !== section.id) {
              setActiveSection(section.id)
            }
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [activeSection, sections])

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false)
    // Track the navigation click
    trackNavigationClick(`nav-${sectionId}`)

    const element = document.getElementById(sectionId)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      })
    }
  }

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "sticky top-0 z-50 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
        scrolled ? "border-b shadow-sm" : "",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Logo onClick={() => scrollToSection("home")} />

        <div className="md:hidden">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          {sections.map((section) => (
            <motion.a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative",
                activeSection === section.id ? "text-primary" : "text-muted-foreground",
              )}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection(section.id)
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {section.name}
              {activeSection === section.id && (
                <motion.span className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary" layoutId="underline" />
              )}
            </motion.a>
          ))}

          {/* Theme toggle as last item */}
          {mounted && <ThemeToggle />}
        </nav>

        {/* Mobile navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-16 z-50 w-full border-b bg-background/90 p-4 backdrop-blur md:hidden"
            >
              <nav className="flex flex-col space-y-4">
                {sections.map((section) => (
                  <motion.a
                    key={section.id}
                    href={`#${section.id}`}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      activeSection === section.id ? "text-primary" : "text-muted-foreground",
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(section.id)
                    }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {section.name}
                  </motion.a>
                ))}

                {/* Theme toggle for mobile */}
                {mounted && <ThemeToggle />}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
