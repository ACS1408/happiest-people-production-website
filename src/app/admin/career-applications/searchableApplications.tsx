'use client';
import React, { useState, useCallback } from 'react';
import ApplicationsTable from './table';

export default function SearchableApplications() {
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');

  // debounce: update search 300ms after typing stops
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    if ((onChange as any).t) clearTimeout((onChange as any).t);
    (onChange as any).t = setTimeout(() => setSearch(val.trim()), 300);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <h1 className="ff-figtree text-3xl font-light">Career <span className="font-medium">Applications</span></h1>
        <div className="w-full sm:w-80 relative">
          <input
            value={input}
            onChange={onChange}
            placeholder="Search applications"
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/30 focus:border-neutral-900 transition pr-9"
          />
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </span>
        </div>
      </div>
      <ApplicationsTable search={search} key={search} />
    </div>
  );
}
