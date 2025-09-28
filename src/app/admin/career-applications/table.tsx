'use client';
import React, { useCallback, useEffect, useState } from 'react';
import type { CareerApplication } from '@/types/careerApplication';
import Th from '@/components/AdminWorksDashboard/th';

interface ApiResponse { data: CareerApplication[]; total: number; page: number; pageSize: number; }

const PAGE_SIZE = 10;

function formatDate(iso: string) { try { return new Date(iso).toLocaleString(); } catch { return iso; } }

function buildResumeFileName(a: CareerApplication): string {
  const slug = (v: string) => (v || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'n-a';
  const extMatch = a.resume?.match(/\.([a-zA-Z0-9]{2,5})(?:$|[?#])/);
  const ext = extMatch ? '.' + extMatch[1].toLowerCase() : '.pdf';
  return `${slug(a.firstName)}-${slug(a.lastName)}-${slug(a.department)}-${a.id}${ext}`;
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  const rotate = direction === 'left' ? 'rotate-180' : '';
  return (
    <svg className={rotate} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function ApplicationsTable({ search = '' }: { search?: string }) {
  const [items, setItems] = useState<CareerApplication[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const cellCls = "px-4 py-3 align-center text-neutral-600 text-xs";

  const fetchPage = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE) });
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/career-applications?` + params.toString(), { cache: 'no-store' });
      const json: ApiResponse | { error: string } = await res.json();
      if ('error' in json) throw new Error(json.error);
      setItems(json.data);
      setTotal(json.total);
      setPage(json.page);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchPage(1); }, [fetchPage, search]);

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto border border-neutral-200 rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-neutral-600 text-[11px] uppercase tracking-wide">
            <tr>
              <Th className="px-4">Name</Th>
              <Th className="px-4">Email</Th>
              <Th className="px-4">Phone</Th>
              <Th className="px-4">Department</Th>
              <Th className="px-4">Location</Th>
              <Th className="px-4">Submitted</Th>
              <Th className="px-4">Resume</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {loading && <tr><td colSpan={7} className="py-10 text-center text-neutral-500">Loading…</td></tr>}
            {!loading && items.length === 0 && <tr><td colSpan={7} className="py-10 text-center text-neutral-400">No applications yet.</td></tr>}
            {!loading && items.map(a => (
              <tr key={a.id} className="hover:bg-neutral-50/80 transition">
                <td className={cellCls + ' font-medium text-neutral-900'}>
                  {a.firstName} {a.lastName}
                </td>
                <td className={cellCls}>
                  <a href={`mailto:${a.email}`} className="hover:underline break-all">{a.email}</a>
                </td>
                <td className={cellCls}>
                  <a href={`tel:${a.phone}`} className="hover:underline">{a.phone}</a>
                </td>
                <td className={cellCls}>{a.department}</td>
                <td className={cellCls}>{a.place}</td>
                <td className={cellCls + ' whitespace-nowrap'}>{formatDate(a.createdAt)}</td>
                <td className={cellCls}>
                  {a.resume ? (
                    <a
                      href={a.resume}
                      download={buildResumeFileName(a)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-neutral-700 hover:text-neutral-900 text-[11px] font-medium px-3 py-1 rounded-md border border-neutral-300 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900/30"
                    >
                      <DownloadIcon /> <span>Download</span>
                    </a>
                  ) : <span className="text-neutral-400 text-[11px]">N/A</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={p => fetchPage(p)} disable={loading} />
    </div>
  );
}

function Pagination({ page, totalPages, onChange, disable }: { page: number; totalPages: number; onChange: (p: number)=>void; disable?: boolean }) {
  const prev = () => page > 1 && onChange(page - 1);
  const next = () => page < totalPages && onChange(page + 1);
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <p className="text-neutral-500 text-xs">Page {page} of {totalPages}</p>
      <div className="flex items-center gap-2">
        <button type="button" onClick={prev} disabled={page===1 || disable} className="w-9 h-9 inline-flex items-center justify-center rounded-md border border-neutral-300 text-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900/30 cursor-pointer"><ChevronIcon direction='left' /><span className="sr-only">Previous</span></button>
        <button type="button" onClick={next} disabled={page===totalPages || disable} className="w-9 h-9 inline-flex items-center justify-center rounded-md border border-neutral-300 text-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900/30 cursor-pointer"><ChevronIcon direction='right' /><span className="sr-only">Next</span></button>
      </div>
    </div>
  );
}
