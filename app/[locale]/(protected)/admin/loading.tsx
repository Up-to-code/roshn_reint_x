"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";
import { redirect, useParams } from "next/navigation";

export default function AdminPanelLoading() {
  const params = useParams()

  return redirect(`/${params.locale}/dashboard`)
}
