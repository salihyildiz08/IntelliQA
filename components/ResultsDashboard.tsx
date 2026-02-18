import React, { useState } from 'react';
import { TestReport, DetailedTestResult, ResultStatus, Category } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { AlertOctagon, CheckCircle, AlertTriangle, Search, Activity, Lock, Smartphone, Database, ChevronDown, ChevronUp, Printer, FileText, ClipboardList } from 'lucide-react';

interface ResultsDashboardProps {
  report: TestReport;
  onReset: () => void;
}

const STATUS_COLORS = {
  [ResultStatus.PASS]: '#22c55e',
  [ResultStatus.FAIL]: '#ef4444',
  [ResultStatus.WARNING]: '#eab308',
  [ResultStatus.CRITICAL]: '#b91c1c',
};

// Use the exact enum values from types.ts which are now Turkish strings
const CATEGORY_ICONS = {
  [Category.AUTH]: Lock,
  [Category.CRUD]: Database,
  [Category.UIUX]: Smartphone,
  [Category.PERFORMANCE]: Activity,
  [Category.SECURITY]: AlertOctagon,
};

const ScoreCard = ({ title, score }: { title: string, score: number }) => {
  let colorClass = "text-green-400";
  if (score < 50) colorClass = "text-red-400";
  else if (score < 75) colorClass = "text-yellow-400";

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col items-center justify-center print:border-slate-300 print:bg-white print:text-black">
      <span className="text-slate-400 text-xs uppercase tracking-wider mb-1 print:text-slate-600">{title}</span>
      <div className={`text-2xl font-bold font-mono ${colorClass} print:text-black`}>{score}/100</div>
    </div>
  );
};

