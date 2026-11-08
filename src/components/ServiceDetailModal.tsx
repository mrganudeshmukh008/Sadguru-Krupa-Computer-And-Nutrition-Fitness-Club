import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileCheck, Clock, ShieldCheck, ArrowRight, Phone } from 'lucide-react';
import { ServiceDetail } from '../types';
import { WhatsAppIcon } from './WhatsAppIcon';
import { WHATSAPP_NUMBER, SHOP_CALL_RAW } from '../lib/storage';

interface ServiceDetailModalProps {
  service: ServiceDetail | null;
  onClose: () => void;
  onEnquire: (serviceName: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onEnquire,
}) => {
  if (!service) return null;

  const handleWhatsApp = () => {
    const text = `नमस्कार सद्गुरू कृपा कॉम्प्युटर, मला "${service.titleMr} (${service.titleEn})" सेवेबाबत माहिती व काम करायचे आहे.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-5 text-white">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold tracking-wide uppercase">
                  {service.badge}
                </span>
                <h3 className="text-xl font-extrabold mt-1.5">{service.titleMr}</h3>
                <p className="text-xs text-blue-100 font-medium">{service.titleEn}</p>
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

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-4 text-slate-800 text-sm">
            <div>
              <p className="text-slate-600 font-medium leading-relaxed">{service.desc}</p>
            </div>

            {/* Turnaround Time */}
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50 border border-blue-100/80 text-blue-900">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="text-xs font-semibold">
                वेळेचा अंदाज: <span className="font-bold">{service.timeEstimate}</span>
              </div>
            </div>

            {/* Required Documents */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                लागणारी कागदपत्रे (Required Documents)
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {service.documentsRequired.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Features */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                वैशिष्ट्ये (Service Features)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-100 font-medium text-slate-700">
                    ✓ {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer CTAs */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
            <a
              href={`tel:${SHOP_CALL_RAW}`}
              className="py-2.5 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 transition-colors flex items-center justify-center shrink-0"
              title="कॉल करा: 7507077272"
            >
              <Phone className="w-4 h-4 text-slate-700" />
            </a>
            <button
              onClick={() => {
                onEnquire(service.titleMr);
                onClose();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>फॉर्म भरा</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-xs font-bold text-[#062E12] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              title="व्हॉट्सॲप: 7507077272"
            >
              <WhatsAppIcon size={16} />
              <span>थेट व्हॉट्सॲप</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
