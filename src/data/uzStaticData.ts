import { OperatorLevel, LevelInfo, DoctorAliProduct, RoleplayScenario, QuizQuestion } from "../types";

export const FIN_OPERATOR_LEVELS: LevelInfo[] = [
  {
    level: "Beginner Operator" as OperatorLevel,
    requiredXp: 0,
    unlockedFeatures: ["Interaktiv Doctor Ali AI", "1-Darajali Mahsulot Katalogi", "Sotuv Skriptlari"],
    tips: [
      "Doctor Ali mahsulotlari haqida gapirishdan oldin har doim mijozning holatini (SPIN savollari orqali) aniqlang. Oddiy sotuv skripti boti bo'lmang!",
      "Etik sotuv - eng ustuvor qadriyatidir. 'Bu kasallikni 100% davolaydi' so'zini 'Bu sizning salomatligingizni va organizmingizni qo'llab-quvvatlaydi' iborasiga almashtiring."
    ]
  },
  {
    level: "Junior Seller" as OperatorLevel,
    requiredXp: 100,
    unlockedFeatures: ["O'rtacha Simulyatsiyalar", "E'tirozlarni yengish andozalari", "SPIN Custom Rejalashtirgich"],
    tips: [
      "Shubhachi xaridorlar bilan muloqotda ilmiy mantiq va dalillardan foydalaning. Ularga batafsil savollar berishga ruxsat bering.",
      "Vaqtning 60% qismida mijozni tinglang. Mijozning dardi Doctor Ali mahsulotining foydasini belgilaydi."
    ]
  },
  {
    level: "Professional Seller" as OperatorLevel,
    requiredXp: 300,
    unlockedFeatures: ["Murakkab Simulyatsiyalar", "Tejamkor Mijoz Simulyatsiyasi", "Moslashtirilgan Pitch builderi"],
    tips: [
      "Narx dardi odatda mahsulot qiymatini tushunmaslikdan kelib chiqadi. Salomatlikka pul sarflamaslikning oqibatlarini tushuntiring.",
      "Oqibat savollari (Implication) mayda muammolarni jiddiy harakatga aylantiruvchi ko'prikdir."
    ]
  },
  {
    level: "Senior Seller" as OperatorLevel,
    requiredXp: 600,
    unlockedFeatures: ["Kengaytirilgan yo'llar", "Elita hamkasblar sinovlari", "Maxsus ssenariyli simulyatsiyalar"],
    tips: [
      "Mijozning o'zi o'z darmonining qiymatini so'zlab berishi uchun 'Ehtiyoj va Foyda' (Need-payoff) savollarini to'g'ri bering.",
      "Etik bitim yopish (Closing) - bu manipulyatsiya emas, balki g'amxo'r maslahatning tabiiy davomidir."
    ]
  },
  {
    level: "Elite Doctor Ali Consultant" as OperatorLevel,
    requiredXp: 1000,
    unlockedFeatures: ["Maxsus prompt muhandisligi", "Strategik mahsulot juftlanmalari", "Guruh rahbarlari boshqaruv paneli"],
    tips: [
      "Kichik operatorlarga murabbiylik qiling. Har bir maslahatomuz savol ortidagi falsafani tushuntiring.",
      "Doctor Ali mahsulotlarini mijozning kundalik hayot tarziga mukammal moslashtirishni o'rganing."
    ]
  },
  {
    level: "Top Leader" as OperatorLevel,
    requiredXp: 1500,
    unlockedFeatures: ["Masterklass darslari", "Shon-sharaf medali", "Oliy toifali konsultant unvoni"],
    tips: [
      "Siz Doctor Ali sotuv san'atini to'liq zabt etdingiz! Endi etik qoidalar asosida dars bering va yo'naltiring.",
      "Haqiqiy yetakchilik - faol operatorlarga xizmat qilish va mijozlarni salomatlik sari ruhlantirishdir."
    ]
  }
];

export const UZ_LEVEL_MAP: Record<string, string> = {
  "Beginner Operator": "Boshlovchi Operator",
  "Junior Seller": "Kichik Sotuvchi",
  "Professional Seller": "Professional Sotuvchi",
  "Senior Seller": "Katta Sotuvchi",
  "Elite Doctor Ali Consultant": "Elita Doctor Ali Konsultanti",
  "Top Leader": "Oliy Yetakchi"
};

