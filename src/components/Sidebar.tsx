import { useState } from 'react';
import { Brain, Lightbulb, BookOpen, Share2, Plus, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { NoteType } from '../types/note';

interface SidebarProps {
  activeTab: NoteType | 'graph';
  onTabChange: (tab: NoteType | 'graph') => void;
  onNewNote: () => void;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
  authError: string | null;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  onNewNote,
  user,
  onLogin,
  onLogout,
  authError
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'fleeting', icon: Lightbulb, label: 'Fleeting Notes', shortcut: 'F' },
    { id: 'literature', icon: BookOpen, label: 'Literature Notes', shortcut: 'L' },
    { id: 'permanent', icon: Brain, label: 'Permanent Notes', shortcut: 'P' },
    { id: 'graph', icon: Share2, label: 'Graph View', shortcut: 'G' },
  ] as const;

  return (
    <div className={`
      flex flex-col h-full bg-white border-r border-gray-200
      ${isCollapsed ? 'w-16' : 'w-64'}
      transition-all duration-200 ease-in-out
    `}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b">
        {!isCollapsed && (
          <h1 className="text-2xl font-medium font-['Instrument_Serif'] text-gray-900">wsdm</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            hidden md:flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 rounded-lg
            ${isCollapsed ? 'w-full' : 'ml-auto'}
          `}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0 py-2">
        {/* New Note Button */}
        <div className="px-2">
          <button
            onClick={onNewNote}
            className={`
              w-full flex items-center gap-2 px-3 py-2 text-sm font-medium
              text-gray-700 bg-white border border-gray-200 hover:bg-gray-50
              transition-colors rounded-md
              ${isCollapsed ? 'justify-center' : 'justify-between'}
            `}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Plus size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="truncate">New Note</span>}
            </div>
            {!isCollapsed && <span className="text-[12px] text-gray-400 flex-shrink-0 hidden sm:inline">⌘K</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-2 flex-1 px-2 space-y-1">
          {menuItems.map(({ id, icon: Icon, label, shortcut }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 text-sm font-medium
                rounded-md transition-colors duration-150
                ${isCollapsed ? 'justify-center' : ''}
                ${activeTab === id
                  ? 'text-black bg-gray-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
              title={isCollapsed ? label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="truncate flex-1 text-left">{label}</span>
                  <span className="text-[12px] text-gray-300">
                    {shortcut}
                  </span>
                </>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-2 border-t">
        {authError && !isCollapsed && (
          <div className="mb-2 p-2 bg-red-50 text-red-600 text-sm rounded-md flex items-start gap-2">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {user ? (
          <div className={`
            flex items-center gap-3 px-3 py-2
            ${isCollapsed ? 'justify-center' : ''}
          `}>
            <div className="w-8 h-8 flex-shrink-0">
              <img
                src={user.picture}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                <button
                  onClick={onLogout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onLogin}
            className={`
              w-full flex items-center gap-2 px-3 py-2 text-sm font-medium
              text-gray-700 bg-white border border-gray-200 hover:bg-gray-50
              transition-colors rounded-md
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {!isCollapsed && <span>Sign in with Google</span>}
          </button>
        )}
      </div>
    </div>
  );
}