import type { Note, NoteIn } from '../../types/note';
import { http } from '../../utils/http';

export async function createNote(payload: NoteIn): Promise<Note> {
  return http<Note>('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function listNotesByDate(date: string): Promise<Note[]> {
  const url = `/api/notes?date=${encodeURIComponent(date)}`;
  return http<Note[]>(url);
}