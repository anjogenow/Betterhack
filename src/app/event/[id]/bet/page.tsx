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
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [displayedBets, setDisplayedBets] = useState(0);
  const TOTAL_BETS = 4242; // Default total bets in STRK
  const ANIMATION_DURATION = 2000; // 2 seconds for the animation

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!event) return;

      const now = new Date().getTime();
      const endTime = new Date(event.endDate).getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        router.push(`/event/${id}/results`);
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

      setTimeLeft(timeString);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [event, id, router]);

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

  useEffect(() => {
    if (!event) return;

    // Animate the total bets counter
    const startTime = Date.now();
    const updateCounter = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(TOTAL_BETS * easeOutQuart);
      
      setDisplayedBets(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [event]);

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
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2 text-primary">{event.name}</h1>
          <p className="text-sm text-secondary">{event.description}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-secondary mb-1 mr-1">Total Bets</p>
          <div className="px-4 py-2 bg-card border border-border rounded-lg">
            <p className="text-xl font-semibold text-primary whitespace-nowrap">
              {displayedBets.toLocaleString()} STRK
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-primary">Teams</h2>
          <div className="px-3 py-1.5 bg-card border border-border rounded-full text-sm text-secondary">
            <span className="text-primary font-medium">Event ends in: </span>
            {timeLeft}
          </div>
        </div>
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