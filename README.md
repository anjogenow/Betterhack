# Betterhack

A decentralized hackathon platform utilizing betting as a way to fund prize pools and interact with hackathons. Built during 42 Berlin x Starknet Hackathon.

## Overview

Betterhack is a web application that combines hackathons with betting mechanics. Users can create or participate in hackathons while others can bet on teams to win. A portion of the betting pool contributes to the prize pool for winning teams, while the remainder is distributed among successful bettors. The platform leverages Starknet for secure transactions.

## Profit Sharing

The betting system follows a simple model:

- **For Each Hackathon**
  - Bettors place bets on which team they think will win
  - Winning bettors get their original bet back
  - Second and third place bettors get 50% of their bet back
  - Remaining bets form the pool to be distributed
  - From the losing pool:
    - 80% is shared among winning bettors proportionally to their bet size
    - 19.5% goes to hackathon prizes
    - 0.5% goes to platform fees

- **Prize Pool (19.5% of losing bets)**
  - First Place: 9% of losing pool
  - Second Place: 6.5% of losing pool
  - Third Place: 4% of losing pool

- **Platform Fee (0.5% of losing bets)**
  - Covers operational costs

For example:
If there's 10000 STRK total bets:
- 4000 STRK bet on Team A
- 3000 STRK bet on Team B
- 3000 STRK bet on Team C

If Team A wins, Team B second, Team C third:
- Team A bettors get their 4000 STRK back
- Team B bettors get 1500 STRK back (50% refund)
- Team C bettors get 1500 STRK back (50% refund)
- Losing pool is 3000 STRK (remaining 50% from B and C)
  - 2400 STRK shared among Team A bettors (80%)
  - 585 STRK goes to hackathon prizes (270/195/120 split)
  - 15 STRK goes to platform (0.5%)
- Each Team A bettor gets their original bet back plus their share of 2400 STRK based on their bet size

Note: Betting closes when teams are locked in.

## User Roles

Users can interact with the platform in four distinct roles (one role per event):

1. **Organizer**
   - Create and edit hackathon events
   - Manage participant applications
   - Set event parameters
   - Remove participants

2. **Participant**
   - Join existing teams
   - Create new teams
   - Participate in hackathons

3. **Bettor**
   - Place bets on teams
   - View current betting odds
   - Track potential profits
   - Receive automatic payouts upon winning

4. **Spectator**
   - View event details
   - Track team progress
   - Monitor betting statistics

## Features

### Event Management
- Create hackathons with customizable parameters:
  - Location
  - Title
  - Maximum total participants
  - Maximum team size
  - Team finalization deadline (same as registration deadline)
  - Hackathon start and end times (minimum duration: 6 hours)
  - Event description
- View active and upcoming events
- Manage participant applications
  - All participants require organizer approval
  - Organizers can remove participants at any time

### Team Management
- Create and join teams
  - One team per participant per hackathon
  - Teams are locked after the finalization deadline
  - Teams can be edited until the teams are locked
  - Maximum team size set by organizer
  - Minimum team size: 1 (solo participation allowed)
- Accept/deny team join requests
- Edit team details (name, description)
- View team members

### Betting System
- Place bets on teams
  - Minimum bet: 10 USDC
  - No maximum bet limit
  - Betting window: From team lock until 80% of hackathon duration
  - Bets are final once placed
  - Formula-based payouts even if no bets on winning team
- View current betting statistics
- You can see how big your share of the team is / would be with the bet you want to place
- Automatic payout distribution

### Project Submission
- Teams submit via GitHub repository link
  - One update allowed before hackathon ends
- Repository must be public
- Judging handled offline by organizers
- Results posted on platform trigger automatic payouts

### User Features
- Account creation and management via Web3 wallet
- Profile customization
- View participation history
  - Past hackathons
  - Team placements
- Multi-event participation (different roles per event)
- Public access to view:
  - Event details
  - Team information
  - Current betting amounts
  - No wallet connection required for viewing

## Technical Stack

- Frontend: [TBD]
- Smart Contracts: Starknet
- Wallet Integration: [TBD]
- Backend: [TBD]

## User Flow

1. **Event Creation**
   - Organizer creates hackathon
   - Sets all parameters
   - Opens registration

2. **Team Formation**
   - Participants register
   - Create or join teams
   - Teams finalize before deadline

3. **Betting Phase**
   - Teams are locked
   - Betting opens
   - Closes at 80% of hackathon duration

4. **Hackathon**
   - Teams develop projects
   - Submit GitHub repository links
   - Organizers judge submissions

5. **Results & Payouts**
   - Winners announced
   - Smart contracts execute payouts
   - Funds distributed to winners and successful bettors

## Getting Started

Follow these steps to run the project locally:

1. Clone the repository:
```bash
git clone git@github.com:anjogenow/Betterhack.git
cd Betterhack
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

### Project Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── event/             # Event-related pages
│   ├── profile/           # User profile pages
│   └── page.tsx           # Home page
├── components/            # Reusable React components
└── styles/               # Global styles

public/                   # Static assets
```

### Key Features

#### Event Management
- Create and manage hackathon events
- Set event parameters (team size, dates, etc.)
- Cancel events before team lock date

#### Team System
- Create and join teams
- Team size limits
- Team member management
- Prevent organizers from joining teams

#### User System
- Wallet-based authentication
- Persistent login state
- Profile management with display names
- Role-based permissions

#### Results System
- Organizer can set final rankings
- Podium display for top 3 teams
- Detailed team information display

## Contributing

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them:
```bash
git add .
git commit -m "Add your feature"
```

3. Push to your branch:
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request on GitHub

## License

[To be added]