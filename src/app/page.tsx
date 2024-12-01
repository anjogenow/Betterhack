'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import UserLink from '@/components/UserLink';
import { useAccount } from '@starknet-react/core';

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
  const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({});
  const { address } = useAccount();

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

  useEffect(() => {
    const calculateTimeLeft = () => {
      const newCountdowns: { [key: string]: string } = {};
      
      events.forEach(event => {
        if (event.status === 'betting') {
          const now = new Date().getTime();
          const endTime = new Date(event.endDate).getTime();
          const difference = endTime - now;

          if (difference <= 0) {
            newCountdowns[event.id] = 'Ended';
            return;
          }

          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          let timeString = '';
          if (days > 0) timeString += `${days}d `;
          if (hours > 0 || days > 0) timeString += `${hours}h `;
          if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes}m `;
          timeString += `${seconds}s`;

          newCountdowns[event.id] = timeString;
        }
      });

      setCountdowns(newCountdowns);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [events]);

  const getActionButton = (status: string, id: string, creatorAddress?: string) => {
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
      upcoming: address === creatorAddress ? "Manage Event" : "Join Teams",
      betting: address === creatorAddress ? "Manage Event" : "Betting",
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
                      Created by: <UserLink address={event.creatorAddress} />
                    </p>
                  )}
                </div>
                <span className="text-xs text-secondary tabular-nums">
                  {event.status === 'betting' ? (
                    <div className="px-3 py-1.5 bg-card border border-border rounded-full">
                      <span className="text-primary font-medium">Ends in: </span>
                      {countdowns[event.id]}
                    </div>
                  ) : event.status === 'upcoming' ? (
                    <>
                      <span className="text-primary font-medium">Teams lock: </span>
                      {new Date(event.teamsLockDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </>
                  ) : (
                    <>
                      <span className="text-primary font-medium">Event ended: </span>
                      {new Date(event.endDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-secondary">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {(event.teams || []).reduce((sum, team) => sum + team.members.length, 0)}/{event.maxParticipants} participants
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {event.maxTeamSize >= event.maxParticipants ? 'No limit' : `max ${event.maxTeamSize} per team`}
                  </div>
                </div>
                <div className="w-32">
                  {getActionButton(event.status, event.id, event.creatorAddress)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
} 