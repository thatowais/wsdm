import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
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

  const handleSave = () => {
    if (!isValid || isSaving) return;
    onSave({
      type,
      title,
      content,
      tags,
      connections
    });
  };

  useImperativeHandle(ref, () => ({
    save: handleSave
  }));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !isSaving && isValid) {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, title, content, tags, type, connections, isSaving, isValid]);

  const handleNoteLink = useCallback((noteId: string) => {
    setConnections(prev => Array.from(new Set([...prev, noteId])));
  }, []);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Mobile Header */}
      <div className="flex items-center justify-between h-16 px-4 bg-white border-b md:hidden">
        <button
          onClick={onClose}
          className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
        >
          <X size={24} />
        </button>
        <h1 className="text-xl font-['Instrument_Serif']">
          {note ? 'Edit Note' : 'New Note'}
        </h1>
        <div className="w-10" /> {/* Spacer to center the title */}
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex px-4 pt-4 pb-2 items-center justify-between">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="text-2xl font-medium w-full focus:outline-none font-['Instrument_Serif']"
            disabled={isSaving}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowTypeMenu(!showTypeMenu)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm focus:outline-none hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isSaving}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} Note
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {showTypeMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-50">
                {(['fleeting', 'literature', 'permanent'] as NoteType[]).map((noteType) => (
                  <button
                    key={noteType}
                    onClick={() => {
                      setType(noteType);
                      setShowTypeMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                  >
                    {noteType.charAt(0).toUpperCase() + noteType.slice(1)} Note
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={!isValid || isSaving}
            className={`
              px-3 py-1.5 rounded-md text-sm flex items-center gap-2 transition-colors
              ${isValid
                ? 'bg-black text-white hover:bg-gray-900'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Save
                <span className="hidden sm:inline text-xs text-gray-400">⌘↵</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Title Input */}
      <div className="px-4 py-2 md:hidden">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="text-2xl font-medium w-full focus:outline-none font-['Instrument_Serif']"
          disabled={isSaving}
        />
      </div>

      {/* Tags Input */}
      <div className="px-4">
        <TagInput
          tags={tags}
          suggestions={availableTags}
          onChange={setTags}
          disabled={isSaving}
        />
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <RichTextEditor
          content={content}
          onChange={setContent}
          permanentNotes={permanentNotes}
          onNoteLink={handleNoteLink}
          placeholder="Start writing..."
          disabled={isSaving}
        />
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden flex items-center gap-2 p-4 border-t bg-white">
        <div className="relative flex-1">
          <button
            onClick={() => setShowTypeMenu(!showTypeMenu)}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
            disabled={isSaving}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} Note
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {showTypeMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border rounded-md shadow-lg">
              {(['fleeting', 'literature', 'permanent'] as NoteType[]).map((noteType) => (
                <button
                  key={noteType}
                  onClick={() => {
                    setType(noteType);
                    setShowTypeMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                >
                  {noteType.charAt(0).toUpperCase() + noteType.slice(1)} Note
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={!isValid || isSaving}
          className={`
            px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 min-w-[80px] justify-center
            ${isValid
              ? 'bg-black text-white hover:bg-gray-900'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            'Save'
          )}
        </button>
      </div>
    </div>
  );
});

export default NoteEditor;