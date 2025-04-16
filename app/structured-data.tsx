import Script from "next/script"

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Chandru",
    url: "https://chandru22.vercel.app/",
    image: "https://chandru22.vercel.app/logo.png",
    jobTitle: "Full Stack Developer",
    worksFor: {
      "@type": "Organization",
      name: "Current Employer",
    },
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Anna University",
        sameAs: "https://www.annauniv.edu/",

      },
    ],
    knowsAbout: ["Web Development", "React", "Next.js", "JavaScript", "TypeScript", "Node.js", "AI", "ML", "Data Science", "Data Analysis", "Deep Learning"],
    sameAs: ["https://github.com/Chandrut22", "https://www.linkedin.com/in/chandrut22/", "https://leetcode.com/u/Chandrutd2004/","https://www.geeksforgeeks.org/user/chandru22/"],
  }

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
