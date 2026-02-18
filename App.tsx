import React, { useState, useEffect } from 'react';
import { TestStatus, TestReport } from './types';
import Hero from './components/Hero';
import TestRunner from './components/TestRunner';
import ResultsDashboard from './components/ResultsDashboard';
import { generateTestReport } from './services/geminiService';
import { AlertOctagon } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<TestStatus>(TestStatus.IDLE);
  const [report, setReport] = useState<TestReport | null>(null);
  const [targetInfo, setTargetInfo] = useState<{ url: string; description: string; hasCredentials: boolean } | null>(null);

  const startAudit = async (url: string, description: string, username?: string, password?: string) => {
    setStatus(TestStatus.RUNNING);
    const hasCredentials = !!(username && password && username.trim() !== '' && password.trim() !== '');
    setTargetInfo({ url, description, hasCredentials });
    
    // We start the visual runner immediately, but we also kick off the AI request in background
    try {
      const result = await generateTestReport(url, description, username, password);
      setReport(result);
    } catch (e) {
      console.error(e);
      setStatus(TestStatus.ERROR);
    }
  };

  const handleVisualsComplete = () => {
    // When visual terminal finishes animation, we check if we have data
    if (report) {
       setStatus(TestStatus.COMPLETE);
    } else {
       // If AI is taking longer than the visual simulation, we wait (state remains RUNNING/ANALYZING)
       setStatus(TestStatus.ANALYZING);
    }
  };

  // Effect to watch for when both AI is done AND visuals are done (if in ANALYZING state)
  useEffect(() => {
    if (status === TestStatus.ANALYZING && report) {
      // Add a small delay for "Processing" effect
      setTimeout(() => {
        setStatus(TestStatus.COMPLETE);
      }, 1000);
    }
  }, [status, report]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 print:bg-white print:text-black">
      {/* Navbar */}
      <nav className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold font-mono shadow-lg shadow-cyan-500/20">
                 S
               </div>
               <span className="font-bold text-xl tracking-tight text-white">Salih Yıldız <span className="text-slate-500 font-light">IntelliQA</span></span>
             </div>
             <div className="flex items-center gap-6">
                
             </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:py-0 print:px-0 print:w-full print:max-w-full">
        {status === TestStatus.IDLE && (
          <Hero onStart={startAudit} isLoading={false} />
        )}

        {(status === TestStatus.RUNNING || status === TestStatus.ANALYZING) && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
             <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-100">
                  {status === TestStatus.RUNNING ? 'Test Senaryoları Yürütülüyor...' : 'Sonuçlar Analiz Ediliyor...'}
                </h2>
                <p className="text-slate-400">Hedef: <span className="text-cyan-400 font-mono">{targetInfo?.url}</span></p>
             </div>
             
             <TestRunner 
               isRunning={status === TestStatus.RUNNING} 
               onComplete={handleVisualsComplete}
               mode={targetInfo?.hasCredentials ? 'AUTH' : 'PUBLIC'}
             />

             {status === TestStatus.ANALYZING && (
               <div className="flex justify-center py-8">
                 <div className="flex items-center gap-3 text-cyan-400 animate-pulse">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animation-delay-200"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animation-delay-400"></div>
                    <span className="ml-2 font-mono text-sm">Yapay Zeka Raporu Oluşturuluyor...</span>
                 </div>
               </div>
             )}
          </div>
        )}

        {status === TestStatus.COMPLETE && report && (
          <ResultsDashboard report={report} onReset={() => {
            setStatus(TestStatus.IDLE);
            setReport(null);
            setTargetInfo(null);
          }} />
        )}

        {status === TestStatus.ERROR && (
           <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 text-red-500 mb-6 border border-red-500/30">
               <AlertOctagon size={32} />
             </div>
             <h2 className="text-white text-2xl font-bold mb-4">Analiz Başlatılamadı</h2>
             <div className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed bg-slate-900/50 p-6 rounded-lg border border-slate-800 text-left">
               <p className="mb-4 text-red-400 font-semibold">API Anahtarı Bulunamadı veya Hatalı.</p>
               <p className="mb-2 text-sm">Vercel üzerinde çalışıyorsanız aşağıdaki adımları kontrol edin:</p>
               <ol className="list-decimal pl-5 text-sm space-y-2 text-slate-300">
                 <li>Vercel panelinde <strong>Settings {'>'} Environment Variables</strong> kısmına gidin.</li>
                 <li>Değişken adının <strong><code className="text-cyan-400">VITE_API_KEY</code></strong> olduğundan emin olun. (Sadece API_KEY çalışmayabilir).</li>
                 <li>Değişiklik yaptıktan sonra Deployments sekmesinden projeyi <strong>Redeploy</strong> yapmayı unutmayın.</li>
               </ol>
             </div>
             <button 
                onClick={() => setStatus(TestStatus.IDLE)}
                className="px-8 py-3 bg-white text-slate-950 font-bold rounded-lg hover:bg-slate-200 transition-colors shadow-lg"
             >
               Tekrar Dene
             </button>
           </div>
        )}
      </main>
    </div>
  );
};

export default App;