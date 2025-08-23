import { Trash2 } from 'react-feather';
import type { Note } from '../../db/notesDb';

const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

export default function NotesMemoCard({ note, onDelete }: { note: Note; onDelete?: (id: number) => Promise<void> | void }) {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4 mb-3 bg-white dark:bg-black shadow-sm">
      <div className="flex items-start justify-between">
        <div className="text-xs opacity-50 mb-1">{fmtTime(note.at)}</div>
        {note.id != null && (
          <button
            aria-label="delete"
            className="ml-2 text-gray-400 hover:text-red-500 p-1"
            onClick={async (e) => {
              e.stopPropagation();
              if (onDelete) await onDelete(note.id!);
            }}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <div className="text-base leading-relaxed whitespace-pre-wrap">{note.content}</div>
    </div>
  );
}
