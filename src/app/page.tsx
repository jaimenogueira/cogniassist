
'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Zap, Lightbulb, Brain, Activity, CalendarDays, User } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AddTaskDialog } from '@/components/app/add-task-dialog';
import { MemoryTipsCard } from '@/components/app/memory-tips-card';
import { TaskList } from '@/components/app/task-list';
import { ReminderList } from '@/components/app/reminder-list';
import { MiniCalendarView } from '@/components/app/mini-calendar-view';
// ProductivityTipsCarousel is removed as per user request to not show it on the main dashboard.

const initialTasks = [
  { id: '1', title: 'Reunião Matinal (Stand-up)', time: '9:00', completed: false, priority: 'high' },
  { id: '2', title: 'Revisar Proposta do Projecto', time: '11:00', completed: false, priority: 'medium' }, // Projecto
  { id: '3', title: 'Pausa para Almoço', time: '13:00', completed: false, priority: 'low' },
];

const initialReminders = [
    { id: 'r1', title: 'Ligar para a Mãe', time: '18:00' }, // à Mãe
    { id: 'r2', title: 'Pagar Conta de Luz', time: 'Amanhã 10:00' },
];

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [reminders, setReminders] = useState(initialReminders);
  const [productivityScore, setProductivityScore] = useState(0);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<string>('Bem-vindo(a) ao CogniAssist!');


  useEffect(() => {
    const storedSettings = localStorage.getItem('userSettings');
    let currentUserName = 'Utilizador'; // Default name
    if (storedSettings) {
        try {
            const parsedSettings = JSON.parse(storedSettings);
            if (parsedSettings.fullName && parsedSettings.fullName.trim() !== '') {
                currentUserName = parsedSettings.fullName.split(' ')[0]; // Get first name
            }
        } catch (e) {
            console.error("Erro ao analisar userSettings do localStorage", e);
        }
    }
    setUserName(currentUserName);
  }, []);

  useEffect(() => {
    if (userName) {
        const messages = [
            `Bem-vindo(a), ${userName}! Vamos fazer o dia de hoje valer a pena 💪`,
            `Olá, ${userName}! Pronto(a) para mais um dia de crescimento?`,
            `${userName}, o seu foco começa agora. Vamos a isso!`,
            `Que bom vê-lo(a), ${userName}! Hora de dar o seu melhor.`
        ];
        const randomIndex = Math.floor(Math.random() * messages.length);
        setWelcomeMessage(messages[randomIndex]);
    } else {
        // Fallback or loading state if userName is null (e.g., still loading)
        // For now, uses the initial welcomeMessage state or a generic one if userName becomes null after being set
         setWelcomeMessage('Bem-vindo(a) ao CogniAssist! Personalize as suas configurações para uma melhor experiência.');
    }
  }, [userName]);


  useEffect(() => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const score = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    setProductivityScore(score);
  }, [tasks]);

  const handleAddTask = (newTask: { title: string; date: Date; time: string; description: string; priority: 'low' | 'medium' | 'high' }) => {
    const formattedTime = newTask.date ? new Date(newTask.date).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : '';

    const taskToAdd = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      time: newTask.time || formattedTime,
      completed: false,
      priority: newTask.priority,
      description: newTask.description,
      date: newTask.date,
    };
    setTasks(prevTasks => [...prevTasks, taskToAdd]);
    console.log('Nova Tarefa Adicionada:', taskToAdd);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };


  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center">
           {userName ? <Brain className="mr-2 h-8 w-8 text-accent" /> : <User className="mr-2 h-8 w-8 text-accent" />}
           {welcomeMessage}
        </h1>
        <Button onClick={() => setIsAddTaskDialogOpen(true)} size="lg" className="shadow-md">
          <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Tarefa
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center"><Activity className="mr-2 h-5 w-5 text-primary" /> Tarefas de Hoje</CardTitle>
              <CardDescription>O que precisa da sua atenção hoje.</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList tasks={tasks} onToggleComplete={toggleTaskCompletion} />
            </CardContent>
          </Card>

          {/* ProductivityTipsCarousel removed from here */}

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary" /> Próximos Lembretes</CardTitle>
                <CardDescription>Não se esqueça!</CardDescription>
            </CardHeader>
            <CardContent>
                <ReminderList reminders={reminders} />
            </CardContent>
           </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center"><Zap className="mr-2 h-5 w-5 text-yellow-500" /> Pulso de Produtividade</CardTitle>
              <CardDescription>O seu nível de foco hoje.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
               <Progress value={productivityScore} className="w-full h-3" />
               <p className="text-sm text-muted-foreground text-center">{productivityScore}% Concluído</p>
               <p className="text-center text-2xl">
                 {productivityScore > 75 ? '🚀' : productivityScore > 50 ? '👍' : productivityScore > 25 ? '🙂' : '🤔'}
               </p>
            </CardContent>
          </Card>

          <MemoryTipsCard />
          
          <div className="hidden md:block">
            <MiniCalendarView />
          </div>
        </div>
      </div>

      <AddTaskDialog
        isOpen={isAddTaskDialogOpen}
        onClose={() => setIsAddTaskDialogOpen(false)}
        onAddTask={handleAddTask}
      />

    </div>
  );
}

