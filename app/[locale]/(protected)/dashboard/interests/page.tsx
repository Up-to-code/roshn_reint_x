"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Phone, User, Calendar, Home } from "lucide-react";

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchInterests() {
    try {
      const res = await fetch("/api/interests");
      const data = await res.json();
      setInterests(data);
    } catch (error) {
      console.error("Failed to fetch interests:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteInterest(id: string) {
    setDeletingId(id);
    try {
      await fetch(`/api/interests/${id}`, { method: "DELETE" });
      await fetchInterests();
    } catch (error) {
      console.error("Failed to delete interest:", error);
    } finally {
      setDeletingId(null);
    }
  }

  async function clearAll() {
    if (!confirm("هل أنت متأكد أنك تريد حذف جميع الطلبات؟")) return;
    
    try {
      await fetch("/api/interests", { method: "DELETE" });
      await fetchInterests();
    } catch (error) {
      console.error("Failed to clear all interests:", error);
    }
  }

  useEffect(() => {
    fetchInterests();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="size-5 animate-spin" />
          جاري تحميل الطلبات...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                طلبات الاهتمام بالعقارات
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                إجمالي الطلبات: {interests.length}
              </p>
            </div>
            {interests.length > 0 && (
              <Button
                onClick={clearAll}
                className="flex items-center gap-2"
              >
                <Trash2 className="size-4" />
                حذف الكل
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        {interests.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-white">
            <div className="text-center">
              <Home className="mx-auto size-12 text-gray-400" />
              <p className="mt-4 text-gray-500">لا توجد طلبات حتى الآن</p>
              <p className="text-sm text-gray-400">
                سيظهر هنا أي طلبات اهتمام بالعقارات
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      العقار
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      العميل
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      الهاتف
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {interests.map((interest) => (
                    <tr 
                      key={interest.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="max-w-[200px]">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {interest.propertyTitle}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="size-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {interest.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Phone className="size-4 text-gray-400" />
                          <a 
                            href={`tel:${interest.phone}`}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {interest.phone}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {new Date(interest.createdAt).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          onClick={() => deleteInterest(interest.id)}
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === interest.id}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          {deletingId === interest.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}