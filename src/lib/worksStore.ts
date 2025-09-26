import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { Work, NewWork } from '@/types/works';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'works.json');

function readFile(): Work[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    const data = JSON.parse(raw) as Work[];
    return data.sort((a,b)=> a.order - b.order);
  } catch (e) {
    console.log(e)
    return [];
  }
}

function writeFile(works: Work[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(works, null, 2));
}

export function listWorks(): Work[] { return readFile(); }
export function getWork(id: string): Work | undefined { return readFile().find(w=>w.id===id); }
export function getPublishedWorks(): Work[] { return readFile().filter(w=>w.published); }

export function createWork(input: NewWork): Work {
  const now = new Date().toISOString();
  const works = readFile();
  const work: Work = { id: randomUUID(), createdAt: now, updatedAt: now, ...input };
  works.push(work);
  writeFile(works);
  return work;
}

export function updateWork(id: string, partial: Partial<Omit<Work,'id'|'createdAt'>>): Work | undefined {
  const works = readFile();
  const idx = works.findIndex(w=>w.id===id);
  if(idx === -1) return undefined;
  const now = new Date().toISOString();
  works[idx] = { ...works[idx], ...partial, id, updatedAt: now };
  writeFile(works);
  return works[idx];
}

export function deleteWork(id: string): boolean {
  const works = readFile();
  const next = works.filter(w=>w.id!==id);
  if(next.length === works.length) return false;
  writeFile(next);
  return true;
}

export function reorderWorks(orderIds: string[]): Work[] {
  const works = readFile();
  const map = new Map(orderIds.map((id,i)=> [id, i+1]));
  const updated = works.map(w=> ({...w, order: map.get(w.id) ?? w.order}));
  writeFile(updated);
  return updated.sort((a,b)=> a.order - b.order);
}
