import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { FileText } from 'lucide-react';
import { Note } from '../types/note';
import MentionList from '../components/MentionList';

export default function suggestion(permanentNotes: Note[], onNoteLink: (noteId: string) => void) {
  return {
    items: ({ query }: { query: string }) => {
      return permanentNotes
        .filter(note => 
          note.title.toLowerCase().includes((query || '').toLowerCase())
        )
        .slice(0, 5);
    },
    char: '/',
    command: ({ editor, range, props }: any) => {
      // Don't allow self-referencing
      if (editor.getAttributes('mention')?.id === props.id) {
        return;
      }

      editor
        .chain()
        .focus()
        .insertContentAt(range, [
          {
            type: 'mention',
            attrs: {
              id: props.id,
              label: props.title,
            },
          },
          {
            type: 'text',
            text: ' ',
          },
        ])
        .run();

      onNoteLink(props.id);
    },
    render: () => {
      let component: ReactRenderer | null = null;
      let popup: any[] = [];

      return {
        onStart: (props: any) => {
          // Filter out current note from suggestions
          const filteredProps = {
            ...props,
            items: props.items.filter((item: Note) => 
              item.id !== props.editor.getAttributes('mention')?.id
            ),
          };

          component = new ReactRenderer(MentionList, {
            props: filteredProps,
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          });
        },

        onUpdate: (props: any) => {
          if (!component) {
            return;
          }

          // Filter out current note from suggestions
          const filteredProps = {
            ...props,
            items: props.items.filter((item: Note) => 
              item.id !== props.editor.getAttributes('mention')?.id
            ),
          };

          component.updateProps(filteredProps);

          if (!props.clientRect) {
            return;
          }

          popup[0]?.setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown: (props: any) => {
          if (props.event.key === 'Escape') {
            popup[0]?.hide();
            return true;
          }

          if (!component?.ref) {
            return false;
          }

          return component.ref.onKeyDown(props);
        },

        onExit: () => {
          popup[0]?.destroy();
          if (component) {
            component.destroy();
          }
        },
      };
    },
  };
}