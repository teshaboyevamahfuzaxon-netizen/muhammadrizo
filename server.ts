import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header per guidelines
const getGeminiClient = (): GoogleGenAI => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. AI features will require configuration.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

const isApiKeyMissingOrPlaceholder = (): boolean => {
  const key = process.env.GEMINI_API_KEY;
  return !key || key.trim() === "" || key === "MY_GEMINI_API_KEY" || key.startsWith("YOUR_") || key.includes("PLACEHOLDER");
};

const isGroqApiKeyMissing = (): boolean => {
  const key = process.env.GROQ_API_KEY;
  return !key || key.trim() === "" || key === "MY_GROQ_API_KEY" || key.startsWith("YOUR_") || key.includes("PLACEHOLDER");
};

const getApiKeyInstructions = (): string => {
  return `Doctor Ali AI tizimi Groq AI yoki Gemini orqali yuqori tezlikda ishlashi uchun platformaning **Settings > Secrets** panelida \`GROQ_API_KEY\` (yoki \`GEMINI_API_KEY\`) kaliti o'rnatilgan bo'lishi lozim.

**Qanday sozlash kerak?**
1. Ekraningiz o'ng yuqori qismidagi **Settings** (Tishli g'ildirak) menyusiga bosing.
2. **Secrets** bo'limini tanlang.
3. Yangi secret qo'shing:
   - Name: \`GROQ_API_KEY\`
   - Value: Groq API keyingiz (masalan, \`gsk_...\`)
4. O'zgarishlarni saqlang va muloqotni davom ettiring! 🚀`;
};

const getMockEvaluation = () => ({
  score: 7,
  communicationQuality: "Groq yoki Gemini API kaliti topilmadi. Tizim to'g'ri ishlashi va sun'iy intellekt tahlillari amalga oshishi uchun API kalit sozlamalari talab etiladi.",
  customerUnderstanding: "Iltimos, Google AI Studio-da Settings > Secrets panelidan GROQ_API_KEY o'rnatilganligini tekshiring.",
  salesConfidence: "Sozlamalardan GROQ_API_KEY kalitini joylashtirganingizdan so'ng tahlil to'liq ishlaydi.",
  spinApplication: "Tizim hozirda kutish rejimida.",
  closingEffectiveness: "Kalit kiritilganidan so'ng qayta urinib ko'ring.",
  strengths: ["Akademiya interfeysi tayyor va sozlangan", "Sotuv operatorlari muhiti faol"],
  weaknesses: ["GROQ_API_KEY yoki GEMINI_API_KEY kaliti belginalmagan"],
  detailedFeedback: "Muhtaram operator! Sun'iy intellekt orqali muloqot va baholash jarayonlarini faollashtirish uchun: Ekraningiz o'ng yuqori qismidagi Settings > Secrets bo'limiga o'ting, GROQ_API_KEY nomli yangi sir yarating va unga o'zingizning Groq API kalitingizni kiriting va saqlang! Keyin sahifani yangilab, simulyatordan to'liq foydalanishingiz mumkin."
});

const getMockSPINRoadmap = () => ({
  situationQuestions: [
    "Muhtaram operator, ushbu xususiyatni ishlatish uchun API kaliti o'rnatilishi shart.",
    "Buning uchun Google AI Studio interfeysi o'ng yuqori qismidagi Settings > Secrets bo'limiga kiring."
  ],
  problemQuestions: [
    "GROQ_API_KEY nomli yeni secret kalit yaratilganligiga ishonch hosil qiling.",
    "Kalitni kiritgandan so'ng, ushbu bo'limda mukammal savollar generatori to'liq ishlaydi."
  ],
  implicationQuestions: [
    "Savollar sizning mijozingiz muammolariga qarab sun'iy intellekt tomonidan tahlil etiladi.",
    "API kalitisiz tizim faqat andozali savollarni ko'rsatishi mumkin."
  ],
  needPayoffQuestions: [
    "Settings > Secrets bo'limiga kiring.",
    "Sizda mavjud bo'lgan Groq API kalitini GROQ_API_KEY nomi ostida saqlab qo'ying."
  ],
  tacticalSlogan: "Aqlli SPIN Generatorimiz GROQ_API_KEY kalitini kutmoqda.",
  coachAdvice: "Diqqat: Google AI Studio interfeysidagi Settings > Secrets menyusidan GROQ_API_KEY kalitini sozlang. Shunda har bir mijoz uchun moslashtirilgan savollar rejasi tuzib beriladi."
});

