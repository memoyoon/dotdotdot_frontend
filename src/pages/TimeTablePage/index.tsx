import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import HourBlock from '../../components/Timetable';
import type { Note } from '../../types/note';
import { listNotesByDate } from '../../api/notes';

function groupByHour(notes: Note[]) {
  const map = new Map<string, Note[]>();
  for (const n of notes) {
    const hour = n.createdAt.slice(11, 13) + ':00';
    if (!map.has(hour)) map.set(hour, []);
    map.get(hour)!.push(n);
  }
  return Array.from(map.entries()).sort(([a], [b]) => (a > b ? 1 : -1));
}

export default function TimetablePage() {
  const [params] = useSearchParams();
  const [items, setItems] = useState<Note[]>([]);

  const date = params.get('date') ?? new Date().toISOString().slice(0, 10);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await listNotesByDate(date);
        if (active) setItems(data);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { active = false; };
  }, [date]);

  const grouped = useMemo(() => groupByHour(items), [items]);

  return (
    <main className="page">
      <h1 className="visually-hidden">Timetable</h1>
      {grouped.length === 0 ? (
        <p style={{ opacity: 0.6 }}>아직 기록이 없어요.</p>
      ) : (
        grouped.map(([hour, notes]) => (
          <HourBlock
            key={hour}
            hour={hour}
            items={notes.map((n) => ({ id: n.id, preview: n.content.slice(0, 80) }))}
          />
        ))
      )}
    </main>
  );
}