export const UZ_DOCTOR_ALI_PRODUCTS: DoctorAliProduct[] = [
  {
    id: "one-shot-energy",
    name: "ONE SHOT ENERGY",
    shortDescription: "Immunitet, holsizlik va charchoqqa qarshi tezkor energiya formulasi.",
    fullDescription: "Immunitet pasayishi, tez-tez shamollash, holsizlik, doimiy charchoq hamda organizmda vitamin yetishmovchiligi kabi holatlarda tana quvvatini tezkor tiklash va immunitet zanjirini mustahkamlash uchun mo'ljallangan faol tabiiy kompleks.",
    category: "Quvvat & Immunitet",
    supportClaims: [
      "Tana quvvatini va energiya almashinuvini tezkor tiklashga yordam beradi.",
      "Immunitet tizimini faol qo'llab-quvvatlaydi va gripp, shamollash xavfini kamaytiradi.",
      "Surunkali charchoq hamda darmonsizlik hissini bartaraf etishga ko'maklashadi."
    ],
    ethicsNote: "DIQQAT: Ushbu mahsulotni grippni yoki virusli kasalliklarni darhol davolovchi dori vositasi sifatida taqdim etmang. Bu organizmni mustahkamlovchi hayotiy quvvat va vitamin kompleksidir.",
    targetAilmentGoals: "Tez shamollash, immunitet pasayishi, doimiy uyquchanlik, jismoniy holsizlik va vitamin yetishmovchiligi.",
    spinTemplate: {
      situation: [
        "Oxirgi paytlarda ertalab uyg'onganda o'zingizni tetik his qilyapsizmi yoki charchoq bormi?",
        "Kun davomida aqliy yoki jismoniy yuklamalaringiz qay darajada?"
      ],
      problem: [
        "Holsizlik yoki quvvatsizlik sababli rejalashtirgan ishlaringizni kechiktirishga majbur bo'lyapsizmi?",
        "Yil davomida tez-tez shamollash va faoliyatingiz sustlashishi sizni qiynaydimi?"
      ],
      implication: [
        "Doimiy charchoq sizning oilangizga va ish faolligingizga qanday ta'sir qilyapti deb o'ylaysiz?",
        "Agar ushbu holsizlik asoratlari bartaraf etilmasa, kelgusi oylarda sog'lig'ingiz yanada zaiflashishiga olib kelishi mumkinmi?"
      ],
      needPayoff: [
        "Agar biz tabiiy, tezkor quvvat beruvchi va oshqozonga salbiy ta'sir qilmaydigan xavfsiz kompleksni qo'llasak, hayotiy quvvatingiz qay darajada tiklangan bo'lardi?",
        "Kun davomida lanjliksiz, to'liq energiya bilan ishlash siz uchun qanchalik muhim?"
      ]
    },
    commonObjections: [
      {
        objection: "Bozordagi arzon energetik ichimliklar yoki dori tabletkalari ham energiya beradi-ku.",
        handleTemplate: "Kimyoviy energetik ichimliklar va sintetik tabletkalar yurakka katta yuklama beradi va oshqozonni bezovta qiladi. ONE SHOT ENERGY esa faqat tabiiy vitaminlar va adaptogenlar asosida tana hujayralarini tabiiy tarzda uyg'otadi, nojo'ya ta'sirlarsiz uzoq muddatli quvvat beradi.",
        explanation: "Sintetik energetiklar va tabiiy adaptogen quvvat o'rtasidagi farqni va organizm xavfsizligini tushuntiradi."
      }
    ]
  },
  {
    id: "elixir",
    name: "ELIXIR",
    shortDescription: "Xotira, miya faoliyati, jigar va buyraklarni qo'llab-quvvatlovchi darmon.",
    fullDescription: "Xotira pasayishi, aqliy faollik kamayishi, ko'z charchashi, yurak-qon tomir tizimi muammolari hamda jigar va buyrak faoliyatini ichkaridan himoya qilish, bo'g'imlar moslashuvchanligini saqlash uchun mo'ljallangan elita bionik eliksir.",
    category: "Miya & Tana Faoliyati",
    supportClaims: [
      "Miya faoliyatini yaxshilaydi, diqqatni jamlash va xotira kuchini qo'llab-quvvatlaydi.",
      "Jigar va buyrak funksiyalarini filtratsiyalash qobiliyatini rag'batlantiradi.",
      "Ko'z nuri va yurak-qon tomir tizimini muvozanatda saqlashga ko'maklashadi."
    ],
    ethicsNote: "DIQQAT: Jigar sirrozi, og'ir buyrak yetishmovchiligi yoki insultni davolaydi deb va'da bermang. Tana a'zolari faoliyatini qo'llab-quvvatlovchi va tiklanishiga yordam beruvchi eliksir deb tushuntiring.",
    targetAilmentGoals: "Xotirasizlik, miya toliqishi, ko'zlar tez charchashi, jismoniy yuklamalardan keyin jigar va buyrak og'irliklari, bo'g'im qotishi.",
    spinTemplate: {
      situation: [
        "Muntazam aqliy mehnat bilan shug'ullanasizmi yoki ko'proq kompyuter qarshisida o'tirasizmi?",
        "Hozirda biron bir aqliy faollikni oshiruvchi yoki jigar-buyrakni himoya qiluvchi vositalardan foydalanyapsizmi?"
      ],
      problem: [
        "Muhim ma'lumotlarni eslab qolishda qiynalyapsizmi yoki tez-tez ko'zlaringiz charchab, og'riq sezyapsizmi?",
        "Teringizda yoki o'ng qovurg'a ostida og'irlik, buyraklarda lanjlik hissi bo'ladimi?"
      ],
      implication: [
        "Ushbu xotira zaifligi yoki diqqat tarqoqligi ish faoliyatingizga va qaror qabul qilishingizga qanday hal qiluvchi to'siq bo'lmoqda?",
        "Agar ushbu ichki a'zolar yuklamasi vaqtida bartaraf qilinmasa, keyinchalik jiddiy asoratlarga olib kelishi mumkinmi?"
      ],
      needPayoff: [
        "Agar organizmingizni ichkaridan tozalab, miya faolligini 2 barobar o'stiruvchi va tana a'zolarini qo'llab-quvvatlovchi eliksirni qo'llasak, hayot tarzingiz qanchalik mukammal bo'lar edi?",
        "Miyangiz doim tiniq va asab tizimingiz tinch bo'lishi ish unumdorligingizni qay darajada oshiradi?"
      ]
    },
    commonObjections: [
      {
        objection: "Menga shunchaki dorixonalardagi oddiy xotira tabletkalari yetadi.",
        handleTemplate: "Sintetik tabletkalar jigarga qo'shimcha toksik yuklama olib keladi. ELIXIR esa to'liq tabiiy asosda tayyorlangan bo'lib, miya faoliyatini rivojlantirish bilan birga jigarni ham himoya qiladi va zaharli moddalarni haydaydi.",
        explanation: "Kimyoviy dori vositalarining jigarga zarari va eliksirning kompleks tabiiy foydasini taqqoslaydi."
      }
    ]
  },
  {
    id: "dr-ali-choy",
    name: "DOCTOR ALI CHOYI",
    shortDescription: "Nafas yo'llari, yo'tal, balg'am va toksinlarni tozalovchi sokinlik choyi.",
    fullDescription: "Shamollash, surunkali yo'tal, balg'am to'planishi, nafas qisishi muatsadlari hamda organizmni zaharli toksinlardan bosqichma-bosqich tozalash, qabziyatni bartaraf etish, uyqu va asabiylikni tartibga solishga yordam beruvchi shifobaxsh o'tlar yig'indisi.",
    category: "Sokinlik & Tozalash",
    supportClaims: [
      "Nafas yo'llarini balg'amdan tozalaydi va yo'talni yumshatadi.",
      "Tadrijiy ravishda ichaklarni tozalaydi, qabziyatni yumshoq bartaraf qiladi.",
      "Tungi asabiylikni va uyqusizlikni yengib, chuqur xotirjam uyqu beradi."
    ],
    ethicsNote: "DIQQAT: Surunkali astmani yoki og'ir zotiljamni to'liq davolovchi dori sifatida sotmang. Nafas yo'llari va ovqat hazmini qo'llab-quvvatlovchi profilaktik ekologik toza choy sifatida tushuntiring.",
    targetAilmentGoals: "Yo'tal, balg'am ko'p to'planishi, allergiya asoratlari, nafas siqilishi, qabziyat, ichaklar buzilishi, kechki uyqusizlik va asabiylashtiruvchi stress.",
    spinTemplate: {
      situation: [
        "Kechasi uxlashga yotganda yo'tal yoki nafas yo'llarida qisilgandek noqulaylik bo'ladimi?",
        "Kun davomida ichak faoliyati va ovqat hazm bo'lishi sizni qoniqtiryaptimi?"
      ],
      problem: [
        "Yo'tal tufayli tunda tez-tez uyg'onib chiqib, ertasi kuni charchab qolishingiz joningizga tegdimi?",
        "Surtilgan toksinlar yoki ich qotishi (qabziyat) tufayli o'zingizni og'ir va ba'zan asabiy his qilasizmi?"
      ],
      implication: [
        "Nafas yo'llarining surunkali qisilishi va toliqish yurak faoliyatingizga qo'shimcha og'irlik olib kelmaydimi?",
        "Toksinlar yig'ilib boraversa, teringizda va umumiy jismoniy holatingizda qanday salbiy o'zgarishlarni sezyapsiz?"
      ],
      needPayoff: [
        "Agar tunda sizni balg'amsiz, xotirjam va osuda nafas olishga undaydigan, oshqozon-ichakni zaharli moddalardan tozalaydigan Doctor Ali Choyini ichishni boshlasangiz, bu sizning hayotingizni qanchalik yengillashtiradi?",
        "Tinch uyqu va toza ichak tizimiga ega bo'lish siz uchun qanchalik qadrli?"
      ]
    },
    commonObjections: [
      {
        objection: "Bozordagi oddiy ko'k choy yoki o'tlar ham xuddi shunaqa foyda beradi-ku.",
        handleTemplate: "Oddiy choylar faqatgina bir tomonlama yengillik beradi. DOCTOR ALI CHOYI maxsus nisbatda birlashtirilgan 10 dan ortiq dorivor o'tlar jamlanmasi bo'lib, u ham o'pka-nafas yo'llarini tozalaydi, ham ichaklarni yumshatadi va ham asab tizimini normallashtiradi.",
        explanation: "Monokomponent oddiy o'tlar va shifobaxsh mukammal Doctor Ali formulasining sinergik ustunligini ko'rsatadi."
      }
    ]
  },
  {
    id: "dr-ali-balzam",
    name: "DOCTOR ALI BALZAMI",
    shortDescription: "Kamqonlik, jismoniy tiklanish va tana a'zolari hayotiy kuchini oshiruvchi balzam.",
    fullDescription: "Immunitet pasayishi, anemiyaning turli darajalari (kamqonlik), tez toliqish, kasalliklardan keyingi tiklanish davri, shuningdek, yurak faolligi, miya quvvati va reproduktiv salomatlikni mustahkamlovchi vitamin va minerallarga boy tabiiy balzam.",
    category: "Organizm Quvvati",
    supportClaims: [
      "Qon tarkibidagi gemoglobin va temir darajasini tabiiy oshirishga yordam beradi.",
      "Og'ir jismoniy yuklama yoki kasalliklardan so'ng tanani juda tez tiklaydi.",
      "Reproduktiv salomatlik va yurak mushaklarini faol quvvat bilan ta'minlaydi."
    ],
    ethicsNote: "DIQQAT: Ushbu balzam bepushtlikni mutlaqo davolaydi yoki og'ir kamqonlikni bir kunda yo'q qiladi deb aytmang. Tana quvvatini va qon aylanish tizimini eng yuqori darajada qo'llab-quvvatlashini ayting.",
    targetAilmentGoals: "Kamqonlik, quvvatsizlik, bosh aylanishi, immun tizimi zaifligi, og'ir kasalliklardan keyingi holsizlik va reproduktiv immunitet pasayishi.",
    spinTemplate: {
      situation: [
        "Qon tahlillaringizda gemoglobin miqdori pastligi haqida shifokorlar ogohlantirganmi?",
        "Kun davomida tez-tez boshingiz aylanib, ko'zingiz oldi qorong'ulashib turadimi?"
      ],
      problem: [
        "Kasallikdan keyin yoki oddiy kunlarda ham o'zingizni to'liq tiklay olmay, doimiy holdan toyish sizni qiynayaptimi?",
        "Reproduktiv faollik pasayib borayotgandek xavotir bormi?"
      ],
      implication: [
        "Ushbu kamqonlik va doimiy holsizlik asoratlari sizning ishlash, oilaviy hayot yoki sport bilan shug'ullanish imkoniyatlaringizni qanchalik cheklab qo'ymoqda?",
        "Agarda immunitetingiz va qon tarkibi zaiflashib boraversa, kelgusida biron bir surunkali infeksiya sizga tez o'tib ketishi xavfi bormi?"
      ],
      needPayoff: [
        "Agar biz organizmda qizil qon tanachalarini ko'paytiradigan, tana quvvatini ichkaridan to'ldirib, reproduktiv va yurak faolligini oshiruvchi Doctor Ali Balzamini tavsiya qilsak, o'zingizni necha yoshga yoshroq va baquvvatrog' his qilgan bo'lardingiz?",
        "Hech qanday bosh aylanishlarsiz, har doim ishonchli tana harakatlariga ega bo'lish siz uchun nechog'lik muhim?"
      ]
    },
    commonObjections: [
      {
        objection: "Dori darmonlar ichsam qonim tezroq ko'payadi, arzonroq ham tushadi.",
        handleTemplate: "Dorixonalardagi temir dorilari ko'pincha jiddiy qabziyat tufayli ichaklarni buzadi va tana tomonidan juda sekin so'riladi. Doctor Ali Balzami esa to'liq tabiiy organik shaklda bo'lgani sababli, ichaklarni bezovta qilmaydi va 95% gacha to'liq so'rilib, kamqonlikni ishonchli yaxshilaydi.",
        explanation: "Sintetik temir preparatlarining hazm qilish zanjiriga salbiy ta'sirlari va Doctor Ali Balzamining beziyon so'rilish muvozanatini farqlaydi."
      }
    ]
  },
  {
    id: "dr-ali-krem",
    name: "DOCTOR ALI KREMI",
    shortDescription: "Bel, bo'yin, bo'g'im va mushak og'riqlariga qarshi faol bionik krem.",
    fullDescription: "Bel, bo'yin, bo'g'im, tizza og'riqlari, tovon shpori, tovon yorilishi hamda mushaklarning haddan tashqari taranglashishi raddiyalarida og'riq signallarini tezda to'xtatuvchi va to'qimalarni yumshatuvchi tabiiy ekstraktli krem.",
    category: "Tayanch-Harakat Tizimi",
    supportClaims: [
      "Bel, bo'yin va bo'g'imlardagi mushak tarangligini va og'riqlarni yumshatadi.",
      "Tovon yorilishlarini samarali tiklab, sog'lom ko'rinish beradi.",
      "Bo'g'imlarning harakatlanish erkinligini va to'qimalarning elastikligini tiklaydi."
    ],
    ethicsNote: "DIQQAT: Grija (umurtqa churrasi)ni jarrohliksiz butunlay yo'q qiladi deb va'da bermang. Krem tayanch-harakat a'zolaridagi yallig'lanishlarni kamaytirish, og'riqlarni yumshatish va moslashuvchanlikni saqlach uchun mo'ljallangan.",
    targetAilmentGoals: "Bel og'rig'i, bo'yin qotishi, tizza va bo'g'im lanjliklari, tovon shpori, tovonning qattiq yorilishi, mushaklar tortishishi.",
    spinTemplate: {
      situation: [
        "Kun davomida uzoq vaqt bir joyda yoki noqulay holatda o'tirib ishlashingizga to'g'ri keladimi?",
        "Og'riq tufayli biron bir dori yoki og'riq qoldiruvchi maz surtib turasizmi?"
      ],
      problem: [
        "Egilganda, tik turganda yoki zinalardan chiqqanda belingiz yoki tizzangizda og'riq sizni to'xtatib qo'yadimi?",
        "Tovon yorilishi yoki tovon shpori yurishingizni qiyinlashtirib, har qadamda og'riq beryaptimi?"
      ],
      implication: [
        "Ushbu bo'g'im yoki tovon og'риqlari tufayli kundalik toza havoli sayrlarni yoki jismoniy faollikni cheklashga majbur bo'lishingiz kelajakda tanangizga qanchalik og'irlik olib kelmoqda?",
        "Agar og'riq signallari vaqtida bartaraf qilinmasdan asab qisilishi kuchayaversa, bu hayot tarzingizga qanday ta'sir qiladi deb o'ylaysiz?"
      ],
      needPayoff: [
        "Agar biz og'riq nuqtalariga tez ta'sir qiladigan va yallig'lanishni kamaytiradigan, tabiiy, nojo'ya ta'sirsiz Doctor Ali Kremini surtishni rejalashtirsak, og'riqlarsiz erkin harakatlanish siz uchun naqadar qulaylik keltirgan bo'lardi?",
        "O'zingizni erkin, hech qanday cheklovlarsiz his qilish siz uchun qay darajada muhim?"
      ]
    },
    commonObjections: [
      {
        objection: "Arzonroq oddiy mazlarni surtsam ham bo'ladi.",
        handleTemplate: "Oddiy mazlar faqatgina ma'lum muddatga terini sovitib, og'riqni chalg'itadi, ammo to'qimalarni tiklamaydi. DOCTOR ALI KREMI esa teridan chuqur kirib borib, bo'g'im elastikligini va tovon terisini ostidan tiklashga yordam beradi, natijada og'riq sababi bartaraf etiladi.",
        explanation: "Simptomlarni vaqtincha bostiruvchi oddiy sovitish mexanizmlari hamda to'qima tiklovchi Doctor Ali Kremi o'rtasidagi farqni tushuntiradi."
      }
    ]
  }
];

