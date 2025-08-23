import { useState, useMemo, useRef, useEffect } from 'react';

type Item = { id: number; preview: string; content?: string; at?: string };

function heatClass(count: number) {
  // simple buckets for heatmap
  if (count === 0) return 'bg-white ';
  if (count <= 1) return 'bg-gray-50';
  if (count <= 3) return 'bg-gray-100';
  if (count <= 6) return 'bg-gray-200';
  return 'bg-gray-300';
}

function HourBlock({ hour, items }: { hour: string; items: Item[] }) {
  const [open, setOpen] = useState(false);
  const count = items.length;
  const cls = useMemo(() => heatClass(count), [count]);

  return (
    <section className={`rounded-xl overflow-hidden border mb-3 shadow-sm ${cls}`}>
      {/* If no items, render static row (no toggle) */}
      {count === 0 ? (
        <div className="w-full flex items-center justify-between px-4 py-3 opacity-80 min-w-0">
          <div className="text-sm font-medium text-gray-500 min-w-0 truncate">{hour}</div>
          <div className="text-xs text-gray-400 hidden sm:block">0 memos</div>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            className="w-full flex items-center justify-between px-4 py-3 min-w-0"
          >
            <div className="text-sm font-medium text-gray-700 min-w-0 truncate">{hour}</div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-xs text-gray-500 hidden sm:block">{count} memos</div>
              <div className="text-sm text-gray-400">{open ? '▴' : '▾'}</div>
            </div>
          </button>

          {open ? (
            <ul className="p-4 pb-4 space-y-3 bg-white/60">
              {items.map((n, idx) => (
                <MemoItem key={n.id} idx={idx} memo={n} />
              ))}
            </ul>
          ) : null}
        </>
      )}
    </section>
  );
}

export default HourBlock;

function MemoItem({ memo, idx }: { memo: Item; idx: number }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const [overflowing, setOverflowing] = useState(false);
  const collapsePx = 98; // ~6rem

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setOverflowing(el.scrollHeight > collapsePx + 1);
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
  }, [memo.content]);

  const text = memo.content || '—';

  return (
    <li key={memo.id} className={`${idx === 0 ? '' : 'mt-2'} p-3 rounded-md bg-white relative `}>
      <div ref={ref} className="text-sm text-gray-900 whitespace-pre-wrap break-words" style={!expanded && overflowing ? { maxHeight: `${collapsePx}px`, overflow: 'hidden' } : undefined}>
        {text}
      </div>
      {overflowing ? (
        <button className="text-xs mt-2" onClick={() => setExpanded((s) => !s)}>
          {expanded ? 'Show less' : 'Read more'}
        </button>
      ) : null}

      {memo.at ? (
        <>
          <div className="text-xs text-gray-400 block sm:hidden mt-2">
            {new Date(memo.at).toLocaleTimeString()}
          </div>
          <div className="text-xs text-gray-400 absolute right-3 bottom-3 hidden sm:block">
            {new Date(memo.at).toLocaleTimeString()}
          </div>
        </>
      ) : null}
    </li>
  );
}