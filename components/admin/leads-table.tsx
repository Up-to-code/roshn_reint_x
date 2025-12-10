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

interface Lead {
  id: string;
  name: string;
  phone: string;
  propertyTitle: string; 
  createdAt: Date;
}

interface LeadsTableProps {
  leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
  if (leads.length === 0) {
    return <div className="p-4 text-center text-gray-500">No leads found.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">Name</TableHead>
            <TableHead className="text-right">Phone</TableHead>
            <TableHead className="text-right">Source</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium text-right">{lead.name}</TableCell>
              <TableCell className="text-right">{lead.phone}</TableCell>
              <TableCell className="text-right">{lead.propertyTitle}</TableCell>
              <TableCell className="text-right">
                {format(new Date(lead.createdAt), "PPP")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
