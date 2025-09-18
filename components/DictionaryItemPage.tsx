
import React from 'react';
import { DictionaryEntry } from '../types';
import DictionaryItemCard from './DictionaryItemCard';
import StyledButton from './StyledButton';

interface DictionaryItemPageProps {
  entry: DictionaryEntry | null;
  onBack: () => void;
}

const DictionaryItemPage: React.FC<DictionaryItemPageProps> = ({ entry, onBack }) => {
  return (
    <div className="p-4 md:p-6">
      <StyledButton onClick={onBack} className="mb-6">
        &larr; Back to Dictionary
      </StyledButton>
      {entry ? (
        <DictionaryItemCard entry={entry} />
      ) : (
        <div className="text-center text-gray-400">
          <h2 className="text-2xl">Word not found</h2>
          <p>The requested word could not be found in the dictionary.</p>
        </div>
      )}
    </div>
  );
};

export default DictionaryItemPage;
