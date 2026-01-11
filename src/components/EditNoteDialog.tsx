import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Note } from '../types/note';
import TagInput from './TagInput';

interface EditNoteDialogProps {
  note: Note;
  availableTags: string[];
  availableConnections: Note[];
  onClose: () => void;
  onSave: (updates: Partial<Note>) => void;
}

export default function EditNoteDialog({
  note,
  availableTags,
  availableConnections,
  onClose,
  onSave,
}: EditNoteDialogProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState<string[]>(note.tags);
  const [connections, setConnections] = useState<string[]>(note.connections);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, content, tags, connections });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Edit Note</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <TagInput
              tags={tags}
              suggestions={availableTags}
              onChange={setTags}
            />
          </div>

          {note.type === 'permanent' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Connected Notes</label>
              <select
                multiple
                value={connections}
                onChange={(e) => setConnections(Array.from(e.target.selectedOptions, option => option.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {availableConnections.map(conn => (
                  <option key={conn.id} value={conn.id}>
                    {conn.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}