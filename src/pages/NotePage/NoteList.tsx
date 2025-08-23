import { useEffect, useRef, useState } from 'react';
import { db } from '../../db/notesDb';
import type { Note } from '../../db/notesDb';
import MemoCard from '../../components/MemoCard';

type Props = {
  onSelect?: (note: Note) => void;
  onDelete?: (id: number) => Promise<void> | void;
  refreshSignal?: number;
};


export default function NoteList({ onSelect, onDelete, refreshSignal = 0 }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const collapsePx = 98; // ~6rem — visual collapse height
  const load = async () => {
    // load in chronological order (oldest -> newest) so newest is rendered at the bottom
    const arr = await db.notes.orderBy('at').toArray();
    setNotes(arr);
  };

  const containerRef = useRef<HTMLDivElement | null>(null);

  // after notes render, position scroll so the newest items (bottom) appear near the middle
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // run after layout
    requestAnimationFrame(() => {
      // scroll so bottom is about halfway up the container
      const target = Math.max(0, el.scrollHeight - el.clientHeight / 2);
      el.scrollTop = target;
    });
  }, [notes.length]);

  useEffect(() => {
    // single initial load; switching to refreshSignal-driven updates instead of polling
    load();
    return () => {
      // no-op cleanup (no polling to clear)
    };
  }, []);

  // reload when parent signals a refresh
  useEffect(() => {
    load();
  }, [refreshSignal]);

  if (!notes.length) {
    return <div className="text-sm text-gray-500">No notes yet</div>;
  }

  return (
    <div className="flex flex-col">
      <div ref={containerRef} className="space-y-2 max-h-[60vh] md:max-h-[70vh] overflow-auto">
        {notes.map((n) => (
          <MemoCard
            key={n.id}
            note={n}
            onSelect={onSelect}
            onDelete={onDelete}
            expandedIds={expandedIds}
            setExpandedIds={setExpandedIds}
            collapsePx={collapsePx}
          />
        ))}
      </div>

    </div>
  );
}
