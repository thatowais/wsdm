import { useState, useEffect, useCallback } from 'react';
import { Note } from '../types/note';
import { DriveService } from '../lib/drive';
import { loadLocalNotes, saveLocalNote, deleteLocalNote } from '../lib/storage';

export function useDrive(accessToken: string | null) {
  const [drive, setDrive] = useState<DriveService | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load local notes immediately on mount
  useEffect(() => {
    setNotes(loadLocalNotes());
  }, []);

  // Initialize Drive and Sync when token changes
  useEffect(() => {
    if (!accessToken) {
      setDrive(null);
      setIsReady(false);
      return;
    }

    const driveService = new DriveService(accessToken);
    setDrive(driveService);

    driveService.initialize()
      .then(async (success) => {
        if (success) {
          setIsReady(true);
          setError(null);
          // Trigger initial sync
          setIsSyncing(true);
          try {
            const syncedNotes = await driveService.syncNotes();
            setNotes(syncedNotes);
          } catch (err) {
            console.error('Initial sync failed:', err);
          } finally {
            setIsSyncing(false);
          }
        } else {
          setError('Failed to initialize Google Drive');
          setIsReady(false);
        }
      })
      .catch(err => {
        setError(err.message);
        setIsReady(false);
      });
  }, [accessToken]);

  const saveNote = useCallback(async (note: Note): Promise<boolean> => {
    try {
      // 1. Update local state immediately (Optimistic UI)
      setNotes(prev => {
        const idx = prev.findIndex(n => n.id === note.id);
        if (idx >= 0) {
          const newNotes = [...prev];
          newNotes[idx] = note;
          return newNotes;
        }
        return [...prev, note];
      });

      // 2. Save to storage/drive
      if (drive && isReady) {
        return await drive.saveNote(note);
      } else {
        saveLocalNote(note);
        return true;
      }
    } catch (err) {
      setError('Failed to save note');
      return false;
    }
  }, [drive, isReady]);

  const refreshNotes = useCallback(async (): Promise<Note[]> => {
    if (drive && isReady) {
      setIsSyncing(true);
      try {
        const synced = await drive.syncNotes();
        setNotes(synced);
        return synced;
      } catch (err) {
        return loadLocalNotes();
      } finally {
        setIsSyncing(false);
      }
    }
    const local = loadLocalNotes();
    setNotes(local);
    return local;
  }, [drive, isReady]);

  const deleteNote = useCallback(async (noteId: string): Promise<boolean> => {
    try {
      // 1. Update local state immediately
      setNotes(prev => prev.filter(n => n.id !== noteId));

      if (drive && isReady) {
        return await drive.deleteNote(noteId);
      } else {
        deleteLocalNote(noteId);
        return true;
      }
    } catch (err) {
      setError('Failed to delete note');
      return false;
    }
  }, [drive, isReady]);

  return {
    isReady,
    isSyncing,
    error,
    notes,
    saveNote,
    loadNotes: refreshNotes, // Expose as loadNotes for compatibility, but it acts as sync/refresh
    deleteNote
  };
}