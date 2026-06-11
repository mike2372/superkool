export type JobStatus = 'pending_start' | 'navigating' | 'active' | 'completed';

export interface PartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  checked: boolean;
  isCustom?: boolean;
}

export interface Job {
  id: string; // e.g. #SK-9021 or #SK-9921
  title: string;
  type: 'Chemical Wash' | 'Standard Service' | 'Urgent Repair' | 'Chemical Overhaul' | 'Gas Refill' | 'General Repair';
  clientName: string;
  address: string;
  timeRange: string;
  etaStr?: string;
  dateStr: string;
  amount: number;
  siteImage: string;
  status: JobStatus;
  beforePhotos: string[];
  afterPhotos: string[];
  parts: PartItem[];
  clientSignature?: string; // base64 representation or verified indicator
  isPaid?: boolean;
}

export interface UnitProfile {
  id: string;
  name: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  tag?: string; // e.g. "Popular"
  icon: string; // lucide icon name
}

export type ViewScreen = 'customer-booking' | 'tech-dashboard' | 'tech-job-detail' | 'tech-earnings';
