import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { IntroSection } from "@/components/sections/intro-section"
import { FeaturedRoomsSection } from "@/components/sections/featured-rooms-section"
import { AmenitiesSection } from "@/components/sections/amenities-section"
import { GallerySection } from "@/components/sections/gallery-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { CtaSection } from "@/components/sections/cta-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <IntroSection />
        <FeaturedRoomsSection />
        <AmenitiesSection />
        <GallerySection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
