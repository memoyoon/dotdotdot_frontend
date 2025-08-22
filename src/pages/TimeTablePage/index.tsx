import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import HourBlock from '../../components/Timetable';
import { db } from '../../db/notesDb';
import type { Note as DBNote } from '../../db/notesDb';

function build24Hours() {
  const arr: string[] = [];
  // start from 06:00, then 07:00 ... 23:00, 00:00 ... 05:00
  for (let i = 0; i < 24; i++) {
    const h = (6 + i) % 24;
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
        const all = await db.notes.toArray();
        // keep notes whose local date matches requested date
        const filtered = all.filter((n) => {
          try {
            const d = new Date(n.at || '');
            // format YYYY-MM-DD in local timezone
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}` === date;
          } catch {
            return false;
          }
        });
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
      try {
        const d = new Date(n.at || '');
        const hh = String(d.getHours()).padStart(2, '0');
        const hour = `${hh}:00`;
        if (!map.has(hour)) map.set(hour, []);
        map.get(hour)!.push(n);
      } catch {
        // ignore invalid dates
      }
    }
    return hours.map((h) => [h, map.get(h) || []] as [string, DBNote[]]);
  }, [items, hours]);

  const fmtHeader = (iso: string) => {
    try {
      const d = new Date(iso + 'T00:00:00');
      const today = new Date();
      if (d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate()) {
        return 'Today';
      }
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-lg font-semibold mb-4">{fmtHeader(date)}</h1>
      <div className="space-y-3">
        {grouped.map(([hour, notes]) => (
          <HourBlock
            key={hour}
            hour={hour}
            items={notes.map((n) => ({ id: n.id ?? 0, preview: (n.content || '').slice(0, 80), content: n.content, at: n.at }))}
          />
        ))}
      </div>
    </main>
  );
}