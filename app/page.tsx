"use client"

import { useRef } from "react"
import { Github, Linkedin, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Timeline from "@/components/timeline"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"
import { motion } from "framer-motion"
import BackgroundShapes from "@/components/background-shapes"
import ProjectCard from "@/components/project-card"
import { useTheme } from "next-themes"
import GalleryGrid from "@/components/gallery-grid"
import TrackedLink from "@/components/tracked-link"
import { trackLinkClick, trackNavigationClick } from "@/lib/click-tracker"
import { LeetCodeIcon } from "@/components/icons/leetcode-icon"
import { GeeksForGeeksIcon } from "@/components/icons/geeksforgeeks-icon"
import { Logo } from "@/components/logo"

// Import data from JSON files
import projectsData from "@/data/projects.json"
import skillsData from "@/data/skills.json"
import experienceData from "@/data/experience.json"
import educationData from "@/data/education.json"
import certificatesData from "@/data/certificates.json"
import awardsData from "@/data/awards.json"
import galleryData from "@/data/gallery.json"

export default function Home() {
  // Refs for sections
  const sectionsRef = useRef<HTMLDivElement[]>([])
  const { theme } = useTheme()

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  // Extract data from imported JSON
  const projects = projectsData
  const { frontendSkills, backendSkills, otherSkills } = skillsData
  const experiences = experienceData
  const education = educationData
  const certificates = certificatesData
  const awards = awardsData
  const galleryImages = galleryData

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <BackgroundShapes variant="hero" />
        <div className="container z-10 px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-16"
          >
            <motion.div
              variants={scaleIn}
              className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-primary md:h-80 md:w-80"
            >
              <img src="/placeholder.svg?height=320&width=320" alt="Profile" className="h-full w-full object-cover" />
            </motion.div>
            <div className="text-center md:text-left">
              <motion.h1 variants={fadeInUp} className="text-4xl font-bold tracking-tight md:text-6xl">
                John Doe
              </motion.h1>
              <motion.p variants={fadeInUp} className="mt-4 text-xl text-muted-foreground md:text-2xl">
                Full Stack Developer
              </motion.p>
              <motion.p variants={fadeInUp} className="mt-4 max-w-md text-muted-foreground">
                I build exceptional and accessible digital experiences for the web.
              </motion.p>
              <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
                <Button asChild variant="outline" size="icon" className="animate-pulse">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    onClick={() => trackLinkClick("hero-github", "https://github.com")}
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="icon" className="animate-pulse">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    onClick={() => trackLinkClick("hero-linkedin", "https://linkedin.com")}
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="icon" className="animate-pulse">
                  <a
                    href="https://leetcode.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LeetCode"
                    onClick={() => trackLinkClick("hero-leetcode", "https://leetcode.com")}
                  >
                    <LeetCodeIcon className="h-5 w-5" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="icon" className="animate-pulse">
                  <a
                    href="https://geeksforgeeks.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GeeksForGeeks"
                    onClick={() => trackLinkClick("hero-gfg", "https://geeksforgeeks.org")}
                  >
                    <GeeksForGeeksIcon className="h-5 w-5" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="gap-2 animate-pulse">
                  <a
                    href="/john-doe-resume.pdf"
                    download
                    aria-label="Download Resume"
                    onClick={() => trackLinkClick("hero-resume", "/john-doe-resume.pdf")}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Resume</span>
                  </a>
                </Button>
                <Button asChild className="animate-bounce">
                  <a href="#contact" onClick={() => trackNavigationClick("nav-contact-hero")}>
                    Get In Touch
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <a href="#skills" className="flex flex-col items-center text-muted-foreground">
            <span className="mb-2 text-sm">Scroll Down</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 5V19M12 19L5 12M12 19L19 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <BackgroundShapes variant="skills" />
        <div className="container z-10 px-4 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mx-auto max-w-4xl"
          >
            <motion.h2 variants={fadeInUp} className="mb-8 text-center text-4xl font-bold tracking-tight md:text-5xl">
              Skills & Expertise
            </motion.h2>
            <motion.p variants={fadeInUp} className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              I've spent several years honing my skills across various technologies. Here's an overview of my technical
              expertise and proficiency levels.
            </motion.p>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <motion.div variants={scaleIn}>
                <Card className="h-full border-primary/20 bg-background/80 backdrop-blur transition-all duration-300 hover:border-primary hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Frontend Development</CardTitle>
                    <CardDescription>Building responsive and accessible user interfaces</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {frontendSkills.map((skill) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-muted-foreground">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={scaleIn}>
                <Card className="h-full border-primary/20 bg-background/80 backdrop-blur transition-all duration-300 hover:border-primary hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Backend Development</CardTitle>
                    <CardDescription>Creating robust and scalable server-side applications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {backendSkills.map((skill) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-muted-foreground">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={scaleIn} className="md:col-span-2 lg:col-span-1">
                <Card className="h-full border-primary/20 bg-background/80 backdrop-blur transition-all duration-300 hover:border-primary hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Tools & Technologies</CardTitle>
                    <CardDescription>Supporting skills and development tools</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {otherSkills.map((skill) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-muted-foreground">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <BackgroundShapes variant="experience" />
        <div className="container z-10 px-4 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mx-auto max-w-4xl"
          >
            <motion.h2 variants={fadeInUp} className="mb-8 text-center text-4xl font-bold tracking-tight md:text-5xl">
              Work Experience
            </motion.h2>
            <motion.p variants={fadeInUp} className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              My professional journey in the tech industry, showcasing my career progression and key responsibilities.
            </motion.p>

            <motion.div variants={fadeInUp}>
              <Timeline items={experiences} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <BackgroundShapes variant="projects" />
        <div className="container z-10 px-4 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mx-auto max-w-6xl"
          >
            <motion.h2 variants={fadeInUp} className="mb-8 text-center text-4xl font-bold tracking-tight md:text-5xl">
              My Projects
            </motion.h2>
            <motion.p variants={fadeInUp} className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Showcasing my recent work and personal projects. Each project reflects my skills, creativity, and
              problem-solving approach.
            </motion.p>

            <motion.div variants={staggerContainer} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <motion.div key={index} variants={scaleIn}>
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <BackgroundShapes variant="education" />
        <div className="container z-10 px-4 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mx-auto max-w-4xl"
          >
            <motion.h2 variants={fadeInUp} className="mb-8 text-center text-4xl font-bold tracking-tight md:text-5xl">
              Education
            </motion.h2>
            <motion.p variants={fadeInUp} className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              My academic background and educational qualifications that have shaped my technical knowledge and
              expertise.
            </motion.p>

            <motion.div variants={fadeInUp}>
              <Timeline items={education} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <BackgroundShapes variant="certificates" />
        <div className="container z-10 px-4 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mx-auto max-w-5xl"
          >
            <motion.h2 variants={fadeInUp} className="mb-8 text-center text-4xl font-bold tracking-tight md:text-5xl">
              Certificates & Awards
            </motion.h2>
            <motion.p variants={fadeInUp} className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Professional certifications and recognition I've received throughout my career.
            </motion.p>

            <div className="mb-16">
              <motion.h3 variants={fadeInUp} className="mb-6 text-2xl font-bold">
                Professional Certifications
              </motion.h3>
              <motion.div variants={staggerContainer} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {certificates.map((cert, index) => (
                  <motion.div key={index} variants={scaleIn}>
                    <Card className="h-full overflow-hidden border-primary/20 bg-background/80 backdrop-blur transition-all duration-300 hover:border-primary hover:shadow-lg hover:transform hover:scale-105">
                      <CardHeader className="p-4">
                        <CardTitle className="text-xl">{cert.title}</CardTitle>
                        <CardDescription>
                          {cert.issuer} • {cert.date}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="mb-4 overflow-hidden rounded-md">
                          <img
                            src={cert.image || "/placeholder.svg"}
                            alt={cert.title}
                            className="h-40 w-full object-cover"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">{cert.description}</p>
                      </CardContent>
                      <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
                        {cert.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div>
              <motion.h3 variants={fadeInUp} className="mb-6 text-2xl font-bold">
                Awards & Recognition
              </motion.h3>
              <motion.div variants={staggerContainer} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {awards.map((award, index) => (
                  <motion.div key={index} variants={scaleIn}>
                    <Card className="h-full overflow-hidden border-primary/20 bg-background/80 backdrop-blur transition-all duration-300 hover:border-primary hover:shadow-lg hover:transform hover:scale-105">
                      <CardHeader className="p-4">
                        <CardTitle className="text-xl">{award.title}</CardTitle>
                        <CardDescription>
                          {award.issuer} • {award.date}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="mb-4 overflow-hidden rounded-md">
                          <img
                            src={award.image || "/placeholder.svg"}
                            alt={award.title}
                            className="h-40 w-full object-cover"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">{award.description}</p>
                      </CardContent>
                      <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
                        {award.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <BackgroundShapes variant="gallery" />
        <div className="container z-10 px-4 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mx-auto max-w-6xl"
          >
            <motion.h2 variants={fadeInUp} className="mb-8 text-center text-4xl font-bold tracking-tight md:text-5xl">
              Photo Gallery
            </motion.h2>
            <motion.p variants={fadeInUp} className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              A collection of images from my projects, events, and professional journey.
            </motion.p>

            <motion.div variants={fadeInUp}>
              <GalleryGrid images={galleryImages} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <BackgroundShapes variant="contact" />
        <div className="container z-10 px-4 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mx-auto max-w-5xl"
          >
            <motion.h2 variants={fadeInUp} className="mb-8 text-center text-4xl font-bold tracking-tight md:text-5xl">
              Get In Touch
            </motion.h2>
            <motion.p variants={fadeInUp} className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Thank you for visiting my portfolio. I'm always open to new opportunities and collaborations.
            </motion.p>

            <div className="mx-auto grid gap-8 md:grid-cols-2">
              <motion.div variants={fadeInUp}>
                <Card className="h-full border-primary/20 bg-background/80 backdrop-blur transition-all duration-300 hover:border-primary hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Feel free to reach out through any of these channels</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <span>john.doe@example.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span>San Francisco, CA</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Github className="h-5 w-5 text-muted-foreground" />
                      <TrackedLink href="https://github.com" id="github-link">
                        github.com/johndoe
                      </TrackedLink>
                    </div>
                    <div className="flex items-center gap-3">
                      <Linkedin className="h-5 w-5 text-muted-foreground" />
                      <TrackedLink href="https://linkedin.com" id="linkedin-link">
                        linkedin.com/in/johndoe
                      </TrackedLink>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                      </svg>
                      <TrackedLink href="https://leetcode.com/johndoe" id="leetcode-link">
                        leetcode.com/johndoe
                      </TrackedLink>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.45 14.315c-.143-.8-.34-1.58-.585-2.332a10.512 10.512 0 0 0-.824-1.903c-.978-1.813-2.328-3.37-4.097-4.7a7.04 7.04 0 0 1 1.543-1.66c.67-.524 1.438-.9 2.25-1.144.872-.264 1.776-.397 2.684-.397.062 0 .124 0 .186.002.062-.002.124-.002.186-.002.908 0 1.812.133 2.684.397.812.244 1.58.62 2.25 1.144.759.592 1.364 1.27 1.848 2.055.484.785.853 1.677 1.086 2.67.234.992.351 2.085.351 3.256 0 1.143-.117 2.207-.351 3.2-.234.992-.602 1.885-1.086 2.67-.484.785-1.09 1.463-1.848 2.055-.67.524-1.438.9-2.25 1.144-.872.264-1.776.397-2.684.397-.062 0-.124 0-.186-.002-.062.002-.124.002-.186.002-.908 0-1.812-.133-2.684-.397-.812-.244 1.58.62 2.25-1.144-.759-.592-1.364-1.27-1.848-2.055-.484-.785-.853-1.677-1.086-2.67C-7.883 14.463-8 13.37-8 12.2c0-1.143.117-2.207.351-3.2.234-.992.602-1.885 1.086-2.67.484-.785 1.09-1.463 1.848-2.055.67-.524 1.438-.9 2.25-1.144.872-.264 1.776-.397 2.684-.397.062 0 .124 0 .186.002.062-.002.124-.002.186-.002.908 0 1.812.133 2.684.397.812.244 1.58.62 2.25 1.144a7.04 7.04 0 0 1 1.543 1.66c-1.77 1.33-3.12 2.887-4.097 4.7-.33.61-.607 1.245-.824 1.903-.246.752-.442-1.532.585 2.332zM12 16c-2.485 0-4.5-1.79-4.5-4s2.015-4 4.5-4 4.5 1.79 4.5 4-2.015 4-4.5 4z" />
                      </svg>
                      <TrackedLink href="https://auth.geeksforgeeks.org/user/johndoe" id="gfg-link">
                        geeksforgeeks.org/user/johndoe
                      </TrackedLink>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">I typically respond within 24 hours.</p>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border-primary/20 bg-background/80 backdrop-blur transition-all duration-300 hover:border-primary hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Send a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and I'll get back to you as soon as possible
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        className="transition-all duration-300 focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="transition-all duration-300 focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="What is this regarding?"
                        className="transition-all duration-300 focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Your message..."
                        className="min-h-32 transition-all duration-300 focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full transition-all duration-300 hover:bg-primary/80 hover:scale-105">
                      Send Message
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-12 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center md:items-start">
              <Logo className="h-12 w-12 mb-4" />
              <p className="text-sm text-muted-foreground max-w-xs text-center md:text-left">
                Building exceptional digital experiences with modern web technologies.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-medium text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-center md:text-left">
                <li>
                  <a href="#home" className="text-sm text-muted-foreground hover:text-primary">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#skills" className="text-sm text-muted-foreground hover:text-primary">
                    Skills
                  </a>
                </li>
                <li>
                  <a href="#projects" className="text-sm text-muted-foreground hover:text-primary">
                    Projects
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-sm text-muted-foreground hover:text-primary">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-medium text-lg mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </a>
                <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer" aria-label="LeetCode">
                  <LeetCodeIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </a>
                <a
                  href="https://geeksforgeeks.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GeeksForGeeks"
                >
                  <GeeksForGeeksIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </a>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                © {new Date().getFullYear()} John Doe. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

