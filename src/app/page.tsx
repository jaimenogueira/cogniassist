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
import { PlusCircle, Zap, Lightbulb, Brain, Activity, CalendarDays } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AddTaskDialog } from '@/components/app/add-task-dialog';
import { MemoryTipsCard } from '@/components/app/memory-tips-card';
import { TaskList } from '@/components/app/task-list'; // Assuming TaskList component exists
import { ReminderList } from '@/components/app/reminder-list'; // Assuming ReminderList component exists

// Mock data - replace with actual data fetching later
const initialTasks = [
  { id: '1', title: 'Morning Standup Meeting', time: '9:00 AM', completed: false, priority: 'high' },
  { id: '2', title: 'Review Project Proposal', time: '11:00 AM', completed: false, priority: 'medium' },
  { id: '3', title: 'Lunch Break', time: '1:00 PM', completed: false, priority: 'low' },
];

const initialReminders = [
    { id: 'r1', title: 'Call Mom', time: '6:00 PM' },
    { id: 'r2', title: 'Pay Electricity Bill', time: 'Tomorrow 10:00 AM' },
];

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [reminders, setReminders] = useState(initialReminders);
  const [productivityScore, setProductivityScore] = useState(0);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);

  // Calculate productivity score based on completed tasks
  useEffect(() => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const score = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    setProductivityScore(score);
  }, [tasks]);

  const handleAddTask = (newTask: { title: string; date: Date; time: string; description: string; priority: 'low' | 'medium' | 'high' }) => {
    // Format time from Date object if needed, or directly use the string time
    const formattedTime = new Date(newTask.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const taskToAdd = {
      id: `task-${Date.now()}`, // Simple unique ID
      title: newTask.title,
      // Use formatted time or the time string from form
      time: newTask.time || formattedTime,
      completed: false,
      priority: newTask.priority,
      // Add other fields like description if needed
      description: newTask.description,
      date: newTask.date, // Keep the date object if needed for sorting/filtering
    };
    setTasks(prevTasks => [...prevTasks, taskToAdd]);
    console.log('New Task Added:', taskToAdd);
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
        <h1 className="text-3xl font-bold text-foreground flex items-center">
           <Brain className="mr-2 h-8 w-8 text-accent" /> CogniAssist Dashboard
        </h1>
        <Button onClick={() => setIsAddTaskDialogOpen(true)} size="lg" className="shadow-md">
          <PlusCircle className="mr-2 h-5 w-5" /> Quick Add Task
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Tasks & Reminders */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center"><Activity className="mr-2 h-5 w-5 text-primary" /> Today's Tasks</CardTitle>
              <CardDescription>What needs your attention today.</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList tasks={tasks} onToggleComplete={toggleTaskCompletion} />
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary" /> Upcoming Reminders</CardTitle>
                <CardDescription>Don't forget these!</CardDescription>
            </CardHeader>
            <CardContent>
                <ReminderList reminders={reminders} />
            </CardContent>
           </Card>
        </div>

        {/* Column 2: Productivity & Tips */}
        <div className="space-y-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center"><Zap className="mr-2 h-5 w-5 text-yellow-500" /> Productivity Pulse</CardTitle>
              <CardDescription>Your focus level today.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
               <Progress value={productivityScore} className="w-full h-3" />
               <p className="text-sm text-muted-foreground text-center">{productivityScore}% Complete</p>
               {/* Placeholder for Emoji Status or Score - could enhance later */}
               <p className="text-center text-2xl">
                 {productivityScore > 75 ? '🚀' : productivityScore > 50 ? '👍' : productivityScore > 25 ? '🙂' : '🤔'}
               </p>
            </CardContent>
          </Card>

          <MemoryTipsCard />

          {/* Placeholder for Mini Weekly View */}
          <Card className="shadow-sm hover:shadow-md transition-shadow hidden md:block">
             <CardHeader>
               <CardTitle className="flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary" /> Mini Week View</CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-muted-foreground text-sm">Mini calendar or week overview coming soon!</p>
                {/* Add a simple calendar component or weekly summary here */}
             </CardContent>
           </Card>

        </div>
      </div>

      {/* Add Task Dialog */}
      <AddTaskDialog
        isOpen={isAddTaskDialogOpen}
        onClose={() => setIsAddTaskDialogOpen(false)}
        onAddTask={handleAddTask}
      />

    </div>
  );
}