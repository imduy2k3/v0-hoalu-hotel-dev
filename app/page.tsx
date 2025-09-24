import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { IntroSection } from "@/components/sections/intro-section"
import { FeaturedRoomsSectionWithAPI } from "@/components/sections/featured-rooms-section-with-api"
import { AmenitiesSection } from "@/components/sections/amenities-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { CtaSection } from "@/components/sections/cta-section"
export default function HomePage() {

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <IntroSection />
        <FeaturedRoomsSectionWithAPI />
        <AmenitiesSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
