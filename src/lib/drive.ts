import { Note } from '../types/note';
import { loadLocalNotes, saveLocalNote, deleteLocalNote } from './storage';

const FOLDER_NAME = 'Wisdome Notes';

async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      // If 401/403, do not retry immediately as it might be auth issue
      if (response.status === 401 || response.status === 403) throw new Error(`Auth Error: ${response.status}`);
      if (response.status >= 500) throw new Error(`Server Error: ${response.status}`);
      throw new Error(`Request failed: ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries reached');
}

export class DriveService {
  private accessToken: string;
  private folderId: string | null = null;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async initialize(): Promise<boolean> {
    try {
      // First, try to find existing folder
      const searchResponse = await fetchWithRetry(
        'https://www.googleapis.com/drive/v3/files?' + new URLSearchParams({
          q: `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
          spaces: 'drive'
        }), {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      const searchResult = await searchResponse.json();

      if (searchResult.files && searchResult.files.length > 0) {
        this.folderId = searchResult.files[0].id;
        return true;
      }

      // If folder doesn't exist, create it
      const createResponse = await fetchWithRetry('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: FOLDER_NAME,
          mimeType: 'application/vnd.google-apps.folder'
        })
      });

      const folder = await createResponse.json();
      this.folderId = folder.id;
      return true;
    } catch (error) {
      console.error('Failed to initialize drive:', error);
      return false;
    }
  }

  async syncNotes(): Promise<Note[]> {
    if (!this.folderId) return loadLocalNotes();

    try {
      const localNotes = loadLocalNotes();
      const driveFilesMap = new Map();
      let pageToken = null;

      // 1. Get all files from Drive with pagination
      do {
        const queryParams: any = {
          q: `'${this.folderId}' in parents and mimeType='application/json' and trashed=false`,
          spaces: 'drive',
          fields: 'nextPageToken, files(id, name, modifiedTime)',
          pageSize: '100'
        };
        if (pageToken) queryParams.pageToken = pageToken;

        const filesResponse = await fetchWithRetry(
          'https://www.googleapis.com/drive/v3/files?' + new URLSearchParams(queryParams),
          {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`
            }
          }
        );

        const data = await filesResponse.json();
        if (data.files) {
          data.files.forEach((file: any) => {
            const noteId = file.name.replace('.json', '');
            driveFilesMap.set(noteId, file);
          });
        }
        pageToken = data.nextPageToken;
      } while (pageToken);

      // 2. Identify files to download
      const downloadQueue: any[] = [];
      const syncedNotes: Note[] = [...localNotes];

      for (const [noteId, file] of driveFilesMap.entries()) {
        const localNote = localNotes.find(n => n.id === noteId);
        const remoteTime = new Date(file.modifiedTime).getTime();

        if (!localNote || new Date(localNote.updatedAt).getTime() < remoteTime) {
          downloadQueue.push(file);
        }
      }

      // 3. Parallel Download with Concurrency Limit
      const BATCH_SIZE = 5;

      for (let i = 0; i < downloadQueue.length; i += BATCH_SIZE) {
        const batch = downloadQueue.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (file: any) => {
          try {
            const contentResponse = await fetchWithRetry(
              `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
              {
                headers: {
                  'Authorization': `Bearer ${this.accessToken}`
                }
              }
            );

            if (contentResponse.ok) {
              const noteContent = await contentResponse.json();
              const note: Note = {
                ...noteContent,
                createdAt: new Date(noteContent.createdAt),
                updatedAt: new Date(noteContent.updatedAt)
              };

              const idx = syncedNotes.findIndex(n => n.id === note.id);
              if (idx >= 0) {
                syncedNotes[idx] = note;
              } else {
                syncedNotes.push(note);
              }
              saveLocalNote(note);
            }
          } catch (err) {
            console.error(`Failed to download note ${file.id}`, err);
          }
        }));
      }

      // 4. Upload local notes that are not on Drive or are newer
      // NOTE: This is a simplified "last write wins" based on presence/time.
      // Ideally we track "dirty" state, but comparing timestamps is a decent fallback.
      for (const note of localNotes) {
        const driveFile = driveFilesMap.get(note.id);
        if (!driveFile) {
          // New local note -> Upload
          await this.saveNote(note);
        } else {
          // Check if local is newer than remote (approximate)
          // Drive modifiedTime is when file was uploaded.
          // We can check note.updatedAt vs file.modifiedTime.
          // Note: This logic can be tricky if clocks are off.
          // For now, let's rely on explicit saveNote calls from UI to trigger uploads,
          // and only use sync to PULL changes from other devices.
          // Pushing all "newer" local notes automatically on load might overwrite remote changes
          // if the user hasn't synced in a while. 
          // SAFEST STRATEGY: Only Pull from Drive during load/sync. Push is done on save.
        }
      }

      return loadLocalNotes(); // Return updated local notes
    } catch (error) {
      console.error('Sync failed:', error);
      return loadLocalNotes(); // Fallback to local
    }
  }

  async saveNote(note: Note): Promise<boolean> {
    // 1. Save locally first (Optimistic)
    saveLocalNote(note);

    if (!this.folderId) return false;

    try {
      // Check if note already exists
      const searchResponse = await fetchWithRetry(
        'https://www.googleapis.com/drive/v3/files?' + new URLSearchParams({
          q: `name='${note.id}.json' and '${this.folderId}' in parents and trashed=false`,
          spaces: 'drive'
        }), {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      const searchResult = await searchResponse.json();
      const existingFile = searchResult.files?.[0];

      const metadata = {
        name: `${note.id}.json`,
        mimeType: 'application/json',
        ...(existingFile ? {} : { parents: [this.folderId] })
      };

      const method = existingFile ? 'PATCH' : 'POST';
      const url = existingFile
        ? `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}`
        : 'https://www.googleapis.com/upload/drive/v3/files';

      const response = await fetchWithRetry(`${url}?uploadType=multipart`, {
        method,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: this.createMultipartBody(metadata, note)
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to save note to Drive:', error);
      // We already saved locally, so return false to indicate cloud sync failed
      // The UI can show a "unsynced" state if needed.
      return false;
    }
  }

  async loadNotes(): Promise<Note[]> {
    return this.syncNotes();
  }

  async deleteNote(noteId: string): Promise<boolean> {
    // 1. Delete locally
    deleteLocalNote(noteId);

    if (!this.folderId) return false;

    try {
      const searchResponse = await fetchWithRetry(
        'https://www.googleapis.com/drive/v3/files?' + new URLSearchParams({
          q: `name='${noteId}.json' and '${this.folderId}' in parents and trashed=false`,
          spaces: 'drive'
        }), {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      const searchResult = await searchResponse.json();
      const file = searchResult.files?.[0];
      if (!file) return true;

      const deleteResponse = await fetchWithRetry(
        `https://www.googleapis.com/drive/v3/files/${file.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      return deleteResponse.ok;
    } catch (error) {
      console.error('Failed to delete note from Drive:', error);
      return false;
    }
  }

  private createMultipartBody(metadata: any, note: Note): FormData {
    const form = new FormData();
    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    form.append(
      'file',
      new Blob([JSON.stringify(note)], { type: 'application/json' })
    );
    return form;
  }
}