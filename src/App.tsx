import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, 
  TrendingUp, 
  Trophy, 
  Award, 
  MessageSquare, 
  AlertTriangle, 
  Search, 
  Users, 
  Check, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Download, 
  Star, 
  Trash, 
  Play, 
  Bell, 
  ArrowLeft, 
  Send, 
  HelpCircle, 
  Briefcase, 
  ShieldCheck, 
  Copy, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  ChevronDown,
  User, 
  X, 
  Edit2, 
  Zap, 
  Eye, 
  Bookmark, 
  Info,
  Sliders,
  Sparkle,
  Phone,
  Video,
  MoreHorizontal,
  ArrowUp,
  MoreVertical,
  Clock,
  Paperclip
} from "lucide-react";
import { OperatorLevel, LevelInfo } from "./types";
import { 
  FIN_OPERATOR_LEVELS, 
  UZ_LEVEL_MAP, 
  UZ_DOCTOR_ALI_PRODUCTS, 
  UZ_ROLEPLAY_SCENARIOS, 
  UZ_QUIZ_QUESTIONS 
} from "./data/uzStaticData";
const doctorAliLogo = "/src/assets/images/doctor_ali_logo_1781694318087.jpg";
const fluidBackground = "/src/assets/images/fluid_sky_background_1781778365830.jpg";

const COMPLAINT_PRESETS = [
  { label: "Immunitet past + Shamollash", value: "immunitet_shamollash", products: ["one-shot-energy", "dr-ali-choy"] },
  { label: "Yo'tal + Balg'am + Nafas yo'li", value: "yotal_balgam_nafas", products: ["dr-ali-choy"] },
  { label: "Kamqonlik + Holsizlik", value: "kamqonlik_holsizlik", products: ["dr-ali-balzam"] },
  { label: "Xotira + Miya + Ko'z", value: "xotira_miya_koz", products: ["elixir"] },
  { label: "Bel + Bo'yin + Bo'g'im", value: "bel_boyin_bogim", products: ["dr-ali-krem"] },
  { label: "Jigar + Buyrak + Yurak", value: "jigar_buyrak_yurak", products: ["elixir"] },
  { label: "Operatsiyadan keyin tiklanish", value: "tiklanish", products: ["dr-ali-balzam"] },
  { label: "Bo'g'im + Holsizlik", value: "bogim_holsizlik", products: ["dr-ali-krem", "dr-ali-balzam"] },
  { label: "Shamollash + Kamqonlik + Charchoq", value: "shamollash_kamqonlik_charchoq", products: ["one-shot-energy", "dr-ali-choy"] }
];

interface LocalMessage {
  id: string;
  role: "user" | "model" | "system";
  text: string;
  timestamp: string;
  favorite?: boolean;
}

interface CustomerSession {
  id: string;
  customerName: string;
  createdAt: string;
  messages: LocalMessage[];
  activeAgentId: string;
  customerAge?: string;
  customerComplaint?: string;
  customerProduct?: string;
}

const RANDOM_CUSTOMERS = [
  { name: "Sardorbek, Toshkent", age: "32", complaint: "Bel og'rig'i va churra", product: "Doctor Ali Balzam va Krem" },
  { name: "Vazira opa, Farg'ona", age: "54", complaint: "Bo'g'im, tizza paylaridagi og'riqlar", product: "Doctor Ali Krem" },
  { name: "Shavkat aka, Samarqand", age: "47", complaint: "Xotira sustligi va bosh miya shamollashi", product: "Doctor Ali Elixir" },
  { name: "Nilufarxon, Andijon", age: "28", complaint: "Kamqonlik va doimiy holsizlik", product: "Doctor Ali Balzam" },
  { name: "Toshpo'lat amaki, Buxoro", age: "65", complaint: "Tez-tez shamollash, immunitet zaifligi", product: "One Shot Energy + Choy" },
  { name: "Maftuna, Namangan", age: "35", complaint: "Ko'z xiralashishi va asabiylik", product: "Doctor Ali Elixir" },
  { name: "Shohruh aka, Xorazm", age: "41", complaint: "Og'ir jismoniy charchoq va bel og'rig'i", product: "Doctor Ali Krem" }
];

