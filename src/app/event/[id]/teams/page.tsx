'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  description: string;
  maxParticipants: number;
  maxTeamSize: number;
  teamsLockDate: string;
  endDate: string;
  status: 'upcoming' | 'betting' | 'finished';
  creatorAddress?: string;
  teams?: Team[];
  participantCount?: number;
}

export default function TeamsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { address } = useAccount();
  const [event, setEvent] = useState<Event | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    maxParticipants: '',
    maxTeamSize: '',
    teamsLockDate: '',
    endDate: ''
  });

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
      setTeams(updatedEvent.teams || []);

      // Initialize edit form
      setEditForm({
        maxParticipants: updatedEvent.maxParticipants.toString(),
        maxTeamSize: updatedEvent.maxTeamSize.toString(),
        teamsLockDate: new Date(updatedEvent.teamsLockDate).toISOString().slice(0, 16),
        endDate: new Date(updatedEvent.endDate).toISOString().slice(0, 16)
      });

      // Redirect if teams are locked
      if (status !== 'upcoming') {
        router.push(`/event/${id}/${status === 'betting' ? 'bet' : 'results'}`);
      }
    }
  }, [id, router]);

  const handleEditSubmit = () => {
    if (!event) return;

    const maxParticipants = parseInt(editForm.maxParticipants);
    const maxTeamSize = parseInt(editForm.maxTeamSize);
    const teamsLockDate = new Date(editForm.teamsLockDate);
    const endDate = new Date(editForm.endDate);
    const now = new Date();

    // Validation
    if (isNaN(maxParticipants) || maxParticipants < 1) {
      setError('Maximum participants must be at least 1');
      return;
    }
    if (isNaN(maxTeamSize) || maxTeamSize < 1) {
      setError('Maximum team size must be at least 1');
      return;
    }
    if (teamsLockDate <= now) {
      setError('Teams lock date must be in the future');
      return;
    }
    if (endDate <= teamsLockDate) {
      setError('End date must be after teams lock date');
      return;
    }

    // Check if new maxTeamSize is less than any current team size
    const maxCurrentTeamSize = Math.max(...(teams.map(team => team.members.length) || [0]));
    if (maxTeamSize < maxCurrentTeamSize) {
      setError(`Maximum team size cannot be less than current largest team (${maxCurrentTeamSize})`);
      return;
    }

    // Check if new maxParticipants is less than current total participants
    const currentParticipants = teams.reduce((sum, team) => sum + team.members.length, 0);
    if (maxParticipants < currentParticipants) {
      setError(`Maximum participants cannot be less than current participants (${currentParticipants})`);
      return;
    }

    // Update event in localStorage
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const updatedEvents = events.map((e: Event) => {
      if (e.id === event.id) {
        return {
          ...e,
          maxParticipants,
          maxTeamSize,
          teamsLockDate: teamsLockDate.toISOString(),
          endDate: endDate.toISOString()
        };
      }
      return e;
    });

    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setEvent(prev => prev ? {
      ...prev,
      maxParticipants,
      maxTeamSize,
      teamsLockDate: teamsLockDate.toISOString(),
      endDate: endDate.toISOString()
    } : null);
    setIsEditing(false);
    setError('');
  };

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

    // Check for duplicate team name
    const existingTeam = teams.find(team => team.name.toLowerCase() === newTeamName.trim().toLowerCase());
    if (existingTeam) {
      setError('A team with this name already exists');
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

    // First, create a copy of teams
    let updatedTeams = [...teams];

    // Find and leave current team if exists
    const currentTeam = getUserTeam();
    if (currentTeam) {
      // Remove user from current team
      updatedTeams = updatedTeams.map(team => {
        if (team.id === currentTeam.id) {
          return { ...team, members: team.members.filter(member => member !== address) };
        }
        return team;
      });
      // Remove empty teams
      updatedTeams = updatedTeams.filter(team => team.members.length > 0);
    }

    // Join new team
    updatedTeams = updatedTeams.map(team => {
      if (team.id === teamId) {
        return { ...team, members: [...team.members, address] };
      }
      return team;
    });

    // Update storage with all changes at once
    updateTeamsInStorage(updatedTeams);
    setError('');
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
  const isOwner = address && event.creatorAddress === address;

  return (
    <main className="max-w-3xl mx-auto px-4 pt-20 pb-12">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2 text-primary">{event.name}</h1>
          <div className="text-sm text-secondary">
            <p>Maximum participants: {participantCount}/{event.maxParticipants}</p>
            <p>Maximum team size: {event.maxTeamSize}</p>
            <p>Teams lock: {new Date(event.teamsLockDate).toLocaleString()}</p>
            <p>Event ends: {new Date(event.endDate).toLocaleString()}</p>
          </div>
        </div>
        {isOwner && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-all text-sm"
          >
            Edit Event
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm">
          {error}
        </div>
      )}

      {isEditing && isOwner && (
        <div className="mb-8 p-4 border border-border rounded-lg bg-card">
          <h2 className="text-lg font-medium mb-4 text-primary">Edit Event</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-secondary mb-1">Maximum Participants</label>
              <input
                type="number"
                value={editForm.maxParticipants}
                onChange={(e) => setEditForm({ ...editForm, maxParticipants: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-primary text-sm focus:outline-none focus:border-blue-500/50"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm text-secondary mb-1">Maximum Team Size</label>
              <input
                type="number"
                value={editForm.maxTeamSize}
                onChange={(e) => setEditForm({ ...editForm, maxTeamSize: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-primary text-sm focus:outline-none focus:border-blue-500/50"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm text-secondary mb-1">Teams Lock Date</label>
              <input
                type="datetime-local"
                value={editForm.teamsLockDate}
                onChange={(e) => setEditForm({ ...editForm, teamsLockDate: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-primary text-sm focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-sm text-secondary mb-1">Event End Date</label>
              <input
                type="datetime-local"
                value={editForm.endDate}
                onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-primary text-sm focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setError('');
                }}
                className="flex-1 px-4 py-2 text-secondary hover:text-primary transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-all text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
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