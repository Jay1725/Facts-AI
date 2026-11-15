import { useCallback, useEffect, useState } from 'react';
import { deleteReport, listReports, type SavedReport } from './reportService';

type LoadStatus = 'loading' | 'ready' | 'error';

export function useSavedReports(limit: number) {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setReports(await listReports(limit));
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [limit]);

  useEffect(() => {
    void load();
  }, [load]);

  const removeReport = useCallback(async (id: string) => {
    await deleteReport(id);
    setReports((current) => current.filter((report) => report.id !== id));
  }, []);

  return { reports, status, reload: load, removeReport };
}
