'use client';

import { useState, useEffect } from 'react';

interface BusinessType {
  slug: string;
  [key: string]: string;
}

let cache: BusinessType[] | null = null;

export function useBusinessTypes() {
  const [types, setTypes] = useState<BusinessType[]>(cache || []);

  useEffect(() => {
    if (cache) { setTypes(cache); return; }
    fetch('/api/business-types')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          cache = data;
          setTypes(data);
        }
      })
      .catch(() => {});
  }, []);

  return types;
}

export function useCuisineLabel(locale: string) {
  const types = useBusinessTypes();
  return (slug: string) => {
    const t = types.find(bt => bt.slug === slug);
    return t ? (t[`name_${locale}`] || t.name_el || slug) : slug;
  };
}
