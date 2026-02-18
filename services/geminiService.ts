import { GoogleGenAI, Type } from "@google/genai";
import { TestReport } from "../types";

// Schema definition for the structured output we want from Gemini
const reportSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.OBJECT,
      properties: {
        totalTests: { type: Type.INTEGER },
        passed: { type: Type.INTEGER },
        failed: { type: Type.INTEGER },
        risky: { type: Type.INTEGER },
        critical: { type: Type.INTEGER },
      },
      required: ["totalTests", "passed", "failed", "risky", "critical"],
    },
    scores: {
      type: Type.OBJECT,
      properties: {
        security: { type: Type.INTEGER },
        performance: { type: Type.INTEGER },
        ux: { type: Type.INTEGER },
        codeQuality: { type: Type.INTEGER },
        global: { type: Type.INTEGER },
        globalRiskLabel: { type: Type.STRING },
      },
      required: ["security", "performance", "ux", "codeQuality", "global", "globalRiskLabel"],
    },
    details: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          testName: { type: Type.STRING },
          category: { type: Type.STRING },
          expected: { type: Type.STRING },
          actual: { type: Type.STRING },
          status: { type: Type.STRING },
          suggestion: { type: Type.STRING },
          technicalDetail: { type: Type.STRING },
        },
        required: ["testName", "category", "expected", "actual", "status", "suggestion"],
      },
    },
    patterns: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          severity: { type: Type.STRING },
        },
        required: ["title", "description", "severity"],
      },
    },
  },
  required: ["summary", "scores", "details", "patterns"],
};

// Robust helper to find the API key in various environments (Vite, CRA, Next.js, Node)
const getApiKey = (): string | undefined => {
  // 1. Try Vite / Modern Browsers (import.meta.env)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    if (import.meta.env.VITE_API_KEY) return import.meta.env.VITE_API_KEY;
    // @ts-ignore
    if (import.meta.env.NEXT_PUBLIC_API_KEY) return import.meta.env.NEXT_PUBLIC_API_KEY;
    // @ts-ignore
    if (import.meta.env.API_KEY) return import.meta.env.API_KEY;
  }

  // 2. Try Standard process.env (Node, Webpack, CRA)
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.API_KEY) return process.env.API_KEY;
    if (process.env.REACT_APP_API_KEY) return process.env.REACT_APP_API_KEY;
    if (process.env.NEXT_PUBLIC_API_KEY) return process.env.NEXT_PUBLIC_API_KEY;
  }

  return undefined;
};

export const generateTestReport = async (
  url: string,
  description: string,
  username?: string,
  password?: string
): Promise<TestReport> => {
  
  const apiKey = getApiKey();

  if (!apiKey) {
    console.error("API Key missing. Checked process.env.API_KEY, VITE_API_KEY, REACT_APP_API_KEY.");
    throw new Error("API Key not found. Please add VITE_API_KEY to Environment Variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Determine mode based on presence of credentials
  const hasCredentials = username && password && username.trim() !== "" && password.trim() !== "";
  const mode = hasCredentials ? "AUTHENTICATED_APP" : "PUBLIC_WEBSITE";

  let specificInstructions = "";

  if (mode === "AUTHENTICATED_APP") {
    specificInstructions = `
      MOD: YETKİLENDİRİLMİŞ UYGULAMA (Giriş Yapılmış)
      - Kullanıcı Adı: ${username}
      - Şifre: ${password} (Bu bilgileri kullanarak giriş yapıldığını simüle et)
      
      ODAK NOKTALARI:
      1. Authentication: Login formunda SQL Injection, Brute force koruması, Session yönetimi.
      2. Authorization (RBAC): Admin sayfalarına erişim denemesi, IDOR (Başkasının verisine erişim).
      3. CRUD: Veri ekleme, silme, güncelleme işlemlerinde validation ve XSS.
      4. Güvenlik: CSRF token kontrolü, Secure Cookie flagleri.
    `;
  } else {
    specificInstructions = `
      MOD: HALKA AÇIK WEB SİTESİ (Giriş Bilgisi Yok)
      - Sistem giriş bilgisi VERİLMEDİ. Bu yüzden Login, Admin Paneli veya CRUD işlemleri (Ekle/Sil) TEST EDİLEMEZ.
      - Sadece dışarıdan görünen Public yüzü analiz et.
      
      ODAK NOKTALARI (Buna çok dikkat et):
      1. SEO & Metadata: Title, Description, H1 hiyerarşisi, Open Graph etiketleri, Sitemap.xml, Robots.txt varlığı.
      2. Performans (Core Web Vitals): LCP, CLS, Görsel optimizasyonu (WebP), Lazy load, Gereksiz JS.
      3. Public Güvenlik: SSL/TLS geçerliliği, Security Headerları (CSP, X-Frame), Public formlarda (iletişim) spam koruması/Captcha.
      4. UI/UX: Mobil uyumluluk, 404 sayfası kalitesi, Kırık link kontrolü, Renk kontrastı.
      5. Public Formlar: Eğer sitede arama veya bülten aboneliği varsa bunları test et (XSS için).
      
      YASAK: "Kullanıcı girişi başarısız", "Admin paneline girilemedi" gibi hatalar verme. Zaten şifre yok.
    `;
  }

  const prompt = `
    Sen Kıdemli bir QA Otomasyon Mühendisi ve SEO Uzmanısın.
    
    GÖREV: Aşağıdaki hedef web uygulaması için seçilen modda DETAYLI bir denetim simülasyonu gerçekleştir.
    
    Hedef URL: ${url}
    Bağlam/Açıklama: ${description}
    
    ${specificInstructions}

    TALİMATLAR:
    Aşağıdaki kategorilerin HER BİRİ için EN AZ 6-8 adet test senaryosu üret.

    KATEGORİLER (İsimler Birebir Aynı Olmalı):
    1. "Kimlik Doğrulama" (Public modda sadece SSL ve Security Headers, Auth modda Login/Session)
    2. "CRUD İşlemleri" (Public modda Form/Arama, Auth modda Veri Yönetimi)
    3. "UI / UX" (Mobil, Erişilebilirlik, SEO uyumlu tasarım)
    4. "Performans" (Hız, SEO teknik metrikleri, Core Web Vitals)
    5. "Güvenlik" (Genel güvenlik duruşu)

    ÖNEMLİ KURALLAR:
    - BÜTÜN ÇIKTILAR TÜRKÇE OLMALIDIR.
    - Testlerin yaklaşık %30-40'ını "FAIL" (Hata) veya "WARNING" (Uyarı) olarak işaretle. Gerçekçi ol.
    - Her başarısız test için, "suggestion" alanında net bir çözüm önerisi sun.

    Sonucu kesinlikle aşağıdaki JSON şemasına uygun döndür.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema,
        temperature: 0.5,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as TestReport;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error; // Re-throw to be caught in App.tsx for the Vercel error message
  }
};