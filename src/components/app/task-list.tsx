
'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Flame, AlertTriangle, ChevronDown } from 'lucide-react'; // Icons for priority

interface Task {
  id: string;
  title: string;
  time?: string; // Optional time
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  description?: string; // Optional description
}

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
}

export function TaskList({ tasks, onToggleComplete }: TaskListProps) {

  const getPriorityIcon = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return <Flame className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <ChevronDown className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

    const getPriorityBadgeVariant = (priority: 'low' | 'medium' | 'high'): "default" | "secondary" | "destructive" | "outline" | null | undefined=> {
        switch (priority) {
        case 'high':
            return 'destructive';
        case 'medium':
            return 'secondary'; // Use secondary which might map to a yellow-ish or gray in theme
        case 'low':
            return 'outline'; // Use outline which might map to green-ish or gray in theme
        default:
            return 'default';
        }
    };


  if (tasks.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No tasks for today yet!</p>;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "flex items-center space-x-3 p-3 rounded-md border transition-colors",
            task.completed ? 'bg-muted/50 border-transparent' : 'bg-card hover:bg-muted/20',
          )}
        >
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
            aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
            className="transition-transform transform hover:scale-110"
          />
          <div className="flex-1">
            <label
              htmlFor={`task-${task.id}`}
              className={cn(
                "font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
              )}
            >
              {task.title}
            </label>
            {task.time && (
              <p className={cn("text-xs", task.completed ? 'text-muted-foreground/70' : 'text-muted-foreground')}>
                {task.time}
              </p>
            )}
             {task.description && !task.completed && (
              <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
            )}
          </div>
          <Badge variant={getPriorityBadgeVariant(task.priority)} className="capitalize flex items-center gap-1 px-2 py-0.5">
            {getPriorityIcon(task.priority)}
            {task.priority}
          </Badge>
        </div>
      ))}
    </div>
  );
}
