import React from 'react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function MobileDrawer({ isOpen, onClose, children }: MobileDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform">
        {children}
      </div>
    </div>
  );
}