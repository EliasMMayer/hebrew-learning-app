"use client";

import { useState } from 'react';

export default function Home() {
  const [showHebrew, setShowHebrew] = useState(false);
  
  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Hebrew Practice</h1>
      
      <div className="border p-4 rounded-lg shadow-sm">
        <p className="text-xl mb-4">
          {showHebrew ? 'אני רוצה גלידה' : 'I want ice cream'}
        </p>
        
        <button 
          onClick={() => setShowHebrew(!showHebrew)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {showHebrew ? 'Show English' : 'Show Hebrew'}
        </button>
      </div>
    </main>
  );
}
