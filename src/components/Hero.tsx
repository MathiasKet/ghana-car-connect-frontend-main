
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, MapPin } from 'lucide-react';
import { useAdminContent } from '@/hooks/useAdminContent';
import { FadeIn, SlideIn, AnimatedButton, Floating } from '@/components/ui/animations';

const Hero = () => {
  const [searchType, setSearchType] = useState('buy');
  const { heroContent, loading } = useAdminContent();
  const navigate = useNavigate();

  // State for form inputs
  const [buySearch, setBuySearch] = useState({
    location: '',
    carType: ''
  });
  
  const [rentSearch, setRentSearch] = useState({
    pickupLocation: '',
    pickupDate: '',
    returnDate: ''
  });
  
  const [sellSearch, setSellSearch] = useState({
    make: '',
    year: ''
  });

  const handleBuySearch = () => {
    const params = new URLSearchParams();
    if (buySearch.location) params.append('location', buySearch.location);
    if (buySearch.carType) params.append('type', buySearch.carType);
    navigate(`/buy?${params.toString()}`);
  };

  const handleRentSearch = () => {
    const params = new URLSearchParams();
    if (rentSearch.pickupLocation) params.append('location', rentSearch.pickupLocation);
    if (rentSearch.pickupDate) params.append('pickupDate', rentSearch.pickupDate);
    if (rentSearch.returnDate) params.append('returnDate', rentSearch.returnDate);
    navigate(`/rent?${params.toString()}`);
  };

  const handleSellEstimate = () => {
    const params = new URLSearchParams();
    if (sellSearch.make) params.append('make', sellSearch.make);
    if (sellSearch.year) params.append('year', sellSearch.year);
    navigate(`/estimate?${params.toString()}`);
  };

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 to-primary">
        <div className="container flex flex-col items-center px-4 py-20 mx-auto text-center lg:py-32">
          <div className="animate-pulse">
            <div className="h-12 bg-white/20 rounded-lg mb-4 w-3/4 mx-auto"></div>
            <div className="h-6 bg-white/20 rounded-lg mb-10 w-1/2 mx-auto"></div>
            <div className="h-32 bg-white/20 rounded-lg w-full max-w-4xl"></div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 to-primary">
      {/* Background overlay with subtle pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00TTAgNjBjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
      
      <div className="container relative flex flex-col items-center px-4 py-20 mx-auto text-center lg:py-32">
        <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          {heroContent.title}
        </h1>
        <p className="max-w-2xl mb-10 text-lg text-white/90">
          {heroContent.subtitle}
        </p>
        
        <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg">
          <Tabs defaultValue="buy" onValueChange={setSearchType} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              {heroContent.searchTabs.buy.enabled && <TabsTrigger value="buy">Buy</TabsTrigger>}
              {heroContent.searchTabs.rent.enabled && <TabsTrigger value="rent">Rent</TabsTrigger>}
              {heroContent.searchTabs.sell.enabled && <TabsTrigger value="sell">Sell</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="buy" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="md:col-span-2">
                  <div className="flex items-center w-full rounded-md border border-input bg-background">
                    <MapPin className="w-4 h-4 ml-3 text-gray-400" />
                    <Input 
                      placeholder={heroContent.searchTabs.buy.placeholder} 
                      className="border-0 focus-visible:ring-0"
                      value={buySearch.location}
                      onChange={(e) => setBuySearch(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Select value={buySearch.carType} onValueChange={(value) => setBuySearch(prev => ({ ...prev, carType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Car Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {heroContent.searchTabs.buy.carTypes.map((type, index) => (
                        <SelectItem key={index} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Button className="w-full gap-2" onClick={handleBuySearch}>
                    <Search className="w-4 h-4" /> Search
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="rent" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                <div className="md:col-span-3">
                  <div className="flex items-center w-full rounded-md border border-input bg-background">
                    <MapPin className="w-4 h-4 ml-3 text-gray-400" />
                    <Input 
                      placeholder={heroContent.searchTabs.rent.pickupPlaceholder} 
                      className="border-0 focus-visible:ring-0"
                      value={rentSearch.pickupLocation}
                      onChange={(e) => setRentSearch(prev => ({ ...prev, pickupLocation: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <div className="flex items-center w-full rounded-md border border-input bg-background">
                    <Calendar className="w-4 h-4 ml-3 text-gray-400" />
                    <Input 
                      placeholder={heroContent.searchTabs.rent.pickupDatePlaceholder} 
                      className="border-0 focus-visible:ring-0"
                      value={rentSearch.pickupDate}
                      onChange={(e) => setRentSearch(prev => ({ ...prev, pickupDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <div className="flex items-center w-full rounded-md border border-input bg-background">
                    <Calendar className="w-4 h-4 ml-3 text-gray-400" />
                    <Input 
                      placeholder={heroContent.searchTabs.rent.returnDatePlaceholder} 
                      className="border-0 focus-visible:ring-0"
                      value={rentSearch.returnDate}
                      onChange={(e) => setRentSearch(prev => ({ ...prev, returnDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <Button className="w-full gap-2" onClick={handleRentSearch}>
                    <Search className="w-4 h-4" /> Search
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sell" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-1">
                  <Select value={sellSearch.make} onValueChange={(value) => setSellSearch(prev => ({ ...prev, make: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Car Make" />
                    </SelectTrigger>
                    <SelectContent>
                      {heroContent.searchTabs.sell.makes.map((make, index) => (
                        <SelectItem key={index} value={make.toLowerCase()}>
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-1">
                  <Select value={sellSearch.year} onValueChange={(value) => setSellSearch(prev => ({ ...prev, year: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Car Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {heroContent.searchTabs.sell.years.map((year, index) => (
                        <SelectItem key={index} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-1">
                  <Button className="w-full gap-2" onClick={handleSellEstimate}>
                    Get Estimate
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex flex-wrap justify-center mt-8 gap-x-4 gap-y-2">
          {heroContent.badges.map((badge, index) => (
            <span key={index} className="px-3 py-1 text-xs text-white bg-primary/50 rounded-full">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
