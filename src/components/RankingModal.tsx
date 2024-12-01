'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Team {
  id: string;
  name: string;
  description: string;
  members: string[];
}

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rankedTeams: Team[]) => void;
  teams: Team[];
}

export default function RankingModal({ isOpen, onClose, onSubmit, teams }: RankingModalProps) {
  const [rankedTeams, setRankedTeams] = useState<Team[]>(teams);

  if (!isOpen) return null;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(rankedTeams);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setRankedTeams(items);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card w-full max-w-md rounded-lg p-6 border border-border">
        <h2 className="text-xl font-semibold mb-4 text-primary">Rank Teams</h2>
        <p className="text-sm text-secondary mb-6">
          Drag and drop teams to rank them from 1st to last place.
        </p>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="teams">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2 max-h-[60vh] overflow-y-auto"
              >
                {rankedTeams.map((team, index) => (
                  <Draggable key={team.id} draggableId={team.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-background border border-border rounded-md p-3 flex items-center gap-3 ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                      >
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-500/10 text-blue-400 rounded-full font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-primary truncate">{team.name}</h3>
                          <p className="text-sm text-secondary">
                            {team.members.length} members
                          </p>
                        </div>
                        <div className="text-secondary">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-secondary hover:text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(rankedTeams)}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-all text-sm"
          >
            Confirm Rankings
          </button>
        </div>
      </div>
    </div>
  );
} 