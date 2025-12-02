"use client";

import { useTranslations } from "next-intl";
import { useHomePageStore } from "@/store/home-page-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function HeroFormBuilder() {
  const t = useTranslations('homePageEditor.hero');
  const { data, currentLang, updateHero } = useHomePageStore();
  const content = data?.[currentLang];
  const hero = content?.hero || {};
  const formFields = hero.formFields || [];

  const updateFormField = (index: number, field: string, value: any) => {
    const updatedFields = formFields.map((f: any, i: number) => 
      i === index ? { ...f, [field]: value } : f
    );
    updateHero({ formFields: updatedFields });
  };

  const addFormField = () => {
    const newField = { 
      name: `field-${Date.now()}`, 
      label: "New Field", 
      required: false, 
      type: "text",
      placeholder: ""
    };
    updateHero({ formFields: [...formFields, newField] });
  };

  const removeFormField = (index: number) => {
    const updatedFields = formFields.filter((_: any, i: number) => i !== index);
    updateHero({ formFields: updatedFields });
  };

  const loadFormFromContact = () => {
    const contactFormFields = content?.contactUs?.form?.fields || [];
    if (contactFormFields.length === 0) {
      toast.error(t('noContactFormFields') || 'No form fields found in contact section');
      return;
    }
    
    // Map contact form fields to hero form fields format
    const mappedFields = contactFormFields.map((field: any) => ({
      name: field.name || `field-${Date.now()}`,
      label: field.label || '',
      type: field.type || 'text',
      required: field.required || false,
      placeholder: field.placeholder || ''
    }));
    
    updateHero({ formFields: mappedFields });
    toast.success(t('formLoaded') || 'Form fields loaded from contact section');
  };

  if (!content) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{t('formBuilder') || 'Form Builder'}</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadFormFromContact}
            title={t('loadFromContact') || 'Load form from contact section'}
          >
            <Download className="mr-2 h-4 w-4" />
            {t('loadFromContact') || 'Load from Contact'}
          </Button>
          <Button variant="outline" size="sm" onClick={addFormField}>
            <Plus className="mr-2 h-4 w-4" />
            {t('addField') || 'Add Field'}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {formFields.map((field: any, index: number) => (
          <div key={index} className="rounded-lg border p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  {t('fieldName') || 'Field Name'}
                </label>
                <Input
                  value={field.name || ""}
                  onChange={(e) => updateFormField(index, "name", e.target.value)}
                  placeholder="field-name"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  {t('displayLabel') || 'Display Label'}
                </label>
                <Input
                  value={field.label || ""}
                  onChange={(e) => updateFormField(index, "label", e.target.value)}
                  placeholder={t('placeholders.buttonText') || 'Label'}
                  dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  {t('fieldType') || 'Field Type'}
                </label>
                <Select
                  value={field.type || "text"}
                  onValueChange={(value) => updateFormField(index, "type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">{t('fieldTypes.text') || 'Text'}</SelectItem>
                    <SelectItem value="email">{t('fieldTypes.email') || 'Email'}</SelectItem>
                    <SelectItem value="tel">{t('fieldTypes.tel') || 'Phone'}</SelectItem>
                    <SelectItem value="textarea">{t('fieldTypes.textarea') || 'Textarea'}</SelectItem>
                    <SelectItem value="number">{t('fieldTypes.number') || 'Number'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  {t('placeholder') || 'Placeholder'}
                </label>
                <Input
                  value={field.placeholder || ""}
                  onChange={(e) => updateFormField(index, "placeholder", e.target.value)}
                  placeholder={t('placeholders.buttonText') || 'Placeholder text'}
                  dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.required || false}
                  onChange={(e) => updateFormField(index, "required", e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">{t('required') || 'Required'}</span>
              </label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => removeFormField(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {formFields.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
            <p>{t('noFields') || 'No form fields yet. Click "Add Field" to get started.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

