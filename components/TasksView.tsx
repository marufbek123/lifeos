'use client';

import { useEffect, useState } from 'react';
import { LANGUAGE } from '@/lib/language';
import { getTasks, setTasks } from '@/lib/storage';
import { Task, Priority, TaskCategory } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import TaskForm from '@/components/TaskForm';

export default function TasksView() {
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setTasksState(getTasks());
  }, []);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...tasks, newTask];
    setTasksState(updated);
    setTasks(updated);
    setShowForm(false);
  };

  const handleUpdateTask = (id: string, taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const updated = tasks.map(t =>
      t.id === id
        ? { ...t, ...taskData, updatedAt: new Date().toISOString() }
        : t
    );
    setTasksState(updated);
    setTasks(updated);
    setEditingId(null);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasksState(updated);
    setTasks(updated);
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map(t =>
      t.id === id
        ? {
          ...t,
          completed: !t.completed,
          completedAt: !t.completed ? new Date().toISOString() : undefined,
        }
        : t
    );
    setTasksState(updated);
    setTasks(updated);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-accent';
      case 'low':
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">{LANGUAGE.tasks.title}</h2>
        <Button onClick={() => setShowForm(true)} className="w-full md:w-auto bg-primary text-primary-foreground">
          + {LANGUAGE.tasks.addTask}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'active', 'completed'] as const).map(f => (
          <Button
            key={f}
            onClick={() => setFilter(f)}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
          >
            {f === 'all' ? 'Barchasi' : f === 'active' ? LANGUAGE.tasks.active : LANGUAGE.tasks.completed}
          </Button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <Card className="p-8 md:p-12 text-center bg-card border border-border flex-1 flex items-center justify-center">
          <div>
            <p className="text-muted-foreground text-lg mb-2">{LANGUAGE.tasks.noTasks}</p>
            <p className="text-sm text-muted-foreground">Yangi vazifa qo'shishni boshlang!</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <Card
              key={task.id}
              className="p-4 bg-card border border-border flex flex-col md:flex-row md:items-start gap-3 md:gap-4 hover:bg-secondary transition"
            >
              <Checkbox
                checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2">
                  <h3 className={`font-medium text-sm md:text-base ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {task.title}
                  </h3>
                  <span className={`text-xs font-semibold flex-shrink-0 ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} {
                      task.priority === 'high' ? LANGUAGE.tasks.high :
                        task.priority === 'medium' ? LANGUAGE.tasks.medium :
                          LANGUAGE.tasks.low
                    }
                  </span>
                </div>
                {task.description && (
                  <p className="text-xs md:text-sm text-muted-foreground mb-2">{task.description}</p>
                )}
                <div className="flex gap-2 flex-wrap text-xs text-muted-foreground">
                  {task.dueDate && <span>{LANGUAGE.tasks.dueDate}: {new Date(task.dueDate).toLocaleDateString('uz-UZ')}</span>}
                  <span>{task.category}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  onClick={() => setEditingId(task.id)}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                >
                  {LANGUAGE.common.edit}
                </Button>
                <Button
                  onClick={() => handleDeleteTask(task.id)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive text-xs"
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
