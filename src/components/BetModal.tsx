'use client';

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  teamName: string;
}

export default function BetModal({ isOpen, onClose, onSubmit, teamName }: BetModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card w-full max-w-md rounded-lg p-6 border border-border">
        <h2 className="text-xl font-semibold mb-4 text-primary">Place Bet on {teamName}</h2>
        <p className="text-sm text-secondary mb-6">
          You can only bet on one team per event. If you bet on another team, your previous bet will be removed.
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm text-secondary mb-1">Bet Amount (STRK)</label>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-primary text-sm focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-secondary hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(0)} // TODO: Get actual amount from input
              className="px-4 py-2 bg-green-500/20 text-green-400 rounded-md hover:bg-green-500/30 transition-all text-sm"
            >
              Place Bet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 