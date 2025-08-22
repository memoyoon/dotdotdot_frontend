import { useState, useMemo } from 'react';

type Item = { id: number; preview: string; content?: string; at?: string };

function heatClass(count: number) {
  // simple buckets for heatmap
  if (count === 0) return 'bg-white dark:bg-neutral-900';
  if (count <= 1) return 'bg-gray-50 dark:bg-neutral-800/10';
  if (count <= 3) return 'bg-gray-100 dark:bg-neutral-800/15';
  if (count <= 6) return 'bg-gray-200 dark:bg-neutral-700/20';
  return 'bg-gray-300 dark:bg-neutral-700/25';
}

function HourBlock({ hour, items }: { hour: string; items: Item[] }) {
  const [open, setOpen] = useState(false);
  const count = items.length;
  const cls = useMemo(() => heatClass(count), [count]);

  return (
    <section className={`rounded-xl overflow-hidden border mb-3 shadow-sm ${cls}`}>
      {/* If no items, render static row (no toggle) */}
      {count === 0 ? (
        <div className="w-full flex items-center justify-between px-4 py-3 opacity-80">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{hour}</div>
          <div className="text-xs text-gray-400">0 memos</div>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            className="w-full flex items-center justify-between px-4 py-3"
          >
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{hour}</div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">{count} memos</div>
              <div className="text-sm text-gray-400">{open ? '▴' : '▾'}</div>
            </div>
          </button>

          {open ? (
            <ul className="p-4 pb-4 space-y-3 bg-white/60 dark:bg-neutral-900/60">
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
  const text = memo.content || '';
  const limit = 240;
  const short = text.length > limit ? text.slice(0, limit) + '…' : text;
  return (
    <li key={memo.id} className={`${idx === 0 ? '' : 'mt-2'} p-3 rounded-md bg-white dark:bg-neutral-800 relative`}>
      <div className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
        {expanded ? text : short || '—'}
      </div>
      {text.length > limit ? (
        <button className="text-xs text-blue-500 mt-2" onClick={() => setExpanded((s) => !s)}>
          {expanded ? 'Show less' : 'Read more'}
        </button>
      ) : null}
      {memo.at ? (
        <div className="text-xs text-gray-400 dark:text-gray-500 absolute right-3 bottom-2">
          {new Date(memo.at).toLocaleTimeString()}
        </div>
      ) : null}
    </li>
  );
}