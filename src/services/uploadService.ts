export interface UploadResponse {
  url: string;
  publicId: string;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

class UploadService {
  async uploadImage(file: File): Promise<UploadResponse | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8080/api/v1/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      console.log('Upload response data:', data);
      
      // Check if response has result field (API returns {code, message, result})
      if (data.result) {
        console.log('Using data.result:', data.result);
        return data.result;
      }
      
      // Check if response has data field
      if (data.data) {
        console.log('Using data.data:', data.data);
        return data.data;
      }
      
      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/upload/image?publicId=${publicId}`, {
        method: 'DELETE'
      });

      const data: ApiResponse<null> = await response.json();
      
      if (data.code !== 0) {
        throw new Error(data.message || 'Delete image failed');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
}

export const uploadService = new UploadService();