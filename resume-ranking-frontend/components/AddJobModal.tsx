"use client";

import { useState } from "react";
import { X, Plus, Sparkles, Target, Briefcase, Image } from "lucide-react";

interface AddJobModalProps {
  onClose: () => void;
  onAdd: (job: any) => void;
}

export default function AddJobModal({ onClose, onAdd }: AddJobModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    is_benchmark: true,
    vacancies: 0,
    skills: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      logoFile,
      bannerFile
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-border/50 p-8 lg:p-12 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 rounded-xl hover:bg-secondary transition-all"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-6">
            <Sparkles className="w-3 h-3" />
            Host Opening
          </div>
          <h2 className="text-4xl font-black tracking-tight text-foreground">Create Benchmark</h2>
          <p className="text-sm font-medium text-muted-foreground mt-2">Define your recruitment standards in minutes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Position Title</label>
            <input 
              required
              placeholder="e.g. Senior Product Designer"
              className="w-full p-4 rounded-2xl bg-secondary/30 border border-transparent focus:border-primary/20 focus:bg-white focus:ring-0 transition-all text-sm font-medium"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Company / Team</label>
            <input 
              required
              placeholder="e.g. Design Systems Team"
              className="w-full p-4 rounded-2xl bg-secondary/30 border border-transparent focus:border-primary/20 focus:bg-white focus:ring-0 transition-all text-sm font-medium"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Role Description</label>
            <textarea 
              required
              placeholder="Outline the core responsibilities and skills..."
              rows={4}
              className="w-full p-4 rounded-2xl bg-secondary/30 border border-transparent focus:border-primary/20 focus:bg-white focus:ring-0 transition-all text-sm font-medium resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Required Skills (comma-separated)</label>
            <input 
              required
              placeholder="e.g. React, Node.js, TypeScript, REST APIs"
              className="w-full p-4 rounded-2xl bg-secondary/30 border border-transparent focus:border-primary/20 focus:bg-white focus:ring-0 transition-all text-sm font-medium"
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Logo</label>
              <div className="flex flex-col gap-2">
                <input 
                  type="file"
                  accept="image/*"
                  id="logo-upload"
                  className="hidden"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                />
                <div 
                  onPaste={(e) => {
                    const item = e.clipboardData.items[0];
                    if (item?.type.includes("image")) {
                      setLogoFile(item.getAsFile());
                    }
                  }}
                  className="relative group"
                >
                  <label 
                    htmlFor="logo-upload"
                    className="w-full h-32 rounded-2xl bg-secondary/30 border border-dashed border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
                  >
                    {logoFile ? (
                      <img src={URL.createObjectURL(logoFile)} alt="Logo" className="w-full h-full object-contain p-4" />
                    ) : (
                      <>
                        <Image className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary">Click or Paste Logo</span>
                      </>
                    )}
                  </label>
                  {logoFile && (
                    <button 
                      type="button"
                      onClick={(e) => { e.preventDefault(); setLogoFile(null); }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Banner</label>
              <div className="flex flex-col gap-2">
                <input 
                  type="file"
                  accept="image/*"
                  id="banner-upload"
                  className="hidden"
                  onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                />
                <div 
                  onPaste={(e) => {
                    const item = e.clipboardData.items[0];
                    if (item?.type.includes("image")) {
                      setBannerFile(item.getAsFile());
                    }
                  }}
                  className="relative group"
                >
                  <label 
                    htmlFor="banner-upload"
                    className="w-full h-32 rounded-2xl bg-secondary/30 border border-dashed border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
                  >
                    {bannerFile ? (
                      <img src={URL.createObjectURL(bannerFile)} alt="Banner" className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <>
                        <Image className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary">Click or Paste Banner</span>
                      </>
                    )}
                  </label>
                  {bannerFile && (
                    <button 
                      type="button"
                      onClick={(e) => { e.preventDefault(); setBannerFile(null); }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
             <button
               type="button"
               onClick={() => setFormData({...formData, is_benchmark: true})}
               className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${formData.is_benchmark ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-secondary/30 border-transparent text-muted-foreground'}`}
             >
                <Target className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Benchmark</span>
             </button>
             <button
               type="button"
               onClick={() => setFormData({...formData, is_benchmark: false})}
               className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${!formData.is_benchmark ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-secondary/30 border-transparent text-muted-foreground'}`}
             >
                <Briefcase className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Live Job</span>
             </button>
          </div>

          {!formData.is_benchmark && (
             <div className="space-y-2 animate-in slide-in-from-top-4 duration-500">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Number of Vacancies</label>
               <input 
                 type="number"
                 min="1"
                 placeholder="e.g. 10"
                 className="w-full p-4 rounded-2xl bg-secondary/30 border border-transparent focus:border-primary/20 focus:bg-white focus:ring-0 transition-all text-sm font-bold"
                 value={formData.vacancies === 0 ? "" : formData.vacancies}
                 onChange={(e) => setFormData({...formData, vacancies: e.target.value === "" ? 0 : parseInt(e.target.value) || 0})}
               />
             </div>
           )}

          <button 
            type="submit"
            className="w-full py-5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 mt-4"
          >
            Create Opening
          </button>
        </form>
      </div>
    </div>
  );
}
