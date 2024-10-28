import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Camera, Bell } from 'lucide-react';

function Home() {
  const [lastCommitDate, setLastCommitDate] = useState<string | null>(null);

  useEffect(() => {
    fetch('/lastCommitDate.json')
      .then(response => response.json())
      .then(data => setLastCommitDate(data.lastCommitDate))
      .catch(error => console.error('Error fetching last commit date:', error));
  }, []);

  return (
    <div>
      <div className="text-sm text-gray-500 text-center mb-4">
        Last updated: {lastCommitDate ? new Date(lastCommitDate).toLocaleString() : 'Loading...'}
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Share Your Board Game Collection
        </h1>
        <p className="text-lg text-gray-600">
          Connect with friends, share your games, and discover new favorites
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-md p-4 transform transition hover:scale-105">
          <Users className="h-10 w-10 text-indigo-600 mb-3" />
          <h2 className="text-lg font-semibold mb-2">Private Group Access</h2>
          <p className="text-sm text-gray-600">
            Join an exclusive group of friends to share and borrow games safely
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 transform transition hover:scale-105">
          <Camera className="h-10 w-10 text-indigo-600 mb-3" />
          <h2 className="text-lg font-semibold mb-2">Capture Moments</h2>
          <p className="text-sm text-gray-600">
            Share photos of your game nights and memorable moments
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;