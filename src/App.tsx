import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Monitor,
  HeartPulse,
  BadgeCheck,
  Sparkles,
  Laptop,
  Phone,
  Quote,
  UserCheck,
  TrendingDown,
  TrendingUp,
  Zap,
  Activity,
  ShieldCheck,
  Fingerprint,
  CreditCard,
  Printer,
  Layers,
  FileText,
  Clock,
  MapPin,
  CheckCircle2,
  Calculator,
  ChevronRight,
  Info,
  Calendar,
} from 'lucide-react';

import { TabId, ServiceDetail, HealthBenefit, Testimonial, EnquiryOption } from './types';
import { WhatsAppIcon } from './components/WhatsAppIcon';
import EnquiryBox from './components/EnquiryBox';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { BmiCalculatorModal } from './components/BmiCalculatorModal';
import { CoachPanel } from './components/CoachPanel';
import { ToastContainer, ToastMessage } from './components/Toast';
import {
  SHOP_PHONE,
  SHOP_CALL_RAW,
  WHATSAPP_NUMBER,
  getStoredTestimonials,
} from './lib/storage';

const TABS: { id: TabId; label: string; sub: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "computer", label: "Computer", sub: "कॉम्प्युटर", icon: Monitor },
  { id: "health", label: "Health", sub: "आरोग्य", icon: HeartPulse },
];

