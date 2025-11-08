import React, { useCallback, useRef } from 'react';
import { ImageFile } from '../types';
import { fileToBase64 } from '../utils/fileUtils';

interface ImageUploadProps {
  onFilesSelect: (files: ImageFile[]) => void;
  selectedFiles: ImageFile[];
  multiple?: boolean;
  title: string;
  description: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onFilesSelect, selectedFiles, multiple = false, title, description }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // FIX: Convert FileList to an array using the spread operator to ensure
      // correct type inference on the `file` object when calling `.map()`.
      const imageFiles: ImageFile[] = await Promise.all(
        [...event.target.files].map(file => fileToBase64(file))
      );
      onFilesSelect(imageFiles);
    }
  }, [onFilesSelect]);

  const removeImage = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    onFilesSelect(newFiles);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{title}</label>
      <div 
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="space-y-1 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex text-sm text-gray-500">
            <p className="pl-1">{description}</p>
          </div>
          <p className="text-xs text-gray-600">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
      <input ref={fileInputRef} type="file" multiple={multiple} accept="image/*" className="hidden" onChange={handleFileChange} />

      {selectedFiles.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative group">
              <img src={`data:${file.mimeType};base64,${file.base64}`} alt={file.name} className="h-24 w-24 object-cover rounded-md" />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;