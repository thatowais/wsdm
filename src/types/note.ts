export type NoteType = 'fleeting' | 'literature' | 'permanent';

export interface Note {
  id: string;
  type: NoteType;
  title: string;
  content: string;
  tags: string[];
  connections: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteState {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteNote: (id: string) => void;
  convertToPermanent: (id: string) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  addConnection: (sourceId: string, targetId: string) => void;
}