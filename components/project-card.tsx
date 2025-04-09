"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import { motion } from "framer-motion"
import { trackProjectClick } from "@/lib/click-tracker"

interface Project {
  title: string
  description: string
  image: string
  tags: string[]
  demoLink?: string
  codeLink?: string
  featured?: boolean
}

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleDemoClick = () => {
    if (project.demoLink) {
      trackProjectClick(`demo-${project.title.toLowerCase().replace(/\s+/g, "-")}`)
    }
  }

  const handleCodeClick = () => {
    if (project.codeLink) {
      trackProjectClick(`code-${project.title.toLowerCase().replace(/\s+/g, "-")}`)
    }
  }

  return (
    <motion.div
      whileHover={{
        y: -10,
        transition: { duration: 0.2 },
      }}
      className="h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="h-full overflow-hidden border-primary/20 bg-background/80 backdrop-blur transition-all duration-300 hover:border-primary hover:shadow-lg">
        <div className="relative overflow-hidden">
          <img
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            className="h-48 w-full object-cover transition-transform duration-500"
            style={{
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />
          {project.featured && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-primary text-primary-foreground">Featured</Badge>
            </div>
          )}
        </div>
        <CardHeader className="p-4">
          <CardTitle className="text-xl">{project.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="mb-4 text-sm text-muted-foreground">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-4 pt-0">
          {project.demoLink && (
            <Button asChild variant="outline" size="sm" className="gap-1" onClick={handleDemoClick}>
              <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Demo
              </a>
            </Button>
          )}
          {project.codeLink && (
            <Button asChild variant="outline" size="sm" className="gap-1" onClick={handleCodeClick}>
              <a href={project.codeLink} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                Code
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
