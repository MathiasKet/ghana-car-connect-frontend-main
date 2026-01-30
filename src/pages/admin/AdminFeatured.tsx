import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit,
  Eye,
  RefreshCw,
  Car,
  MapPin,
  Calendar,
  DollarSign,
  X,
  Star,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Image
} from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { toast } from 'sonner';

interface FeaturedCar {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  location: string;
  mileage: number;
  transmission: string;
  fuelType: string;
  condition: string;
  description: string;
  images: string[]; // Changed from imageUrl to images array
  featured: boolean;
  category: 'buy' | 'rent';
  rentalPrice?: number;
  available?: boolean;
}

const defaultCars: FeaturedCar[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 85000,
    location: 'Accra',
    mileage: 15000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    condition: 'Excellent',
    description: 'Well-maintained Toyota Camry with full service history. Perfect for family use.',
    images: ['https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop'],
    featured: true,
    category: 'buy'
  },
  {
    id: '2',
    make: 'Honda',
    model: 'CR-V',
    year: 2023,
    price: 120000,
    location: 'Kumasi',
    mileage: 8000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    condition: 'Like New',
    description: 'Nearly new Honda CR-V SUV with advanced safety features and great fuel economy.',
    images: ['https://images.unsplash.com/photo-1617654112368-307921291f42?w=800&h=600&fit=crop'],
    featured: true,
    category: 'buy'
  },
  {
    id: '3',
    make: 'Nissan',
    model: 'Sentra',
    year: 2021,
    price: 75000,
    location: 'Takoradi',
    mileage: 25000,
    transmission: 'Manual',
    fuelType: 'Petrol',
    condition: 'Good',
    description: 'Reliable Nissan Sentra, great for daily commuting with excellent fuel efficiency.',
    images: ['https://images.unsplash.com/photo-1583121274602-3e2820c6f664?w=800&h=600&fit=crop'],
    featured: true,
    category: 'rent',
    rentalPrice: 150,
    available: true
  }
];

