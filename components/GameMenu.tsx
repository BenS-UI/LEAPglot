
import React, { useState, useMemo } from 'react';
import { Collection, Game, AppState, View, Item, List } from '../types';
import StyledButton from './StyledButton';
import FlashcardsIcon from './icons/FlashcardsIcon';
import WheelIcon from './icons/WheelIcon';
import InvadersIcon from './icons/InvadersIcon';
import MatchIcon from './icons/MatchIcon';
import SortIcon from './icons/SortIcon';
import SequenceIcon from './icons/SequenceIcon';
import LeapGameIcon from './icons/LeapGameIcon';
import SpellingBeeIcon from './icons/SpellingBeeIcon';
import QuizIcon from './icons/QuizIcon';
import LeapIcon from './icons/LeapIcon';
import OracleBallIcon from './icons/OracleBallIcon';
import ChessIcon from './icons/ChessIcon';
import { sfx } from '../utils/sfx';

interface GameMenuProps {
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  collections: Collection[];
}

const gameOptions = [
  { game: Game.Leap, icon: LeapGameIcon },
  { game: Game.Flashcards, icon: FlashcardsIcon },
  { game: 'Data Deck' as Game, icon: LeapIcon },
  { game: Game.MatchingPairs, icon: MatchIcon },
  { game: Game.Quiz, icon: QuizIcon },
  { game: Game.SpellingBee, icon: SpellingBeeIcon },
  { game: Game.Invaders, icon: InvadersIcon },
  { game: Game.SequenceMemory, icon: SequenceIcon },
  { game: Game.SpinningWheel, icon: WheelIcon },
  { game: Game.Chess, icon: ChessIcon },
  { game: Game.OracleBall, icon: OracleBallIcon },
  { game: Game.Categorizing, icon: SortIcon },
];

const cueOptions: { value: keyof Item; label: string }[] = [
    { value: 'definition', label: 'Definition' },
    { value: 'synonym', label: 'Synonym' },
    { value: 'category', label: 'Category' },
    { value: 'subtopic', label: 'Subtopic' },
    { value: 'example', label: 'Example' },
    { value: 'question', label: 'Question' },
];

const GameMenu: React.FC<GameMenuProps> = ({ setAppState, collections }) => {
  const [selectedCollectionName, setSelectedCollectionName] = useState<string | null>(null);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedCue, setSelectedCue] = useState<keyof Item>('definition');
  
  const rootCollections = useMemo(() => collections.filter(c => !c.name.includes(' - ')), [collections]);
  
  const selectedRootCollection = useMemo(() => {
    return collections.find(c => c.name === selectedCollectionName);
  }, [selectedCollectionName, collections]);


  const startGame = (game: Game) => {
    if (selectedListId) {
      setAppState({ view: View.Game, listId: selectedListId, game, cue: selectedCue });
    } else {
      sfx.playError();
      alert('// PROTOCOL: ERROR - DATA SET NOT SELECTED. PLEASE SELECT A DATA SET TO ENGAGE SIMULATION. //');
    }
  };
  
  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      sfx.playToggle();
      setSelectedCollectionName(e.target.value);
      setSelectedListId(null);
  }

  const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    sfx.playToggle();
    setSelectedListId(e.target.value);
  }

  const handleCueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    sfx.playToggle();
    setSelectedCue(e.target.value as keyof Item);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-white p-4 scanlines-overlay bg-zinc-900/20 rounded-3xl">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-500 drop-shadow-[0_0_10px_var(--highlight-neon-glow)]">
        Simulation Deck
      </h1>
      
      <div className="w-full max-w-xl mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
            <label htmlFor="collection-select" className="block mb-2 text-sm font-medium text-gray-300 uppercase tracking-widest">Select Level:</label>
            <select
              id="collection-select"
              value={selectedCollectionName || ''}
              onChange={handleCollectionChange}
              className="w-full p-3 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-[var(--highlight-neon)] focus:ring-2 focus:ring-[var(--highlight-neon-glow)] text-white transition-all duration-300"
            >
              <option value="" disabled>--SELECT--</option>
              {rootCollections.map(collection => (
                <option key={collection.id} value={collection.name}>
                  {collection.name}
                </option>
              ))}
            </select>
        </div>
        <div>
            <label htmlFor="list-select" className="block mb-2 text-sm font-medium text-gray-300 uppercase tracking-widest">Select Data Set:</label>
            <select
              id="list-select"
              value={selectedListId || ''}
              onChange={handleListChange}
              disabled={!selectedCollectionName}
              className="w-full p-3 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-[var(--highlight-neon)] focus:ring-2 focus:ring-[var(--highlight-neon-glow)] text-white transition-all duration-300 disabled:opacity-50"
            >
              <option value="" disabled>--SELECT--</option>
              {selectedRootCollection && (
                  <>
                      {selectedRootCollection.lists.map(list => (
                          <option key={list.id} value={list.id}>{list.name}</option>
                      ))}
                      {selectedRootCollection.subCollections?.map(subCollection => (
                          <optgroup key={subCollection.id} label={subCollection.name}>
                              {subCollection.lists.map(list => (
                                  <option key={list.id} value={list.id}>{list.name}</option>
                              ))}
                          </optgroup>
                      ))}
                  </>
              )}
            </select>
        </div>
         <div>
            <label htmlFor="cue-select" className="block mb-2 text-sm font-medium text-gray-300 uppercase tracking-widest">Select Cue:</label>
            <select
              id="cue-select"
              value={selectedCue}
              onChange={handleCueChange}
              className="w-full p-3 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-[var(--highlight-neon)] focus:ring-2 focus:ring-[var(--highlight-neon-glow)] text-white transition-all duration-300"
            >
                {cueOptions.map(opt => (
                     <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {gameOptions.map(({ game, icon: Icon }) => (
          <button
            key={game}
            onClick={() => {
              sfx.playEnter();
              startGame(game);
            }}
            disabled={!selectedListId}
            className="flex flex-col items-center justify-center p-6 bg-zinc-900/70 border border-zinc-800 rounded-2xl shadow-lg hover:bg-zinc-800/70 hover:-translate-y-1 transform transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 group"
          >
            <Icon className="h-16 w-16 mb-4 text-zinc-600 group-hover:text-[var(--highlight-neon)] transition-colors duration-300 group-disabled:text-zinc-600" />
            <span className="text-sm md:text-base font-semibold text-center uppercase tracking-wider text-zinc-500 group-hover:text-[var(--highlight-neon)] transition-colors duration-300 group-disabled:text-zinc-500">{game}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameMenu;