"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { Github, Linkedin, FileText, Mail, MapPin, Phone, Code, Braces, FileCode, Layers, Leaf, Server, Database, GitBranch, Boxes, BarChart3, Cog, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { trackLinkClick, trackNavigationClick } from "@/lib/click-tracker"
import { LeetCodeIcon } from "@/components/icons/leetcode-icon"
import { GeeksForGeeksIcon } from "@/components/icons/geeksforgeeks-icon"

// Import components
import Navbar from "@/components/navbar"
import Section from "@/components/section"
import ProjectCard from "@/components/project-card"
import Timeline from "@/components/timeline"
import GalleryGrid from "@/components/gallery-grid"
import TrackedLink from "@/components/tracked-link"
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

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
}

export default function Home() {
  const [formStatus, setFormStatus] = useState<{ message: string; type: "success" | "error" | "" }>({
    message: "",
    type: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle contact form submission
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      })

      if (response.ok) {
        setFormStatus({
          message: "Your message has been sent successfully!",
          type: "success",
        })
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

  // Render hero section
  const renderHero = () => (
    <Section id="home" variant="hero">
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
            <SocialButton
              href={personalData.socialLinks.github}
              icon={<Github className="h-5 w-5" />}
              label="GitHub"
              trackId="hero-github"
            />
            <SocialButton
              href={personalData.socialLinks.linkedin}
              icon={<Linkedin className="h-5 w-5" />}
              label="LinkedIn"
              trackId="hero-linkedin"
            />
            <SocialButton
              href={personalData.socialLinks.leetcode}
              icon={<LeetCodeIcon className="h-5 w-5" />}
              label="LeetCode"
              trackId="hero-leetcode"
            />
            <SocialButton
              href={personalData.socialLinks.geeksforgeeks}
              icon={<GeeksForGeeksIcon className="h-5 w-5" />}
              label="GeeksForGeeks"
              trackId="hero-gfg"
            />
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
    </Section>
  )

  // Render skills section
  const renderSkills = () => (
    <Section
      id="skills"
      variant="skills"
      title="Skills & Expertise"
      subtitle="I've spent several years honing my skills across various technologies. Here's an overview of my technical expertise and proficiency levels."
    >
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <SkillCard
          title="Frontend Development"
          description="Building responsive and accessible user interfaces"
          skills={skillsData.frontendSkills}
        />
        <SkillCard
          title="Backend Development"
          description="Creating robust and scalable server-side applications"
          skills={skillsData.backendSkills}
        />
        <SkillCard
          title="Tools & Technologies"
          description="Supporting skills and development tools"
          skills={skillsData.otherSkills}
          className="md:col-span-2 lg:col-span-1"
        />
      </div>
    </Section>
  )

  // Render experience section
  const renderExperience = () => (
    <Section
      id="experience"
      variant="experience"
      title="Work Experience"
      subtitle="My professional journey in the tech industry, showcasing my career progression and key responsibilities."
    >
      <Timeline items={experienceData} />
    </Section>
  )

  // Render projects section
  const renderProjects = () => (
    <Section
      id="projects"
      variant="projects"
      title="My Projects"
      subtitle="Showcasing my recent work and personal projects. Each project reflects my skills, creativity, and problem-solving approach."
    >
      <motion.div variants={staggerContainer} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projectsData.map((project, index) => (
          <motion.div key={index} variants={scaleIn}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )

  // Render education section
  const renderEducation = () => (
    <Section
      id="education"
      variant="education"
      title="Education"
      subtitle="My academic background and educational qualifications that have shaped my technical knowledge and expertise."
    >
      <Timeline items={educationData} />
    </Section>
  )

  // Render certificates section
  const renderCertificates = () => (
    <Section
      id="certificates"
      variant="certificates"
      title="Certificates & Awards"
      subtitle="Professional certifications and recognition I've received throughout my career."
    >
      <div className="mb-16">
        <motion.h3 variants={fadeInUp} className="mb-6 text-2xl font-bold">
          Professional Certifications
        </motion.h3>
        <CertificateGrid items={certificatesData} />
      </div>

      <div>
        <motion.h3 variants={fadeInUp} className="mb-6 text-2xl font-bold">
          Awards & Recognition
        </motion.h3>
        <CertificateGrid items={awardsData} />
      </div>
    </Section>
  )

  // Render gallery section
  const renderGallery = () => (
    <Section
      id="gallery"
      variant="gallery"
      title="Photo Gallery"
      subtitle="A collection of images from my projects, events, and professional journey."
    >
      <motion.div variants={fadeInUp}>
        <GalleryGrid images={galleryData} />
      </motion.div>
    </Section>
  )

  // Render contact section
  const renderContact = () => (
    <Section
      id="contact"
      variant="contact"
      title="Get In Touch"
      subtitle="Thank you for visiting my portfolio. I'm always open to new opportunities and collaborations."
    >
      <div className="mx-auto grid gap-8 md:grid-cols-2">
        <motion.div variants={fadeInUp}>
          <Card className="h-full border-primary/20 bg-background/80 backdrop-blur transition-all duration-300 hover:border-primary hover:shadow-lg">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Feel free to reach out through any of these channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ContactInfo icon={<Mail />} text={personalData.email} />
              <ContactInfo icon={<Phone />} text={personalData.phone} />
              <ContactInfo icon={<MapPin />} text={personalData.location} />
              <ContactInfo
                icon={<Github />}
                text="ggithub.com/Chandrut22"
                href={personalData.socialLinks.github}
                id="github-link"
              />
              <ContactInfo
                icon={<Linkedin />}
                text="linkedin.com/in/chandrut22"
                href={personalData.socialLinks.linkedin}
                id="linkedin-link"
              />
              <ContactInfo
                icon={<LeetCodeIcon height="32" width="32"/>}
                text="leetcode.com/u/Chandrutd2004"
                href={personalData.socialLinks.leetcode}
                id="leetcode-link"
              />
              <ContactInfo
                icon={<GeeksForGeeksIcon height="32" width="32"/>}
                text="geeksforgeeks.org/user/chandru22"
                href={personalData.socialLinks.geeksforgeeks}
                id="gfg-link"
              />
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
                  <FormField label="Name" name="name" type="text" placeholder="Your name" />
                  <FormField label="Email" name="email" type="email" placeholder="Your email" />
                </div>
                <FormField label="Subject" name="subject" type="text" placeholder="Message subject" />
                <FormField label="Message" name="message" type="textarea" placeholder="Your message" rows={5} />
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
    </Section>
  )

  // Render footer
  const renderFooter = () => (
    <footer className="border-t bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center md:items-start">
            <Logo className="mb-4 h-16 w-16" />
            <p className="max-w-xs text-center text-sm text-muted-foreground md:text-left">
              Building exceptional digital experiences with modern web technologies.
            </p>
          </div>

          {/* <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-3 text-lg font-medium">Quick Links</h3>
            <ul className="space-y-2 text-center md:text-left">
              {sectionsData.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                    onClick={() => trackNavigationClick(`footer-${section.id}`)}
                  >
                    {section.name}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}

          <div className="flex flex-row items-bottom md:items-end">
            {/* <h3 className="mb-3 text-lg font-medium">Connect</h3>
            <div className="mb-4 flex space-x-4">
              <SocialLink href={personalData.socialLinks.github} icon={<Github />} label="GitHub" />
              <SocialLink href={personalData.socialLinks.linkedin} icon={<Linkedin />} label="LinkedIn" />
              <SocialLink href={personalData.socialLinks.leetcode} icon={<LeetCodeIcon height="25" width="25"/>} label="LeetCode" />
              <SocialLink
                href={personalData.socialLinks.geeksforgeeks}
                icon={<GeeksForGeeksIcon height="32" width="32"/>}
                label="GeeksForGeeks"
              />
            </div> */}
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {personalData.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {renderHero()}
      {renderSkills()}
      {renderExperience()}
      {renderProjects()}
      {renderEducation()}
      {renderCertificates()}
      {renderGallery()}
      {renderContact()}
      {renderFooter()}
    </div>
  )
}

// Helper Components

const SocialButton = ({
  href,
  icon,
  label,
  trackId,
}: { href: string; icon: React.ReactNode; label: string; trackId: string }) => (
  <Button asChild variant="outline" size="icon">
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={() => trackLinkClick(trackId, href)}
    >
      {icon}
    </a>
  </Button>
)

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
    <div className="h-5 w-5 text-muted-foreground hover:text-primary">{icon}</div>
  </a>
)

const getSkillIcon = (name: string) => {
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, "")
  switch (key) {
    case "c":
    case "java":
    case "javascript":
      return <Braces className="h-6 w-6 text-primary" aria-hidden="true" />
    case "python":
      return <FileCode className="h-6 w-6 text-primary" aria-hidden="true" />
    case "htmlcss":
      return <Code className="h-6 w-6 text-primary" aria-hidden="true" />
    case "django":
      return <Layers className="h-6 w-6 text-primary" aria-hidden="true" />
    case "springboot":
      return <Leaf className="h-6 w-6 text-primary" aria-hidden="true" />
    case "nodejs":
      return <Server className="h-6 w-6 text-primary" aria-hidden="true" />
    case "mysql":
    case "mongodb":
      return <Database className="h-6 w-6 text-primary" aria-hidden="true" />
    case "gitgithub":
    case "git":
      return <GitBranch className="h-6 w-6 text-primary" aria-hidden="true" />
    case "docker":
      return <Boxes className="h-6 w-6 text-primary" aria-hidden="true" />
    case "dataanalyticsandvizualization":
    case "dataanalyticsandvisualization":
    case "dataanalytics":
      return <BarChart3 className="h-6 w-6 text-primary" aria-hidden="true" />
    case "automation":
      return <Cog className="h-6 w-6 text-primary" aria-hidden="true" />
    case "webscraping":
      return <Globe className="h-6 w-6 text-primary" aria-hidden="true" />
    default:
      return <Code className="h-6 w-6 text-primary" aria-hidden="true" />
  }
}

const SkillCard = ({
  title,
  description,
  skills,
  className = "",
}: { title: string; description: string; skills: any[]; className?: string }) => (
  <motion.div variants={scaleIn} className={className}>
    <Card className="h-full border-primary/20 bg-background/80 backdrop-blur transition-all duration-300 hover:border-primary hover:shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={100}>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
            {skills.map((skill) => (
              <Tooltip key={skill.name}>
                <TooltipTrigger asChild>
                  <div className="group flex flex-col items-center gap-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-muted/40 text-primary shadow-sm transition-colors group-hover:border-primary group-hover:bg-background">
                      {getSkillIcon(skill.name)}
                    </div>
                    <span className="sr-only">{skill.name}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">{skill.name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  </motion.div>
)

const CertificateGrid = ({ items }: { items: any[] }) => (
  <motion.div variants={staggerContainer} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((item, index) => (
      <motion.div key={index} variants={scaleIn}>
        <Card className="h-full overflow-hidden border-primary/20 bg-background/80 backdrop-blur transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-lg hover:transform">
          <CardHeader className="p-4">
            <CardTitle className="text-xl">{item.title}</CardTitle>
            <CardDescription>
              {item.issuer} • {item.date}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="mb-4 overflow-hidden rounded-md">
              <img src={item.image || "/placeholder.svg"} alt={item.title} className="h-40 w-full object-cover" />
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
            {item.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </CardFooter>
        </Card>
      </motion.div>
    ))}
  </motion.div>
)

const ContactInfo = ({ icon, text, href, id }: { icon: React.ReactNode; text: string; href?: string; id?: string }) => (
  <div className="flex items-center gap-3">
    <div className="text-muted-foreground">{icon}</div>
    {href ? (
      <TrackedLink href={href} id={id || ""}>
        {text}
      </TrackedLink>
    ) : (
      <span>{text}</span>
    )}
  </div>
)

const FormField = ({
  label,
  name,
  type,
  placeholder,
  rows,
}: { label: string; name: string; type: string; placeholder: string; rows?: number }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="text-sm font-medium">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={name}
        name={name}
        required
        rows={rows || 3}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        placeholder={placeholder}
      ></textarea>
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        required
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        placeholder={placeholder}
      />
    )}
  </div>
)
