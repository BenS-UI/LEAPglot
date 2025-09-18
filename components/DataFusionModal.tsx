
import React from 'react';
import StyledButton from './StyledButton';

interface DataFusionModalProps {
    onClose: () => void;
}

const DataFusionModal: React.FC<DataFusionModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Data Fusion</h2>
                <p className="mb-6">This feature to combine lists is under construction.</p>
                <div className="flex justify-end">
                    <StyledButton onClick={onClose}>Close</StyledButton>
                </div>
            </div>
        </div>
    );
};

export default DataFusionModal;
