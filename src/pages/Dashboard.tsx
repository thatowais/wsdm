import { useState, useEffect, useRef } from 'react';
import { LayoutGrid, List, FileText } from 'lucide-react';
import { Note, NoteType } from '../types/note';
import NoteCard from '../components/NoteCard';
import GraphView from '../components/GraphView';
import Sidebar from '../components/Sidebar';
import NoteEditor, { NoteEditorHandle } from '../components/NoteEditor';
import EmptyState from '../components/EmptyState';
import MobileHeader from '../components/MobileHeader';
import MobileDrawer from '../components/MobileDrawer';
import FloatingActionButton from '../components/FloatingActionButton';
import { useDrive } from '../hooks/useDrive';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const { notes, saveNote, deleteNote, isSyncing, error: driveError } = useDrive(user?.access_token || null);

  const [activeTab, setActiveTab] = useState<NoteType | 'graph'>('fleeting');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreating, setIsCreating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Show sync status or errors if needed, though useDrive handles basic error state internally

  /* New Ref for Editor */
  const editorRef = useRef<NoteEditorHandle>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input, textarea, or content editable
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        (document.activeElement as HTMLElement).isContentEditable
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCreating(true);
        return;
      }

      // Tab Switching Shortcuts
      const key = e.key.toLowerCase();
      const mappings: Record<string, NoteType | 'graph'> = {
        'f': 'fleeting',
        'l': 'literature',
        'p': 'permanent',
        'g': 'graph'
      };

      if (mappings[key]) {
        const targetTab = mappings[key];
        if (activeTab !== targetTab) {
          // Autosave if editing
          if (editorRef.current) {
            editorRef.current.save();
          }
          handleTabChange(targetTab);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeTab]);

  const handleTabChange = (tab: NoteType | 'graph') => {
    setActiveTab(tab);
    setIsCreating(false);
    setEditingNote(null);
    setIsSidebarOpen(false); // Close sidebar on mobile after tab change
  };

  const addNote = async (data: { type: NoteType; title: string; content: string; tags: string[] }) => {
    try {
      setIsSaving(true);
      const newNote: Note = {
        id: crypto.randomUUID(),
        ...data,
        connections: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await saveNote(newNote);
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNoteHandler = async (id: string) => {
    try {
      await deleteNote(id);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const convertToPermanent = async (id: string) => {
    try {
      setIsSaving(true);
      const noteToUpdate = notes.find(note => note.id === id);
      if (noteToUpdate) {
        const updatedNote = { ...noteToUpdate, type: 'permanent' as NoteType, updatedAt: new Date() };
        await saveNote(updatedNote);
      }
    } catch (error) {
      console.error('Failed to convert note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      setIsSaving(true);
      const noteToUpdate = notes.find(note => note.id === id);
      if (noteToUpdate) {
        const updatedNote = { ...noteToUpdate, ...updates, updatedAt: new Date() };
        await saveNote(updatedNote);
        setEditingNote(null);
      }
    } catch (error) {
      console.error('Failed to update note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    // Initial loading state could be handled if notes are empty and user key exists, 
    // but useDrive loads local notes instantly so it shouldn't look "loading" for long.

    if (isCreating || editingNote) {
      return (
        <NoteEditor
          ref={editorRef}
          note={editingNote || undefined}
          onSave={editingNote ? (data) => updateNote(editingNote.id, data) : addNote}
          onClose={() => {
            setIsCreating(false);
            setEditingNote(null);
          }}
          availableTags={Array.from(new Set(notes.flatMap(note => note.tags)))}
          permanentNotes={notes.filter(note => note.type === 'permanent')}
          isSaving={isSaving}
          initialType={activeTab === 'graph' ? 'fleeting' : activeTab}
        />
      );
    }

    if (activeTab === 'graph') {
      return (
        <GraphView
          notes={notes}
          onNodeClick={(note) => setEditingNote(note)}
          onConnectionCreate={() => { }}
        />
      );
    }

    const filteredNotes = notes.filter(note => note.type === activeTab);

    if (filteredNotes.length === 0) {
      return (
        <EmptyState
          type={activeTab}
          onNewNote={() => setIsCreating(true)}
        />
      );
    }

    return (
      <div className="flex flex-col h-full bg-white">
        {/* View Toggle Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h2 className="text-xl font-medium text-gray-900">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Notes
            <span className="ml-2 text-sm text-gray-400 font-normal">{filteredNotes.length}</span>
          </h2>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={deleteNoteHandler}
                  onEdit={() => setEditingNote(note)}
                  onConvert={note.type !== 'permanent' ? convertToPermanent : undefined}
                  isDeleting={false}
                  isSaving={isSaving}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setEditingNote(note)}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0 cursor-pointer group transition-colors"
                >
                  <div className="text-gray-400 group-hover:text-emerald-600 transition-colors">
                    <FileText size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{note.title || 'Untitled Note'}</h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5 max-w-lg">
                      {note.content.replace(/<[^>]*>/g, '') || 'No content'}
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-2">
                    {note.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="text-xs text-gray-400">+{note.tags.length - 3}</span>
                    )}
                  </div>

                  <div className="text-xs text-gray-400 whitespace-nowrap pl-4 border-l border-gray-100 ml-2">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-white">
      {/* Mobile Header */}
      <MobileHeader
        onMenuClick={() => setIsSidebarOpen(true)}
        title={activeTab === 'graph' ? 'Graph View' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Notes`}
      />

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onNewNote={() => setIsCreating(true)}
          user={user}
          onLogin={() => { }}
          onLogout={onLogout}
          authError={driveError}
        />
      </MobileDrawer>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onNewNote={() => setIsCreating(true)}
          user={user}
          onLogin={() => { }}
          onLogout={onLogout}
          authError={driveError}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        {isSyncing && (
          <div className="absolute top-2 right-2 z-50 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Syncing...
          </div>
        )}
        {renderContent()}
      </main>

      {/* Mobile FAB */}
      {!isCreating && !editingNote && (
        <FloatingActionButton onClick={() => setIsCreating(true)} />
      )}
    </div>
  );
}