'use client';

import { useEffect } from 'react';
import { seedDB } from '@/lib/db';

export function SeedDB() {
  useEffect(() => {
    seedDB();
  }, []);
  return null;
}
