import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { AboutHero } from "@/components/about/about-hero"
import { AboutStory } from "@/components/about/about-story"
import { AboutLocation } from "@/components/about/about-location"
import { ContactSection } from "@/components/about/contact-section"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <AboutHero />
        <AboutStory />
        <AboutLocation />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
