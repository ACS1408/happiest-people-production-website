import { connectToDatabase } from '@/lib/mongoose/connection';
import { CareerApplicationModel } from '@/lib/mongoose/models/CareerApplication';
import type { CareerApplication, NewCareerApplication } from '@/types/careerApplication';

function toCareerApplication(doc: any): CareerApplication {
  return {
    id: doc._id ? doc._id.toString() : doc.id,
    firstName: doc.firstName,
    lastName: doc.lastName,
    email: doc.email,
    phone: doc.phone,
    place: doc.place,
    department: doc.department,
    resume: doc.resume,
    createdAt: doc.createdAt?.toISOString?.() || doc.createdAt,
    updatedAt: doc.updatedAt?.toISOString?.() || doc.updatedAt,
  };
}

export async function createCareerApplication(input: NewCareerApplication): Promise<CareerApplication> {
  await connectToDatabase();
  const created = await CareerApplicationModel.create(input);
  return toCareerApplication(created);
}

export interface PaginatedCareerApplications {
  data: CareerApplication[];
  total: number;
  page: number;
  pageSize: number;
}

export async function findCareerApplicationsPaginated(page = 1, pageSize = 10, search?: string): Promise<PaginatedCareerApplications> {
  await connectToDatabase();
  const safePage = Math.max(1, page);
  const safeSize = Math.min(Math.max(1, pageSize), 100);
  const skip = (safePage - 1) * safeSize;
  const filter: any = {};
  if (search && search.trim()) {
    const rx = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { firstName: rx },
      { lastName: rx },
      { email: rx },
      { phone: rx },
      { place: rx },
      { department: rx },
    ];
  }
  const [total, docs] = await Promise.all([
    CareerApplicationModel.countDocuments(filter),
    CareerApplicationModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeSize)
      .lean(),
  ]);
  return {
    data: docs.map(toCareerApplication),
    total,
    page: safePage,
    pageSize: safeSize,
  };
}

export async function getCareerApplication(id: string): Promise<CareerApplication | null> {
  await connectToDatabase();
  const doc = await CareerApplicationModel.findById(id);
  return doc ? toCareerApplication(doc) : null;
}
