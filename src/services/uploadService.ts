import { supabase } from '@/lib/supabase';

export interface UploadResponse {
  url: string;
  publicId: string;
  originalName: string;
  size: number;
  mimeType: string;
}

const BUCKET_NAME = 'car-images';

export class UploadService {
  private static instance: UploadService;

  static getInstance(): UploadService {
    if (!UploadService.instance) {
      UploadService.instance = new UploadService();
    }
    return UploadService.instance;
  }

  // Upload single image
  async uploadImage(file: File): Promise<UploadResponse> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      publicId: data.path,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
    };
  }

  // Upload multiple images
  async uploadImages(files: File[]): Promise<UploadResponse[]> {
    const results = await Promise.all(files.map(file => this.uploadImage(file)));
    return results;
  }

  // Upload car images with validation
  async uploadCarImages(files: File[]): Promise<UploadResponse[]> {
    // Validate files
    const validFiles = files.filter(file => this.validateImageFile(file));
    
    if (validFiles.length !== files.length) {
      throw new Error('Some files are invalid. Please ensure all files are images (JPG, PNG, WebP) and under 5MB.');
    }

    return this.uploadImages(validFiles);
  }

  // Upload user avatar
  async uploadAvatar(file: File): Promise<UploadResponse> {
    if (!this.validateImageFile(file)) {
      throw new Error('Invalid image file. Please use JPG, PNG, or WebP format under 2MB.');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `avatar-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw new Error(`Avatar upload failed: ${error.message}`);

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      publicId: data.path,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
    };
  }

  // Delete uploaded file
  async deleteFile(publicId: string): Promise<void> {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([publicId]);

    if (error) throw new Error(`Delete failed: ${error.message}`);
  }

  // Get file info
  async getFileInfo(publicId: string): Promise<UploadResponse> {
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(publicId);

    return {
      url: urlData.publicUrl,
      publicId,
      originalName: publicId.split('/').pop() || '',
      size: 0,
      mimeType: '',
    };
  }

  // Validate image file
  private validateImageFile(file: File): boolean {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return false;
    }

    // Check file size (5MB max for images, 2MB for avatar)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return false;
    }

    return true;
  }

  // Compress image before upload (optional)
  async compressImage(file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Generate image preview URL
  generatePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  // Revoke preview URL
  revokePreview(url: string): void {
    URL.revokeObjectURL(url);
  }
}

export default UploadService.getInstance();
