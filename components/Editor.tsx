
import React, { useState, useCallback } from 'react';
import { editImageWithText } from '../services/geminiService';
import ImageUpload from './ImageUpload';
import Spinner from './Spinner';
import { ImageFile } from '../types';

const Editor: React.FC = () => {
  const [baseImage, setBaseImage] = useState<ImageFile | null>(null);
  const [prompt, setPrompt] = useState('Add a retro filter');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (files: ImageFile[]) => {
    if (files.length > 0) {
      setBaseImage(files[0]);
      setEditedImage(null); // Clear previous edit on new image upload
    } else {
      setBaseImage(null);
    }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseImage || !prompt) {
      setError("Please upload an image and provide an editing instruction.");
      return;
    }
    setLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const result = await editImageWithText(baseImage, prompt);
      setEditedImage(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred during editing.");
    } finally {
      setLoading(false);
    }
  }, [baseImage, prompt]);
  
  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="p-8 bg-gray-800/50 rounded-lg shadow-xl space-y-6">
        <ImageUpload
          onFilesSelect={handleImageSelect}
          selectedFiles={baseImage ? [baseImage] : []}
          multiple={false}
          title="Upload Image to Edit"
          description="Click to upload a single image"
        />

        {baseImage && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Editing Instruction</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Remove the person in the background"
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !baseImage || !prompt}
          className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {loading && <Spinner />}
          {loading ? 'Editing Image...' : 'Edit Image'}
        </button>
      </form>

      {error && <div className="text-center p-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg">{error}</div>}

      {editedImage && baseImage && (
        <div className="p-8 bg-gray-800/50 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-indigo-400">Image Edit Result</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Original</h3>
              <img src={`data:${baseImage.mimeType};base64,${baseImage.base64}`} alt="Original" className="w-full max-w-sm mx-auto rounded-lg shadow-lg border-2 border-gray-700" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Edited</h3>
              <img src={editedImage} alt="Edited" className="w-full max-w-sm mx-auto rounded-lg shadow-lg border-2 border-gray-700" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