const COMPUTER_SERVICES: ServiceDetail[] = [
  {
    id: "csc-services",
    iconName: "ShieldCheck",
    titleEn: "CSC Services",
    titleMr: "सीएससी सेवा",
    desc: "सरकारी योजना, ७/१२ उतारा, ८-अ, उत्पन्न दाखला, जात प्रमाणपत्र व सर्व दाखले.",
    badge: "Govt Approved",
    timeEstimate: "तात्काळ / १-३ दिवस",
    documentsRequired: [
      "आधार कार्ड व रेशन कार्ड",
      "जुने कागदपत्र किंवा जमिनीचा गट नंबर",
      "उत्पन्नाचा स्वयंघोषणा किंवा सही",
      "पासपोर्ट साईज फोटो"
    ],
    features: [
      "७/१२ उतारा व ८-अ डिजिटल स्वाक्षरीसह",
      "उत्पन्न दाखला (Income Certificate)",
      "जात प्रमाणपत्र (Caste Certificate)",
      "पीएम किसान ई-केवायसी व नोंदणी"
    ]
  },
  {
    id: "aadhaar-card",
    iconName: "Fingerprint",
    titleEn: "Aadhaar Card",
    titleMr: "आधार कार्ड",
    desc: "आधार कार्ड प्रिंट, PVC स्मार्ट कार्ड व पत्ता/मोबाईल अपडेट मार्गदर्शन.",
    badge: "Instant Print",
    timeEstimate: "५ ते १० मिनिटे",
    documentsRequired: [
      "आधार नंबर किंवा एनरोलमेंट स्लिप",
      "नोंदणीकृत मोबाईल नंबर (OTP साठी)",
      "पत्ता बदल असल्यास लाईट बिल / रेशन कार्ड"
    ],
    features: [
      "ओरिजिनल वॉटरप्रूफ PVC आधार कार्ड",
      "कलर हाय-डेफिनिशन आधार प्रिंट",
      "मोबाईल नंबर लिंक मार्गदर्शन",
      "बायोमेट्रिक अपडेट सहाय्य"
    ]
  },
  {
    id: "pan-card",
    iconName: "CreditCard",
    titleEn: "Pan Card",
    titleMr: "पॅन कार्ड",
    desc: "नवीन पॅन कार्ड अर्ज, नाव/जन्मतारीख दुरुस्ती व आधार-पॅन लिंक सेवा.",
    badge: "New / Update",
    timeEstimate: "२-३ दिवसात e-PAN, १० दिवसात प्रत्यक्ष कार्ड",
    documentsRequired: [
      "आधार कार्ड (सध्याचा पत्ता योग्य असावा)",
      "२ नवीन पासपोर्ट साईज रंगीत फोटो",
      "स्वाक्षरी किंवा अंगठ्याचा ठसा",
      "जुने पॅन कार्ड झेरॉक्स (दुरुस्तीसाठी)"
    ],
    features: [
      "नवीन पॅन कार्ड तात्काळ प्रक्रिया",
      "नावात किंवा जन्मतारखेत अचूक दुरुस्ती",
      "आधार-पॅन लिकिंग पडताळणी",
      "हरवलेले पॅन कार्ड शोधणे"
    ]
  },
  {
    id: "xerox",
    iconName: "Printer",
    titleEn: "Xerox & Print",
    titleMr: "झेरॉक्स व प्रिंट",
    desc: "मोबाईल, व्हॉट्सॲप व ईमेल वरून डॉक्युमेंट, फोटो व मार्कशीट प्रिंट सेवा.",
    badge: "HD Quality",
    timeEstimate: "तात्काळ (Instant)",
    documentsRequired: [
      "व्हॉट्सॲप / ईमेल / पेनड्राइव्ह वरून फाईल",
      "PDF, JPEG, Word फाईल्स"
    ],
    features: [
      "स्पष्ट व गडद ब्लॅक & व्हाईट झेरॉक्स",
      "रंगीत हाय-डेफिनिशन फोटो प्रिंट",
      "हाय-रिझोल्युशन डॉक्युमेंट स्कॅनिंग",
      "मोबाईलवरून थेट व्हॉट्सॲप प्रिंट"
    ]
  },
  {
    id: "lamination",
    iconName: "Layers",
    titleEn: "Lamination",
    titleMr: "लॅमिनेशन",
    desc: "सर्व कागदपत्रे, मार्कशीट व ओळखपत्रांसाठी मजबूत वॉटरप्रूफ लॅमिनेशन.",
    badge: "Waterproof",
    timeEstimate: "५ मिनिटे",
    documentsRequired: [
      "लॅमिनेशन करायचे मूळ कागदपत्र",
      "A4, Legal, A3 किंवा कार्ड साईज"
    ],
    features: [
      "१००% वॉटरप्रूफ व दीर्घकाळ टिकणारे",
      "कागद दुमडण्यापासून संरक्षण",
      "सर्व आकारांसाठी उपलब्ध",
      "कडक व उच्च दर्जाची लॅमिनेशन फिल्म"
    ]
  },
  {
    id: "online-forms",
    iconName: "FileText",
    titleEn: "Online Forms",
    titleMr: "ऑनलाइन फॉर्म",
    desc: "नोकरी, सरकारी भरती, शाळा/कॉलेज प्रवेश व शासकीय योजनांचे अर्ज भरणे.",
    badge: "Fast Service",
    timeEstimate: "३० मिनिटे",
    documentsRequired: [
      "शैक्षणिक गुणपत्रिका (मार्कशीट्स)",
      "आधार कार्ड व फोटो-स्वाक्षरी",
      "जात / नॉन-क्रिमिलेअर (लागू असल्यास)",
      "चालू मोबाईल व ईमेल आयडी"
    ],
    features: [
      "पोलीस, तलाठी, रेल्वे, SSC, MPSC भरती अर्ज",
      "११ वी, पदवी, इंजिनिअरिंग प्रवेश फॉर्म",
      "महाडीबीटी (MahaDBT) स्कॉलरशिप फॉर्म",
      "अचूक व वेळेत फॉर्म सबमिशन पावतीसह"
    ]
  },
];

const COMPUTER_TOPICS: EnquiryOption[] = [
  { value: "CSC / सरकारी योजना", slug: "csc", label: "CSC / सरकारी योजना" },
  { value: "आधार कार्ड (Aadhaar)", slug: "aadhaar", label: "आधार कार्ड" },
  { value: "पॅन कार्ड (Pan Card)", slug: "pan-card", label: "पॅन कार्ड" },
  { value: "झेरॉक्स / लॅमिनेशन (Xerox)", slug: "xerox-lamination", label: "झेरॉक्स / लॅमिनेशन" },
  { value: "ऑनलाइन फॉर्म (Online Form)", slug: "online-form", label: "ऑनलाइन फॉर्म" },
  { value: "इतर काम (Other Work)", slug: "other", label: "इतर काम" },
];