const DetailRow: React.FC<{ detail: DetailedTestResult }> = ({ detail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isCritical = detail.status === ResultStatus.CRITICAL || detail.status === ResultStatus.FAIL;

  return (
    <div className={`border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors ${isCritical ? 'bg-red-950/10' : ''} print:bg-white print:border-slate-200 print:break-inside-avoid`}>
      <div 
        className="flex items-center gap-4 p-4 cursor-pointer print:cursor-default"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-shrink-0">
          {detail.status === ResultStatus.PASS && <CheckCircle className="text-green-500" size={20} />}
          {detail.status === ResultStatus.WARNING && <AlertTriangle className="text-yellow-500" size={20} />}
          {(detail.status === ResultStatus.FAIL || detail.status === ResultStatus.CRITICAL) && <AlertOctagon className="text-red-500" size={20} />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-slate-200 text-sm truncate print:text-black print:whitespace-normal">{detail.testName}</h4>
            {detail.status === ResultStatus.CRITICAL && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 font-bold border border-red-500/30 print:border-red-600 print:text-red-600 print:bg-transparent">
                KRİTİK
              </span>
            )}
          </div>
          <p className="text-slate-500 text-xs mt-0.5 truncate print:text-slate-700 print:whitespace-normal">{detail.actual}</p>
        </div>

        <div className="flex-shrink-0 text-slate-600 no-print">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} print:block px-4 pb-4 pl-12`}>
        <div className="bg-slate-900/50 rounded p-3 text-xs space-y-2 border border-slate-700 print:bg-slate-50 print:border-slate-200 print:text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 block mb-1 print:text-slate-600">Beklenen Davranış</span>
                <p className="text-slate-300 font-mono bg-slate-800 p-1.5 rounded print:bg-white print:border print:border-slate-200 print:text-black">{detail.expected}</p>
              </div>
              <div>
                <span className="text-slate-500 block mb-1 print:text-slate-600">Gerçekleşen</span>
                <p className={`${isCritical ? 'text-red-300 print:text-red-700' : 'text-slate-300 print:text-black'} font-mono bg-slate-800 p-1.5 rounded print:bg-white print:border print:border-slate-200`}>{detail.actual}</p>
              </div>
            </div>
            
            {detail.suggestion && (
              <div className="mt-2 pt-2 border-t border-slate-700 print:border-slate-300">
                <span className="text-cyan-400 block mb-1 font-semibold flex items-center gap-1 print:text-cyan-700">
                  <Activity size={12} /> Yapay Zeka Önerisi
                </span>
                <p className="text-slate-300 print:text-black">{detail.suggestion}</p>
              </div>
            )}

            {detail.technicalDetail && (
              <div className="mt-2">
                <span className="text-slate-500 block mb-1 print:text-slate-600">Teknik Detay</span>
                <p className="text-slate-400 italic print:text-slate-700">{detail.technicalDetail}</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

const TextReportView: React.FC<{ report: TestReport }> = ({ report }) => {
  const criticalIssues = report.details.filter(d => d.status === ResultStatus.CRITICAL || d.status === ResultStatus.FAIL);
  
  return (
    <div className="bg-slate-900 text-slate-300 p-8 rounded-lg shadow-lg font-serif leading-relaxed max-w-4xl mx-auto border border-slate-800 print:bg-white print:text-black print:border-slate-200 print:shadow-none">
      <div className="border-b-2 border-slate-700 pb-4 mb-6 flex justify-between items-end print:border-black">
        <div>
           <h1 className="text-3xl font-bold uppercase tracking-wide text-slate-100 print:text-black">Sonuç Değerlendirme Raporu</h1>
           <p className="text-sm text-slate-400 mt-1 print:text-gray-600">IntelliQA Otomatik Denetim Sistemi</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-slate-200 print:text-black">Tarih</div>
          <div>{new Date().toLocaleDateString('tr-TR')}</div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold border-b border-slate-700 mb-3 pb-1 text-slate-100 print:text-black print:border-gray-300">1. YÖNETİCİ ÖZETİ</h2>
        <p className="mb-4">
          Bu rapor, hedef sistem üzerinde yapılan kapsamlı güvenlik, performans ve kullanılabilirlik testlerinin sonucunda oluşturulmuştur.
          Sistem genel skoru <strong className="text-slate-100 print:text-black">100 üzerinden {report.scores.global}</strong> olarak hesaplanmıştır. 
          Genel risk seviyesi: <strong className="text-slate-100 print:text-black">{report.scores.globalRiskLabel.toUpperCase()}</strong>.
        </p>
        
        <div className="bg-slate-800 p-4 rounded mb-4 print:bg-gray-100">
           <h3 className="font-bold text-sm mb-2 uppercase text-slate-200 print:text-black">Tespit Edilen Ana Desenler</h3>
           <ul className="list-disc pl-5 space-y-1">
             {report.patterns.map((p, i) => (
               <li key={i}>
                 <strong className="text-cyan-400 print:text-black">{p.title}:</strong> {p.description} ({p.severity})
               </li>
             ))}
           </ul>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold border-b border-slate-700 mb-3 pb-1 text-slate-100 print:text-black print:border-gray-300">2. KRİTİK BULGULAR VE RİSKLER</h2>
        {criticalIssues.length === 0 ? (
           <p className="text-green-400 print:text-green-700">Kritik veya yüksek öncelikli bir hata tespit edilmemiştir.</p>
        ) : (
          <div className="space-y-4">
            {criticalIssues.map((issue, i) => (
              <div key={i} className="border-l-4 border-red-500 pl-4 py-1 print:border-red-600">
                <h4 className="font-bold text-red-400 print:text-red-700">{issue.testName}</h4>
                <p className="text-sm text-slate-300 print:text-gray-800"><strong>Bulgu:</strong> {issue.actual}</p>
                <p className="text-sm text-slate-400 mt-1 print:text-gray-800"><strong>Teknik Etki:</strong> {issue.technicalDetail || 'Belirtilmemiş'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold border-b border-slate-700 mb-3 pb-1 text-slate-100 print:text-black print:border-gray-300">3. İYİLEŞTİRME ÖNERİLERİ VE AKSİYON PLANI</h2>
        <p className="mb-4">Aşağıdaki tabloda, tespit edilen sorunlar için yapay zeka tarafından üretilen çözüm önerileri listelenmiştir.</p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-800 print:bg-gray-200">
                <th className="p-2 border border-slate-700 print:border-gray-300 text-slate-200 print:text-black">Kategori</th>
                <th className="p-2 border border-slate-700 print:border-gray-300 text-slate-200 print:text-black">Sorun</th>
                <th className="p-2 border border-slate-700 print:border-gray-300 text-slate-200 print:text-black">Önerilen Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {report.details.filter(d => d.status !== ResultStatus.PASS).map((d, i) => (
                <tr key={i} className="even:bg-slate-800/30 print:even:bg-gray-50">
                  <td className="p-2 border border-slate-700 print:border-gray-300 font-bold whitespace-nowrap text-slate-300 print:text-black">{d.category}</td>
                  <td className="p-2 border border-slate-700 print:border-gray-300 text-slate-300 print:text-black">{d.testName}</td>
                  <td className="p-2 border border-slate-700 print:border-gray-300 text-cyan-400 print:text-blue-800">{d.suggestion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="text-xs text-slate-500 mt-12 text-center border-t border-slate-800 pt-4 print:border-gray-300 print:text-gray-500">
         Bu rapor IntelliQA yapay zeka motoru tarafından otomatik olarak oluşturulmuştur.
      </div>
    </div>
  );
};

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ report, onReset }) => {
  const [activeTab, setActiveTab] = useState<string>('ALL');

  const chartData = [
    { name: 'Başarılı', value: report.summary.passed },
    { name: 'Hatalı', value: report.summary.failed },
    { name: 'Riskli', value: report.summary.risky },
    { name: 'Kritik', value: report.summary.critical },
  ].filter(d => d.value > 0);

  const filteredDetails = activeTab === 'ALL' || activeTab === 'REPORT'
    ? report.details 
    : report.details.filter(d => d.category === activeTab);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 print:max-w-full print:p-0 print:animate-none">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center border-b border-slate-800 pb-6 print:border-b-2 print:border-slate-300">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 mb-2 print:text-black">Denetim Raporu</h2>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border print:border-2 ${
               report.scores.global > 80 ? 'bg-green-500/10 border-green-500/50 text-green-400 print:text-green-700 print:border-green-700' :
               report.scores.global > 50 ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400 print:text-yellow-700 print:border-yellow-700' :
               'bg-red-500/10 border-red-500/50 text-red-400 print:text-red-700 print:border-red-700'
            }`}>
              {report.scores.globalRiskLabel}
            </span>
            <span className="text-slate-400 text-sm print:text-slate-600">
              {report.summary.totalTests} test koşuldu • {new Date().toLocaleDateString('tr-TR')}
            </span>
          </div>
        </div>
        <div className="flex flex-row items-center gap-6">
          <button 
            onClick={handlePrint}
            className="no-print flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors"
          >
            <Printer size={18} />
            Raporu Yazdır (PDF)
          </button>
          
          <div className="text-right">
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 print:text-black print:bg-none">
              {report.scores.global}
            </div>
            <div className="text-slate-500 text-sm font-medium uppercase tracking-widest mt-1 print:text-slate-600">Genel Puan</div>
          </div>
        </div>
      </div>

      {activeTab === 'REPORT' ? (
        <div className="space-y-6">
           <div className="flex justify-start no-print">
             <button 
               onClick={() => setActiveTab('ALL')} 
               className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 text-sm"
             >
               &larr; İnteraktif Görünüme Dön
             </button>
           </div>
           <TextReportView report={report} />
        </div>
      ) : (
        /* Grid Layout for Interactive Dashboard */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-1 print:gap-4">
          
          {/* Left Col: Scores & Patterns */}
          <div className="space-y-6 print:space-y-4">
            {/* Detailed Scores */}
            <div className="grid grid-cols-2 gap-3">
              <ScoreCard title="Güvenlik" score={report.scores.security} />
              <ScoreCard title="Performans" score={report.scores.performance} />
              <ScoreCard title="UX / UI" score={report.scores.ux} />
              <ScoreCard title="Kod Kalitesi" score={report.scores.codeQuality} />
            </div>

            {/* Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm min-h-[250px] flex flex-col print:hidden">
              <h3 className="text-slate-300 font-semibold mb-4 text-sm print:text-black">Test Dağılımı</h3>
              <div className="flex-1 w-full h-full min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => {
                        let color = STATUS_COLORS[ResultStatus.PASS];
                        if (entry.name === 'Hatalı') color = STATUS_COLORS[ResultStatus.FAIL];
                        if (entry.name === 'Riskli') color = STATUS_COLORS[ResultStatus.WARNING];
                        if (entry.name === 'Kritik') color = STATUS_COLORS[ResultStatus.CRITICAL];
                        return <Cell key={`cell-${index}`} fill={color} stroke="none" />;
                      })}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 text-xs text-slate-400 mt-2 print:text-black">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div>Başarılı</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div>Hatalı</div>
              </div>
            </div>

            {/* Pattern Analysis */}
            {report.patterns.length > 0 && (
              <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-xl p-6 print:bg-white print:border-slate-300 print:break-inside-avoid">
                <h3 className="text-indigo-300 font-semibold mb-4 flex items-center gap-2 print:text-indigo-700">
                  <Search size={16} /> Akıllı Desen Analizi
                </h3>
                <div className="space-y-4">
                  {report.patterns.map((pattern, idx) => (
                    <div key={idx} className="bg-slate-900/40 p-3 rounded border border-indigo-500/10 print:bg-slate-50 print:border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-200 text-sm print:text-black">{pattern.title}</span>
                        <span className={`text-[10px] font-bold px-1.5 rounded ${
                          pattern.severity === 'HIGH' ? 'bg-red-500/20 text-red-300 print:text-red-700 print:bg-red-100' : 'bg-blue-500/20 text-blue-300 print:text-blue-700 print:bg-blue-100'
                        }`}>
                          {pattern.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed print:text-slate-700">{pattern.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Col: Detailed Breakdown */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-xl print:bg-white print:border-none print:shadow-none">
            <div className="border-b border-slate-800 bg-slate-950/50 p-2 flex overflow-x-auto no-scrollbar no-print items-center">
              {['ALL', ...Object.values(Category)].map((tab) => {
                const Icon = CATEGORY_ICONS[tab as Category];
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                      ${isActive 
                        ? 'bg-slate-800 text-cyan-400 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }
                    `}
                  >
                    {Icon && <Icon size={14} />}
                    {tab === 'ALL' ? 'Tüm Testler' : tab}
                  </button>
                );
              })}
              
              <div className="h-6 w-px bg-slate-700 mx-2"></div>

              <button
                onClick={() => setActiveTab('REPORT')}
                className={`
                   flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                   ${activeTab === 'REPORT'
                     ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-500/30'
                     : 'text-indigo-400 hover:bg-indigo-900/20'
                   }
                `}
              >
                <FileText size={14} />
                Detaylı Rapor
              </button>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[800px] scroll-smooth print:overflow-visible print:max-h-none">
              {filteredDetails.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <p>Bu kategori için test bulunamadı.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800 print:divide-slate-200">
                  {filteredDetails.map((detail, idx) => (
                    <DetailRow key={idx} detail={detail} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="text-center pt-8 no-print">
        <button 
          onClick={onReset}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors border border-slate-700"
        >
          Yeni Denetim Başlat
        </button>
      </div>
    </div>
  );
};

export default ResultsDashboard;