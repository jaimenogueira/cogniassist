
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
import { PlusCircle, Zap, Brain, Activity, CalendarDays, User, CircleSlash } from 'lucide-react';
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
import { collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc, query, where, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Ensure db is exported from firebase.ts

// MOCK_USER_ID should be replaced with actual user ID from auth context in a real app
const MOCK_USER_ID = 'mockUserId123';

export interface Task {
  id: string; // Firestore document ID
  userId?: string; // To associate task with a user
  title: string;
  time?: string;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  date?: Date | Timestamp; // Can be Date or Firestore Timestamp
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Reminder {
  id: string; // Firestore document ID
  userId?: string; // To associate reminder with a user
  title: string;
  time: string; // Consider making this more structured, e.g., with a Date
}

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
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    setIsLoading(true);
    // For tasks
    const tasksCollectionRef = collection(db, 'users', MOCK_USER_ID, 'tasks');
    const qTasks = query(tasksCollectionRef, orderBy("date", "asc"), orderBy("time", "asc")); // Basic sorting

    const unsubscribeTasks = onSnapshot(qTasks, (snapshot) => {
      const fetchedTasks = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date instanceof Timestamp ? data.date.toDate() : (data.date ? new Date(data.date as string) : undefined),
        } as Task;
      });
      setAllTasks(fetchedTasks);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching tasks:", error);
      toast({ title: "Erro ao Carregar Tarefas", description: "Não foi possível buscar as suas tarefas.", variant: "destructive" });
      setIsLoading(false);
    });

    // For reminders
    const remindersCollectionRef = collection(db, 'users', MOCK_USER_ID, 'reminders');
     const qReminders = query(remindersCollectionRef); // Add sorting if needed, e.g., orderBy("time") if time is structured

    const unsubscribeReminders = onSnapshot(qReminders, (snapshot) => {
      const fetchedReminders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Reminder));
      setAllReminders(fetchedReminders);
      // Assuming loading completes after tasks
    }, (error) => {
      console.error("Error fetching reminders:", error);
      toast({ title: "Erro ao Carregar Lembretes", description: "Não foi possível buscar os seus lembretes.", variant: "destructive" });
    });
    
    return () => {
      unsubscribeTasks();
      unsubscribeReminders();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const isDateToday = (date: Task['date']): boolean => {
    if (!date) return true; // Undated tasks are considered for today
    const taskDate = date instanceof Timestamp ? date.toDate() : new Date(date as Date);
    const today = new Date();
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  };

  const isDateInFuture = (date: Task['date']): boolean => {
    if (!date) return false; 
    const taskDate = date instanceof Timestamp ? date.toDate() : new Date(date as Date);
    taskDate.setHours(0,0,0,0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
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

  const handleAddTask = async (newTaskData: TaskFormValues) => {
    const taskToAdd: Omit<Task, 'id'> = { // Omit id because Firestore generates it
      userId: MOCK_USER_ID,
      title: newTaskData.title,
      time: newTaskData.time || (newTaskData.date ? new Date(newTaskData.date).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : ''),
      status: 'pending',
      priority: newTaskData.priority,
      description: newTaskData.description,
      date: newTaskData.date ? Timestamp.fromDate(new Date(newTaskData.date)) : undefined,
    };
    try {
      const tasksCollectionRef = collection(db, 'users', MOCK_USER_ID, 'tasks');
      await addDoc(tasksCollectionRef, taskToAdd);
      toast({ title: "Tarefa Adicionada", description: `"${taskToAdd.title}" foi adicionada.` });
    } catch (error) {
      console.error("Error adding task: ", error);
      toast({ title: "Erro ao Adicionar Tarefa", description: "Não foi possível guardar a tarefa.", variant: "destructive" });
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    try {
      const taskDocRef = doc(db, 'users', MOCK_USER_ID, 'tasks', taskId);
      await updateDoc(taskDocRef, { status: newStatus });
      // Toast can be added here if desired
    } catch (error) {
      console.error("Error updating task status: ", error);
      toast({ title: "Erro ao Atualizar Tarefa", description: "Não foi possível atualizar o estado da tarefa.", variant: "destructive" });
    }
  };

  const handleCancelTask = async (taskId: string) => {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;
    try {
      const taskDocRef = doc(db, 'users', MOCK_USER_ID, 'tasks', taskId);
      await updateDoc(taskDocRef, { status: 'cancelled' });
      toast({ title: "Tarefa Cancelada", description: `"${task.title}" foi marcada como cancelada.`, variant: "default" });
    } catch (error) {
      console.error("Error cancelling task: ", error);
      toast({ title: "Erro ao Cancelar Tarefa", variant: "destructive" });
    }
  };

  const requestDeleteConfirmation = (id: string, type: 'task' | 'reminder') => {
    setItemToDeleteId(id);
    setItemToDeleteType(type);
    const item = type === 'task' ? allTasks.find(t => t.id === id) : allReminders.find(r => r.id === id);
    setItemToDeleteTitle(item?.title || "este item");
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDeleteId || !itemToDeleteType) return;

    try {
      if (itemToDeleteType === 'task') {
        const taskDocRef = doc(db, 'users', MOCK_USER_ID, 'tasks', itemToDeleteId);
        await deleteDoc(taskDocRef);
        toast({ title: "Tarefa Eliminada", description: `A tarefa "${itemToDeleteTitle}" foi eliminada permanentemente.`, variant: "destructive" });
      } else if (itemToDeleteType === 'reminder') {
        const reminderDocRef = doc(db, 'users', MOCK_USER_ID, 'reminders', itemToDeleteId);
        await deleteDoc(reminderDocRef);
        toast({ title: "Lembrete Eliminado", description: `O lembrete "${itemToDeleteTitle}" foi eliminado permanentemente.`, variant: "destructive" });
      }
    } catch (error) {
      console.error(`Error deleting ${itemToDeleteType}: `, error);
      toast({ title: `Erro ao Eliminar ${itemToDeleteType === 'task' ? 'Tarefa' : 'Lembrete'}`, variant: "destructive" });
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
           {userName && userName !== 'Utilizador' ? <Brain className="mr-2 h-9 w-9 text-accent shrink-0" /> : <User className="mr-2 h-9 w-9 text-accent shrink-0" />}
           <span className="truncate max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">{welcomeMessage}</span>
        </h1>
        <Button onClick={() => setIsAddTaskDialogOpen(true)} size="lg" className="shadow-md shrink-0 self-end md:self-auto">
          <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Tarefa
        </Button>
      </header>

      {isLoading && <p className="text-muted-foreground text-center py-4">A carregar dados...</p>}

      {!isLoading && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center"><Activity className="mr-2 h-6 w-6 text-primary" /> Tarefas de Hoje</CardTitle>
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
                    <CardTitle className="flex items-center"><CalendarDays className="mr-2 h-6 w-6 text-primary" /> Próximas Tarefas e Lembretes</CardTitle>
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
                  <CardTitle className="flex items-center"><Zap className="mr-2 h-6 w-6 text-yellow-500" /> Pulso de Produtividade</CardTitle>
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
          <div className="mt-6">
            <MiniCalendarView tasks={allTasks} reminders={allReminders} />
          </div>
        </>
      )}


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
