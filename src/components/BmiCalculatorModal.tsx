import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calculator, Droplets, Target, Sparkles, AlertCircle, Phone } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { WHATSAPP_NUMBER, SHOP_CALL_RAW } from '../lib/storage';

interface BmiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const BmiCalculatorModal: React.FC<BmiCalculatorModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [heightCm, setHeightCm] = useState<string>("168");
  const [weightKg, setWeightKg] = useState<string>("72");
  const [age, setAge] = useState<string>("32");
  const [goal, setGoal] = useState<string>("weight-loss");

  if (!isOpen) return null;

  const h = parseFloat(heightCm) / 100;
  const w = parseFloat(weightKg);
  let bmi = 0;
  let category = "";
  let categoryColor = "";
  let idealMin = 0;
  let idealMax = 0;
  let waterLiters = 0;

  if (h > 0 && w > 0) {
    bmi = parseFloat((w / (h * h)).toFixed(1));
    idealMin = parseFloat((18.5 * h * h).toFixed(1));
    idealMax = parseFloat((24.9 * h * h).toFixed(1));
    waterLiters = parseFloat((w * 0.035).toFixed(1));

    if (bmi < 18.5) {
      category = "कमी वजन (Underweight)";
      categoryColor = "text-amber-600 bg-amber-50 border-amber-200";
    } else if (bmi <= 24.9) {
      category = "निरोगी व योग्य वजन (Normal Weight)";
      categoryColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
    } else if (bmi <= 29.9) {
      category = "जास्त वजन (Overweight)";
      categoryColor = "text-orange-700 bg-orange-50 border-orange-200";
    } else {
      category = "स्थूलता (Obese)";
      categoryColor = "text-rose-700 bg-rose-50 border-rose-200";
    }
  }

  const handleSendToCoach = () => {
    if (!bmi || bmi <= 0) {
      onShowToast("कृपया उंची आणि वजन योग्य भरा", "error");
      return;
    }

    const goalText =
      goal === "weight-loss"
        ? "वजन कमी करणे (Weight Loss)"
        : goal === "weight-gain"
        ? "वजन वाढवणे (Weight Gain)"
        : "फिटनेस व ऊर्जा (Fitness & Stamina)";

    const message = `नमस्कार भागवतरावजी (वेलनेस कोच),
मी Nutrition Fitness Club ॲपवरून माझे BMI चेक केले:
• उंची: ${heightCm} सेमी
• वजन: ${weightKg} किलो
• वय: ${age} वर्षे
• BMI स्कोअर: ${bmi} (${category})
• माझे ध्येय: ${goalText}
• अपेक्षित योग्य वजन: ${idealMin} ते ${idealMax} किलो

मला आपल्या मार्गदर्शनाखाली पर्सनल डाएट प्लॅन सुरू करायचा आहे. कृपया मार्गदर्शन करावे.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    onShowToast("वेलनेस रिपोर्ट व्हॉट्सॲपवर पाठवत आहे…", "success");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-lime-600 p-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold">BMI & आरोग्य तपासणी</h3>
                  <p className="text-xs text-emerald-100">Nutrition Fitness Club विशेष टूल</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-5 overflow-y-auto space-y-4 text-slate-800 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  उंची सेमी मध्ये (Height cm)
                </label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="168"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  वजन किलो मध्ये (Weight kg)
                </label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="72"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  वय (Age in years)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="30"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  तुमचे मुख्य ध्येय (Goal)
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full h-11 px-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-200 bg-white"
                >
                  <option value="weight-loss">वजन कमी करणे</option>
                  <option value="weight-gain">वजन वाढवणे</option>
                  <option value="fitness">स्टॅमिना & फिटनेस</option>
                </select>
              </div>
            </div>

            {/* Results Card */}
            {bmi > 0 && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    तुमचा BMI स्कोर
                  </span>
                  <span className="text-2xl font-black text-emerald-900">{bmi}</span>
                </div>

                <div className={`p-2.5 rounded-xl border text-xs font-bold text-center ${categoryColor}`}>
                  {category}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-0.5">
                      <Target className="w-3.5 h-3.5 text-emerald-600" />
                      <span>योग्य वजन मर्यादा</span>
                    </div>
                    <p className="font-extrabold text-slate-900 text-sm">
                      {idealMin} - {idealMax} kg
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-0.5">
                      <Droplets className="w-3.5 h-3.5 text-sky-600" />
                      <span>रोजचे पाणी</span>
                    </div>
                    <p className="font-extrabold text-slate-900 text-sm">
                      {waterLiters} लिटर / दिवस
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-900/80 leading-relaxed bg-white/70 p-2.5 rounded-xl">
                  💡 <strong>कोच सल्ला:</strong> निरोगी वजन राखण्यासाठी दररोज ४० मिनिटे व्यायाम व योग्य प्रथिनेयुक्त पोषणाची गरज असते.
                </div>
              </div>
            )}
          </div>

          {/* Footer CTAs */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
            <a
              href={`tel:${SHOP_CALL_RAW}`}
              className="py-3 px-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 transition-colors flex items-center justify-center shrink-0"
              title="थेट कॉल करा: 7507077272"
            >
              <Phone className="w-4 h-4 text-slate-700" />
            </a>
            <button
              onClick={handleSendToCoach}
              className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-sm font-bold text-[#062E12] transition-colors flex items-center justify-center gap-2 shadow-sm"
              title="व्हॉट्सॲप: 7507077272"
            >
              <WhatsAppIcon size={18} />
              <span>हा रिपोर्ट कोच भागवतरावजींना पाठवा</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
