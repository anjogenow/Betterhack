'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Team {
  id: string;
  name: string;
  members: string[]; // array of wallet addresses
  eventId: string;
}

interface Event {
  id: string;
  name: string;
  description: string;
  maxParticipants: number;
  maxTeamSize: number;
  teamsLockDate: string;
  endDate: string;
  status: 'upcoming' | 'betting' | 'finished';
  creatorAddress?: string;
  createdAt?: string;
  image?: string;
  teams?: Team[];
  participantCount?: number;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Load events from localStorage
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    
    // Update event status based on dates
    const updatedEvents = storedEvents.map((event: Event) => {
      const now = new Date();
      const teamsLockDate = new Date(event.teamsLockDate);
      const endDate = new Date(event.endDate);

      // Add default image if not present
      if (!event.image) {
        event.image = '/images/default-hackathon.jpg';
      }

      if (now > endDate) {
        return { ...event, status: 'finished' };
      } else if (now > teamsLockDate) {
        return { ...event, status: 'betting' };
      }
      return { ...event, status: 'upcoming' };
    });

    // Sort events by status: upcoming -> betting -> finished
    const sortedEvents = updatedEvents.sort((a: Event, b: Event) => {
      const statusOrder = { upcoming: 0, betting: 1, finished: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

    setEvents(sortedEvents);
  }, []);

  const getActionButton = (status: string, id: string) => {
    const styles = {
      upcoming: "bg-blue-600 hover:bg-blue-700",
      betting: "bg-green-600 hover:bg-green-700",
      finished: "bg-gray-600 hover:bg-gray-700"
    };

    const paths = {
      upcoming: "teams",
      betting: "bet",
      finished: "results"
    };

    const labels = {
      upcoming: "Join Teams",
      betting: "Betting",
      finished: "Results"
    };

    return (
      <Link 
        href={`/event/${id}/${paths[status as keyof typeof paths]}`} 
        className={`block w-full py-2 text-center text-white rounded-md text-sm font-medium ${styles[status as keyof typeof styles]}`}
      >
        {labels[status as keyof typeof labels]}
      </Link>
    );
  };

  return (
    <main className="max-w-3xl mx-auto px-4 pt-20 pb-12">
      <h1 className="text-2xl font-semibold mb-8 text-primary">Hackathon Events</h1>
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="group border border-border bg-card rounded-lg overflow-hidden hover:border-blue-500/30 transition-all">
            <div className="w-full h-[100px] relative">
              <img 
                src={event.image} 
                alt={event.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-medium text-primary group-hover:text-blue-500 transition-colors">
                    {event.name}
                  </h2>
                  <p className="text-sm text-secondary mt-1">{event.description}</p>
                  {event.creatorAddress && (
                    <p className="text-xs text-secondary mt-2">
                      Created by: {event.creatorAddress.slice(0, 6)}...{event.creatorAddress.slice(-4)}
                    </p>
                  )}
                </div>
                <span className="text-xs text-secondary tabular-nums">
                  {new Date(event.endDate).toLocaleDateString('en-US', { 
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
                    <svg className="w-4 h-4 mr-1.5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {event.maxParticipants} max participants
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    max {event.maxTeamSize} per team
                  </div>
                </div>
                <div className="w-32">
                  {getActionButton(event.status, event.id)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
} 