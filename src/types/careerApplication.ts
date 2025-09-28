export interface CareerApplication {
  id: string; // maps to _id
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // stored formatted with dial code
  place: string;
  department: string; // department label resolved
  resume: string; // stored uploaded file url
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export type NewCareerApplication = Omit<CareerApplication, 'id' | 'createdAt' | 'updatedAt'>;
