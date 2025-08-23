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
  const [params, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<DBNote[]>([]);
  const [isNarrow, setIsNarrow] = useState<boolean>(false);

  const date = params.get('date') ?? new Date().toISOString().slice(0, 10);
  const todayIso = new Date().toISOString().slice(0, 10);

  function setDateParam(d: string) {
    setSearchParams({ date: d });
  }

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

  // track narrow viewport (<=600px)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setIsNarrow(window.innerWidth <= 600);
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

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
  // Numeric US: MM/DD/YYYY
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
    } catch {
      return iso;
    }
  };

  return (
    <main className="p-4 mt-16">
      <div className="flex items-center justify-between mb-4">
        <div>
          {!isNarrow && <h1 className="text-2xl font-semibold">{fmtHeader(date)}</h1>}
          <div className="text-sm text-gray-500">Daily timeline</div>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDateParam(e.target.value)}
              className="px-4 py-2 rounded-md border bg-white text-base appearance-none"
              aria-label="Select date"
              style={{ WebkitAppearance: 'none', MozAppearance: 'textfield', appearance: 'none', backgroundImage: 'none' }}
            />
          </div>
          {!isNarrow && (
            <button
              className="px-4 py-2 rounded-md bg-gray-100 text-base"
              onClick={() => setDateParam(todayIso)}
            >
              Today
            </button>
          )}
        </div>
      </div>

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