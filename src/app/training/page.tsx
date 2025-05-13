
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dumbbell, PlusCircle, Edit3, Trash2, Trophy, Footprints, Activity, Zap, Brain, Puzzle, ListOrdered, LayoutGrid, Crosshair, BookOpenText, ClipboardCheck, HelpCircle } from 'lucide-react';
import { AddWorkoutDialog } from '@/components/app/add-workout-dialog';
import { WorkoutCard } from '@/components/app/workout-card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export type WorkoutStatus = 'pendente' | 'compareceu' | 'concluido';

export interface Workout {
  id: string;
  name: string;
  dayOfWeek: 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado' | 'Domingo';
  time?: string;
  description?: string;
  status: WorkoutStatus;
  sportIcon?: React.ElementType; // For specific sport icon
}

interface CognitiveGame {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  actionText: string;
}

const initialSports = [
  { value: 'corrida', label: 'Corrida', icon: Footprints },
  { value: 'musculacao', label: 'Musculação', icon: Dumbbell },
  { value: 'yoga', label: 'Yoga', icon: Activity }, 
  { value: 'natacao', label: 'Natação', icon: Activity }, 
  { value: 'outro', label: 'Outro', icon: Activity },
];

const cognitiveGamesList: CognitiveGame[] = [
  { id: 'memory-sequence', title: 'Sequência de Memória', description: 'Memorize e repita a sequência apresentada. A dificuldade aumenta a cada nível.', icon: ListOrdered, actionText: 'Jogar (Em Breve)' },
  { id: 'quick-pairing', title: 'Pares Rápidos', description: 'Encontre todos os pares de cartas escondidas no menor número de tentativas possível.', icon: LayoutGrid, actionText: 'Jogar (Em Breve)' },
  { id: 'focus-distractions', title: 'Foco com Distrações', description: 'Selecione os alvos corretos enquanto distrações aparecem. Teste a sua concentração!', icon: Crosshair, actionText: 'Jogar (Em Breve)' },
  { id: 'quick-story', title: 'História Rápida', description: 'Leia uma pequena história e responda a uma pergunta relacionada para testar a sua compreensão.', icon: BookOpenText, actionText: 'Jogar (Em Breve)' },
  { id: 'mental-list', title: 'Lista Mental', description: 'Visualize uma lista de itens por alguns segundos e depois recorde-os na ordem correta.', icon: ClipboardCheck, actionText: 'Jogar (Em Breve)' },
];

