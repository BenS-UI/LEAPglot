import React, { useState, useMemo } from 'react';
import { fullDictionary } from '../data/dawn';
import ListGlossary from './ListGlossary';
import DictionaryItemCard from './DictionaryItemCard';
import { DictionaryEntry } from '../types';
import SearchIcon from './icons/SearchIcon';
import StyledInput from './StyledInput';

const GlobalDictionary: React.FC = () => {
    const [selectedWord, setSelectedWord] = useState<string | null>("hello");
    const [searchTerm, setSearchTerm] = useState('');

    const wordList = useMemo(() => Object.keys(fullDictionary).sort(), []);
    
    const filteredWordList = useMemo(() => {
        if (!searchTerm) return wordList;
        return wordList.filter(word => word.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, wordList]);

    const selectedEntry = useMemo(() => {
        if (!selectedWord) return null;
        const entryData = fullDictionary[selectedWord as keyof typeof fullDictionary];
        if(!entryData) return null;
        return {
            id: selectedWord,
            word: selectedWord,
            phonetic: entryData.phonetic || '',
            meanings: entryData.meanings || []
        } as DictionaryEntry;
    }, [selectedWord]);

    return (
        <div className="flex h-full rounded-3xl overflow-hidden">
            <div className="w-72 bg-zinc-950/30 p-4 flex-shrink-0 h-full flex flex-col border-r border-[var(--border-color)]">
                <h2 className="text-2xl font-bold mb-4 text-zinc-500 uppercase tracking-widest text-center">Lexicon</h2>
                <div className="relative mb-4">
                    <StyledInput
                        type="text"
                        placeholder="Search term..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1 overflow-y-auto -mr-2 pr-2">
                    <ListGlossary words={filteredWordList} onSelectWord={setSelectedWord} currentWord={selectedWord} />
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                {selectedEntry ? (
                    <DictionaryItemCard entry={selectedEntry} />
                ) : (
                    <div className="flex items-center justify-center h-full text-zinc-700">
                        <p className="text-2xl font-display">// SELECT A TERM TO DISPLAY DATA //</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlobalDictionary;