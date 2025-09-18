
import React, { useState } from 'react';
import { Collection, AppState, View, List } from '../types';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import FolderIcon from './icons/FolderIcon';
import ListIcon from './icons/ListIcon';
import ChevronRightSidebarIcon from './icons/ChevronRightSidebarIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import RobotIcon from './icons/RobotIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import FactoryIcon from './icons/FactoryIcon';
import { sfx } from '../utils/sfx';

interface CollectionsSidebarProps {
  collections: Collection[];
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
  appState: AppState;
}

interface CollectionItemProps {
    collection: Collection;
    level: number;
    appState: AppState;
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
    expandedCollections: Set<string>;
    toggleCollection: (id: string) => void;
    addList: (collectionId: string) => void;
    deleteCollection: (collectionId: string) => void;
    deleteList: (collectionId: string, listId: string) => void;
}

const CollectionItem: React.FC<CollectionItemProps> = ({ collection, level, appState, setAppState, expandedCollections, toggleCollection, addList, deleteCollection, deleteList }) => {
    const isExpanded = expandedCollections.has(collection.id);

    return (
        <div className="mb-1">
            <div
              className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-800/50 cursor-pointer group"
              onClick={() => toggleCollection(collection.id)}
              style={{ paddingLeft: `${8 + level * 16}px` }}
            >
                <div className="flex items-center overflow-hidden">
                    {isExpanded ? <ChevronDownIcon className="h-4 w-4 mr-2 flex-shrink-0"/> : <ChevronRightSidebarIcon className="h-4 w-4 mr-2 flex-shrink-0"/>}
                    <FolderIcon className="h-5 w-5 mr-2 text-[var(--highlight-neon)] flex-shrink-0" />
                    <span className="font-semibold truncate" title={collection.name}>{collection.name}</span>
                </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                 <button onClick={(e) => { e.stopPropagation(); sfx.playClick(); addList(collection.id); }} className="text-gray-400 hover:text-white"><PlusIcon className="h-4 w-4" /></button>
                 {level === 0 && <button onClick={(e) => { e.stopPropagation(); deleteCollection(collection.id); }} className="text-gray-400 hover:text-red-500"><TrashIcon className="h-4 w-4" /></button>}
              </div>
            </div>
            {isExpanded && (
              <div className="mt-1 border-l-2 border-zinc-800" style={{ marginLeft: `${18 + level * 16}px` }}>
                {collection.lists.map(list => {
                    const isActive = 'listId' in appState && appState.listId === list.id;
                    const handleListClick = () => {
                        sfx.playClick();
                        setAppState({ view: View.ListEditor, listId: list.id });
                    }
                    return (
                        <li key={list.id} className={`list-none group transition-all duration-200 rounded-md ${isActive ? 'bg-cyan-500/10' : 'hover:bg-zinc-800/50'}`}>
                            <div className={`flex items-center justify-between p-2`}>
                                <button onClick={handleListClick} className="flex items-center flex-grow text-left overflow-hidden">
                                    <ListIcon className={`h-5 w-5 mr-2 flex-shrink-0 transition-colors ${isActive ? 'text-[var(--highlight-neon)]' : 'text-gray-400'}`} />
                                    <span className="truncate" title={list.name}>{list.name}</span>
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); deleteList(collection.id, list.id); }} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </li>
                    )
                })}
                {collection.subCollections?.map(subCollection => (
                    <CollectionItem 
                        key={subCollection.id} 
                        collection={subCollection} 
                        level={level + 1}
                        appState={appState}
                        setAppState={setAppState}
                        expandedCollections={expandedCollections}
                        toggleCollection={toggleCollection}
                        addList={addList}
                        deleteCollection={deleteCollection}
                        deleteList={deleteList}
                    />
                ))}
              </div>
            )}
        </div>
    );
}