export const UZ_ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
  {
    id: "scen-energy-skeptic",
    title: "Charchagan Texnik Rahbar (David - ONE SHOT ENERGY)",
    customerName: "David Cole",
    persona: "Skeptical",
    background: "Haftasiga 60 soat ishlaydigan dasturiy ta'minot bo'limi rahbari. 5 soat uxlaydi, juda horg'in uyg'onadi, kuniga 4 finjon qahva ichadi. Vitamin komplekslari shunchaki hiyla deb ishonadi va buni ilmiy isbotlashni talab qiladi.",
    targetProduct: "one-shot-energy",
    difficulty: "Medium"
  },
  {
    id: "scen-krem-busy",
    title: "Ekran Oldidagi Treyder (Sarah - DOCTOR ALI KREMI)",
    customerName: "Sarah Jenkins",
    persona: "Busy",
    background: "Yuqori xavfli birja tizimida kun bo'yi 4 ta monitor qarshisida o'tiradi. Qomatini tik tutishga irodasi umuman qolmaydi, doim bo'yin tarangligidan va bel og'rig'idan og'riq sezyapti. Tez gapiradi va suhbatni tezroq yakunlab buyurtma yopilishini xohlaydi.",
    targetProduct: "dr-ali-krem",
    difficulty: "Easy"
  },
  {
    id: "scen-elixir-price",
    title: "Tejamkor Frilanser (Elena - ELIXIR)",
    customerName: "Elena Rostova",
    persona: "Price-Sensitive",
    background: "Yangi frilanser. Tushdan keyin xotira va energiyasi keskin pasayishi sababli ishlarini topshirolmaydi. Mahsulotga qiziqadi, ammo narxi qimmatligini ro'kach qiladi.",
    targetProduct: "elixir",
    difficulty: "Hard"
  },
  {
    id: "scen-choy-curious",
    title: "Chalg'uvchan va Yo'talayotgan Loyiha PM (Marcus - DOCTOR ALI CHOYI)",
    customerName: "Marcus Vance",
    persona: "Curious",
    background: "Uzoq gaplashganda quruq yo'tal bezovta qiladi, kechki asabiylik va uyqusizlik tufayli dam ololmaydi. O'simlik darmon choylariga katta qiziqishi bor, har bir o't haqida millionta texnik savol so'raydi.",
    targetProduct: "dr-ali-choy",
    difficulty: "Medium"
  },
  {
    id: "scen-balzam-returning",
    title: "Qaytgan Sport Murabbiyi (Randy - DOCTOR ALI BALZAMI)",
    customerName: "Randy murabbiy",
    persona: "Returning",
    background: "Doctor Ali Kremini oldin sotib olgan va uni sevadi. Endi esa uning doimiy kamqonlik va quvvatsizlik muammosi bor. Nega Doctor Ali Balzami oddiy vitamin kapsulalaridan biologik afzalroq ekanligini so'ramoqda.",
    targetProduct: "dr-ali-balzam",
    difficulty: "Easy"
  }
];

