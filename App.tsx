import React from 'react';
import ImageGenerator from './components/ImageGenerator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-950">
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
              ImaginAI
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
              Transform your words into stunning visuals. Enter a topic below and let our AI generate the artwork for you.
            </p>
          </header>

          <ImageGenerator />
        </div>
        
        <footer className="mt-16 text-slate-600 text-sm">
          Powered by Google Gemini 2.5 Flash Image
        </footer>
      </main>
    </div>
  );
};

export default App;