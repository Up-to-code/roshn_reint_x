"use client";

import { useState } from "react";
import { useGlobalSettingsStore } from "@/store/global-settings-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ChevronDown, GripVertical } from "lucide-react";

export function NavigationEditor() {
  const {
    settings: { navigation },
    updateNavigation,
    addMainLink,
    updateMainLink,
    removeMainLink,
    addAdditionalMenu,
    updateAdditionalMenu,
    removeAdditionalMenu,
  } = useGlobalSettingsStore();

  const [newMainLink, setNewMainLink] = useState({ label: '', href: '', external: false });
  const [newMenuTitle, setNewMenuTitle] = useState('');

  const addNewMainLink = () => {
    if (newMainLink.label && newMainLink.href) {
      addMainLink({
        id: Date.now().toString(),
        ...newMainLink,
      });
      setNewMainLink({ label: '', href: '', external: false });
    }
  };

  const addNewAdditionalMenu = () => {
    if (newMenuTitle) {
      addAdditionalMenu({
        id: Date.now().toString(),
        title: newMenuTitle,
        items: [],
      });
      setNewMenuTitle('');
    }
  };

  const addMenuItemToMenu = (menuId: string) => {
    const menu = navigation.additionalMenus.find(m => m.id === menuId);
    if (menu) {
      updateAdditionalMenu(menuId, {
        items: [...menu.items, {
          id: Date.now().toString(),
          label: 'New Item',
          href: '#',
          external: false,
        }]
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Links Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Main Navigation Links</h3>
        <div className="space-y-3">
          {navigation.mainLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-2 rounded-lg border bg-card p-3">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <Input
                value={link.label}
                onChange={(e) => updateMainLink(link.id, { label: e.target.value })}
                placeholder="Label"
                className="flex-1"
              />
              <Input
                value={link.href}
                onChange={(e) => updateMainLink(link.id, { href: e.target.value })}
                placeholder="URL"
                className="flex-1"
              />
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={link.external}
                  onChange={(e) => updateMainLink(link.id, { external: e.target.checked })}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                External
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeMainLink(link.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2 rounded-lg border bg-muted/50 p-3">
          <Input
            value={newMainLink.label}
            onChange={(e) => setNewMainLink({ ...newMainLink, label: e.target.value })}
            placeholder="New link label"
            className="flex-1"
          />
          <Input
            value={newMainLink.href}
            onChange={(e) => setNewMainLink({ ...newMainLink, href: e.target.value })}
            placeholder="URL"
            className="flex-1"
          />
          <Button onClick={addNewMainLink} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Additional Menus Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground">Additional Menus</h3>
        </div>
        
        <div className="space-y-4">
          {navigation.additionalMenus.map((menu) => (
            <div key={menu.id} className="rounded-lg border bg-card">
              <div className="flex items-center gap-3 rounded-t-lg bg-muted/50 p-4">
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={menu.title}
                  onChange={(e) => updateAdditionalMenu(menu.id, { title: e.target.value })}
                  placeholder="Menu title"
                  className="flex-1 bg-transparent font-medium"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeAdditionalMenu(menu.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2 p-4">
                {menu.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={item.label}
                      onChange={(e) => {
                        const updatedItems = menu.items.map(i =>
                          i.id === item.id ? { ...i, label: e.target.value } : i
                        );
                        updateAdditionalMenu(menu.id, { items: updatedItems });
                      }}
                      placeholder="Item label"
                      className="flex-1"
                    />
                    <Input
                      value={item.href}
                      onChange={(e) => {
                        const updatedItems = menu.items.map(i =>
                          i.id === item.id ? { ...i, href: e.target.value } : i
                        );
                        updateAdditionalMenu(menu.id, { items: updatedItems });
                      }}
                      placeholder="URL"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updatedItems = menu.items.filter(i => i.id !== item.id);
                        updateAdditionalMenu(menu.id, { items: updatedItems });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() => addMenuItemToMenu(menu.id)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Menu Item
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={newMenuTitle}
            onChange={(e) => setNewMenuTitle(e.target.value)}
            placeholder="New menu title"
            className="flex-1"
          />
          <Button onClick={addNewAdditionalMenu} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Menu
          </Button>
        </div>
      </div>

      {/* Navigation Settings */}
      <div className="space-y-4 rounded-lg border bg-card p-4">
        <h3 className="text-lg font-medium text-foreground">Navigation Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">Background Color</label>
            <Input
              value={navigation.backgroundColor}
              onChange={(e) => updateNavigation({ backgroundColor: e.target.value })}
              placeholder="#ffffff"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Text Color</label>
            <Input
              value={navigation.textColor}
              onChange={(e) => updateNavigation({ textColor: e.target.value })}
              placeholder="#000000"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={navigation.sticky}
            onChange={(e) => updateNavigation({ sticky: e.target.checked })}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <label className="text-sm font-medium text-foreground">Sticky Navigation</label>
        </div>
      </div>
    </div>
  );
}