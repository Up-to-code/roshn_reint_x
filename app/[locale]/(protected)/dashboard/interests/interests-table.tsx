"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Building, Calendar, Eye, EyeOff, Loader2, Mail, Phone, Trash2, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface InterestRow {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  message: string | null;
  propertyTitle: string | null;
  propertyId: string | null;
  property?: { id: string; titleEn: string | null; titleAr: string } | null;
  read: boolean;
  createdAt: string;
}

export function InterestsTable({
  interests,
  locale,
  mutatingId,
  onMarkRead,
  onDelete,
}: {
  interests: InterestRow[];
  locale: string;
  mutatingId: string | null;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const t = useTranslations("interests");
  const isRTL = locale === "ar";

  if (!interests.length) {
    return <div className="py-12 text-center text-lg text-muted-foreground">{t("empty.title")}</div>;
  }

  const alignment = isRTL ? "text-right" : "";
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {(["status", "name", "email", "phone", "property", "message", "date", "actions"] as const).map((column) => (
              <TableHead key={column} className={alignment}>{t(`table.${column}`)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {interests.map((interest) => {
            const propertyTitle = locale === "ar"
              ? interest.property?.titleAr || interest.propertyTitle
              : interest.property?.titleEn || interest.propertyTitle;
            return (
              <TableRow key={interest.id} className={!interest.read ? "bg-muted/50" : ""}>
                <TableCell>
                  <Badge variant={interest.read ? "secondary" : "default"} className="gap-1">
                    {interest.read ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                    {t(interest.read ? "badges.read" : "badges.unread")}
                  </Badge>
                </TableCell>
                <TableCell className={alignment}>
                  <div className="flex items-center gap-2"><User className="size-4 text-muted-foreground" />{interest.name}</div>
                </TableCell>
                <TableCell className={alignment}>
                  {interest.email ? (
                    <a href={`mailto:${interest.email}`} className="flex items-center gap-2 text-primary hover:underline">
                      <Mail className="size-4 text-muted-foreground" />{interest.email}
                    </a>
                  ) : <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell className={alignment}>
                  <a href={`tel:${interest.phone}`} className="flex items-center gap-2 text-primary hover:underline">
                    <Phone className="size-4 text-muted-foreground" />{interest.phone}
                  </a>
                </TableCell>
                <TableCell className={alignment}>
                  {interest.propertyId ? (
                    <Link href={`/${locale}/p/${interest.propertyId}`} className="flex items-center gap-2 text-primary hover:underline">
                      <Building className="size-4" />{propertyTitle || "-"}
                    </Link>
                  ) : <span>{propertyTitle || "-"}</span>}
                </TableCell>
                <TableCell className={alignment}>
                  {interest.message ? <p className="max-w-xs truncate text-sm">{interest.message}</p> : <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell className={alignment}>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="size-4" />
                    {new Date(interest.createdAt).toLocaleDateString(locale, {
                      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    {!interest.read && (
                      <Button variant="outline" size="sm" onClick={() => onMarkRead(interest.id)} disabled={mutatingId === interest.id}>
                        {t("actions.markRead")}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(interest.id)}
                      disabled={mutatingId === interest.id}
                      className="text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                      {mutatingId === interest.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
