"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Job } from "@/context/AppContext";

export function EditJobModal({
  job,
  onClose,
  onSave,
}: {
  job: Job;
  onClose: () => void;
  onSave: (updates: { title: string; description: string; skills: string[] }) => Promise<void>;
}) {
  const [title, setTitle] = useState(job.title);
  const [description, setDescription] = useState(job.description);
  const [skills, setSkills] = useState((job.skills || []).join(", "));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      title,
      description,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-[3rem] border border-border bg-white shadow-2xl overflow-hidden">
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
