import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed right-4 bottom-4 w-14 h-14 bg-black text-white rounded-lg shadow-lg flex items-center justify-center md:hidden hover:bg-gray-900 transition-colors"
    >
      <Plus size={24} />
    </button>
  );
}