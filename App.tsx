
import React, { useState, useCallback, useMemo } from 'react';
import { Collection, Game, View, AppState, Item, List, UserProgress, GameResult } from './types';
import { initialCollections } from './data';
import CollectionsSidebar from './components/CollectionsSidebar';
import GameMenu from './components/GameMenu';
import ListEditor from './components/ListEditor';
import FlashcardsGame from './components/FlashcardsGame';
import MatchingPairsGame from './components/MatchingPairsGame';
import SpinningWheelGame from './components/SpinningWheelGame';
import InvadersGame from './components/InvadersGame';
import SequenceMemoryGame from './components/SequenceMemoryGame';
import CategorizingGame from './components/CategorizingGame';
import LeapGame from './components/LeapGame';
import AiChatView from './components/AiChatView';
import DictionaryView from './components/DictionaryView';
import SpellingBeeGame from './components/SpellingBeeGame';
import QuizGame from './components/QuizGame';
import DataDeckGame from './components/DataDeckGame';
import ListFactoryView from './components/ListFactoryView';
import SettingsIcon from './components/icons/SettingsIcon';
import SettingsModal from './components/SettingsModal';
import OracleBallGame from './components/OracleBallGame';
import ChessGame from './components/ChessGame';

const App: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [appState, setAppState] = useState<AppState>({ view: View.GameMenu });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>([]);

  const logGameResult = useCallback((result: Omit<GameResult, 'timestamp'>) => {
    const gameResult: GameResult = { ...result, timestamp: Date.now() };
    setUserProgress(prev => [...prev, gameResult].slice(-50)); // Keep last 50 results
    console.log('Game Result Logged:', gameResult);
  }, []);

  const findListById = (collectionsToSearch: Collection[], listId: string): List | undefined => {
    for (const collection of collectionsToSearch) {
        const list = collection.lists.find(l => l.id === listId);
        if (list) return list;

        if (collection.subCollections) {
            const foundList = findListById(collection.subCollections, listId);
            if (foundList) return foundList;
        }
    }
    return undefined;
  };

  const updateListInCollections = (collectionsToSearch: Collection[], listId: string, updatedList: List): Collection[] => {
      return collectionsToSearch.map(collection => {
          const listIndex = collection.lists.findIndex(l => l.id === listId);
          if (listIndex > -1) {
              const newLists = [...collection.lists];
              newLists[listIndex] = updatedList;
              return { ...collection, lists: newLists };
          }

          if (collection.subCollections) {
              return { ...collection, subCollections: updateListInCollections(collection.subCollections, listId, updatedList) };
          }

          return collection;
      });
  };

  const updateList = useCallback((listId: string, updatedList: List) => {
      setCollections(prevCollections => updateListInCollections(prevCollections, listId, updatedList));
  }, []);

  const currentList = useMemo(() => {
    if (appState.view === View.ListEditor || appState.view === View.Game) {
      return findListById(collections, appState.listId);
    }
    return undefined;
  }, [appState, collections]);

  const renderContent = () => {
    switch (appState.view) {
      case View.GameMenu:
        return <GameMenu setAppState={setAppState} collections={collections} />;
      case View.ListEditor:
        if (currentList) {
          return <ListEditor list={currentList} setAppState={setAppState} updateList={updateList} />;
        }
        return null;
      case View.AiChat:
        return <AiChatView setAppState={setAppState} userProgress={userProgress} />;
      case View.Dictionary:
        return <DictionaryView setAppState={setAppState} />;
      case View.ListFactory:
        return <ListFactoryView setAppState={setAppState} />;
        
      case View.Game:
        if (currentList) {
          switch (appState.game) {
            case Game.Flashcards:
              return <FlashcardsGame list={currentList} setAppState={setAppState} cue={appState.cue} />;
            case Game.MatchingPairs:
              return <MatchingPairsGame list={currentList} setAppState={setAppState} cue={appState.cue} logGameResult={logGameResult} />;
            case Game.SpinningWheel:
              return <SpinningWheelGame list={currentList} setAppState={setAppState} cue={appState.cue} />;
            case Game.Invaders:
              return <InvadersGame list={currentList} setAppState={setAppState} cue={appState.cue} logGameResult={logGameResult} />;
            case Game.SequenceMemory:
              return <SequenceMemoryGame list={currentList} setAppState={setAppState} logGameResult={logGameResult} />;
            case Game.Categorizing:
              return <CategorizingGame list={currentList} setAppState={setAppState} />;
            case Game.Leap:
                return <LeapGame list={currentList} setAppState={setAppState} cue={appState.cue} logGameResult={logGameResult} />;
            case Game.SpellingBee:
              return <SpellingBeeGame list={currentList} setAppState={setAppState} logGameResult={logGameResult} />;
            case Game.Quiz:
              return <QuizGame list={currentList} setAppState={setAppState} cue={appState.cue} logGameResult={logGameResult} />;
            case Game.DataDeck:
                return <DataDeckGame list={currentList} setAppState={setAppState} cue={appState.cue} />;
            case Game.Chess:
                return <ChessGame setAppState={setAppState} />;
            case Game.OracleBall:
                return <OracleBallGame list={currentList} setAppState={setAppState} />;
            default:
              return <div>Unknown game</div>;
          }
        }
        return null;
      default:
        return <GameMenu setAppState={setAppState} collections={collections} />;
    }
  };

  return (
    <div className="relative w-screen h-screen">
      <div className="flex h-full p-4 md:p-6 lg:p-8 gap-6 font-body text-[var(--text-primary)]">
        <CollectionsSidebar collections={collections} setAppState={setAppState} setCollections={setCollections} appState={appState} />
        <main className="flex-1 overflow-hidden">
          <div className="w-full h-full">
              {renderContent()}
          </div>
        </main>
      </div>
      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="fixed bottom-4 left-4 p-3 bg-zinc-800/50 border border-zinc-700 rounded-full text-[var(--text-primary)] transition-all duration-300 hover:border-[var(--highlight-neon)] hover:text-[var(--highlight-neon)] hover:shadow-[0_0_15px_var(--highlight-neon-glow)] focus:outline-none focus:ring-2 focus:ring-[var(--highlight-neon-glow)] z-50"
        aria-label="Open Settings"
      >
        <SettingsIcon className="h-6 w-6" />
      </button>

      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
};

export default App;