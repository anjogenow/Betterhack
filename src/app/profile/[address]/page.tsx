'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount } from '@starknet-react/core';
import Link from 'next/link';

interface UserProfile {
  address: string;
  name?: string;
}

interface Team {
  id: string;
  name: string;
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
}

export default function ProfilePage() {
  const { address: profileAddress } = useParams();
  const { address: currentUserAddress } = useAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [userEvents, setUserEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Load user profile
    const profiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    const userProfile = profiles[profileAddress as string] || { address: profileAddress };
    setProfile(userProfile);
    setNewName(userProfile.name || '');

    // Load and filter events
    const allEvents = JSON.parse(localStorage.getItem('events') || '[]');
    
    // Update event status based on dates before filtering
    const updatedEvents = allEvents.map((event: Event) => {
      const now = new Date();
      const teamsLockDate = new Date(event.teamsLockDate);
      const endDate = new Date(event.endDate);

      if (now > endDate) {
        return { ...event, status: 'finished' };
      } else if (now > teamsLockDate) {
        return { ...event, status: 'betting' };
      }
      return { ...event, status: 'upcoming' };
    });

    // Filter events where user is a participant
    const userEvts = updatedEvents.filter((event: Event) => 
      event.teams?.some(team => 
        team.members.includes(profileAddress as string)
      )
    );

    // Sort events by status
    const sortedEvents = userEvts.sort((a: Event, b: Event) => {
      const statusOrder = { upcoming: 0, betting: 1, finished: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

    setUserEvents(sortedEvents);
  }, [profileAddress]);

  const handleSaveName = () => {
    if (!newName.trim()) return;

    const profiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    profiles[profileAddress as string] = {
      ...profiles[profileAddress as string],
      address: profileAddress,
      name: newName.trim()
    };
    
    // Save to localStorage and force an update event
    localStorage.setItem('userProfiles', JSON.stringify(profiles));
    
    // Force a storage event for the current tab
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'userProfiles',
      newValue: JSON.stringify(profiles),
      storageArea: localStorage
    }));

    setProfile(prev => prev ? { ...prev, name: newName.trim() } : null);
    setIsEditing(false);
  };

  const getEventPath = (event: Event) => {
    const paths = {
      upcoming: 'teams',
      betting: 'bet',
      finished: 'results'
    };
    return paths[event.status];
  };

  if (!profile) return <div className="p-4">Loading...</div>;

  const isOwnProfile = currentUserAddress === profileAddress;

  return (
    <main className="max-w-3xl mx-auto px-4 pt-20 pb-12">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            {profile.name ? (
              <h1 className="text-2xl font-semibold mb-2 text-primary">{profile.name}</h1>
            ) : (
              <h1 className="text-2xl font-semibold mb-2 text-primary">Unnamed User</h1>
            )}
            <p className="text-sm text-secondary">
              {profileAddress?.slice(0, 6)}...{profileAddress?.slice(-4)}
            </p>
          </div>
          {isOwnProfile && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-all text-sm"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing && isOwnProfile && (
          <div className="mt-4 p-4 border border-border rounded-lg bg-card">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-secondary mb-1">Display Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-primary text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="Enter your name"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 text-secondary hover:text-primary transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveName}
                  className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-all text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-medium text-primary">Events</h2>
        {userEvents.length === 0 ? (
          <p className="text-secondary text-sm">No events yet</p>
        ) : (
          <div className="space-y-4">
            {userEvents.map((event) => (
              <Link 
                href={`/event/${event.id}/${getEventPath(event)}`}
                key={event.id} 
                className="block group"
              >
                <div className="border border-border bg-card rounded-lg overflow-hidden hover:border-blue-500/30 transition-all">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-medium text-primary group-hover:text-blue-500 transition-colors">
                          {event.name}
                        </h3>
                        <p className="text-sm text-secondary mt-1">{event.description}</p>
                      </div>
                      <span className="text-xs text-secondary">
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-secondary">
                      {event.teams?.find(team => 
                        team.members.includes(profileAddress as string)
                      )?.name && (
                        <p>Team: {event.teams?.find(team => 
                          team.members.includes(profileAddress as string)
                        )?.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 