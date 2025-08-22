import { useState } from 'react';
import NoteEditor from '../../components/Editor';
import NoteList from './NoteList';

export default function NotePage() {
  const [showList, setShowList] = useState(true);

  return (
  <main className="max-w-6xl mx-auto md:px-4 px-4 py-6">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-4">
            <div />
            <div className="flex gap-2">
              <button
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 dark:bg-neutral-800"
                onClick={() => setShowList((s: boolean) => !s)}
              >
                {showList ? 'Hide notes' : 'Show notes'}
              </button>
            </div>
          </div>

          <section className="flex-1 w-full">
            <NoteEditor />
          </section>
        </div>

        {/* Sidebar: on small screens it becomes a full-width block when visible; on md+ it is a fixed-width sidebar */}
        {showList ? (
          <aside className="w-full md:w-80 shrink-0">
            <div className="sticky top-4 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 bg-white/80 dark:bg-neutral-900/80">Notes</div>
              <NoteList />
            </div>
          </aside>
        ) : null}
      </div>
    </main>
  );
}