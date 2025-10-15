'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Contact } from "../contact";
import { Edit, Trash2, Phone, Mail, MapPin, MoreHorizontal, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ContactTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export function ContactTable({ contacts, onEdit, onDelete, loading }: ContactTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto size-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="mt-2 text-sm text-slate-600">Loading contacts...</p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="p-12 text-center">
        <Users className="mx-auto mb-4 size-12 text-slate-300" />
        <h3 className="text-lg font-semibold text-slate-900">No contacts found</h3>
        <p className="mt-1 text-slate-600">Get started by adding your first contact.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Contact</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id} className="group hover:bg-slate-50/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 border">
                    <AvatarFallback className="bg-blue-100 text-sm font-medium text-blue-600">
                      {getInitials(contact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-slate-900">{contact.name}</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <Mail className="size-3" />
                      {contact.email || 'No email'}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-slate-400" />
                  <span className="font-mono text-sm">{contact.phoneNumber}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[200px]">
                  <p className="line-clamp-2 text-sm text-slate-700">
                    {contact.message}
                  </p>
                  {contact.message && contact.message.length > 100 && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      {contact.message.length} chars
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm text-slate-900">{formatDate(contact.createdAt)}</span>
                  <span className="text-xs text-slate-500">{getTimeAgo(contact.createdAt)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(contact)}>
                        <Edit className="mr-2 size-4" />
                        Edit Contact
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(contact.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}