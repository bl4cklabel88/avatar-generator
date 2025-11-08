
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-center">
         <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 01-6.23-.693L4.2 15.3m15.6 0-1.57.393m0 0a9.065 9.065 0 01-9.46 0m0 0l-1.57-.393M5.037 16.096A9.065 9.065 0 0112 21a9.065 9.065 0 016.963-4.904m-13.927 0a48.421 48.421 0 0113.927 0" />
            </svg>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Gemini Avatar <span className="text-indigo-400">Studio</span>
            </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
