
import { Trash2, ArrowUpCircle, Loader2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import { Note } from '../types/note';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onEdit: () => void;
  onConvert?: (id: string) => void;
  isDeleting?: boolean;
  isSaving?: boolean;
}

export default function NoteCard({
  note,
  onDelete,
  onEdit,
  onConvert,
  isDeleting,
  isSaving
}: NoteCardProps) {
  const getBgColor = () => {
    switch (note.type) {
      case 'fleeting':
        return 'bg-blue-50/50';
      case 'literature':
        return 'bg-green-50/50';
      default:
        return 'bg-[#fdfcfa]';
    }
  };

  return (
    <div
      onClick={onEdit}
      className={`
        ${getBgColor()} rounded-lg shadow-sm p-4 hover:shadow-md transition-all cursor-pointer 
        border border-[#e8e6e3] relative group
        ${(isDeleting || isSaving) ? 'opacity-50' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-900 pr-16">{note.title}</h3>
        <div className="absolute top-3 right-3 flex gap-2">
          {(isDeleting || isSaving) ? (
            <div className="p-1.5">
              <Loader2 size={18} className="animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              {note.type !== 'permanent' && onConvert && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onConvert(note.id);
                  }}
                  className="p-1.5 rounded-full bg-white shadow-sm text-[#8b7355] hover:text-[#5c4c39]"
                  title="Convert to permanent note"
                >
                  <ArrowUpCircle size={18} />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
                className="p-1.5 rounded-full bg-white shadow-sm text-[#8b7355] hover:text-[#5c4c39]"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className="text-gray-600 mb-3 line-clamp-3 text-sm"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.content) }}
      />

      <div className="flex flex-wrap gap-1.5">
        {note.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-0.5 bg-[#f5f3f0] text-xs text-[#5c4c39] rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="text-xs text-gray-400 mt-2">
        Created: {new Date(note.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}