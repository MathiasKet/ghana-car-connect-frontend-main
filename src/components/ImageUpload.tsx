import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Camera, 
  AlertCircle,
  CheckCircle,
  Link,
  FolderOpen,
  Plus
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import UploadService from '@/services/uploadService';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

export const ImageUpload = ({
  images,
  onImagesChange,
  maxImages = 10,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  className = ''
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      toast.error(`Invalid file type. Accepted: ${acceptedTypes.map(type => type.split('/')[1]).join(', ')}`);
      return false;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const validateImageUrl = (url: string): boolean => {
    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast.error('Please enter a valid URL');
      return false;
    }

    // Check if URL points to an image
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const hasImageExtension = imageExtensions.some(ext => 
      url.toLowerCase().includes(ext)
    );
    
    if (!hasImageExtension) {
      toast.error('URL must point to an image file (.jpg, .png, .webp, .gif)');
      return false;
    }

    return true;
  };

  const addImageFromUrl = async () => {
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL');
      return;
    }

    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    if (!validateImageUrl(imageUrl.trim())) {
      return;
    }

    // Check for duplicates
    if (images.includes(imageUrl.trim())) {
      toast.error('This image has already been added');
      return;
    }

    // Verify image loads successfully
    const img = new Image();
    img.onload = () => {
      onImagesChange([...images, imageUrl.trim()]);
      setImageUrl('');
      toast.success('Image added successfully!');
    };
    img.onerror = () => {
      toast.error('Failed to load image from URL. Please check the URL and try again.');
    };
    img.src = imageUrl.trim();
  };

  const handleFiles = useCallback(async (files: FileList) => {
    const validFiles = Array.from(files).filter(validateFile);
    
    if (validFiles.length === 0) return;

    // Check max images limit
    if (images.length + validFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = validFiles.map(async (file, index) => {
        // Compress image if needed
        const processedFile = file.size > 1024 * 1024 ? 
          await UploadService.compressImage(file, 1200, 0.8) : file;

        const result = await UploadService.uploadImage(processedFile);
        
        // Update progress
        setUploadProgress((prev) => 
          Math.min(prev + (100 / validFiles.length), 100)
        );

        return result.url;
      });

      const newImages = await Promise.all(uploadPromises);
      onImagesChange([...images, ...newImages]);
      
      toast.success(`${validFiles.length} image(s) uploaded successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [images, maxImages, maxSize, acceptedTypes, onImagesChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = async (index: number) => {
    const imageToRemove = images[index];
    
    try {
      // Remove from server
      await UploadService.deleteFile(imageToRemove);
      
      // Remove from state
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
      
      toast.success('Image removed');
    } catch (error) {
      toast.error('Failed to remove image');
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area with Tabs */}
      {images.length < maxImages && (
        <Card className="border-2 border-dashed">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="gallery" className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  Gallery
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-4">
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex justify-center mb-4">
                    {uploading ? (
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    ) : (
                      <Upload className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      {uploading ? 'Uploading...' : 'Upload Images'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {uploading 
                        ? `Processing images... ${Math.round(uploadProgress)}%`
                        : `Drag & drop images here, or click to select (Max ${maxImages} images, ${maxSize}MB each)`
                      }
                    </p>
                  </div>

                  {uploading && (
                    <div className="mt-4">
                      <Progress value={uploadProgress} className="w-full" />
                    </div>
                  )}

                  {!uploading && (
                    <div className="mt-4 space-x-2">
                      <Button onClick={openFileDialog} variant="outline">
                        <Camera className="h-4 w-4 mr-2" />
                        Choose Files
                      </Button>
                      <Button onClick={openFileDialog} variant="outline">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Take Photo
                      </Button>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              </TabsContent>

              <TabsContent value="url" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="imageUrl"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={addImageFromUrl} disabled={!imageUrl.trim()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>Enter a direct URL to an image file. Supported formats: JPG, PNG, WebP, GIF</p>
                    <p className="mt-1">The image will be validated before adding to your listing.</p>
                  </div>

                  {/* URL Preview */}
                  {imageUrl.trim() && (
                    <div className="mt-4">
                      <Label>Preview</Label>
                      <div className="mt-2 border rounded-lg p-4">
                        <img 
                          src={imageUrl.trim()} 
                          alt="URL preview" 
                          className="max-w-full h-48 object-cover mx-auto"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="mt-4">
                <div className="space-y-4">
                  <div className="text-center">
                    <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Image Gallery</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Choose from your device's photo gallery
                    </p>
                    
                    <Button onClick={openFileDialog} className="w-full">
                      <Camera className="h-4 w-4 mr-2" />
                      Open Gallery
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600 text-center">
                    <p>You can select multiple images at once from your gallery.</p>
                    <p className="mt-1">Maximum file size: {maxSize}MB per image</p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              Images ({images.length}/{maxImages})
            </h3>
            {images.length < maxImages && (
              <Button onClick={() => setActiveTab('upload')} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Add More Images
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <Card key={index} className="relative overflow-hidden group">
                <div className="aspect-square">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Image number indicator */}
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Tips:</strong> Use high-quality images showing the exterior, interior, dashboard, and any special features. 
          First image will be used as the main thumbnail.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ImageUpload;
