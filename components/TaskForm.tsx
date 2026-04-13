'use client';

import { useState } from 'react';
import { LANGUAGE } from '@/lib/language';
import { Task, Priority, TaskCategory } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialTask?: Task;
  defaultDueDate?: string;
}

const PRIORITIES: Priority[] = ['high', 'medium', 'low'];
const CATEGORIES: TaskCategory[] = ['work', 'personal', 'health', 'learning', 'other'];

export default function TaskForm({ onSubmit, onCancel, initialTask, defaultDueDate }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [priority, setPriority] = useState<Priority>(initialTask?.priority || 'medium');
  const [category, setCategory] = useState<TaskCategory>(initialTask?.category || 'personal');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || defaultDueDate || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category,
      dueDate: dueDate || undefined,
      completed: initialTask?.completed || false,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('personal');
    setDueDate('');
  };

  return (
    <Card className="p-4 md:p-6 bg-card border border-border mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder={LANGUAGE.tasks.title}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-input text-foreground border-border text-sm md:text-base"
            required
          />
        </div>

        <div>
          <textarea
            placeholder="Vazifa haqida ma'lumot..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 bg-input text-foreground border border-border rounded-md text-sm"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              {LANGUAGE.tasks.priority}
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full p-2 bg-input text-foreground border border-border rounded-md text-sm"
            >
              {PRIORITIES.map(p => (
                <option key={p} value={p}>
                  {p === 'high' ? LANGUAGE.tasks.high : p === 'medium' ? LANGUAGE.tasks.medium : LANGUAGE.tasks.low}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              {LANGUAGE.tasks.category}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full p-2 bg-input text-foreground border border-border rounded-md text-sm"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              {LANGUAGE.tasks.dueDate}
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-input text-foreground border-border text-sm"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button onClick={onCancel} variant="outline" size="sm">
            {LANGUAGE.common.cancel}
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground" size="sm">
            {LANGUAGE.common.save}
          </Button>
        </div>
      </form>
    </Card>
  );
}
