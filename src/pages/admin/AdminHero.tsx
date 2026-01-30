import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Eye, 
  RefreshCw, 
  Plus, 
  Trash2,
  MoveUp,
  MoveDown
} from 'lucide-react';
import { toast } from 'sonner';

interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  badges: string[];
  searchTabs: {
    buy: {
      enabled: boolean;
      placeholder: string;
      carTypes: string[];
    };
    rent: {
      enabled: boolean;
      pickupPlaceholder: string;
      pickupDatePlaceholder: string;
      returnDatePlaceholder: string;
    };
    sell: {
      enabled: boolean;
      makes: string[];
      years: string[];
    };
  };
}

const defaultHeroContent: HeroContent = {
  title: 'Find Your Perfect Ride in Ghana',
  subtitle: 'Buy, sell, or rent cars with confidence. The easiest way to navigate the Ghanaian automotive market.',
  description: '',
  badges: ['Trusted by 10,000+ Ghanaians', 'Top-rated service', 'Secure payments'],
  searchTabs: {
    buy: {
      enabled: true,
      placeholder: 'Location (e.g. Accra, Kumasi)',
      carTypes: ['Sedan', 'SUV', 'Truck', 'Van', 'Luxury'],
    },
    rent: {
      enabled: true,
      pickupPlaceholder: 'Pick-up location',
      pickupDatePlaceholder: 'Pick-up date',
      returnDatePlaceholder: 'Return date',
    },
    sell: {
      enabled: true,
      makes: ['Toyota', 'Honda', 'Nissan', 'Ford', 'Other'],
      years: ['2023', '2022', '2021', '2020', 'Older'],
    },
  },
};

