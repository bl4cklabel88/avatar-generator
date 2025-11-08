
import React, { useState } from 'react';
import Generator from './components/Generator';
import Editor from './components/Editor';
import Header from './components/Header';

type Mode = 'generate' | 'edit';

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>('generate');

  const activeTabClass = "bg-indigo-600 text-white";
  const inactiveTabClass = "bg-gray-800 text-gray-300 hover:bg-gray-700";

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8 border-b border-gray-700">
            <button
              onClick={() => setMode('generate')}
              className={`px-6 py-3 font-semibold rounded-t-lg transition-colors duration-200 ${mode === 'generate' ? activeTabClass : inactiveTabClass}`}
            >
              Generate Avatar
            </button>
            <button
              onClick={() => setMode('edit')}
              className={`px-6 py-3 font-semibold rounded-t-lg transition-colors duration-200 ${mode === 'edit' ? activeTabClass : inactiveTabClass}`}
            >
              Edit Image
            </button>
          </div>

          {mode === 'generate' ? <Generator /> : <Editor />}
        </div>
      </main>
    </div>
  );
}

export default App;
