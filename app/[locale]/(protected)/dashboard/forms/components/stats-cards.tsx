'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Contact } from "../contact";
import { Users, Phone, MessageSquare, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  contacts: Contact[];
}

export function StatsCards({ contacts }: StatsCardsProps) {
  const totalContacts = contacts.length;
  const recentContacts = contacts.filter(contact => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(contact.createdAt) > oneWeekAgo;
  }).length;

  const averageMessageLength = contacts.length > 0 
    ? Math.round(contacts.reduce((acc, contact) => acc + (contact.message?.length || 0), 0) / contacts.length)
    : 0;

  const stats = [
    {
      title: "Total Contacts",
      value: totalContacts,
      icon: Users,
      description: "All time contacts",
      trend: "+12% from last month",
    },
    {
      title: "Recent Inquiries",
      value: recentContacts,
      icon: Phone,
      description: "Last 7 days",
      trend: "+5% from last week",
    },
    {
      title: "Avg Message Length",
      value: `${averageMessageLength} chars`,
      icon: MessageSquare,
      description: "Average per contact",
      trend: "Consistent",
    },
    {
      title: "Response Rate",
      value: "94%",
      icon: TrendingUp,
      description: "Contacts responded to",
      trend: "+2% from last month",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-slate-200 bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {stat.title}
            </CardTitle>
            <stat.icon className="size-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <p className="mt-1 text-xs text-slate-500">
              {stat.description}
            </p>
            <p className="mt-1 text-xs font-medium text-green-600">
              {stat.trend}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}