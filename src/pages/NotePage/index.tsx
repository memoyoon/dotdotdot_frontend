import NoteEditor from '../../components/Editor';

export default function NotePage() {

  return (
  <main className="mx-auto p-4">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="flex-1 w-full">
          <section className="flex-1 w-full">
            <NoteEditor onSaved={() => { /* noop */ }} />
          </section>
        </div>

      </div>
    </main>
  );
}