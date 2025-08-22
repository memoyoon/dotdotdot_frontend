import type { Note, NoteIn } from '../types/note';

const STORAGE_KEY = 'dotdotdot:notes';

type Listener = (notes: Note[]) => void;

function safeParse(raw: string | null): Note[] {
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed)) return parsed as Note[];
		} catch {
			// ignore and return empty
		}
	return [];
}

function readStorage(): Note[] {
	if (typeof window === 'undefined' || !window.localStorage) return [];
	return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

function writeStorage(notes: Note[]) {
	if (typeof window === 'undefined' || !window.localStorage) return;
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
		} catch {
			// ignore quota errors
		}
}

const listeners = new Set<Listener>();

function notify() {
	const notes = readStorage();
	for (const l of listeners) l(notes);
}

function makeId() {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		try {
			return crypto.randomUUID();
			} catch {
				// fallback below
			}
	}
	return String(Date.now()) + '-' + Math.floor(Math.random() * 1000000);
}

export function getNotes(): Note[] {
	return readStorage();
}

export function getNote(id: string): Note | undefined {
	return readStorage().find((n) => n.id === id);
}

export function createNote(input: NoteIn): Note {
	const notes = readStorage();
	const now = new Date().toISOString();
	const note: Note = {
		id: makeId(),
		content: input.content,
		createdAt: input.createdAt ?? now,
		tags: input.tags ?? [],
	};
	notes.unshift(note);
	writeStorage(notes);
	notify();
	return note;
}

export function updateNote(id: string, patch: Partial<NoteIn> & { id?: never }): Note | undefined {
	const notes = readStorage();
	const idx = notes.findIndex((n) => n.id === id);
	if (idx === -1) return undefined;
	const existing = notes[idx];
	const updated: Note = {
		...existing,
		content: patch.content ?? existing.content,
		createdAt: patch.createdAt ?? existing.createdAt,
		tags: patch.tags ?? existing.tags,
	};
	notes[idx] = updated;
	writeStorage(notes);
	notify();
	return updated;
}

export function deleteNote(id: string): boolean {
	const notes = readStorage();
	const filtered = notes.filter((n) => n.id !== id);
	if (filtered.length === notes.length) return false;
	writeStorage(filtered);
	notify();
	return true;
}

export function clearNotes() {
	writeStorage([]);
	notify();
}

export function subscribe(listener: Listener) {
	listeners.add(listener);
	// call immediately with current value
	try {
		listener(readStorage());
		} catch {
			// ignore listener errors
		}
	return () => listeners.delete(listener);
}

export default {
	getNotes,
	getNote,
	createNote,
	updateNote,
	deleteNote,
	clearNotes,
	subscribe,
};
