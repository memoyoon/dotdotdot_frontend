import { useEffect, useRef, useState } from 'react';
import { Trash2 } from 'react-feather';
import type { Note } from '../../db/notesDb';

function fmt(dateIso: string) {
  try {
    return new Date(dateIso).toLocaleString();
  } catch {
    return dateIso;
  }
}

export default function MemoCard({
  note,
  onSelect,
  onDelete,
  expandedIds,
  setExpandedIds,
  collapsePx,
}: {
  note: Note;
  onSelect?: (note: Note) => void;
  onDelete?: (id: number) => Promise<void> | void;
  expandedIds: Set<number>;
  setExpandedIds: React.Dispatch<React.SetStateAction<Set<number>>>;
  collapsePx: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      setOverflowing(el.scrollHeight > collapsePx + 1);
    };
    measure();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }
    window.addEventListener('resize', measure);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [note.content, collapsePx]);

  const expanded = note.id != null && expandedIds.has(note.id);

  return (
    <article
      key={note.id}
      className="group rounded-xl border border-gray-100 p-3 bg-white shadow-sm relative"
    >
      <div className="text-xs text-gray-400 mb-2">{fmt(note.at)}</div>
      <button
        aria-label="delete"
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 rounded"
        onClick={async (e) => {
          e.stopPropagation();
          if (onDelete && note.id != null) await onDelete(note.id);
        }}
      >
        <Trash2 size={14} />
      </button>

      <div
        ref={ref}
        className="text-sm text-gray-900 whitespace-pre-wrap break-words cursor-pointer"
        onClick={() => onSelect && onSelect(note)}
        style={!expanded && overflowing ? { maxHeight: `${collapsePx}px`, overflow: 'hidden' } : undefined}
      >
        {note.content || '—'}
      </div>

      {overflowing ? (
        <button
          className="text-xs text-blue-500 mt-2"
          onClick={(e) => {
            e.stopPropagation();
            if (note.id == null) return;
            setExpandedIds((s) => {
              const copy = new Set(s);
              if (copy.has(note.id!)) copy.delete(note.id!);
              else copy.add(note.id!);
              return copy;
            });
          }}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      ) : null}
    </article>
  );
}
