
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
import { PlusCircle, Zap, Lightbulb, Brain, Activity, CalendarDays, User, XCircle, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AddTaskDialog } from '@/components/app/add-task-dialog';
import type { TaskFormValues } from '@/components/app/add-task-dialog';
import { MemoryTipsCard } from '@/components/app/memory-tips-card';
import { TaskList } from '@/components/app/task-list';
import { ReminderList } from '@/components/app/reminder-list';
import { MiniCalendarView } from '@/components/app/mini-calendar-view';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export interface Task {
  id: string;
  title: string;
  time?: string;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  date?: Date;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Reunião Matinal (Stand-up)', time: '9:00', status: 'pending', priority: 'high', date: new Date() },
  { id: '2', title: 'Revisar Proposta do Projecto', time: '11:00', status: 'pending', priority: 'medium', date: new Date() },
  { id: '3', title: 'Pausa para Almoço', time: '13:00', status: 'pending', priority: 'low', date: new Date() },
];

const initialReminders: Reminder[] = [
    { id: 'r1', title: 'Ligar para a Mãe', time: '18:00' },
    { id: 'r2', title: 'Pagar Conta de Luz', time: 'Amanhã 10:00' },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [productivityScore, setProductivityScore] = useState(0);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<string>('Bem-vindo(a) ao CogniAssist!');
  const { toast } = useToast();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDeleteType, setItemToDeleteType] = useState<'task' | 'reminder' | null>(null);
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);
  const [itemToDeleteTitle, setItemToDeleteTitle] = useState<string>("");


  useEffect(() => {
    // Load tasks from localStorage
    const storedTasks = localStorage.getItem('cogniAssistTasks');
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          date: task.date ? new Date(task.date) : undefined,
        }));
        setTasks(parsedTasks);
      } catch (e) {
        console.error("Erro ao analisar tarefas do localStorage", e);
        setTasks(initialTasks); // Fallback to initial if parsing fails
      }
    } else {
      setTasks(initialTasks);
    }

    // Load reminders from localStorage
    const storedReminders = localStorage.getItem('cogniAssistReminders');
    if (storedReminders) {
      try {
        setReminders(JSON.parse(storedReminders));
      } catch (e) {
        console.error("Erro ao analisar lembretes do localStorage", e);
        setReminders(initialReminders); // Fallback
      }
    } else {
      setReminders(initialReminders);
    }
  }, []);

  useEffect(() => {
    // Save tasks to localStorage
    if (tasks.length > 0 || localStorage.getItem('cogniAssistTasks')) { // Avoid saving empty initial array if nothing was loaded
        localStorage.setItem('cogniAssistTasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    // Save reminders to localStorage
    if (reminders.length > 0 || localStorage.getItem('cogniAssistReminders')) {
        localStorage.setItem('cogniAssistReminders', JSON.stringify(reminders));
    }
  }, [reminders]);


  useEffect(() => {
    const storedSettings = localStorage.getItem('userSettings');
    let currentUserName = 'Utilizador'; 
    if (storedSettings) {
        try {
            const parsedSettings = JSON.parse(storedSettings);
            if (parsedSettings.fullName && parsedSettings.fullName.trim() !== '') {
                currentUserName = parsedSettings.fullName.split(' ')[0]; 
            }
        } catch (e) {
            console.error("Erro ao analisar userSettings do localStorage", e);
        }
    }
    setUserName(currentUserName);
  }, []);

  useEffect(() => {
    if (userName && userName !== 'Utilizador') {
        const messages = [
            `Bem-vindo(a), ${userName}!`,
            `Força hoje, ${userName}!`,
            `Vamos a isso, ${userName}!`,
            `${userName}, foco total hoje!`,
            `Hora de avançar, ${userName}!`,
            `Conto consigo, ${userName}!`,
            `Novo dia, ${userName}, mente fresca!`,
        ];
        const randomIndex = Math.floor(Math.random() * messages.length);
        setWelcomeMessage(messages[randomIndex]);
    } else {
         setWelcomeMessage('Bem-vindo(a) ao CogniAssist! Personalize as suas configurações.');
    }
  }, [userName]);


  useEffect(() => {
    const completedTasksCount = tasks.filter(task => task.status === 'completed').length;
    const activeTasksCount = tasks.filter(task => task.status !== 'cancelled').length;
    const score = activeTasksCount > 0 ? Math.round((completedTasksCount / activeTasksCount) * 100) : 0;
    setProductivityScore(score);
  }, [tasks]);

  const handleAddTask = (newTaskData: TaskFormValues) => {
    const taskToAdd: Task = {
      id: `task-${Date.now()}`,
      title: newTaskData.title,
      time: newTaskData.time || (newTaskData.date ? new Date(newTaskData.date).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : ''),
      status: 'pending',
      priority: newTaskData.priority,
      description: newTaskData.description,
      date: newTaskData.date,
    };
    setTasks(prevTasks => [taskToAdd, ...prevTasks]);
    toast({ title: "Tarefa Adicionada", description: `"${taskToAdd.title}" foi adicionada.` });
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          if (task.status === 'pending') return { ...task, status: 'completed' };
          if (task.status === 'completed') return { ...task, status: 'pending' };
        }
        return task;
      })
    );
  };

  const handleCancelTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: 'cancelled' } : task
      )
    );
    const cancelledTask = tasks.find(t => t.id === taskId);
    if (cancelledTask) {
        toast({ title: "Tarefa Cancelada", description: `"${cancelledTask.title}" foi marcada como cancelada.`, variant: "default" });
    }
  };

  const requestDeleteConfirmation = (id: string, type: 'task' | 'reminder') => {
    setItemToDeleteId(id);
    setItemToDeleteType(type);
    const item = type === 'task' ? tasks.find(t => t.id === id) : reminders.find(r => r.id === id);
    setItemToDeleteTitle(item?.title || "este item");
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteItem = () => {
    if (!itemToDeleteId || !itemToDeleteType) return;

    if (itemToDeleteType === 'task') {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== itemToDeleteId));
      toast({ title: "Tarefa Eliminada", description: `A tarefa "${itemToDeleteTitle}" foi eliminada permanentemente.`, variant: "destructive" });
    } else if (itemToDeleteType === 'reminder') {
      setReminders(prevReminders => prevReminders.filter(reminder => reminder.id !== itemToDeleteId));
      toast({ title: "Lembrete Eliminado", description: `O lembrete "${itemToDeleteTitle}" foi eliminado permanentemente.`, variant: "destructive" });
    }
    closeDeleteDialog();
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setItemToDeleteId(null);
    setItemToDeleteType(null);
    setItemToDeleteTitle("");
  };


  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center">
           {userName && userName !== 'Utilizador' ? <Brain className="mr-2 h-8 w-8 text-accent" /> : <User className="mr-2 h-8 w-8 text-accent" />}
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
              <TaskList
                tasks={tasks}
                onToggleComplete={toggleTaskCompletion}
                onCancelTask={handleCancelTask}
                onDeleteTaskRequest={(taskId) => requestDeleteConfirmation(taskId, 'task')}
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary" /> Próximos Lembretes</CardTitle>
                <CardDescription>Não se esqueça!</CardDescription>
            </CardHeader>
            <CardContent>
                <ReminderList
                  reminders={reminders}
                  onDeleteReminderRequest={(reminderId) => requestDeleteConfirmation(reminderId, 'reminder')}
                />
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Eliminação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja eliminar "{itemToDeleteTitle}" permanentemente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteItem} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
