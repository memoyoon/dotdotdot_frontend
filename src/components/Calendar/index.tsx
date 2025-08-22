import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function CalendarGrid() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const today = new Date();
  const year = Number(params.get('y')) || today.getFullYear();
  const month = Number(params.get('m')) || today.getMonth() + 1; // 1-12

  const days = useMemo(() => {
    const last = new Date(year, month, 0);
    return Array.from({ length: last.getDate() }, (_, i) => new Date(year, month - 1, i + 1));
  }, [year, month]);

  const prev = month - 1 || 12;
  const next = month + 1 > 12 ? 1 : month + 1;

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => nav(`/calendar?y=${month === 1 ? year - 1 : year}&m=${prev}`)}>&lt;</button>
        <strong>{year}.{String(month).padStart(2, '0')}</strong>
        <button onClick={() => nav(`/calendar?y=${month === 12 ? year + 1 : year}&m=${next}`)}>&gt;</button>
      </div>
      <div className="calendar-grid">
        {days.map((d) => {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return (
            <button
              key={d.toDateString()}
              className="calendar-cell"
              onClick={() => nav(`/timetable?date=${yyyy}-${mm}-${dd}`)}
            >
              {dd}
            </button>
          );
        })}
      </div>
    </div>
  );
}