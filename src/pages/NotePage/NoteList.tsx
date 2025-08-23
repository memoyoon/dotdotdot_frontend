import { useEffect, useState } from 'react';
import { Trash2 } from 'react-feather';
import { db } from '../../db/notesDb';
import type { Note } from '../../db/notesDb';

type Props = {
  onSelect?: (note: Note) => void;
  onDelete?: (id: number) => Promise<void> | void;
  refreshSignal?: number;
};

function fmt(dateIso: string) {
  try {
    return new Date(dateIso).toLocaleString();
  } catch {
    return dateIso;
  }
}

export default function NoteList({ onSelect, onDelete, refreshSignal = 0 }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const load = async () => {
    const arr = await db.notes.orderBy('at').reverse().toArray();
    setNotes(arr);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 2000);
    return () => clearInterval(id);
  }, []);

  // reload when parent signals a refresh
  useEffect(() => {
    load();
  }, [refreshSignal]);

  if (!notes.length) {
    return <div className="text-sm text-gray-500">No notes yet</div>;
  }

  return (
    <div className="space-y-2 max-h-[60vh] md:max-h-[70vh] overflow-auto">
      {notes.map((n) => (
        <article
          key={n.id}
          className="group rounded-xl border border-gray-100 dark:border-neutral-800 p-3 bg-white dark:bg-neutral-900 shadow-sm relative"
        >
          <div className="text-xs text-gray-400 mb-2">{fmt(n.at)}</div>
          <button
            aria-label="delete"
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 rounded"
            onClick={async (e) => {
              e.stopPropagation();
              if (onDelete && n.id != null) await onDelete(n.id);
            }}
          >
            <Trash2 size={14} />
          </button>
          {(() => {
            const text = n.content || '';
            const limit = 240;
            const isLong = text.length > limit;
            const expanded = n.id != null && expandedIds.has(n.id);
            const short = isLong ? text.slice(0, limit) + '…' : text || '—';

            return (
              <>
                <div
                  className={`text-sm text-gray-900 dark:text-white ${!expanded && isLong ? 'line-clamp-3' : ''} cursor-pointer`}
                  onClick={() => onSelect && onSelect(n)}
                >
                  {expanded ? text : short}
                </div>
                {isLong ? (
                  <button
                    className="text-xs text-blue-500 mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (n.id == null) return;
                      setExpandedIds((s) => {
                        const copy = new Set(s);
                        if (copy.has(n.id!)) copy.delete(n.id!);
                        else copy.add(n.id!);
                        return copy;
                      });
                    }}
                  >
                    {expanded ? 'Show less' : 'Read more'}
                  </button>
                ) : null}
              </>
            );
          })()}
        </article>
      ))}
    </div>
  );
}
