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
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container px-4 py-16 mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About CarConnect Ghana
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6">
              Ghana's most trusted platform for buying, selling, and renting cars
            </p>
            <p className="text-lg text-white/80 mb-8">
              We're revolutionizing the automotive marketplace in Ghana by connecting buyers, 
              sellers, and renters through a secure, transparent, and user-friendly platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="secondary" onClick={() => navigate('/buy')}>
                Browse Cars
              </Button>
              <Button size="lg" variant="default" onClick={() => navigate('/sell')}>
                Sell Your Car
              </Button>
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
