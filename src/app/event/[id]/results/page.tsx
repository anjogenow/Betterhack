'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from '@starknet-react/core';
import RankingModal from '@/components/RankingModal';

interface Team {
  id: string;
  name: string;
  description: string;
  members: string[];
  eventId: string;
  rank?: number;
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
  teams?: Team[];
  rankings?: Team[];
}

export default function ResultsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { address } = useAccount();
  const [event, setEvent] = useState<Event | null>(null);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);

  useEffect(() => {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const currentEvent = events.find((e: Event) => e.id === id);
    if (currentEvent) {
      // Update event status based on dates
      const now = new Date();
      const teamsLockDate = new Date(currentEvent.teamsLockDate);
      const endDate = new Date(currentEvent.endDate);

      let status = 'upcoming';
      if (now > endDate) {
        status = 'finished';
      } else if (now > teamsLockDate) {
        status = 'betting';
      }

      const updatedEvent = { ...currentEvent, status };
      setEvent(updatedEvent);

      // Redirect if not finished
      if (status !== 'finished') {
        router.push(`/event/${id}/${status === 'upcoming' ? 'teams' : 'bet'}`);
      }
    }
  }, [id, router]);

  const handleRankingSubmit = (rankedTeams: Team[]) => {
    if (!event) return;

    // Update event with rankings and change status to results
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const updatedEvents = events.map((e: Event) => {
      if (e.id === event.id) {
        return {
          ...e,
          rankings: rankedTeams,
          status: 'finished'
        };
      }
      return e;
    });

    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setEvent(prev => prev ? {
      ...prev,
      rankings: rankedTeams,
      status: 'finished'
    } : null);
    setIsRankingModalOpen(false);

    // TODO: Trigger payout distribution
  };

  if (!event) return <div className="p-4">Loading...</div>;

  const isOrganizer = address && event.creatorAddress === address;
  const canSetRankings = isOrganizer && !event.rankings;

  return (
    <main className="max-w-3xl mx-auto px-4 pt-20 pb-12">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2 text-primary">{event.name}</h1>
          <p className="text-sm text-secondary">{event.description}</p>
        </div>
        {canSetRankings && (
          <button
            onClick={() => setIsRankingModalOpen(true)}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-all text-sm"
          >
            Set Rankings
          </button>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-primary">
          {event.rankings ? 'Final Rankings' : 'Awaiting Results'}
        </h2>
        {event.rankings ? (
          event.rankings.map((team, index) => (
            <div key={team.id} className="border border-border rounded-lg p-4 bg-card">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-500/10 text-blue-400 rounded-full font-medium">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium text-primary">{team.name}</h3>
                  <p className="text-sm text-secondary mt-1">{team.description}</p>
                  <div className="mt-3 space-y-1">
                    {team.members.map(member => (
                      <p key={member} className="text-sm text-secondary">
                        <span className="px-2 py-1 bg-gray-500/10 rounded-md">
                          {member.slice(0, 6)}...{member.slice(-4)}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-secondary text-sm">
            {isOrganizer 
              ? 'As the event organizer, you can set the final rankings.'
              : 'The event organizer will set the final rankings soon.'}
          </p>
        )}
      </div>

      {event.teams && (
        <RankingModal
          isOpen={isRankingModalOpen}
          onClose={() => setIsRankingModalOpen(false)}
          onSubmit={handleRankingSubmit}
          teams={event.teams}
        />
      )}
    </main>
  );
} 