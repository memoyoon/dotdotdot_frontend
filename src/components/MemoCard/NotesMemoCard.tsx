import { useEffect, useState } from 'react';
import { Trash2 } from 'react-feather';
import type { Note } from '../../db/notesDb';
import ConfirmDialog from '../ConfirmDialog';

const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

export default function NotesMemoCard({ note, onDelete }: { note: Note; onDelete?: (id: number) => Promise<void> | void }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showConfirm) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowConfirm(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showConfirm]);

  const handleDelete = async () => {
    if (note.id == null || !onDelete) return;
    try {
      setLoading(true);
      await onDelete(note.id);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4 mb-3 bg-white dark:bg-black shadow-sm">
        <div className="flex items-start justify-between">
          <div className="text-xs opacity-50 mb-1">{fmtTime(note.at)}</div>
          {note.id != null && (
            <button
              aria-label="delete"
              className="ml-2 text-gray-400 hover:text-red-500 p-1"
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirm(true);
              }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <div className="text-base leading-relaxed whitespace-pre-wrap">{note.content}</div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="이 메모를 삭제하시겠습니까?"
        description={undefined}
        confirmLabel="삭제"
        cancelLabel="취소"
        loading={loading}
      />
    </>
  );
}
