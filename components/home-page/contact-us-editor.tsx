"use client";

import { useTranslations } from "next-intl";
import { useHomePageStore } from "@/store/home-page-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function ContactUsEditor() {
  const t = useTranslations('homePageEditor.contactUs');
  const { data, currentLang, updateContactUs } = useHomePageStore();
  const contactData = data[currentLang].contactUs;

  const updateField = (field: string, value: any) => {
    updateContactUs({ [field]: value });
  };

  const updateContactInfo = (field: string, value: string) => {
    updateContactUs({ contactInfo: { ...contactData.contactInfo, [field]: value } });
  };

  const updateFormField = (index: number, field: string, value: any) => {
    const updatedFields = contactData.form.fields.map((f, i) => 
      i === index ? { ...f, [field]: value } : f
    );
    updateContactUs({ form: { ...contactData.form, fields: updatedFields } });
  };

  const addFormField = () => {
    const newField = { name: `field-${Date.now()}`, label: "New Field", required: false, type: "text" };
    updateContactUs({ form: { ...contactData.form, fields: [...contactData.form.fields, newField] } });
  };

  const removeFormField = (index: number) => {
    const updatedFields = contactData.form.fields.filter((_, i) => i !== index);
    updateContactUs({ form: { ...contactData.form, fields: updatedFields } });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">{t('contactSettings')}</h3>
        <Input
          value={contactData.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder={t('placeholders.contactUs')}
          dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
        />
        <Input
          value={contactData.subtitle}
          onChange={(e) => updateField("subtitle", e.target.value)}
          placeholder={t('placeholders.wereHereToHelp')}
          dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
        />
        <Textarea
          value={contactData.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder={t('placeholders.getInTouch')}
          rows={3}
          dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">{t('contactInfo')}</h3>
        <Input
          value={contactData.contactInfo.address}
          onChange={(e) => updateContactInfo("address", e.target.value)}
          placeholder={t('address')}
          dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
        />
        <Input
          value={contactData.contactInfo.phone}
          onChange={(e) => updateContactInfo("phone", e.target.value)}
          placeholder={t('phone')}
        />
        <Input
          value={contactData.contactInfo.email}
          onChange={(e) => updateContactInfo("email", e.target.value)}
          placeholder={t('email')}
        />
        <Input
          value={contactData.contactInfo.workingHours}
          onChange={(e) => updateContactInfo("workingHours", e.target.value)}
          placeholder={t('workingHours')}
          dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">{t('formFields')}</h3>
        <div className="space-y-3">
          {contactData.form.fields.map((field, index) => (
            <div key={index} className="flex items-center gap-2 rounded-lg border p-3">
              <Input
                value={field.name}
                onChange={(e) => updateFormField(index, "name", e.target.value)}
                placeholder={t('fieldName')}
                className="flex-1"
              />
              <Input
                value={field.label}
                onChange={(e) => updateFormField(index, "label", e.target.value)}
                placeholder={t('displayLabel')}
                className="flex-1"
                dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
              />
              <select
                value={field.type}
                onChange={(e) => updateFormField(index, "type", e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="text">{t('fieldTypes.text')}</option>
                <option value="email">{t('fieldTypes.email')}</option>
                <option value="tel">{t('fieldTypes.tel')}</option>
                <option value="textarea">{t('fieldTypes.textarea')}</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => removeFormField(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={addFormField} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          {t('addField')}
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">{t('mapSettings')}</h3>
        <Textarea
          value={contactData.map.embedCode}
          onChange={(e) => updateContactUs({ map: { ...contactData.map, embedCode: e.target.value } })}
          placeholder={t('placeholders.mapEmbed')}
          rows={4}
        />
      </div>
    </div>
  );
}