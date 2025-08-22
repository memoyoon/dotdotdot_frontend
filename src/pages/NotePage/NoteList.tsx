import { useEffect, useState } from 'react';
import { db } from '../../db/notesDb';
import type { Note } from '../../db/notesDb';

function fmt(dateIso: string) {
  try {
    return new Date(dateIso).toLocaleString();
  } catch {
    return dateIso;
  }
}

export default function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);

  const load = async () => {
    const arr = await db.notes.orderBy('at').reverse().toArray();
    setNotes(arr);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 2000);
    return () => clearInterval(id);
  }, []);

  if (!notes.length) {
    return <div className="p-4 text-sm text-gray-500">No notes yet</div>;
  }

  return (
    <div className="p-4 space-y-2 max-h-[60vh] md:max-h-[70vh] overflow-auto">
      {notes.map((n) => (
        <article key={n.id} className="rounded-xl border border-gray-100 dark:border-neutral-800 p-3 bg-white dark:bg-neutral-900 shadow-sm">
          <div className="text-xs text-gray-400 mb-2">{fmt(n.at)}</div>
          <div className="text-sm text-gray-900 dark:text-white line-clamp-3">{n.content || '—'}</div>
        </article>
      ))}
    </div>
  );
}