const AdminHero = () => {
  const [heroContent, setHeroContent] = useState<HeroContent>(defaultHeroContent);
  const [newBadge, setNewBadge] = useState('');
  const [newCarType, setNewCarType] = useState('');
  const [newMake, setNewMake] = useState('');
  const [newYear, setNewYear] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('heroContent');
    if (saved) {
      setHeroContent(JSON.parse(saved));
    }
  }, []);

  const saveContent = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('heroContent', JSON.stringify(heroContent));
      toast.success('Hero content saved successfully!');
    } catch (error) {
      toast.error('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  const resetContent = () => {
    setHeroContent(defaultHeroContent);
    toast.info('Content reset to default');
  };

  const addBadge = () => {
    if (newBadge.trim()) {
      setHeroContent(prev => ({
        ...prev,
        badges: [...prev.badges, newBadge.trim()]
      }));
      setNewBadge('');
    }
  };

  const removeBadge = (index: number) => {
    setHeroContent(prev => ({
      ...prev,
      badges: prev.badges.filter((_, i) => i !== index)
    }));
  };

  const addCarType = () => {
    if (newCarType.trim()) {
      setHeroContent(prev => ({
        ...prev,
        searchTabs: {
          ...prev.searchTabs,
          buy: {
            ...prev.searchTabs.buy,
            carTypes: [...prev.searchTabs.buy.carTypes, newCarType.trim()]
          }
        }
      }));
      setNewCarType('');
    }
  };

  const removeCarType = (index: number) => {
    setHeroContent(prev => ({
      ...prev,
      searchTabs: {
        ...prev.searchTabs,
        buy: {
          ...prev.searchTabs.buy,
          carTypes: prev.searchTabs.buy.carTypes.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const addMake = () => {
    if (newMake.trim()) {
      setHeroContent(prev => ({
        ...prev,
        searchTabs: {
          ...prev.searchTabs,
          sell: {
            ...prev.searchTabs.sell,
            makes: [...prev.searchTabs.sell.makes, newMake.trim()]
          }
        }
      }));
      setNewMake('');
    }
  };

  const removeMake = (index: number) => {
    setHeroContent(prev => ({
      ...prev,
      searchTabs: {
        ...prev.searchTabs,
        sell: {
          ...prev.searchTabs.sell,
          makes: prev.searchTabs.sell.makes.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const moveItem = (array: string[], index: number, direction: 'up' | 'down') => {
    const newArray = [...array];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newArray.length) {
      [newArray[index], newArray[newIndex]] = [newArray[newIndex], newArray[index]];
      return newArray;
    }
    return array;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hero Section</h1>
          <p className="text-gray-600">Manage the main hero section content and search functionality</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetContent}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveContent} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList>
          <TabsTrigger value="content">Main Content</TabsTrigger>
          <TabsTrigger value="search">Search Options</TabsTrigger>
          <TabsTrigger value="badges">Trust Badges</TabsTrigger>
        </TabsList>

        {/* Main Content */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Content</CardTitle>
              <CardDescription>Update the main title and description of your hero section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Main Title</Label>
                <Input
                  id="title"
                  value={heroContent.title}
                  onChange={(e) => setHeroContent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter main title"
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={heroContent.subtitle}
                  onChange={(e) => setHeroContent(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Enter subtitle"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>See how your hero section will look on the main page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-gradient-to-br from-primary/90 to-primary rounded-lg text-white">
                <h1 className="text-3xl font-bold mb-4">{heroContent.title}</h1>
                <p className="text-lg text-white/90">{heroContent.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search Options */}
        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Tabs Configuration</CardTitle>
              <CardDescription>Configure which search tabs are enabled and their options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Buy Tab */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Buy Tab</h3>
                    <p className="text-sm text-gray-600">Allow users to search for cars to buy</p>
                  </div>
                  <Switch
                    checked={heroContent.searchTabs.buy.enabled}
                    onCheckedChange={(checked) =>
                      setHeroContent(prev => ({
                        ...prev,
                        searchTabs: {
                          ...prev.searchTabs,
                          buy: { ...prev.searchTabs.buy, enabled: checked }
                        }
                      }))
                    }
                  />
                </div>
                {heroContent.searchTabs.buy.enabled && (
                  <div className="space-y-4 pl-4">
                    <div>
                      <Label>Location Placeholder</Label>
                      <Input
                        value={heroContent.searchTabs.buy.placeholder}
                        onChange={(e) =>
                          setHeroContent(prev => ({
                            ...prev,
                            searchTabs: {
                              ...prev.searchTabs,
                              buy: { ...prev.searchTabs.buy, placeholder: e.target.value }
                            }
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Car Types</Label>
                      <div className="space-y-2">
                        {heroContent.searchTabs.buy.carTypes.map((type, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Badge variant="secondary">{type}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCarType(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex space-x-2">
                          <Input
                            value={newCarType}
                            onChange={(e) => setNewCarType(e.target.value)}
                            placeholder="Add new car type"
                          />
                          <Button onClick={addCarType}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Rent Tab */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Rent Tab</h3>
                    <p className="text-sm text-gray-600">Allow users to search for rental cars</p>
                  </div>
                  <Switch
                    checked={heroContent.searchTabs.rent.enabled}
                    onCheckedChange={(checked) =>
                      setHeroContent(prev => ({
                        ...prev,
                        searchTabs: {
                          ...prev.searchTabs,
                          rent: { ...prev.searchTabs.rent, enabled: checked }
                        }
                      }))
                    }
                  />
                </div>
                {heroContent.searchTabs.rent.enabled && (
                  <div className="space-y-4 pl-4">
                    <div>
                      <Label>Pick-up Location Placeholder</Label>
                      <Input
                        value={heroContent.searchTabs.rent.pickupPlaceholder}
                        onChange={(e) =>
                          setHeroContent(prev => ({
                            ...prev,
                            searchTabs: {
                              ...prev.searchTabs,
                              rent: { ...prev.searchTabs.rent, pickupPlaceholder: e.target.value }
                            }
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Pick-up Date Placeholder</Label>
                      <Input
                        value={heroContent.searchTabs.rent.pickupDatePlaceholder}
                        onChange={(e) =>
                          setHeroContent(prev => ({
                            ...prev,
                            searchTabs: {
                              ...prev.searchTabs,
                              rent: { ...prev.searchTabs.rent, pickupDatePlaceholder: e.target.value }
                            }
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Return Date Placeholder</Label>
                      <Input
                        value={heroContent.searchTabs.rent.returnDatePlaceholder}
                        onChange={(e) =>
                          setHeroContent(prev => ({
                            ...prev,
                            searchTabs: {
                              ...prev.searchTabs,
                              rent: { ...prev.searchTabs.rent, returnDatePlaceholder: e.target.value }
                            }
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Sell Tab */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Sell Tab</h3>
                    <p className="text-sm text-gray-600">Allow users to list their cars for sale</p>
                  </div>
                  <Switch
                    checked={heroContent.searchTabs.sell.enabled}
                    onCheckedChange={(checked) =>
                      setHeroContent(prev => ({
                        ...prev,
                        searchTabs: {
                          ...prev.searchTabs,
                          sell: { ...prev.searchTabs.sell, enabled: checked }
                        }
                      }))
                    }
                  />
                </div>
                {heroContent.searchTabs.sell.enabled && (
                  <div className="space-y-4 pl-4">
                    <div>
                      <Label>Car Makes</Label>
                      <div className="space-y-2">
                        {heroContent.searchTabs.sell.makes.map((make, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Badge variant="secondary">{make}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMake(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex space-x-2">
                          <Input
                            value={newMake}
                            onChange={(e) => setNewMake(e.target.value)}
                            placeholder="Add new car make"
                          />
                          <Button onClick={addMake}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trust Badges */}
        <TabsContent value="badges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trust Badges</CardTitle>
              <CardDescription>Manage the trust badges displayed below the hero section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {heroContent.badges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Badge variant="secondary">{badge}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBadge(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  placeholder="Add new trust badge"
                />
                <Button onClick={addBadge}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminHero;
