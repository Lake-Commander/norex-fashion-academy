export interface AdditionalInfo {
  label: string;
  value: string;
}

export interface Review {
  user: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
  featured: boolean;
  inStock: boolean;
  additionalInfo?: AdditionalInfo[];
  reviews?: Review[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  image: string;
  curriculum: string[];
  featured: boolean;
}

export interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  course: string;
  experienceLevel: string;
  message?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}