const HEALTH_TOPICS: EnquiryOption[] = [
  { value: "वजन कमी करायचे (Weight Loss)", slug: "weight-loss", label: "वजन कमी करायचे" },
  { value: "वजन वाढवायचे (Weight Gain)", slug: "weight-gain", label: "वजन वाढवायचे" },
  { value: "फिटनेस व स्टॅमिना (Fitness)", slug: "fitness", label: "फिटनेस / स्टॅमिना" },
  { value: "डाएट प्लॅन (Diet Plan)", slug: "diet-plan", label: "डाएट प्लॅन" },
];

const HEALTH_BENEFITS: HealthBenefit[] = [
  {
    id: "weight-loss",
    title: "वजन घटवा (Weight Loss)",
    desc: "संतुलित पोषण आहाराद्वारे नैसर्गिकरित्या चरबी कमी करा.",
    iconName: "TrendingDown",
    tips: ["उपाशी न राहता वजन कमी करणे", "शरीरातील अतिरिक्त चरबी घटवणे", "पर्सनल डाएट चार्ट"]
  },
  {
    id: "weight-gain",
    title: "वजन वाढवा (Weight Gain)",
    desc: "निरोगी वजन व स्नायूंसाठी पर्सनल डाएट प्लॅन.",
    iconName: "TrendingUp",
    tips: ["योग्य मसल मास वाढवणे", "पोषक घटकांचे योग्य प्रमाण", "ऊर्जा व ताकद वाढवणे"]
  },
  {
    id: "energy",
    title: "स्टॅमिना व ऊर्जा (Energy)",
    desc: "दिवसभर ताजेतवाने राहण्यासाठी जीवनशैली मार्गदर्शन.",
    iconName: "Zap",
    tips: ["सकाळचा आळस दूर करणे", "पचनक्रिया सुधारणे", "मानसिक उत्साह टिकवणे"]
  },
  {
    id: "coaching",
    title: "१-टू-१ मार्गदर्शन (1-to-1)",
    desc: "वेलनेस कोच यांच्याशी थेट संपर्कात राहा.",
    iconName: "UserCheck",
    tips: ["दैनिक प्रगतीचा मागोवा", "साप्ताहिक वजन तपासणी", "व्हॉट्सॲपवर नियमित सपोर्ट"]
  },
];

const computerMessage = (name: string, mobile: string, topic: string) =>
  `नमस्कार सद्गुरू कृपा कॉम्प्युटर, माझे नाव ${name} आहे (${mobile}). मला "${topic}" बाबत काम व माहिती हवी आहे.`;

const healthMessage = (name: string, mobile: string, topic: string) =>
  `नमस्कार भागवतरावजी (वेलनेस कोच), माझे नाव ${name} आहे (${mobile}). मला "${topic}" बाबत मार्गदर्शन हवे आहे.`;

