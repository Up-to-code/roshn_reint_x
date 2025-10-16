"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface InterestFormProps {
  propertyTitle: string;
}

export default function InterestForm({ propertyTitle }: InterestFormProps) {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, propertyTitle }),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", phone: "", message: "" });
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
      <h2 className="mb-4 text-center text-lg font-medium text-slate-800">
        أرسل اهتمامك بهذا العقار
      </h2>

      {success && (
        <div className="mb-4 rounded-md bg-green-100 p-3 text-center text-sm text-green-700">
          ✅ تم إرسال طلبك بنجاح!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          required
          placeholder="الاسم الكامل"
          className="rounded-lg border-slate-300 focus:ring-2 focus:ring-slate-400"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Input
          required
          placeholder="رقم الجوال"
          className="rounded-lg border-slate-300 focus:ring-2 focus:ring-slate-400"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <Textarea
          required
          placeholder="رسالتك"
          className="rounded-lg border-slate-300 focus:ring-2 focus:ring-slate-400"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-800 text-white hover:bg-slate-700"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" /> جاري الإرسال...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Send className="size-4" /> إرسال
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}
