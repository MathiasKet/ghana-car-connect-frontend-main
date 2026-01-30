
import { Card, CardContent } from "@/components/ui/card";
import { Search, Car, CreditCard } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: "Find Your Perfect Car",
    description: "Browse our extensive selection of vehicles available for purchase or rent."
  },
  {
    icon: Car,
    title: "Book or Reserve",
    description: "Choose the car that fits your needs and secure it with a simple booking process."
  },
  {
    icon: CreditCard,
    title: "Pay & Drive",
    description: "Complete your payment using secure local or international payment methods."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gray-50/50">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="mb-3 text-3xl font-bold">How It Works</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Buying, selling, or renting a car in Ghana has never been easier with our streamlined process.
          </p>
        </div>
        
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-24 left-0 right-0 h-0.5 bg-gray-200 hidden md:block"></div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="hidden w-10 h-10 text-center text-white rounded-full md:flex md:items-center md:justify-center md:absolute md:top-[-20px] md:left-1/2 md:transform md:translate-x-[-50%] bg-primary z-20">
                  {index + 1}
                </div>
                
                <Card className="relative z-10 overflow-visible transition-all border-0 shadow-lg hover:translate-y-[-5px]">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mb-6 text-white rounded-full bg-primary">
                      <step.icon className="w-8 h-8" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
