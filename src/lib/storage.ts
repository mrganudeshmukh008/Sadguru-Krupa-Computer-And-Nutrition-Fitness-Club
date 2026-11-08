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
    created_at: "2026-11-08T08:49:05.942Z",
    pinned: true,
  },
  {
    id: "c8e192a4-7f89-4b11-9a25-e5f8841a0e62",
    name: "रामेश्वरी कुमावत",
    weight_note: "वजन घट व फिटनेस परिवर्तन — ऊर्जा व निरोगी जीवनशैली",
    image_url: "/testimonials/rameshwari_kumawat.jpg",
    created_at: "2026-11-08T10:00:00.000Z",
    pinned: false,
  },
  {
    id: "8c1ba433-0d13-4c5c-9dd6-fa2e5fbbae84",
    name: "सुशिल मोहाळे",
    weight_note: "वजन घट व फिटनेस परिवर्तन — ऊर्जा व स्टॅमिना सुधारला",
    image_url: "/testimonials/8c1ba433-0d13-4c5c-9dd6-fa2e5fbbae84.jpg",
    created_at: "2026-11-08T08:49:04.942Z",
    pinned: false,
  },
];

const STORAGE_KEY = "sadguru_testimonials_v3";

function sortWithPinnedFirst(list: Testimonial[]): Testimonial[] {
  return [...list].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });
}

export function getStoredTestimonials(): Testimonial[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TESTIMONIALS));
      return DEFAULT_TESTIMONIALS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const updated = parsed.map((t: Testimonial) => {
        if (
          t.id === "51096841-3ce3-4d44-a569-9a6b465ade41" ||
          t.name.includes("भागवतराव")
        ) {
          return { ...t, pinned: true };
        }
        return t;
      });
      return sortWithPinnedFirst(updated);
    }
    return DEFAULT_TESTIMONIALS;
  } catch {
    return DEFAULT_TESTIMONIALS;
  }
}

// Fetch from online server with localStorage sync
export async function fetchOnlineTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch('/api/testimonials', {
      headers: { 'Cache-Control': 'no-cache' }
    });
    if (res.ok) {
      const data: Testimonial[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return sortWithPinnedFirst(data);
      }
    }
  } catch (err) {
    console.warn('Server fetch error, using local cached data', err);
  }
  return getStoredTestimonials();
}

// Save to online server
export async function saveTestimonialOnline(payload: {
  name: string;
  weight_note: string;
  image: string;
  pin: string;
}): Promise<Testimonial> {
  const res = await fetch('/api/testimonials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to save on server');
  }

  const result = await res.json();
  if (result.all && Array.isArray(result.all)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result.all));
  }
  return result.story;
}

// Delete from online server
export async function deleteTestimonialOnline(id: string, pin: string): Promise<boolean> {
  const res = await fetch(`/api/testimonials/${id}?pin=${encodeURIComponent(pin)}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete on server');
  }

  const result = await res.json();
  if (result.all && Array.isArray(result.all)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result.all));
  }
  return true;
}

// Toggle pinned on online server
export async function togglePinOnline(id: string, pin: string): Promise<Testimonial[]> {
  const res = await fetch(`/api/testimonials/${id}/pin?pin=${encodeURIComponent(pin)}`, {
    method: 'PATCH',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to pin on server');
  }

  const result = await res.json();
  if (result.all && Array.isArray(result.all)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result.all));
    return result.all;
  }
  return getStoredTestimonials();
}

// Reset on online server
export async function resetTestimonialsOnline(pin: string): Promise<Testimonial[]> {
  const res = await fetch('/api/testimonials/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to reset on server');
  }

  const result = await res.json();
  if (result.all && Array.isArray(result.all)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result.all));
    return result.all;
  }
  return DEFAULT_TESTIMONIALS;
}

export function verifyCoachPin(pin: string): boolean {
  return pin.trim() === COACH_PIN;
}