const CollectionsSidebar: React.FC<CollectionsSidebarProps> = ({ collections, setAppState, setCollections, appState }) => {
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleCollection = (id: string) => {
    sfx.playToggle();
    setExpandedCollections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  
  const findCollectionAndAddList = (collections: Collection[], collectionId: string, newList: List): Collection[] => {
    return collections.map(c => {
        if (c.id === collectionId) {
            return { ...c, lists: [...c.lists, newList] };
        }
        if (c.subCollections) {
            return { ...c, subCollections: findCollectionAndAddList(c.subCollections, collectionId, newList) };
        }
        return c;
    });
  };

  const addCollection = () => {
    const name = prompt("Enter new Archive name:");
    if (name) {
      const newCollection: Collection = {
        id: `collection-${Date.now()}`,
        name,
        lists: [],
      };
      setCollections(prev => [...prev, newCollection]);
      sfx.playSuccess();
    }
  };

  const addList = (collectionId: string) => {
    const name = prompt("Enter new Data Set name:");
    if (name) {
      const newList: List = {
        id: `list-${Date.now()}`,
        name,
        items: [],
      };
      setCollections(prev => findCollectionAndAddList(prev, collectionId, newList));
      sfx.playSuccess();
    }
  };

  const deleteCollection = (collectionId: string) => {
    if(window.confirm("Are you sure you want to delete this archive and all its data sets?")){
      sfx.playTrash();
      setCollections(prev => prev.filter(c => c.id !== collectionId));
      if ('listId' in appState && collections.find(c => c.id === collectionId)?.lists.some(l => l.id === appState.listId)) {
        setAppState({ view: View.GameMenu });
      }
    }
  };
  
  const findCollectionAndDeleteList = (collections: Collection[], collectionId: string, listId: string): Collection[] => {
      return collections.map(c => {
          if (c.id === collectionId) {
              return { ...c, lists: c.lists.filter(l => l.id !== listId) };
          }
          if (c.subCollections) {
              return { ...c, subCollections: findCollectionAndDeleteList(c.subCollections, collectionId, listId) };
          }
          return c;
      });
  };

  const deleteList = (collectionId: string, listId: string) => {
     if(window.confirm("Are you sure you want to delete this data set?")){
        sfx.playTrash();
        setCollections(prev => findCollectionAndDeleteList(prev, collectionId, listId));
        if ('listId' in appState && appState.listId === listId) {
            setAppState({ view: View.GameMenu });
        }
     }
  };

  const NavButton = ({ onClick, view, icon, text }: { onClick: () => void, view: View, icon: React.ReactNode, text: string }) => {
    const isActive = 'view' in appState && appState.view === view;
    const handleClick = () => {
        sfx.playClick();
        onClick();
    }
    return (
        <button
            onClick={handleClick}
            className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${isActive ? 'bg-[var(--highlight-neon)] text-black font-bold shadow-[0_0_15px_var(--highlight-neon-glow)]' : 'hover:bg-zinc-800/50'}`}
        >
            <span className={isActive ? '' : 'text-[var(--highlight-neon)]'}>{icon}</span>
            {!sidebarCollapsed && <span className="ml-3 tracking-wider">{text}</span>}
        </button>
    );
  };
  
  if (sidebarCollapsed) {
    return (
        <div className="w-20 bg-[var(--surface-glass)] backdrop-blur-lg border border-[var(--border-color)] p-4 rounded-3xl flex flex-col items-center transition-all duration-300">
             <button onClick={() => { sfx.playClick(); setSidebarCollapsed(false); }} className="p-2 text-gray-400 hover:text-white mb-6">
                 <ChevronRightSidebarIcon className="h-6 w-6" />
            </button>
            <div className="flex flex-col space-y-4">
              <NavButton onClick={() => setAppState({ view: View.AiChat })} view={View.AiChat} icon={<RobotIcon className="h-6 w-6"/>} text="Cognitive Core"/>
              <NavButton onClick={() => setAppState({ view: View.Dictionary })} view={View.Dictionary} icon={<BookOpenIcon className="h-6 w-6"/>} text="Lexicon Matrix"/>
              <NavButton onClick={() => setAppState({ view: View.ListFactory })} view={View.ListFactory} icon={<FactoryIcon className="h-6 w-6"/>} text="Synth Lab"/>
            </div>
        </div>
    )
  }

  return (
    <aside className="w-80 bg-[var(--surface-glass)] backdrop-blur-lg border border-[var(--border-color)] p-6 rounded-3xl flex flex-col h-full transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => { sfx.playClick(); setAppState({ view: View.GameMenu }); }} className="text-left">
          <h2 className="text-xl font-bold uppercase tracking-widest font-display text-zinc-500">LEAPglot</h2>
        </button>
        <button onClick={() => { sfx.playClick(); setSidebarCollapsed(true); }} className="p-1 text-gray-400 hover:text-white">
            <ChevronRightSidebarIcon className="h-6 w-6 transform rotate-180" />
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <NavButton onClick={() => setAppState({ view: View.AiChat })} view={View.AiChat} icon={<RobotIcon className="h-5 w-5"/>} text="Cognitive Core"/>
        <NavButton onClick={() => setAppState({ view: View.Dictionary })} view={View.Dictionary} icon={<BookOpenIcon className="h-5 w-5"/>} text="Lexicon Matrix"/>
        <NavButton onClick={() => setAppState({ view: View.ListFactory })} view={View.ListFactory} icon={<FactoryIcon className="h-5 w-5"/>} text="Synth Lab"/>
      </div>
      
      <h3 className="font-display text-zinc-600 mb-2">Data Archives</h3>
      <div className="flex-1 overflow-y-auto pr-2 -mr-4">
        {collections.map(collection => (
            <CollectionItem 
                key={collection.id}
                collection={collection}
                level={0}
                appState={appState}
                setAppState={setAppState}
                expandedCollections={expandedCollections}
                toggleCollection={toggleCollection}
                addList={addList}
                deleteCollection={deleteCollection}
                deleteList={deleteList}
            />
        ))}
      </div>
      <button onClick={() => { sfx.playClick(); addCollection(); }} className="mt-4 w-full flex items-center justify-center p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
        <PlusIcon className="h-5 w-5 mr-2" />
        New Archive
      </button>
    </aside>
  );
};

export default CollectionsSidebar;
