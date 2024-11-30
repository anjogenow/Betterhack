'use client';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: any) => void;
}

export default function CreateEventModal({ isOpen, onClose, onSubmit }: CreateEventModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxParticipants: '',
    maxTeamSize: '',
    teamsLockDate: '',
    endDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = {
      ...formData,
      id: uuidv4(),
      status: 'upcoming',
    };
    onSubmit(eventData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card w-full max-w-lg rounded-lg p-6 border border-border">
        <h2 className="text-xl font-semibold mb-4 text-primary">Create New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-secondary mb-1">Event Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-primary text-sm focus:outline-none focus:border-blue-500/50"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm text-secondary mb-1">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-primary text-sm focus:outline-none focus:border-blue-500/50 min-h-[100px]"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="maxParticipants" className="block text-sm text-secondary mb-1">Max Participants</label>
              <input
                type="number"
                id="maxParticipants"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-primary text-sm focus:outline-none focus:border-blue-500/50"
                required
                min="1"
              />
            </div>
            <div>
              <label htmlFor="maxTeamSize" className="block text-sm text-secondary mb-1">Max Team Size</label>
              <input
                type="number"
                id="maxTeamSize"
                value={formData.maxTeamSize}
                onChange={(e) => setFormData({ ...formData, maxTeamSize: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-primary text-sm focus:outline-none focus:border-blue-500/50"
                required
                min="1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="teamsLockDate" className="block text-sm text-secondary mb-1">Teams Lock Date</label>
              <input
                type="datetime-local"
                id="teamsLockDate"
                value={formData.teamsLockDate}
                onChange={(e) => setFormData({ ...formData, teamsLockDate: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-primary text-sm focus:outline-none focus:border-blue-500/50"
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm text-secondary mb-1">Event End Date</label>
              <input
                type="datetime-local"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-primary text-sm focus:outline-none focus:border-blue-500/50"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-secondary hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-all text-sm"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 