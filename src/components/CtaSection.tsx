
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AnimatedButton, HoverScale } from '@/components/ui/animations';

const CtaSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container px-4">
        <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
            <p className="mb-6 text-white/80">
              Whether you're looking to buy, sell, or rent a car in Ghana, 
              we've got you covered with our seamless platform and dedicated support team.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <HoverScale>
                <AnimatedButton 
                  size="lg" 
                  variant="secondary"
                  onClick={() => navigate('/sell')}
                >
                  List Your Car
                </AnimatedButton>
              </HoverScale>
              <HoverScale>
                <AnimatedButton 
                  size="lg" 
                  variant="default"
                  onClick={() => navigate('/buy')}
                >
                  Browse Cars
                </AnimatedButton>
              </HoverScale>
            </div>
          </div>
          
          <div className="hidden p-6 rounded-lg md:block bg-primary-foreground/10">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 text-center bg-white/10 rounded-lg">
                <h3 className="mb-1 text-3xl font-bold">10K+</h3>
                <p className="text-white/80">Happy Customers</p>
              </div>
              <div className="p-4 text-center bg-white/10 rounded-lg">
                <h3 className="mb-1 text-3xl font-bold">5K+</h3>
                <p className="text-white/80">Cars Available</p>
              </div>
              <div className="p-4 text-center bg-white/10 rounded-lg">
                <h3 className="mb-1 text-3xl font-bold">15+</h3>
                <p className="text-white/80">Cities Covered</p>
              </div>
              <div className="p-4 text-center bg-white/10 rounded-lg">
                <h3 className="mb-1 text-3xl font-bold">24/7</h3>
                <p className="text-white/80">Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
