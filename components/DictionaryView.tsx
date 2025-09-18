import React from 'react';
import { AppState } from '../types';
import GlobalDictionary from './GlobalDictionary';

interface DictionaryViewProps {
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

const DictionaryView: React.FC<DictionaryViewProps> = ({ setAppState }) => {
    return (
        <div className="h-full w-full bg-[var(--surface-glass)] backdrop-blur-lg border border-[var(--border-color)] rounded-3xl">
            <GlobalDictionary />
        </div>
    );
};

export default DictionaryView;
