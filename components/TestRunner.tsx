import React, { useEffect, useState, useRef } from 'react';
import { TestLog, Category, ResultStatus } from '../types';
import { Terminal, CheckCircle2, XCircle, AlertTriangle, ShieldAlert, SkipForward } from 'lucide-react';

interface TestRunnerProps {
  onComplete: () => void;
  isRunning: boolean;
  mode: 'PUBLIC' | 'AUTH';
}

const AUTH_LOGS: Partial<TestLog>[] = [
  { message: "Hedef sistem parmak izi alınıyor...", category: Category.SECURITY },
  { message: "Port taraması başlatıldı (80, 443, 8080)...", category: Category.SECURITY },
  { message: "Login formunda SQL Injection payloadları deneniyor: ' OR '1'='1", category: Category.AUTH },
  { message: "NoSQL Injection payloadları deneniyor: { $ne: null }", category: Category.AUTH },
  { message: "Session çerezlerinde HttpOnly ve Secure flag kontrolü", category: Category.AUTH },
  { message: "Brute-force koruması test ediliyor (Rate Limit)", category: Category.AUTH },
  { message: "JWT Token imza bütünlüğü doğrulanıyor (HS256 -> None)", category: Category.AUTH },
  { message: "Kullanıcı kayıt formunda e-posta validasyonu kontrolü", category: Category.CRUD },
  { message: "XSS vektörleri input alanlarına enjekte ediliyor <script>alert(1)</script>", category: Category.SECURITY },
  { message: "CSRF token mekanizması POST isteklerinde aranıyor", category: Category.SECURITY },
  { message: "IDOR testi: /users/123 -> /users/124 erişimi deneniyor", category: Category.CRUD },
  { message: "HTTP Metotları (PUT, DELETE, PATCH) izinleri kontrol ediliyor", category: Category.CRUD },
  { message: "Yönetim paneli dizinleri (/admin, /dashboard) taranıyor", category: Category.AUTH },
  { message: "Dosya yükleme alanlarında zararlı dosya (RCE) testi", category: Category.SECURITY },
  { message: "API endpointlerinde yetki yükseltme (Privilege Escalation) testi", category: Category.SECURITY },
];

const PUBLIC_LOGS: Partial<TestLog>[] = [
  { message: "KİMLİK BİLGİSİ YOK - Login Testleri Atlanıyor...", category: Category.AUTH, status: ResultStatus.WARNING },
  { message: "DNS kayıtları ve sunucu yanıt süreleri ölçülüyor...", category: Category.PERFORMANCE },
  { message: "SSL/TLS sertifika zinciri ve geçerlilik tarihi kontrol ediliyor", category: Category.SECURITY },
  { message: "Robots.txt dosyası okunuyor ve Sitemap.xml taranıyor", category: Category.UIUX },
  { message: "Meta etiketleri (Title, Description, OG Tags) analiz ediliyor", category: Category.UIUX },
  { message: "H1, H2, H3 başlık hiyerarşisi SEO uyumluluğu kontrolü", category: Category.UIUX },
  { message: "Admin Paneli Erişimi: ATLANDI (Yetkisiz Tarama)", category: Category.SECURITY, status: ResultStatus.WARNING },
  { message: "Core Web Vitals (LCP, CLS, FID) metrikleri hesaplanıyor", category: Category.PERFORMANCE },
  { message: "Görsel optimizasyonu (WebP, sıkıştırma) kontrol ediliyor", category: Category.PERFORMANCE },
  { message: "Mobil uyumluluk (Viewport) ve responsive tasarım testi", category: Category.UIUX },
  { message: "Gereksiz JavaScript ve CSS yükleri (Unused Code) tespiti", category: Category.PERFORMANCE },
  { message: "Kırık linkler (404) ve yönlendirme zincirleri taranıyor", category: Category.UIUX },
  { message: "Public formlarda (İletişim, Bülten) Spam/Captcha kontrolü", category: Category.SECURITY },
  { message: "Security Headers: X-Frame-Options, CSP, HSTS varlığı", category: Category.SECURITY },
  { message: "URL yapısı ve Query parametrelerinde XSS açığı taraması", category: Category.SECURITY },
  { message: "Tarayıcı önbellekleme (Browser Caching) politikaları inceleniyor", category: Category.PERFORMANCE },
  { message: "Erişilebilirlik (ARIA etiketleri, Alt text) analizi", category: Category.UIUX },
];

