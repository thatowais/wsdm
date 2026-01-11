import React from 'react';
import { BookOpen, Lightbulb } from 'lucide-react';
import { NoteType } from '../types/note';

interface NoteTypeSelectorProps {
  onSelect: (type: NoteType) => void;
}

export default function NoteTypeSelector({ onSelect }: NoteTypeSelectorProps) {
  return (
    <div className="flex justify-center gap-8 p-8">
      <button
        onClick={() => onSelect('fleeting')}
        className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <Lightbulb size={48} className="text-yellow-500 mb-4" />
        <span className="text-lg font-medium">Fleeting Note</span>
        <span className="text-sm text-gray-500 mt-2 text-center">
          Quick thoughts and temporary ideas
        </span>
      </button>

      <button
        onClick={() => onSelect('literature')}
        className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <BookOpen size={48} className="text-blue-500 mb-4" />
        <span className="text-lg font-medium">Literature Note</span>
        <span className="text-sm text-gray-500 mt-2 text-center">
          Notes from reading and research
        </span>
      </button>
    </div>
  );
}