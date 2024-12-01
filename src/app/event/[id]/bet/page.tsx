'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from '@starknet-react/core';
import BetModal from '@/components/BetModal';

interface Team {
  id: string;
  name: string;
  description: string;
  members: string[];
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
  teams?: Team[];
}

export default function BetPage() {
  const { id } = useParams();
  const router = useRouter();
  const { address } = useAccount();
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);

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

      // Redirect if not in betting phase
      if (status !== 'betting') {
        router.push(`/event/${id}/${status === 'upcoming' ? 'teams' : 'results'}`);
      }
    }
  }, [id, router]);

  const handlePlaceBet = (amount: number) => {
    if (!event || !selectedTeam || !address) return;

    // TODO: Implement actual betting logic
    console.log('Placing bet:', {
      eventId: event.id,
      teamId: selectedTeam.id,
      bettor: address,
      amount
    });

    setIsBetModalOpen(false);
    setSelectedTeam(null);
  };

  if (!event) return <div className="p-4">Loading...</div>;

  return (
    <main className="max-w-3xl mx-auto px-4 pt-20 pb-12">
      <h1 className="text-2xl font-semibold mb-2 text-primary">{event.name}</h1>
      <p className="text-sm text-secondary mb-8">{event.description}</p>

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-primary">Teams</h2>
        {event.teams?.map(team => (
          <div key={team.id} className="border border-border rounded-lg p-4 bg-card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-primary">{team.name}</h3>
                <p className="text-sm text-secondary mt-1">
                  Members: {team.members.length}
                </p>
                <p className="text-sm text-secondary mt-2">{team.description}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedTeam(team);
                  setIsBetModalOpen(true);
                }}
                className="px-4 py-2 bg-green-500/20 text-green-400 rounded-md hover:bg-green-500/30 transition-all text-sm"
              >
                Place Bet
              </button>
            </div>
            <div className="space-y-1 mt-3 pt-3 border-t border-border">
              {team.members.map(member => (
                <p key={member} className="text-sm text-secondary">
                  <span className="px-2 py-1 bg-gray-500/10 rounded-md">
                    {member.slice(0, 6)}...{member.slice(-4)}
                  </span>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedTeam && (
        <BetModal
          isOpen={isBetModalOpen}
          onClose={() => {
            setIsBetModalOpen(false);
            setSelectedTeam(null);
          }}
          onSubmit={handlePlaceBet}
          teamName={selectedTeam.name}
        />
      )}
    </main>
  );
} 