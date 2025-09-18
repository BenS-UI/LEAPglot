import React, { useState } from 'react';
import { Item } from '../types';
import StyledButton from './StyledButton';
import CloseIcon from './icons/CloseIcon';

interface BulkAddModalProps {
  onClose: () => void;
  onBulkAdd: (items: Omit<Item, 'id'>[]) => void;
}

const BulkAddModal: React.FC<BulkAddModalProps> = ({ onClose, onBulkAdd }) => {
  const [bulkText, setBulkText] = useState('');
  const [separator, setSeparator] = useState('\t'); // Default to tab

  const handleAdd = () => {
    const lines = bulkText.split('\n').filter(line => line.trim() !== '');
    const items = lines.map(line => {
      const parts = line.split(separator);
      return {
        term: parts[0]?.trim() || '',
        synonym: parts[1]?.trim() || '',
        category: parts[2]?.trim() || '',
        subtopic: parts[3]?.trim() || '',
        topic: parts[4]?.trim() || '',
        definition: parts[5]?.trim() || '',
        example: parts[6]?.trim() || '',
        question: parts[7]?.trim() || '',
        answer: parts[8]?.trim() || '',
      };
    });
    const validItems = items.filter(item => item.term);
    onBulkAdd(validItems);
  };
  
  const placeholderText = `term<sep>synonym<sep>category<sep>subtopic<sep>topic<sep>definition...
e.g.
to think<sep>to believe<sep>rationalism<sep>religion and beliefs<sep>culture<sep>to have ideas and use one's imagination...
---
Fields can be left empty:
to think<sep>-<sep>-<sep>religion and beliefs<sep>culture<sep>to have ideas...
`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 rounded-2xl p-6 w-full max-w-2xl shadow-xl flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[var(--highlight-neon)]">Batch Data Upload</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <CloseIcon className="h-6 w-6" />
            </button>
        </div>
        
        <p className="text-zinc-600 mb-1">
          Input data stream, one entry per line. Use the specified separator.
        </p>
         <p className="text-xs text-zinc-700 mb-4">
          Order: term, synonym, category, subtopic, topic, definition, example, question, answer.
        </p>

        <div className="mb-4">
          <label htmlFor="separator" className="block text-sm font-medium text-zinc-500 mb-1 uppercase tracking-wider">Separator</label>
          <select
            id="separator"
            value={separator}
            onChange={e => setSeparator(e.target.value)}
            className="w-full p-2 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-[var(--highlight-neon)] focus:ring-2 focus:ring-[var(--highlight-neon-glow)] text-white transition-all duration-300"
          >
            <option value="\t">Tab</option>
            <option value=",">Comma (,)</option>
            <option value="|">Pipe (|)</option>
            <option value=";">Semicolon (;)</option>
          </select>
        </div>

        <textarea
          className="w-full h-64 bg-zinc-950/50 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--highlight-neon)] focus:ring-2 focus:ring-[var(--highlight-neon-glow)] transition-all duration-300 font-mono"
          placeholder={placeholderText}
          value={bulkText}
          onChange={e => setBulkText(e.target.value)}
        />
        
        <div className="mt-6 flex justify-end space-x-4">
          <StyledButton onClick={onClose} className="bg-gray-600 hover:bg-gray-700">Abort</StyledButton>
          <StyledButton onClick={handleAdd}>Upload Entries</StyledButton>
        </div>
      </div>
    </div>
  );
};

export default BulkAddModal;