export default function App() {
  // --- Profile State ---
  const [xp, setXp] = useState<number>(0);
  const [userName, setUserName] = useState<string>("Muzaffar Operator");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>("");

  // --- Stats / Progress Tracker ---
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);
  const [completedRoleplays, setCompletedRoleplays] = useState<number>(0);
  const [savedFavorites, setSavedFavorites] = useState<{ id: string; agentId: string; text: string; timestamp: string; agentName: string }[]>([]);
  const [notifications, setNotifications] = useState<{ id: string; text: string; time: string; read: boolean }[]>([
    { id: "n1", text: "Doctor Ali yangi adaptogen darmonlari bo'yicha muloqot mijozi yangilandi.", time: "Hozir", read: false },
    { id: "n2", text: "Professor sizga 'Mijoz Tahlilchisi' bo'limida yangi topshiriq biriktirdi.", time: "1 soat oldin", read: false },
    { id: "n3", text: "Xush kelibsiz! Kunlik sotuv balingizni oshirish uchun testlarni yeching.", time: "Kecha", read: true }
  ]);

  // --- Active Agent Area ---
  const [activeAgentId, setActiveAgentId] = useState<string | null>("universal-ai");

  // --- Persistent Customer Chat Sessions ---
  const [customerSessions, setCustomerSessions] = useState<CustomerSession[]>(() => {
    const saved = localStorage.getItem("doctor_ali_customer_sessions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: "sess-1",
        customerName: "Sardorbek, Toshkent (Bel og'rig'i)",
        createdAt: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
        messages: [
          {
            id: "welcome",
            role: "model",
            text: "Doctor Ali professional sotuv bo'yicha maslahat tizimiga xush kelibsiz!\n\nHozirgi muloqotdagi mijoz:\n👤 **Ism:** Sardorbek, Toshkent\n🎂 **Yoshi:** 32 yosh\n⚠️ **Muammo:** Bel og'rig'i va churra\n🌿 **Tavsiya mahsulot:** Doctor Ali Balzami va Kremi\n\nSiz sotuvni ehtiyoj tug'dirish qismini boshlash uchun chatga yozishingiz mumkin. Savolingizni yozing!",
            timestamp: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
          }
        ],
        activeAgentId: "universal-ai",
        customerAge: "32",
        customerComplaint: "Bel og'rig'i va churra",
        customerProduct: "Doctor Ali Balzam va Krem"
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    const saved = localStorage.getItem("doctor_ali_active_session_id");
    return saved || "sess-1";
  });

  useEffect(() => {
    localStorage.setItem("doctor_ali_customer_sessions", JSON.stringify(customerSessions));
  }, [customerSessions]);

  useEffect(() => {
    localStorage.setItem("doctor_ali_active_session_id", activeSessionId);
  }, [activeSessionId]);

  // --- Chat Control ---
  const [inputText, setInputText] = useState<string>(prev => prev || "");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeChats, setActiveChats] = useState<Record<string, LocalMessage[]>>({});
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("");

  // --- Interactive Features (TTS & Voice) ---
  const [voiceInputActive, setVoiceInputActive] = useState<boolean>(false);
  const [wordWaveInterval, setWordWaveInterval] = useState<number>(1);
  const [currentlySpeaking, setCurrentlySpeaking] = useState<string | null>(null);

  // --- Simulation Center (Agent 6) ---
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [roleplayActive, setRoleplayActive] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  // --- Quiz Center (Agent 5) ---
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizFeedback, setQuizFeedback] = useState<string>("");

  // --- Dynamic Modals & Drifters ---
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [showClientsDrawer, setShowClientsDrawer] = useState<boolean>(false);
  const [showModelDropdown, setShowModelDropdown] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Real-time Customer Card State ---
  const [rtCustomerName, setRtCustomerName] = useState<string>("");
  const [rtCustomerAge, setRtCustomerAge] = useState<string>("");
  const [rtCustomerComplaint, setRtCustomerComplaint] = useState<string>("");
  const [rtCustomerProduct, setRtCustomerProduct] = useState<string>("");
  const [rtCustomerNotes, setRtCustomerNotes] = useState<string>("");
  const [rtCustomerStage, setRtCustomerStage] = useState<string>("1-BOSQICH: Ism");
  const [activeRightTab, setActiveRightTab] = useState<"dashboard" | "mijozlar" | "anketa" | "katalog">("dashboard");
  const [activeMainTab, setActiveMainTab] = useState<"chat" | "crm">("chat");
  const [sidebarTab, setSidebarTab] = useState<"mijozlar" | "agentlar">("mijozlar");
  const [hudCollapsed, setHudCollapsed] = useState<boolean>(false);

  // --- CRM States ---
  const [crmCustomers, setCrmCustomers] = useState<any[]>(() => {
    const saved = localStorage.getItem("nx_crm_customers");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed parsing customers from localStorage", e);
      }
    }
    return [
      {
        id: "crm-1",
        name: "Azizbek",
        age: "33",
        problem: "Beli og'rimoqda, bezi bezovta qiladi (Osteoxondroz)",
        recommendedProduct: "Doctor Ali Kremi",
        lastContactDate: "2026-06-14",
        nextContactDate: "2026-06-18",
        nextContactTime: "",
        status: "🔵 Qayta bog'lanish kerak",
        leadRating: "HOT LEAD",
        probability: 85,
        notes: "Beli og'rishi bo'yicha murojaat qilgan. Krem va uning surtish tartibi haqida batafsil so'radi.",
        stage: "6-BOSQICH: E'tirozlar / Narx"
      },
      {
        id: "crm-2",
        name: "Nodira opa",
        age: "45",
        problem: "Tez-tez shamollaydi, doimiy charchoq va holsizlik",
        recommendedProduct: "One Shot Energy & Doctor Ali Choyi",
        lastContactDate: "2026-06-16",
        nextContactDate: "2026-06-18",
        nextContactTime: "",
        status: "🟡 Qiziqmoqda",
        leadRating: "WARM LEAD",
        probability: 65,
        notes: "Mahsulot tarkibi va kurerlik xizmati narxi bilan qiziqdi. Narxlarni yozib qoldirdik.",
        stage: "4-BOSQICH: SPIN savollari"
      },
      {
        id: "crm-3",
        name: "Rustam aka",
        age: "58",
        problem: "Gastrit va oshqozon og'riqlari",
        recommendedProduct: "Elixir",
        lastContactDate: "2026-06-17",
        nextContactDate: "2026-06-24",
        nextContactTime: "",
        status: "🟣 Kutish",
        leadRating: "WARM LEAD",
        probability: 50,
        notes: "O'ylab ko'rishini aytdi, shifokori bilan maslahatlashadi.",
        stage: "3-BOSQICH: Muammo"
      },
      {
        id: "crm-4",
        name: "Zilola",
        age: "28",
        problem: "Kamqonlik, holsizlik, diqqat tarqoqligi",
        recommendedProduct: "Doctor Ali Balzami",
        lastContactDate: "2026-06-15",
        nextContactDate: "2026-06-17",
        nextContactTime: "",
        status: "🟢 Yangi mijoz",
        leadRating: "COLD LEAD",
        probability: 35,
        notes: "Boshlang'ich maslahat berilgan, mahsulotlarni tanishtirdik.",
        stage: "1-BOSQICH: Ism"
      },
      {
        id: "crm-5",
        name: "Davronbek",
        age: "62",
        problem: "Bo'g'im, bel og'rig'i, xotira pasayishi",
        recommendedProduct: "Doctor Ali Kremi & Elixir",
        lastContactDate: "2026-06-17",
        nextContactDate: "2026-06-17",
        nextContactTime: "2 soatdan keyin",
        status: "🔵 Qayta bog'lanish kerak",
        leadRating: "HOT LEAD",
        probability: 80,
        notes: "Mijoz 2 soatdan keyin qayta yozishni iltimos qilgan.",
        stage: "5-BOSQICH: Tavsiya"
      }
    ];
  });

  const [activeCustomerId, setActiveCustomerId] = useState<string>("crm-1");
  const [searchCrmQuery, setSearchCrmQuery] = useState<string>("");
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);

  // Save CRM Customers to localStorage
  useEffect(() => {
    localStorage.setItem("nx_crm_customers", JSON.stringify(crmCustomers));
  }, [crmCustomers]);

  const handleAddCustomer = () => {
    const newId = `crm-${Date.now()}`;
    const newCust = {
      id: newId,
      name: "Yangi Mijoz",
      age: "25",
      problem: "Aniqlanmoqda...",
      recommendedProduct: "Tavsiya qilinmoqda...",
      lastContactDate: "2026-06-17",
      nextContactDate: "2026-06-17",
      nextContactTime: "",
      status: "🟢 Yangi mijoz",
      leadRating: "COLD LEAD",
      probability: 25,
      notes: "Mijoz tafsilotlarini tahrirlang.",
      stage: "1-BOSQICH: Ism"
    };
    setCrmCustomers(prev => [...prev, newCust]);
    selectActiveCustomer(newId);
    setActiveRightTab("anketa");
    triggerToast("Yangi mijoz kartasi yaratildi! Tafsilotlarni kiriting 📝");
  };

  const handleDeleteCustomer = (id: string, name: string) => {
    if (crmCustomers.length <= 1) {
      triggerToast("Kamida bitta mijoz kartasi saqlanishi kerak! ⚠️");
      return;
    }
    setCrmCustomers(prev => prev.filter(c => c.id !== id));
    if (activeCustomerId === id) {
      const rem = crmCustomers.filter(c => c.id !== id);
      setActiveCustomerId(rem[0].id);
      setRtCustomerName(rem[0].name);
      setRtCustomerAge(rem[0].age);
      setRtCustomerNotes(rem[0].notes);
      setRtCustomerStage(rem[0].stage || "1-BOSQICH: Ism");
    }
    triggerToast(`Mijoz ${name} o'chirildi. 🗑️`);
  };

  // Select active customer and sync fields
  const selectActiveCustomer = (custId: string) => {
    const cust = crmCustomers.find(c => c.id === custId);
    if (!cust) return;
    setActiveCustomerId(custId);
    setRtCustomerName(cust.name);
    setRtCustomerAge(cust.age);
    setRtCustomerNotes(cust.notes);
    setRtCustomerStage(cust.stage || "1-BOSQICH: Ism");
    
    const matchedPreset = COMPLAINT_PRESETS.find(p => 
      cust.problem.toLowerCase().includes(p.label.toLowerCase()) || 
      p.label.toLowerCase().includes(cust.problem.toLowerCase()) ||
      cust.recommendedProduct.toLowerCase().includes(p.label.toLowerCase())
    );
    if (matchedPreset) {
      setRtCustomerComplaint(matchedPreset.value);
    } else {
      setRtCustomerComplaint("");
    }
    triggerToast(`Mijoz tanlandi: ${cust.name} 👥`);
  };

  // Sync state changes from active inputs back to crmCustomers
  useEffect(() => {
    if (!activeCustomerId) return;
    
    // Check if the values actually differ to avoid infinite render loops
    const currentCust = crmCustomers.find(c => c.id === activeCustomerId);
    if (!currentCust) return;

    let matchedProblem = currentCust.problem;
    let matchedProd = currentCust.recommendedProduct;
    if (rtCustomerComplaint) {
      const preset = COMPLAINT_PRESETS.find(p => p.value === rtCustomerComplaint);
      if (preset) {
        matchedProblem = preset.label;
        matchedProd = preset.products.map(pId => UZ_DOCTOR_ALI_PRODUCTS.find(p => p.id === pId)?.name).join(" & ");
      }
    }

    if (
      currentCust.name !== rtCustomerName ||
      currentCust.age !== rtCustomerAge ||
      currentCust.notes !== rtCustomerNotes ||
      currentCust.stage !== rtCustomerStage ||
      currentCust.problem !== matchedProblem ||
      currentCust.recommendedProduct !== matchedProd
    ) {
      setCrmCustomers(prev => prev.map(cust => {
        if (cust.id !== activeCustomerId) return cust;
        return {
          ...cust,
          name: rtCustomerName || cust.name,
          age: rtCustomerAge || cust.age,
          notes: rtCustomerNotes || cust.notes,
          stage: rtCustomerStage,
          problem: matchedProblem,
          recommendedProduct: matchedProd
        };
      }));
    }
  }, [rtCustomerName, rtCustomerAge, rtCustomerNotes, rtCustomerStage, rtCustomerComplaint, activeCustomerId]);

  // Sync active customer on startup
  useEffect(() => {
    const initialCust = crmCustomers.find(c => c.id === "crm-1");
    if (initialCust) {
      setRtCustomerName(initialCust.name);
      setRtCustomerAge(initialCust.age);
      setRtCustomerNotes(initialCust.notes);
      setRtCustomerStage(initialCust.stage || "1-BOSQICH: Ism");
      const matchedPreset = COMPLAINT_PRESETS.find(p => 
        initialCust.problem.toLowerCase().includes(p.label.toLowerCase()) || 
        p.label.toLowerCase().includes(initialCust.problem.toLowerCase())
      );
      if (matchedPreset) {
        setRtCustomerComplaint(matchedPreset.value);
      }
    }
  }, []);

  // Automatic extraction of CRM fields after chats
  const autoAnalyzeCRM = (userTxt: string, aiTxt: string) => {
    let targetCustomerId = activeCustomerId;
    
    // Look for name/age in user's text
    let nameMatch = userTxt.match(/(?:mijoz|ism|ismim|ismi|ismi:|mijoz:)\s*([A-ZÀ-ÿ][a-zà-ÿ]+|[A-Za-z0-9_À-ÿ]+)/i);
    let ageMatch = userTxt.match(/(?:yosh|yoshi|yoshda|yoshdagi)\s*(\d{2})/i) || userTxt.match(/(\d{2})\s*(?:yosh|yoshda)/i);

    let detectedName = nameMatch ? nameMatch[1] : "";
    let detectedAge = ageMatch ? ageMatch[1] : "";

    // If we detect a new name, create a new customer card automatically!
    if (detectedName && !crmCustomers.some(c => c.name.toLowerCase() === detectedName.toLowerCase())) {
      const newId = `crm-${Date.now()}`;
      const newCust = {
        id: newId,
        name: detectedName,
        age: detectedAge || "30",
        problem: "Aniqlanmoqda...",
        recommendedProduct: "Tavsiya qilinmoqda...",
        lastContactDate: "2026-06-17",
        nextContactDate: "2026-06-17",
        nextContactTime: "",
        status: "🟢 Yangi mijoz",
        leadRating: "WARM LEAD",
        probability: 50,
        notes: "Suhbat orqali avtomatik yaratildi."
      };
      
      setCrmCustomers(prev => [...prev, newCust]);
      setActiveCustomerId(newId);
      targetCustomerId = newId;
      setRtCustomerName(detectedName);
      setRtCustomerAge(detectedAge || "30");
      setRtCustomerNotes("Suhbat orqali avtomatik yaratildi.");
      setRtCustomerComplaint("");
      triggerToast(`Yangi mijoz kartasi yaratildi: ${detectedName} ✨`);
    }

    if (targetCustomerId) {
      setCrmCustomers(prev => prev.map(cust => {
        if (cust.id !== targetCustomerId) return cust;

        let updated = { ...cust };
        updated.lastContactDate = "2026-06-17";

        if (detectedAge && (!cust.age || cust.age === "30" || cust.age === "Aniqlanmoqda...")) {
          updated.age = detectedAge;
        }

        // Problem and Product Mapping
        const userLower = userTxt.toLowerCase();
        if (userLower.includes("bel og'ri") || userLower.includes("belim") || userLower.includes("bo'g'im") || userLower.includes("bo'yin") || userLower.includes("krem")) {
          updated.problem = "Bel, bo'g'im og'riqlari";
          updated.recommendedProduct = "Doctor Ali Kremi";
        } else if (userLower.includes("shamollash") || userLower.includes("immunitet") || userLower.includes("holsiz") || userLower.includes("charchoq")) {
          updated.problem = "Immunitet pasayishi, holsizlik";
          updated.recommendedProduct = "One Shot Energy";
        } else if (userLower.includes("yo'tal") || userLower.includes("balg'am") || userLower.includes("nafas")) {
          updated.problem = "Yo'tal, balg'am, nafas yo'llari";
          updated.recommendedProduct = "Doctor Ali Choyi";
        } else if (userLower.includes("kamqon") || userLower.includes("anemiya") || userLower.includes("balzam")) {
          updated.problem = "Kamqonlik, tez charchash";
          updated.recommendedProduct = "Doctor Ali Balzami";
        } else if (userLower.includes("xotira") || userLower.includes("miya") || userLower.includes("elixir")) {
          updated.problem = "Xotira pasayishi, miya faoliyati";
          updated.recommendedProduct = "Elixir";
        }

        // Status triggers
        const combinedLower = (userTxt + " " + aiTxt).toLowerCase();
        if (combinedLower.includes("narx") || combinedLower.includes("qancha") || combinedLower.includes("nechpul") || combinedLower.includes("narxi") || combinedLower.includes("sum") || combinedLower.includes("so'm")) {
          updated.status = "🟡 Qiziqmoqda";
          updated.leadRating = "WARM LEAD";
          updated.probability = 65;
        }
        
        if (combinedLower.includes("o'ylab ko'raman") || combinedLower.includes("o'ylab ko'ray") || combinedLower.includes("o'ylayman") || combinedLower.includes("maslahatlashaman")) {
          updated.status = "🟣 Kutish";
          updated.leadRating = "WARM LEAD";
          updated.probability = 45;
          // Set next contact +3 days
          const d = new Date();
          d.setDate(d.getDate() + 3);
          updated.nextContactDate = d.toISOString().split("T")[0];
        }

        if (combinedLower.includes("keyinroq yozing") || combinedLower.includes("keyinroq yoz") || combinedLower.includes("vaqt yo'q")) {
          updated.status = "🔵 Qayta bog'lanish kerak";
          updated.leadRating = "WARM LEAD";
          updated.probability = 50;
        }

        if (combinedLower.includes("sotib oldi") || combinedLower.includes("sotib oldim") || combinedLower.includes("oldim") || combinedLower.includes("olaman") || combinedLower.includes("rasmiylashtir")) {
          updated.status = "✅ Sotib oldi";
          updated.leadRating = "HOT LEAD";
          updated.probability = 100;
          updated.nextContactDate = "";
          updated.nextContactTime = "";
        }

        if (combinedLower.includes("olmayman") || combinedLower.includes("kerakmas") || combinedLower.includes("rad etdi") || combinedLower.includes("shart emas")) {
          updated.status = "❌ Rad etdi";
          updated.leadRating = "COLD LEAD";
          updated.probability = 5;
        }

        // Follow-up manager triggers
        // 1 haftadan keyin -> +7 kun
        if (combinedLower.includes("1 haftadan keyin") || combinedLower.includes("bir haftadan keyin") || combinedLower.includes("haftadan keyin") || combinedLower.includes("1 hafta")) {
          const d = new Date();
          d.setDate(d.getDate() + 7);
          updated.nextContactDate = d.toISOString().split("T")[0];
          updated.status = "🔵 Qayta bog'lanish kerak";
          updated.leadRating = "WARM LEAD";
          updated.probability = 55;
          updated.nextContactTime = "";
        }
        // ertaga -> +1 kun
        else if (combinedLower.includes("ertaga") || combinedLower.includes("ertaga yozing") || combinedLower.includes("1 kundan keyin")) {
          const d = new Date();
          d.setDate(d.getDate() + 1);
          updated.nextContactDate = d.toISOString().split("T")[0];
          updated.status = "🔵 Qayta bog'lanish kerak";
          updated.leadRating = "WARM LEAD";
          updated.probability = 65;
          updated.nextContactTime = "";
        }
        // 2 soatdan keyin -> +2 soat
        else if (combinedLower.includes("2 soatdan keyin") || combinedLower.includes("ikki soatdan keyin") || combinedLower.includes("2 soat")) {
          updated.nextContactDate = "2026-06-17";
          updated.nextContactTime = "2 soatdan keyin";
          updated.status = "🔵 Qayta bog'lanish kerak";
          updated.leadRating = "HOT LEAD";
          updated.probability = 80;
        }

        return updated;
      }));
    }
  };

  // --- Auto Scrolling Core ---
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load stats and state on launch
  useEffect(() => {
    const savedXp = localStorage.getItem("nx_xp");
    if (savedXp) setXp(parseInt(savedXp, 10));

    const savedUser = localStorage.getItem("nx_user");
    if (savedUser) {
      setUserName(savedUser);
      setTempName(savedUser);
    } else {
      setTempName(userName);
    }

    const savedQuizzes = localStorage.getItem("nx_quizzes");
    if (savedQuizzes) setCompletedQuizzes(JSON.parse(savedQuizzes));

    const savedRPlays = localStorage.getItem("nx_roleplays_count");
    if (savedRPlays) setCompletedRoleplays(parseInt(savedRPlays, 10));

    const savedFavs = localStorage.getItem("nx_favorites");
    if (savedFavs) setSavedFavorites(JSON.parse(savedFavs));
  }, []);

  // Save values to localStorage
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const addXpPoints = (amount: number, reason: string) => {
    setXp((prev) => {
      const nextXp = prev + amount;
      localStorage.setItem("nx_xp", nextXp.toString());
      triggerToast(`+${amount} XP! Unvon oshmoqda 🌟 (${reason})`);
      return nextXp;
    });
  };

  // Level evaluation
  const getLevelInfo = (): LevelInfo => {
    let activeLevel = FIN_OPERATOR_LEVELS[0];
    for (let i = FIN_OPERATOR_LEVELS.length - 1; i >= 0; i--) {
      if (xp >= FIN_OPERATOR_LEVELS[i].requiredXp) {
        activeLevel = FIN_OPERATOR_LEVELS[i];
        break;
      }
    }
    return activeLevel;
  };

  const currentLevel = getLevelInfo();

  // Scroll to bottom helper
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChats, isAiTyping]);

  // Clean speaking and recognition states on route changings
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentlySpeaking(null);
    setVoiceInputActive(false);
    setEvaluationResult(null);
  }, [activeAgentId, selectedScenarioId]);

  // Visualizer pulsing effect for mic fallback
  useEffect(() => {
    let interval: any;
    if (voiceInputActive) {
      interval = setInterval(() => {
        setWordWaveInterval(Math.floor(Math.random() * 8) + 1);
      }, 150);
    } else {
      setWordWaveInterval(1);
    }
    return () => clearInterval(interval);
  }, [voiceInputActive]);

  const AGENTS = [
    {
      id: "mahsulot-eksperti",
      name: "Mahsulot Eksperti",
      shortDescription: "Doctor Ali bionik-tabiiy salomatlik darmonlari ensiklopediyasi",
      fullDescription: "Doctor Ali'ning 5 ta tabiiy-bionik salomatlik mahsuloti (One Shot Energy, Elixir, Dozor Ali Choyi, Dozor Ali Balzami, Dozor Ali Kremi) bo'yicha mustahkam ensiklopedik ma'lumotlar beradi.",
      icon: BookOpen,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
      avatar: "📦",
      glowColor: "shadow-emerald-900/40",
      quickPrompts: [
        "ONE SHOT ENERGY va uning immunitetni faol qo'llab-quvvatlash tizimini tushuntir.",
        "Doctor Ali Balzamining qon ko'paytirish (anemiya) bo'yicha dori tabletkalaridan afzalligi nimada?",
        "Doctor Ali Kremi bel, bo'g'im va tovon og'riqlariga qanday sozlangan?"
      ],
      defaultLoadText: "Doctor Ali darmonlarining tarkibi o'rganilmoqda..."
    },
    {
      id: "sotuv-professori",
      name: "Sotuv Professori",
      shortDescription: "SPIN Selling va Bitimni yopish bo'yicha daho",
      fullDescription: "O'zining boy tajribasi bilan operatorlarni SPIN Selling (Situation, Problem, Implication, Need-Payoff) metodologiyasi va professional bitimni muvaffaqiyatli yakunlash sirlariga o'rgatadi.",
      icon: GraduationCap,
      color: "from-amber-500/20 to-yellow-500/10 border-amber-500/30",
      avatar: "🎓",
      glowColor: "shadow-amber-900/40",
      quickPrompts: [
        "DOCTOR ALI BALZAMI uchun mukammal SPIN savollar silsilasini yozib ber.",
        "Mijozni majburlamasdan, g'amxo'riligi va tanlov (1-kurs yoki 2-kurs) orqali sotib olishga undaydigan 3 ta closing savoli.",
        "E'tirozlarni yengishda 'Zarba va qayta taqdimot' formulasini qanday qo'llayman?"
      ],
      defaultLoadText: "Sotuv strategiyasi va SPIN rejasi tuzilmoqda..."
    },
    {
      id: "sotuv-muammolari",
      name: "Sotuv Muammolari Agenti",
      shortDescription: "Sotuv to'siqlarini tahlil qiluvchi va yechuvchi",
      fullDescription: "Operatorlarga mijozlarning eng ashaddiy rad javoblari, qiziqish so'nishi, narxdan nolish yoki aloqa uzilishlarini real vaqtda tahlil qilib, ularni muvaffaqiyatli darmonga aylantiruvchi amaliy skriptlar beradi.",
      icon: AlertTriangle,
      color: "from-rose-500/20 to-orange-500/10 border-rose-500/30",
      avatar: "🛡️",
      glowColor: "shadow-rose-900/40",
      quickPrompts: [
        "Mijoz 'menga bu yordam bera olmaydi, ishonmayman' deyapti, qanday skript ishlatsam bo'ladi?",
        "Suhbat chog'ida narx aytilganidan so'ng mijoz g'oyib bo'lsa uni qanday qaytaraman?",
        "Mijoz 'shovqinsiz nurlanish yoki tarkibiy zararlar bormi' deb qo'rqsa qanday javob beriladi?"
      ],
      defaultLoadText: "Sotuv qarshiliklari va muammolari tahlil qilinmoqda..."
    },
    {
      id: "mijoz-tahlilchisi",
      name: "Mijoz Tahlilchisi",
      shortDescription: "7-bosqichli mijoz ehtiyoji & skript generatori",
      fullDescription: "Mijozning yoshi, kasbi va dardi bo'yicha 7 ta bosqichni (Mijoz Tahlili, Muammo Oqibati, Mahsulot Tanlash, Tayyor skript, Qiziqtirish, Qarshilik, Buyurtma yopish) hisoblab chiqaradi.",
      icon: Users,
      color: "from-sky-500/20 to-indigo-500/10 border-sky-500/30",
      avatar: "🔍",
      glowColor: "shadow-sky-900/40",
      quickPrompts: [
        "52 yosh, prostata shamollashi, kechasi 4 marta hojatga chiqadi.",
        "30 yosh, juda toliqqan, bosh og'rig'i bor va doimiy bo'yin charchog'idan qiynaladi.",
        "42 yosh, yo'tal, balg'am, nafas yo'llari shamollashi va jigar/ichaklar buzilishi bor."
      ],
      defaultLoadText: "Mijozning muloqot va skript xaritasi yuklanmoqda..."
    },
    {
      id: "trening-murabbiyi",
      name: "Trening Murabbiyi",
      shortDescription: "Sotuv testi va viktorinalar o'tkazuvchi murabbiy",
      fullDescription: "Interaktiv testlar va topshiriqlar beradigan, ulardan olingan natijalarni tahlili bilan taqdim qilib, bilim darajangizni va operatorlik toifangizni o'stiruvchi murabbiy.",
      icon: Trophy,
      color: "from-violet-500/20 to-purple-500/10 border-violet-500/30",
      avatar: "🏆",
      glowColor: "shadow-violet-900/40",
      quickPrompts: [
        "Menga Doctor Ali muloqot etikasi bo'yicha bitta murakkab sinov savoli ber.",
        "SPIN Selling bo'yicha bilimlarni tekshirish uchun o'zbekcha test taqdim et.",
        "Sotuv mahoratimni oshirish bo'yicha haftalik yangi mashg'ulot ber."
      ],
      defaultLoadText: "Murabbiy dars va sinov sahifasini tayyorlamoqda..."
    },
    {
      id: "mijoz-simulyatori",
      name: "Mijoz Simulyatori",
      shortDescription: "Real mijozlar bilan muloqot mashg'uloti va baholash",
      fullDescription: "Haqiqiy xarakterlarga (shubhachi, haddan tashqari band, tejamkor, qaytgan xaridor) kirib, siz bilan yozishadi. Oxirida esa sotuv mahoratingizni baholab beradi.",
      icon: Play,
      color: "from-fuchsia-500/20 to-pink-500/10 border-fuchsia-500/30",
      avatar: "🤖",
      glowColor: "shadow-fuchsia-900/40",
      quickPrompts: [
        "David Cole bilan muloqot (ONE SHOT ENERGY bo'yicha skeptik)",
        "Sarah Jenkins bilan suhbat (DOCTOR ALI KREMI bo'yicha band)",
        "Elena Rostova bilan muloqot (ELIXIR bo'yicha tejamkor)"
      ],
      defaultLoadText: "Mijoz simulyatsiya roli yuklanmoqda..."
    },
    {
      id: "lider-murabbiyi",
      name: "Lider Murabbiyi",
      shortDescription: "Operatorlar, jamoa, liderlik va boshqaruv sirlari",
      fullDescription: "Ko'p operatorlar bilan ishlash, liderlik, boshqaruv ko'nikmalari, jamoaviy drayv hamda sotuv samaradorligini mukammal oshirish bo'yicha yetakchi mutaxassis daho agent.",
      icon: Zap,
      color: "from-yellow-400/20 to-orange-400/10 border-yellow-400/30",
      avatar: "⚡",
      glowColor: "shadow-yellow-900/40",
      quickPrompts: [
        "Jamoada ishonch va samimiylik muhitini qanday yaratsa bo'ladi?",
        "Bir nechta operatorlardan iborat yangi sotuv guruhini qanday boshqaraman?",
        "Sotuvda jamoaviy charchoqni yo'qotadigan ajoyib 3 ta maslahat ber."
      ],
      defaultLoadText: "Liderlik va jamoaviy g'oralar tahlil etilmoqda..."
    },
    {
      id: "universal-ai",
      name: "Harqandaysavol",
      shortDescription: "Umumiy va kundalik savollar, motivatsiya hamda biznes sirlari",
      fullDescription: "Operatorlar uchun har qanday umumiy savollarga, umumiy motivatsiya va biznes rejalari, kundalik savollarga mukammal javob beradigan universal daho intellektual agent.",
      icon: TrendingUp,
      color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30",
      avatar: "🧠",
      glowColor: "shadow-cyan-900/40",
      quickPrompts: [
        "Bugun o'zimni juda kuchsiz his qilyapman, menga ruhan g'ayrat bag'ishlovchi so'z ayt.",
        "Katta zafar qozonish uchun shaxsiy rejalashtirishni nimadan boshlashim kerak?",
        "Sotuvda muvaffaqiyatli biznes tamoyillari nimalarda namoyon bo'ladi?"
      ],
      defaultLoadText: "Harqandaysavol siz uchun yechim shakllantirmoqda..."
    }
  ];

  const activeAgent = AGENTS.find(a => a.id === activeAgentId) || AGENTS[7];

  const getAgentWelcomeMessage = (agentId: string): string => {
    return "Doctor Ali AI Master V3 tizimi faol. Mijoz ma'lumotlarini yoki ehtiyojlarini kiriting. Tizim avtomatik ravishda eng mos agent ostida sotuv rejasini, SPIN savollarini yoki e'tiroz skriptlarini taqdim etadi. Savolingizni yozishingiz mumkin.";
  };

  const getOrInitializeChat = (agentId: string): LocalMessage[] => {
    if (activeChats[agentId]) return activeChats[agentId];
    const initialMsg: LocalMessage = {
      id: "welcome",
      role: "model",
      text: getAgentWelcomeMessage(agentId),
      timestamp: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
    };
    return [initialMsg];
  };

  const detectAgentId = (text: string, currentId: string | null): string => {
    const norm = text.toLowerCase();
    
    // 1. Mahsulot Eksperti (mahsulot, qaysi mahsulot, bel, bo'g'im, xotira, immunitet, yo'tal, shamollash, yurak, jigar, buyrak)
    if (norm.includes("mahsulot") || norm.includes("qaysi mahsulot") || norm.includes("bel") || norm.includes("bo'g'im") || norm.includes("xotira") || norm.includes("immunitet") || norm.includes("yo'tal") || norm.includes("shamollash") || norm.includes("yurak") || norm.includes("jigar") || norm.includes("buyrak")) {
      return "mahsulot-eksperti";
    }
    
    // 2. Sotuv Professori (sotuv, SPIN, closing, skript, qanday sotaman, mijoz bilan gaplashish)
    if (norm.includes("sotuv") || norm.includes("spin") || norm.includes("closing") || norm.includes("skript") || norm.includes("qanday sotaman") || norm.includes("mijoz bilan gaplashish")) {
      return "sotuv-professori";
    }
    
    // 3. Sotuv Muammolari Agenti (qimmat, ishonmayapti, o'ylab ko'raman, pulim yo'q, rad qildi)
    if (norm.includes("qimmat") || norm.includes("ishonmayapti") || norm.includes("o'ylab ko'raman") || norm.includes("pulim yo'q") || norm.includes("rad qildi")) {
      return "sotuv-muammolari";
    }
    
    // 4. Mijoz Tahlilchisi (qanday savol beray, mijozni tushunish, ehtiyoj aniqlash)
    if (norm.includes("qanday savol beray") || norm.includes("mijozni tushunish") || norm.includes("ehtiyoj aniqlash")) {
      return "mijoz-tahlilchisi";
    }
    
    // 5. Trening Murabbiyi (trening, dars, o'rgat, test, vazifa)
    if (norm.includes("trening") || norm.includes("dars") || norm.includes("o'rgat") || norm.includes("test") || norm.includes("vazifa")) {
      return "trening-murabbiyi";
    }
    
    // 6. Mijoz Simulyatori (mijoz bo'lib ber, roleplay, mashq qilamiz)
    if (norm.includes("mijoz bo'lib ber") || norm.includes("roleplay") || norm.includes("mashq qilamiz")) {
      return "mijoz-simulyatori";
    }
    
    // 7. Lider Murabbiyi (jamoa, operatorlar, liderlik, boshqaruv)
    if (norm.includes("jamoa") || norm.includes("operatorlar") || norm.includes("liderlik") || norm.includes("boshqaruv")) {
      return "lider-murabbiyi";
    }
    
    // 8. Universal AI (umumiy savollar, motivatsiya, biznes, kundalik savollar)
    if (norm.includes("umumiy savollar") || norm.includes("motivatsiya") || norm.includes("biznes") || norm.includes("kundalik savollar")) {
      return "universal-ai";
    }
    
    return currentId || "universal-ai";
  };

  const getDynamicSuggestions = (): string[] => {
    if (activeAgentId === "mahsulot-eksperti") {
      return ["Tarkibi nima?", "Bel og'rig'i", "Dozor Ali choyi", "Nojo'ya ta'siri", "Sertifikati bormi?", "Dozor Ali balzami", "Bo'g'imlar darmoni"];
    }
    if (activeAgentId === "sotuv-muammolari") {
      return ["Qimmat", "Ishonmayapman", "Pulim yo'q", "Doktor bilan maslahatlashaman", "O'ylab ko'raman", "Almashish muddati", "Skript ko'rib chiqilsin"];
    }
    if (activeAgentId === "mijoz-tahlilchisi") {
      return ["Yoshga qarab skript", "Charchoq belgilari", "Prostata shamollashi", "Bel og'riq analizi", "7-bosqichli skript"];
    }
    if (activeAgentId === "mijoz-simulyatori") {
      return ["Vaziyatni aniqlash", "Ehtiyoj shakllantirish", "Mahsulot taqdimoti", "Ishonchsizlikni yengish", "Narx skripti"];
    }
    if (activeAgentId === "sotuv-professori") {
      return ["SPIN savollar rejasi", "Closing savollar", "Zarba formulasi", "Ehtiyojni oshirish", "Tushuntirish darsi"];
    }
    return ["Qimmat", "O'ylab ko'raman", "Ishonmayapman", "Pulim yo'q", "Keyinroq", "Bel og'rig'i", "Narxi qancha?"];
  };

  const activeSession = customerSessions.find(s => s.id === activeSessionId) || customerSessions[0];
  const currentChatMessages = activeSession ? activeSession.messages : [];

  const startNewCustomerSession = () => {
    const randomCustomer = RANDOM_CUSTOMERS[Math.floor(Math.random() * RANDOM_CUSTOMERS.length)];
    const newSessionId = `sess-${Date.now()}`;
    const newSessionName = `${randomCustomer.name} (${randomCustomer.complaint})`;

    const initialMsg: LocalMessage = {
      id: "welcome",
      role: "model",
      text: `Doctor Ali professional sotuv bo'yicha maslahat tizimiga xush kelibsiz!\n\nHozirgi muloqotdagi yangi mijoz:\n👤 **Ismi:** ${randomCustomer.name}\n🎂 **Yoshi:** ${randomCustomer.age} yosh\n⚠️ **Muammo/E'tiroz:** ${randomCustomer.complaint}\n🌿 **Qiziqqan mahsulot:** ${randomCustomer.product}\n\nSiz ushbu mijoz bo'yicha sotuv skriptini so'rashingiz yoki u bilan suhbat ssenariylarini mashq qilishingiz mumkin. Savolingizni yozing!`,
      timestamp: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
    };

    const newSession: CustomerSession = {
      id: newSessionId,
      customerName: newSessionName,
      createdAt: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
      messages: [initialMsg],
      activeAgentId: "universal-ai",
      customerAge: randomCustomer.age,
      customerComplaint: randomCustomer.complaint,
      customerProduct: randomCustomer.product
    };

    setCustomerSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
    setActiveAgentId("universal-ai");
    setRoleplayActive(false);
    setEvaluationResult(null);

    // Sync input fields for CRM
    setRtCustomerName(randomCustomer.name.split(",")[0]);
    setRtCustomerAge(randomCustomer.age);
    
    let matchedValue = "bel_boyin_bogim";
    if (randomCustomer.complaint.toLowerCase().includes("xotira")) {
      matchedValue = "xotira_miya_koz";
    } else if (randomCustomer.complaint.toLowerCase().includes("kamqonlik") || randomCustomer.complaint.toLowerCase().includes("holsiz")) {
      matchedValue = "kamqonlik_holsizlik";
    } else if (randomCustomer.complaint.toLowerCase().includes("shamollash") || randomCustomer.complaint.toLowerCase().includes("immunitet")) {
      matchedValue = "immunitet_shamollash";
    }
    setRtCustomerComplaint(matchedValue);
    setRtCustomerProduct(randomCustomer.product);

    triggerToast(`Yangi mijoz muloqoti ochildi: ${randomCustomer.name.split(",")[0]}! 👥✨`);
  };

  // Message Sending Handler
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || !activeAgentId) return;

    // Detect and auto-switch the agent in real-time based on query content
    const detectedAgentId = detectAgentId(textToSend, activeAgentId);
    let targetAgentId = activeAgentId;
    
    if (detectedAgentId !== activeAgentId) {
      targetAgentId = detectedAgentId;
      setActiveAgentId(detectedAgentId);
      // Auto-switch is completely silent - "Foydalanuvchi agent almashayotganini sezmasligi kerak"
    }

    // Since we unify chat streams, we fetch from the active customer session
    const currentBaseMessages = currentChatMessages;
    const updatedMessages = [...currentBaseMessages];
    
    const userMsg: LocalMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
    };
    updatedMessages.push(userMsg);

    const targetAgentInfo = AGENTS.find(a => a.id === targetAgentId) || activeAgent;

    // Immediately update the conversation history across ALL 6 agents so they share the exact same stream
    setActiveChats(prev => {
      const nextChats = { ...prev };
      for (const ag of AGENTS) {
        nextChats[ag.id] = updatedMessages;
      }
      return nextChats;
    });

    setCustomerSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: updatedMessages,
          activeAgentId: targetAgentId
        };
      }
      return s;
    }));
    setInputText("");

    // Start typing state based on agent in progress
    setIsAiTyping(true);
    setLoadingText(
      targetAgentInfo?.defaultLoadText || "Professor javob tayyorlamoqda..."
    );

    try {
      // Simulate highly advanced speed wait (instantaneous 50ms instead of 1.5s delay)
      await new Promise(resolve => setTimeout(resolve, 50));

      let responseText = "";

      if (targetAgentId === "mijoz-simulyatori" && roleplayActive && selectedScenarioId) {
        // AI Customer Roleplay
        const scenario = UZ_ROLEPLAY_SCENARIOS.find(s => s.id === selectedScenarioId);
        const product = UZ_DOCTOR_ALI_PRODUCTS.find(p => p.id === scenario?.targetProduct);

        const response = await fetch("/api/roleplay/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenario: scenario?.background,
            customerName: scenario?.customerName,
            persona: scenario?.persona,
            product,
            messages: updatedMessages.map(m => ({ role: m.role, text: m.text }))
          })
        });
        const data = await response.json();
        responseText = data.text || "Kechirasiz, virtual mijoz hozirda bog'lana olmadi. Iltimos qaytadan urining.";
      } else {
        // Universal chatbot responding via professor API
        const activeCust = crmCustomers.find(c => c.id === activeCustomerId);
        const response = await fetch("/api/chat/professor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map(m => ({ role: m.role, text: m.text })),
            agentId: targetAgentId,
            activeCustomer: activeCust ? {
              name: activeCust.name,
              age: activeCust.age,
              problem: activeCust.problem,
              recommendedProduct: activeCust.recommendedProduct,
              notes: activeCust.notes,
              status: activeCust.status,
              stage: activeCust.stage || "1-BOSQICH: Ism"
            } : null
          })
        });
        const data = await response.json();
        responseText = data.text || "Tizim tarmog'ida muammo yuz berdi. Iltimos qaytadan yozing.";
      }

      // 1. Prepare target AI Message ID
      const aiMsgId = `ai-${Date.now()}`;
      
      // 2. Add an empty AI message first to the chat history
      const initialAiMsg: LocalMessage = {
        id: aiMsgId,
        role: "model",
        text: "",
        timestamp: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
      };

      const finalHistoryWithAi = [...updatedMessages, initialAiMsg];

      setActiveChats(prev => {
        const nextChats = { ...prev };
        for (const ag of AGENTS) {
          nextChats[ag.id] = finalHistoryWithAi;
        }
        return nextChats;
      });

      setCustomerSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: finalHistoryWithAi,
            activeAgentId: targetAgentId
          };
        }
        return s;
      }));

      // 3. Deactivate typing bubble to transition cleanly into active word streaming
      setIsAiTyping(false);
      setLoadingText("");

      // 4. Stream words sequentially in high-speed chunks (3 words at once every 15ms)
      const words = responseText.split(" ");
      let currentWordIndex = 0;
      let accumText = "";

      const streamTimer = setInterval(() => {
        if (currentWordIndex < words.length) {
          const chunk = words.slice(currentWordIndex, currentWordIndex + 3);
          accumText += (accumText ? " " : "") + chunk.join(" ");
          currentWordIndex += chunk.length;

          setActiveChats(prev => {
            const nextChats = { ...prev };
            const currentHistory = nextChats[targetAgentId] || [];
            const updatedHistory = currentHistory.map(msg => 
              msg.id === aiMsgId ? { ...msg, text: accumText } : msg
            );
            // Synchronize the streamed text output to all other agent channels too!
            for (const ag of AGENTS) {
              nextChats[ag.id] = updatedHistory;
            }
            return nextChats;
          });

          setCustomerSessions(prev => prev.map(s => {
            if (s.id === activeSessionId) {
              const updatedHistory = s.messages.map(msg => 
                msg.id === aiMsgId ? { ...msg, text: accumText } : msg
              );
              return { ...s, messages: updatedHistory };
            }
            return s;
          }));

          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        } else {
          clearInterval(streamTimer);
          autoAnalyzeCRM(textToSend, responseText);
        }
      }, 15); // Highly responsive sub-15ms chunk emission

      addXpPoints(10, `${targetAgentInfo?.name} muloqoti`);

    } catch (err) {
      console.error(err);
      const errMsg: LocalMessage = {
        id: `err-${Date.now()}`,
        role: "system",
        text: "Kechirasiz, internet aloqasi to'xtatildi. Tarmonni tekshirib qaytadan urinib ko'ring.",
        timestamp: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
      };
      
      setActiveChats(prev => {
        const nextChats = { ...prev };
        const withErr = [...updatedMessages, errMsg];
        for (const ag of AGENTS) {
          nextChats[ag.id] = withErr;
        }
        return nextChats;
      });

      setCustomerSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...updatedMessages, errMsg] };
        }
        return s;
      }));

      setIsAiTyping(false);
      setLoadingText("");
    }
  };

  // --- Voice Integration APIs ---
  const startVoiceInput = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.lang = 'uz-UZ';
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      setVoiceInputActive(true);

      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInputText(prev => prev + (prev ? " " : "") + transcript);
        setVoiceInputActive(false);
        triggerToast("Ovoz muvaffaqiyatli matnga aylantirildi! 🎙️");
      };

      rec.onerror = () => {
        setVoiceInputActive(false);
        simulateVoiceInput();
      };

      rec.onend = () => {
        setVoiceInputActive(false);
      };

      rec.start();
    } else {
      simulateVoiceInput();
    }
  };

  const simulateVoiceInput = () => {
    setVoiceInputActive(true);
    triggerToast("Ovoz tahlil qilinmoqda (Simulyatsiya)... 🎙️");
    setTimeout(() => {
      const expressions = [
        "Mijozda sirkad ritm buzilganda Sleep-Sync Pro qanday tushuntiriladi?",
        "Spine-Align mahsulotining narxi bo'yicha e'tiroz kelganda nima deymiz?",
        "Transdermal plastirlarni sportchilarga taklif qilish formulasi bormi?",
        "SPIN Selling o'zi nima va uning asosiy foydasi qanday?"
      ];
      const selected = expressions[Math.floor(Math.random() * expressions.length)];
      setInputText(selected);
      setVoiceInputActive(false);
      triggerToast("Simulyatsiya yozuvi: '" + selected + "'");
    }, 2200);
  };

  // Uzbek Text-to-Speech playback
  const handleToggleVoiceOutput = (msgText: string, msgId: string) => {
    if ('speechSynthesis' in window) {
      if (currentlySpeaking === msgId) {
        window.speechSynthesis.cancel();
        setCurrentlySpeaking(null);
        return;
      }
      window.speechSynthesis.cancel();
      const cleanText = msgText.replace(/[\*\_]/g, ""); 
      const talk = new SpeechSynthesisUtterance(cleanText);
      
      const voices = window.speechSynthesis.getVoices();
      const targetVoice = voices.find(v => v.lang.startsWith("tr") || v.lang.startsWith("uz") || v.lang.startsWith("ru")) || voices[0];
      if (targetVoice) talk.voice = targetVoice;
      
      talk.pitch = 1.05;
      talk.rate = 1.0;
      
      talk.onend = () => setCurrentlySpeaking(null);
      talk.onerror = () => setCurrentlySpeaking(null);
      
      setCurrentlySpeaking(msgId);
      window.speechSynthesis.speak(talk);
    } else {
      triggerToast("Kechirasiz, sizning brauzeringiz ovozli sintezni qo'llamaydi.");
    }
  };

  // --- Favorite/Bookmark manager ---
  const handleToggleFavorite = (msg: LocalMessage) => {
    if (!activeAgentId) return;
    const isAlreadyFav = savedFavorites.some(f => f.id === msg.id);
    let updated;

    if (isAlreadyFav) {
      updated = savedFavorites.filter(f => f.id !== msg.id);
      triggerToast("Xabar sevimlilardan olib tashlandi. ⭐");
    } else {
      const newFav = {
        id: msg.id,
        agentId: activeAgentId,
        text: msg.text,
        timestamp: msg.timestamp,
        agentName: activeAgent?.name || "AI Agent"
      };
      updated = [...savedFavorites, newFav];
      addXpPoints(5, "Maslahat saqlandi");
    }

    setSavedFavorites(updated);
    localStorage.setItem("nx_favorites", JSON.stringify(updated));
  };

  // --- Export Chat Sript to TXT ---
  const handleExportChat = () => {
    if (currentChatMessages.length <= 1) {
      triggerToast("Eksport qilish uchun chat tarixi mavjud emas.");
      return;
    }
    const headerTitle = `=========================================\nDOCTOR ALI AI - CHAT TRANSKRIPTI\nAgent: ${activeAgent?.name}\nOperator: ${userName}\nSana: ${new Date().toLocaleDateString("uz-UZ")}\n=========================================\n\n`;
    const bodyContent = currentChatMessages
      .map(m => `[${m.timestamp}] ${m.role === "user" ? userName : activeAgent?.name}: ${m.text}`)
      .join("\n\n");

    const blob = new Blob([headerTitle + bodyContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Doctor_Ali_${activeAgentId}_Tarixi.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addXpPoints(15, "Suhbat yuklab olindi 📄");
  };

  // --- Interactive Simulation Handler (Agent 6) ---
  const startRoleplaySession = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    setRoleplayActive(true);
    setEvaluationResult(null);

    const scenario = UZ_ROLEPLAY_SCENARIOS.find(s => s.id === scenarioId);
    const product = UZ_DOCTOR_ALI_PRODUCTS.find(p => p.id === scenario?.targetProduct);

    const botGreeting: LocalMessage = {
      id: `rp-welcome-${Date.now()}`,
      role: "model",
      text: `Salom! Men *${scenario?.customerName}*man. Muloqot ssenariyi bo'yicha: *${scenario?.background}*. Men bilan faqat bionik *${product?.name}* haqida muloqot qilishingiz mumkin. Keling boshlaylik, menga birinchi so'zlashuv savolingizni yo'llang...`,
      timestamp: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
    };

    setActiveChats(prev => ({
      ...prev,
      "mijoz-simulyatori": [botGreeting]
    }));

    triggerToast("Muloqot simulyatsiyasi boshlandi! 🚀");
  };

  const handleEvaluateSimulation = async () => {
    if (!selectedScenarioId) return;
    const scenario = UZ_ROLEPLAY_SCENARIOS.find(s => s.id === selectedScenarioId);
    const product = UZ_DOCTOR_ALI_PRODUCTS.find(p => p.id === scenario?.targetProduct);

    setIsEvaluating(true);
    triggerToast("Professor muloqot muvozanatini hisoblamoqda... 📊");

    try {
      const response = await fetch("/api/roleplay/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioDetails: scenario?.background,
          productDetails: product,
          messages: currentChatMessages.map(m => ({ role: m.role, text: m.text }))
        })
      });

      const result = await response.json();
      setEvaluationResult(result);

      const awardedXp = (result.score || 7) * 20;
      addXpPoints(awardedXp, `Imtihon yakunlandi: ${result.score}/10`);
      setCompletedRoleplays(prev => {
        const count = prev + 1;
        localStorage.setItem("nx_roleplays_count", count.toString());
        return count;
      });

    } catch (err) {
      console.error(err);
      triggerToast("Baholashni hisoblashda xatolik yuz berdi.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // --- Quiz Training Handler (Agent 5) ---
  const handleAnswerQuiz = (optionIdx: number) => {
    if (quizAnswered) return;
    setSelectedOption(optionIdx);
    setQuizAnswered(true);

    const question = UZ_QUIZ_QUESTIONS[currentQuizIndex];
    if (optionIdx === question.answerIndex) {
      const reward = 30;
      setQuizFeedback(`To'g'ri javob! 🎉 Barakalla. ${question.explanation}`);
      addXpPoints(reward, "Viktorina to'g'ri yechildi");
    } else {
      setQuizFeedback(`Noto'g'ri javob. ❌ Xavotir olmang! ${question.explanation}`);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setQuizAnswered(false);
    setQuizFeedback("");
    setCurrentQuizIndex(prev => (prev + 1) % UZ_QUIZ_QUESTIONS.length);
  };

  const handleSaveUserName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem("nx_user", tempName.trim());
      setIsEditingName(false);
      addXpPoints(15, "Profil nomi yangilandi");
      triggerToast("Ismingiz saqlandi!");
    }
  };

  // Filter messages based on search keywords
  const filteredMessages = currentChatMessages.filter(m => {
    if (!searchQuery.trim()) return true;
    return m.text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-screen w-screen bg-[#E3E8F5] text-[#102A43] antialiased overflow-hidden flex items-center justify-center relative font-sans p-3 md:p-6 lg:p-7">
      
      {/* 4K Fluid Abstract Light Atmosphere image precisely matching the user's uploaded art, dimmed by 30% to remain supportive */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none opacity-70 bg-gradient-to-b from-white/20 to-slate-200/40">
        <img 
          src={fluidBackground} 
          alt="Fluid Wave Background" 
          className="w-full h-full object-cover object-center pointer-events-none select-none filter brightness-[0.95] contrast-[0.96] saturate-[0.9]"
          referrerPolicy="no-referrer"
        />
        {/* Extra soft glow overlays to bring subtle breathing action */}
        <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vh] bg-gradient-to-br from-[#FFE4EB]/10 via-[#F7E1FF]/6 to-transparent rounded-full blur-[110px] pointer-events-none animate-glow-orb-1" opacity="0.4" />
        <div className="absolute bottom-[-10%] right-[-8%] w-[50vw] h-[50vh] bg-gradient-to-tl from-[#A9C1FF]/10 via-[#CCD0FF]/6 to-transparent rounded-full blur-[120px] pointer-events-none animate-glow-orb-2" opacity="0.4" />
      </div>
      
      {/* Dynamic graphic detail lines (subtle abstract curve layout floating behind the glass window) */}
      <div className="absolute top-[15%] left-[12%] w-[80%] h-[70%] border border-white/40 rounded-[80px] rotate-[-5deg] pointer-events-none opacity-45 z-0 bg-transparent scale-102" />
      <div className="absolute top-[18%] left-[10%] w-[82%] h-[68%] border border-white/50 rounded-[90px] rotate-[3deg] pointer-events-none opacity-40 z-0 bg-transparent" />

      {/* Detached physical flex layout, separating left navigation rail from main chat workspace */}
      <div className="w-full h-full flex flex-row gap-4 relative z-10">
        
        {/* --- VERTICAL RAIL ICONS NAVIGATION PANEL (Column 1 - Compact, Icon-Only Premium Rail) --- */}
        <aside className="w-[72px] bg-white/80 backdrop-blur-[36px] flex flex-col items-center justify-between py-5 h-full shrink-0 hidden md:flex select-none rounded-[24px] border border-white/85 shadow-[0_16px_40px_rgba(30,41,59,0.04)] transition-all duration-300">
          
          {/* Logo Brand Icon */}
          <div className="flex flex-col items-center">
            <div 
              onClick={() => {
                triggerToast("Doctor Ali AI akademiyasiga xush kelibsiz! ✨");
              }}
              className="w-11 h-11 rounded-xl bg-white border border-slate-100 p-1.5 shadow-sm overflow-hidden flex items-center justify-center relative group hover:scale-105 active:scale-95 transition duration-300 cursor-pointer"
            >
              <img src={doctorAliLogo} alt="Doctor Ali AI" className="w-[#26px] h-[#26px] object-contain rounded-lg duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
              
              {/* Tooltip on hover */}
              <div className="absolute left-[80px] bg-[#102A43] text-white px-2.5 py-1 rounded-md text-[11px] font-bold opacity-0 group-hover:opacity-100 duration-200 pointer-events-none whitespace-nowrap shadow-md z-50">
                Doctor Ali AI
              </div>
            </div>
            
            {/* Status dot indicator */}
            <div className="flex items-center gap-1 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          {/* Navigation Items (Icons Only with elegant tooltips) */}
          <nav className="flex flex-col gap-3 w-full px-2 mt-4">
            
            {/* Tooltip Wrapper and Button for Chat */}
            <div className="relative group flex justify-center">
              <button 
                onClick={() => {
                  setActiveMainTab("chat");
                  setShowClientsDrawer(false);
                  triggerToast("Chat muloqoti faollashtirildi! 💬");
                }}
                className={`p-3 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  activeMainTab === "chat" && !showClientsDrawer
                    ? "bg-[#1b6dfb] text-white shadow-[0_4px_12px_rgba(27,109,251,0.25)] scale-105"
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <MessageSquare size={18} className="stroke-[2.2]" />
              </button>
              {/* Tooltip */}
              <div className="absolute left-[64px] top-1/2 -translate-y-1/2 bg-[#102A43] text-white px-2.5 py-1 rounded-md text-[11px] font-bold opacity-0 group-hover:opacity-100 duration-200 pointer-events-none whitespace-nowrap shadow-md z-50">
                Chat
              </div>
            </div>

            {/* Tooltip Wrapper and Button for Clients (Toggles Slide-out drawer) */}
            <div className="relative group flex justify-center">
              <button 
                onClick={() => {
                  setShowClientsDrawer(!showClientsDrawer);
                  triggerToast(showClientsDrawer ? "Mijozlar paneli yopildi" : "Mijozlar paneli ochildi! 👥");
                }}
                className={`p-3 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  showClientsDrawer
                    ? "bg-[#1b6dfb] text-white shadow-[0_4px_12px_rgba(27,109,251,0.25)] scale-105"
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-805"
                }`}
              >
                <Users size={18} className="stroke-[2.2]" />
              </button>
              {/* Tooltip */}
              <div className="absolute left-[64px] top-1/2 -translate-y-1/2 bg-[#102A43] text-white px-2.5 py-1 rounded-md text-[11px] font-bold opacity-0 group-hover:opacity-100 duration-200 pointer-events-none whitespace-nowrap shadow-md z-50">
                Mijozlar & Ssenariylar
              </div>
            </div>

            {/* Tooltip Wrapper and Button for Notifications */}
            <div className="relative group flex justify-center">
              <button 
                onClick={() => setShowNotifications(true)}
                className="p-3 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer text-slate-400 hover:bg-slate-100 hover:text-[#1b6dfb]"
              >
                <div className="relative">
                  <Bell size={18} className="stroke-[2.2]" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                </div>
              </button>
              {/* Tooltip */}
              <div className="absolute left-[64px] top-1/2 -translate-y-1/2 bg-[#102A43] text-white px-2.5 py-1 rounded-md text-[11px] font-bold opacity-0 group-hover:opacity-100 duration-200 pointer-events-none whitespace-nowrap shadow-md z-50">
                Eslatmalar
              </div>
            </div>

            {/* Tooltip Wrapper and Button for Settings/Profile editing */}
            <div className="relative group flex justify-center">
              <button 
                onClick={() => {
                  setIsEditingName(true);
                  setTempName(userName);
                }}
                className="p-3 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer text-slate-400 hover:bg-slate-100 hover:text-[#1b6dfb]"
              >
                <Sliders size={18} className="stroke-[2.2]" />
              </button>
              {/* Tooltip */}
              <div className="absolute left-[64px] top-1/2 -translate-y-1/2 bg-[#102A43] text-white px-2.5 py-1 rounded-md text-[11px] font-bold opacity-0 group-hover:opacity-100 duration-200 pointer-events-none whitespace-nowrap shadow-md z-50">
                Sozlamalar
              </div>
            </div>

          </nav>

          {/* Gamified Profile Avatar displaying achievement badge/XP popover on hover */}
          <div className="w-full flex justify-center relative group pb-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#C026D3] to-[#EC4899] text-white flex items-center justify-center font-extrabold text-sm shadow-sm cursor-pointer select-none">
              {userName.trim()[0] || "M"}
            </div>
            
            {/* Elegant Hover Gamification Badge/Card replacing massive sidebar card */}
            <div className="absolute bottom-2 left-[64px] w-64 bg-white/95 backdrop-blur-xl border border-slate-200 p-4 rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.12)] opacity-0 scale-95 origin-bottom-left group-hover:opacity-100 group-hover:scale-100 duration-300 pointer-events-none z-50">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#C026D3] to-[#EC4899] text-white flex items-center justify-center font-extrabold text-xs">
                  {userName.trim()[0] || "M"}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-extrabold text-slate-800 truncate">{userName}</h4>
                  <p className="text-[9px] text-[#A21CAF] font-bold tracking-widest uppercase mt-0.5">Lider Operator</p>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-slate-500 font-sans">Reyting Toifangiz:</span>
                  <span className="text-slate-800 font-mono">{UZ_LEVEL_MAP[currentLevel.level] || "Boshlovchi Operator"}</span>
                </div>

                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] rounded-full" 
                    style={{ width: `${xp % 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold">
                  <span>{xp % 100} / 100 XP</span>
                  <span>Kelasi unvongacha: {Math.max(0, 100 - (xp % 100))} XP</span>
                </div>
              </div>

              <div className="mt-3 bg-fuchsia-50/50 border border-fuchsia-100/30 rounded-xl p-2 text-[10px] font-medium italic text-[#A21CAF] leading-normal">
                💡 Trainer Maslahati: "{currentLevel.tips ? currentLevel.tips[0] : "Sotuvda samimiylik - asosiy muvaffaqiyat kalitidir!"}"
              </div>
            </div>
          </div>
        </aside>

        {/* --- MAIN WORKSPACE CHAT PANEL CONTAINER (Column 2 and Column 3 Combined - Standalone Premium Card) --- */}
        <div className="flex-1 h-full bg-white/65 backdrop-blur-[38px] overflow-hidden flex flex-row rounded-[28px] border border-white/60 shadow-[0_32px_90px_rgba(30,41,59,0.06),0_10px_20px_rgba(30,41,59,0.02)] relative z-10 transition-all duration-300">
          
          {/* --- CHATS / SESSIONS PANEL LISTING (Column 2 - Hidden natively in Chat-First flow) --- */}
        <section className="w-80 bg-white/45 backdrop-blur-xl border-r border-[#E5EEF6]/60 flex flex-col justify-between h-full shrink-0 hidden select-none z-10">
          
          {/* Header Action Part */}
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[#102A43] tracking-tight">Muloqotlar</h2>
              <button 
                onClick={() => {
                  setShowFavorites(true);
                }}
                className="p-1.5 hover:bg-slate-200/55 rounded-lg text-slate-400 hover:text-yellow-500 transition cursor-pointer"
                title="Sevimli maslahatlar"
              >
                <Star size={15} />
              </button>
            </div>

            {/* Segmented Tab Switcher with Modern Style */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setSidebarTab("mijozlar")}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  sidebarTab === "mijozlar" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                👥 Mijozlar ({customerSessions.length})
              </button>
              <button
                onClick={() => setSidebarTab("agentlar")}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  sidebarTab === "agentlar" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                🤖 AI Agentlar
              </button>
            </div>

            {/* Quick search input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={sidebarTab === "mijozlar" ? "Mijoz ismi yoki xabardan qidirish..." : "Agentlarni qidirish..."}
                className="w-full bg-white text-xs border border-[#E5EEF6] text-slate-700 pl-9 pr-3 py-2 rounded-2xl focus:border-blue-500 outline-none transition font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Sparkly Blue New Chat Button (Always available for customer creation) */}
            {sidebarTab === "mijozlar" && (
              <button
                onClick={startNewCustomerSession}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-extrabold text-xs py-3 px-4 rounded-2xl shadow-glowing-blue hover:brightness-110 flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
              >
                <Sparkles size={13} className="text-white animate-spin-slow" />
                <span>YANGI MIJOZ QO'SHISH</span>
              </button>
            )}
          </div>

          {/* Today/Tab Heading */}
          <div className="px-4 py-1.5 flex items-center justify-between text-[10px] font-mono font-black text-slate-400/80 uppercase tracking-widest border-b border-slate-200/40">
            <span>{sidebarTab === "mijozlar" ? "Mijozlar Tarixi" : "Mutaxassis Agentlar"}</span>
            <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold">
              {sidebarTab === "mijozlar" ? `${customerSessions.length} TA` : "8 AGENT"}
            </span>
          </div>

          {/* List Section: Conditional Rendering based on Tab */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 scrollbar-none">
            {sidebarTab === "mijozlar" ? (
              // --- CUSTOMER SESSIONS LIST ---
              customerSessions
                .filter(s => {
                  if (!searchQuery.trim()) return true;
                  const query = searchQuery.toLowerCase();
                  return s.customerName.toLowerCase().includes(query) || 
                         (s.customerComplaint && s.customerComplaint.toLowerCase().includes(query)) ||
                         s.messages.some(m => m.text.toLowerCase().includes(query));
                })
                .map((session) => {
                  const isSelected = session.id === activeSessionId;
                  const lastMsg = session.messages.length > 0 ? session.messages[session.messages.length - 1].text : "Suhbat hali boshlanmagan.";
                  const cleanLastMsgText = lastMsg.replace(/[\*\_]/g, "");

                  return (
                    <div
                      key={session.id}
                      className={`group w-full text-left p-3.5 pl-4 rounded-xl flex items-start gap-3 border transition-all duration-300 relative ${
                        isSelected 
                          ? "bg-white/85 border-slate-200/50 shadow-[0_4px_25px_-5px_rgba(27,109,251,0.06)]" 
                          : "bg-transparent border-transparent hover:bg-white/30 hover:border-slate-200/20"
                      }`}
                    >
                      {/* Active Indicator Line */}
                      {isSelected && (
                        <span className="absolute left-1.5 top-3.5 bottom-3.5 w-1 bg-[#1b6dfb] rounded-full" />
                      )}

                      {/* Avatar container */}
                      <div className={`w-9.5 h-9.5 rounded-xl flex items-center justify-center text-base shrink-0 duration-300 group-hover:scale-105 ${
                        isSelected ? "bg-blue-100 text-[#1b6dfb]" : "bg-slate-100 text-slate-500"
                      }`}>
                        👤
                      </div>

                      {/* Body Content */}
                      <div 
                        onClick={() => {
                          setActiveSessionId(session.id);
                          setActiveMainTab("chat");
                          
                          // Sync active state variables for other cards
                          if (session.customerName) {
                            const namePart = session.customerName.split(",")[0];
                            setRtCustomerName(namePart);
                          }
                          if (session.customerAge) setRtCustomerAge(session.customerAge);
                          if (session.customerComplaint) {
                            let matchedValue = "bel_boyin_bogim";
                            const compLower = session.customerComplaint.toLowerCase();
                            if (compLower.includes("xotira")) {
                              matchedValue = "xotira_miya_koz";
                            } else if (compLower.includes("kamqonlik") || compLower.includes("holsiz")) {
                              matchedValue = "kamqonlik_holsizlik";
                            } else if (compLower.includes("shamollash") || compLower.includes("immunitet")) {
                              matchedValue = "immunitet_shamollash";
                            }
                            setRtCustomerComplaint(matchedValue);
                          }
                          if (session.customerProduct) setRtCustomerProduct(session.customerProduct);

                          if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                          setCurrentlySpeaking(null);
                        }}
                        className="flex-1 min-w-0 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-[#102A43] text-xs truncate max-w-[130px]">
                            {session.customerName.split(" (")[0]}
                          </span>
                          <span className="text-[9px] text-[#486581]/70 font-medium font-mono shrink-0">
                            {session.createdAt}
                          </span>
                        </div>

                        <p className="text-[9.5px] text-blue-500/80 font-bold truncate mt-0.5">
                          Problem: {session.customerComplaint || "Umumiy shablon"}
                        </p>

                        <p className={`text-[10px] truncate mt-1 leading-normal ${isSelected ? "text-[#102A43]/85 font-semibold" : "text-[#486581]/60"}`}>
                          {cleanLastMsgText}
                        </p>
                      </div>

                      {/* Delete icon - only if we have more than 1 session */}
                      {customerSessions.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomerSessions(prev => prev.filter(s => s.id !== session.id));
                            if (activeSessionId === session.id) {
                              const remaining = customerSessions.filter(s => s.id !== session.id);
                              setActiveSessionId(remaining[0].id);
                            }
                            triggerToast("Suhbat muloqoti o'chirildi! 🗑️");
                          }}
                          className="text-slate-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition duration-200 shrink-0 cursor-pointer"
                          title="Suhbatni o'chirish"
                        >
                          <Trash size={12} />
                        </button>
                      )}
                    </div>
                  );
                })
            ) : (
              // --- STATIC AI AGENTS LITS (Column 2 Fallback) ---
              AGENTS
                .filter(a => searchQuery ? a.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
                .map((agent) => {
                  const isSelected = agent.id === activeAgentId;
                  const chatHist = activeChats[agent.id] || [];
                  const lastMsg = chatHist.length > 0 ? chatHist[chatHist.length - 1].text : agent.shortDescription;
                  const cleanLastMsgText = lastMsg.replace(/[\*\_]/g, "");

                  // Choose colors corresponding to their unique identities
                  let iconBg = "bg-blue-100 text-[#1b6dfb]";
                  if (agent.id === "sotuv-muammolari") iconBg = "bg-rose-100 text-rose-600";
                  else if (agent.id === "mahsulot-eksperti") iconBg = "bg-emerald-100 text-emerald-600";
                  else if (agent.id === "mijoz-tahlilchisi") iconBg = "bg-sky-100 text-sky-600";
                  else if (agent.id === "trening-murabbiyi") iconBg = "bg-purple-100 text-purple-600";
                  else if (agent.id === "mijoz-simulyatori") iconBg = "bg-fuchsia-100 text-fuchsia-600";

                  return (
                    <button
                      key={agent.id}
                      onClick={() => {
                        setActiveAgentId(agent.id);
                        setActiveMainTab("chat");
                        
                        // Sync agentId on active session too
                        setCustomerSessions(prev => prev.map(s => {
                          if (s.id === activeSessionId) return { ...s, activeAgentId: agent.id };
                          return s;
                        }));

                        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                        setCurrentlySpeaking(null);
                        triggerToast(`${agent.name} faollashtirildi! 🧠`);
                      }}
                      className={`w-full text-left p-3.5 pl-4 rounded-xl flex items-center gap-3 border transition-all duration-300 cursor-pointer group relative ${
                        isSelected 
                          ? "bg-white/85 border-slate-200/50 shadow-[0_4px_25px_-5px_rgba(27,109,251,0.06)]" 
                          : "bg-transparent border-transparent hover:bg-white/30 hover:border-slate-200/20"
                      }`}
                    >
                      {/* Active Indicator Line */}
                      {isSelected && (
                        <span className="absolute left-1.5 top-3.5 bottom-3.5 w-1 bg-[#1b6dfb] rounded-full" />
                      )}

                      {/* Icon Avatar container */}
                      <div className={`w-9.5 h-9.5 rounded-xl flex items-center justify-center text-base shrink-0 duration-300 group-hover:scale-105 ${iconBg}`}>
                        {agent.avatar}
                      </div>

                      {/* Body Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="font-extrabold text-[#102A43] text-xs truncate max-w-[125px] sm:max-w-none">
                              {agent.name.replace(" Agenti", "").replace("AI ", "")}
                            </span>
                            {/* Verified badge */}
                            <div className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white p-0.5 scale-90">
                              <Check size={9} className="stroke-[3.5]" />
                            </div>
                          </div>
                        </div>

                        <p className={`text-[10px] truncate mt-0.5 leading-normal ${isSelected ? "text-[#102A43]/80 font-medium" : "text-[#486581]/60"}`}>
                          {cleanLastMsgText}
                        </p>
                      </div>
                    </button>
                  );
                })
            )}
          </div>

          {/* Premium Plan Banner/Rank progress indicator at the bottom (nested in listing column) */}
          <div className="bg-gradient-to-br from-[#7C3AED] via-[#C026D3] to-[#EC4899] text-white rounded-[24px] p-4 m-4 relative overflow-hidden shadow-lg mt-auto min-h-[110px]">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,1)_0%,transparent_80%)] pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            
            <div className="flex items-start gap-3 relative z-10">
              <div className="p-2 bg-white/20 rounded-xl text-white">
                <Trophy size={18} className="animate-bounce" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] uppercase font-black tracking-widest font-mono text-pink-100">Reyting Toifangiz</h4>
                <p className="text-sm font-black truncate leading-tight mt-0.5">{UZ_LEVEL_MAP[currentLevel.level] || "Boshlovchi Operator"}</p>
                <p className="text-[9px] text-pink-100/80 leading-normal mt-1 block">Keyingi unvongacha: {Math.max(0, 100 - (xp % 100))} XP ball</p>
              </div>
              <button 
                onClick={() => {
                  const tips = currentLevel.tips;
                  const randomTip = tips[Math.floor(Math.random() * tips.length)];
                  triggerToast(`Murabbiy maslahati: "${randomTip}"`);
                }}
                className="bg-white text-[#C026D3] p-1.5 rounded-full hover:scale-105 duration-200 shadow cursor-pointer self-center"
              >
                <ChevronRight size={13} className="stroke-[2.5]" />
              </button>
            </div>
          </div>
        </section>

        {/* --- CENTRAL WORKSPACE CHAT PANEL AREA (Column 3) --- */}
        <main className="flex-1 flex flex-col h-full bg-[#F4F6FC]/94 backdrop-blur-3xl relative overflow-hidden transition-all duration-300">
          {activeMainTab === "chat" ? (
            <>
              {/* Header Bar precisely matching screenshot */}
          <header className="h-[76px] border-b border-[#E5EEF6]/50 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md shrink-0 select-none">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="font-extrabold text-[#102A43] text-[16px] md:text-[17px] tracking-tight leading-none font-sans">
                    Doctor Ali <span className="text-[#3b82f6]">AI</span>
                  </h1>
                </div>
                {/* AI faoliyatda status pill */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#EDFDF5]/85 border border-emerald-100 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-600 font-extrabold tracking-tight">AI faoliyatda</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Header action buttons precisely styled like the top right of the screenshot: Spark, Clock, ThreeDots vertical */}
            <div className="flex items-center gap-4 text-slate-400">
              <button 
                onClick={() => triggerToast("Professor Ali tahlili mustahkam va faol! ✨")} 
                className="hover:text-[#3b82f6] transition duration-200 cursor-pointer p-1"
                title="Aqlli Tahlil"
              >
                <Sparkles size={16} className="stroke-[1.8]" />
              </button>
              
              <button 
                onClick={() => triggerToast("Muloqot joriy vaqti: " + new Date().toLocaleTimeString("uz-UZ", {hour: "2-digit", minute: "2-digit"}))} 
                className="hover:text-[#3b82f6] transition duration-200 cursor-pointer p-1"
                title="Tarixiy Vaqt"
              >
                <Clock size={16} className="stroke-[1.8]" />
              </button>

              <button 
                onClick={handleExportChat} 
                className="hover:text-[#3b82f6] transition duration-200 cursor-pointer p-1"
                title="Eksport va sozlamalar"
              >
                <MoreVertical size={16} className="stroke-[1.8]" />
              </button>
            </div>
          </header>

          {/* Core scrollable messages or wizard panel */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-transparent scrollbar-none" id="chat-messages-container">
            
            {activeAgentId === "trening-murabbiyi" ? (
              
              // --- VIOLET/BLUE NEUMORPHIC QUIZ INTERFACE ---
              <div className="flex flex-col gap-5 py-4 max-w-2xl mx-auto w-full">
                <div className="bg-white border border-[#E5EEF6] rounded-3xl p-6 shadow-xl relative overflow-hidden">
                  
                  {/* Quiz count badge */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <span className="text-xs font-mono font-bold text-[#1b6dfb] uppercase tracking-widest">
                      Savol: {currentQuizIndex + 1} / {UZ_QUIZ_QUESTIONS.length}
                    </span>
                    <span className="text-[10px] py-1 px-3 bg-emerald-50 text-emerald-600 rounded-full font-black uppercase font-mono border border-emerald-200/50">
                      +30 XP BALL
                    </span>
                  </div>

                  <h4 className="text-base md:text-lg font-extrabold text-[#102A43] leading-snug">
                    {UZ_QUIZ_QUESTIONS[currentQuizIndex].question}
                  </h4>

                  <div className="mt-6 flex flex-col gap-3">
                    {UZ_QUIZ_QUESTIONS[currentQuizIndex].options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === UZ_QUIZ_QUESTIONS[currentQuizIndex].answerIndex;
                      let btnStyle = "bg-white border-[#E5EEF6] text-slate-700 hover:bg-slate-50 hover:border-slate-300";
                      
                      if (quizAnswered) {
                        if (isCorrect) {
                          btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-700 pointer-events-none";
                        } else if (isSelected) {
                          btnStyle = "bg-rose-50 border-rose-500 text-rose-700 pointer-events-none";
                        } else {
                          btnStyle = "opacity-40 bg-slate-50 border-transparent text-slate-400 pointer-events-none";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={quizAnswered}
                          onClick={() => handleAnswerQuiz(idx)}
                          className={`text-left text-xs md:text-sm p-4 rounded-2xl border transition-all duration-200 font-bold flex items-start gap-3 cursor-pointer ${btnStyle}`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[11px] shrink-0 border ${
                            isSelected ? "bg-blue-600 border-blue-600 text-white" : "bg-slate-100 border-slate-200 text-slate-500"
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Quiz result feedback block */}
                  {quizAnswered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 rounded-2xl bg-blue-50/50 border border-blue-200/50 text-xs md:text-sm text-slate-700 leading-normal"
                    >
                      <p className="font-extrabold text-[#1b6dfb] mb-1">📋 To'liq tahlil:</p>
                      <p className="font-medium">{quizFeedback}</p>
                    </motion.div>
                  )}
                </div>

                {quizAnswered && (
                  <button
                    onClick={handleNextQuiz}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-extrabold uppercase text-xs py-3.5 px-6 rounded-2xl shadow-glowing-blue hover:scale-101 transition self-end flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>KEYINGI SINAV SAVOLI</span>
                    <ChevronRight size={14} className="stroke-[2.5]" />
                  </button>
                )}
              </div>

            ) : activeAgentId === "mijoz-simulyatori" && !roleplayActive ? (
              
              // --- SIMULATION SCENARIO SELECTOR CARD VIEW ---
              <div className="flex flex-col gap-4 py-4 max-w-4xl mx-auto w-full">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-black text-[#102A43] uppercase tracking-tight">XARIDOR SENARIYLARI</h4>
                  <p className="text-xs text-[#486581]/70 font-medium">Buxorodan David Cole yoki Sarah Jenkins... Qaysi turdagi xaridor bilan imtihon topshirasiz?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {UZ_ROLEPLAY_SCENARIOS.map((scenario) => {
                    const targetProd = UZ_DOCTOR_ALI_PRODUCTS.find(p => p.id === scenario.targetProduct);
                    return (
                      <div 
                        key={scenario.id}
                        className="bg-white border border-[#E5EEF6] rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[10px] uppercase font-bold py-0.5 px-2 rounded-md font-mono ${
                              scenario.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                              scenario.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                              "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}>
                              Qiyinchilik: {scenario.difficulty === "Easy" ? "Oson" : scenario.difficulty === "Medium" ? "O'rtacha" : "Qiyin"}
                            </span>
                            <span className="text-[10px] text-[#486581]/70 font-mono font-bold uppercase">{scenario.persona}</span>
                          </div>
                          
                          <h5 className="font-extrabold text-[#102A43] text-sm md:text-base leading-tight mb-2">
                            {scenario.title}
                          </h5>
                          <p className="text-xs text-[#486581]/80 leading-relaxed font-semibold mb-3">
                            {scenario.background}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <span className="text-[9px] text-[#486581]/60 uppercase block font-mono font-bold">Mo'ljaldagi mahsulot</span>
                            <span className="text-[#102A43] text-xs font-bold font-serif italic">{targetProd?.name}</span>
                          </div>
                          <button
                            onClick={() => startRoleplaySession(scenario.id)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-xl text-xs font-black uppercase shadow-glowing-blue hover:scale-102 transition flex items-center gap-1 cursor-pointer"
                          >
                            <Play size={10} className="fill-current" />
                            <span>BOSHLASH</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            ) : currentChatMessages.length <= 1 ? (
              
              // --- MINIMAL, PREMIUM AI GREETING SCREEN STATE ---
              <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center my-auto animate-fade-in max-w-xl mx-auto w-full">
                
                {/* Centered Premium Doctor Ali Brand Logo with elegant rounded borders */}
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 p-1 mb-6 shadow-sm mx-auto overflow-hidden">
                  <img src={doctorAliLogo} alt="Doctor Ali AI logo" className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold text-[#102A43] tracking-tight mb-2 font-display">
                  Doctor Ali AI
                </h1>
                
                <p className="text-sm md:text-base text-slate-500 font-medium tracking-wide mb-8">
                  Yangi suhbatni boshlang
                </p>

                {/* Centered Name editor if config toggled */}
                {isEditingName && (
                  <div className="w-full bg-slate-50 border border-slate-150 rounded-2xl p-4 mb-4 flex flex-col gap-2 animate-fade-in text-left">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Ismingiz:</span>
                    <div className="flex gap-2 mt-1">
                      <input 
                        type="text" 
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-blue-500 flex-1 text-slate-705 font-bold"
                        placeholder="Operator ismi..."
                      />
                      <button 
                        onClick={handleSaveUserName}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded-xl font-bold cursor-pointer transition"
                      >
                        Saqlash
                      </button>
                    </div>
                  </div>
                )}

                {/* Centered floating-appearance input composer */}
                <div className="w-full mb-6">
                  {renderUnifiedInputBox()}
                </div>

                {/* Suggestive prompts pills underneath */}
                <div className="w-full">
                  <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest block mb-2 text-center">Tavsiya qilingan maslahatlar:</span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {activeAgent?.quickPrompts.slice(0, 3).map((promptText, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(promptText)}
                        className="bg-white/90 hover:bg-[#F3F5FC] border border-slate-200 hover:border-blue-200 text-slate-600 text-[11px] px-3.5 py-1.5 rounded-xl font-bold transition shadow-sm hover:scale-[1.01] cursor-pointer"
                      >
                        {promptText}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            ) : (
              
              // --- MESSAGES VIEWER ---
              <div className="flex flex-col gap-4">
                {filteredMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 my-auto">
                    <Search size={32} className="opacity-30 mb-2 stroke-[1.5]" />
                    <p className="text-xs">Ushbu kalit so'z bo'yicha hech qanday xabar topilmadi.</p>
                  </div>
                ) : (
                  filteredMessages.map((msg) => {
                    const isUser = msg.role === "user";
                    const isSystem = msg.role === "system";
                    const isSpeechActive = currentlySpeaking === msg.id;

                    if (isSystem) {
                      return (
                        <div key={msg.id} className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs self-center max-w-lg leading-normal font-medium text-center shadow-sm">
                          {msg.text}
                        </div>
                      );
                    }

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.22 }}
                        className={`flex items-start gap-3 w-full ${isUser ? "flex-row-reverse" : "flex-row"}`}
                      >
                        {/* Avatar precisely designed to look gorgeous */}
                        <div className={`w-[44px] h-[44px] rounded-[16px] flex items-center justify-center shrink-0 border transition-transform duration-300 hover:scale-105 overflow-hidden ${
                          isUser 
                            ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-sm border-blue-600 shadow-sm" 
                            : "bg-white border-[#E5EEF6] p-1.5 shadow-sm"
                        }`}>
                          {isUser ? (
                            <span>{userName.charAt(0).toUpperCase()}</span>
                          ) : (
                            <img src={doctorAliLogo} alt="Doctor Ali AI" className="w-full h-full object-contain rounded-lg" referrerPolicy="no-referrer" />
                          )}
                        </div>

                        {/* Content bubble wrapper */}
                        <div className={`flex flex-col max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
                          <div className="flex items-center gap-1.5 mb-1 text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
                            <span className={isUser ? "text-blue-600" : "text-slate-500"}>{isUser ? "Siz" : "DOCTOR ALI AI"}</span>
                            <span>•</span>
                            <span>{msg.timestamp}</span>
                          </div>

                          {/* Speech Card precisely designed like the screenshot with soft shadows */}
                          <div className={`p-4 rounded-[22px] relative group transition-all duration-300 border ${
                            isUser 
                              ? "bg-gradient-to-r from-blue-500 to-[#5B5CE2] text-white rounded-tr-none border-[#1b6dfb] shadow-[0_10px_25px_rgba(27,109,251,0.18)] font-medium text-sm leading-relaxed" 
                              : "bg-white border-slate-100 text-[#102A43] rounded-tl-none shadow-[0_12px_30px_rgba(165,185,210,0.14)] font-semibold text-sm leading-relaxed"
                          }`}>
                            
                            {/* Rich text processor */}
                            <FormattedMarkdownText text={msg.text} search={searchQuery} onOptionClick={handleSendMessage} />

                            {/* Double blue read checks for User message (like screenshot) */}
                            {isUser && (
                              <div className="flex justify-end mt-2 items-center gap-1 opacity-90 text-white">
                                <span className="text-[8px] font-mono font-bold">{msg.timestamp}</span>
                                <Check size={14} className="stroke-[3.5]" />
                              </div>
                            )}

                            {/* Floating Reaction tools on hover */}
                            <div className={`absolute -bottom-3.5 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white border border-[#E5EEF6] rounded-xl p-1 shadow-md z-15 text-slate-500`}>
                              
                              <button
                                onClick={() => handleToggleFavorite(msg)}
                                className="p-1 hover:scale-110 transition text-yellow-500 cursor-pointer"
                                title="Sevimlilarga qo'shish"
                              >
                                <Star size={11} className={savedFavorites.some(f => f.id === msg.id) ? "fill-current" : ""} />
                              </button>

                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(msg.text);
                                  triggerToast("Nusxalandi! 📋");
                                }}
                                className="p-1 hover:scale-110 transition hover:text-blue-500 cursor-pointer"
                                title="Nusxalash"
                              >
                                <Copy size={11} />
                              </button>

                              {!isUser && (
                                <button
                                  onClick={() => handleToggleVoiceOutput(msg.text, msg.id)}
                                  className={`p-1 hover:scale-110 transition cursor-pointer ${isSpeechActive ? "text-red-500 animate-pulse" : "hover:text-blue-500"}`}
                                  title="Ovozli tinglash"
                                >
                                  {isSpeechActive ? <VolumeX size={11} /> : <Volume2 size={11} />}
                                </button>
                              )}
                            </div>

                            {isSpeechActive && !isUser && (
                              <div className="mt-2 text-center pt-2 border-t border-slate-100 flex items-center gap-2 text-[10px] text-blue-600 font-mono">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                <span>Ovozda eshittirilmoqda...</span>
                                <div className="flex gap-0.5 items-end h-2 ml-1">
                                  <span className="w-0.5 bg-blue-600 animate-[pulse_0.4s_infinite_alternate]" style={{ height: "40%" }} />
                                  <span className="w-0.5 bg-blue-600 animate-[pulse_0.6s_infinite_alternate]" style={{ height: "100%" }} />
                                  <span className="w-0.5 bg-blue-600 animate-[pulse_0.5s_infinite_alternate]" style={{ height: "60%" }} />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}

                {/* Loading typing state feedback bubbles */}
                {isAiTyping && (
                  <div className="flex items-start gap-3 w-full flex-row">
                    <div className="w-8.5 h-8.5 rounded-xl flex items-center justify-center text-xs shrink-0 shadow-sm border bg-white border-[#E5EEF6] text-blue-600 font-bold">
                      {activeAgent?.avatar || "🎓"}
                    </div>

                    <div className="flex flex-col items-start w-full max-w-[70%]">
                      <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#1b6dfb] px-1 mb-1 animate-pulse">
                        {loadingText}
                      </div>
                      
                      <div className="bg-white border border-[#E5EEF6] p-4 rounded-3xl rounded-tl-none shadow-sm flex flex-col gap-2 w-full">
                        <span className="text-[11px] text-slate-400 italic">Xavfsiz ulanish yuklanmoqda...</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-[bounce_0.6s_infinite]" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-[bounce_0.6s_infinite]" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-[bounce_0.6s_infinite]" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Simulated target grading output panel */}
            {evaluationResult && activeAgentId === "mijoz-simulyatori" && (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 my-6 max-w-3xl mx-auto w-full shadow-xl z-20 text-slate-700"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white py-1 px-2.5 rounded-lg font-mono font-bold text-[10px]">REPORT</div>
                    <h4 className="font-extrabold text-[#102A43] text-base md:text-lg">PROFESSONAL SOTUV BAHOSARI</h4>
                  </div>
                  <button 
                    onClick={() => setEvaluationResult(null)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                  
                  {/* Radial circular score gauge */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 border border-[#E5EEF6] rounded-2xl text-center relative min-h-[160px]">
                    <span className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-wider mb-2">Baho ko'rsatkich</span>
                    
                    <div className="w-24 h-24 rounded-full border-4 border-dashed border-blue-500/40 flex items-center justify-center animate-[spin_40s_linear_infinite]" />
                    
                    <div className="absolute text-center">
                      <span className="text-3xl font-black text-[#102A43]">{evaluationResult.score}</span>
                      <span className="text-[10px] text-slate-400 font-bold block">/ 10</span>
                    </div>

                    <div className="mt-3">
                      <span className="text-[9px] py-1 px-3 bg-emerald-50 text-emerald-600 rounded-full font-bold uppercase tracking-wider block border border-emerald-100">
                        {(evaluationResult.score || 7) >= 8 ? "YAXSHI MULOQOT" : "TAVSIYALAR BOR"}
                      </span>
                    </div>
                  </div>

                  {/* Breakdown details */}
                  <div className="md:col-span-8 flex flex-col gap-2.5 text-xs text-slate-600">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-blue-600 font-extrabold block">📞 Muloqot Sifati:</span>
                      <p className="font-medium">{evaluationResult.communicationQuality}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-blue-600 font-extrabold block">💡 Mijozni Tushunish:</span>
                      <p className="font-medium">{evaluationResult.customerUnderstanding}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-blue-600 font-extrabold block">📈 SPIN Selling Qo'llanilishi:</span>
                      <p className="font-medium">{evaluationResult.spinApplication}</p>
                    </div>
                  </div>
                </div>

                {/* Strengths & Weaknesses list bento view */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                    <span className="text-emerald-700 font-extrabold flex items-center gap-1.5 text-xs mb-2 uppercase tracking-wide">
                      <ShieldCheck size={13} />
                      <span>KUCHLI TOMONLARINIZ 🌟</span>
                    </span>
                    <ul className="list-disc pl-4 text-[11px] text-slate-700 font-semibold space-y-1">
                      {evaluationResult.strengths?.map((str: string, index: number) => (
                        <li key={index}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                    <span className="text-rose-700 font-extrabold flex items-center gap-1.5 text-xs mb-2 uppercase tracking-wide">
                      <AlertTriangle size={13} />
                      <span>YAXSHILASH TAVSIYALARI ⚠️</span>
                    </span>
                    <ul className="list-disc pl-4 text-[11px] text-slate-700 font-semibold space-y-1">
                      {evaluationResult.weaknesses?.map((weak: string, index: number) => (
                        <li key={index}>{weak}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Detailed feedback commentary */}
                <div className="bg-blue-50/50 border-2 border-dashed border-blue-200/50 rounded-2xl p-4 mt-5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-blue-600 block mb-1 font-mono">
                    PROFESSORDAN MOTIVATSIYA
                  </span>
                  <p className="text-xs md:text-sm italic font-medium leading-relaxed text-slate-700">
                    "{evaluationResult.detailedFeedback}"
                  </p>
                </div>

                <div className="mt-5 flex gap-2.5 justify-end">
                  <button
                    onClick={() => {
                      setRoleplayActive(false);
                      setSelectedScenarioId(null);
                      setEvaluationResult(null);
                    }}
                    className="bg-transparent text-slate-500 hover:text-slate-700 border border-slate-200 px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Ssenariylarga qaytish
                  </button>
                  <button
                    onClick={() => startRoleplaySession(selectedScenarioId!)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-xl text-xs font-black uppercase shadow-glowing-blue transition cursor-pointer"
                  >
                    Qaytadan urinish
                  </button>
                </div>
              </motion.div>
            )}

          </div>

          {/* Bottom active message input bar, styled beautifully like a floating composer */}
          {activeAgentId !== "trening-murabbiyi" && currentChatMessages.length > 1 && (
            <footer className="p-5 bg-transparent shrink-0 space-y-3.5 mt-auto max-w-4xl mx-auto w-full select-none">
              
              {/* AQLLI TAKLIFLAR (Smart Suggestions with purple magical sparkles and refresh arrow) */}
              <div className="flex flex-col gap-2 px-1 select-none">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block font-sans">
                    AQLLI TAKLIFLAR
                  </span>
                  
                  {/* Small Refresh trigger badge */}
                  <button 
                    onClick={() => {
                      triggerToast("Aqlli takliflar yangilandi! 🪄");
                    }} 
                    className="w-7 h-7 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 text-slate-500 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                    title="Yangilash"
                  >
                    <Sparkles size={11} className="text-[#8E5CE2]" />
                  </button>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 animate-fade-in">
                  {getDynamicSuggestions().slice(0, 4).map((text) => (
                    <button
                      key={text}
                      onClick={() => handleSendMessage(text)}
                      className="bg-white hover:bg-[#F3F5FC] border border-slate-200/80 hover:border-blue-300 text-[11px] font-bold px-4 py-2 rounded-full text-slate-700 shadow-sm hover:scale-[1.01] hover:shadow transition duration-240 cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkle size={11} className="text-[#8E5CE2] fill-[#8E5CE2]/10" />
                      <span>{text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {renderUnifiedInputBox()}

              {/* Padlock security footnote centering exactly like user's image */}
              <div className="flex items-center justify-center gap-1 mt-2.5 text-slate-400 select-none pb-1 animate-fade-in">
                <span className="text-[10px] tracking-tight text-slate-400/80 font-medium">
                  🔒 AI javoblar Doctor Ali bilim bazasiga asoslangan. Xavfsiz va maxfiy.
                </span>
              </div>
            </footer>
          )}

          {/* Float evaluate button inside roleplay */}
          {activeAgentId === "mijoz-simulyatori" && roleplayActive && !evaluationResult && currentChatMessages.length >= 3 && (
            <div className="absolute top-18 right-4 z-40">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleEvaluateSimulation}
                disabled={isEvaluating}
                className="bg-red-500 hover:bg-red-600 text-white font-black uppercase text-[10px] py-1.5 px-3 rounded-full border border-red-400 shadow-lg flex items-center gap-1.5 hover:scale-102 transition cursor-pointer"
              >
                <Zap size={11} className="fill-current animate-pulse" />
                <span>Muloqotni Baholash</span>
              </motion.button>
            </div>
          )}
            </>
          ) : (
            <div className="flex-1 flex flex-col h-full bg-[#F5F8FC] overflow-hidden select-none">
              {/* Spacious & Roomy DOCTOR ALI CRM Central Workspace */}
              <header className="h-16 border-b border-[#E5EEF6] px-6 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow">
                    CRM
                  </div>
                  <div>
                    <h1 className="font-extrabold text-[#102A43] text-sm md:text-base leading-none">
                      Doctor Ali AI CRM Platformasi
                    </h1>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Avtomatik mijozlar va ehtiyojlar monitoring tizimi</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-600 px-3 py-1 rounded-full font-black uppercase tracking-tight font-mono">
                    ● TIZIM FAOL (DATABASE SYNCED)
                  </span>
                </div>
              </header>

              {/* CRM View Tabs */}
              <div className="bg-white border-b border-[#E5EEF6] px-6 py-2 flex items-center gap-2 shrink-0 overflow-x-auto">
                <button
                  onClick={() => setActiveRightTab("dashboard")}
                  className={`py-2 px-3 border-b-2 text-[11px] font-black transition-all cursor-pointer ${
                    activeRightTab === "dashboard"
                      ? "border-blue-600 text-blue-600 font-extrabold"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  📊 DASHBOARD STATS
                </button>
                <button
                  onClick={() => setActiveRightTab("mijozlar")}
                  className={`py-2 px-3 border-b-2 text-[11px] font-black transition-all cursor-pointer ${
                    activeRightTab === "mijozlar"
                      ? "border-blue-600 text-blue-600 font-extrabold"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  👥 HAMMA MIJOZLAR ({crmCustomers.length})
                </button>
                <button
                  onClick={() => setActiveRightTab("anketa")}
                  className={`py-2 px-3 border-b-2 text-[11px] font-black transition-all cursor-pointer ${
                    activeRightTab === "anketa"
                      ? "border-blue-600 text-blue-600 font-extrabold"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  📝 ANKETA / KARTA TAHRIRI
                </button>
                <button
                  onClick={() => setActiveRightTab("katalog")}
                  className={`py-2 px-3 border-b-2 text-[11px] font-black transition-all cursor-pointer ${
                    activeRightTab === "katalog"
                      ? "border-blue-600 text-blue-600 font-extrabold"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  📦 DARMONLAR KATALOGI
                </button>
              </div>

              {/* Dynamic Roomy Views */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeRightTab === "dashboard" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4">
                      <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block pl-1">Ko'rsatkichlar</span>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border border-[#E5EEF6] p-5 rounded-2xl shadow-sm text-left">
                          <span className="text-[9px] text-slate-400 font-mono font-bold block uppercase">Bugungi vazifalar</span>
                          <span className="text-xl font-black text-blue-600 block mt-1">
                            {crmCustomers.filter(c => c.nextContactDate === "2026-06-17" || c.status === "🔵 Qayta bog'lanish kerak").length} ta mijoz
                          </span>
                        </div>
                        <div className="bg-white border border-[#E5EEF6] p-5 rounded-2xl shadow-sm text-left">
                          <span className="text-[9px] text-slate-400 font-mono font-bold block uppercase text-rose-500">HOT LEADS</span>
                          <span className="text-xl font-black text-rose-600 block mt-1">
                            {crmCustomers.filter(c => c.leadRating === "HOT LEAD" && c.status !== "✅ Sotib oldi").length} ta lead
                          </span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-[#102A43] to-[#243B53] text-white rounded-2xl p-5 shadow text-left">
                        <span className="text-[8px] font-mono font-black text-blue-200 uppercase tracking-widest block mb-1">CRM Strategiyasi</span>
                        <h4 className="text-xs font-bold font-sans">Mijoz Ism va Yosh Qoidasi</h4>
                        <p className="text-[11px] leading-relaxed mt-2 text-slate-300">
                          Har doim mijoz kartasi bilan ishlang. Ism va yosh ma'lumotlarisiz: Sotuv skripti yozilmaydi, e'tiroz tahlil qilinmaydi va mahsulot tavsiya qilinmaydi!
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-[#E5EEF6] rounded-2xl p-5 shadow-sm text-left">
                      <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block mb-3">AI Avtomatik Eslatmalar</span>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {(() => {
                          const alerts: string[] = [];
                          crmCustomers.forEach(cust => {
                            if (cust.status !== "✅ Sotib oldi" && cust.status !== "❌ Rad etdi") {
                              const lastDate = new Date(cust.lastContactDate || "2026-06-17");
                              const todayDate = new Date("2026-06-17");
                              const diffDays = Math.ceil(Math.abs(todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                              if (diffDays >= 3) {
                                alerts.push(`Mijoz ${cust.name} bilan 3 kundan beri bog'lanilmagan.`);
                              }
                            }
                            if (cust.nextContactDate === "2026-06-17" && cust.status !== "✅ Sotib oldi") {
                              alerts.push(`Bugun ${cust.name} bilan qayta bog'lanish lozim.`);
                            }
                          });
                          if (alerts.length === 0) return <p className="text-[11px] text-slate-400 font-bold py-10 text-center">Eslatmalar yo'q.</p>;
                          return alerts.map((al, idx) => (
                            <div key={idx} className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-[11px] font-bold text-amber-800 flex items-start gap-2 leading-relaxed">
                              <span>⚠️</span>
                              <span>{al}</span>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {activeRightTab === "mijozlar" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <div className="bg-white border border-[#E5EEF6] p-4 rounded-2xl shadow-sm space-y-4 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-[#102A43]">Mijozlar ({crmCustomers.length})</span>
                        <button
                          onClick={handleAddCustomer}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg font-bold"
                        >
                          ➕ QO'SHISH
                        </button>
                      </div>

                      <div className="relative">
                        <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          value={searchCrmQuery}
                          onChange={(e) => setSearchCrmQuery(e.target.value)}
                          placeholder="Mijoz ismi yoki dardi..."
                          className="w-full bg-[#F5F8FC]/60 text-[11px] border border-[#E5EEF6] pl-8 pr-2 py-1.5 rounded-xl focus:border-blue-500 outline-none transition font-semibold"
                        />
                      </div>

                      <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                        {crmCustomers.filter(c => {
                          const q = searchCrmQuery.toLowerCase();
                          return c.name.toLowerCase().includes(q) || c.problem.toLowerCase().includes(q);
                        }).map(cust => {
                          const isActive = cust.id === activeCustomerId;
                          return (
                            <div 
                              key={cust.id} 
                              onClick={() => selectActiveCustomer(cust.id)}
                              className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                                isActive 
                                  ? "bg-blue-50 border-blue-500" 
                                  : "bg-white border-[#E5EEF6] hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center justify-between font-extrabold text-[#102A43] text-xs">
                                <span className="truncate">{cust.name}</span>
                                <span className="text-slate-400 text-[10px]">{cust.age} yosh</span>
                              </div>
                              <span className="text-[10px] text-slate-500 block truncate mt-1">Dardi: {cust.problem}</span>
                              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                                <span className="text-[8px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-black font-mono">
                                  {cust.status}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCustomer(cust.id, cust.name);
                                  }}
                                  className="text-rose-500 hover:text-rose-700 font-bold"
                                >
                                  O'chirish
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      {(() => {
                        const activeCust = crmCustomers.find(c => c.id === activeCustomerId);
                        if (!activeCust) return (
                          <div className="bg-white border border-dashed border-slate-200 p-12 rounded-2xl text-center text-slate-400">
                            <p className="text-xs font-bold">Mijoz tafsilotlarini ko'rish uchun chap ro'yxatdan tanlang!</p>
                          </div>
                        );
                        return (
                          <div className="bg-white border border-[#E5EEF6] rounded-2xl p-6 shadow-sm space-y-5 text-left font-semibold">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                              <div>
                                <h3 className="text-base font-black text-[#102A43]">{activeCust.name}</h3>
                                <p className="text-[10px] text-slate-400">Yoshi: {activeCust.age} yosh | Status: {activeCust.status}</p>
                              </div>
                              <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full uppercase font-black tracking-wider">
                                {activeCust.leadRating}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold leading-relaxed">
                              <div>
                                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono block">🔍 Asosiy Shikoyati:</span>
                                <p className="text-slate-800 font-bold mt-1 text-sm">{activeCust.problem}</p>
                              </div>
                              <div>
                                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono block">⚡ Bosqich:</span>
                                <p className="text-blue-600 font-black mt-1 text-sm">{activeCust.stage || "1-BOSQICH: Ism"}</p>
                              </div>
                              <div className="sm:col-span-2">
                                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono block">📝 Izoh / Qaydlar:</span>
                                <p className="text-slate-600 mt-1 italic">"{activeCust.notes || "Izoh kiritilmagan"}"</p>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-slate-100">
                              <button
                                onClick={() => {
                                  setActiveMainTab("chat");
                                  triggerToast(`${activeCust.name} bilan suhbatga tushdik!`);
                                }}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition cursor-pointer"
                              >
                                💬 USHBU MIJOZ BILAN SUHBATNI CHATDA BOSHLASH
                              </button>
                              <button
                                onClick={() => setActiveRightTab("anketa")}
                                className="bg-slate-100 hover:bg-slate-200 text-[#102A43] font-bold text-xs px-4 rounded-xl transition cursor-pointer"
                              >
                                Tahrirlash
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {activeRightTab === "anketa" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start text-left">
                    <div className="bg-white border border-[#E5EEF6] p-5 rounded-2xl shadow-sm space-y-4">
                      <span className="text-xs font-black uppercase text-blue-600 font-mono tracking-widest block pb-2 border-b border-slate-100">Karta ma'lumotlarini to'ldirish</span>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-extrabold text-[#102A43] block mb-1">Mijoz Ismi (Majburiy)</label>
                          <input
                            type="text"
                            value={rtCustomerName}
                            onChange={(e) => setRtCustomerName(e.target.value)}
                            placeholder="Ismini kiriting..."
                            className="w-full bg-[#F5F8FC]/60 border border-[#E5EEF6] text-xs font-semibold px-4 py-2 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition text-slate-700"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-extrabold text-[#102A43] block mb-1">Yoshi (Majburiy)</label>
                            <input
                              type="text"
                              value={rtCustomerAge}
                              onChange={(e) => setRtCustomerAge(e.target.value)}
                              placeholder="Yoshi..."
                              className="w-full bg-[#F5F8FC]/60 border border-[#E5EEF6] text-xs font-semibold px-4 py-2 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition text-slate-700"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-extrabold text-[#102A43] block mb-1">Suhbat Bosqichi</label>
                            <select
                              value={rtCustomerStage}
                              onChange={(e) => setRtCustomerStage(e.target.value)}
                              className="w-full bg-[#F5F8FC]/60 border border-[#E5EEF6] text-xs font-semibold px-4 py-2 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition text-slate-700"
                            >
                              <option value="1-BOSQICH: Ism">1-BOSQICH: Ism 👋</option>
                              <option value="2-BOSQICH: Yoshi">2-BOSQICH: Yoshi 🎂</option>
                              <option value="3-BOSQICH: Muammo">3-BOSQICH: Muammo 🔍</option>
                              <option value="4-BOSQICH: SPIN savollari">4-BOSQICH: SPIN 📋</option>
                              <option value="5-BOSQICH: Tavsiya">5-BOSQICH: Tavsiya 🛍️</option>
                              <option value="6-BOSQICH: E'tirozlar / Narx">6-BOSQICH: Narx / E'tiroz 💰</option>
                              <option value="7-BOSQICH: Yopish (Closing)">7-BOSQICH: Yopish ✅</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-extrabold text-[#102A43] block mb-1">Qaydlar / Izoh</label>
                          <textarea
                            value={rtCustomerNotes}
                            onChange={(e) => setRtCustomerNotes(e.target.value)}
                            placeholder="Mijoz haqida batafsil..."
                            rows={3}
                            className="w-full bg-[#F5F8FC]/60 border border-[#E5EEF6] text-xs font-semibold px-4 py-2 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition text-slate-700"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-[#F5F8FC]/60 border border-[#E5EEF6] p-5 rounded-2xl">
                        <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block mb-2">Qabul qilingan shikoyat (Muammo):</span>
                        <div className="grid grid-cols-2 gap-2">
                          {COMPLAINT_PRESETS.map((p) => {
                            const isSelected = rtCustomerComplaint === p.value;
                            return (
                              <button
                                key={p.value}
                                onClick={() => {
                                  setRtCustomerComplaint(p.value);
                                  triggerToast(`Dard belgilandi: ${p.label}`);
                                }}
                                className={`text-[10px] p-2 rounded-xl border text-left font-bold transition duration-150 cursor-pointer ${
                                  isSelected
                                    ? "bg-slate-900 border-slate-900 text-white shadow"
                                    : "bg-white border-[#E5EEF6] hover:bg-slate-50"
                                }`}
                              >
                                {p.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {rtCustomerComplaint && (
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-left space-y-2">
                          <span className="text-[9px] font-mono font-black text-blue-600 block uppercase tracking-widest">AKADEMIK TAVSIYA ETILGAN TIKLANISH</span>
                          {(() => {
                            const pr = COMPLAINT_PRESETS.find(p => p.value === rtCustomerComplaint);
                            if (!pr) return null;
                            const matchedProds = UZ_DOCTOR_ALI_PRODUCTS.filter(p => pr.products.includes(p.id));
                            return (
                              <>
                                {matchedProds.map(p => (
                                  <div key={p.id} className="bg-white p-3 rounded-xl border border-slate-100 text-xs text-[#102A43] font-semibold">
                                    <strong>{p.name}</strong> - {p.shortDescription}
                                  </div>
                                ))}
                                <button
                                  onClick={() => {
                                    const generatedPrompt = `Mijoz ismi: ${rtCustomerName || "Noma'lum"}. Yoshi: ${rtCustomerAge || "Noma'lum"}. Shikoyat darsi: ${pr.label}. Mahsulotlar: ${matchedProds.map(p => p.name).join(", ")}. Muloqotni davom etishga tegishli sotuv skriptini ta'minlab ber!`;
                                    setInputText(generatedPrompt);
                                    setActiveMainTab("chat");
                                    triggerToast("Tavsiya hujjati chatga tayyorlandi!");
                                  }}
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] py-2 rounded-xl transition cursor-pointer"
                                >
                                  TAVSIYALAR + SKRIPT TA'MINLASH (CHATGA O'TISH)
                                </button>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeRightTab === "katalog" && (
                  <div className="space-y-4 text-left">
                    <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block pl-1">Mahsulotlar katalogi</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {UZ_DOCTOR_ALI_PRODUCTS.map((prod) => (
                        <div 
                          key={prod.id}
                          className="bg-white border border-[#E5EEF6] p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-200 space-y-3"
                        >
                          <div className="flex items-center justify-between font-black text-slate-800 text-sm">
                            <span>{prod.name}</span>
                            <span className="text-[8px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-mono">{prod.category}</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed font-semibold">{prod.shortDescription}</p>
                          <div className="bg-amber-50 rounded-lg p-2.5 text-[10px] text-amber-800 font-bold border border-amber-100/30">
                            🚫 Buni dori deb aytmang! Bu tabiiy bionik darmon.
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Hiding old narrow sidebar to integrate beautiful spacious tabs directly into the central workspace */}
        <aside className="hidden">
          
          {/* CRM Header */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E5EEF6] shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs uppercase shadow-md animate-pulse">
                CRM
              </div>
              <div>
                <h3 className="font-extrabold text-[#102A43] text-xs">DOCTOR ALI CRM</h3>
                <p className="text-[8px] text-[#486581]/70 font-bold uppercase tracking-wider font-mono">Avtomatik mijozlar monitoringi</p>
              </div>
            </div>
            <span className="text-[9px] bg-emerald-50 border border-emerald-200 text-emerald-600 px-2 py-0.5 rounded-full font-black uppercase tracking-tight font-mono">● FAOL SYSTEM</span>
          </div>

          {/* Quick tab switcher for right panel: Dashboard vs. Mijozlar vs. Anketa vs. Katalog */}
          <div className="grid grid-cols-4 border-b border-[#E5EEF6] mb-3 text-[9px] font-black tracking-tighter text-center shrink-0">
            <button
              onClick={() => setActiveRightTab("dashboard")}
              className={`pb-2 border-b-2 transition-all cursor-pointer ${
                activeRightTab === "dashboard"
                  ? "border-blue-600 text-blue-600 font-extrabold"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              📊 DASHBOARD
            </button>
            <button
              onClick={() => setActiveRightTab("mijozlar")}
              className={`pb-2 border-b-2 transition-all cursor-pointer ${
                activeRightTab === "mijozlar"
                  ? "border-blue-600 text-blue-600 font-extrabold"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              👥 MIJOZLAR ({crmCustomers.length})
            </button>
            <button
              onClick={() => setActiveRightTab("anketa")}
              className={`pb-2 border-b-2 transition-all cursor-pointer ${
                activeRightTab === "anketa"
                  ? "border-blue-600 text-blue-600 font-extrabold"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              📝 KARTA
            </button>
            <button
              onClick={() => setActiveRightTab("katalog")}
              className={`pb-2 border-b-2 transition-all cursor-pointer ${
                activeRightTab === "katalog"
                  ? "border-blue-600 text-blue-600 font-extrabold"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              📦 KATALOG
            </button>
          </div>

          {activeRightTab === "dashboard" && (
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto scrollbar-none pb-2">
              {/* Daily Tasks Counts Bento Panel */}
              <div>
                <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest block mb-1.5 pl-0.5">Bugungi ko'rsatkichlar</span>
                <div className="grid grid-cols-2 gap-2 text-left">
                  <div className="bg-white border border-[#E5EEF6] p-3 rounded-2xl shadow-sm">
                    <span className="text-[8px] text-slate-400 font-mono font-bold block uppercase">Bugungi vazifalar</span>
                    <span className="text-sm font-black text-blue-600 block mt-0.5">
                      {crmCustomers.filter(c => c.nextContactDate === "2026-06-17" || c.status === "🔵 Qayta bog'lanish kerak").length} ta mijoz
                    </span>
                    <span className="text-[8px] text-slate-400 mt-1 block">qayta yozish kerak</span>
                  </div>

                  <div className="bg-white border border-[#E5EEF6] p-3 rounded-2xl shadow-sm text-left">
                    <span className="text-[8px] text-slate-400 font-mono font-bold block uppercase text-rose-500 font-mono">HOT LEADS</span>
                    <span className="text-xs font-black text-rose-600 block mt-0.5 flex items-center gap-1">
                      <Zap size={11} className="fill-current animate-pulse text-rose-500" />
                      <span>{crmCustomers.filter(c => c.leadRating === "HOT LEAD" && c.status !== "✅ Sotib oldi").length} ta lead</span>
                    </span>
                    <span className="text-[8px] text-slate-400 mt-1 block">sotib olish yuqori</span>
                  </div>

                  <div className="bg-white border border-[#E5EEF6] p-3 rounded-2xl shadow-sm">
                    <span className="text-[8px] text-slate-400 font-mono font-bold block uppercase text-amber-500">WARM LEADS</span>
                    <span className="text-sm font-black text-amber-600 block mt-0.5">
                      {crmCustomers.filter(c => c.leadRating === "WARM LEAD" && c.status !== "✅ Sotib oldi").length} ta lead
                    </span>
                    <span className="text-[8px] text-slate-400 mt-1 block">faol qiziqayotganlar</span>
                  </div>

                  <div className="bg-white border border-[#E5EEF6] p-3 rounded-2xl shadow-sm">
                    <span className="text-[8px] text-slate-400 font-mono font-bold block uppercase text-purple-500">KUTAYOTGANLAR</span>
                    <span className="text-sm font-black text-purple-600 block mt-0.5">
                      {crmCustomers.filter(c => c.status === "🟣 Kutish").length} ta mijoz
                    </span>
                    <span className="text-[8px] text-slate-400 mt-1 block">o'ylab ko'radiganlar</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Reminders / Automatic Eslatmalar */}
              <div className="bg-white border border-[#E5EEF6] rounded-2xl p-3.5 shadow-sm text-left">
                <span className="text-[9px] font-mono font-black text-blue-500 uppercase tracking-widest block mb-2 font-mono">AI avtomatik eslatmalari</span>
                
                <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-none pr-0.5">
                  {(() => {
                    const alerts: { text: string; type: "alert" | "info" | "success" | "clock" }[] = [];
                    crmCustomers.forEach(cust => {
                      if (cust.status !== "✅ Sotib oldi" && cust.status !== "❌ Rad etdi") {
                        const lastDate = new Date(cust.lastContactDate || "2026-06-17");
                        const todayDate = new Date("2026-06-17");
                        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        if (diffDays >= 3) {
                          alerts.push({ text: `Mijoz ${cust.name} bilan 3 kundan beri bog'lanilmagan.`, type: "alert" });
                        }
                      }
                      if (cust.nextContactDate === "2026-06-17" && cust.status !== "✅ Sotib oldi") {
                        alerts.push({ text: `Bugun ${cust.name}ga qayta yozish tavsiya etiladi.`, type: "info" });
                      }
                      if (cust.nextContactDate === "2026-06-18") {
                        alerts.push({ text: `${cust.name} 18-iyun kuni qayta aloqa qilishni so'ragan.`, type: "clock" });
                      }
                      if (cust.nextContactTime && cust.nextContactTime.includes("2 soat")) {
                        alerts.push({ text: `2 soatdan keyin mijoz ${cust.name} bilan bog'lanish rejalashtirilgan.`, type: "clock" });
                      }
                    });

                    if (alerts.length === 0) {
                      return <p className="text-[10px] text-slate-400 font-semibold text-center py-4">Hozircha vazifalar yoki eslatmalar yo'q! 🎉</p>;
                    }

                    return alerts.map((al, idx) => {
                      let bg = "bg-blue-50 border-blue-100 text-blue-700";
                      let emoji = "🔔";
                      if (al.type === "alert") {
                        bg = "bg-rose-50 border-rose-100 text-rose-700";
                        emoji = "⚠️";
                      } else if (al.type === "clock") {
                        bg = "bg-amber-50 border-amber-100 text-amber-700";
                        emoji = "⏰";
                      }
                      return (
                        <div key={idx} className={`p-2 rounded-xl border text-[10px] font-semibold leading-relaxed flex items-start gap-2 ${bg}`}>
                          <span className="text-xs shrink-0">{emoji}</span>
                          <span className="flex-1">{al.text}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* AI Maqsadi panel */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-4 shadow-md shrink-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 pointer-events-none w-32 h-32" />
                <div className="relative z-10 text-left">
                  <span className="text-[8px] font-mono font-black text-blue-100 uppercase tracking-widest block mb-1">CRM Strategiyasi va AI Maqsadi</span>
                  <p className="text-[10px] leading-relaxed font-semibold">
                    Hech bir mijoz unutilmasin. Har bir mijozning holati kuzatilsin. Operator qachon yozish kerakligini eslab o'tirmasin. AI doimiy ravishda eslatib tursin!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeRightTab === "mijozlar" && (
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto scrollbar-none pb-2">
              <div className="flex items-center gap-2 shrink-0">
                <div className="relative flex-1">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchCrmQuery}
                    onChange={(e) => setSearchCrmQuery(e.target.value)}
                    placeholder="Mijoz ismi yoki dardi..."
                    className="w-full bg-white text-[10px] border border-[#E5EEF6] pl-7 pr-3 py-1.5 rounded-xl focus:border-blue-500 outline-none transition font-semibold"
                  />
                </div>
                <button
                  onClick={handleAddCustomer}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-black px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer font-bold"
                >
                  <span>➕ YANGI</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 scrollbar-none">
                {crmCustomers.filter(c => {
                  const q = searchCrmQuery.toLowerCase();
                  return c.name.toLowerCase().includes(q) || c.problem.toLowerCase().includes(q);
                }).map(cust => {
                  const isActive = cust.id === activeCustomerId;
                  let ratingBadge = cust.leadRating === "HOT LEAD" 
                    ? "bg-rose-50 border-rose-100 text-rose-700" 
                    : cust.leadRating === "WARM LEAD" 
                      ? "bg-amber-50 border-amber-100 text-amber-700" 
                      : "bg-cyan-50 border-cyan-100 text-cyan-700";
                  return (
                    <div key={cust.id} className={`p-3 rounded-2xl border transition-all flex flex-col gap-2 relative ${isActive ? "bg-white border-blue-500 shadow-md ring-1 ring-blue-500/10" : "bg-white border-[#E5EEF6] hover:bg-slate-50"}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-[#102A43] truncate">{cust.name} ({cust.age} yosh)</span>
                        <div className="text-[8px] font-bold px-1.5 py-0.5 rounded-full border bg-slate-50 shrink-0">{cust.status}</div>
                      </div>
                      <div className="text-[10px] leading-relaxed text-slate-600 font-semibold text-left">
                        <p className="line-clamp-1"><strong className="text-slate-400">Muammo:</strong> {cust.problem}</p>
                        <p className="line-clamp-1"><strong className="text-slate-400">Tavsiya:</strong> {cust.recommendedProduct}</p>
                        <p className="line-clamp-1 text-blue-600"><strong className="text-blue-400">Suhbat Bosqichi:</strong> {cust.stage || "1-BOSQICH: Ism"}</p>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-1">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${ratingBadge}`}>{cust.leadRating} ({cust.probability}%)</span>
                        <span className="text-[8px] text-slate-400 font-mono">Aloqa: {cust.nextContactDate || "Noma'lum"}{cust.nextContactTime ? ` (${cust.nextContactTime})` : ""}</span>
                      </div>
                      <div className="flex gap-2 justify-end mt-1.5 pt-1.5 border-t border-dashed border-slate-100">
                        <button onClick={() => selectActiveCustomer(cust.id)} className={`text-[8px] font-black uppercase py-1 px-2.5 rounded-lg border cursor-pointer font-bold ${isActive ? "bg-blue-600 border-blue-600 text-white shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                          {isActive ? "FAOL MIJOZ" : "TANLASH"}
                        </button>
                        <button onClick={() => handleDeleteCustomer(cust.id, cust.name)} className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 rounded-lg p-1 transition cursor-pointer">
                          <Trash size={11} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeRightTab === "anketa" && (
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto scrollbar-none pb-2">
              <div className="bg-blue-50 border border-blue-200/50 p-2 rounded-xl flex items-center justify-between text-left">
                <span className="text-[9px] font-black text-blue-800 uppercase tracking-wide truncate">Tahrir: {rtCustomerName || "Noma'lum"}</span>
                <button onClick={() => setActiveRightTab("mijozlar")} className="text-blue-500 hover:text-blue-700 text-[9px] font-black underline uppercase shrink-0">Barchasi</button>
              </div>

              <div className="bg-white border border-[#E5EEF6] rounded-2xl p-3 shadow-sm text-left">
                <div className="space-y-2">
                  <div>
                    <label className="text-[9px] font-extrabold text-[#102A43] block mb-0.5">Mijoz Ismi</label>
                    <input type="text" value={rtCustomerName} onChange={(e) => setRtCustomerName(e.target.value)} className="w-full bg-[#F5F8FC]/60 border border-[#E5EEF6] text-[11px] font-bold px-3 py-1.5 rounded-xl outline-none transition text-slate-700" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-extrabold text-[#102A43] block mb-0.5">Yoshi</label>
                      <input type="text" value={rtCustomerAge} onChange={(e) => setRtCustomerAge(e.target.value)} className="w-full bg-[#F5F8FC]/60 border border-[#E5EEF6] text-[11px] font-bold px-3 py-1.5 rounded-xl outline-none text-slate-700" />
                    </div>
                    <div>
                      <label className="text-[9px] font-extrabold text-[#102A43] block mb-0.5">Izoh/Qayd</label>
                      <input type="text" value={rtCustomerNotes} onChange={(e) => setRtCustomerNotes(e.target.value)} className="w-full bg-[#F5F8FC]/60 border border-[#E5EEF6] text-[11px] font-bold px-3 py-1.5 rounded-xl outline-none text-slate-700" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeRightTab === "anketa" && (
            <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto scrollbar-none pb-4">
              
              {/* Selected Customer indicator badge */}
              <div className="bg-blue-50 border border-blue-200/50 p-2.5 rounded-xl flex items-center justify-between text-left">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs">👥</span>
                  <span className="text-[10px] font-black text-blue-800 uppercase tracking-wide truncate">
                    Tahrir: {rtCustomerName || "Noma'lum"}
                  </span>
                </div>
                <button 
                  onClick={() => setActiveRightTab("mijozlar")} 
                  className="text-blue-500 hover:text-blue-700 text-[9px] font-black underline uppercase tracking-tight shrink-0"
                >
                  Barchasi
                </button>
              </div>

              {/* Input Form Fields for Customer Card */}
              <div className="bg-white border border-[#E5EEF6] rounded-2xl p-3.5 shadow-sm text-left space-y-2.5">
                <span className="text-[9px] font-mono font-black text-blue-500 uppercase tracking-widest block font-mono">Ma'lumotlar tahriri</span>
                
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[9px] font-extrabold text-[#102A43] block mb-1">Mijoz Ismi</label>
                    <input
                      type="text"
                      value={rtCustomerName}
                      onChange={(e) => setRtCustomerName(e.target.value)}
                      placeholder="Abdulla aka, Dilnoza opa..."
                      className="w-full bg-[#F5F8FC]/60 border border-[#E5EEF6] text-[11px] font-bold px-3 py-1.5 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition text-slate-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-extrabold text-[#102A43] block mb-1">Yoshi</label>
                      <input
                        type="text"
                        value={rtCustomerAge}
                        onChange={(e) => setRtCustomerAge(e.target.value)}
                        placeholder="Masalan: 45"
                        className="w-full bg-[#F5F8FC]/60 border border-[#E5EEF6] text-[11px] font-bold px-3 py-1.5 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-extrabold text-[#102A43] block mb-1">Izoh / Qaydlar</label>
                      <input
                        type="text"
                        value={rtCustomerNotes}
                        onChange={(e) => setRtCustomerNotes(e.target.value)}
                        placeholder="Masalan: skeptikroq"
                        className="w-full bg-[#F5F8FC]/60 border border-[#E5EEF6] text-[11px] font-bold px-3 py-1.5 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition text-slate-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-extrabold text-[#102A43] block mb-1">Suhbat Bosqichi (Majburiy)</label>
                    <select
                      value={rtCustomerStage}
                      onChange={(e) => setRtCustomerStage(e.target.value)}
                      className="w-full bg-[#F5F8FC]/60 border border-[#E5EEF6] text-[11px] font-bold px-3 py-1.5 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition text-slate-700 font-mono"
                    >
                      <option value="1-BOSQICH: Ism">1-BOSQICH: Ism bilan tanishish 👋</option>
                      <option value="2-BOSQICH: Yoshi">2-BOSQICH: Yoshini aniqlash 🎂</option>
                      <option value="3-BOSQICH: Muammo">3-BOSQICH: Muammo darsligi (Dard) 🔍</option>
                      <option value="4-BOSQICH: SPIN savollari">4-BOSQICH: SPIN savollari berish 📋</option>
                      <option value="5-BOSQICH: Tavsiya">5-BOSQICH: Mahsulot tavsiyasi 🛍️</option>
                      <option value="6-BOSQICH: E'tirozlar / Narx">6-BOSQICH: E'tirozlar tahlili / Narx 💰</option>
                      <option value="7-BOSQICH: Yopish (Closing)">7-BOSQICH: Buyurtmani yopish (Closing) ✅</option>
                    </select>
                  </div>

                  {/* Status Dropdowns and Calendar picker */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-extrabold text-[#102A43] block mb-1">Mijoz Statusi</label>
                      <select
                        value={crmCustomers.find(c => c.id === activeCustomerId)?.status || "🟢 Yangi mijoz"}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCrmCustomers(prev => prev.map(c => {
                            if (c.id !== activeCustomerId) return c;
                            let rating = c.leadRating;
                            let prob = c.probability;
                            if (val === "✅ Sotib oldi") { rating = "HOT LEAD"; prob = 100; }
                            else if (val === "❌ Rad etdi") { rating = "COLD LEAD"; prob = 5; }
                            else if (val === "🟡 Qiziqmoqda" || val === "🔵 Qayta bog'lanish kerak") { rating = "WARM LEAD"; prob = 65; }
                            else if (val === "🟣 Kutish") { rating = "WARM LEAD"; prob = 45; }
                            return { ...c, status: val, leadRating: rating, probability: prob };
                          }));
                          triggerToast(`Status belgilandi: ${val}`);
                        }}
                        className="w-full bg-[#F5F8FC]/60 border border-[#E5EEF6] text-[9.5px] font-bold px-2 py-1.5 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition text-slate-700 font-mono"
                      >
                        <option value="🟢 Yangi mijoz">🟢 Yangi mijoz</option>
                        <option value="🟡 Qiziqmoqda">🟡 Qiziqmoqda</option>
                        <option value="🟠 O'ylab yuribdi">🟠 O'ylab yuribdi</option>
                        <option value="🔵 Qayta bog'lanish kerak">🔵 Qayta bog'lanish</option>
                        <option value="🟣 Kutish">🟣 Kutish</option>
                        <option value="⚪ Javob bermayapti">⚪ Javob bermayapti</option>
                        <option value="✅ Sotib oldi">✅ Sotib oldi</option>
                        <option value="❌ Rad etdi">❌ Rad etdi</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] font-extrabold text-[#102A43] block mb-1">Keyingi aloqa kuni</label>
                      <input
                        type="date"
                        value={crmCustomers.find(c => c.id === activeCustomerId)?.nextContactDate || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCrmCustomers(prev => prev.map(c => {
                            if (c.id !== activeCustomerId) return c;
                            return { ...c, nextContactDate: val };
                          }));
                        }}
                        className="w-full bg-[#F5F8FC]/60 border border-[#E5EEF6] text-[9.5px] font-bold px-1.5 py-1.5 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition text-slate-700 text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead scoring result banner */}
              {(() => {
                const activeCust = crmCustomers.find(c => c.id === activeCustomerId);
                if (!activeCust) return null;
                const isHot = activeCust.leadRating === "HOT LEAD";
                const isWarm = activeCust.leadRating === "WARM LEAD";
                
                return (
                  <div className={`p-3 rounded-2xl border text-[10px] font-semibold leading-relaxed flex items-center justify-between text-left ${
                    isHot
                      ? "bg-rose-50 border-rose-100 text-rose-700"
                      : isWarm
                        ? "bg-amber-50 border-amber-100 text-amber-700"
                        : "bg-blue-50 border-blue-100 text-blue-700"
                  }`}>
                    <div>
                      <span className="font-bold text-[8px] block uppercase font-mono tracking-wider">AI Lead Skoring taxmini:</span>
                      <p className="mt-0.5">
                        {isHot ? "Mijoz xarid qilishga tayyor! 🔥" : isWarm ? "Mijozni isitish kerak. ⚡" : "Xarid ehtimoli pastroq. ❄️"}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-black uppercase text-right">
                      {activeCust.probability}%
                    </span>
                  </div>
                );
              })()}

              {/* Shikoyat Preset select */}
              <div className="bg-white border border-[#E5EEF6] rounded-2xl p-3.5 shadow-sm text-left">
                <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest block mb-2 font-mono">Telfonda bildirilgan dardi / shifosi:</span>
                
                <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto scrollbar-none">
                  {COMPLAINT_PRESETS.map((p) => {
                    const isSelected = rtCustomerComplaint === p.value;
                    return (
                      <button
                        key={p.value}
                        onClick={() => {
                          setRtCustomerComplaint(p.value);
                          triggerToast(`Dard belgilandi: ${p.label}`);
                        }}
                        className={`text-[10px] p-2 rounded-xl border text-left font-semibold transition-all duration-150 cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white shadow-md scale-102 font-extrabold"
                            : "bg-[#F5F8FC]/50 border-[#E5EEF6] text-[#102A43] hover:bg-[#EAF0F6]"
                        }`}
                      >
                        <span className="truncate">{p.label}</span>
                        {isSelected && <Check size={11} className="stroke-[3] shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Matching & Core Guidelines */}
              {rtCustomerComplaint ? (
                <div className="bg-slate-100 border border-slate-200/60 rounded-2xl p-3 space-y-3 text-left">
                  <div className="flex items-center gap-1 text-blue-600">
                    <Sparkles size={13} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-wider">AKADEMIK TAVSIYA ETILGAN TIKLANISH</span>
                  </div>

                  {(() => {
                    const preset = COMPLAINT_PRESETS.find(p => p.value === rtCustomerComplaint);
                    if (!preset) return null;
                    const matchedProds = UZ_DOCTOR_ALI_PRODUCTS.filter(p => preset.products.includes(p.id));

                    return (
                      <div className="space-y-2.5">
                        <div className="text-[10px] font-bold text-slate-500">
                          Bazada tasdiqlangan darmonlar:
                        </div>

                        {matchedProds.map(prod => (
                          <div key={prod.id} className="bg-white border border-[#E5EEF6] p-2.5 rounded-xl shadow-sm space-y-1.5 text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-black text-[#102A43]">{prod.name}</span>
                              <span className="text-[8px] bg-blue-50 text-[#1b6dfb] px-1.5 py-0.5 rounded-full font-mono font-bold uppercase shrink-0">
                                {prod.category}
                              </span>
                            </div>

                            <p className="text-[10px] text-slate-600 font-semibold leading-relaxed">
                              ✅ <strong className="text-blue-600">Qo'llanishi:</strong> {prod.shortDescription}
                            </p>

                            <div className="bg-amber-50 border border-amber-100 p-1.5 rounded-lg text-[9px] text-amber-800 font-semibold leading-relaxed">
                              🚫 <strong className="text-amber-700">Etik uqtirma (Ethics note):</strong> {prod.ethicsNote}
                            </div>
                          </div>
                        ))}

                        {/* Interactive button to push directly to chat */}
                        <button
                          onClick={() => {
                            const complaintLabel = preset.label;
                            const matchedProdsText = matchedProds.map(p => p.name).join(", ");
                            const generatedPrompt = `Salom Professor! "YANGI OPERATOR REJIMI" qoidalariga binoan quyidagi holatni ko'rib chiq:

Mijoz ma'lumotlari:
- Ismi: ${rtCustomerName || "Noma'lum"}
- Yoshi: ${rtCustomerAge || "Noma'lum"}
- Shikoyati va dardi: ${complaintLabel}
- Qo'shimcha qaydlar: ${rtCustomerNotes || "yo'q"}
- Mos darmonlar: ${matchedProdsText}

Vazifalar:
1. Muammoni aniq va sodda tilda ko'rsat.
2. Mos keladigan darmon (${matchedProdsText}) nima uchun to'liq mosligini qisqacha tushuntir.
3. Operator bevosita nusxa olib mijozga yuborishi uchun tayyor muloqot xabarini yoz.
4. Ushbu tayyor xabarni har doim "Siz mijozga quyidagicha yozishingiz mumkin:" deb boshla va uni 100% o'zbek tilida murakkab tibbiy atamalarsiz qilib ber.

Iltimos, operator hech narsa o'ylamasdan faqat ushbu tayyor matndan foydalanishi uchun silliq, g'amxo'r va tayyor xabar yubor.`;
                            
                            setInputText(generatedPrompt);
                            triggerToast("Ma'lumotlar kiritish oynasiga yuklandi. Yuborish bosing! 🚀");
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                        >
                          <Send size={10} />
                          <span>TAVSIYALAR + SKRIPT TA'MINLASH</span>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-white border border-dashed border-slate-200 p-4 rounded-xl text-center text-slate-400 mt-auto">
                  <HelpCircle size={18} className="opacity-30 mx-auto mb-1.5" />
                  <p className="text-[10px] font-semibold leading-relaxed">Mijoz gaplariga ko'ra uning dardini tepada bosing. Shunda AI sizga darmon qo'llanilishi va barcha kerakli jumlalarni taqdim etadi.</p>
                </div>
              )}
            </div>
          )}

          {activeRightTab === "katalog" && (
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto scrollbar-none pb-4">
              
              {/* Quick specifications pills row */}
              <div className="grid grid-cols-3 gap-2 shrink-0">
                <div className="bg-white border border-[#E5EEF6] p-2 rounded-xl text-center shadow-sm">
                  <span className="text-[8px] text-slate-400 font-mono font-bold block uppercase">Darmonlar</span>
                  <span className="text-[11px] font-black text-slate-800 mt-0.5 block">5 xil</span>
                </div>
                <div className="bg-white border border-[#E5EEF6] p-2 rounded-xl text-center shadow-sm">
                  <span className="text-[8px] text-slate-400 font-mono font-bold block uppercase">Kimyoviy modda</span>
                  <span className="text-[11px] font-black text-rose-500 mt-0.5 block">0%</span>
                </div>
                <div className="bg-white border border-[#E5EEF6] p-2 rounded-xl text-center shadow-sm">
                  <span className="text-[8px] text-slate-400 font-mono font-bold block uppercase">Xavfsizligi</span>
                  <span className="text-[11px] font-black text-[#1b6dfb] mt-0.5 block">Tabiiy</span>
                </div>
              </div>

              {/* Reference panel showing bionik product catalog list */}
              <div className="bg-white border border-[#E5EEF6] rounded-2xl p-3 shadow-sm flex-1 overflow-y-auto max-h-[450px]">
                <h4 className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <BookOpen size={11} />
                  <span>Doctor Ali tabiiy linyasi</span>
                </h4>
                
                <div className="flex flex-col gap-2">
                  {UZ_DOCTOR_ALI_PRODUCTS.map((prod) => (
                    <div 
                      key={prod.id} 
                      onClick={() => triggerToast(`Mahsulot: "${prod.shortDescription}"`)}
                      className="bg-[#F5F8FC]/50 hover:bg-[#F5F8FC] border border-slate-100 p-2.5 rounded-xl cursor-pointer duration-150 text-left space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-[#102A43]">{prod.name}</span>
                        <span className="text-[7.5px] bg-blue-50 border border-blue-100 text-[#1b6dfb] px-1.5 py-0.5 rounded-full font-mono uppercase font-black tracking-tight shrink-0">
                          {prod.category.split("&")[0]}
                        </span>
                      </div>
                      <p className="text-[9px] text-[#486581]/80 leading-normal font-semibold">
                        {prod.shortDescription}
                      </p>
                      <div className="text-[8px] text-amber-700 bg-amber-50 rounded-lg p-1.5 font-bold leading-normal">
                        🚫 <span className="font-extrabold">MUHIM DOCTOR ALI QOIDASI:</span> Buni dori deb aytmang! Bu tabiiy bionik darmondir.
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </aside>

      </div> {/* End of main workspace container card */}

    </div> {/* End of outer detached flex layout container */}

      {/* --- SIDEBAR DRAWER OVERLAYS --- */}
      
      {/* Notifications overlay drawer */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNotifications(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end"
          >
            <motion.div 
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white border-l border-[#E5EEF6] p-6 flex flex-col h-full shadow-2xl relative text-slate-700"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <Bell size={18} />
                  <h4 className="font-extrabold text-[#102A43] text-sm uppercase">Kundalik e'lonlar</h4>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    onClick={() => {
                      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      notif.read 
                        ? "bg-slate-50/50 border-slate-100 text-slate-500" 
                        : "bg-blue-50/50 border-blue-200/50 text-slate-800 shadow-sm relative"
                    }`}
                  >
                    {!notif.read && (
                      <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                    <span className="text-xs leading-relaxed font-bold block">{notif.text}</span>
                    <span className="text-[9px] font-mono font-bold text-blue-500 mt-1.5 block">{notif.time}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 mt-auto flex gap-2.5">
                <button
                  onClick={() => {
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    triggerToast("Barcha e'lonlar o'qildi deb belgilandi.");
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition flex-1 cursor-pointer"
                >
                  Hammasini belgilash
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Bookmarked comments overlay drawer */}
      <AnimatePresence>
        {showFavorites && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFavorites(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end"
          >
            <motion.div 
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white border-l border-[#E5EEF6] p-6 flex flex-col h-full shadow-2xl relative text-slate-700"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2 text-yellow-500">
                  <Star size={18} className="fill-current" />
                  <h4 className="font-extrabold text-[#102A43] text-sm uppercase">Saqlangan maslahatlar</h4>
                </div>
                <button 
                  onClick={() => setShowFavorites(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-1">
                {savedFavorites.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400 my-auto">
                    <Star size={28} className="opacity-30 mb-2 stroke-[1.5]" />
                    <p className="text-xs font-semibold">Tavsiyalar ro'yxati hali bo'sh.</p>
                  </div>
                ) : (
                  savedFavorites.map((fav) => (
                    <div 
                      key={fav.id} 
                      className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl relative group"
                    >
                      <button 
                        onClick={() => {
                          const updated = savedFavorites.filter(f => f.id !== fav.id);
                          setSavedFavorites(updated);
                          localStorage.setItem("nx_favorites", JSON.stringify(updated));
                          triggerToast("O'chirildi! ⭐");
                        }}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-slate-200 cursor-pointer"
                        title="O'chirish"
                      >
                        <Trash size={12} />
                      </button>

                      <div className="text-[9px] uppercase font-bold text-blue-600 font-mono tracking-wider mb-1">
                        {fav.agentName}
                      </div>
                      <p className="text-xs text-slate-700 font-semibold leading-relaxed whitespace-pre-wrap">{fav.text}</p>
                      <span className="text-[8px] text-slate-400 mt-2 block font-mono">{fav.timestamp}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 mt-auto">
                <button
                  onClick={() => {
                    setSavedFavorites([]);
                    localStorage.setItem("nx_favorites", "[]");
                    triggerToast("Barchasi o'chirildi! ⭐");
                  }}
                  className="bg-transparent hover:bg-red-50 text-slate-500 hover:text-red-600 py-2.5 rounded-xl text-xs font-bold transition w-full border border-slate-200 cursor-pointer"
                >
                  Hammasini tozalash
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Alert Indicator floating */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold py-3 px-6 rounded-full shadow-2xl flex items-center gap-2 z-50 border border-slate-800"
          >
            <Sparkle size={13} className="text-yellow-400 animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );

  // --- Sub-renderer of Unified Input Action Core precisely styled like user's image ---
  function renderUnifiedInputBox() {
    const isMijozSim = activeAgentId === "mijoz-simulyatori";
    const isCoach = activeAgentId === "trening-murabbiyi";
    
    return (
      <div className="w-full bg-white/85 backdrop-blur-md border border-slate-200/40 rounded-[28px] p-3.5 flex flex-col gap-2.5 shadow-[0_12px_44px_rgba(30,41,59,0.08)] focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 focus-within:bg-white transition-all duration-300 relative select-none">
        
        {/* TEXTAREA INPUT */}
        <div className="flex-1 relative flex items-start px-2">
          <textarea
            rows={Math.min(4, Math.max(1, inputText.split('\n').length))}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Mijoz haqida yozing..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isCoach}
            className="w-full bg-transparent text-sm text-[#102A43] py-1.5 outline-none resize-none font-semibold placeholder-slate-400 disabled:opacity-50 min-h-[38px] max-h-[140px] leading-relaxed scrollbar-none"
          />
        </div>

        {/* BOTTOM UTILITY ICON ROW (MATCHING USER SCREENSHOT PRECISELY) */}
        <div className="flex items-center justify-between border-t border-slate-100/70 pt-2 px-1 select-none">
          
          {/* LEFT UTILITIES: +, MIC, ATTACHMENT */}
          <div className="flex items-center gap-3">
            {/* Soft Light Blue Plus Button */}
            <button
              type="button"
              onClick={() => {
                triggerToast("Qo'shimcha funksiyalar faollashdi! 📁");
              }}
              className="w-8 h-8 rounded-full bg-[#F0F5FF] text-[#1b6dfb] border border-blue-100 hover:bg-blue-100 transition flex items-center justify-center font-bold text-base cursor-pointer"
              title="Kengaytirish"
            >
              +
            </button>

            {/* Microphone Icon */}
            <button
              type="button"
              onClick={() => {
                triggerToast("Ovozli kiritish ishga tushdi... 🎙️");
              }}
              className="p-1.5 text-slate-400 hover:text-[#1b6dfb] hover:scale-110 transition flex items-center justify-center cursor-pointer"
              title="Ovozli Kiritish"
            >
              <Mic size={17} className="stroke-[1.8]" />
            </button>

            {/* Paperclip/Attachment Icon */}
            <button
              type="button"
              onClick={() => {
                triggerToast("Fayl biriktirish... 📎");
              }}
              className="p-1.5 text-slate-400 hover:text-[#1b6dfb] hover:scale-110 transition flex items-center justify-center cursor-pointer"
              title="Fayl Biriktirish"
            >
              <Paperclip size={16} className="stroke-[1.8] rotate-45" />
            </button>
          </div>

          {/* RIGHT UTILITIES: ACTIVE "Enter - yuborish" dot & ArrowUp Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold tracking-tight">
              <span>Enter — yuborish</span>
              <span className="w-2 h-2 rounded-full bg-[#8E5CE2] animate-pulse shadow-sm" />
            </div>
            
            {/* ArrowUp blue/purple circular button like screenshot */}
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isCoach}
              className="bg-gradient-to-r from-blue-500 to-[#1b6dfb] hover:brightness-110 disabled:bg-slate-100 text-white disabled:text-slate-400 w-10 h-10 rounded-full transition shadow-[0_6px_15px_rgba(27,109,251,0.2)] hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
            >
              <ArrowUp size={18} className="stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// --- Custom Inline Markdown Parser ---
function FormattedMarkdownText({ text, search, onOptionClick }: { text: string; search?: string; onOptionClick?: (val: string) => void }) {
  if (!text) return null;

  const lines = text.split("\n");

  return (
    <div className="space-y-1.5 my-0.5 break-words">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // 1. Headings
        if (trimmed.startsWith("### ")) {
          const content = trimmed.substring(4);
          return (
            <h4 key={idx} className="text-[#102A43] font-extrabold text-xs md:text-sm mt-2 mb-1">
              <HighlightWords text={content} search={search || ""} />
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          const content = trimmed.substring(3);
          return (
            <h3 key={idx} className="text-[#102A43] font-black text-sm md:text-base mt-2.5 mb-1.5">
              <HighlightWords text={content} search={search || ""} />
            </h3>
          );
        }
        if (trimmed.startsWith("# ")) {
          const content = trimmed.substring(2);
          return (
            <h2 key={idx} className="text-[#102A43] font-black text-base md:text-lg mt-3.5 mb-2">
              <HighlightWords text={content} search={search || ""} />
            </h2>
          );
        }

        // 2. Bullet lists
        const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ");
        if (isBullet) {
          const content = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-2 my-1">
              <span className="text-[#1b6dfb] shrink-0 font-bold">•</span>
              <span className="text-[13px] md:text-[13.5px] font-semibold text-slate-800">
                {renderInlineStyles(content, search, onOptionClick)}
              </span>
            </div>
          );
        }

        // 3. Numbered lists
        const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
        if (numMatch) {
          const num = numMatch[1];
          const content = numMatch[2];
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-2 my-1">
              <span className="text-[#1b6dfb] font-mono font-bold text-xs shrink-0 mt-0.5">{num}.</span>
              <span className="text-[13px] md:text-[13.5px] font-semibold text-slate-800">
                {renderInlineStyles(content, search, onOptionClick)}
              </span>
            </div>
          );
        }

        // 4. Dividers
        if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
          return <hr key={idx} className="border-t border-[#E5EEF6] my-2" />;
        }

        // 5. Normal text paragraphs
        if (trimmed === "") {
          return <div key={idx} className="h-1" />;
        }

        return (
          <p key={idx} className="text-[13px] md:text-[13.5px] leading-relaxed font-semibold text-slate-800">
            {renderInlineStyles(line, search, onOptionClick)}
          </p>
        );
      })}
    </div>
  );
}

function renderInlineStyles(text: string, search?: string, onOptionClick?: (val: string) => void) {
  if (!text) return "";

  const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\])/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const inner = part.slice(2, -2);
      return (
        <strong key={i} className="text-[#102A43] font-extrabold font-sans">
          <HighlightWords text={inner} search={search || ""} />
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      const inner = part.slice(1, -1);
      return (
        <code key={i} className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono text-[10.5px] text-blue-600 font-bold mx-0.5 animate-pulse">
          <HighlightWords text={inner} search={search || ""} />
        </code>
      );
    }
    if (part.startsWith("[") && part.endsWith("]")) {
      const inner = part.slice(1, -1);
      return (
        <button
          key={i}
          onClick={() => {
            if (onOptionClick) {
              onOptionClick(inner);
            }
          }}
          className="bg-white hover:bg-blue-600 hover:text-white border border-blue-400 text-blue-600 font-black text-[12px] px-3.5 py-1 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5 mx-1 my-1"
          title={`"${inner}" javobini yuborish`}
        >
          {inner}
        </button>
      );
    }
    return (
      <span key={i}>
        <HighlightWords text={part} search={search || ""} />
      </span>
    );
  });
}

function HighlightWords({ text, search }: { text: string; search: string }) {
  if (!search.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${escapeRegExp(search)})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((p, i) => 
        regex.test(p) ? (
          <mark key={i} className="bg-yellow-300 text-slate-950 rounded px-0.5 py-px font-black">
            {p}
          </mark>
        ) : (
          p
        )
      )}
    </span>
  );
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