export default function TrainingPage() {
  const [preferredSport, setPreferredSport] = useState<string>('');
  const [weeklyRoutine, setWeeklyRoutine] = useState<Workout[]>([]);
  const [physicalTrainingPoints, setPhysicalTrainingPoints] = useState(0);
  const [cognitiveGamePoints, setCognitiveGamePoints] = useState(0);
  const [isAddWorkoutDialogOpen, setIsAddWorkoutDialogOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const { toast } = useToast();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSport = localStorage.getItem('preferredSport');
    if (savedSport) setPreferredSport(savedSport);

    const savedRoutine = localStorage.getItem('weeklyRoutine');
    if (savedRoutine) {
        try {
            const parsedRoutine = JSON.parse(savedRoutine);
            const routineWithIcons = parsedRoutine.map((workout: Workout) => {
                const sportDetails = initialSports.find(s => 
                    s.label.toLowerCase() === workout.name.toLowerCase().split(' ')[0] || 
                    (workout.sportIcon && typeof workout.sportIcon === 'string' && s.label === workout.sportIcon)
                );
                return {
                    ...workout,
                    sportIcon: sportDetails ? sportDetails.icon : Activity
                };
            });
            setWeeklyRoutine(routineWithIcons);
        } catch (e) {
            console.error("Falha ao analisar rotina semanal do localStorage", e);
            setWeeklyRoutine([]);
        }
    }
    
    const savedPhysicalPoints = localStorage.getItem('physicalTrainingPoints');
    if (savedPhysicalPoints) setPhysicalTrainingPoints(parseInt(savedPhysicalPoints, 10));

    const savedCognitivePoints = localStorage.getItem('cognitiveGamePoints');
    if (savedCognitivePoints) setCognitiveGamePoints(parseInt(savedCognitivePoints, 10));

  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (preferredSport) localStorage.setItem('preferredSport', preferredSport);
  }, [preferredSport]);

  useEffect(() => {
    const routineToSave = weeklyRoutine.map(w => ({...w, sportIcon: w.sportIcon ? (w.sportIcon as Function).name || w.sportIcon.toString() : undefined }));
    localStorage.setItem('weeklyRoutine', JSON.stringify(routineToSave));
  }, [weeklyRoutine]);

  useEffect(() => {
    localStorage.setItem('physicalTrainingPoints', physicalTrainingPoints.toString());
  }, [physicalTrainingPoints]);

  useEffect(() => {
    localStorage.setItem('cognitiveGamePoints', cognitiveGamePoints.toString());
  }, [cognitiveGamePoints]);

  const totalActivityPoints = physicalTrainingPoints + cognitiveGamePoints;

  const handleAddOrUpdateWorkout = (workoutData: Omit<Workout, 'id' | 'status' | 'sportIcon'> & { id?: string }) => {
    const sportDetails = initialSports.find(s => s.value === preferredSport) || initialSports.find(s => s.label.toLowerCase() === workoutData.name.toLowerCase().split(" ")[0]);
    const workoutWithAssignedIcon: Omit<Workout, 'id' | 'status'> = {
        ...workoutData,
        sportIcon: sportDetails?.icon || Activity,
    }

    if (editingWorkout) {
      setWeeklyRoutine(prev =>
        prev.map(w => (w.id === editingWorkout.id ? { ...editingWorkout, ...workoutWithAssignedIcon, sportIcon: workoutWithAssignedIcon.sportIcon } : w))
      );
      toast({ title: "Treino Atualizado!", description: `"${workoutData.name}" foi atualizado.` });
    } else {
      setWeeklyRoutine(prev => [...prev, { ...workoutWithAssignedIcon, sportIcon: workoutWithAssignedIcon.sportIcon, id: `workout-${Date.now()}`, status: 'pendente' }]);
      toast({ title: "Novo Treino Adicionado!", description: `"${workoutData.name}" foi adicionado à sua rotina.` });
    }
    setEditingWorkout(null);
  };

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout);
    setIsAddWorkoutDialogOpen(true);
  };

  const handleDeleteWorkout = (workoutId: string) => {
    setWeeklyRoutine(prev => prev.filter(w => w.id !== workoutId));
    toast({ title: "Treino Removido", description: "O treino foi removido da sua rotina.", variant: "destructive" });
  };

  const handleWorkoutStatusChange = (workoutId: string, newStatus: WorkoutStatus) => {
    let pointsChange = 0;
    const currentWorkout = weeklyRoutine.find(w => w.id === workoutId);
    if (!currentWorkout) return;

    const oldStatus = currentWorkout.status;

    const ATTEND_POINTS = 10;
    const COMPLETE_POINTS_ADDITIONAL = 15;
    const COMPLETE_POINTS_TOTAL = ATTEND_POINTS + COMPLETE_POINTS_ADDITIONAL;

    if (newStatus === 'compareceu') {
      if (oldStatus === 'pendente') {
        pointsChange = ATTEND_POINTS;
      } else if (oldStatus === 'concluido') { // Unchecked "Concluído"
        pointsChange = -COMPLETE_POINTS_ADDITIONAL;
      }
    } else if (newStatus === 'concluido') {
      if (oldStatus === 'pendente') { 
        pointsChange = COMPLETE_POINTS_TOTAL;
      } else if (oldStatus === 'compareceu') {
        pointsChange = COMPLETE_POINTS_ADDITIONAL;
      }
    } else if (newStatus === 'pendente') { 
      if (oldStatus === 'compareceu') {
        pointsChange = -ATTEND_POINTS;
      } else if (oldStatus === 'concluido') {
        pointsChange = -COMPLETE_POINTS_TOTAL;
      }
    }

    setWeeklyRoutine(prev =>
      prev.map(w => (w.id === workoutId ? { ...w, status: newStatus } : w))
    );
    setPhysicalTrainingPoints(prev => Math.max(0, prev + pointsChange)); // Ensure points don't go negative

    if (pointsChange > 0) {
        toast({ title: "Progresso Registado!", description: `Ganhou ${pointsChange} pontos de treino.` });
    } else if (pointsChange < 0) {
        toast({ title: "Progresso Atualizado", description: `Os seus pontos de treino foram ajustados em ${pointsChange}.` });
    }
  };

  const workoutsThisWeek = weeklyRoutine.length;
  const completedThisWeek = weeklyRoutine.filter(w => w.status === 'concluido' || w.status === 'compareceu').length;
  const weeklyProgress = workoutsThisWeek > 0 ? (completedThisWeek / workoutsThisWeek) * 100 : 0;

  const getSportIcon = () => {
    const sport = initialSports.find(s => s.value === preferredSport);
    return sport?.icon || Activity; 
  };
  const SportIcon = getSportIcon();

  const handlePlayGame = (gameTitle: string) => {
    toast({
      title: `A Abrir ${gameTitle}`,
      description: "Esta funcionalidade de jogo estará disponível em breve!",
    });
    // Placeholder: Simulate earning points
    // setCognitiveGamePoints(prev => prev + 5); 
    // toast({ title: "Jogo Concluído!", description: "Ganhou 5 pontos cognitivos (simulado)." });
  };


  return (
    <div className="space-y-6">
      <header className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <Dumbbell className="mr-2 h-8 w-8 text-primary" /> Monitor de Treino Físico e Cognitivo
        </h1>
      </header>
      <p className="text-muted-foreground">
        Registe os seus desportos, planeie a sua rotina semanal, jogue jogos cognitivos e acompanhe o seu progresso.
      </p>
      <div className="flex justify-end mt-4">
        <Button onClick={() => { setEditingWorkout(null); setIsAddWorkoutDialogOpen(true); }} size="lg" className="shadow-md">
          <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Treino Físico
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center"><SportIcon className="mr-2 h-5 w-5 text-accent" /> O Meu Perfil de Actividade</CardTitle>
            <CardDescription>O seu desporto e progresso geral.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="preferred-sport" className="text-sm font-medium text-foreground block mb-1">Desporto Preferido</label>
              <Select value={preferredSport} onValueChange={setPreferredSport}>
                <SelectTrigger id="preferred-sport">
                  <SelectValue placeholder="Selecione o seu desporto" />
                </SelectTrigger>
                <SelectContent>
                  {initialSports.map(sport => (
                    <SelectItem key={sport.value} value={sport.value}>
                      <div className="flex items-center">
                        <sport.icon className="mr-2 h-4 w-4" /> {sport.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Pontos Totais de Actividade:</p>
              <div className="flex items-center">
                 <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                 <p className="text-2xl font-bold text-accent">{totalActivityPoints}</p>
              </div>
              <p className="text-xs text-muted-foreground">Físico: {physicalTrainingPoints} | Cognitivo: {cognitiveGamePoints}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Progresso Semanal (Físico):</p>
              <Progress value={weeklyProgress} className="h-3 transition-all duration-300" />
              <p className="text-xs text-muted-foreground text-center">{completedThisWeek}/{workoutsThisWeek} treinos ({Math.round(weeklyProgress)}%)</p>
            </div>
          </CardContent>
           <CardFooter>
             <p className="text-xs text-muted-foreground italic">Marque os seus treinos para ganhar pontos!</p>
           </CardFooter>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">Rotina de Treino Físico Semanal</CardTitle>
              <CardDescription>Os seus treinos físicos planeados para a semana.</CardDescription>
            </CardHeader>
            <CardContent>
              {weeklyRoutine.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum treino físico adicionado ainda. Clique em "Adicionar Treino Físico" para começar.
                </p>
              ) : (
                <div className="space-y-4">
                  {weeklyRoutine.map(workout => {
                    const EffectiveIcon = workout.sportIcon || initialSports.find(s => s.label.toLowerCase() === workout.name.toLowerCase().split(' ')[0])?.icon || Activity;
                    return (
                        <WorkoutCard
                        key={workout.id}
                        workout={workout}
                        onStatusChange={handleWorkoutStatusChange}
                        onEdit={() => handleEditWorkout(workout)}
                        onDelete={() => handleDeleteWorkout(workout.id)}
                        sportIcon={EffectiveIcon}
                        />
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

       <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center"><Brain className="mr-2 h-6 w-6 text-primary" /> Jogos Cognitivos</CardTitle>
          <CardDescription>Exercite a sua mente com estes jogos rápidos e divertidos. Ganhe pontos cognitivos!</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cognitiveGamesList.map((game) => (
            <Card key={game.id} className="flex flex-col shadow-sm hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                    <game.icon className="h-7 w-7 text-accent mr-3" />
                    <CardTitle className="text-md">{game.title}</CardTitle>
                </div>
                <CardDescription className="text-xs leading-relaxed h-16 overflow-y-auto">{game.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-3">
                <Button onClick={() => handlePlayGame(game.title)} variant="outline" size="sm" className="w-full" disabled>
                  {game.actionText.includes("Em Breve") ? <HelpCircle className="mr-2 h-4 w-4" /> : null}
                  {game.actionText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground italic w-full text-center">Lembretes para jogos cognitivos podem ser configurados nos Ajustes.</p>
        </CardFooter>
      </Card>


      <Separator />

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center"><Trophy className="mr-2 h-5 w-5 text-yellow-400" /> Conquistas e Metas</CardTitle>
          <CardDescription>O seu mural de conquistas (em breve!).</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 items-center justify-center">
           <div className="text-center p-3 border rounded-lg bg-muted/50 w-32 opacity-50">
                <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                <p className="text-xs font-medium">Primeiro Treino!</p>
                <p className="text-xs text-muted-foreground">Complete o seu 1º treino</p>
           </div>
            <div className="text-center p-3 border rounded-lg bg-muted/50 w-32 opacity-50">
                <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                <p className="text-xs font-medium">Semana Consistente</p>
                <p className="text-xs text-muted-foreground">3 treinos na semana</p>
           </div>
           <div className="text-center p-3 border rounded-lg bg-muted/50 w-32 opacity-50">
                <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                <p className="text-xs font-medium">Mestre dos Pontos</p>
                <p className="text-xs text-muted-foreground">Acumule 100 pontos de actividade</p>
           </div>
            <div className="text-center p-3 border rounded-lg bg-muted/50 w-32 opacity-50">
                <Brain className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                <p className="text-xs font-medium">Mente Afiada</p>
                <p className="text-xs text-muted-foreground">Jogue 5 jogos cognitivos</p>
           </div>
           <p className="w-full text-center text-muted-foreground text-sm mt-4">Mais conquistas e desafios em breve!</p>
        </CardContent>
      </Card>


      <AddWorkoutDialog
        isOpen={isAddWorkoutDialogOpen}
        onClose={() => { setIsAddWorkoutDialogOpen(false); setEditingWorkout(null); }}
        onSave={handleAddOrUpdateWorkout}
        workout={editingWorkout}
      />
    </div>
  );
}

