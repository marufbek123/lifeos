'use client';

import { useEffect, useState } from 'react';
import { LANGUAGE } from '@/lib/language';
import { getEntertainmentEntries, setEntertainmentEntries } from '@/lib/storage';
import { EntertainmentEntry, EntertainmentType } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TYPES: EntertainmentType[] = ['movie', 'series', 'music', 'game', 'other'];

export default function EntertainmentView() {
  const [entries, setEntriesState] = useState<EntertainmentEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'movie' as EntertainmentType,
    rating: 5,
    notes: '',
    watchedOn: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    setEntriesState(getEntertainmentEntries());
  }, []);

  const handleAddEntry = () => {
    if (!formData.title.trim()) return;

    const newEntry: EntertainmentEntry = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      type: formData.type,
      rating: formData.rating || undefined,
      notes: formData.notes.trim() || undefined,
      watchedOn: formData.watchedOn || undefined,
      createdAt: new Date().toISOString(),
    };

    const updated = [...entries, newEntry];
    setEntriesState(updated);
    setEntertainmentEntries(updated);
    setFormData({ title: '', type: 'movie', rating: 5, notes: '', watchedOn: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntriesState(updated);
    setEntertainmentEntries(updated);
  };

  const getTypeEmoji = (type: EntertainmentType) => {
    switch (type) {
      case 'movie':
        return '🎬';
      case 'series':
        return '📺';
      case 'music':
        return '🎵';
      case 'game':
        return '🎮';
      default:
        return '⭐';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-foreground">{LANGUAGE.entertainment.title}</h2>
        <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground">
          {LANGUAGE.entertainment.addEntry}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 bg-card border border-border mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Nomi
              </label>
              <Input
                placeholder="Film, serial, musiqa..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-input text-foreground border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  {LANGUAGE.entertainment.type}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as EntertainmentType })}
                  className="w-full p-2 bg-input text-foreground border border-border rounded-md text-sm"
                >
                  {TYPES.map(t => (
                    <option key={t} value={t}>{getTypeEmoji(t)} {t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  {LANGUAGE.entertainment.rating}
                </label>
                <div className="flex gap-1 items-center">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold text-accent ml-2 w-8">{formData.rating}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                {LANGUAGE.entertainment.watchedOn}
              </label>
              <Input
                type="date"
                value={formData.watchedOn}
                onChange={(e) => setFormData({ ...formData, watchedOn: e.target.value })}
                className="bg-input text-foreground border-border"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Izohlar
              </label>
              <textarea
                placeholder="Fikrlar va taassurotlar..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2 bg-input text-foreground border border-border rounded-md text-sm"
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button onClick={() => setShowForm(false)} variant="outline">
                {LANGUAGE.common.cancel}
              </Button>
              <Button onClick={handleAddEntry} className="bg-primary text-primary-foreground">
                {LANGUAGE.common.save}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {entries.length === 0 ? (
        <Card className="p-8 text-center bg-card border border-border">
          <p className="text-muted-foreground">{LANGUAGE.entertainment.noEntries}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map(entry => (
            <Card key={entry.id} className="p-4 bg-card border border-border flex flex-col gap-3">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{entry.title}</h3>
                  <span className="text-xl">{getTypeEmoji(entry.type)}</span>
                </div>
                {entry.rating && (
                  <div className="flex gap-1 items-center mb-2">
                    {'⭐'.repeat(Math.floor(entry.rating))}
                    {entry.rating % 1 !== 0 && '✨'}
                    <span className="text-sm text-muted-foreground ml-2">{entry.rating}/5</span>
                  </div>
                )}
                {entry.notes && (
                  <p className="text-sm text-muted-foreground">{entry.notes}</p>
                )}
              </div>
              <div className="flex gap-2 text-xs text-muted-foreground">
                {entry.watchedOn && <span>{new Date(entry.watchedOn).toLocaleDateString('uz-UZ')}</span>}
              </div>
              <Button
                onClick={() => handleDeleteEntry(entry.id)}
                variant="ghost"
                size="sm"
                className="text-destructive self-start"
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
