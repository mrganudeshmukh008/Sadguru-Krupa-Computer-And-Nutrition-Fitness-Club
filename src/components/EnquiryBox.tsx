import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Send, Sparkles, Copy, CheckCheck } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { EnquiryOption } from '../types';

interface EnquiryBoxProps {
  variant: "computer" | "health";
  title: string;
  subtitle: string;
  selectorLabel: string;
  options: EnquiryOption[];
  buttonText: string;
  whatsappNumber: string;
  buildMessage: (name: string, mobile: string, topic: string) => string;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export default function EnquiryBox({
  variant,
  title,
  subtitle,
  selectorLabel,
  options,
  buttonText,
  whatsappNumber,
  buildMessage,
  onShowToast,
}: EnquiryBoxProps) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [topic, setTopic] = useState(options[0]?.value || "");
  const [errors, setErrors] = useState<{ name?: string; mobile?: string }>({});
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const nextErrors: { name?: string; mobile?: string } = {};
    if (name.trim().length < 2) {
      nextErrors.name = "कृपया तुमचे नाव टाका (Please enter your name)";
    }
    if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
      nextErrors.mobile = "१० अंकी वैध मोबाईल नंबर टाका (Enter valid 10-digit mobile)";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    if (!validate()) {
      onShowToast("कृपया नाव व १० अंकी मोबाईल नंबर तपासा", "error");
      return;
    }

    const message = buildMessage(name.trim(), mobile.trim(), topic);
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Direct navigation or opening
    window.open(url, "_blank", "noopener,noreferrer");
    onShowToast("व्हॉट्सॲप उघडत आहे… (Opening WhatsApp…)", "success");
  };

  const handleCopyMessage = () => {
    if (!validate()) {
      onShowToast("कृपया नाव व १० अंकी मोबाईल नंबर तपासा", "error");
      return;
    }
    const message = buildMessage(name.trim(), mobile.trim(), topic);
    navigator.clipboard.writeText(message);
    setCopied(true);
    onShowToast("मेसेज कॉपी झाला! व्हॉट्सॲपवर पेस्ट करा.", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      aria-label={title}
    >
      <div
        className={`glow-frame ${
          variant === "computer" ? "glow-frame-computer" : "glow-frame-health"
        }`}
      >
        <div className="overflow-hidden rounded-[calc(1rem-2px)] bg-white">
          {/* Header Bar */}
          <div
            className={`flex items-center gap-2 px-4 py-3 ${
              variant === "computer" ? "bg-slate-900 text-slate-50" : "bg-emerald-950 text-emerald-50"
            }`}
          >
            {variant === "computer" ? (
              <Send className="h-4 w-4 shrink-0 text-blue-400" aria-hidden />
            ) : (
              <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
            )}
            <h3 className="text-sm font-bold tracking-wide">{title}</h3>
          </div>

          <div className="space-y-4 px-4 py-4 sm:px-5">
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
              {subtitle}
            </p>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label
                htmlFor={`enquiry-name-${variant}`}
                className="text-xs font-bold text-slate-700 block"
              >
                तुमचे नाव (Your Name) <span className="text-rose-500">*</span>
              </label>
              <input
                id={`enquiry-name-${variant}`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा. राहुल पाटील"
                autoComplete="name"
                className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-rose-400 focus:ring-rose-200 bg-rose-50/30"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-100 bg-white"
                }`}
              />
              {errors.name && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Mobile Number Input */}
            <div className="space-y-1.5">
              <label
                htmlFor={`enquiry-mobile-${variant}`}
                className="text-xs font-bold text-slate-700 block"
              >
                मोबाईल नंबर (Mobile Number) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  +91
                </span>
                <input
                  id={`enquiry-mobile-${variant}`}
                  type="tel"
                  inputMode="numeric"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="9876543210"
                  autoComplete="tel"
                  className={`w-full h-11 pl-12 pr-3.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.mobile
                      ? "border-rose-400 focus:ring-rose-200 bg-rose-50/30"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-100 bg-white"
                  }`}
                />
              </div>
              {errors.mobile && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.mobile}</p>
              )}
            </div>

            {/* Topic Chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                {selectorLabel}
              </span>
              <div className="flex flex-wrap gap-2">
                {options.map((opt) => {
                  const selected = topic === opt.value;
                  return (
                    <motion.button
                      key={opt.value}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTopic(opt.value)}
                      aria-pressed={selected}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all ${
                        selected
                          ? variant === "computer"
                            ? "border-blue-600 bg-blue-50 text-blue-800 shadow-sm ring-1 ring-blue-500"
                            : "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm ring-1 ring-emerald-500"
                          : "border-slate-200 bg-slate-50/70 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {selected && <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden />}
                      {opt.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Submit & Copy Buttons */}
            <div className="pt-2 space-y-2">
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsAppClick}
                className="animate-cta-pulse flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#25D366] text-sm font-bold text-[#062E12] transition-colors hover:bg-[#20ba59] active:bg-[#1caa51]"
              >
                <WhatsAppIcon className="w-5 h-5 fill-current" />
                <span>{buttonText}</span>
              </motion.button>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">मेसेज कॉपी झाला! (Copied)</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>मेसेज कॉपी करा (Copy Message)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
