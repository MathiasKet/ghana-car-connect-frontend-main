import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Car,
  Users,
  MapPin,
  Award,
  Target,
  Heart,
  Shield,
  Clock,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import SEO from '@/components/SEO';

const About = () => {
  const navigate = useNavigate();

  const stats = [
    {
      icon: Car,
      label: 'Cars Listed',
      value: '10,000+',
      description: 'Wide selection of vehicles'
    },
    {
      icon: Users,
      label: 'Happy Customers',
      value: '5,000+',
      description: 'Satisfied buyers and sellers'
    },
    {
      icon: MapPin,
      label: 'Cities Covered',
      value: '15+',
      description: 'Across Ghana'
    },
    {
      icon: Award,
      label: 'Years in Service',
      value: '5+',
      description: 'Trusted platform'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'All transactions are protected with advanced security measures and escrow services.'
    },
    {
      icon: Clock,
      title: 'Quick Verification',
      description: 'Fast and thorough verification process for all vehicles listed on our platform.'
    },
    {
      icon: TrendingUp,
      title: 'Best Prices',
      description: 'Competitive pricing and transparent fee structure for maximum value.'
    },
    {
      icon: Heart,
      title: 'Customer Support',
      description: '24/7 dedicated customer support to assist you throughout your journey.'
    }
  ];

  const values = [
    {
      title: 'Trust',
      description: 'We build trust through transparency, reliability, and exceptional service.'
    },
    {
      title: 'Innovation',
      description: 'Continuously improving our platform with cutting-edge technology and features.'
    },
    {
      title: 'Community',
      description: 'Creating a vibrant community of car enthusiasts and trusted sellers.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="About Us"
        description="Learn more about CarConnect Ghana, the most trusted automotive marketplace in Ghana. Discover our mission, values, and story."
        keywords="about carconnect, ghana car marketplace, automotive marketplace ghana"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/4 h-full bg-white/5 -skew-x-12 transform translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-white/5 skew-x-12 transform -translate-x-1/2" />

        <div className="container px-4 py-20 mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                About CarConnect Ghana
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-6 font-medium">
                Ghana's most trusted platform for buying, selling, and renting cars
              </p>
              <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                We're revolutionizing the automotive marketplace in Ghana by connecting buyers,
                sellers, and renters through a secure, transparent, and user-friendly platform.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button size="lg" variant="secondary" className="font-semibold" onClick={() => navigate('/buy')}>
                  Browse Cars
                </Button>
                <Button size="lg" variant="default" className="bg-white/10 hover:bg-white/20 border-white/20" onClick={() => navigate('/sell')}>
                  Sell Your Car
                </Button>
              </div>
            </div>

            <div className="relative group w-full max-w-xl mt-12 lg:mt-0">
              {/* Glow effect behind the dark car to make it pop on the blue background */}
              <div className="absolute inset-0 bg-white/20 blur-[100px] rounded-full group-hover:bg-cyan-400/20 transition-colors duration-500" />
              <div className="relative z-10">
                <img
                  src="/about-premium-car.png"
                  alt="Premium Luxury SUV"
                  className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const div = document.createElement('div');
                      div.className = "w-full aspect-[16/9] bg-white/10 rounded-2xl flex items-center justify-center border border-white/20";
                      div.innerHTML = '<svg class="h-24 w-24 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>';
                      parent.appendChild(div);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container px-4 py-16 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <stat.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Target className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600">
                To make car ownership accessible, affordable, and hassle-free for every Ghanaian
                by providing a trusted marketplace that connects people with their perfect vehicles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-center">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose CarConnect?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best experience for all your automotive needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How We Started */}
      <div className="bg-white py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Story</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  CarConnect Ghana was founded in 2019 with a simple mission: to transform the way
                  Ghanaians buy, sell, and rent cars. Our founders experienced firsthand the challenges
                  of finding reliable vehicles and trustworthy sellers in the Ghanaian market.
                </p>
                <p className="text-gray-700">
                  What started as a small platform with just a few listings has grown into Ghana's
                  leading automotive marketplace, serving thousands of customers across the country.
                  We've helped everyone from first-time car buyers to experienced dealers find their
                  perfect match.
                </p>
                <p className="text-gray-700">
                  Today, we continue to innovate and improve our platform, always keeping our customers'
                  needs at the heart of everything we do. Whether you're buying your first car, selling
                  a beloved vehicle, or looking for a reliable rental, CarConnect Ghana is here to make
                  your journey smooth and successful.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-16">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join the CarConnect Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're buying, selling, or renting, we're here to help you every step of the way.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/register')}>
              Get Started
            </Button>
            <Button size="lg" variant="default" onClick={() => navigate('/')}>
              View Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
