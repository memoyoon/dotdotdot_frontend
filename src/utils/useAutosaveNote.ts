import { useEffect } from 'react';
import { startNotesQueueWorker } from './offlinesQueue';

/**
 * Simple app-level autosave initializer.
 * - ensures the offline queue worker runs
 * - migrates any legacy data if needed (noop now)
 */
export default function useAutosaveNote() {
  useEffect(() => {
    startNotesQueueWorker();
    // future: migration or background sync could be added here
  }, []);
}
