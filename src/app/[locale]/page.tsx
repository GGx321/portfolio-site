import { Header } from "@/components/header";
import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { OrderSection } from "@/components/sections/order-section";
import { FaqSection } from "@/components/sections/faq";
import { Footer } from "@/components/footer";

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
