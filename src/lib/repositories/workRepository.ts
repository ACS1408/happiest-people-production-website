import { connectToDatabase } from '@/lib/mongoose/connection';
import { WorkModel } from '@/lib/mongoose/models/Work';
import type { NewWork, Work } from '@/types/works';
// Note: randomUUID not required; Mongo provides _id.

function toWork(doc: any): Work {
  return doc.toJSON() as Work;
}

export async function listWorks(): Promise<Work[]> {
  await connectToDatabase();
  const docs = await WorkModel.find().sort({ order: 1 }).lean();
  return docs.map((d: any) => ({
    id: d._id.toString(),
    title: d.title,
    image: d.image,
    videoId: d.videoId,
    createdAt: d.createdAt?.toISOString?.() || d.createdAt,
    updatedAt: d.updatedAt?.toISOString?.() || d.updatedAt,
    published: d.published,
    order: d.order,
  }));
}

export async function getPublishedWorks(): Promise<Work[]> {
  await connectToDatabase();
  const docs = await WorkModel.find({ published: true }).sort({ order: 1 }).lean();
  return docs.map((d: any) => ({
    id: d._id.toString(),
    title: d.title,
    image: d.image,
    videoId: d.videoId,
    createdAt: d.createdAt?.toISOString?.() || d.createdAt,
    updatedAt: d.updatedAt?.toISOString?.() || d.updatedAt,
    published: d.published,
    order: d.order,
  }));
}

export async function getWork(id: string): Promise<Work | null> {
  await connectToDatabase();
  const doc = await WorkModel.findById(id);
  return doc ? toWork(doc) : null;
}

export async function createWork(input: NewWork): Promise<Work> {
  await connectToDatabase();
  // If order not provided assign max+1
  let order = input.order;
  if (typeof order !== 'number') {
    const last: any = await WorkModel.findOne().sort({ order: -1 }).lean();
    order = last ? (last.order || 0) + 1 : 1;
  }
  const created = await WorkModel.create({ ...input, order });
  return toWork(created);
}

export async function updateWork(id: string, partial: Partial<Omit<Work,'id'|'createdAt'>>): Promise<Work | null> {
  await connectToDatabase();
  const updated = await WorkModel.findByIdAndUpdate(id, { ...partial }, { new: true });
  return updated ? toWork(updated) : null;
}

export async function deleteWork(id: string): Promise<boolean> {
  await connectToDatabase();
  const res = await WorkModel.findByIdAndDelete(id);
  return !!res;
}

export async function reorderWorks(orderIds: string[]): Promise<Work[]> {
  await connectToDatabase();
  const bulk = orderIds.map((id, idx) => ({
    updateOne: { filter: { _id: id }, update: { order: idx + 1 } }
  }));
  if (bulk.length) await WorkModel.bulkWrite(bulk);
  const docs = await WorkModel.find().sort({ order: 1 });
  return docs.map(toWork);
}
