import { Note } from '../types/note';

const STORAGE_KEY = 'notes';

export function loadLocalNotes(): Note[] {
    const notesHook = localStorage.getItem(STORAGE_KEY);
    if (!notesHook) return [];

    try {
        const parsedNotes = JSON.parse(notesHook);
        return parsedNotes.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt)
        }));
    } catch (error) {
        console.error('Failed to parse notes from localStorage:', error);
        return [];
    }
}

export function saveLocalNotes(notes: Note[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function saveLocalNote(note: Note) {
    const notes = loadLocalNotes();
    const index = notes.findIndex(n => n.id === note.id);

    if (index >= 0) {
        notes[index] = note;
    } else {
        notes.push(note);
    }

    saveLocalNotes(notes);
}

export function deleteLocalNote(id: string) {
    const notes = loadLocalNotes();
    const filteredNotes = notes.filter(n => n.id !== id);
    saveLocalNotes(filteredNotes);
}

export function clearLocalNotes() {
    localStorage.removeItem(STORAGE_KEY);
}
