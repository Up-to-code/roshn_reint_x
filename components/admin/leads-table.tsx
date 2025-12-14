"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Download, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { deleteLead } from "@/actions/delete-lead";
import { useRouter } from "next/navigation";

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone: string;
  message?: string;
  propertyTitle: string; 
  read?: boolean;
  createdAt: Date;
}

interface LeadsTableProps {
  leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleExport = () => {
    try {
      // Define CSV headers
      const headers = ["Name", "Email", "Phone", "Property/Source", "Message", "Date", "Status"];
      
      // Map data to CSV rows with all available fields
      const rows = leads.map(lead => [
        lead.name || "",
        lead.email || "",
        lead.phone || "",
        lead.propertyTitle || "",
        (lead.message || "").replace(/"/g, '""'), // Escape quotes in message
        format(new Date(lead.createdAt), "PPP"),
        lead.read ? "Read" : "Unread"
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `leads_export_${format(new Date(), "yyyy-MM-dd_HHmmss")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Leads exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export leads");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    setDeletingId(id);
    try {
      const result = await deleteLead(id);
      if (result.success) {
        toast.success("Lead deleted successfully");
        // Refresh the page to show updated data
        router.refresh();
      } else {
        toast.error("Failed to delete lead");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  if (leads.length === 0) {
    return (
      <div className="space-y-4">
         <div className="flex justify-end">
             <Button variant="outline" disabled>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
             </Button>
         </div>
        <div className="p-4 text-center text-gray-500 border rounded-md">No leads found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleExport} variant="outline" className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
          <Download className="mr-2 h-4 w-4" />
          Export CSV ({leads.length})
        </Button>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">Name</TableHead>
              <TableHead className="text-right">Phone</TableHead>
              <TableHead className="text-right">Source</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium text-right">{lead.name}</TableCell>
                <TableCell className="text-right" dir="ltr">{lead.phone}</TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {lead.propertyTitle}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {format(new Date(lead.createdAt), "PPP")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(lead.id)}
                    disabled={deletingId === lead.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    {deletingId === lead.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