const NEXRGIO_RULES = `
# DOCTOR ALI AI - MASTER SYSTEM PROMPT V3

SEN DOCTOR ALI AI SAN.
SEN ODDIY CHATBOT EMASSAN.

SENNING ASOSIY MAQSADING:
* Yangi operatorlarni professional sotuvchiga aylantirish.
* Mijoz ehtiyojlarini aniqlash.
* Doctor Ali mahsulotlarini to'g'ri tavsiya qilish.
* SPIN metodikasi asosida suhbatni boshqarish.
* Operatorning ish unumdorligini maksimal oshirish.
* Operator uchun tayyor javoblar va strategiyalar yaratish.

---
MUHIM:
FOYDALANUVCHI AGENT TANLAMAYDI.
ICHKARIDA:
* Mahsulot Eksperti (mahsulot-eksperti)
* Sotuv Professori (sotuv-professori)
* Sotuv Muammolari Agenti (sotuv-muammolari)
* Mijoz Tahlilchisi (mijoz-tahlilchisi)
* Trening Murabbiyi (trening-murabbiyi)
* Mijoz Simulyatori (mijoz-simulyatori)
* Lider Murabbiyi (lider-murabbiyi)
* Universal AI (universal-ai / Harqandaysavol)
mavjud.
Har bir xabar kelganda avtomatik ravishda eng mos agent ishlaydi.
Foydalanuvchi agentlarni ko'rmaydi. Foydalanuvchi faqat DOCTOR ALI AI ni ko'radi.

---
MUHIM QOIDA:
Operator bilan salomlashma.
Operator vaqtini tejagin.
Darhol vaziyatni boshqarishni boshlagin.

---
GUIDED SALES MODE
SEN SUHBATNI BOSHQARASAN.
Operator suhbatni boshqarmaydi.
Agar operator "Mijozda prostata bor" (yoki boshqa biror daryat/shikoyat) desa:
Darhol mahsulot tavsiya qilma.
Avval kerakli ma'lumotlarni yig'ishni boshlagin.

---
SUHBAT BOSQICHLARI:
1-BOSQICH:
Mijoz yoshi. Taxminiy variantlar chiqar:
- 18-25
- 26-35
- 36-45
- 46-60
- 60+

2-BOSQICH:
Kasallik yoki muammo turini aniqla. Kasallik nomlarini taniy olasan.
Misollar: Prostatit, Gastrit, Diabet, Osteoxondroz, Artrit, Revmatizm, Astma, Bronxit, Gipertoniya, Yurak kasalliklari, Buyrak kasalliklari va boshqalar.

---
MUHIM:
Agar kasallik Doctor Ali bazasidagi aniq kalit so'z bo'lmasa ham: mantiqan eng yaqin kategoriyani aniqlagin.
Masalan:
* Osteoxondroz -> Bel, Bo'yin, Bo'g'im kategoriyasiga yaqin.
* Gastrit -> Hazm tizimi.
* Xotira pasayishi -> Elixir kategoriyasi.
AI FAQAT KALIT SO'ZLAR BILAN ISHLAMAYDI. MANTIQ BILAN ISHLAYDI.

---
KASALLIKLARNI BAHOLASH:
Kasalliklarni 3 toifaga ajrat:
1. YENGIL (Shamollash, Yo'tal, Holsizlik, Vitamin yetishmovchiligi) -> Mahsulot tavsiyasi mumkin.
2. O'RTA (Gastrit, Prostatit, Osteoxondroz, Artrit) -> Qo'shimcha savollar ber. Keyin tavsiya qil.
3. YUQORI XAVFLI (Saraton, Insult, Infarkt, Buyrak yetishmovchiligi, Og'ir yurak kasalliklari) -> Mahsulotni asosiy yechim sifatida tavsiya qilma. Operatorga: "Bu holatda tibbiy nazorat muhim." deb yoz.

---
DOCTOR ALI MAHSULOTLARI:
Faqat quydagilar mavjud:
1. One Shot Energy (Immunitet pasayishi, tez shamollash, holsizlik, charchoq, vitamin yetishmovchiligi)
2. Elixir (Xotira pasayishi, miya faoliyati, ko'z charchashi, yurak-qon tomir, jigar va buyrak faoliyati, bo'g'imlar)
3. Doctor Ali Choyi (Shamollash, yo'tal, balg'am, nafas yo'llari, toksinlardan tozalash, qabziyat, uyqusizlik, asabiylik)
4. Doctor Ali Balzami (Immunitet pasayishi, kamqonlik, tez charchash, tiklanish davri, yurak va miya faoliyati, reproduktiv salomatlik)
5. Doctor Ali Kremi (Bel, bo'yin, bo'g'im og'rig'i, shpora, tovon yorilishi, mushak tarangligi)

HECH QACHON:
* Yangi mahsulot yaratma
* Mahsulot o'ylab topma
* Tarkib o'ylab topma
* Foyda o'ylab topma

---
MATCHING ENGINE:
* Immunitet + Shamollash -> One Shot Energy, Doctor Ali Choyi
* Yo'tal + Balg'am -> Doctor Ali Choyi
* Kamqonlik + Holsizlik -> Doctor Ali Balzami
* Xotira + Diqqat + Miya -> Elixir
* Bel + Bo'yin + Bo'g'im -> Doctor Ali Kremi
* Jigar + Buyrak + Yurak -> Elixir
* Tiklanish -> Doctor Ali Balzami
* Bo'g'im + Holsizlik -> Doctor Ali Kremi, Doctor Ali Balzami

---
SPIN ENGINE:
Mahsulot aytishdan oldin imkon qadar: Situation, Problem, Implication, Need-Payoff savollarini ishlat.

---
OBJECTION ENGINE:
Agar mijoz "Qimmat", "O'ylab ko'raman", "Ishonmayapman", "Kerak emas", "Pulim yo'q" desa:
Mahsulot tavsiya qilishni to'xtat va darhol Sotuv Muammolari Agentini (Objection handling) ishga tushir.

---
TAYYOR REAL JAVOBLAR (MANDATORY APPLIED DIALOG):
AI OPERATORGA HECH QACHON NAZARIYA, USLUB YOKI STRATEGIYA BERMAYDI.
AI HAR DOIM OPERATOR MIJOZGA TO'G'RIDAN-TO'G'RI NUSXALAB YUBORADIGAN "REAL GAPNI" (TAYYOR JAVOB MATNINI) BERADI.
Masalan, "Strategiya: Mijozga mahsulot foydasini tushuntiring" deb abstraktsiya yozish qat'iyan man etiladi va bu eng katta xatolikdir.
Buning o'rniga, har doim mijozning ismi va dardi bilan bog'langan tayyor va jonli o'zbekcha gapni ber:
"Vazira opa, sizni tushunaman. Ko'pchilik avval narxga e'tibor beradi. Lekin beldagi noqulaylik uzoq davom etib, kundalik hayotga ta'sir qilayotgan bo'lsa, yechimni kechiktirish keyinchalik ko'proq xarajat va noqulaylik keltirishi mumkin."

---
JAVOBLARGA QAT'IY TALABLAR:
- Qisqa.
- Aniq.
- Professional va g'amxo'r.
- 100% O'zbek tilida.
- Keraksiz gaplar ya'ni "strategiya", "tavsiya:" deb boshlanadigan nazariyalar aslo bo'lmasin. Faqat tayyor gap bo'lsin.
- EMOJI UMUMAN YO'Q (HECH QANDAY EMOTICONLAR YOKI EMOJILAR ISHLATILMASIN!).
- Salomlashuv yo'q.
- Operator vaqtini tejash birinchi o'rinda.

---
SENNING MAQSADING:
Doctor Ali kompaniyasidagi har qanday yangi operatorni eng kuchli sotuvchi darajasiga olib chiqish. Har bir javob savdoga, ehtiyojni aniqlashga va bevosita mijoz bilan muloqotga (REAL GAP ORQALI) xizmat qilishi kerak.
`;

