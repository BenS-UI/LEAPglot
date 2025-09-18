
import React, { useState } from 'react';
import { AppState, View } from '../types';
import StyledButton from './StyledButton';
import StyledInput from './StyledInput';
import { GoogleGenAI, Type } from "@google/genai";

interface GeneratedItem {
  term: string;
  definition: string;
}

const ListFactoryView: React.FC<{ setAppState: React.Dispatch<React.SetStateAction<AppState>> }> = ({ setAppState }) => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState('Zenith');
  const [generatedList, setGeneratedList] = useState<GeneratedItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listName, setListName] = useState('');

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedList(null);

    const prompt = `Generate a list of ${count} vocabulary words related to the topic of "${topic}". The difficulty level should be ${difficulty}. For each word, provide a clear and concise definition.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              listName: {
                type: Type.STRING,
                description: 'A creative and relevant name for the generated list.'
              },
              items: {
                type: Type.ARRAY,
                description: 'The array of generated vocabulary words and their definitions.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    term: {
                      type: Type.STRING,
                      description: 'The vocabulary word.'
                    },
                    definition: {
                      type: Type.STRING,
                      description: 'The definition of the word.'
                    }
                  }
                }
              }
            }
          }
        }
      });
      
      const jsonResponse = JSON.parse(response.text);
      setGeneratedList(jsonResponse.items);
      setListName(jsonResponse.listName);

    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred while generating the list.';
        setError(`// ERROR: ${errorMessage}`);
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleSaveList = () => {
    // This is where you would integrate with the main app state to save the new list.
    console.log("Saving list:", { name: listName, items: generatedList });
    alert(`Data set "${listName}" committed to memory! (See console for data)`);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--surface-glass)] backdrop-blur-lg border border-[var(--border-color)] rounded-3xl p-6 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6 text-zinc-500 uppercase tracking-widest font-display">Synth Lab</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-zinc-950/30 rounded-2xl border border-zinc-900">
        <div>
          <label className="block text-lg mb-2 uppercase tracking-wider">Topic</label>
          <StyledInput value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., Cybernetics, Quantum Physics" />
        </div>
        <div>
          <label className="block text-lg mb-2 uppercase tracking-wider">Difficulty</label>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full p-3 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-[var(--highlight-neon)] focus:ring-2 focus:ring-[var(--highlight-neon-glow)] text-white transition-all duration-300">
            <option>Dawn</option>
            <option>Rise</option>
            <option>Zenith</option>
            <option>Sundown</option>
            <option>Twilight</option>
            <option>Midnight</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-lg mb-2 uppercase tracking-wider">Data Points: {count}</label>
          <input type="range" min="5" max="50" value={count} onChange={e => setCount(Number(e.target.value))} className="w-full accent-[var(--highlight-neon)]"/>
        </div>
      </div>
      <StyledButton onClick={handleGenerate} disabled={isLoading} className="w-full md:w-auto self-center">
        {isLoading ? 'Synthesizing...' : 'Synthesize Data Set'}
      </StyledButton>

      {error && <div className="mt-6 p-4 bg-red-900/50 text-red-400 rounded-lg">{error}</div>}

      {generatedList && (
        <div className="mt-8 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{listName}</h2>
                <StyledButton onClick={handleSaveList}>Commit to Archive</StyledButton>
            </div>
            <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800 flex-1 overflow-y-auto">
                <ul className="space-y-3">
                    {generatedList.map((item, index) => (
                        <li key={index} className="p-3 bg-zinc-900/70 rounded-xl">
                            <p className="font-bold text-[var(--highlight-neon)]">{item.term}</p>
                            <p className="text-zinc-600 mt-1">{item.definition}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      )}
    </div>
  );
};

export default ListFactoryView;