import React from 'react';
import { Menu } from 'lucide-react';

interface MobileHeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export default function MobileHeader({ onMenuClick, title = 'wsdm' }: MobileHeaderProps) {
  return (
    <div className="flex items-center justify-between h-16 px-4 bg-white border-b md:hidden">
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
      >
        <Menu size={24} />
      </button>
      <h1 className="text-xl font-['Instrument_Serif']">{title}</h1>
      <div className="w-10" /> {/* Spacer to center the title */}
    </div>
  );
}