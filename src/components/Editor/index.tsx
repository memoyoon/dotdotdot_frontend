import { useState, useRef, useEffect } from 'react';
import { db } from '../../db/notesDb';
import type { Note } from '../../db/notesDb';

export default function NoteEditor() {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle'|'saving'|'saved'>('idle');
  const timerRef = useRef<number | null>(null);

  const saveNote = async (text: string) => {
    if (!text.trim()) return;
    setStatus('saving');
    const note: Note = { content: text, at: new Date().toISOString(), synced: false };
    await db.notes.add(note);
    setStatus('saved');
    // 잠깐 표시 후 idle
    window.setTimeout(() => setStatus('idle'), 800);
  };

  // DB에서 아직 서버에 동기화되지 않은 메모들 전송 시도
  const flushUnsynced = async () => {
  const unsynced = await db.notes.filter((n: Note) => n.synced !== true).toArray();
    if (!unsynced.length) return;

    for (const note of unsynced) {
      try {
        const res = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(note),
        });
        if (res.ok) {
          // 성공 시 synced=true로 업데이트
          await db.notes.update(note.id!, { synced: true });
        }
      } catch {
        // 실패하면 그대로 두고 다음에 다시 시도
      }
    }
  };

  // 디바운스로 저장 시도
  const debouncedSave = (text: string) => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      saveNote(text);
    }, 600);
  };

  useEffect(() => {
    // 온라인 복구되면 큐 비우기
    const onOnline = () => flushUnsynced();
    window.addEventListener('online', onOnline);
    return () => {
      window.removeEventListener('online', onOnline);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);


    return (
    <section className="py-6">
      {/* 큰 제목 (아이폰 메모 신규 제목 느낌) */}
    {/* 중심 카드 느낌 */}

      {/* 종이 카드 느낌 */}
      <div
        className="
          rounded-3xl border border-black/10 dark:border-white/10
          bg-white dark:bg-black
          shadow-[0_1px_0_rgba(0,0,0,0.03)]
        w-full
        "
      >
  {/* 에디터 영역 */}
  <div className="p-4 sm:p-5 w-full">
          <textarea
            className="
              block w-full min-h-[46vh]
              bg-transparent
              caret-black dark:caret-white
              placeholder:text-black/40 dark:placeholder:text-white/40
              outline-none resize-none
              leading-relaxed text-[16.5px]
              selection:bg-black/10 dark:selection:bg-white/20
            "
            placeholder="지금 떠오른 걸 바로 적어보세요…"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              debouncedSave(e.target.value);
            }}
          />

          {/* 하단 메타 바 */}
          <div className="mt-3 flex items-center justify-between text-xs text-black/50 dark:text-white/50">
            <div className="tabular-nums">
              {value.length.toLocaleString()} chars
            </div>
            <div className="flex items-center gap-2">
              <span
                className={
                  status === 'saving'
                    ? 'inline-flex items-center gap-1'
                    : status === 'saved'
                    ? 'opacity-70'
                    : 'opacity-40'
                }
              >
                {status === 'saving' && <span className="animate-pulse">●</span>}
                {status === 'saving' ? '저장 중…' : status === 'saved' ? '저장됨' : '자동 저장'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 가이드(선택) */}
      <p className="mt-3 text-[12px] text-black/40 dark:text-white/40">
        메모는 자동 저장되며, 오프라인에서도 입력할 수 있어요.
      </p>
    </section>
  );
}
