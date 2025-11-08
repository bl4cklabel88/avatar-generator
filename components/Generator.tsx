import React, { useState, useCallback } from 'react';
import { generateAvatars, AvatarResult } from '../services/geminiService';
import ImageUpload from './ImageUpload';
import Spinner from './Spinner';
import { ImageFile } from '../types';

const Generator: React.FC = () => {
  const [userName, setUserName] = useState('cheevh');
  const [darkLight, setDarkLight] = useState('dark, minimal');
  const [ideas, setIdeas] = useState('electronics, networking, reverse shells, #!');
  const [quantity, setQuantity] = useState(1);
  const [includeUsername, setIncludeUsername] = useState(true);
  const [textLanguages, setTextLanguages] = useState(['en']);
  const [exampleImages, setExampleImages] = useState<ImageFile[]>([]);
  const [generatedAvatars, setGeneratedAvatars] = useState<AvatarResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = (lang: string) => {
    setTextLanguages(prev =>
      prev.includes(lang)
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    );
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedAvatars(null);

    try {
      const avatars = await generateAvatars({ userName, darkLight, ideas, exampleImages, quantity, includeUsername, textLanguages });
      setGeneratedAvatars(avatars);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }, [userName, darkLight, ideas, exampleImages, quantity, includeUsername, textLanguages]);

  const handleExampleImagesSelect = (files: ImageFile[]) => {
    setExampleImages(files);
  };
  
  interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
  }

  const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <input
        {...props}
        className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      />
    </div>
  );

  const GenerationInfo = ({ userName, darkLight, ideas, quantity, includeUsername, textLanguages }: { userName: string, darkLight: string, ideas: string, quantity: number, includeUsername: boolean, textLanguages: string[] }) => (
    <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
        <h3 className="text-lg font-semibold text-indigo-400 mb-2">Generation Parameters</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <p><span className="font-semibold text-gray-400">Username:</span> {userName}</p>
            <p><span className="font-semibold text-gray-400">Quantity:</span> {quantity}</p>
            <p><span className="font-semibold text-gray-400">Include Username:</span> {includeUsername ? 'Yes' : 'No'}</p>
            <p><span className="font-semibold text-gray-400">Languages:</span> {textLanguages.map(l => l.toUpperCase()).join(', ')}</p>
            <p className="col-span-2"><span className="font-semibold text-gray-400">Style:</span> {darkLight}</p>
            <p className="col-span-2"><span className="font-semibold text-gray-400">Ideas:</span> {ideas}</p>
        </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="p-8 bg-gray-800/50 rounded-lg shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Username" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="e.g., cheevh" />
          <InputField label="Colors / Style" value={darkLight} onChange={(e) => setDarkLight(e.target.value)} placeholder="e.g., dark, minimal" />
        </div>
        
        <InputField 
            label="Number of Avatars"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
            min="1"
            required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center pt-6">
                <input
                    id="include-username"
                    type="checkbox"
                    checked={includeUsername}
                    onChange={(e) => setIncludeUsername(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="include-username" className="ml-3 block text-sm font-medium text-gray-300">
                    Include username in avatar
                </label>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Text Language (for username)</label>
                <div className="flex space-x-4 pt-1">
                    {['en', 'ru', 'ch'].map(lang => (
                        <div key={lang} className="flex items-center">
                            <input
                                id={`lang-${lang}`}
                                type="checkbox"
                                value={lang}
                                checked={textLanguages.includes(lang)}
                                onChange={() => handleLanguageChange(lang)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
                            />
                            <label htmlFor={`lang-${lang}`} className="ml-2 block text-sm text-gray-300">{lang.toUpperCase()}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        
        <div>
           <label className="block text-sm font-medium text-gray-300 mb-2">Ideas, Themes, Imagery</label>
           <textarea
             value={ideas}
             onChange={(e) => setIdeas(e.target.value)}
             placeholder="e.g., electronics, networking, #!"
             rows={3}
             className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
           />
        </div>
        
        <ImageUpload 
            onFilesSelect={handleExampleImagesSelect}
            selectedFiles={exampleImages}
            multiple={true}
            title="Example Images (Optional)"
            description="Upload up to 20 reference images"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Avatars'}
        </button>
      </form>

      {loading && (
        <div className="p-8 bg-gray-800/50 rounded-lg shadow-xl space-y-4">
            <div className="flex justify-center items-center text-xl font-semibold">
                <Spinner />
                <span>Generating Avatars...</span>
            </div>
            <GenerationInfo userName={userName} darkLight={darkLight} ideas={ideas} quantity={quantity} includeUsername={includeUsername} textLanguages={textLanguages} />
        </div>
      )}

      {error && <div className="text-center p-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg">{error}</div>}

      {generatedAvatars && (
        <div className="p-8 bg-gray-800/50 rounded-lg shadow-xl space-y-8">
          <GenerationInfo userName={userName} darkLight={darkLight} ideas={ideas} quantity={quantity} includeUsername={includeUsername} textLanguages={textLanguages} />
          <h2 className="text-2xl font-bold text-center text-indigo-400">Generated Avatars</h2>
          <div className="space-y-8">
            {generatedAvatars.map((avatarResult, index) => (
               <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-700 first:border-t-0 first:pt-0">
                 {avatarResult.withUsername ? (
                   <>
                     <div className="text-center">
                       <h3 className="font-semibold mb-2">With Username</h3>
                       <img src={avatarResult.withUsername} alt={`Avatar ${index + 1} with username`} className="w-64 h-64 mx-auto rounded-lg shadow-lg border-2 border-gray-700" />
                     </div>
                     <div className="text-center">
                       <h3 className="font-semibold mb-2">Without Username</h3>
                       <img src={avatarResult.withoutUsername} alt={`Avatar ${index + 1} without username`} className="w-64 h-64 mx-auto rounded-lg shadow-lg border-2 border-gray-700" />
                     </div>
                   </>
                 ) : (
                   <div className="text-center md:col-span-2">
                     <h3 className="font-semibold mb-2">Avatar (no username)</h3>
                     <img src={avatarResult.withoutUsername} alt={`Avatar ${index + 1}`} className="w-64 h-64 mx-auto rounded-lg shadow-lg border-2 border-gray-700" />
                   </div>
                 )}
               </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Generator;