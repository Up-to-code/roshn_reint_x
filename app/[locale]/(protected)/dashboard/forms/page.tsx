'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, Users, Phone, Mail, MapPin, Download, Filter, MoreHorizontal } from "lucide-react";
import { ContactTable } from './components/contact-table';
import { ContactForm } from './components/contact-form';
import { StatsCards } from './components/stats-cards';
import { Contact } from './contact';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Fetch contacts from the API
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contacts');
      if (!response.ok) throw new Error('Failed to fetch contacts');
      const data = await response.json();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filter contacts based on search and tab
  useEffect(() => {
    let filtered = contacts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.message?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tab filter
    if (activeTab === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter(contact => 
        new Date(contact.createdAt) > oneWeekAgo
      );
    }

    setFilteredContacts(filtered);
  }, [searchQuery, activeTab, contacts]);

  // Handle form submission for both create and update
  const handleFormSubmit = async (data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    const url = editingContact ? `/api/contacts/${editingContact.id}` : '/api/contacts';
    const method = editingContact ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save contact');
      }

      await fetchContacts();
      closeForm();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle deleting a contact
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      const response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete contact');
      
      await fetchContacts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openCreateForm = () => {
    setEditingContact(null);
    setIsFormOpen(true);
  };

  const openEditForm = (contact: Contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingContact(null);
  };

  const exportContacts = () => {
    const csv = [
      ['Name', 'Phone Number', 'Message', 'Created At'],
      ...filteredContacts.map(contact => [
        contact.name,
        contact.phoneNumber,
        contact.message,
        new Date(contact.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center ">
        <div className="text-center">
          <div className="mx-auto size-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-lg text-slate-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Contact Management</h1>
            <p className="mt-2 text-slate-600">
              Manage and organize your contact inquiries in one place
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={exportContacts} className="gap-2">
              <Download className="size-4" />
              Export
            </Button>
            <Button onClick={openCreateForm} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="size-4" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards contacts={contacts} />

        {/* Main Content */}
        <div className="grid gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Contact Inquiries</CardTitle>
                  <CardDescription>
                    Manage all customer inquiries and contact requests
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search contacts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 sm:w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-6">
                  <TabsList className="grid w-full grid-cols-3 lg:inline-grid lg:w-auto">
                    <TabsTrigger value="all" className="flex items-center gap-2">
                      <Users className="size-4" />
                      All Contacts
                      <Badge variant="secondary" className="ml-1">
                        {contacts.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="recent" className="flex items-center gap-2">
                      <Filter className="size-4" />
                      Recent
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="flex items-center gap-2">
                      Analytics
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="m-0">
                  <ContactTable
                    contacts={filteredContacts}
                    onEdit={openEditForm}
                    onDelete={handleDelete}
                    loading={loading}
                  />
                </TabsContent>

                <TabsContent value="recent" className="m-0">
                  <ContactTable
                    contacts={filteredContacts}
                    onEdit={openEditForm}
                    onDelete={handleDelete}
                    loading={loading}
                  />
                </TabsContent>

                <TabsContent value="analytics" className="m-0 p-6">
                  <div className="text-center text-slate-500">
                    <Users className="mx-auto mb-4 size-12 text-slate-300" />
                    <p>Analytics dashboard coming soon...</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-800">
              <span className="text-sm font-medium">Error: {error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="text-red-600 hover:bg-red-100 hover:text-red-800"
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}

        {/* Contact Form Dialog */}
        {isFormOpen && (
          <ContactForm
            initialData={editingContact}
            onSubmit={handleFormSubmit}
            onClose={closeForm}
            isOpen={isFormOpen}
          />
        )}
      </div>
    </div>
  );
}