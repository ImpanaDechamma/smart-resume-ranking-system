"use client";

import { useState } from "react";
import { X, Image } from "lucide-react";
import { Job } from "@/context/AppContext";

export function EditJobModal({
  job,
  onClose,
  onSave,
}: {
  job: Job;
  onClose: () => void;
  onSave: (updates: { title: string; description: string; logo?: string; banner?: string; logoFile?: File; bannerFile?: File; skills: string[] }) => Promise<void>;
}) {
  const [title, setTitle] = useState(job.title);
  const [description, setDescription] = useState(job.description);
  const [skills, setSkills] = useState((job.skills || []).join(", "));
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [vacancies, setVacancies] = useState(job.vacancies || 0);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      title,
      description,
      logoFile: logoFile || undefined,
      bannerFile: bannerFile || undefined,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      vacancies,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-[3rem] border border-border bg-white shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="bg-primary px-10 py-8 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Editing Job</p>
            <h2 className="text-2xl font-black text-white tracking-tight">{job.title}</h2>
            <p className="text-sm text-white/60 mt-1">{job.company}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-3 bg-white/10 text-white hover:bg-white/20 transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-secondary/30 border border-border/50 rounded-2xl py-4 px-6 text-foreground font-bold focus:border-primary outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Logo</label>
              <div className="flex flex-col gap-2">
                <input 
                  type="file"
                  accept="image/*"
                  id="edit-logo-upload"
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
                    htmlFor="edit-logo-upload"
                    className="w-full h-32 rounded-2xl bg-secondary/30 border border-dashed border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
                  >
                    {(logoFile || job.logo) ? (
                      <img 
                        src={logoFile ? URL.createObjectURL(logoFile) : job.logo} 
                        alt="Logo" 
                        className="w-full h-full object-contain p-4" 
                      />
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
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Banner</label>
              <div className="flex flex-col gap-2">
                <input 
                  type="file"
                  accept="image/*"
                  id="edit-banner-upload"
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
                    htmlFor="edit-banner-upload"
                    className="w-full h-32 rounded-2xl bg-secondary/30 border border-dashed border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
                  >
                    {(bannerFile || job.banner) ? (
                      <img 
                        src={bannerFile ? URL.createObjectURL(bannerFile) : job.banner} 
                        alt="Banner" 
                        className="w-full h-full object-cover rounded-2xl" 
                      />
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

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Skills (Comma separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, Node, SQL..."
              className="w-full bg-secondary/30 border border-border/50 rounded-2xl py-4 px-6 text-foreground font-bold focus:border-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-secondary/30 border border-border/50 rounded-2xl py-4 px-6 text-foreground font-bold focus:border-primary outline-none transition-all resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Number of Vacancies</label>
            <input
              type="number"
              min="0"
              value={vacancies === 0 ? "" : vacancies}
              onChange={(e) => setVacancies(e.target.value === "" ? 0 : parseInt(e.target.value) || 0)}
              className="w-full bg-secondary/30 border border-border/50 rounded-2xl py-4 px-6 text-foreground font-bold focus:border-primary outline-none transition-all"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl px-8 py-4 text-sm font-black uppercase tracking-widest text-foreground/40 hover:bg-secondary transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-primary px-10 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
