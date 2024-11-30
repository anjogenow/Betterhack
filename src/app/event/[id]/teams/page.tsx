'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount } from '@starknet-react/core';
import { v4 as uuidv4 } from 'uuid';

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
  maxParticipants: number;
  maxTeamSize: number;
  teams?: Team[];
  participantCount?: number;
}

export default function TeamsPage() {
  const { id } = useParams();
  const { address } = useAccount();
  const [event, setEvent] = useState<Event | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const currentEvent = events.find((e: Event) => e.id === id);
    if (currentEvent) {
      setEvent(currentEvent);
      setTeams(currentEvent.teams || []);
    }
  }, [id]);

  const getUserTeam = () => {
    return teams.find(team => team.members.includes(address || ''));
  };

  const handleCreateTeam = () => {
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }

    if (!newTeamName.trim()) {
      setError('Please enter a team name');
      return;
    }

    if (!newTeamDescription.trim()) {
      setError('Please enter a team description');
      return;
    }

    const currentTeam = getUserTeam();
    if (currentTeam) {
      handleLeaveTeam(currentTeam.id);
    }

    const participantCount = teams.reduce((count, team) => count + team.members.length, 0);
    if (event && participantCount >= event.maxParticipants) {
      setError('Event has reached maximum participants');
      return;
    }

    const newTeam: Team = {
      id: uuidv4(),
      name: newTeamName,
      description: newTeamDescription,
      members: [address],
      eventId: id as string
    };

    const updatedTeams = [...teams, newTeam];
    updateTeamsInStorage(updatedTeams);
    setNewTeamName('');
    setNewTeamDescription('');
  };

  const handleJoinTeam = (teamId: string) => {
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }

    const targetTeam = teams.find(t => t.id === teamId);
    if (!targetTeam) return;

    if (targetTeam.members.length >= (event?.maxTeamSize || 1)) {
      setError('Team is full');
      return;
    }

    const participantCount = teams.reduce((count, team) => count + team.members.length, 0);
    if (event && participantCount >= event.maxParticipants) {
      setError('Event has reached maximum participants');
      return;
    }

    const currentTeam = getUserTeam();
    if (currentTeam) {
      handleLeaveTeam(currentTeam.id);
    }

    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        return { ...team, members: [...team.members, address] };
      }
      return team;
    });

    updateTeamsInStorage(updatedTeams);
  };

  const handleLeaveTeam = (teamId: string) => {
    if (!address) return;

    let updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        return { ...team, members: team.members.filter(member => member !== address) };
      }
      return team;
    });

    // Remove empty teams
    updatedTeams = updatedTeams.filter(team => team.members.length > 0);
    updateTeamsInStorage(updatedTeams);
  };

  const updateTeamsInStorage = (updatedTeams: Team[]) => {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const updatedEvents = events.map((e: Event) => {
      if (e.id === id) {
        return { ...e, teams: updatedTeams };
      }
      return e;
    });
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setTeams(updatedTeams);
  };

  if (!event) return <div className="p-4">Loading...</div>;

  const userTeam = getUserTeam();
  const participantCount = teams.reduce((count, team) => count + team.members.length, 0);

  return (
    <main className="max-w-3xl mx-auto px-4 pt-20 pb-12">
      <h1 className="text-2xl font-semibold mb-2 text-primary">{event.name}</h1>
      <div className="text-sm text-secondary mb-8">
        <p>Maximum participants: {participantCount}/{event.maxParticipants}</p>
        <p>Maximum team size: {event.maxTeamSize}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm">
          {error}
        </div>
      )}

      {!userTeam && (
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4 text-primary">Create New Team</h2>
          <div className="space-y-3">
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Enter team name"
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-primary text-sm focus:outline-none focus:border-blue-500/50"
            />
            <textarea
              value={newTeamDescription}
              onChange={(e) => setNewTeamDescription(e.target.value)}
              placeholder="Enter team description"
              rows={3}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-primary text-sm focus:outline-none focus:border-blue-500/50"
            />
            <button
              onClick={handleCreateTeam}
              className="w-full px-4 py-2 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-all text-sm"
            >
              Create Team
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-primary">Teams</h2>
        {teams.length === 0 ? (
          <p className="text-secondary text-sm">No teams yet. Be the first to create one!</p>
        ) : (
          teams.map(team => (
            <div key={team.id} className="border border-border rounded-lg p-4 bg-card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-primary">{team.name}</h3>
                  <p className="text-sm text-secondary mt-1">
                    Members: {team.members.length}/{event.maxTeamSize}
                  </p>
                  <p className="text-sm text-secondary mt-2">{team.description}</p>
                </div>
                {address && (
                  team.members.includes(address) ? (
                    <button
                      onClick={() => handleLeaveTeam(team.id)}
                      className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition-all text-sm"
                    >
                      Leave Team
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinTeam(team.id)}
                      className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-all text-sm"
                      disabled={team.members.length >= event.maxTeamSize}
                    >
                      Join Team
                    </button>
                  )
                )}
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
          ))
        )}
      </div>
    </main>
  );
} 