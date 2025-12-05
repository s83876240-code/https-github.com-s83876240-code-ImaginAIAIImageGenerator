import React, { useState } from 'react';
import { generateImagesFromText } from '../services/geminiService';

const ImageGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      // Request 2 images as per requirement
      const images = await generateImagesFromText(topic, 2);
      setGeneratedImages(images);
    } catch (err: any) {
      setError(err.message || "Failed to generate images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `imaginai-${Date.now()}-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Input Section */}
      <div className="glass-panel p-2 rounded-2xl flex flex-col sm:flex-row gap-2 shadow-2xl shadow-indigo-500/10">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Describe your topic (e.g., A futuristic cyberpunk city at night)..."
          className="flex-1 bg-transparent border-none text-white placeholder-slate-500 px-6 py-4 focus:ring-0 focus:outline-none text-lg w-full"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isLoading) {
              handleGenerate(e);
            }
          }}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !topic.trim()}
          className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2
            ${isLoading || !topic.trim() 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-indigo-500/25 active:scale-95'
            }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              <span>Generate 2 Images</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
           {error}
        </div>
      )}

      {/* Display Section */}
      <div className="w-full min-h-[300px] transition-all duration-500">
        
        {/* Loading State */}
        {isLoading && (
          <div className="w-full aspect-video rounded-2xl glass-panel relative flex flex-col items-center justify-center gap-6">
             <div className="relative w-24 h-24">
               <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
             </div>
             <div className="text-center space-y-2">
                <p className="text-xl text-white font-medium animate-pulse">Creating your masterpieces...</p>
                <p className="text-slate-400">Generating 2 unique variations</p>
             </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && generatedImages.length === 0 && (
          <div className="w-full aspect-video rounded-2xl glass-panel relative flex items-center justify-center">
            <div className="text-center p-8 text-slate-600 flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-slate-900/50 flex items-center justify-center ring-1 ring-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
              </div>
              <p className="text-lg">Your creations will appear here</p>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && generatedImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {generatedImages.map((img, index) => (
              <div key={index} className="group relative aspect-square rounded-2xl overflow-hidden glass-panel shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
                <img 
                  src={img} 
                  alt={`${topic} variation ${index + 1}`} 
                  className="w-full h-full object-contain bg-black/50"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end pb-8 gap-4 backdrop-blur-[2px]">
                   <span className="text-white/80 text-sm font-medium tracking-wide uppercase">Variation {index + 1}</span>
                   <button 
                    onClick={() => handleDownload(img, index)}
                    className="bg-white text-slate-950 px-6 py-2.5 rounded-full font-bold hover:bg-indigo-50 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-2 shadow-lg shadow-black/25 active:scale-95"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
