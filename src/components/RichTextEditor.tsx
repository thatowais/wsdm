import { useCallback } from 'react';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Image from '@tiptap/extension-image';
import Mention from '@tiptap/extension-mention';
import TextStyle from '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core';
import {
  Bold, Italic, Strikethrough, AlignLeft, AlignCenter,
  AlignRight, List, ListOrdered, Quote, Code
} from 'lucide-react';
import { Note } from '../types/note';
import suggestion from '../lib/noteSuggestion';
import MentionComponent from './MentionComponent';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  permanentNotes?: Note[];
  onNoteLink?: (noteId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  headerActions?: React.ReactNode;
}

// Custom Font Size Extension
type FontSizeOptions = {
  types: string[],
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType,
      unsetFontSize: () => ReturnType,
    }
  }
}

const FontSize = Extension.create<FontSizeOptions>({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {}
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontSize: (fontSize) => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run()
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run()
      },
    }
  },
})

const ToolbarButton = ({ onClick, active, children, disabled }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded hover:bg-gray-100 flex-shrink-0 transition-colors ${active ? 'bg-gray-100 text-black' : 'text-gray-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

export default function RichTextEditor({
  content,
  onChange,
  onImageUpload = async () => '',
  permanentNotes = [],
  onNoteLink = () => { },
  placeholder = 'Start writing...',
  disabled = false,
  children,
  headerActions
}: RichTextEditorProps) {

  const handleDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    for (const file of imageFiles) {
      const url = await onImageUpload(file);
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [onImageUpload]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Typography,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full cursor-move select-none',
        },
        allowBase64: true,
      }),
      TextStyle,
      FontSize,
      Mention.extend({
        addNodeView() {
          return ReactNodeViewRenderer(MentionComponent);
        },
      }).configure({
        HTMLAttributes: {
          class: 'mention',
        },
        renderLabel({ node }) {
          // Just return the label, no trigger char
          return `${node.attrs.label}`;
        },
        suggestion: suggestion(permanentNotes, onNoteLink),
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !disabled,
    editorProps: {
      attributes: {
        class: 'prose prose-lg focus:outline-none max-w-none min-h-[calc(100vh-300px)]',
        placeholder,
      },
      handleDrop: (_view: any, event: any) => {
        if (event instanceof DragEvent && event.dataTransfer?.files) {
          handleDrop(event);
          return true;
        }
        return false;
      },
      handlePaste: (_view: any, event: any) => {
        if (event.clipboardData?.files?.length) {
          Array.from(event.clipboardData.files)
            .filter((file: any) => file.type.startsWith('image/'))
            .forEach(async (file: any) => {
              const url = await onImageUpload(file);
              editor?.chain().focus().setImage({ src: url }).run();
            });
          return true;
        }
        return false;
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Centered Toolbar */}
      <div className="sticky top-0 z-10 w-full border-b bg-white">
        <div className="flex items-center justify-between px-4 py-3.5 gap-4">
          {/* Toolbar Items */}
          <div className="flex items-center gap-1 overflow-x-auto flex-1 justify-center">

            <select
              onChange={(e) => {
                const level = parseInt(e.target.value);
                if (level === 0) {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor.chain().focus().toggleHeading({ level: level as any }).run();
                }
              }}
              value={
                editor.isActive('heading', { level: 1 }) ? '1' :
                  editor.isActive('heading', { level: 2 }) ? '2' :
                    editor.isActive('heading', { level: 3 }) ? '3' :
                      '0'
              }
              disabled={disabled}
              className="px-2 py-1.5 border border-gray-200 rounded hover:bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
            >
              <option value="0">Normal text</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
            </select>

            <div className="w-px h-6 bg-gray-200 mx-2 flex-shrink-0" />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive('bold')}
              disabled={disabled}
            >
              <Bold size={18} />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive('italic')}
              disabled={disabled}
            >
              <Italic size={18} />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              active={editor.isActive('strike')}
              disabled={disabled}
            >
              <Strikethrough size={18} />
            </ToolbarButton>

            <div className="w-px h-6 bg-gray-200 mx-2 flex-shrink-0" />

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              active={editor.isActive({ textAlign: 'left' })}
              disabled={disabled}
            >
              <AlignLeft size={18} />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              active={editor.isActive({ textAlign: 'center' })}
              disabled={disabled}
            >
              <AlignCenter size={18} />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              active={editor.isActive({ textAlign: 'right' })}
              disabled={disabled}
            >
              <AlignRight size={18} />
            </ToolbarButton>

            <div className="w-px h-6 bg-gray-200 mx-2 flex-shrink-0" />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive('bulletList')}
              disabled={disabled}
            >
              <List size={18} />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive('orderedList')}
              disabled={disabled}
            >
              <ListOrdered size={18} />
            </ToolbarButton>

            <div className="w-px h-6 bg-gray-200 mx-2 flex-shrink-0" />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive('blockquote')}
              disabled={disabled}
            >
              <Quote size={18} />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              active={editor.isActive('codeBlock')}
              disabled={disabled}
            >
              <Code size={18} />
            </ToolbarButton>
          </div>

          {/* Header Actions */}
          {headerActions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {headerActions}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-3xl mx-auto px-8 py-12">
          {children}
          <div className="mt-8">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}