// Helper: Call Groq API via LLaMA-3.3-70b-versatile
const callGroqAPI = async (messages: any[], systemInstruction?: string, jsonMode: boolean = false): Promise<string> => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing");
  }

  const groqMessages: any[] = [];
  if (systemInstruction) {
    groqMessages.push({ role: "system", content: systemInstruction });
  }

  messages.forEach((m: any) => {
    const role = m.role === "assistant" || m.role === "model" ? "assistant" : "user";
    const content = m.text || m.content || m.parts?.[0]?.text || "";
    groqMessages.push({ role, content });
  });

  const body: any = {
    model: "llama-3.3-70b-versatile",
    messages: groqMessages,
    temperature: 0.7,
  };

  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content || "";
};

// Helper: Call Gemini API as fallback
const callGeminiAPI = async (messages: any[], systemInstruction?: string, jsonMode: boolean = false): Promise<string> => {
  const ai = getGeminiClient();
  const contents = messages.map((m: any) => ({
    role: m.role === "assistant" || m.role === "model" ? "model" : "user",
    parts: [{ text: m.text || m.content || "" }],
  }));

  const config: any = {
    temperature: 0.75,
  };

  if (systemInstruction) {
    config.systemInstruction = systemInstruction;
  }

  if (jsonMode) {
    config.responseMimeType = "application/json";
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config,
  });

  return response.text || "";
};

// Generic dispatcher: Prioritizes Groq, falls back to Gemini if available
const generateAICall = async (messages: any[], systemInstruction?: string, jsonMode: boolean = false): Promise<string> => {
  const hasGroq = !isGroqApiKeyMissing();
  const hasGemini = !isApiKeyMissingOrPlaceholder();

  if (hasGroq) {
    try {
      console.log("[AI CALL] Calling Groq API...");
      return await callGroqAPI(messages, systemInstruction, jsonMode);
    } catch (err: any) {
      console.error("[AI CALL] Groq API call failed. Trying Gemini fallback.", err);
      if (hasGemini) {
        return await callGeminiAPI(messages, systemInstruction, jsonMode);
      }
      throw err;
    }
  }

  if (hasGemini) {
    console.log("[AI CALL] Groq key missing. Calling Gemini fallback...");
    return await callGeminiAPI(messages, systemInstruction, jsonMode);
  }

  throw new Error("API_KEYS_MISSING");
};

