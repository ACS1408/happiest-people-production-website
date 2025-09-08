export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  place: string;
  department: string;
  resume: File | null;
}

export interface DepartmentOption {
  value: string;
  label: string;
}
