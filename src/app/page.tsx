import React from 'react';
import Link from 'next/link';

export default function Home() {
  const mockEvents = [
    {
      id: 1,
      title: "Web3 Innovation Hackathon",
      description: "Build the future of decentralized applications",
      deadline: new Date("2024-04-01"),
      status: "upcoming",
      prizePool: 5,
      participants: 24
    },
    {
      id: 2,
      title: "AI & Blockchain Hackathon",
      description: "Combine AI with blockchain technology",
      deadline: new Date("2024-03-15"),
      status: "betting",
      prizePool: 3,
      participants: 18
    },
    {
      id: 3,
      title: "GameFi Challenge",
      description: "Create the next generation of blockchain games",
      deadline: new Date("2024-02-01"),
      status: "finished",
      prizePool: 8,
      participants: 32
    }
  ];

  const getActionButton = (status: string, id: number) => {
    const styles = {
      upcoming: "bg-blue-600 hover:bg-blue-700",
      betting: "bg-green-600 hover:bg-green-700",
      finished: "bg-gray-600 hover:bg-gray-700"
    };

    const paths = {
      upcoming: "participate",
      betting: "bet",
      finished: "results"
    };

    return (
      <Link 
        href={`/event/${id}/${paths[status as keyof typeof paths]}`} 
        className={`block w-full py-2 text-center text-white rounded-md text-sm font-medium ${styles[status as keyof typeof styles]}`}
      >
        {status === 'upcoming' ? 'Join Hackathon' : status.charAt(0).toUpperCase() + status.slice(1)}
      </Link>
    );
  };

  return (
    <main className="max-w-3xl mx-auto px-4 pt-20 pb-12">
      <h1 className="text-2xl font-semibold mb-8 text-primary">Upcoming Hackathons</h1>
      <div className="space-y-4">
        {mockEvents.map((event) => (
          <div key={event.id} className="group border border-border bg-card rounded-lg p-4 hover:border-blue-500/30 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-lg font-medium text-primary group-hover:text-blue-500 transition-colors">
                  {event.title}
                </h2>
                <p className="text-sm text-secondary mt-1">{event.description}</p>
              </div>
              <span className="text-xs text-secondary tabular-nums">
                {event.deadline.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-secondary">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {event.participants} participants
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {event.prizePool} ETH pool
                </div>
              </div>
              <div className="w-32">
                {getActionButton(event.status, event.id)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
} 