export const UZ_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "Doctor Ali Etik Qoidalariga muvofiq, mahsulot xususiyatlarini qanday to'g'ri ifodalash lozim?",
    options: [
      "Doctor Ali mahsulotlari shamollashni, prostata kasalliklarini va grippni 100% davolaydi deb aytish.",
      "Ular kasalliklarni dastlabki bosqichda diagnostika qilishini kafolatlash.",
      "'Qo'llab-quvvatlashi mumkin' yoki 'saqlashga yordam beradi' kabi so'zlardan foydalanish va davolovchi degan ifodalarsiz va'dalar berish.",
      "Mijozga dori-darmonlarini butunlay to'xtatib, shifokorlarga ishonmaslikni aytish."
    ],
    answerIndex: 2,
    explanation: "Standard qoidalar dori-darmon iddaolarining oldini oladi. Biz faqatgina 'sog'lom turmushni qo'llab-quvvatlaydi' va 'sokinlikni saqlaydi' degan yordamchi iboralarni ishlata olamiz."
  },
  {
    id: "q2",
    question: "Mijoz 'O'ylab ko'raman' degan rad javobini berganda etik operator qanday yo'l tutishi kerak?",
    options: [
      "Xafa bo'lib aloqani uzish.",
      "Mijozni hozir ham bezovta qilayotgan muammoni keyinga qoldirish uning oqibati va asoratlarini yomonlashtirishi mumkinligini g'amxo'rlik bilan tushuntirish va qo'llab-quvvatlashni ertaroq boshlashni tavsiya qilish.",
      "Mijozni pulsizlikda yoki tushunmovchilikda ayblab gapirish.",
      "Unga boshqa arzonroq va sifatsiz narsani sotishga urinish."
    ],
    answerIndex: 1,
    explanation: "Rad etish 'O'ylab ko'raman' deganda darni keyinga qoldirish yechim bo'lmasligini g'amxo'r maslahat bilan tushuntirish kerak."
  },
  {
    id: "q3",
    question: "Doctor Ali Balzamini sotishda, narxdan arz qiladigan darmonsiz mijozga qanday argument berish lozim?",
    options: [
      "Arzon multivitaminlarning umuman foydasizligini aytib, ularni zaharli deb haqoratlash.",
      "Sintetik temir preparatlari ichaklarni buzib, qabziyat berishi va balzamning to'liq tabiiy organik shaklda beziyon so'rilish nisbatini tushuntirish.",
      "Zorlanib narxni yarmiga tushirib sotish.",
      "Uni bepisandlik bilan suhbatdan chiqarib yuborish."
    ],
    answerIndex: 1,
    explanation: "Organik shakldagi tabiiy darmon balzam nojo'ya ta'sirlarsiz to'liq so'rilishini tushuntirish mijozga uning qiymatini isbotlab beradi."
  },
  {
    id: "q4",
    question: "Profil tahlilchisi sifatida professional operator birinchi navbatda nima qilishi shart?",
    options: [
      "Imkon qadar tez va baland ovozda mahsulot sotib olishga majburlash.",
      "Mijozning yoshi, muammolari va asosiy noqulayliklarini tushunib, SPIN selling bo'yicha ehtiyojlarini o'lchash va muammoga maqsadli bionik yechim tavsiya etish.",
      "Faqat narxlar ro'yxatini tashlab berish, muzokaraga chalg'imaslik.",
      "Dori o'rnida davolovchi deb 100% kafolat berish."
    ],
    answerIndex: 1,
    explanation: "Konsultativ sotuv har doim tushunish, ehtiyojlarni to'g'ri o'lchash va muammoga maqsadli yechim taqdim etish bilan boshlanadi."
  },
  {
    id: "q5",
    question: "Mijozga buyurtmani yopish (Closing) bosqichida qaysi savolni berish mutlaqo to'g'ri hisoblanadi?",
    options: [
      "Mahsulotni olasizmi?",
      "Sizga 1 kurs yozib beraymi yoki 2 kurs olasizmi? yoxud Yetkazib berish xizmatini qaysi manzilga qilamiz?",
      "Sotib olasizmi yoki yo'q deya so'rash.",
      "Pulingiz yetadimi deb so'rash."
    ],
    answerIndex: 1,
    explanation: "Mijozga 'olasizmi' emas, balki buyurtma jarayonining davomini g'amxo'rlik bilan tanlov shaklida (1-kurs yoki 2-kurs yoki yetkazib berish manzili) taqdim etish savdo muvaffaqiyatini belgilaydi."
  }
];
