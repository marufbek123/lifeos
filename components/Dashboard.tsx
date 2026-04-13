'use client';

import { useEffect, useState } from 'react';
import { LANGUAGE } from '@/lib/language';
import { getTasks, getFinanceTransactions, getEntertainmentEntries, getGymWorkouts } from '@/lib/storage';
import { Task, FinanceTransaction, EntertainmentEntry, GymWorkout } from '@/lib/types';
import { Card } from '@/components/ui/card';

export default function Dashboard() {
  const [stats, setStats] = useState({
    tasksTotal: 0,
    tasksCompleted: 0,
    totalIncome: 0,
    totalExpenses: 0,
    avgRating: 0,
    workoutsThisMonth: 0,
  });

  useEffect(() => {
    const tasks = getTasks();
    const transactions = getFinanceTransactions();
    const entertainment = getEntertainmentEntries();
    const workouts = getGymWorkouts();

    const completed = tasks.filter(t => t.completed).length;
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const avgRating = entertainment.length > 0
      ? entertainment.reduce((sum, e) => sum + (e.rating || 0), 0) / entertainment.length
      : 0;
    const thisMonth = new Date().getMonth();
    const monthWorkouts = workouts.filter(w => {
      const wMonth = new Date(w.date).getMonth();
      return wMonth === thisMonth;
    }).length;

    setStats({
      tasksTotal: tasks.length,
      tasksCompleted: completed,
      totalIncome: income,
      totalExpenses: expenses,
      avgRating: avgRating,
      workoutsThisMonth: monthWorkouts,
    });
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold text-foreground mb-8">{LANGUAGE.nav.dashboard}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-card border border-border">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">{LANGUAGE.tasks.title}</p>
            <p className="text-3xl font-bold text-primary">
              {stats.tasksCompleted}/{stats.tasksTotal}
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.tasksCompleted / (stats.tasksTotal || 1)) * 100)}% {LANGUAGE.common.empty}
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-card border border-border">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">{LANGUAGE.finance.title}</p>
            <p className="text-3xl font-bold text-accent">
              {(stats.totalIncome - stats.totalExpenses).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              +{stats.totalIncome.toLocaleString()} / -{stats.totalExpenses.toLocaleString()}
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-card border border-border">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">{LANGUAGE.entertainment.title}</p>
            <p className="text-3xl font-bold text-primary">
              {stats.avgRating.toFixed(1)} / 5
            </p>
            <p className="text-xs text-muted-foreground">
              {LANGUAGE.entertainment.rating} {LANGUAGE.common.empty}
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-card border border-border">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">{LANGUAGE.gym.title}</p>
            <p className="text-3xl font-bold text-accent">
              {stats.workoutsThisMonth}
            </p>
            <p className="text-xs text-muted-foreground">
              {LANGUAGE.analytics.thisMonth}
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-card border border-border md:col-span-2">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-foreground">{LANGUAGE.common.empty}</p>
            <div className="h-32 flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                {LANGUAGE.appTitle} - {LANGUAGE.appTitle} - {LANGUAGE.appTitle}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