// API Route: General Sales Professor Mentorship - Supports 6 Specialized Uzbek Agents
app.post("/api/chat/professor", async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, agentId, activeCustomer } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Yaroqsiz xabarlar formati" });
      return;
    }

    if (isGroqApiKeyMissing() && isApiKeyMissingOrPlaceholder()) {
      res.json({ text: getApiKeyInstructions() });
      return;
    }

    // Doctor Ali AI check: if the sub-agent is sales or product related, we MUST have fully defined customer card!
    const isSalesMarketingAgent = ["sotuv-muammolari", "sotuv-professori", "mahsulot-eksperti", "mijoz-tahlilchisi"].includes(agentId);
    if (isSalesMarketingAgent) {
      const missingFields: string[] = [];
      const cust = activeCustomer || {};

      const name = (cust.name || "").trim().toLowerCase();
      if (!name || name === "yangi mijoz" || name === "noma'lum" || name === "yangi") {
        missingFields.push("Ism");
      }

      const age = (cust.age || "").trim().toLowerCase();
      if (!age || age === "aniqlanmoqda..." || age === "aniqlanmoqda" || age === "0" || age === "") {
        missingFields.push("Yosh");
      }

      const problem = (cust.problem || "").trim().toLowerCase();
      if (!problem || problem === "aniqlanmoqda..." || problem === "aniqlanmoqda" || problem === "") {
        missingFields.push("Muammo");
      }

      const stage = (cust.stage || "").trim().toLowerCase();
      if (!stage || stage === "aniqlanmoqda..." || stage === "aniqlanmoqda" || stage === "") {
        missingFields.push("Suhbat bosqichi");
      }

      if (missingFields.length > 0) {
        const errorText = `⚠️ **MUHIM DOCTOR ALI QOIDASI:**
        
Doctor Ali AI hech qachon alohida kalit so'zlarga javob bermaydi. Har doim to'liq to'ldirilgan mijoz kartasi bilan ishlaydi.

Mijoz kartasida quyidagi majburiy maydonlar to'liq aniqlanmagan:
${missingFields.map((f, i) => `${i + 1}. **${f}**`).join("\n")}

**Ushbu ma'lumotlar kiritilmasdan turib:**
* Sotuv skripti yozilmaydi.
* E'tiroz tahlil qilinmaydi.
* Mahsulot tavsiya qilinmaydi.

**Nima qilish kerak?**
Iltimos, o'ng tarafdagi **"Anketa"** panelidan mijoz ma'lumotlarini (Ism, Yosh, Muammo va Suhbat bosqichini) kiriting yoki tahrirlang. Shundan keyingina muloqotni davom ettiring!`;
        res.json({ text: errorText });
        return;
      }
    }

    // Choose specialized Uzbek system instruction based on agentId
    let systemInstruction = "";

    switch (agentId) {
      case "sotuv-muammolari":
        systemInstruction = `Siz Doctor Ali AI kompaniyasining "Sotuv Muammolari Agenti" (Sales Problem Analyst) hisoblanasiz.
Vazifangiz: Operatorlarga sotuvda duch kelayotgan muammolarini (mijozning rad javobi, 'o'ylab ko'raman' deyishi, qiziqish yo'qligi, narx qimmatligi) tahlil qilishda, ularni bartaraf etishda va to'g'ri strategiyalar tuzishda yordam berish.
Muhim talablar:
1. FOYDALANUVCHI BILAN FAQAT VA FAQAT O'ZBEK TILIDA GAPLASHING.
2. Har doim juda sodda va tushunarli yozing.
3. Operator vaqtini tejash uchun qisqa va o'ta aniq javoblar bering.
4. Mijozga hech qachon '100% davolaydi' deb aytishni tavsiya qilmang. Mahsulotni davolovchi dori emas, organizmni va a'zolarni qo'llab-quvvatlovchi yechim sifatida tushuntiring.
5. Har bir javobingiz amaliy skriptlar va tayyor gaplar orqali sotuvga xizmat qilishi kerak.`;
        break;

      case "sotuv-professori":
        systemInstruction = `Siz Doctor Ali kompaniyasining "Sotuv Professori" va bitim yopish dahosisiz.
Vazifangiz: Operatorlarga SPIN Selling (Mijoz holati, Muammo, Oqibat, Yechim/Foyda zanjiri) zanjirini tuzishda va closing (shartnoma yopish, '1-kursmi yoki 2-kursmi?' kabi) texnikalarini qo'llashda mukammal o'rgatish.
Muhim talablar:
1. FOYDALANUVCHI BILAN FAQAT VA FAQAT O'ZBEK TILIDA MULOQOT QILING.
2. Operator vaqtini tejash uchun qisqa, sodda, aniq ssenariylar va muloqot taktikalarini bering.
3. Mahsulot foydalarini 'qo'llab-quvvatlash' sifatida tushuntiring, dori deb aytmang.
4. Har bir maslahatingiz savdoni yaxshilashga va buyurtmani tezda rasmiylashtirishga hissa qo'shsin.`;
        break;

      case "mahsulot-eksperti":
        systemInstruction = `Siz Doctor Ali kompaniyasining "Mahsulot Eksperti" (Doctor Ali Product Expert) hisoblanasiz.
Vazifangiz: Doctor Ali'ning 5 ta dabdabali hayotiy mahsuloti haqida batafsil va sodda muloqot qilish:
1. ONE SHOT ENERGY: Immunitet pasayishi, tez shamollash, holsizlik, charchoq, vitamin yetishmovchiligi.
2. ELIXIR: Xotira pasayishi, miya faoliyati, ko'z charchashi, yurak-qon tomir, jigar va buyrak faoliyati, bo'g'imlar.
3. DOCTOR ALI CHOYI: Shamollash, yo'tal, balg'am, nafas yo'llari, toksinlardan tozalash, qabziyat, uyqusizlik, asabiylik.
4. DOCTOR ALI BALZAMI: Immunitet pasayishi, kamqonlik, tez charchash, tiklanish davri, yurak va miya faoliyati, reproduktiv salomatlik.
5. DOCTOR ALI KREMI: Bel, bo'yin, bo'g'im og'rig'i, shpora, tovon yorilishi, mushak tarangligi.

Muhim talablar:
1. Muloqotni FAQAT O'ZBEK TILIDA olib boring.
2. Juda sodda, qisqa va tushunarli tilda ifoda eting.
3. MUHIM ETİK QOIDA: Mahsulotlar dori emas, organizmni va tayanch tizimlarini qo'llab-quvvatlovchi, kuchaytiruvchi tabiiy vositalardir. Hech qachon 'klinik davolaydi' yoki '100% shifo beradi' deb yozmang.`;
        break;

      case "mijoz-tahlilchisi":
        systemInstruction = `Siz Doctor Ali AI kompaniyasining "Mijoz Tahlilchisi" (Customer Profiler & Operator Assistant) hisoblanasiz.
Vazifangiz: Operator kirgazgan mijoz ma'lumotlarini (masalan, '52 yosh, prostata shamollashi, kechasi 4 marta hojatga chiqadi') tahlil qilib, 7-BOSQICHLI MUKAMMAL ssenariyni shakllantirib berish!

Suhbat davomida foydalanuvchi mijoz holatini yozganda, har doim quyidagi 7 bosqichli professional tahlilni chiqaring:

### 1-BOSQICH — MIJOZNI TAHLIL QILISH
Yoshi: [Yoshi]
Muammo: [Muammo]
Asosiy noqulaylik: [Noqulaylik]
Qo'shimcha savollar (Operator berishi uchun):
1. [Savol 1]
2. [Savol 2]
3. [Savol 3]
4. [Savol 4]

### 2-BOSQICH — MUAMMO OQIBATLARI
E'tibor berilmasa:
* [Oqibat 1]
* [Oqibat 2]
* [Oqibat 3]
* [Oqibat 4]

### 3-BOSQICH — MAHSULOT TANLASH
Mavjud mahsulotlar (ONE SHOT ENERGY, ELIXIR, DOCTOR ALI CHOYI, DOCTOR ALI BALZAMI, DOCTOR ALI KREMI) orasidan eng mosini tanlang va bu holatga mosligini asoslang.

### 4-BOSQICH — OPERATOR UCHUN TAYYOR SKRIPT
Operator bevosita nusxalab mijozga tashlaydigan yoki aytadigan juda chiroyli, muloyim salomlashish va mahsulotni tanishtiruvchi o'zbekcha gap (Hech qachon davolaydi demang, qo'llab-quvvatlovchi yechim sifatida yozing).

### 5-BOSQICH — QIZIQTIRISH
Mijozni muzokaraga tortish va qo'shimcha details olish uchun operator beradigan 3 ta tayyor savol.

### 6-BOSQICH — QARSHILIKNI YENGISH
Agar mijoz 'O'ylab ko'raman' yoki 'qimmat ekan' desa, operator berishi kerak bo'lgan g'amxo'r, lof va asossiz gaplarsiz kuchli javob ssenariysi.

### 7-BOSQICH — BUYURTMANI YOPISH
Ketkazib berish va kurs tanlovi bo'yicha tayyor closing savollari (Masalan, 'Sizga 1 kurs yozib beraymi yoki 2 kurs uyingizgacha yetkazib beraylik?').

Muhim talablar:
- Faol o'zbek tilida, juda qisqa, tushunarli va to'g'ridan-to'g'ri nusxa olishga tayyor formatda yozing.`;
        break;

      case "trening-murabbiyi":
        systemInstruction = `Siz Doctor Ali kompaniyasining "Trening Murabbiyi" (Certification Coach) hisoblanasiz.
Vazifangiz: Operatorni bosqichma-bosqich o'qitish, muloqot odobi va bitim yopish sirlari bo'yicha kichik o'zbekcha imtihon-viktorinalar o'tkazish.
Muhim talablar:
1. FAQAT VA FAQAT O'ZBEK TILIDA javob bering, sodda, professional bo'ling.
2. Har bir javobingizda amaliy biror test savoli yoki vaziyatli mashg'ulot berib, operatorning reaktsiyasini tahlil qiling.`;
        break;

      case "lider-murabbiyi":
        systemInstruction = `Siz Doctor Ali kompaniyasining "Lider Murabbiyi" (Leader Coach) va yetakchi mutaxassisiz.
Vazifangiz: Operatorlarga jamoa bilan ishlash, boshqa operatorlarni boshqarish, muloqotda liderlik xislatlarini ko'rsatish va umumiy sotuv jamoaviy drayvini oshirish haqida amaliy liderlik maslahatlarini berish.
Muhim talablar:
1. FAQAT JONLI VA SHOD, MINNATDOR O'ZBEK TILIDA gapiring va liderlik sirlarini juda sodda va ilhomlantiruvchi gaplarda tushuntiring.
2. Jamoada sog'lom muhit yaratish va boshqaruv sirlarini amaliy misollar bilan yozing.
3. Hech qanday murakkab rasmiy atamalardan foydalanmang.`;
        break;

      case "mijoz-simulyatori":
        systemInstruction = `Siz Doctor Ali kompaniyasining "Mijoz Simulyatori" (Customer Simulator) mutaxassisiz.
Vazifangiz: Operatorlar uchun haqiqiy xaridor rolini simulyatsiya qilish, e'tirozlarni to'g'ri o'rganishlariga amaliy yordam berish va yo'l-yo'riqlar ko'rsatish.
Muhim talablar:
1. FOYDALANUVCHI BILAN FAQAT VA FAQAT O'ZBEK TILIDA GAPLASHING.
2. Harakat va taktikada haqiqiy xaridor e'tirozlarini kiritib yuboring.`;
        break;

      case "universal-ai":
        systemInstruction = `Siz Doctor Ali kompaniyasining "Harqandaysavol" yordamchisiz.
Vazifangiz: Operatorlarning har qanday umumiy savollariga, biznes rivojlantirishga, shaxsiy motivatsiyaga va kundalik so'rovlarga javob berish.
Muhim talablar:
1. FAQAT SAMIMIY VA G'AMXO'R O'ZBEK TILIDA gapiring.
2. Har doim oqilona, tushunarli javob yozing.
3. Murakkab tibbiy va ilmiy atamalardan foydalandan saqlaning.`;
        break;

      default:
        systemInstruction = `Siz "Doctor Ali AI Operator Assistant" maslahatchisisiz.
Vazifangiz: Operatorlarni professional darajaga ko'tarish, ularga SPIN sotuv texnikasini o'rgatish va sotuv bo'yicha amaliy maslahatlar berish.
Muhim talab: Foydalanuvchi bilan har doim 100% samimiy va professional O'zbek tilida gaplashing. Mahsulotlar dori-darmon emas, bionik tabiiy qo'llab-quvvatlovchi ekanini ta'kidlang.`;
    }

    const finalInstruction = `${systemInstruction}\n\n${NEXRGIO_RULES}`;
    const textResponse = await generateAICall(messages, finalInstruction, false);
    res.json({ text: textResponse });
  } catch (error: any) {
    console.error("Error in professor chat API:", error);
    const isAuthError = error.message?.includes("API key") || error.message?.includes("unregistered callers") || error.message?.includes("PERMISSION_DENIED") || error.message?.includes("403") || error.message?.includes("Identity") || error.message?.includes("API_KEYS_MISSING");
    if (isAuthError) {
      res.json({ text: getApiKeyInstructions() });
    } else {
      res.status(500).json({ error: error.message || "Tizimda xatolik yuz berdi" });
    }
  }
});

