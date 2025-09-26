export interface WorkImage {
  url: string;
  alt: string;
}

export interface Work {
  id: string; // uuid
  title: string;
  image: WorkImage;
  videoId?: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  published: boolean;
  order: number; // for manual ordering
}

export type NewWork = Omit<Work, "id" | "createdAt" | "updatedAt">;

export interface WorksResponse {
  data: Work[];
}
