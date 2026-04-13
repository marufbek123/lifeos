'use client';

import { useEffect, useState } from 'react';
import { LANGUAGE } from '@/lib/language';
import { getFinanceTransactions, setFinanceTransactions } from '@/lib/storage';
import { FinanceTransaction, TransactionType, FinanceCategory } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TRANSACTION_TYPES: TransactionType[] = ['income', 'expense'];
const EXPENSE_CATEGORIES: FinanceCategory[] = ['food', 'transport', 'entertainment', 'utilities', 'health', 'other'];

export default function FinanceView() {
  const [transactions, setTransactionsState] = useState<FinanceTransaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<TransactionType | 'all'>('all');
  const [formData, setFormData] = useState({
    type: 'expense' as TransactionType,
    category: 'other' as FinanceCategory,
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    setTransactionsState(getFinanceTransactions());
  }, []);

  const handleAddTransaction = () => {
    if (!formData.amount || !formData.amount.trim()) return;

    const newTransaction: FinanceTransaction = {
      id: Date.now().toString(),
      type: formData.type,
      category: formData.category,
      amount: parseInt(formData.amount),
      description: formData.description.trim() || undefined,
      date: formData.date,
      createdAt: new Date().toISOString(),
    };

    const updated = [...transactions, newTransaction];
    setTransactionsState(updated);
    setFinanceTransactions(updated);
    setFormData({ type: 'expense', category: 'other', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactionsState(updated);
    setFinanceTransactions(updated);
  };

  const filteredTransactions = transactions.filter(t => filter === 'all' || t.type === filter);

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-foreground">{LANGUAGE.finance.title}</h2>
        <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground">
          {LANGUAGE.finance.addTransaction}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-2">{LANGUAGE.finance.income}</p>
          <p className="text-2xl font-bold text-green-400">{income.toLocaleString()}</p>
        </Card>
        <Card className="p-4 bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-2">{LANGUAGE.finance.expense}</p>
          <p className="text-2xl font-bold text-red-400">{expenses.toLocaleString()}</p>
        </Card>
        <Card className="p-4 bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-2">Balans</p>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {balance.toLocaleString()}
          </p>
        </Card>
      </div>

      {showForm && (
        <Card className="p-6 bg-card border border-border mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  {LANGUAGE.finance.type}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
                  className="w-full p-2 bg-input text-foreground border border-border rounded-md text-sm"
                >
                  {TRANSACTION_TYPES.map(t => (
                    <option key={t} value={t}>
                      {t === 'income' ? LANGUAGE.finance.income : LANGUAGE.finance.expense}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  {LANGUAGE.finance.category}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as FinanceCategory })}
                  className="w-full p-2 bg-input text-foreground border border-border rounded-md text-sm"
                >
                  {EXPENSE_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  {LANGUAGE.finance.amount}
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="bg-input text-foreground border-border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  {LANGUAGE.finance.date}
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-input text-foreground border-border"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Tavsif
              </label>
              <Input
                placeholder="Tranzaksiya haqida..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-input text-foreground border-border"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button onClick={() => setShowForm(false)} variant="outline">
                {LANGUAGE.common.cancel}
              </Button>
              <Button onClick={handleAddTransaction} className="bg-primary text-primary-foreground">
                {LANGUAGE.common.save}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="flex gap-2 mb-6">
        {(['all', 'income', 'expense'] as const).map(f => (
          <Button
            key={f}
            onClick={() => setFilter(f === 'all' ? 'all' : f)}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
          >
            {f === 'all' ? 'Barchasi' : f === 'income' ? LANGUAGE.finance.income : LANGUAGE.finance.expense}
          </Button>
        ))}
      </div>

      {filteredTransactions.length === 0 ? (
        <Card className="p-8 text-center bg-card border border-border">
          <p className="text-muted-foreground">{LANGUAGE.finance.noTransactions}</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredTransactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(t => (
              <Card key={t.id} className="p-4 bg-card border border-border flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {t.type === 'income' ? '📈' : '📉'}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{t.description || t.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(t.date).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right mr-4">
                  <p className={`font-bold text-lg ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}
                  </p>
                </div>
                <Button
                  onClick={() => handleDeleteTransaction(t.id)}
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
