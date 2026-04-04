'use client';

import { useState, useEffect } from 'react';

export function useLiveData<T>(apiUrl: string, seedData: T[]): { data: T[]; isLive: boolean } {
  const [data, setData] = useState<T[]>(seedData);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(apiUrl, { signal: controller.signal })
      .then((r) => r.json())
      .then((dbData: T[]) => {
        if (Array.isArray(dbData)) {
          setData(dbData);
          setIsLive(true);
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, [apiUrl]);

  return { data, isLive };
}

export function useLiveSingle<T>(apiUrl: string, seedItem: T | null): { data: T | null; isLive: boolean } {
  const [data, setData] = useState<T | null>(seedItem);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(apiUrl, { signal: controller.signal })
      .then((r) => r.json())
      .then((dbItem: T | null) => {
        if (dbItem && typeof dbItem === 'object' && 'id' in dbItem) {
          setData(dbItem);
          setIsLive(true);
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, [apiUrl]);

  return { data, isLive };
}
