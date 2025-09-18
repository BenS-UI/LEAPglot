import React from 'react';

interface ListGlossaryProps {
    words: string[];
    onSelectWord: (word: string) => void;
    currentWord: string | null;
}

const ListGlossary: React.FC<ListGlossaryProps> = ({ words, onSelectWord, currentWord }) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

    const wordsByLetter: { [key: string]: string[] } = {};
    const sortedWords = [...words].sort();
    
    alphabet.forEach(letter => {
        const filteredWords = sortedWords.filter(word => word.toUpperCase().startsWith(letter));
        if (filteredWords.length > 0) {
            wordsByLetter[letter] = filteredWords;
        }
    });

    return (
        <div>
            {Object.keys(wordsByLetter).map(letter => (
                <div key={letter} className="mb-4">
                    <h3 className="text-lg font-bold text-zinc-600 border-b border-zinc-800 pb-1 mb-2 font-display">{letter}</h3>
                    <ul className="space-y-1">
                        {wordsByLetter[letter].map(word => (
                            <li key={word}>
                                <button
                                    onClick={() => onSelectWord(word)}
                                    className={`w-full text-left p-2 rounded-lg transition-colors text-sm ${currentWord === word ? 'bg-[var(--highlight-neon)] text-black font-bold' : 'hover:bg-zinc-800/50'}`}
                                >
                                    {word}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default ListGlossary;