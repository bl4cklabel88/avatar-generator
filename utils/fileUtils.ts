
import { ImageFile } from '../types';

export const fileToBase64 = (file: File): Promise<ImageFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      if (base64) {
        resolve({ base64, mimeType: file.type, name: file.name });
      } else {
        reject(new Error("Failed to read file as Base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
