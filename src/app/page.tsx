
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
import { PlusCircle, Zap, Brain, Activity, CalendarDays, User } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';


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
  { id: '1', title: 'Reunião Matinal (Stand-up)', time: '09:00', status: 'pending', priority: 'high', date: new Date() },
  { id: '2', title: 'Revisar Proposta do Projecto', time: '11:00', status: 'pending', priority: 'medium', date: new Date(new Date().setDate(new Date().getDate() + 1)) }, // Tomorrow
  { id: '3', title: 'Pausa para Almoço', time: '13:00', status: 'pending', priority: 'low', date: new Date() },
  { id: '4', title: 'Consulta Médica', status: 'pending', priority: 'high', date: new Date(new Date().setDate(new Date().getDate() + 2))}, // Day after tomorrow
  { id: '5', title: 'Comprar Bilhetes Concerto', status: 'pending', priority: 'medium' }, // Undated, assumed today
];

const initialReminders: Reminder[] = [
    { id: 'r1', title: 'Ligar para a Mãe', time: '18:00' },
    { id: 'r2', title: 'Pagar Conta de Luz', time: 'Amanhã 10:00' },
];

export default function Home() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [allReminders, setAllReminders] = useState<Reminder[]>([]);
  
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);

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
    const storedTasks = localStorage.getItem('cogniAssistTasks');
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          date: task.date ? new Date(task.date) : undefined,
        }));
        setAllTasks(parsedTasks);
      } catch (e) {
        console.error("Erro ao analisar tarefas do localStorage", e);
        setAllTasks(initialTasks); 
      }
    } else {
      setAllTasks(initialTasks);
    }

    const storedReminders = localStorage.getItem('cogniAssistReminders');
    if (storedReminders) {
      try {
        setAllReminders(JSON.parse(storedReminders));
      } catch (e) {
        console.error("Erro ao analisar lembretes do localStorage", e);
        setAllReminders(initialReminders);
      }
    } else {
      setAllReminders(initialReminders);
    }
  }, []);

  useEffect(() => {
    if (allTasks.length > 0 || localStorage.getItem('cogniAssistTasks')) {
        localStorage.setItem('cogniAssistTasks', JSON.stringify(allTasks));
    }
  }, [allTasks]);

  useEffect(() => {
    if (allReminders.length > 0 || localStorage.getItem('cogniAssistReminders')) {
        localStorage.setItem('cogniAssistReminders', JSON.stringify(allReminders));
    }
  }, [allReminders]);

  const isDateToday = (date: Date | undefined): boolean => {
    if (!date) return true; // Undated tasks are considered for today
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isDateInFuture = (date: Date | undefined): boolean => {
    if (!date) return false; 
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const taskDate = new Date(date);
    taskDate.setHours(0,0,0,0);
    return taskDate > today;
  };

  useEffect(() => {
    const activeTasks = allTasks.filter(task => task.status !== 'cancelled');

    const filteredTodayTasks = activeTasks.filter(task => isDateToday(task.date));
    const filteredUpcomingTasks = activeTasks.filter(task => isDateInFuture(task.date) && !isDateToday(task.date));
    
    const sortTasks = (a: Task, b: Task) => {
      if (a.time && b.time) {
        if (a.time < b.time) return -1;
        if (a.time > b.time) return 1;
      } else if (a.time) {
        return -1; 
      } else if (b.time) {
        return 1;
      }
  
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] < priorityOrder[b.priority]) return -1;
      if (priorityOrder[a.priority] > priorityOrder[b.priority]) return 1;
      
      return a.title.localeCompare(b.title);
    };
  
    setTodayTasks(filteredTodayTasks.sort(sortTasks));
    setUpcomingTasks(filteredUpcomingTasks.sort(sortTasks));
  }, [allTasks]);


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
            `Bem-vindo(a) de volta, ${userName}!`,
            `Força hoje, ${userName}!`,
            `Vamos a isso, ${userName}!`,
            `${userName}, foco total hoje!`,
            `Hora de brilhar, ${userName}!`,
            `Conto consigo, ${userName}!`,
            `Novo dia, ${userName}, mente fresca!`,
        ];
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).valueOf()) / 86400000);
        const randomIndex = dayOfYear % messages.length;
        setWelcomeMessage(messages[randomIndex]);
    } else {
         setWelcomeMessage('Bem-vindo(a) ao CogniAssist! Personalize as suas configurações.');
    }
  }, [userName]);


  useEffect(() => {
    const relevantTasks = todayTasks.filter(task => task.status !== 'cancelled');
    const completedTasksCount = relevantTasks.filter(task => task.status === 'completed').length;
    const score = relevantTasks.length > 0 ? Math.round((completedTasksCount / relevantTasks.length) * 100) : 0;
    setProductivityScore(score);
  }, [todayTasks]); 

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
    setAllTasks(prevTasks => [taskToAdd, ...prevTasks]);
    toast({ title: "Tarefa Adicionada", description: `"${taskToAdd.title}" foi adicionada.` });
  };

  const toggleTaskCompletion = (taskId: string) => {
    setAllTasks(prevTasks =>
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
    setAllTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: 'cancelled' } : task
      )
    );
    const cancelledTask = allTasks.find(t => t.id === taskId);
    if (cancelledTask) {
        toast({ title: "Tarefa Cancelada", description: `"${cancelledTask.title}" foi marcada como cancelada.`, variant: "default" });
    }
  };

  const requestDeleteConfirmation = (id: string, type: 'task' | 'reminder') => {
    setItemToDeleteId(id);
    setItemToDeleteType(type);
    const item = type === 'task' ? allTasks.find(t => t.id === id) : allReminders.find(r => r.id === id);
    setItemToDeleteTitle(item?.title || "este item");
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteItem = () => {
    if (!itemToDeleteId || !itemToDeleteType) return;

    if (itemToDeleteType === 'task') {
      setAllTasks(prevTasks => prevTasks.filter(task => task.id !== itemToDeleteId));
      toast({ title: "Tarefa Eliminada", description: `A tarefa "${itemToDeleteTitle}" foi eliminada permanentemente.`, variant: "destructive" });
    } else if (itemToDeleteType === 'reminder') {
      setAllReminders(prevReminders => prevReminders.filter(reminder => reminder.id !== itemToDeleteId));
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
      <header className="flex flex-col items-stretch gap-y-2 md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center">
           {userName && userName !== 'Utilizador' ? <Brain className="mr-2 h-8 w-8 text-accent shrink-0" /> : <User className="mr-2 h-8 w-8 text-accent shrink-0" />}
           <span className="truncate max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">{welcomeMessage}</span>
        </h1>
        <Button onClick={() => setIsAddTaskDialogOpen(true)} size="lg" className="shadow-md shrink-0 self-end md:self-auto">
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
                tasks={todayTasks}
                onToggleComplete={toggleTaskCompletion}
                onCancelTask={handleCancelTask}
                onDeleteTaskRequest={(taskId) => requestDeleteConfirmation(taskId, 'task')}
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary" /> Próximas Tarefas e Lembretes</CardTitle>
                <CardDescription>O que está agendado e lembretes importantes.</CardDescription>
            </CardHeader>
            <CardContent>
                {upcomingTasks.length > 0 && (
                    <>
                        <h3 className="text-md font-semibold mb-2 text-foreground/90">Tarefas Agendadas</h3>
                        <TaskList
                            tasks={upcomingTasks}
                            onToggleComplete={toggleTaskCompletion}
                            onCancelTask={handleCancelTask}
                            onDeleteTaskRequest={(taskId) => requestDeleteConfirmation(taskId, 'task')}
                        />
                         {allReminders.length > 0 && <Separator className="my-4" />}
                    </>
                )}
                {allReminders.length > 0 && (
                    <>
                        <h3 className="text-md font-semibold mt-2 mb-2 text-foreground/90">Lembretes Gerais</h3>
                        <ReminderList
                        reminders={allReminders}
                        onDeleteReminderRequest={(reminderId) => requestDeleteConfirmation(reminderId, 'reminder')}
                        />
                    </>
                )}
                 {upcomingTasks.length === 0 && allReminders.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">Nenhuma tarefa futura ou lembrete geral.</p>
                 )}
            </CardContent>
           </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center"><Zap className="mr-2 h-5 w-5 text-yellow-500" /> Pulso de Produtividade</CardTitle>
              <CardDescription>O seu nível de foco hoje (tarefas de hoje).</CardDescription>
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

      <div className="mt-6">
        <MiniCalendarView tasks={allTasks} reminders={allReminders} />
      </div>

    </div>
  );
}

