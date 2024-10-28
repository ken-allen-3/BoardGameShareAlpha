import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { BoardGame } from '../types/boardgame';
import { searchGamesByImage } from '../services/boardGameService';

interface GameDetectionResultsProps {
  photoData: string;
  onClose: () => void;
  onGameSelect: (game: BoardGame) => void;
}

function GameDetectionResults({ photoData, onClose, onGameSelect }: GameDetectionResultsProps) {
  const [games, setGames] = useState<BoardGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>('Analyzing image...');

  useEffect(() => {
    loadPotentialMatches();
  }, []);

  const loadPotentialMatches = async () => {
    try {
      setProcessingStep('Analyzing image...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // UI feedback
      
      setProcessingStep('Detecting text...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStep('Matching games...');
      const results = await searchGamesByImage(photoData);
      
      if (results.length === 0) {
        setError('No games were detected. Please try taking another photo with clearer text visible.');
      } else {
        setGames(results);
      }
    } catch (err) {
      setError('Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Error</h2>
          <button onClick={onClose} className="p-2">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Select Games</h2>
        <button onClick={onClose} className="p-2">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
            <p className="text-gray-600">{processingStep}</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden mb-6">
              <img
                src={photoData}
                alt="Captured photo"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Select the games you want to add to your collection:
            </p>

            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => onGameSelect(game)}
                className="w-full bg-white border rounded-lg p-4 flex items-center gap-4 hover:bg-gray-50 transition"
              >
                <img
                  src={game.thumb_url}
                  alt={game.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">{game.name}</h3>
                  <p className="text-sm text-gray-600">
                    {game.year_published} · {game.min_players}-{game.max_players} Players
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GameDetectionResults;