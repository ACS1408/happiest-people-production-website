export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  services: { value: string; label: string } | null;
  message: string;
}

export interface ServiceOption {
  value: string;
  label: string;
}
