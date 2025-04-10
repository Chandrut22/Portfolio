"use client"

import { useRef, useState, type FormEvent } from "react"
import { Github, Linkedin, FileText, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Timeline from "@/components/timeline"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
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
import personalData from "@/data/personal.json"
import aboutData from "@/data/about.json"
import sectionsData from "@/data/sections.json"

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
  const sections = sectionsData

  const [formStatus, setFormStatus] = useState<{
    message: string
    type: "success" | "error" | ""
  }>({ message: "", type: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormStatus({ message: "", type: "" })

    const formData = new FormData(e.currentTarget)
    const formValues = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      })

      if (response.ok) {
        setFormStatus({
          message: "Your message has been sent successfully!",
          type: "success",
        })
        // Reset form
        e.currentTarget.reset()
      } else {
        const data = await response.json()
        setFormStatus({
          message: data.error || "Failed to send message. Please try again.",
          type: "error",
        })
      }
    } catch (error) {
      setFormStatus({
        message: "An error occurred. Please try again later.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
              <img
                src={personalData.profileImage || "/placeholder.svg"}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </motion.div>
            <div className="text-center md:text-left">
              <motion.h1 variants={fadeInUp} className="text-4xl font-bold tracking-tight md:text-6xl">
                {personalData.name}
              </motion.h1>
              <motion.p variants={fadeInUp} className="mt-4 text-xl text-muted-foreground md:text-2xl">
                {personalData.title}
              </motion.p>
              <motion.p variants={fadeInUp} className="mt-4 max-w-md text-muted-foreground">
                {personalData.tagline}
              </motion.p>
              <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
                <Button asChild variant="outline" size="icon">
                  <a
                    href={personalData.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    onClick={() => trackLinkClick("hero-github", personalData.socialLinks.github)}
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="icon">
                  <a
                    href={personalData.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    onClick={() => trackLinkClick("hero-linkedin", personalData.socialLinks.linkedin)}
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="icon">
                  <a
                    href={personalData.socialLinks.leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LeetCode"
                    onClick={() => trackLinkClick("hero-leetcode", personalData.socialLinks.leetcode)}
                  >
                    <LeetCodeIcon className="h-5 w-5" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="icon">
                  <a
                    href={personalData.socialLinks.geeksforgeeks}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GeeksForGeeks"
                    onClick={() => trackLinkClick("hero-gfg", personalData.socialLinks.geeksforgeeks)}
                  >
                    <GeeksForGeeksIcon className="h-5 w-5" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <a
                    href={aboutData.resumeUrl}
                    download
                    aria-label="Download Resume"
                    onClick={() => trackLinkClick("hero-resume", aboutData.resumeUrl)}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Resume</span>
                  </a>
                </Button>
                <Button asChild>
                  <a href="#contact" onClick={() => trackNavigationClick("nav-contact-hero")}>
                    Get In Touch
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
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
                    <CardTitle>Programming Languages</CardTitle>
                    <CardDescription>Writing efficient, scalable, and maintainable code for applications and systems.</CardDescription>
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
                    <CardTitle>Frameworks & Libraries</CardTitle>
                    <CardDescription>Pre-built tools for faster, efficient, and scalable application development.</CardDescription>
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
                    <CardTitle>DevOps & Other Skills</CardTitle>
                    <CardDescription>Automating deployment, managing infrastructure, and optimizing development workflows efficiently.</CardDescription>
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
                      <span>{personalData.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span>{personalData.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span>{personalData.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Github className="h-5 w-5 text-muted-foreground" />
                      <TrackedLink href={personalData.socialLinks.github} id="github-link">
                        <span>{personalData.socialLinks.github.replace("https://", "")}</span>
                      </TrackedLink>
                    </div>
                    <div className="flex items-center gap-3">
                      <Linkedin className="h-5 w-5 text-muted-foreground" />
                      <TrackedLink href={personalData.socialLinks.linkedin} id="linkedin-link">
                        <span>{personalData.socialLinks.linkedin.replace("https://www.", "")}</span>
                      </TrackedLink>
                    </div>
                    <div className="flex items-center gap-3">
                      <LeetCodeIcon className="h-5 w-5 text-muted-foreground" />
                      <TrackedLink href={personalData.socialLinks.leetcode} id="leetcode-link">
                        <span>{personalData.socialLinks.leetcode.replace("https://", "")}</span>
                      </TrackedLink>
                    </div>
                    <div className="flex items-center gap-3">
                      <GeeksForGeeksIcon className="h-5 w-5 text-muted-foreground" />
                      <TrackedLink href={personalData.socialLinks.geeksforgeeks} id="gfg-link">
                        <span>{personalData.socialLinks.geeksforgeeks.replace("https://www.", "")}</span>
                      </TrackedLink>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border-primary/20 bg-background/80 backdrop-blur transition-all duration-300 hover:border-primary hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Send Me a Message</CardTitle>
                    <CardDescription>I'll get back to you as soon as possible</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Name
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Your name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Your email"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                          Subject
                        </label>
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="Message subject"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="Your message"
                        ></textarea>
                      </div>
                      {formStatus.message && (
                        <div
                          className={`rounded-md p-3 ${
                            formStatus.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                          }`}
                        >
                          {formStatus.message}
                        </div>
                      )}
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Medium-sized Footer */}
      <footer className="py-8 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center md:items-start">
              <Logo className="h-16 w-16 mb-4" />
              <p className="text-sm text-muted-foreground max-w-xs text-center md:text-left">
                Building exceptional digital experiences with modern web technologies.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-medium text-lg mb-3">Quick Links</h3>
              <ul className="space-y-2 text-center md:text-left">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-sm text-muted-foreground hover:text-primary">
                      {section.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-medium text-lg mb-3">Connect</h3>
              <div className="flex space-x-4 mb-4">
                <a href={personalData.socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </a>
                <a
                  href={personalData.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </a>
                <a
                  href={personalData.socialLinks.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LeetCode"
                >
                  <LeetCodeIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </a>
                <a
                  href={personalData.socialLinks.geeksforgeeks}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GeeksForGeeks"
                >
                  <GeeksForGeeksIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} {personalData.name}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
