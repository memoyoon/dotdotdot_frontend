// src/db.ts
import Dexie, { type Table } from 'dexie';

export interface Note {
  id?: number;           // 자동 증가 키
  content: string;
  at: string;            // ISO 시간 문자열
  synced?: boolean;      // 서버 동기화 여부 (기본 false)
}

export class NotesDB extends Dexie {
  notes!: Table<Note>;

  constructor() {
    super('notesDB');
    this.version(1).stores({
      notes: '++id, at, synced', // id는 PK, at/synced로 인덱스
    });
  }
}

export const db = new NotesDB();
