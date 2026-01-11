import React, { useState } from 'react';
import { X } from 'lucide-react';
import { NoteType } from '../types/note';
import TagInput from './TagInput';

interface NoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { type: NoteType; title: string; content: string; tags: string[] }) => void;
  availableTags: string[];
}

export default function NoteDialog({ isOpen, onClose, onSubmit, availableTags }: NoteDialogProps) {
  const [type, setType] = useState<NoteType>('fleeting');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ type, title, content, tags });
    setTitle('');
    setContent('');
    setTags([]);
    setType('fleeting');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">New Note</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Note Type</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="fleeting"
                  checked={type === 'fleeting'}
                  onChange={(e) => setType(e.target.value as NoteType)}
                  className="mr-2"
                />
                Fleeting
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="literature"
                  checked={type === 'literature'}
                  onChange={(e) => setType(e.target.value as NoteType)}
                  className="mr-2"
                />
                Literature
              </label>
            </div>
          </div>

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
              rows={4}
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
              Create Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}