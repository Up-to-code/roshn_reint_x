"use client";
 
import { redirect, useParams } from "next/navigation";

export default function AdminPanelLoading() {
  const params = useParams()

  return redirect(`/${params.locale}/dashboard`)
}
