'use client';

import { useEffect, useState } from 'react';
import { LANGUAGE } from '@/lib/language';
import { getTemplates, setTemplates, getTasks, setTasks } from '@/lib/storage';
import { Template, Task, Frequency } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FREQUENCIES: Frequency[] = ['daily', 'weekly', 'monthly'];

export default function TemplatesView() {
  const [templates, setTemplatesState] = useState<Template[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'weekly' as Frequency,
    category: 'work' as const,
  });

  useEffect(() => {
    setTemplatesState(getTemplates());
  }, []);

  const handleAddTemplate = () => {
    if (!formData.title.trim()) return;

    const newTemplate: Template = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
    };

    const updated = [...templates, newTemplate];
    setTemplatesState(updated);
    setTemplates(updated);
    setFormData({ title: '', description: '', frequency: 'weekly', category: 'work' });
    setShowForm(false);
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = templates.filter(t => t.id !== id);
    setTemplatesState(updated);
    setTemplates(updated);
  };

  const handleCreateFromTemplate = (template: Template) => {
    const tasks = getTasks();
    const newTask: Task = {
      id: Date.now().toString(),
      title: template.title,
      description: template.description,
      priority: 'medium',
      category: template.category,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    alert(`Shablon "${template.title}" vazifaga aylantirildi!`);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-foreground">{LANGUAGE.templates.title}</h2>
        <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground">
          {LANGUAGE.templates.addTemplate}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 bg-card border border-border mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                {LANGUAGE.templates.name}
              </label>
              <Input
                placeholder={LANGUAGE.templates.title}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-input text-foreground border-border"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Tavsif
              </label>
              <textarea
                placeholder="Shablon haqida..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 bg-input text-foreground border border-border rounded-md text-sm"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  {LANGUAGE.templates.frequency}
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as Frequency })}
                  className="w-full p-2 bg-input text-foreground border border-border rounded-md text-sm"
                >
                  {FREQUENCIES.map(f => (
                    <option key={f} value={f}>
                      {f === 'daily' ? LANGUAGE.templates.daily : f === 'weekly' ? LANGUAGE.templates.weekly : LANGUAGE.templates.monthly}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Toifa
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full p-2 bg-input text-foreground border border-border rounded-md text-sm"
                >
                  {['work', 'personal', 'health', 'learning', 'other'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button onClick={() => setShowForm(false)} variant="outline">
                {LANGUAGE.common.cancel}
              </Button>
              <Button onClick={handleAddTemplate} className="bg-primary text-primary-foreground">
                {LANGUAGE.common.save}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {templates.length === 0 ? (
        <Card className="p-8 text-center bg-card border border-border">
          <p className="text-muted-foreground">{LANGUAGE.templates.noTemplates}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => (
            <Card key={template.id} className="p-4 bg-card border border-border flex flex-col gap-3">
              <div>
                <h3 className="font-semibold text-foreground">{template.title}</h3>
                {template.description && (
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                )}
              </div>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>{template.frequency}</span>
                <span>•</span>
                <span>{template.category}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleCreateFromTemplate(template)}
                  variant="default"
                  size="sm"
                  className="flex-1"
                >
                  Yaratish
                </Button>
                <Button
                  onClick={() => handleDeleteTemplate(template.id)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                >
                  {LANGUAGE.common.delete}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
