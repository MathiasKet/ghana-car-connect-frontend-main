import api from './api';

export interface UploadResponse {
  url: string;
  publicId: string;
  originalName: string;
  size: number;
  mimeType: string;
}

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
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total!
        );
        console.log(`Upload progress: ${progress}%`);
      },
    });

    return response.data;
  }

  // Upload multiple images
  async uploadImages(files: File[]): Promise<UploadResponse[]> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images`, file);
    });

    const response = await api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
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

    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Delete uploaded file
  async deleteFile(publicId: string): Promise<void> {
    await api.delete('/upload/file', { data: { publicId } });
  }

  // Get file info
  async getFileInfo(publicId: string): Promise<UploadResponse> {
    const response = await api.get(`/upload/file/${publicId}`);
    return response.data;
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
