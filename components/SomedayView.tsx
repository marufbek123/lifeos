'use client';

import { useEffect, useState } from 'react';
import { LANGUAGE } from '@/lib/language';
import { getSomedayIdeas, setSomedayIdeas } from '@/lib/storage';
import { SomedayIdea } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SomedayView() {
  const [ideas, setIdeasState] = useState<SomedayIdea[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIdea, setSelectedIdea] = useState<SomedayIdea | null>(null);

  useEffect(() => {
    setIdeasState(getSomedayIdeas());
  }, []);

  const handleAddIdea = () => {
    if (!title.trim()) return;

    const newIdea: SomedayIdea = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const updated = [...ideas, newIdea];
    setIdeasState(updated);
    setSomedayIdeas(updated);
    setTitle('');
    setDescription('');
    setShowForm(false);
  };

  const handleDeleteIdea = (id: string) => {
    const updated = ideas.filter(i => i.id !== id);
    setIdeasState(updated);
    setSomedayIdeas(updated);
    if (selectedIdea?.id === id) setSelectedIdea(null);
  };

  const handlePickRandom = () => {
    if (ideas.length === 0) return;
    const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
    setSelectedIdea(randomIdea);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-foreground">{LANGUAGE.someday.title}</h2>
        <div className="flex gap-2">
          <Button onClick={handlePickRandom} variant="outline">
            {LANGUAGE.someday.pickRandom}
          </Button>
          <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground">
            {LANGUAGE.someday.addIdea}
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="p-6 bg-card border border-border mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Nomi
              </label>
              <Input
                placeholder="G'oya nomi..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-input text-foreground border-border"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Tavsif
              </label>
              <textarea
                placeholder="G'oya haqida batafsilroq..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 bg-input text-foreground border border-border rounded-md text-sm"
                rows={4}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button onClick={() => setShowForm(false)} variant="outline">
                {LANGUAGE.common.cancel}
              </Button>
              <Button onClick={handleAddIdea} className="bg-primary text-primary-foreground">
                {LANGUAGE.common.save}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {selectedIdea && (
        <Card className="p-6 bg-accent bg-opacity-10 border border-accent mb-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-accent font-semibold mb-2">Tanlangan g'oya</p>
              <h3 className="text-2xl font-bold text-foreground">{selectedIdea.title}</h3>
              {selectedIdea.description && (
                <p className="text-muted-foreground mt-2">{selectedIdea.description}</p>
              )}
            </div>
            <Button
              onClick={() => setSelectedIdea(null)}
              variant="ghost"
              className="text-muted-foreground"
            >
              ✕
            </Button>
          </div>
        </Card>
      )}

      {ideas.length === 0 ? (
        <Card className="p-8 text-center bg-card border border-border">
          <p className="text-muted-foreground">{LANGUAGE.someday.noIdeas}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map(idea => (
            <Card
              key={idea.id}
              className="p-4 bg-card border border-border flex flex-col gap-3 hover:border-primary transition cursor-pointer"
              onClick={() => setSelectedIdea(idea)}
            >
              <div>
                <h3 className="font-semibold text-foreground">{idea.title}</h3>
                {idea.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{idea.description}</p>
                )}
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteIdea(idea.id);
                }}
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
