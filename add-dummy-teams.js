// Read current events from localStorage
const existingEvents = JSON.parse(localStorage.getItem('events') || '[]');

// Create dummy event
const dummyEvent = {
  "id": "dummy-event-1",
  "name": "Test Hackathon",
  "description": "A test hackathon with dummy teams",
  "maxParticipants": 10,
  "maxTeamSize": 3,
  "teamsLockDate": "2024-01-30T00:00:00.000Z",
  "endDate": "2024-02-28T00:00:00.000Z",
  "status": "upcoming",
  "creatorAddress": "0x0123456789abcdef0123456789abcdef01234567",
  "teams": [
    {
      "id": "team-1",
      "name": "Alpha Team",
      "description": "The first team to test with",
      "members": ["0x1234567890abcdef1234567890abcdef12345678"],
      "eventId": "dummy-event-1"
    },
    {
      "id": "team-2",
      "name": "Beta Squad",
      "description": "A team that might become empty",
      "members": ["0x2345678901abcdef2345678901abcdef23456789"],
      "eventId": "dummy-event-1"
    },
    {
      "id": "team-3",
      "name": "Gamma Force",
      "description": "A team with multiple members",
      "members": [
        "0x3456789012abcdef3456789012abcdef34567890",
        "0x4567890123abcdef4567890123abcdef45678901"
      ],
      "eventId": "dummy-event-1"
    }
  ],
  "image": "/images/default-hackathon.jpg"
};

// Add or update the dummy event
const updatedEvents = existingEvents.map(event => 
  event.id === dummyEvent.id ? dummyEvent : event
);

if (!updatedEvents.find(event => event.id === dummyEvent.id)) {
  updatedEvents.push(dummyEvent);
}

// Save to localStorage
localStorage.setItem('events', JSON.stringify(updatedEvents));

// Log for debugging
console.log('Events in localStorage:', updatedEvents); 