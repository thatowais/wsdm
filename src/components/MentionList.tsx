import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { FileText } from 'lucide-react';

interface MentionListProps {
  items: Array<{ id: string; title: string }>;
  command: (item: { id: string; title: string }) => void;
}

const MentionList = forwardRef((props: MentionListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  if (!props.items?.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-w-[200px]">
        <div className="p-3 text-sm text-gray-500">No permanent notes found</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-w-[200px]">
      <div className="p-1">
        {props.items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => selectItem(index)}
            className={`
              block w-full text-left px-3 py-2 rounded flex items-center gap-2
              ${index === selectedIndex ? 'bg-blue-50 text-blue-600' : 'text-gray-900 hover:bg-gray-50'}
            `}
          >
            <FileText size={16} className="flex-shrink-0" />
            <span className="truncate">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

MentionList.displayName = 'MentionList';

export default MentionList;