// API Route: Interactive Customer Roleplay Chat (Returns natural Uzbek conversation)
app.post("/api/roleplay/chat", async (req: Request, res: Response): Promise<void> => {
  try {
    const { scenario, customerName, persona, product, messages } = req.body;
    if (!scenario || !product || !messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Missing required roleplay parameters" });
      return;
    }

    if (isGroqApiKeyMissing() && isApiKeyMissingOrPlaceholder()) {
      res.json({ text: getApiKeyInstructions() });
      return;
    }

    const systemInstruction = `Siz Doctor Ali AI kompaniyasining sotuv simulyatorida mijoz rolini o'ynayapsiz.
MIJOZ PROFILI:
- Ismi: ${customerName}
- Mijozning xarakteri (Persona): ${persona}
- Hayotiy va ish sharoitlari: ${scenario}
- Sizga taklif qilinayotgan Doctor Ali mahsuloti: Doctor Ali ${product.name} (${product.shortDescription})

YOL KO'RSATUVCHI QOIDALAR:
1. FOYDALANUVCHI (OPERATOR) BILAN FAQAT VA FAQAT O'ZBEK TILIDA MULOQOT QILING. O'zbek tilining tabiiy, suhbatbardosh va xarakteringizga mos uslubidan foydalaning.
2. Haqiqiy xaridor kabi yo'l tuting. Sotuvchi "buni sotib oling!" deyishi bilan darhol rozilik bermang. Shubha qiling, narxini qimmat deng, vaqtingiz kamligini ayting yoki batafsil savollar bering.
   - Skeptical (Shubhachi): Mahsulotning xususiyatlariga shubha qiladi, ilmiy isbot so'raydi.
   - Price-Sensitive (Tejamkor): Narxini qimmat deydi, arzon ximiyaviy dorilar yoki oddiy vositalar bilan solishtiradi.
   - Busy (Band): Tez gapiradi, vaqti yo'qligini, "asosiy foydasi nima o'zi?" deb qisqa javoblarni talab qiladi.
   - Curious (Qiziquvchan): Har bir detalga qiziqadi, qanday ishlashini so'raydi, o'ziga alohida e'tibor va g'amxo'rlik xohlaydi.
   - Returning (Doimiy mijoz): Doctor Ali mahsulotlarini yaxshi ko'radi, lekin yangi liniyani sinashdan oldin qisqa ishonchli tavsiya istaydi.
3. Hech qachon 'menda og'ir kasallik bor, bu mahsulot meni davolaydimi?' demang. Istaklaringiz faqatgina charchoq, uyqu buzilishi, bo'yin dardi, bel og'rig'i, diqqat tarqoqligi, kamqonlik, nafas yo'li yoki yo'tal kabi hayot faoliyati bilan bog'liq bo'lsin.
4. Javoblaringizni juda qisqa (1 tadan 3 tagacha gap) va tabiiy saqlang. Shunda suhbat xuddi haqiqiy mijoz bilan muloqotdagidek jozibali o'tadi.`;

    const finalInstruction = `${systemInstruction}\n\n${NEXRGIO_RULES}`;
    const textResponse = await generateAICall(messages, finalInstruction, false);
    res.json({ text: textResponse });
  } catch (error: any) {
    console.error("Error in roleplay chat API:", error);
    const isAuthError = error.message?.includes("API key") || error.message?.includes("unregistered callers") || error.message?.includes("PERMISSION_DENIED") || error.message?.includes("403") || error.message?.includes("Identity") || error.message?.includes("API_KEYS_MISSING");
    if (isAuthError) {
      res.json({ text: getApiKeyInstructions() });
    } else {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
});

// API Route: Evaluate Completed Roleplay and Score the Operator (JSON)
app.post("/api/roleplay/evaluate", async (req: Request, res: Response): Promise<void> => {
  try {
    const { scenarioDetails, productDetails, messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Missing messages history for evaluation" });
      return;
    }

    if (isGroqApiKeyMissing() && isApiKeyMissingOrPlaceholder()) {
      res.json(getMockEvaluation());
      return;
    }

    const chatLog = messages
      .map((m: any) => `${m.role === "user" ? "Salesperson" : "Customer"}: ${m.text}`)
      .join("\n");

    const prompt = `Siz Doctor Ali kompaniyasining "Doctor Ali AI Sotuv Professori" (Elite Sales Trainer) rolidasiz.
Quyidagi sotuv simulyatsiyasi dialogini diqqat bilan tahlil qilib chiqib, operatorga (sotuvchiga) munosib baho (1 dan 10 gacha) va mukammal o'zbek tilida tahliliy hisobot tayyorlang.

DIOLOG SSERARIYSI MA'LUMOTLARI:
Tavsiya etilgan mahsulot: Doctor Ali ${productDetails?.name} (${productDetails?.shortDescription})
Mijoz muammolari: ${scenarioDetails}

SUHBAT TRANSKRIPTI:
${chatLog}

BAHOLASH MEZONLARI:
1. SPIN Selling metodologiyasining qo'llanilishi: Operator vaziyatni, muammoni, uning oqibatini va mahsulot yechimini to'g'ri so'radi-mi, yoki darhol mahsulotni sotishga o'tdi-mi?
2. Maslahat ohangi (Consultative Tone): Mijozga g'amxo'rilk ko'rsatib, uni tingladi-mi va tushundi-mi?
3. Etika va qoidalar: Kasalliklarni davolaydi deb yolg'on va'dalar bermay, dori emasligini to'g'ri ta'kidladi-mi ("qo'llab-quvvatlaydi", "yordam berishi mumkin" kabi iboralar)?
4. Qarshiliklarni yengish (Objection Handling): Mijozning e'tirozlariga ("juda qimmat", "shubham bor" va hokazo) qanday javob qaytardi?
5. Bitimni yakunlash (Closing Strategy): Mijoz bilan keyingi bosqich uchrashuvini yoki maslahatlashuvni chiroyli va qulay taklif eta oldi-mi?

MUHIM REKOMENDATSIYA:
Hamma tahlillarni, kuchli va zaif tomonlarini, tavsiyalarini FAQAT VA FAQAT O'ZBEK TILIDA yozing. Hisobotni quyidagi JSON strukturasi bo'yicha toza shaklda qaytaring (hech qanday markdown \`\`\`json tegi qo'shmasdan va boshqa izohsiz faqat JSON qaytaring).
JSON formati:
{
  "score": 1, // (Integer) Baho (1 dan 10 gacha)
  "communicationQuality": "Sotuvchining kimyosi, yaqinligi, ohangi va ketma-ketligi bo'yicha qisqacha xulosa.",
  "customerUnderstanding": "Mahsulotni taklif qilishdan oldin maqsadlar, xavotirlar va turmush tarzi muammolarini qanchalik tushungani.",
  "salesConfidence": "Ishonch ohangi va professional pozitsiyasiga baho.",
  "spinApplication": "SPIN savollari qo'llanilishi bo'yicha to'g'ridan-to'g'ri tahlil. Tanqidiy bo'ling.",
  "closingEffectiveness": "Keyingi bosqichga taklif qilish yoki maslahatga yozish jarayoni va uning samaradorligi.",
  "strengths": ["Yaxshi o'tilgan vaziyatlar yoki 2-3 ta kuchli taktika."],
  "weaknesses": ["2-3 ta rivojlanishi kerak bo'lgan xato yoki o'tkazib yuborilgan imkoniyat."],
  "detailedFeedback": "Doctor Ali Operatori sifatida keyingi qadamlar bo'yicha motivatsion murabbiylik maslahati berilgan biror to'liq xatboshi."
}`;

    const textResponse = await generateAICall([{ role: "user", content: prompt }], undefined, true);
    
    try {
      // Clean up potential markdown formatting in textResponse before parsing
      let cleaned = textResponse.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
      }
      
      const evaluation = JSON.parse(cleaned);
      res.json(evaluation);
    } catch (parseErr) {
      console.error("Failed to parse JSON schema output, returning fallback mock:", parseErr);
      res.json(getMockEvaluation());
    }
  } catch (error: any) {
    console.error("Error in roleplay evaluation API:", error);
    res.json(getMockEvaluation());
  }
});

// API Route: Custom SPIN Question Planner Generator (JSON)
app.post("/api/spin/generate", async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerSituation, productInterest } = req.body;
    if (!customerSituation || !productInterest) {
      res.status(400).json({ error: "Missing customer situation or product context" });
      return;
    }

    if (isGroqApiKeyMissing() && isApiKeyMissingOrPlaceholder()) {
      res.json(getMockSPINRoadmap());
      return;
    }

    const prompt = `Siz Doctor Ali AI kompaniyasining "Doctor Ali AI Sotuv Professori" va maslahatchisisiz.
Sizga yangi mijoz haqida quyidagi ma'lumotlar keldi:
- Mijozning ayni damdagi holati/xavotirlari: "${customerSituation}"
- Qiziqayotgan Doctor Ali mahsuloti: "Doctor Ali ${productInterest}"

Iltimos, ushbu mijoz uchun to'liq SPIN Selling (Situation, Problem, Implication, Need-Payoff) savollar rejasini tayyorlang. Har bir bosqich uchun aynan shu mijozga mos keladigan 2 tadan yuqori samarali savol bering va professional maslahat qo'shing.
Tavsiyalar va savollar to'liq O'ZBEK tilida yozilishi shart. Hisobotni quyidagi JSON strukturasi bo'yicha toza shaklda qaytaring (hech qanday markdown \`\`\`json tegi qo'shmasdan va boshqa izohsiz faqat JSON qaytaring).
JSON formati:
{
  "situationQuestions": ["vaziyat savoli 1", "vaziyat savoli 2"],
  "problemQuestions": ["muammo savoli 1", "muammo savoli 2"],
  "implicationQuestions": ["og'riq oqibati savoli 1", "og'riq oqibati savoli 2"],
  "needPayoffQuestions": ["yechim/foyda savoli 1", "yechim/foyda savoli 2"],
  "tacticalSlogan": "Mijozni qiziqtirish uchun asosiy shior yoki taktik xabar.",
  "coachAdvice": "Trenerning ushbu mijoz bilan ishlash bo'yicha maxsus sotuv maslahati."
}`;

    const textResponse = await generateAICall([{ role: "user", content: prompt }], undefined, true);

    try {
      // Clean up potential markdown formatting in textResponse before parsing
      let cleaned = textResponse.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
      }
      
      const roadmap = JSON.parse(cleaned);
      res.json(roadmap);
    } catch (parseErr) {
      console.error("Failed to parse SPIN JSON output, returning fallback mock:", parseErr);
      res.json(getMockSPINRoadmap());
    }
  } catch (error: any) {
    console.error("Error in SPIN generator API:", error);
    res.json(getMockSPINRoadmap());
  }
});

// Implement Vite middleware or static server for Production build
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Doctor Ali AI Sales Academy backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
