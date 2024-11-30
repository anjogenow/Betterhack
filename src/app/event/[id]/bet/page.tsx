'use client';
import React, { useState } from 'react';

export default function BetPage() {
  const [timeLeft, setTimeLeft] = useState('2:00:00');
  const mockTeams = [
    {
      title: "Team Alpha",
      description: "Building a DeFi solution",
      participants: ["Alice", "Bob", "Charlie"],
      bets: "1.5 ETH"
    },
    {
      title: "Team Beta",
      description: "Creating an NFT marketplace",
      participants: ["David", "Eve", "Frank"],
      bets: "2.3 ETH"
    }
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 pt-20 pb-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-primary">Place Your Bets</h1>
        <div className="text-sm text-secondary bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700/50">
          Event finishes in: {timeLeft}
        </div>
      </div>
      <div className="space-y-4">
        {mockTeams.map((team, index) => (
          <div key={index} className="group border border-border bg-card rounded-lg p-4 hover:border-blue-500/30 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-lg font-medium text-primary group-hover:text-blue-500 transition-colors">
                  {team.title}
                </h2>
                <p className="text-sm text-secondary mt-1">{team.description}</p>
              </div>
              <div className="text-sm text-secondary bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700/50">
                Total Bets: {team.bets}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {team.participants.map((participant, i) => (
                  <span key={i} className="text-sm bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full border border-gray-700/50">
                    {participant}
                  </span>
                ))}
              </div>
              <button className="px-4 py-2 bg-green-500/20 text-green-400 rounded-md hover:bg-green-500/30 transition-all text-sm">
                Place Bet
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-6 w-full py-2 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-all text-sm">
        View My Bets
      </button>
    </main>
  );
} 