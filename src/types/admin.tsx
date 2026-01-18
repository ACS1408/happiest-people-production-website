export interface FormState {
  id?: string;
  title: string;
  imageUrl?: string; // optional now
  imageAlt: string;
  videoId?: string;
  imageSource?: 'upload' | 'url'; // 'upload' or 'url', defaults to 'upload'
}
