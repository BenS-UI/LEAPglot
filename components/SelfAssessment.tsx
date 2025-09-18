import React from 'react';
import { SrsGrade } from '../utils/srs';
import StyledButton from './StyledButton';

interface SelfAssessmentProps {
  onGrade: (grade: SrsGrade) => void;
}

const SelfAssessment: React.FC<SelfAssessmentProps> = ({ onGrade }) => {
  return (
    <div className="flex justify-around mt-6 w-full">
      <StyledButton onClick={() => onGrade(SrsGrade.AGAIN)} className="!bg-red-600/20 !border-red-500 hover:!text-red-400 hover:!border-red-400">Again</StyledButton>
      <StyledButton onClick={() => onGrade(SrsGrade.HARD)} className="!bg-orange-500/20 !border-orange-500 hover:!text-orange-400 hover:!border-orange-400">Hard</StyledButton>
      <StyledButton onClick={() => onGrade(SrsGrade.GOOD)} className="!bg-green-600/20 !border-green-500 hover:!text-green-400 hover:!border-green-400">Good</StyledButton>
      <StyledButton onClick={() => onGrade(SrsGrade.EASY)} className="!bg-blue-500/20 !border-blue-500 hover:!text-blue-400 hover:!border-blue-400">Easy</StyledButton>
    </div>
  );
};

export default SelfAssessment;
