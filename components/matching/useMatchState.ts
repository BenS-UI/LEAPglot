
import { useState, useCallback } from 'react';
import { Item } from '../../types';

export type CardData = {
  id: string;
  itemId: string;
  content: string;
  type: 'term' | 'definition';
};

export const useMatchState = (listItems: Item[], cue: keyof Item) => {
    const [cards, setCards] = useState<CardData[]>([]);
    const [flippedCards, setFlippedCards] = useState<string[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
    const [moves, setMoves] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const setupGame = useCallback((numPairs: number): string[] => {
        const validItems = listItems.filter(item => item[cue]);
        const selectedItems = [...validItems].sort(() => 0.5 - Math.random()).slice(0, numPairs);
        
        const termCards: CardData[] = selectedItems.map(item => ({ id: `${item.id}-term`, itemId: item.id, content: item.term, type: 'term' }));
        const cueCards: CardData[] = selectedItems.map(item => ({ id: `${item.id}-cue`, itemId: item.id, content: String(item[cue] ?? 'N/A'), type: 'definition' }));
        
        setCards([...termCards, ...cueCards].sort(() => 0.5 - Math.random()));
        setFlippedCards([]);
        setMatchedPairs([]);
        setMoves(0);
        setIsFinished(false);
        return selectedItems.map(item => item.id);
    }, [listItems, cue]);

    const onCardClick = (cardId: string) => {
        const card = cards.find(c => c.id === cardId);
        if (!card || flippedCards.length === 2 || flippedCards.includes(cardId) || matchedPairs.includes(card.itemId)) {
            return;
        }
        setFlippedCards(prev => [...prev, cardId]);
    };

    const checkMatch = useCallback((): boolean | null => {
        if (flippedCards.length !== 2) return null;

        setMoves(m => m + 1);
        const [firstCardId, secondCardId] = flippedCards;
        const firstCard = cards.find(c => c.id === firstCardId);
        const secondCard = cards.find(c => c.id === secondCardId);

        if (firstCard && secondCard && firstCard.itemId === secondCard.itemId) {
            setMatchedPairs(prev => [...prev, firstCard.itemId]);
            setFlippedCards([]);
            return true;
        } else {
            setTimeout(() => setFlippedCards([]), 2000); // Increased delay
            return false;
        }
    }, [flippedCards, cards]);

    const checkForWin = useCallback(() => {
        if (cards.length > 0 && matchedPairs.length === cards.length / 2) {
            setIsFinished(true);
        }
    }, [cards, matchedPairs]);

    return {
        cards,
        flippedCards,
        matchedPairs,
        moves,
        isFinished,
        setupGame,
        onCardClick,
        checkMatch,
        checkForWin,
    };
};
