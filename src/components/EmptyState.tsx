import React from 'react';
import { Lightbulb, BookOpen, Brain, Share2, Plus } from 'lucide-react';
import { NoteType } from '../types/note';

interface EmptyStateProps {
  type: NoteType | 'graph';
  onNewNote: () => void;
}

export default function EmptyState({ type, onNewNote }: EmptyStateProps) {
  const states = {
    fleeting: {
      icon: Lightbulb,
      title: 'No fleeting notes yet',
      description: 'Capture quick thoughts and ideas that come to mind.',
    },
    literature: {
      icon: BookOpen,
      title: 'No literature notes yet',
      description: 'Take notes while reading books, articles, or other content.',
    },
    permanent: {
      icon: Brain,
      title: 'No permanent notes yet',
      description: 'Create lasting notes by connecting and refining your thoughts.',
    },
    graph: {
      icon: Share2,
      title: 'No notes to visualize',
      description: 'Create some notes to see their connections in the graph view.',
    },
  };

  const { icon: Icon, title, description } = states[type];

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <Icon size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{description}</p>
        <button
          onClick={onNewNote}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
        >
          <Plus size={16} />
          <span>New Note</span>
        </button>
      </div>
    </div>
  );
}