# 🕵️‍♂️ IntelliQA - AI Powered Test Assistant

IntelliQA, web uygulamalarını **Güvenlik**, **Performans**, **SEO** ve **UX** açısından analiz eden, Google Gemini AI tabanlı yeni nesil bir otonom test asistanıdır.

Sadece bir URL vererek hedef sistemin röntgenini çekebilir, yetkili (login) veya yetkisiz (public) modda derinlemesine analizler gerçekleştirebilirsiniz.

![IntelliQA Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop)

## 🚀 Özellikler

-   **🤖 Çift Modlu Analiz:**
    -   **Public Mod:** Siteye dışarıdan bir ziyaretçi gibi bakar. SEO, Meta tagler, SSL sertifikası, Public form güvenliği ve Core Web Vitals performansını ölçer.
    -   **Auth (Yetkili) Mod:** Kullanıcı adı ve şifre simülasyonu ile giriş yapar. Session yönetimi, CRUD işlemleri, IDOR, SQL Injection ve XSS açıklarını test eder.
-   **⚡ Gerçek Zamanlı Terminal:** Test adımlarını, siber güvenlik saldırı simülasyonlarını (Pentest) ve performans ölçümlerini canlı terminal ekranında gösterir.
-   **📊 Akıllı Raporlama:**
    -   100 üzerinden puanlama sistemi (Güvenlik, UX, Kod Kalitesi).
    -   Kritik, Riskli ve Başarılı testlerin grafiksel dağılımı.
    -   Yapay zeka destekli, uygulanabilir çözüm önerileri ("Aksiyon Planı").
-   **🖨️ PDF Çıktısı:** Raporları yönetici özeti formatında yazıcı dostu (printer-friendly) olarak dışa aktarma.

## 🛠️ Kurulum ve Çalıştırma

Bu proje modern React ve TypeScript kullanılarak geliştirilmiştir.

### Ön Hazırlık

1.  **Google Gemini API Anahtarı Alın:**
    [Google AI Studio](https://aistudio.google.com/) adresinden ücretsiz bir API anahtarı edinin.

### Vercel Üzerinde Kurulum (Önerilen)

1.  Bu repoyu GitHub hesabınıza forklayın.
2.  Vercel'de yeni proje oluşturup bu repoyu seçin.
3.  **Environment Variables** kısmına gelin:
    -   Key: `API_KEY`
    -   Value: `Sizin_Gemini_API_Anahtarınız`
4.  Deploy tuşuna basın.

### Local (Yerel) Kurulum

Proje dosyalarını indirdikten sonra terminali açın:

```bash
# Bağımlılıkları yükleyin (Eğer package.json varsa)
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

*Not: Yerel çalışmada API anahtarınızı `.env` dosyasına `API_KEY=xyz` şeklinde eklediğinizden veya proje kodunda güvenli bir şekilde tanımladığınızdan emin olun.*

## 🧩 Mimari ve Teknolojiler

-   **Frontend:** React 19, TypeScript, Tailwind CSS
-   **AI Engine:** Google Gemini 2.5 Flash / Pro Models (`@google/genai` SDK)
-   **Görselleştirme:** Recharts, Lucide React
-   **Tasarım Dili:** Glassmorphism, Dark Mode, Cyberpunk UI

## 🧪 Test Kategorileri

Sistem aşağıdaki 5 ana kategoride denetim yapar:

1.  **Kimlik Doğrulama (Auth):** Brute-force, Session Fixation, JWT güvenliği.
2.  **CRUD İşlemleri:** Veri bütünlüğü, Input validasyonu, SQL/NoSQL Injection.
3.  **Güvenlik (Sec):** XSS, CSRF, Secure Headers, Port taraması simülasyonu.
4.  **Performans (Perf):** LCP, CLS, Asset optimizasyonu, Server yanıt süreleri.
5.  **UI / UX:** Mobil uyumluluk, Erişilebilirlik (A11y), SEO hiyerarşisi.

## ⚠️ Yasal Uyarı

Bu araç, **yetkiniz olan** sistemlerin güvenlik ve performans analizini yapmak için eğitim ve geliştirme amaçlı tasarlanmıştır. Yetkiniz olmayan sistemler üzerinde (özellikle Auth modunda) kullanmak yasal sorumluluk doğurabilir. Geliştirici, aracın kötüye kullanımından sorumlu değildir.

---

**Geliştirici:** Salih Yıldız
**Versiyon:** v2.5.0
