import React from 'react';
import { DictionaryEntry } from '../types';
import VolumeUpIcon from './icons/VolumeUpIcon';
import { tts } from '../utils/tts';

interface DictionaryItemCardProps {
    entry: DictionaryEntry;
}

const DictionaryItemCard: React.FC<DictionaryItemCardProps> = ({ entry }) => {
    
    const handleSpeak = (text: string) => {
        tts.speak(text);
    };

    return (
        <div className="bg-zinc-900/50 p-6 rounded-2xl shadow-lg border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-4xl font-bold text-[var(--highlight-neon)]">{entry.word}</h2>
                <button 
                    onClick={() => handleSpeak(entry.word)} 
                    className="p-2 text-zinc-600 rounded-full hover:bg-zinc-800/50 hover:text-[var(--highlight-neon)] transition-colors"
                    aria-label={`Pronounce ${entry.word}`}
                >
                    <VolumeUpIcon className="h-7 w-7" />
                </button>
            </div>
            <p className="text-xl text-zinc-600 mb-6">{entry.phonetic}</p>

            {entry.meanings.map((meaning, index) => (
                <div key={index} className="mb-6">
                    <h3 className="text-2xl font-semibold text-indigo-400 italic mb-3 font-display tracking-wider">{meaning.partOfSpeech}</h3>
                    <ul className="space-y-4 pl-5 list-disc list-outside text-zinc-500">
                        {meaning.definitions.map((def, defIndex) => (
                            <li key={defIndex}>
                                <p className="text-lg">{def.definition}</p>
                                {def.example && (
                                    <p className="text-zinc-700 italic mt-1 text-base">"{def.example}"</p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default DictionaryItemCard;