import { Header } from "@/components/Header";
import { HeroSection } from "@/components/sections/Hero";
import { AboutSection } from "@/components/sections/About";
import { OrderSection } from "@/components/sections/order-section";
import { FaqSection } from "@/components/sections/faq";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <OrderSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
