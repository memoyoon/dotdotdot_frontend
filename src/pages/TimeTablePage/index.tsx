import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import HourBlock from '../../components/Timetable';
import { db } from '../../db/notesDb';
import type { Note as DBNote } from '../../db/notesDb';

function build24Hours() {
  const arr: string[] = [];
  for (let h = 0; h < 24; h++) {
    const hh = String(h).padStart(2, '0');
    arr.push(`${hh}:00`);
  }
  return arr;
}

export default function TimetablePage() {
  const [params] = useSearchParams();
  const [items, setItems] = useState<DBNote[]>([]);

  const date = params.get('date') ?? new Date().toISOString().slice(0, 10);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // load notes from local DB, fallback to empty
        const all = await db.notes.toArray();
        const filtered = all.filter((n) => n.at && n.at.startsWith(date));
        if (active) setItems(filtered);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { active = false; };
  }, [date]);

  const hours = useMemo(() => build24Hours(), []);

  const grouped = useMemo(() => {
    const map = new Map<string, DBNote[]>();
    for (const h of hours) map.set(h, []);
    for (const n of items) {
      const hour = (n.at || '').slice(11, 13) + ':00';
      if (!map.has(hour)) map.set(hour, []);
      map.get(hour)!.push(n);
    }
    return hours.map((h) => [h, map.get(h) || []] as [string, DBNote[]]);
  }, [items, hours]);

  return (
    <main className="page">
      <h1 className="visually-hidden">Timetable</h1>
      {grouped.map(([hour, notes]) => (
        <HourBlock
          key={hour}
          hour={hour}
          items={notes.map((n) => ({ id: n.id ?? 0, preview: (n.content || '').slice(0, 80) }))}
        />
      ))}
    </main>
  );
}