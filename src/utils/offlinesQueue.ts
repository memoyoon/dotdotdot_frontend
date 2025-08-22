import { createNote } from '../api/notes';
import type { NoteIn } from '../types/note';

type QueuedNote = NoteIn & { _tries: number; _nextAt: number };
const KEY = 'offlineNotesQueue:v1';
const NOW = () => Date.now();

function readQueue(): QueuedNote[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as QueuedNote[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(list: QueuedNote[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

function backoffMs(tries: number) {
  // 1s, 2s, 4s, 8s … 최대 1분
  return Math.min(60_000, 1000 * Math.pow(2, Math.max(0, tries - 1)));
}

/** 실패 시 큐 적재, 성공 시 그대로 종료 */
export async function enqueueNote(note: NoteIn): Promise<void> {
  try {
    await createNote(note);
  } catch {
    const list = readQueue();
    list.push({ ...note, _tries: 1, _nextAt: NOW() + backoffMs(1) });
    writeQueue(list);
  }
}

/** 큐 비우기: due된 항목만 전송 시도 (순차) */
export async function flushNotesQueue(): Promise<void> {
  const list = readQueue();
  if (list.length === 0) return;

  const now = NOW();
  const remain: QueuedNote[] = [];
  for (const item of list) {
    if (item._nextAt > now) {
      remain.push(item);
      continue;
    }
    try {
      await createNote({ content: item.content, createdAt: item.createdAt, tags: item.tags });
      // 성공: 버림
    } catch {
      const nextTries = item._tries + 1;
      remain.push({
        ...item,
        _tries: nextTries,
        _nextAt: now + backoffMs(nextTries),
      });
    }
  }
  writeQueue(remain);
}

let started = false;
/** 앱 시작 시 한 번만 초기화: 온라인 시/주기적으로 flush */
export function startNotesQueueWorker() {
  if (started) return;
  started = true;

  // 온라인 복귀 시 즉시 flush
  window.addEventListener('online', () => {
    void flushNotesQueue();
  });

  // 주기적 flush (30초): due 항목만 시도
  window.setInterval(() => {
    void flushNotesQueue();
  }, 30_000);
}