export default function App() {
  const [tab, setTab] = useState<TabId>("computer");
  const [view, setView] = useState<"site" | "coach">("site");
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
  const [isBmiOpen, setIsBmiOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load testimonials
  useEffect(() => {
    setTestimonials(getStoredTestimonials());
  }, [view]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getServiceIcon = (name: string) => {
    switch (name) {
      case "ShieldCheck":
        return ShieldCheck;
      case "Fingerprint":
        return Fingerprint;
      case "CreditCard":
        return CreditCard;
      case "Printer":
        return Printer;
      case "Layers":
        return Layers;
      case "FileText":
        return FileText;
      default:
        return Monitor;
    }
  };

  const getBenefitIcon = (name: string) => {
    switch (name) {
      case "TrendingDown":
        return TrendingDown;
      case "TrendingUp":
        return TrendingUp;
      case "Zap":
        return Zap;
      case "UserCheck":
        return UserCheck;
      default:
        return Sparkles;
    }
  };

  if (view === "coach") {
    return (
      <>
        <CoachPanel
          onBack={() => {
            setView("site");
            setTestimonials(getStoredTestimonials());
          }}
          onShowToast={showToast}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  return (
    <motion.div
      animate={{ backgroundColor: tab === "computer" ? "#F8FAFC" : "#F0FDF4" }}
      transition={{ duration: 0.35 }}
      className="min-h-svh text-slate-900 pb-28 selection:bg-blue-600 selection:text-white"
    >
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Top Header Switcher: Computer | Health */}
      <header
        className={`sticky top-0 z-40 px-4 py-3 backdrop-blur-md transition-colors duration-300 shadow-2xs ${
          tab === "computer"
            ? "border-b border-slate-200/80 bg-slate-50/85"
            : "border-b border-emerald-200/80 bg-emerald-50/85"
        }`}
      >
        <div
          data-testid="menu-switcher"
          className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/90 p-1.5 shadow-md shadow-slate-900/5 backdrop-blur-md"
        >
          {TABS.map(({ id, label, sub, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                data-testid={`tab-${id}`}
                aria-pressed={active}
                className={`relative flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 sm:px-5 py-1.5 text-sm font-bold transition-all ${
                  active ? "text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="active-tab-pill"
                    className={`absolute inset-0 rounded-full shadow-md ${
                      id === "computer" ? "bg-slate-900" : "bg-emerald-900"
                    }`}
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="text-left leading-tight">
                    <span className="block text-[13px]">{label}</span>
                    <span className="block text-[9px] font-semibold uppercase tracking-wider opacity-80">
                      {sub}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-md px-4 pt-4 space-y-6">
        <AnimatePresence mode="wait" initial={false}>
          {tab === "computer" ? (
            <motion.div
              key="computer"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Computer Hero Banner */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-orange-600 p-5 text-white shadow-xl"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-xs"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -bottom-14 -left-8 h-36 w-36 rounded-full bg-orange-400/25 blur-xs"
                  aria-hidden
                />
                
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold backdrop-blur border border-white/10">
                  <BadgeCheck className="h-3.5 w-3.5 text-blue-200" aria-hidden />
                  सरकारी व ऑनलाइन सेवा केंद्र
                </span>

                <div className="mt-3 flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl sm:text-[26px] font-black leading-tight">
                      सद्गुरू कृपा कॉम्प्युटर
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-blue-100 font-medium">
                      Online Work • CSC • Digital Seva Kendra
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/15 p-3 backdrop-blur border border-white/10 shrink-0" aria-hidden>
                    <Laptop className="h-7 w-7 text-white" />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-blue-100/90 pt-1 border-t border-white/15">
                  <span className="flex items-center gap-1">
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-300" /> विश्वासू सेवा
                  </span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" /> जलद सेवा
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-sky-300" /> रास्त दर
                  </span>
                </div>
              </motion.section>

              {/* Services Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    आमच्या सेवा / Our Services
                  </h2>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    माहितीसाठी कार्डवर क्लिक करा
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {COMPUTER_SERVICES.length} सेवा उपलब्ध
                </span>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-2 gap-3">
                {COMPUTER_SERVICES.map((srv, i) => {
                  const Icon = getServiceIcon(srv.iconName);
                  return (
                    <motion.article
                      key={srv.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: 0.04 * i, ease: "easeOut" }}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedService(srv)}
                      data-testid={`service-card-${srv.id}`}
                      className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-sm transition-all hover:shadow-md hover:border-blue-300 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Icon className="h-5 w-5" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                      </div>

                      <h3 className="mt-2.5 text-[15px] font-extrabold leading-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                        {srv.titleEn}
                      </h3>
                      <p className="text-xs font-semibold text-orange-600">{srv.titleMr}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500 line-clamp-2">
                        {srv.desc}
                      </p>
                      <span className="mt-auto pt-2 inline-block w-fit text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {srv.badge}
                      </span>
                    </motion.article>
                  );
                })}
              </div>

              {/* Document Helper Tips */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>आवश्यक कागदपत्रे मार्गदर्शक</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  कोणत्याही शासकीय योजना किंवा फॉर्मसाठी मूळ आधार कार्ड, चालू मोबाईल नंबर (OTP साठी) व २ पासपोर्ट फोटो सोबत ठेवावेत.
                </p>
              </div>

              {/* Enquiry Box */}
              <div>
                <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  चौकशी करा / Enquire Now
                </h2>
                <EnquiryBox
                  variant="computer"
                  title="ऑनलाइन काम चौकशी / Quick Enquiry"
                  subtitle="कोणत्या सेवेबद्दल विचारायचे आहे? माहिती भरा आणि थेट व्हॉट्सॲपवर चॅट करा."
                  selectorLabel="सेवा निवडा (Select Service)"
                  options={COMPUTER_TOPICS}
                  buttonText="व्हॉट्सॲपवर पाठवा (Chat on WhatsApp)"
                  whatsappNumber={WHATSAPP_NUMBER}
                  buildMessage={computerMessage}
                  onShowToast={showToast}
                />
              </div>

              {/* Shop Timings & Location */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs space-y-2.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>दुकान उघडण्याची वेळ (Shop Timings)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600 text-[11px]">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="font-bold text-slate-900 block">सोमवार - शनिवार</span>
                    <span>सकाळी ९:०० ते रात्री ८:३०</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="font-bold text-slate-900 block">रविवार</span>
                    <span>सकाळी १०:०० ते दुपारी २:००</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="health"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Health Hero Banner */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-lime-500 p-5 text-white shadow-xl"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-xs"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -bottom-14 -left-8 h-36 w-36 rounded-full bg-lime-300/25 blur-xs"
                  aria-hidden
                />
                
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold backdrop-blur border border-white/10">
                  <Sparkles className="h-3.5 w-3.5 text-lime-200" aria-hidden />
                  वजन नियंत्रण व वेलनेस सेंटर
                </span>

                <div className="mt-3 flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl sm:text-[26px] font-black leading-tight">
                      Nutrition Fitness Club
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-emerald-100 font-medium">
                      आरोग्य आणि जीवनशैली सल्लागार
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/15 p-3 backdrop-blur border border-white/10 shrink-0" aria-hidden>
                    <Activity className="h-7 w-7 text-white" />
                  </div>
                </div>
              </motion.section>

              {/* Coach Quote Card */}
              <motion.section
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.08, ease: "easeOut" }}
                className="relative overflow-hidden rounded-2xl border border-emerald-200/90 bg-white p-5 shadow-sm"
                data-testid="health-quote-card"
              >
                <div
                  className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-100/60 blur-xs"
                  aria-hidden
                />
                <Quote className="h-6 w-6 text-emerald-500" aria-hidden />
                <p className="mt-2 text-base sm:text-lg font-bold leading-relaxed text-emerald-950">
                  वजन वाढला आहे का ? व वजन वाढायचा आहे ? तर मला संपर्क करा.
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-emerald-100 pt-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
                      aria-hidden
                    >
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
                        वेलनेस कोच (Wellness Coach)
                      </p>
                      <p className="text-sm font-extrabold text-emerald-950">भागवतराव ह. देशमुख</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${SHOP_CALL_RAW}`}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center justify-center"
                      aria-label="Direct Call to Coach"
                      title="कॉल करा: 7507077272"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        "नमस्कार भागवतरावजी, मला वजन नियंत्रण व फिटनेस डाएट प्लॅन सुरू करायचा आहे.",
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-[#062E12] transition-colors flex items-center justify-center"
                      aria-label="Direct WhatsApp to Coach"
                      title="व्हॉट्सॲप: 7507077272"
                    >
                      <WhatsAppIcon size={18} />
                    </a>
                  </div>
                </div>
              </motion.section>

              {/* Interactive BMI & Diet Tool Teaser */}
              <div
                onClick={() => setIsBmiOpen(true)}
                className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-lime-600 text-white shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">तुमचा BMI व योग्य वजन तपासा</h3>
                    <p className="text-[11px] text-emerald-100">मोफत कॅल्क्युलेटर & रोजचे पाण्याचे प्रमाण</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/80" />
              </div>

              {/* Wellness Programs / Benefits */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">
                  आमचे कार्यक्रम / Wellness Programs
                </h2>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {HEALTH_BENEFITS.map((benefit, i) => {
                    const Icon = getBenefitIcon(benefit.iconName);
                    return (
                      <div
                        key={benefit.id}
                        className="p-3.5 rounded-2xl bg-white border border-emerald-100/90 shadow-2xs space-y-2"
                      >
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                          {benefit.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {benefit.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Free Wellness Consultation Box */}
              <div>
                <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">
                  सल्ला घ्या / Free Consultation
                </h2>
                <EnquiryBox
                  variant="health"
                  title="मोफत वेलनेस कन्सल्टेशन (Free Consultation)"
                  subtitle="वजन वाढवणे किंवा कमी करणे यासाठी थेट कोचशी व्हॉट्सॲपवर संपर्क साधा."
                  selectorLabel="तुमचे उद्दिष्ट (Your Goal)"
                  options={HEALTH_TOPICS}
                  buttonText="कोचशी व्हॉट्सॲपवर बोला (Chat with Coach)"
                  whatsappNumber={WHATSAPP_NUMBER}
                  buildMessage={healthMessage}
                  onShowToast={showToast}
                />
              </div>

              {/* Success Stories (यशोगाथा) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">
                    यशोगाथा / Success Stories
                  </h2>
                  <span className="text-[11px] font-bold text-emerald-700">
                    {testimonials.length} परिणाम
                  </span>
                </div>

                <div className="space-y-3">
                  {testimonials.map((t) => (
                    <motion.article
                      key={t.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      data-testid={`testimonial-card-${t.id}`}
                      className="overflow-hidden rounded-2xl border border-emerald-200/80 bg-white shadow-xs"
                    >
                      <img
                        src={t.image_url}
                        alt={`${t.name} — before & after`}
                        className="w-full max-h-72 object-cover object-top"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to placeholder if needed
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="flex items-center gap-2.5 px-4 py-3 bg-white">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
                          aria-hidden
                        >
                          <BadgeCheck className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-emerald-950">{t.name}</p>
                          {t.weight_note && (
                            <p className="truncate text-xs font-semibold text-emerald-700">
                              {t.weight_note}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>

                <p className="text-center text-[11px] leading-relaxed text-emerald-800/60 pt-1">
                  स्वीकार्य: निकाल व्यक्तीपरंते बदलतात (Results may vary person to person)
                </p>

                {/* Coach Portal Link */}
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setView("coach")}
                    data-testid="coach-login-link"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-emerald-200/80 bg-white/90 hover:bg-emerald-50 text-emerald-800 hover:text-emerald-950 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                  >
                    <span>कोचसाठी लॉगिन (For Coach Login)</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Info */}
        <footer className="pt-4 text-center space-y-1">
          <p className="text-[11px] font-medium leading-relaxed text-slate-400">
            सद्गुरू कृपा कॉम्प्युटर &amp; Nutrition Fitness Club
          </p>
          <p className="text-[11px] font-bold text-slate-500">
            संपर्क / WhatsApp: {SHOP_PHONE}
          </p>
        </footer>
      </main>

      {/* Floating Bottom Quick Contact Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-md shadow-lg">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <a
            href={`tel:${SHOP_CALL_RAW}`}
            data-testid="quick-call-btn"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-bold text-white transition-colors hover:bg-slate-800 active:bg-slate-950 shadow-xs"
          >
            <Phone className="h-4 w-4 text-white" aria-hidden />
            <span>कॉल करा</span>
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              tab === "computer"
                ? "नमस्कार सद्गुरू कृपा कॉम्प्युटर, मला ऑनलाइन कामाबाबत माहिती हवी आहे."
                : "नमस्कार भागवतरावजी (वेलनेस कोच), मला आरोग्याबाबत माहिती हवी आहे.",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="quick-whatsapp-btn"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-bold text-[#062E12] transition-colors hover:bg-[#20ba59] active:bg-[#1caa51] shadow-xs"
          >
            <WhatsAppIcon size={18} />
            <span>व्हॉट्सॲप</span>
          </a>
        </div>
      </div>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onEnquire={(serviceName) => {
          showToast(`"${serviceName}" निवडले. फॉर्म भरून पाठवा!`, "info");
        }}
      />

      {/* BMI Calculator Modal */}
      <BmiCalculatorModal
        isOpen={isBmiOpen}
        onClose={() => setIsBmiOpen(false)}
        onShowToast={showToast}
      />
    </motion.div>
  );
}
