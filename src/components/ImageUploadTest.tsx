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
  Info
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ImageUpload from './ImageUpload';

export const ImageUploadTest = () => {
  const [images, setImages] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
    setShowResults(true);
  };

  const clearImages = () => {
    setImages([]);
    setShowResults(false);
  };

  const addSampleImages = () => {
    const sampleUrls = [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop'
    ];
    
    setImages(sampleUrls);
    setShowResults(true);
    toast.success('Sample images added!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-6 w-6" />
            Enhanced Image Upload Test
          </CardTitle>
          <CardDescription>
            Test the multi-method image upload component with URL input, file upload, and gallery access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={addSampleImages} variant="outline" size="sm">
                <ImageIcon className="h-4 w-4 mr-2" />
                Add Sample Images
              </Button>
              <Button onClick={clearImages} variant="outline" size="sm">
                Clear All
              </Button>
            </div>

            <Separator />

            {/* Image Upload Component */}
            <ImageUpload
              images={images}
              onImagesChange={handleImagesChange}
              maxImages={10}
              maxSize={5}
            />

            {/* Results Display */}
            {showResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Upload Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Images:</span>
                    <Badge variant="secondary">{images.length}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Image Sources:</span>
                    <div className="grid grid-cols-1 gap-2">
                      {images.map((image, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono">#{index + 1}</span>
                            <span className="text-sm truncate max-w-xs">
                              {image.startsWith('http') ? 'URL Source' : 'File Upload'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {image.startsWith('http') && (
                              <Badge variant="outline" className="text-xs">
                                <Link className="h-3 w-3 mr-1" />
                                URL
                              </Badge>
                            )}
                            {!image.startsWith('http') && (
                              <Badge variant="outline" className="text-xs">
                                <Upload className="h-3 w-3 mr-1" />
                                File
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Image Preview Grid */}
                  {images.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Image Preview:</span>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={image}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder.svg';
                                }}
                              />
                            </div>
                            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                              #{index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  How to Test
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Upload Tab</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Drag & drop files or click to select from your device. Supports multiple files at once.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-green-500" />
                      <span className="font-medium">URL Tab</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Enter direct image URLs. The component validates the URL and previews the image.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Gallery Tab</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Access your device's photo gallery to select multiple images.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Test URLs:</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>• Try these sample URLs in the URL tab:</p>
                    <p className="font-mono text-xs bg-gray-100 p-2 rounded">
                      https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop
                    </p>
                    <p className="font-mono text-xs bg-gray-100 p-2 rounded">
                      https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUploadTest;
