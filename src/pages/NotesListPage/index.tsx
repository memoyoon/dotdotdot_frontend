
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMotionValue, animate } from 'framer-motion';
import { db, type Note } from '../../db/notesDb';
import NotesMemoCard from '../../components/MemoCard/NotesMemoCard';

/* logo removed from this page; use global header branding */

// use NotesMemoCard component

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function NotesListPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [atTop, setAtTop] = useState<boolean>(false);
  // footer removed; header is sticky

  const progress = useMotionValue(0);

  const load = async () => {
    const arr = await db.notes.orderBy('at').toArray();
    setNotes(arr);
  };

  useEffect(() => {
    load();
    // no polling; refresh happens on actions
  }, []);

  const latest = useMemo(() => (notes.length ? notes[notes.length - 1] : null), [notes]);
  const older = useMemo(() => (notes.length ? notes.slice(0, -1) : []), [notes]);

  useEffect(() => {
    const el = containerRef.current;
    const hero = heroRef.current;
    if (!el || !hero || !latest) return;

    requestAnimationFrame(() => {
      const elH = el.clientHeight;
      const heroBox = hero.getBoundingClientRect();
      const heroTopInContainer = hero.offsetTop;
      const targetScroll = heroTopInContainer - (elH - heroBox.height) / 2;
      el.scrollTo({ top: targetScroll, behavior: 'auto' });
    });
  }, [latest]);

  // footer removed; no on-first-scroll behavior needed

  useEffect(() => {
    const el = containerRef.current;
    const hero = heroRef.current;
    if (!el || !hero) return;

    const onScroll = () => {
  // update atTop when scrolled to the very top
  setAtTop(el.scrollTop <= 1);
      const elH = el.clientHeight;
      const heroTop = hero.offsetTop;
      const heroH = hero.clientHeight || elH * 0.5;
      const heroCenterY = heroTop - elH / 2 + heroH / 2;
      const dy = el.scrollTop - heroCenterY;

      const p = clamp((-dy + 120) / (200 + 120), 0, 1);
      progress.set(p);
    };

  onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [progress]);

  const toggleExpand = () => {
    const current = progress.get();
    const next = current < 0.5 ? 1 : 0;
    animate(progress, next, { duration: 0.35, ease: [0.22, 1, 0.36, 1] });
  };

  const handleDelete = async (id: number) => {
    await db.notes.delete(id);
    await load();
  };

  return (
    <div
      ref={containerRef}
      className="mt-1 h-dvh w-full overflow-y-auto overflow-x-hidden bg-white text-black touch-pan-y pb-16 mt-1"
      style={{ paddingTop: atTop ? '61px' : 'var(--header-height)' }}
    >
      <div className="px-4 pt-6 max-w-md mx-auto">
        {older.map((n) => (
          <NotesMemoCard key={n.id} note={n} onDelete={handleDelete} />
        ))}
      </div>

      <div
        ref={heroRef}
        onClick={toggleExpand}
        aria-hidden
        data-top-offset
      >
          <div className="h-full flex flex-col items-stretch p-4 pt-0">
            {latest ? <NotesMemoCard note={latest} onDelete={handleDelete} /> : null}
          </div>
      </div>

      <div className="h-[40vh] flex items-center justify-center">
        <div className="flex gap-3">
          <span className="block w-3 h-3 rounded-full bg-black dark:bg-white" />
          <span className="block w-3 h-3 rounded-full bg-black dark:bg-white" />
          <span className="block w-3 h-3 rounded-full bg-black dark:bg-white" />
        </div>
      </div>

  {/* footer removed */}
    </div>
  );
}
