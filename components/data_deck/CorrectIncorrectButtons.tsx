import React from 'react';
import StyledButton from '../StyledButton';
import CheckIcon from '../icons/CheckIcon';
import XIcon from '../icons/XIcon';

interface CorrectIncorrectButtonsProps {
  onAssess: (correct: boolean) => void;
}

const CorrectIncorrectButtons: React.FC<CorrectIncorrectButtonsProps> = ({ onAssess }) => {
  return (
    <div className="flex space-x-8">
      <StyledButton
        onClick={() => onAssess(false)}
        className="!bg-red-600/20 !border-red-500 hover:!text-red-400 hover:!border-red-400 !p-4 !rounded-full"
        aria-label="Incorrect"
      >
        <XIcon className="h-8 w-8" />
      </StyledButton>
      <StyledButton
        onClick={() => onAssess(true)}
        className="!bg-green-600/20 !border-green-500 hover:!text-green-400 hover:!border-green-400 !p-4 !rounded-full"
        aria-label="Correct"
      >
        <CheckIcon className="h-8 w-8" />
      </StyledButton>
    </div>
  );
};

export default CorrectIncorrectButtons;
