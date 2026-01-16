import { useState, useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import { X, Loader2, ChevronDown } from 'lucide-react';
import { NoteType } from '../types/note';
import RichTextEditor from './RichTextEditor';
import TagInput from './TagInput';

export interface NoteEditorHandle {
  save: () => void;
}

interface NoteEditorProps {
  note?: {
    id?: string;
    type: NoteType;
    title: string;
    content: string;
    tags: string[];
    connections: string[];
  };
  onSave: (data: {
    type: NoteType;
    title: string;
    content: string;
    tags: string[];
    connections: string[];
  }) => void;
  onClose: () => void;
  availableTags: string[];
  permanentNotes?: any[];
  isSaving?: boolean;
  initialType?: NoteType;
}

const NoteEditor = forwardRef<NoteEditorHandle, NoteEditorProps>(({
  note,
  onSave,
  onClose,
  availableTags,
  permanentNotes = [],
  isSaving = false,
  initialType
}, ref) => {
  const [type, setType] = useState<NoteType>(note?.type || initialType || 'fleeting');
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [connections, setConnections] = useState<string[]>(note?.connections || []);
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const isValid = title.trim() !== '' && content.trim() !== '';

  // Extract mentioned note IDs from content
  const extractMentions = useCallback((content: string) => {
    const mentionRegex = /data-mention-id="([^"]+)"/g;
    const mentions = new Set<string>();
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.add(match[1]);
    }

    return Array.from(mentions);
  }, []);

  // Update connections when content changes
  useEffect(() => {
    const mentionedNoteIds = extractMentions(content);
    setConnections(prev => {
      const newConnections = Array.from(new Set([...prev, ...mentionedNoteIds]));
      return newConnections;
    });
  }, [content, extractMentions]);

  // Auto-save Logic
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved');
  const lastSavedData = useRef({ title, content, tags, type, connections });
  const onSaveRef = useRef(onSave);

  // Keep ref in sync with prop
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // Check for changes and set unsaved status
  useEffect(() => {
    const currentData = { title, content, tags, type, connections };
    const hasChanges = JSON.stringify(currentData) !== JSON.stringify(lastSavedData.current);

    // Switch to unsaved if changed, unless currently saving [don't interrupt save]
    // Also recovers from 'error' state once user types again
    if (hasChanges && saveStatus !== 'unsaved' && saveStatus !== 'saving') {
      setSaveStatus('unsaved');
    }
  }, [title, content, tags, type, connections, saveStatus]);

  // Debounced Save
  useEffect(() => {
    if (saveStatus !== 'unsaved' || !isValid) return;

    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await onSaveRef.current({
          type,
          title,
          content,
          tags,
          connections
        });
        lastSavedData.current = { title, content, tags, type, connections };
        setSaveStatus('saved');
      } catch (error) {
        setSaveStatus('error');
        console.error('Auto-save failed:', error);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [title, content, tags, type, connections, isValid, saveStatus]); // removed onSave from deps

  const handleSave = async () => {
    // Manual trigger (cmd+enter or similar)
    if (!isValid || saveStatus === 'saving') return;

    setSaveStatus('saving');
    try {
      await onSave({
        type,
        title,
        content,
        tags,
        connections
      });
      lastSavedData.current = { title, content, tags, type, connections };
      setSaveStatus('saved');
    } catch (error) {
      setSaveStatus('error');
    }
  };

  useImperativeHandle(ref, () => ({
    save: handleSave
  }));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && isValid) {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, title, content, tags, type, connections, isValid, handleSave]);

  const handleNoteLink = useCallback((noteId: string) => {
    setConnections(prev => Array.from(new Set([...prev, noteId])));
  }, []);

  const headerActions = (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {saveStatus === 'saving' && (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>Saving...</span>
          </>
        )}
        {saveStatus === 'saved' && (
          <span className="text-emerald-600">Saved</span>
        )}
        {saveStatus === 'unsaved' && (
          <span className="text-amber-500">Saving...</span>
        )}
        {saveStatus === 'error' && (
          <span className="text-red-500">Error saving</span>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setShowTypeMenu(!showTypeMenu)}
          className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm focus:outline-none hover:bg-gray-50 flex items-center gap-2"
        >
          <div className={`w-2 h-2 rounded-md ${type === 'fleeting' ? 'bg-yellow-400' :
            type === 'literature' ? 'bg-blue-400' :
              'bg-green-400'
            }`} />
          {type.charAt(0).toUpperCase() + type.slice(1)} Note
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {showTypeMenu && (
          <div className="absolute top-full right-0 mt-1 w-48 bg-white border rounded-lg shadow-xl overflow-hidden z-20">
            {(['fleeting', 'literature', 'permanent'] as NoteType[]).map((noteType) => (
              <button
                key={noteType}
                onClick={() => {
                  setType(noteType);
                  setShowTypeMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <div className={`w-2 h-2 rounded-full ${noteType === 'fleeting' ? 'bg-yellow-400' :
                  noteType === 'literature' ? 'bg-blue-400' :
                    'bg-green-400'
                  }`} />
                {noteType.charAt(0).toUpperCase() + noteType.slice(1)} Note
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <RichTextEditor
          content={content}
          onChange={setContent}
          permanentNotes={permanentNotes}
          onNoteLink={handleNoteLink}
          placeholder="Start writing..."
          disabled={false}
          headerActions={headerActions}
        >
          {/* Title Input */}
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="text-4xl font-medium font-['Instrument_Serif'] w-full focus:outline-none placeholder:text-gray-300"
            />
          </div>

          {/* Tags Input */}
          <div className="mb-8">
            <TagInput
              tags={tags}
              suggestions={availableTags}
              onChange={setTags}
              disabled={false}
            />
          </div>
        </RichTextEditor>
      </div>
    </div>
  );
});

export default NoteEditor;