'use client';

import { useEffect, useState } from 'react';
import { LANGUAGE } from '@/lib/language';
import { getIdeas, setIdeas } from '@/lib/storage';
import { Idea } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function IdeasView() {
  const [ideas, setIdeasState] = useState<Idea[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
  });

  useEffect(() => {
    setIdeasState(getIdeas());
  }, []);

  const handleAddIdea = () => {
    if (!formData.title.trim() || !formData.content.trim()) return;

    const tags = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newIdea: Idea = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      content: formData.content.trim(),
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...ideas, newIdea];
    setIdeasState(updated);
    setIdeas(updated);
    setFormData({ title: '', content: '', tags: '' });
    setShowForm(false);
  };

  const handleDeleteIdea = (id: string) => {
    const updated = ideas.filter(i => i.id !== id);
    setIdeasState(updated);
    setIdeas(updated);
  };

  const allTags = Array.from(new Set(ideas.flatMap(i => i.tags)));

  const filteredIdeas = filterTag
    ? ideas.filter(i => i.tags.includes(filterTag))
    : ideas;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-foreground">{LANGUAGE.ideas.title}</h2>
        <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground">
          {LANGUAGE.ideas.addIdea}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 bg-card border border-border mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                {LANGUAGE.ideas.title}
              </label>
              <Input
                placeholder="G'oya nomi..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-input text-foreground border-border"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                {LANGUAGE.ideas.content}
              </label>
              <textarea
                placeholder="G'oyani batafsilroq tasvirlab bering..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-2 bg-input text-foreground border border-border rounded-md text-sm font-sans"
                rows={5}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                {LANGUAGE.ideas.tags} (Vergul bilan ajrating)
              </label>
              <Input
                placeholder="texnologiya, biznes, sog'liq..."
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="bg-input text-foreground border-border"
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

      {allTags.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            onClick={() => setFilterTag(null)}
            variant={filterTag === null ? 'default' : 'outline'}
            size="sm"
          >
            Barchasi
          </Button>
          {allTags.map(tag => (
            <Button
              key={tag}
              onClick={() => setFilterTag(tag)}
              variant={filterTag === tag ? 'default' : 'outline'}
              size="sm"
            >
              #{tag}
            </Button>
          ))}
        </div>
      )}

      {filteredIdeas.length === 0 ? (
        <Card className="p-8 text-center bg-card border border-border">
          <p className="text-muted-foreground">{LANGUAGE.ideas.noIdeas}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredIdeas.map(idea => (
            <Card key={idea.id} className="p-4 bg-card border border-border flex flex-col gap-3">
              <div>
                <h3 className="font-semibold text-foreground text-lg">{idea.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{idea.content}</p>
              </div>
              {idea.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {idea.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md cursor-pointer hover:bg-primary transition"
                      onClick={() => setFilterTag(tag)}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{new Date(idea.createdAt).toLocaleDateString('uz-UZ')}</span>
                <Button
                  onClick={() => handleDeleteIdea(idea.id)}
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
