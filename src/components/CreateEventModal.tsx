'use client';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: any) => void;
}

const EVENT_IMAGES = [
  { value: '/images/hackathon-1.jpg', label: 'Collaboration' },
  { value: '/images/hackathon-2.jpg', label: 'Team Meeting' },
  { value: '/images/hackathon-3.jpg', label: 'Tech Workshop' },
  { value: '/images/hackathon-4.jpg', label: 'Innovation Space' },
  { value: '/images/hackathon-5.jpg', label: 'Coding Session' },
  { value: '/images/default-hackathon.jpg', label: 'Default' },
  { value: '/images/web3-hackathon.jpg', label: 'Web3' },
  { value: '/images/starknet-hackathon.jpg', label: 'Starknet' },
  { value: '/images/ai-blockchain-hackathon.jpg', label: 'AI & Blockchain' },
];

export default function CreateEventModal({ isOpen, onClose, onSubmit }: CreateEventModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxParticipants: '',
    maxTeamSize: '',
    teamsLockDate: '',
    endDate: '',
    image: EVENT_IMAGES[0].value,
  });

  const [previewImage, setPreviewImage] = useState(EVENT_IMAGES[0].value);

  const handleImageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newImage = e.target.value;
    setFormData({ ...formData, image: newImage });
    setPreviewImage(newImage);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate max participants is at least 3
    const maxParticipants = parseInt(formData.maxParticipants);
    const maxTeamSize = parseInt(formData.maxTeamSize);
    if (maxParticipants < 3) {
      alert('Maximum participants must be at least 3');
      return;
    }

    // Validate dates
    const now = new Date();
    const teamsLockDate = new Date(formData.teamsLockDate);
    const endDate = new Date(formData.endDate);

    // Check if lock date is in the past
    if (teamsLockDate <= now) {
      alert('Teams lock date must be in the future');
      return;
    }

    // Check if end date is at least 12 hours after lock date
    const minEndDate = new Date(teamsLockDate.getTime() + (12 * 60 * 60 * 1000)); // 12 hours in milliseconds
    if (endDate <= minEndDate) {
      alert('Event end date must be at least 12 hours after teams lock date');
      return;
    }

    const eventData = {
      ...formData,
      id: uuidv4(),
      status: 'upcoming',
      maxParticipants: maxParticipants,
      maxTeamSize: maxTeamSize
    };
    onSubmit(eventData);
    onClose();
  };

  // Get minimum datetime strings for the inputs
  const now = new Date();
  const minLockDate = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
  const getMinEndDate = () => {
    if (!formData.teamsLockDate) return minLockDate;
    const lockDate = new Date(formData.teamsLockDate);
    const minEnd = new Date(lockDate.getTime() + (12 * 60 * 60 * 1000));
    return minEnd.toISOString().slice(0, 16);
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
          <div>
            <label htmlFor="image" className="block text-sm text-secondary mb-1">Event Image</label>
            <select
              id="image"
              value={formData.image}
              onChange={handleImageChange}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-primary text-sm focus:outline-none focus:border-blue-500/50 mb-2"
            >
              {EVENT_IMAGES.map((img) => (
                <option key={img.value} value={img.value}>
                  {img.label}
                </option>
              ))}
            </select>
            <div className="w-full h-[120px] rounded-md overflow-hidden">
              <img 
                src={previewImage} 
                alt="Event preview" 
                className="w-full h-full object-cover"
              />
            </div>
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
                min="3"
              />
              <p className="text-xs text-secondary mt-1">Minimum: 3 participants</p>
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
                min={minLockDate}
              />
              <p className="text-xs text-secondary mt-1">Must be in the future</p>
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
                min={getMinEndDate()}
              />
              <p className="text-xs text-secondary mt-1">Must be at least 12h after lock date</p>
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