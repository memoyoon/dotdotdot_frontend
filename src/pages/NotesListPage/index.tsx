
import { useState } from 'react';
import NoteList from '../NotePage/NoteList';
import { db } from '../../db/notesDb';

export default function NotesListPage() {
  const [refreshSignal, setRefreshSignal] = useState(0);

  const handleDelete = async (id: number) => {
    await db.notes.delete(id);
    setRefreshSignal((s) => s + 1);
  };

  return (
    <main className="page max-w-4xl mx-auto p-4">
      <NoteList onDelete={handleDelete} refreshSignal={refreshSignal} />
    </main>
  );
}
