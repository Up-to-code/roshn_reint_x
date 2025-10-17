'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, Download } from "lucide-react";
import { ContactTable } from './components/contact-table';
import { ContactForm } from './components/contact-form';
import { Contact } from './contact';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch contacts from the API
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contacts');
      const data = await response.json();
      setContacts(data);
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form submission
  const handleFormSubmit = async (data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    const url = editingContact ? `/api/contacts/${editingContact.id}` : '/api/contacts';
    const method = editingContact ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      await fetchContacts();
      closeForm();
    } catch (err) {
      console.error('Failed to save contact:', err);
    }
  };

  // Handle deleting a contact
  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف جهة الاتصال هذه؟')) {
      return;
    }

    try {
      await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      await fetchContacts();
    } catch (err) {
      console.error('Failed to delete contact:', err);
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
      ['الاسم', 'رقم الهاتف', 'الرسالة', 'التاريخ'],
      ...filteredContacts.map(contact => [
        contact.name,
        contact.phoneNumber,
        contact.message,
        new Date(contact.createdAt).toLocaleDateString('ar-SA')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `جهات-الاتصال-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="mx-auto size-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-lg text-slate-600">جاري تحميل جهات الاتصال...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen " dir="rtl">
      <div className="container mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-right">
            <h1 className="text-2xl font-bold text-slate-900">إدارة جهات الاتصال</h1>
            <p className="mt-2 text-slate-600">
              إدارة وتنظيم استفسارات العملاء في مكان واحد
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={exportContacts} className="gap-2">
              <Download className="size-4" />
              تصدير
            </Button>
            <Button onClick={openCreateForm} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="size-4" />
              إضافة جهة اتصال
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-right">
                <CardTitle>استفسارات العملاء</CardTitle>
                <p className="text-sm text-slate-600">
                  إجمالي جهات الاتصال: {contacts.length}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="ابحث في جهات الاتصال..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 sm:w-64 text-right"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ContactTable
              contacts={filteredContacts}
              onEdit={openEditForm}
              onDelete={handleDelete}
              loading={loading}
            />
          </CardContent>
        </Card>

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