
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedSection from '@/components/FeaturedSection';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import CtaSection from '@/components/CtaSection';
import Footer from '@/components/Footer';
import MobileNavbar from '@/components/MobileNavbar';
import { PageTransition, FadeIn, SlideIn } from '@/components/ui/animations';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <PageTransition>
          <Hero />
        </PageTransition>
        
        <FadeIn delay={0.2}>
          <FeaturedSection />
        </FadeIn>
        
        <SlideIn direction="up" delay={0.4}>
          <HowItWorks />
        </SlideIn>
        
        <FadeIn delay={0.6}>
          <Testimonials />
        </FadeIn>
        
        <SlideIn direction="up" delay={0.8}>
          <CtaSection />
        </SlideIn>
      </main>
      
      <Footer />
      <MobileNavbar />
    </div>
  );
};

export default Index;
