import React, { useState, useRef, useEffect } from 'react';
import { Hash } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  suggestions: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

export default function TagInput({ tags, suggestions, onChange, disabled = false }: TagInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = suggestions
    .filter(tag => !tags.includes(tag))
    .filter(tag => tag.toLowerCase().includes(input.toLowerCase()));

  const addTag = (tag: string) => {
    if (disabled) return;
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag]);
    }
    setInput('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    if (disabled) return;
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if ((e.key === 'Enter' || e.key === 'Tab') && input.trim()) {
      e.preventDefault();

      // If there's an exact match in suggestions, use that
      const exactMatch = suggestions.find(
        tag => tag.toLowerCase() === input.toLowerCase()
      );

      if (exactMatch) {
        addTag(exactMatch);
      } else {
        addTag(input);
      }
    }
  };

  return (
    <div className="relative">
      <div className={`
        flex items-center gap-2 group border-b transition-colors
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'focus-within:border-gray-400'}
      `}>
        <Hash size={16} className="text-gray-400 flex-shrink-0" />
        <div className="flex flex-wrap gap-2 py-1.5 min-h-[2.25rem]">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`
                inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-sm text-gray-700 rounded-md
                ${!disabled && 'cursor-pointer hover:bg-gray-200'}
              `}
              onClick={() => removeTag(tag)}
            >
              {tag}
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-[120px] bg-transparent border-none outline-none focus:ring-0 p-0 text-sm disabled:cursor-not-allowed"
            placeholder={tags.length === 0 ? "Add tags..." : ""}
            disabled={disabled}
          />
        </div>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && !disabled && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => addTag(suggestion)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}