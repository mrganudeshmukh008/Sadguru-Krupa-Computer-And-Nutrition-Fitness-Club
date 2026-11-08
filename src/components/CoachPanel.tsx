import React, { useState } from 'react';
import { ArrowLeft, LockKeyhole, ImagePlus, Trash2, RotateCcw, CheckCircle } from 'lucide-react';
import { Testimonial } from '../types';
import {
  verifyCoachPin,
  getStoredTestimonials,
  saveNewTestimonial,
  deleteStoredTestimonial,
  resetDefaultTestimonials,
} from '../lib/storage';

interface CoachPanelProps {
  onBack: () => void;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

// Convert chosen file to optimized dataUrl
function fileToDataUrl(file: File, maxDim = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("image parse failed"));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("canvas unavailable"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const CoachPanel: React.FC<CoachPanelProps> = ({ onBack, onShowToast }) => {
  const [pin, setPin] = useState(() => sessionStorage.getItem("coachPin") ?? "");
  const [unlocked, setUnlocked] = useState(() => {
    const saved = sessionStorage.getItem("coachPin");
    return saved ? verifyCoachPin(saved) : false;
  });
  const [name, setName] = useState("");
  const [weightNote, setWeightNote] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [stories, setStories] = useState<Testimonial[]>(() => getStoredTestimonials());
  const [isSaving, setIsSaving] = useState(false);

  const unlock = () => {
    if (verifyCoachPin(pin)) {
      sessionStorage.setItem("coachPin", pin);
      setUnlocked(true);
      onShowToast("कोच पॅनल अनलॉक झाले!", "success");
    } else {
      onShowToast("पिन चुकीचा आहे (Wrong PIN). टीप: 2906", "error");
    }
  };

  const handleSave = async () => {
    if (name.trim().length < 2) {
      onShowToast("कृपया नाव टाका (Enter name)", "error");
      return;
    }
    if (!image) {
      onShowToast("कृपया अगोदर/नंतर फोटो निवडा", "error");
      return;
    }

    setIsSaving(true);
    try {
      saveNewTestimonial({
        name: name.trim(),
        weight_note: weightNote.trim(),
        image_url: image,
      });
      setStories(getStoredTestimonials());
      setName("");
      setWeightNote("");
      setImage(null);
      onShowToast("यशोगाथा जोडली! (Story added)", "success");
    } catch {
      onShowToast("सेव्ह करताना त्रुटी आली", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirmId === id) {
      deleteStoredTestimonial(id);
      setStories(getStoredTestimonials());
      setConfirmId(null);
      onShowToast("यशोगाथा काढली (Story removed)", "success");
    } else {
      setConfirmId(id);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm("सर्व मूळ यशोगाथा पूर्ववत करायच्या का?")) {
      const defs = resetDefaultTestimonials();
      setStories(defs);
      onShowToast("मूळ यशोगाथा पूर्ववत केल्या!", "info");
    }
  };

  return (
    <div className="min-h-svh bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 py-3 shadow-xs">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              data-testid="nav-back-home"
              aria-label="Back to site"
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-slate-700" />
            </button>
            <div>
              <h1 className="text-base font-extrabold leading-tight">कोच पॅनल / Coach Panel</h1>
              <p className="text-[11px] text-slate-500 font-medium">यशोगाथा जोडा व व्यवस्थापित करा</p>
            </div>
          </div>

          {unlocked && (
            <button
              onClick={handleResetDefaults}
              className="text-xs text-slate-500 hover:text-slate-800 p-1 flex items-center gap-1 font-semibold"
              title="मूळ यशोगाथा परत आणा"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">रीसेट</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-md space-y-5 px-4 py-5">
        {!unlocked ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                <LockKeyhole className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">पिन टाका (Enter Coach PIN)</h2>
                <p className="text-xs text-slate-500">केवळ वेलनेस कोच भागवतराव यांच्यासाठी</p>
              </div>
            </div>

            <div className="mt-5 space-y-3.5">
              <input
                data-testid="input-coach-pin"
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={(e) => e.key === "Enter" && unlock()}
                placeholder="••••"
                className="w-full h-12 rounded-xl border border-slate-300 text-center text-xl tracking-[0.4em] font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
              <button
                data-testid="btn-coach-unlock"
                onClick={unlock}
                className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors shadow-sm"
              >
                अनलॉक करा (Unlock)
              </button>
              <p className="text-[11px] text-center text-slate-400">
                सुरक्षित कोच ॲक्सेस पिन: <span className="font-mono text-slate-600">2906</span>
              </p>
            </div>
          </section>
        ) : (
          <>
            {/* Add Story Card */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <ImagePlus className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">नवीन यशोगाथा (New Story)</h2>
                  <p className="text-xs text-slate-500">ग्राहकाचा अगोदर आणि नंतरचा फोटो जोडा</p>
                </div>
              </div>

              <div className="space-y-3.5 pt-1">
                <div className="space-y-1">
                  <label htmlFor="coach-name" className="text-xs font-bold text-slate-700 block">
                    नाव (Client Name) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="coach-name"
                    data-testid="input-coach-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="उदा. सुशिल मोहाळे"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="coach-note" className="text-xs font-bold text-slate-700 block">
                    वजन बदल नोंद (Weight note) — ऐच्छिक
                  </label>
                  <input
                    id="coach-note"
                    data-testid="input-coach-weight-note"
                    type="text"
                    value={weightNote}
                    onChange={(e) => setWeightNote(e.target.value)}
                    placeholder="उदा. वजन ७६ → ६१ किलो (१५ किलो घटवले)"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="coach-image" className="text-xs font-bold text-slate-700 block">
                    अगोदर/नंतर फोटो (Before/After photo) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="coach-image"
                    data-testid="input-coach-before-image"
                    type="file"
                    accept="image/*"
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const dataUrl = await fileToDataUrl(file);
                        setImage(dataUrl);
                        onShowToast("फोटो लोड झाला!", "success");
                      } catch {
                        onShowToast("फोटो वाचता आला नाही", "error");
                      }
                    }}
                  />

                  {image && (
                    <div className="mt-2 relative rounded-2xl overflow-hidden border border-slate-200">
                      <img
                        src={image}
                        alt="preview"
                        data-testid="img-coach-preview"
                        className="w-full max-h-64 object-cover"
                      />
                      <span className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/60 text-white text-[10px] font-bold">
                        फोटो प्रिव्ह्यू
                      </span>
                    </div>
                  )}
                </div>

                <button
                  data-testid="btn-testimonial-save"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isSaving ? "सेव्ह होत आहे…" : "यशोगाथा जोडा (Add Story)"}</span>
                </button>
              </div>
            </section>

            {/* List Stories */}
            <section className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                सध्याच्या यशोगाथा (Current Stories — {stories.length})
              </h2>

              <div className="space-y-3">
                {stories.map((t) => (
                  <div
                    key={t.id}
                    data-testid={`testimonial-manage-${t.id}`}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs"
                  >
                    <img
                      src={t.image_url}
                      alt={t.name}
                      className="h-16 w-20 shrink-0 rounded-xl object-cover border border-slate-100"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900">{t.name}</p>
                      {t.weight_note && (
                        <p className="truncate text-xs font-medium text-emerald-700 mt-0.5">
                          {t.weight_note}
                        </p>
                      )}
                    </div>
                    <button
                      data-testid={`btn-testimonial-delete-${t.id}`}
                      onClick={() => handleDelete(t.id)}
                      className={`h-9 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        confirmId === t.id
                          ? "bg-rose-600 text-white hover:bg-rose-700 animate-pulse"
                          : "border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                      }`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      <span>{confirmId === t.id ? "खात्री?" : "काढा"}</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};
