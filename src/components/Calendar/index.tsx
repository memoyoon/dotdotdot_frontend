import { useMemo, useState, useEffect } from 'react';
import { db } from '../../db/notesDb';
import { useNavigate, useSearchParams } from 'react-router-dom';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function CalendarGrid() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const today = new Date();
  const initialYear = Number(params.get('y')) || today.getFullYear();

  const [year, setYear] = useState<number>(initialYear);
  const [showMonths, setShowMonths] = useState(true);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null); // 1-12

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  function openMonth(m: number) {
    // open the month detail immediately (hide months grid)
    setExpandedMonth(m);
    setShowMonths(false);
  }

  function handleDateClick(y: number, m: number, d: number) {
    const mm = String(m).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    nav(`/timetable?date=${y}-${mm}-${dd}`);
  }

  

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 rounded-md bg-gray-100 dark:bg-neutral-800"
            onClick={() => { setYear((y) => y - 1); }}
          >
            ◀
          </button>
          <button
            className="text-lg font-semibold px-3 py-1 rounded hover:bg-gray-50 dark:hover:bg-neutral-800"
            onClick={() => setShowMonths((s) => !s)}
          >
            {year}
          </button>
          <button
            className="px-2 py-1 rounded-md bg-gray-100 dark:bg-neutral-800"
            onClick={() => { setYear((y) => y + 1); }}
          >
            ▶
          </button>
        </div>
      </div>

      {/* Months grid */}
      {showMonths && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {months.map((m) => (
            <div key={m} className="border rounded-lg p-3 bg-white dark:bg-neutral-900">
              <div className="flex items-center justify-between">
                <div className="font-medium text-lg">{MONTH_NAMES[m - 1]}</div>
                <button
                  className="text-xs text-gray-500"
                  onClick={() => openMonth(m)}
                >
                  View
                </button>
              </div>

              {/* removed condensed day chips; month card shows only the month label */}

              {/* expanded month detail inline */}
              {expandedMonth === m ? (
                <div className="mt-3 border-t pt-3">
                  <MonthDetail year={year} month={m} onDateClick={handleDateClick} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* Desktop: when a month is opened, show large detail area */}
      {!showMonths && expandedMonth ? (
        <div className="mt-6 w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-semibold">{MONTH_NAMES[expandedMonth - 1]} {year}</div>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 rounded-md bg-gray-100 dark:bg-neutral-800" onClick={() => { setShowMonths(true); setExpandedMonth(null); }}>
                ← Back
              </button>
            </div>
          </div>
          <div className="w-full border rounded-lg p-4 bg-white dark:bg-neutral-900">
            <MonthDetail year={year} month={expandedMonth} onDateClick={handleDateClick} />
          </div>
        </div>
      ) : null}

  {/* mobile selector removed; always use the months grid or expanded month detail */}
    </div>
  );
}

function MonthDetail({ year, month, onDateClick }: { year: number; month: number; onDateClick: (y:number,m:number,d:number)=>void }) {
  const total = daysInMonth(year, month);
  const [marked, setMarked] = useState<Set<string>>(new Set());

  useEffect(() => {
    let canceled = false;
    const start = new Date(year, month - 1, 1).toISOString();
    const end = new Date(year, month - 1, total, 23, 59, 59).toISOString();
    db.notes
      .where('at')
      .between(start, end, true, true)
      .toArray()
      .then((rows) => {
        if (canceled) return;
        const s = new Set<string>();
        rows.forEach((r) => {
          const d = new Date(r.at);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          s.add(key);
        });
        setMarked(s);
      });
    return () => { canceled = true; };
  }, [year, month, total]);
  // build weeks with empty placeholders for alignment (Mon-Sun start)
  const first = new Date(year, month - 1, 1);
  const startDay = first.getDay(); // 0 Sun .. 6 Sat

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="mt-2">
      <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
        <div className="text-center">Sun</div>
        <div className="text-center">Mon</div>
        <div className="text-center">Tue</div>
        <div className="text-center">Wed</div>
        <div className="text-center">Thu</div>
        <div className="text-center">Fri</div>
        <div className="text-center">Sat</div>
      </div>

      <div className="space-y-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((d, di) => (
              d ? (
                <button
                  key={di}
                  className={`h-10 rounded-md text-sm text-center ${marked.has(`${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`) ? 'bg-gray-300 dark:bg-neutral-700' : 'bg-gray-50 dark:bg-neutral-800'}`}
                  onClick={() => onDateClick(year, month, d)}
                >
                  {d}
                </button>
              ) : (
                <div key={di} />
              )
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function daysInMonth(y: number, m: number) {
  return new Date(y, m, 0).getDate();
}