const TestRunner: React.FC<TestRunnerProps> = ({ onComplete, isRunning, mode }) => {
  const [logs, setLogs] = useState<TestLog[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isRunning) return;

    setLogs([]);
    let index = 0;
    const activeLogs = mode === 'AUTH' ? AUTH_LOGS : PUBLIC_LOGS;

    // Faster interval to show more logs in reasonable time
    const interval = setInterval(() => {
      if (index >= activeLogs.length) {
        clearInterval(interval);
        setTimeout(onComplete, 1500); // Wait a bit after logs finish
        return;
      }

      const rawLog = activeLogs[index];
      let randomStatus = Math.random() > 0.85 ? ResultStatus.WARNING : ResultStatus.PASS;
      
      // Preserve explicit status if defined in logs
      if (rawLog.status) {
        randomStatus = rawLog.status;
      }

      const newLog: TestLog = {
        id: Math.random().toString(36).substr(2, 9),
        message: rawLog.message || "",
        category: rawLog.category || Category.AUTH,
        timestamp: new Date().toLocaleTimeString(),
        status: randomStatus
      };

      setLogs(prev => [...prev, newLog]);
      index++;
    }, 400); // 400ms per log

    return () => clearInterval(interval);
  }, [isRunning, onComplete, mode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (!isRunning && logs.length === 0) return null;

  return (
    <div className="w-full bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-2xl flex flex-col h-[500px] print:hidden">
      <div className="bg-slate-950 p-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-cyan-400" />
          <span className="text-sm font-mono text-slate-300">
            IntelliQA Terminal_ v2.5.0 ({mode === 'AUTH' ? 'Deep Auth Scan' : 'Public SEO/Perf Scan'})
          </span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-2 relative">
        {/* Scan line effect */}
        {isRunning && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-[100px] w-full animate-scan opacity-20"></div>
        )}

        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-slate-500 text-xs mt-1 min-w-[60px]">{log.timestamp}</span>
            <div className="mt-1">
              {log.status === ResultStatus.PASS && <CheckCircle2 size={14} className="text-green-500" />}
              {log.status === ResultStatus.WARNING && <SkipForward size={14} className="text-yellow-500" />}
              {log.status === ResultStatus.FAIL && <XCircle size={14} className="text-red-500" />}
            </div>
            <div className="flex-1">
              <span className={`
                ${log.category === Category.AUTH ? 'text-purple-400' : ''}
                ${log.category === Category.CRUD ? 'text-blue-400' : ''}
                ${log.category === Category.SECURITY ? 'text-red-400' : ''}
                ${log.category === Category.UIUX ? 'text-pink-400' : ''}
                ${log.category === Category.PERFORMANCE ? 'text-orange-400' : ''}
                text-xs font-bold uppercase tracking-wider mr-2
              `}>
                [{log.category}]
              </span>
              <span className="text-slate-300">{log.message}</span>
            </div>
          </div>
        ))}
        {isRunning && (
           <div className="flex items-center gap-2 text-cyan-500 animate-pulse mt-4 border-t border-slate-800 pt-2">
             <span className="w-2 h-4 bg-cyan-500 block"></span>
             <span>{mode === 'AUTH' ? 'Yetkili erişim testleri sürüyor...' : 'SEO ve Public güvenlik taraması yapılıyor...'}</span>
           </div>
        )}
      </div>
    </div>
  );
};

export default TestRunner;