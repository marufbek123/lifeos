'use client';

import { useEffect, useState } from 'react';
import { LANGUAGE } from '@/lib/language';
import { getGymWorkouts, setGymWorkouts } from '@/lib/storage';
import { GymWorkout, GymExercise } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Split = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms';

const SPLITS: Split[] = ['chest', 'back', 'legs', 'shoulders', 'arms'];

export default function GymView() {
  const [workouts, setWorkoutsState] = useState<GymWorkout[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSplit, setSelectedSplit] = useState<Split>('chest');
  const [exerciseInput, setExerciseInput] = useState('');
  const [exercises, setExercises] = useState<GymExercise[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setWorkoutsState(getGymWorkouts());
  }, []);

  const handleAddExercise = () => {
    if (!exerciseInput.trim()) return;

    const newExercise: GymExercise = {
      id: Date.now().toString(),
      name: exerciseInput.trim(),
      type: 'compound',
      sets: 3,
      reps: 10,
      notes: '',
    };

    setExercises([...exercises, newExercise]);
    setExerciseInput('');
  };

  const handleRemoveExercise = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id));
  };

  const handleAddWorkout = () => {
    if (exercises.length === 0) return;

    const newWorkout: GymWorkout = {
      id: Date.now().toString(),
      split: selectedSplit,
      date: new Date().toISOString().split('T')[0],
      exercises,
      notes: notes.trim() || undefined,
    };

    const updated = [...workouts, newWorkout];
    setWorkoutsState(updated);
    setGymWorkouts(updated);
    setExercises([]);
    setNotes('');
    setShowForm(false);
  };

  const handleDeleteWorkout = (id: string) => {
    const updated = workouts.filter(w => w.id !== id);
    setWorkoutsState(updated);
    setGymWorkouts(updated);
  };

  const getSplitColor = (split: Split) => {
    switch (split) {
      case 'chest':
        return 'text-red-400';
      case 'back':
        return 'text-blue-400';
      case 'legs':
        return 'text-green-400';
      case 'shoulders':
        return 'text-yellow-400';
      case 'arms':
        return 'text-purple-400';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-foreground">{LANGUAGE.gym.title}</h2>
        <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground">
          Mashq qo'sh
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 bg-card border border-border mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                {LANGUAGE.gym.split}
              </label>
              <select
                value={selectedSplit}
                onChange={(e) => setSelectedSplit(e.target.value as Split)}
                className="w-full p-2 bg-input text-foreground border border-border rounded-md text-sm"
              >
                {SPLITS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                {LANGUAGE.gym.exercises}
              </label>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Mashq nomi..."
                  value={exerciseInput}
                  onChange={(e) => setExerciseInput(e.target.value)}
                  className="bg-input text-foreground border-border"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddExercise()}
                />
                <Button onClick={handleAddExercise} variant="outline">
                  {LANGUAGE.common.add}
                </Button>
              </div>

              {exercises.length > 0 && (
                <div className="space-y-2 mb-4 bg-secondary rounded-md p-3">
                  {exercises.map(ex => (
                    <div key={ex.id} className="flex justify-between items-center bg-input p-2 rounded text-sm">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{ex.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {ex.sets}x{ex.reps} {ex.weight && `@ ${ex.weight}kg`}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleRemoveExercise(ex.id)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Izohlar
              </label>
              <textarea
                placeholder="Trening haqida..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 bg-input text-foreground border border-border rounded-md text-sm"
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button onClick={() => setShowForm(false)} variant="outline">
                {LANGUAGE.common.cancel}
              </Button>
              <Button onClick={handleAddWorkout} className="bg-primary text-primary-foreground">
                {LANGUAGE.common.save}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {workouts.length === 0 ? (
        <Card className="p-8 text-center bg-card border border-border">
          <p className="text-muted-foreground">Hali trening yo'q</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {workouts.map(workout => (
            <Card key={workout.id} className="p-6 bg-card border border-border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-xl font-bold ${getSplitColor(workout.split)}`}>
                    {workout.split.charAt(0).toUpperCase() + workout.split.slice(1)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(workout.date).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
                <Button
                  onClick={() => handleDeleteWorkout(workout.id)}
                  variant="ghost"
                  className="text-destructive"
                >
                  {LANGUAGE.common.delete}
                </Button>
              </div>

              <div className="space-y-2 mb-4">
                {workout.exercises.map(ex => (
                  <div key={ex.id} className="bg-secondary rounded-md p-3">
                    <p className="font-medium text-foreground">{ex.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {ex.sets}x{ex.reps} {ex.weight && `@ ${ex.weight}kg`}
                      {ex.notes && ` - ${ex.notes}`}
                    </p>
                  </div>
                ))}
              </div>

              {workout.notes && (
                <div className="bg-input rounded-md p-3 text-sm text-muted-foreground">
                  {workout.notes}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
