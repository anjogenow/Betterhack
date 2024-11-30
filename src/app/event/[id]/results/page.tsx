import React from 'react';

export default function ResultsPage() {
  const topTeams = [
    { position: 1, name: "Team Alpha", prize: "5 ETH" },
    { position: 2, name: "Team Beta", prize: "3 ETH" },
    { position: 3, name: "Team Gamma", prize: "1 ETH" }
  ];

  const otherTeams = [
    { name: "Team Delta", rank: 4 },
    { name: "Team Epsilon", rank: 5 }
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 pt-20 pb-12">
      <h1 className="text-2xl font-semibold mb-8 text-primary">Results</h1>
      
      {/* Podium */}
      <div className="flex justify-center items-end gap-4 mb-8">
        {/* Silver - 2nd Place */}
        <div className="w-28 text-center">
          <div className="bg-gradient-to-b from-gray-300/30 to-gray-400/30 h-24 flex items-end justify-center rounded-t-lg border border-gray-300/30">
            <p className="mb-2 font-medium text-gray-100">{topTeams[1].name}</p>
          </div>
          <div className="bg-gray-800/50 p-2 border-x border-b border-gray-300/20">2nd - {topTeams[1].prize}</div>
        </div>
        {/* Gold - 1st Place */}
        <div className="w-28 text-center">
          <div className="bg-gradient-to-b from-yellow-500/30 to-yellow-600/30 h-28 flex items-end justify-center rounded-t-lg border border-yellow-500/30">
            <p className="mb-2 font-medium text-yellow-200">{topTeams[0].name}</p>
          </div>
          <div className="bg-gray-800/50 p-2 border-x border-b border-yellow-500/20">1st - {topTeams[0].prize}</div>
        </div>
        {/* Bronze - 3rd Place */}
        <div className="w-28 text-center">
          <div className="bg-gradient-to-b from-orange-700/30 to-orange-800/30 h-20 flex items-end justify-center rounded-t-lg border border-orange-700/30">
            <p className="mb-2 font-medium text-orange-200">{topTeams[2].name}</p>
          </div>
          <div className="bg-gray-800/50 p-2 border-x border-b border-orange-700/20">3rd - {topTeams[2].prize}</div>
        </div>
      </div>

      {/* Other Teams */}
      <div className="space-y-4">
        {otherTeams.map((team, index) => (
          <div key={index} className="group border border-border bg-card rounded-lg p-4 hover:border-blue-500/30 transition-all">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-primary group-hover:text-blue-500 transition-colors">
                {team.name}
              </h2>
              <span className="text-sm text-secondary bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700/50">
                Rank #{team.rank}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
} 