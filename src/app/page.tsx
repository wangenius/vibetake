"use client";

import { FAQ } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { Navbar } from "@/components/sections/navbar";
import { PricingSection } from "@/components/sections/pricing";
import { SocialProof } from "@/components/sections/testimonials";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <SocialProof />
      <FAQ />
      <PricingSection />
      <Footer />
    </div>
  );
}
