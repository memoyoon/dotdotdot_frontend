export type Note = {
  id: string;
  content: string;
  createdAt: string; // YYYY-MM-DDTHH:mm:ss (로컬 기준)
  tags?: string[];
};

export type NoteIn = {
  content: string;
  createdAt: string; // YYYY-MM-DDTHH:mm:ss
  tags?: string[];
};