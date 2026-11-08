export type TabId = "computer" | "health";

export interface EnquiryOption {
  value: string;
  slug: string;
  label: string;
}

export interface ServiceDetail {
  id: string;
  titleEn: string;
  titleMr: string;
  desc: string;
  badge: string;
  iconName: string;
  documentsRequired: string[];
  features: string[];
  timeEstimate: string;
}

export interface HealthBenefit {
  id: string;
  title: string;
  desc: string;
  iconName: string;
  tips: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  weight_note?: string;
  image_url: string;
  created_at?: string;
  pinned?: boolean;
}
