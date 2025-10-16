"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

type Interest = {
  id: string;
  name: string;
  phone: string;
  propertyTitle: string;
  createdAt: string;
};

export default function InterestsDashboard() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchInterests() {
    const res = await fetch("/api/interests");
    const data = await res.json();
    setInterests(data);
    setLoading(false);
  }

  async function clearAll() {
    if (confirm("هل أنت متأكد أنك تريد حذف جميع الطلبات؟")) {
      await fetch("/api/interests", { method: "DELETE" });
      fetchInterests();
    }
  }

  useEffect(() => {
    fetchInterests();
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        <Loader2 className="mr-2 size-5 animate-spin" /> جاري التحميل...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            🏡 طلبات الاهتمام بالعقارات
          </h1>
          {interests.length > 0 && (
            <Button
              onClick={clearAll}
              className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700"
            >
              <Trash2 className="size-4" />
              حذف الكل
            </Button>
          )}
        </div>

        {/* Empty State */}
        {interests.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-500">
            لا توجد طلبات بعد.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {interests.map((i) => (
              <div
                key={i.id}
                className="rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md"
              >
                <h2 className="mb-1 text-lg font-medium text-gray-900">
                  {i.propertyTitle}
                </h2>
                <p className="mb-2 text-sm text-gray-700">
                  👤 {i.name}
                  <br />📞 {i.phone}
                </p>
                <p className="mt-2 border-t pt-2 text-xs text-gray-500">
                  {new Date(i.createdAt).toLocaleString("ar-SA")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
