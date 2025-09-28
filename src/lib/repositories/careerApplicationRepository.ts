import { connectToDatabase } from '@/lib/mongoose/connection';
import { CareerApplicationModel } from '@/lib/mongoose/models/CareerApplication';
import type { CareerApplication, NewCareerApplication } from '@/types/careerApplication';

function toCareerApplication(doc: any): CareerApplication {
  const json = doc.toJSON();
  return json as CareerApplication;
}

export async function createCareerApplication(input: NewCareerApplication): Promise<CareerApplication> {
  await connectToDatabase();
  const created = await CareerApplicationModel.create(input);
  return toCareerApplication(created);
}