const AdminFeatured = () => {
  const [cars, setCars] = useState<FeaturedCar[]>(defaultCars);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<FeaturedCar | null>(null);
  const [formData, setFormData] = useState<Partial<FeaturedCar>>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    location: '',
    mileage: 0,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    condition: 'Good',
    description: '',
    images: [], // Changed from imageUrl to images array
    featured: true,
    category: 'buy',
    rentalPrice: 0,
    available: true
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('featuredCars');
    if (saved) {
      setCars(JSON.parse(saved));
    }
  }, []);

  const saveCars = async (updatedCars: FeaturedCar[]) => {
    setIsSaving(true);
    try {
      localStorage.setItem('featuredCars', JSON.stringify(updatedCars));
      setCars(updatedCars);
      toast.success('Cars saved successfully!');
    } catch (error) {
      toast.error('Failed to save cars');
    } finally {
      setIsSaving(false);
    }
  };

  const resetCars = () => {
    setCars(defaultCars);
    toast.info('Cars reset to default');
  };

  const openDialog = (car?: FeaturedCar) => {
    if (car) {
      setEditingCar(car);
      setFormData(car);
    } else {
      setEditingCar(null);
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        location: '',
        mileage: 0,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        condition: 'Good',
        description: '',
        images: [], // Changed from imageUrl to images array
        featured: true,
        category: 'buy',
        rentalPrice: 0,
        available: true
      });
    }
    setIsDialogOpen(true);
  };

  const saveCar = () => {
    if (!formData.make || !formData.model || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    let updatedCars: FeaturedCar[];
    
    if (editingCar) {
      updatedCars = cars.map(car => 
        car.id === editingCar.id 
          ? { ...formData, id: editingCar.id } as FeaturedCar
          : car
      );
    } else {
      const newCar: FeaturedCar = {
        ...formData,
        id: Date.now().toString()
      } as FeaturedCar;
      updatedCars = [...cars, newCar];
    }

    saveCars(updatedCars);
    setIsDialogOpen(false);
    setEditingCar(null);
  };

  const deleteCar = (id: string) => {
    const updatedCars = cars.filter(car => car.id !== id);
    saveCars(updatedCars);
  };

  const toggleFeatured = (id: string) => {
    const updatedCars = cars.map(car =>
      car.id === id ? { ...car, featured: !car.featured } : car
    );
    saveCars(updatedCars);
  };

  const toggleAvailable = (id: string) => {
    const updatedCars = cars.map(car =>
      car.id === id ? { ...car, available: !car.available } : car
    );
    saveCars(updatedCars);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Featured Cars</h1>
          <p className="text-gray-600">Manage featured car listings for buy and rent</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetCars}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Car
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCar ? 'Edit Car' : 'Add New Car'}</DialogTitle>
                <DialogDescription>
                  {editingCar ? 'Update the car details below.' : 'Fill in the details for the new car.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Make *</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
                    placeholder="e.g., Toyota"
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="e.g., Camry"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Accra"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (GHS)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                    placeholder="For sale cars"
                  />
                </div>
                <div>
                  <Label htmlFor="mileage">Mileage (km)</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData(prev => ({ ...prev, mileage: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select value={formData.transmission} onValueChange={(value) => setFormData(prev => ({ ...prev, transmission: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select value={formData.fuelType} onValueChange={(value) => setFormData(prev => ({ ...prev, fuelType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Like New">Like New</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as 'buy' | 'rent' }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">For Sale</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.category === 'rent' && (
                  <div>
                    <Label htmlFor="rentalPrice">Rental Price (GHS/day)</Label>
                    <Input
                      id="rentalPrice"
                      type="number"
                      value={formData.rentalPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, rentalPrice: parseInt(e.target.value) }))}
                    />
                  </div>
                )}
                <div className="col-span-2">
                  <Label>Car Images</Label>
                  <div className="mt-2">
                    <ImageUpload
                      images={formData.images || []}
                      onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                      maxImages={8}
                      maxSize={5}
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the car's features, condition, and history..."
                    rows={3}
                  />
                </div>
                <div className="col-span-2 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                    />
                    <Label htmlFor="featured">Featured on homepage</Label>
                  </div>
                  {formData.category === 'rent' && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="available"
                        checked={formData.available}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available: checked }))}
                      />
                      <Label htmlFor="available">Available for rent</Label>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveCar} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Car'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <Card key={car.id} className={car.featured ? 'ring-2 ring-primary' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Car className="h-5 w-5 text-primary" />
                  <Badge variant={car.category === 'buy' ? 'default' : 'secondary'}>
                    {car.category === 'buy' ? 'For Sale' : 'For Rent'}
                  </Badge>
                  {car.featured && <Badge variant="outline">Featured</Badge>}
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => openDialog(car)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteCar(car.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Car Images */}
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {car.images && car.images.length > 0 ? (
                    <img
                      src={car.images[0]}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Multiple Images Indicator */}
                {car.images && car.images.length > 1 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">+{car.images.length - 1} more images</span>
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold text-lg">{car.make} {car.model}</h3>
                  <p className="text-sm text-gray-600">{car.year} • {car.transmission}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{car.location}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{car.mileage.toLocaleString()} km</span>
                  </div>
                </div>

                <div className="text-lg font-bold text-primary">
                  {car.category === 'buy' ? (
                    <span>GHS {car.price.toLocaleString()}</span>
                  ) : (
                    <span>GHS {car.rentalPrice}/day</span>
                  )}
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">{car.description}</p>

                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{car.condition}</Badge>
                  <Badge variant="outline">{car.fuelType}</Badge>
                  {car.category === 'rent' && (
                    <Badge variant={car.available ? 'default' : 'destructive'}>
                      {car.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  )}
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => toggleFeatured(car.id)}
                  >
                    {car.featured ? 'Remove Featured' : 'Make Featured'}
                  </Button>
                  {car.category === 'rent' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleAvailable(car.id)}
                    >
                      {car.available ? 'Unavailable' : 'Available'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cars.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cars listed</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first car listing.</p>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Car
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminFeatured;
