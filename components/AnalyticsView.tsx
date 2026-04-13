'use client';

import { useEffect, useState } from 'react';
import { LANGUAGE } from '@/lib/language';
import { getTasks, getFinanceTransactions, getEntertainmentEntries, getGymWorkouts } from '@/lib/storage';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsView() {
  const [stats, setStats] = useState({
    tasksWeek: 0,
    tasksMonth: 0,
    taskCompleted: 0,
    avgRating: 0,
    income: 0,
    expenses: 0,
    workoutsMonth: 0,
    categoryData: [] as any[],
    weeklyTasks: [] as any[],
    monthlyExpenses: [] as any[],
  });

  useEffect(() => {
    const tasks = getTasks();
    const transactions = getFinanceTransactions();
    const entertainment = getEntertainmentEntries();
    const workouts = getGymWorkouts();

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Task analytics
    const tasksThisWeek = tasks.filter(t => new Date(t.createdAt) > weekAgo).length;
    const tasksThisMonth = tasks.filter(t => new Date(t.createdAt) > monthStart).length;
    const completedThisMonth = tasks.filter(
      t => t.completed && new Date(t.completedAt || t.createdAt) > monthStart
    ).length;

    // Entertainment
    const avgRating = entertainment.length > 0
      ? entertainment.reduce((sum, e) => sum + (e.rating || 0), 0) / entertainment.length
      : 0;

    // Finance
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Gym
    const thisMonth = now.getMonth();
    const workoutsThisMonth = workouts.filter(w => new Date(w.date).getMonth() === thisMonth).length;

    // Category breakdown
    const expensesByCategory = {} as Record<string, number>;
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    const categoryData = Object.entries(expensesByCategory).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));

    // Weekly task data
    const weeklyTasks = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
      const dayTasks = tasks.filter(t => {
        const tDate = new Date(t.createdAt);
        return tDate.toDateString() === date.toDateString();
      });
      return {
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        tasks: dayTasks.length,
        completed: dayTasks.filter(t => t.completed).length,
      };
    });

    // Monthly expenses
    const monthlyExpenses = Array.from({ length: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth(), i + 1);
      const dayExpenses = transactions
        .filter(t => t.type === 'expense' && new Date(t.date).toDateString() === date.toDateString())
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        day: i + 1,
        expenses: dayExpenses,
      };
    });

    setStats({
      tasksWeek: tasksThisWeek,
      tasksMonth: tasksThisMonth,
      taskCompleted: completedThisMonth,
      avgRating,
      income,
      expenses,
      workoutsMonth: workoutsThisMonth,
      categoryData,
      weeklyTasks,
      monthlyExpenses,
    });
  }, []);

  const COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa07a', '#98d8c8', '#f7dc6f'];

  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold text-foreground mb-8">{LANGUAGE.analytics.title}</h2>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-2">Vazifalar (Bu oy)</p>
          <p className="text-3xl font-bold text-primary">{stats.taskCompleted}</p>
          <p className="text-xs text-muted-foreground mt-2">Jami: {stats.tasksMonth}</p>
        </Card>

        <Card className="p-4 bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-2">{LANGUAGE.entertainment.rating}</p>
          <p className="text-3xl font-bold text-accent">{stats.avgRating.toFixed(1)}/5</p>
          <p className="text-xs text-muted-foreground mt-2">O'rtacha baho</p>
        </Card>

        <Card className="p-4 bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-2">Moliya (Balans)</p>
          <p className={`text-3xl font-bold ${stats.income - stats.expenses >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {(stats.income - stats.expenses).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-2">+{stats.income.toLocaleString()} / -{stats.expenses.toLocaleString()}</p>
        </Card>

        <Card className="p-4 bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-2">Treningleri</p>
          <p className="text-3xl font-bold text-accent">{stats.workoutsMonth}</p>
          <p className="text-xs text-muted-foreground mt-2">{LANGUAGE.analytics.thisMonth}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Tasks */}
        <Card className="p-6 bg-card border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Haftasiga vazifalar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.weeklyTasks}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(18,18,18,0.95)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Legend />
              <Bar dataKey="tasks" fill="#667eea" name="Jami" />
              <Bar dataKey="completed" fill="#4ecdc4" name="Bajarilgan" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Monthly Expenses */}
        <Card className="p-6 bg-card border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Oyiga xarchlar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthlyExpenses.slice(-28)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(18,18,18,0.95)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ff6b6b"
                dot={false}
                strokeWidth={2}
                name="Xarchlar"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Breakdown */}
        {stats.categoryData.length > 0 && (
          <Card className="p-6 bg-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Toifa bo'yicha taqsimot</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Summary Stats */}
        <Card className="p-6 bg-card border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Xulasa</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bu hafta vazifalar:</span>
              <span className="text-foreground font-semibold">{stats.tasksWeek}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bu oy bajarilgan:</span>
              <span className="text-foreground font-semibold">{stats.taskCompleted}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <span className="text-muted-foreground">Jami daromad:</span>
              <span className="text-green-400 font-semibold">{stats.income.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Jami xarchlar:</span>
              <span className="text-red-400 font-semibold">{stats.expenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <span className="text-muted-foreground">Balans:</span>
              <span className={`font-semibold ${stats.income - stats.expenses >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {(stats.income - stats.expenses).toLocaleString()}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
