import { useEffect } from 'react';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  loading = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg p-5 w-[90%] max-w-xs text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <h3 id="confirm-dialog-title" className="text-sm font-medium mb-2">
            {title}
          </h3>
        ) : null}
        {description ? <div className="text-xs text-gray-600 dark:text-gray-300 mb-4">{description}</div> : null}

        <div className="flex justify-center gap-2">
          <button
            className="mt-2 px-3 py-1 rounded bg-gray-100 dark:bg-white/5 text-xs"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            className="mt-2 px-3 py-1 rounded bg-black text-white text-xs"
            onClick={async () => await onConfirm()}
            disabled={loading}
          >
            {loading ? `${confirmLabel}...` : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
