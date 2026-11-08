import { Testimonial } from '../types';

export const COACH_PIN = "2906";
export const SHOP_PHONE = "+91 7507077272";
export const SHOP_CALL_RAW = "+917507077272";
export const WHATSAPP_NUMBER = "917507077272";

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "51096841-3ce3-4d44-a569-9a6b465ade41",
    name: "भागवतराव देशमुख (वेलनेस कोच)",
    weight_note: "वजन: ७६ किलो → ६१ किलो (१५ किलो निरोगी वजन घटवले)",
    image_url: "/testimonials/51096841-3ce3-4d44-a569-9a6b465ade41.jpg",
    created_at: "2026-11-08T08:49:05.942Z"
  },
  {
    id: "8c1ba433-0d13-4c5c-9dd6-fa2e5fbbae84",
    name: "सुशिल मोहाळे",
    weight_note: "वजन घट व फिटनेस परिवर्तन — ऊर्जा व स्टॅमिना सुधारला",
    image_url: "/testimonials/8c1ba433-0d13-4c5c-9dd6-fa2e5fbbae84.jpg",
    created_at: "2026-11-08T08:49:04.942Z"
  },
  {
    id: "56b61c44-5ed4-4f04-bac9-5eca73c42acd",
    name: "क्लब सदस्य यशोगाथा",
    weight_note: "नियमित आहार नियोजन व जीवनशैली बदल",
    image_url: "/testimonials/56b61c44-5ed4-4f04-bac9-5eca73c42acd.jpg",
    created_at: "2026-11-08T08:50:28.080Z"
  }
];

const STORAGE_KEY = "sadguru_testimonials_v1";

export function getStoredTestimonials(): Testimonial[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TESTIMONIALS));
      return DEFAULT_TESTIMONIALS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_TESTIMONIALS;
  } catch {
    return DEFAULT_TESTIMONIALS;
  }
}

export function saveNewTestimonial(testimonial: Omit<Testimonial, "id" | "created_at">): Testimonial {
  const current = getStoredTestimonials();
  const newEntry: Testimonial = {
    ...testimonial,
    id: 'story-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    created_at: new Date().toISOString()
  };
  const updated = [newEntry, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Storage save error", e);
  }
  return newEntry;
}

export function deleteStoredTestimonial(id: string): boolean {
  const current = getStoredTestimonials();
  const updated = current.filter(t => t.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

export function resetDefaultTestimonials(): Testimonial[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TESTIMONIALS));
  return DEFAULT_TESTIMONIALS;
}

export function verifyCoachPin(pin: string): boolean {
  return pin.trim() === COACH_PIN;
}
