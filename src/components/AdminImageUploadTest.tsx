import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  Image as ImageIcon, 
  Link,
  FolderOpen,
  CheckCircle,
  Info,
  Car,
  Star,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import ImageUpload from './ImageUpload';

interface AdminCarData {
  make: string;
  model: string;
  year: number;
  price: number;
  location: string;
  images: string[];
  featured: boolean;
  category: 'buy' | 'rent';
}

const AdminImageUploadTest = () => {
  const [carData, setCarData] = useState<AdminCarData>({
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 85000,
    location: 'Accra',
    images: [],
    featured: true,
    category: 'buy'
  });

  const handleImagesChange = (images: string[]) => {
    setCarData(prev => ({ ...prev, images }));
  };

  const addSampleImages = () => {
    const sampleUrls = [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop'
    ];
    
    setCarData(prev => ({ ...prev, images: sampleUrls }));
    toast.success('Sample images added!');
  };

  const clearImages = () => {
    setCarData(prev => ({ ...prev, images: [] }));
  };

  const saveCar = () => {
    console.log('Saving car data:', carData);
    toast.success('Car saved successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-6 w-6" />
            Admin Car Image Upload Test
          </CardTitle>
          <CardDescription>
            Test the enhanced image upload functionality for admin car listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={addSampleImages} variant="outline" size="sm">
                <ImageIcon className="h-4 w-4 mr-2" />
                Add Sample Images
              </Button>
              <Button onClick={clearImages} variant="outline" size="sm">
                Clear Images
              </Button>
              <Button onClick={saveCar} size="sm">
                Save Car
              </Button>
            </div>

            <Separator />

            {/* Car Info Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Car Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{carData.make} {carData.model}</span>
                    <Badge variant={carData.category === 'buy' ? 'default' : 'secondary'}>
                      {carData.category === 'buy' ? 'For Sale' : 'For Rent'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{carData.year} • GHS {carData.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{carData.location}</span>
                  </div>
                  {carData.featured && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Featured Listing</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Image Statistics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Images:</span>
                    <Badge variant="secondary">{carData.images.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Image Sources:</span>
                    <div className="flex gap-1">
                      {carData.images.filter(img => img.startsWith('http')).length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <Link className="h-3 w-3 mr-1" />
                          URL
                        </Badge>
                      )}
                      {carData.images.filter(img => !img.startsWith('http')).length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <Upload className="h-3 w-3 mr-1" />
                          File
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Image Upload Component */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Car Images</h3>
              <ImageUpload
                images={carData.images}
                onImagesChange={handleImagesChange}
                maxImages={8}
                maxSize={5}
              />
            </div>

            {/* Image Preview Grid */}
            {carData.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Image Preview
                  </CardTitle>
                  <CardDescription>
                    Preview of how images will appear in the admin listing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {carData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`Car image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                        <div className="absolute top-2 right-2">
                          {image.startsWith('http') ? (
                            <Badge variant="outline" className="text-xs bg-white/90">
                              <Link className="h-3 w-3 mr-1" />
                              URL
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-white/90">
                              <Upload className="h-3 w-3 mr-1" />
                              File
                            </Badge>
                          )}
                        </div>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                            Main Image
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>Note:</strong> The first image will be used as the main thumbnail in listings.</p>
                    <p className="mt-1">Admins can add up to 8 images per car listing using multiple methods.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Admin Image Upload Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">File Upload</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Upload images directly from device with drag & drop support.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-green-500" />
                      <span className="font-medium">URL Input</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Add images from external URLs with validation and preview.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Gallery Access</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Access device photo gallery for easy image selection.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Admin Benefits:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Up to 8 images per car listing</li>
                    <li>• Multiple upload methods for flexibility</li>
                    <li>• Image validation and compression</li>
                    <li>• Mixed source support (URL + files)</li>
                    <li>• Preview before saving</li>
                    <li>• Error handling and user feedback</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminImageUploadTest;
