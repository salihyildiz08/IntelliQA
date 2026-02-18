import React, { useState } from 'react';
import { Shield, PlayCircle, Globe, Server, Lock, User, Info } from 'lucide-react';

interface HeroProps {
  onStart: (url: string, description: string, username?: string, password?: string) => void;
  isLoading: boolean;
}

const Hero: React.FC<HeroProps> = ({ onStart, isLoading }) => {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && description) {
      onStart(url, description, username, password);
    }
  };

  const isPublicMode = !username && !password;

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="text-center max-w-3xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400 mb-6 shadow-sm">
          <Shield size={14} className="text-cyan-500" />
          <span className="text-xs font-semibold tracking-wide uppercase">AI Powered Security & SEO Audit</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
          Web Varlıklarınızı <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Akıllı Analiz Edin
          </span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Salih Yıldız IntelliQA ile web sitenizin güvenlik açıklarını, SEO eksiklerini ve performans darboğazlarını saniyeler içinde tespit edin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 z-10">
        <div className="space-y-6">
          
          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Hedef URL</label>
            <div className="relative group">
              <Globe className="absolute left-4 top-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
              <input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono text-sm"
                required
              />
            </div>
          </div>

          {/* Context Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Proje Açıklaması</label>
            <div className="relative group">
              <Server className="absolute left-4 top-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
              <textarea
                placeholder="Örn: E-ticaret sitesi, Blog, Kurumsal tanıtım sayfası..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                rows={2}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all resize-none text-sm"
                required
              />
            </div>
          </div>

          {/* Credentials Section */}
          <div className="p-5 bg-slate-950/30 rounded-xl border border-slate-800/50">
             <div className="flex items-center gap-2 mb-4">
                <Lock size={14} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kimlik Bilgileri (Opsiyonel)</span>
                <div className="ml-auto group relative">
                   <Info size={14} className="text-slate-600 cursor-help" />
                   <div className="absolute right-0 bottom-full mb-2 w-64 bg-slate-800 text-slate-300 text-xs p-2 rounded shadow-xl hidden group-hover:block border border-slate-700">
                     Giriş bilgileri girilmezse sistem "Public Web Sitesi" modunda çalışır (SEO, Meta, Performans). Girilirse "Admin/User" modunda CRUD ve Yetki testi yapar.
                   </div>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group">
                  <User className="absolute left-3 top-3.5 text-slate-600 group-focus-within:text-cyan-500 transition-colors" size={16} />
                  <input
                    type="text"
                    placeholder="Kullanıcı Adı / Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3.5 text-slate-600 group-focus-within:text-cyan-500 transition-colors" size={16} />
                  <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm"
                  />
                </div>
             </div>
          </div>

          <button
            type="submit"
            disabled={!url || !description || isLoading}
            className={`
              w-full font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-2
              ${isPublicMode 
                 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/20' 
                 : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white shadow-cyan-900/20'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isLoading ? (
               <>
                 <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                 Analiz Başlatılıyor...
               </>
            ) : (
               <>
                 <PlayCircle size={20} />
                 {isPublicMode ? 'Public / SEO Taraması Başlat' : 'Yetkili / CRUD Testi Başlat'}
               </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Hero;