import { useMemo, useState, useEffect } from 'react';
import { db } from '../../db/notesDb';
import { Calendar as CalendarIcon, ChevronDown } from 'react-feather';
import { useNavigate, useSearchParams } from 'react-router-dom';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function CalendarGrid() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const today = new Date();
  const initialYear = Number(params.get('y')) || today.getFullYear();

  const [year, setYear] = useState<number>(initialYear);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null); // 1-12
  const [isNarrow, setIsNarrow] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth <= 430 : false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setIsNarrow(window.innerWidth <= 430);
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const yearOptions = useMemo(() => {
    const start = year - 5;
    return Array.from({ length: 11 }, (_, i) => start + i);
  }, [year]);

  function openMonth(m: number) {
    // toggle expanded month but keep the months grid visible
    setExpandedMonth((cur) => (cur === m ? null : m));
  }

  function handleDateClick(y: number, m: number, d: number) {
    const mm = String(m).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    nav(`/timetable?date=${y}-${mm}-${dd}`);
  }

  

  const fmtHeader = (y: number) => {
    const d = new Date();
    if (y === d.getFullYear()) return 'Calendar — This year';
    return `Calendar — ${y}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          {!isNarrow && <h1 className="text-2xl font-semibold">{fmtHeader(year)}</h1>}
          <div className="text-sm text-gray-500">Yearly overview</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={year}
              onChange={(e) => { setYear(Number(e.target.value)); setExpandedMonth(null); }}
              className="px-4 py-2 rounded-md border bg-white dark:bg-neutral-900 text-base appearance-none pr-10"
              aria-label="Select year"
            >
              {yearOptions.map((yOpt) => (
                <option key={yOpt} value={yOpt}>{yOpt}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Months grid: always visible; nicer card styling */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {months.map((m) => (
          <div
            key={m}
            role="button"
            tabIndex={0}
            onClick={() => openMonth(m)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openMonth(m); }}
            className={`border rounded-lg bg-white dark:bg-neutral-900 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-150 overflow-hidden ${expandedMonth === m ? 'ring-2 ring-indigo-300 dark:ring-indigo-600' : ''}`}
            aria-expanded={expandedMonth === m}
          >
            <div className="px-4 py-3 bg-gradient-to-r from-gray-100 to-white dark:from-neutral-800 dark:to-neutral-900">
              <div className="flex items-center justify-between">
                <div className="font-medium text-lg">{MONTH_NAMES[m - 1]}</div>
                <button
                  className="text-xs text-gray-500"
                  onClick={(e) => { e.stopPropagation(); openMonth(m); }}
                  aria-label={`Open ${MONTH_NAMES[m - 1]}`}
                >
                  <CalendarIcon size={16} />
                </button>
              </div>
            </div>

            <div className="p-3">
              <MonthDetail year={year} month={m} onDateClick={handleDateClick} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthDetail({ year, month, onDateClick, compact }: { year: number; month: number; onDateClick: (y:number,m:number,d:number)=>void; compact?: boolean }) {
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

  const small = Boolean(compact);

  return (
    <div className={`${small ? 'mt-0' : 'mt-2'}`}>
      <div className="grid grid-cols-7 text-[10px] text-gray-500 mb-1">
        <div className="text-center">Sun</div>
        <div className="text-center">Mon</div>
        <div className="text-center">Tue</div>
        <div className="text-center">Wed</div>
        <div className="text-center">Thu</div>
        <div className="text-center">Fri</div>
        <div className="text-center">Sat</div>
      </div>

      <div className="space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((d, di) => (
              d ? (
                <button
                  key={di}
                  className={`w-full ${small ? 'h-8 text-xs' : 'h-10 text-sm'} rounded-md ${marked.has(`${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`) ? 'bg-gray-300 dark:bg-neutral-700' : 'bg-gray-50 dark:bg-neutral-800'}`}
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