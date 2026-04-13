'use client';

import { useEffect, useState } from 'react';
import { LANGUAGE } from '@/lib/language';
import { getTasks, setTasks } from '@/lib/storage';
import { Task } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import TaskForm from '@/components/TaskForm';

export default function HomeView() {
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    const tasks = getTasks();
    setAllTasks(tasks);

    // Get today's date
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    setTodayDate(dateStr);

    // Filter tasks for today
    const today_tasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      return task.dueDate === dateStr && !task.completed;
    });

    setTodayTasks(today_tasks);
  }, []);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...allTasks, newTask];
    setAllTasks(updated);
    setTasks(updated);

    // Update today's tasks if due date is today
    if (taskData.dueDate === todayDate) {
      setTodayTasks([...todayTasks, newTask]);
    }

    setShowForm(false);
  };

  const handleToggleTask = (id: string) => {
    const updated = allTasks.map(t =>
      t.id === id
        ? {
          ...t,
          completed: !t.completed,
          completedAt: !t.completed ? new Date().toISOString() : undefined,
        }
        : t
    );
    setAllTasks(updated);
    setTasks(updated);

    // Update today's tasks
    const updatedToday = todayTasks.filter(t => t.id !== id);
    setTodayTasks(updatedToday);
  };

  const handleDeleteTask = (id: string) => {
    const updated = allTasks.filter(t => t.id !== id);
    setAllTasks(updated);
    setTasks(updated);

    const updatedToday = todayTasks.filter(t => t.id !== id);
    setTodayTasks(updatedToday);
  };

  // Format date to Uzbek
  const formatDateUz = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    const month = date.getMonth();

    const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
    const months = LANGUAGE.date.months;

    return `${days[dayOfWeek]} — ${dayOfMonth} ${months[month]}`;
  };

  const completedCount = allTasks.filter(t => t.completed).length;
  const totalCount = allTasks.length;

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {LANGUAGE.tasks.todayTasks}
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          {formatDateUz(todayDate)}
        </p>
      </div>

      {/* Quick Stats */}
      {totalCount > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <Card className="p-4 bg-card border border-border">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Bugungi vazifalar</p>
            <p className="text-2xl md:text-3xl font-bold text-foreground">{todayTasks.length}</p>
          </Card>
          <Card className="p-4 bg-card border border-border">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Bajarilgan</p>
            <p className="text-2xl md:text-3xl font-bold text-accent">{completedCount}</p>
          </Card>
          <Card className="p-4 bg-card border border-border">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Qolgan</p>
            <p className="text-2xl md:text-3xl font-bold text-primary">{totalCount - completedCount}</p>
          </Card>
          <Card className="p-4 bg-card border border-border">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Foiz</p>
            <p className="text-2xl md:text-3xl font-bold text-sidebar-primary">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </p>
          </Card>
        </div>
      )}

      {/* Add Task Button */}
      {!showForm && (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full mb-6 bg-primary text-primary-foreground py-2 md:py-3"
        >
          + {LANGUAGE.tasks.addTask}
        </Button>
      )}

      {/* Form */}
      {showForm && (
        <div className="mb-6">
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setShowForm(false)}
            defaultDueDate={todayDate}
          />
        </div>
      )}

      {/* Tasks List */}
      {todayTasks.length === 0 ? (
        <Card className="p-8 md:p-12 text-center bg-card border border-border flex-1 flex items-center justify-center">
          <div>
            <p className="text-muted-foreground text-lg mb-4">{LANGUAGE.tasks.noTasks}</p>
            <p className="text-sm text-muted-foreground">Bugun dam olishning vaqti!</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {todayTasks.map(task => (
            <Card
              key={task.id}
              className="p-4 bg-card border border-border flex items-start gap-3 hover:bg-secondary transition"
            >
              <Checkbox
                checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-sm md:text-base ${
                  task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                }`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">{task.description}</p>
                )}
                {task.category && (
                  <p className="text-xs text-muted-foreground mt-1">{task.category}</p>
                )}
              </div>
              <Button
                onClick={() => handleDeleteTask(task.id)}
                variant="ghost"
                size="sm"
                className="text-destructive"
              >
                {LANGUAGE.common.delete}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
