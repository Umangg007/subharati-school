import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from './api';

const useApi = (path, options = {}, fallback = []) => {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest(path, options);
      const resolved = result && result.data !== undefined ? result.data : result;
      setData(Array.isArray(resolved) ? resolved : (resolved ?? fallback));
    } catch (err) {
      console.error(`[useApi] ${path}:`, err.message);
      setError(err.message);
      setData(fallback);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export default useApi;
