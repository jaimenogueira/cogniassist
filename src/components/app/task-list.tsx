
'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Flame, AlertTriangle, ChevronDown, XCircle, Trash2, CircleSlash } from 'lucide-react'; 
import type { Task } from '@/app/page'; // Import Task type from page.tsx

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onCancelTask: (taskId: string) => void;
  onDeleteTaskRequest: (taskId: string) => void;
}

export function TaskList({ tasks, onToggleComplete, onCancelTask, onDeleteTaskRequest }: TaskListProps) {

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

  const getPriorityBadgeVariant = (priority: 'low' | 'medium' | 'high'): "default" | "secondary" | "destructive" | "outline" | null | undefined => {
    switch (priority) {
    case 'high':
        return 'destructive';
    case 'medium':
        return 'secondary'; 
    case 'low':
        return 'outline'; 
    default:
        return 'default';
    }
  };

  const getPriorityText = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
        case 'low': return 'Baixa';
        case 'medium': return 'Média';
        case 'high': return 'Alta';
        default: return priority;
    }
  };

  const getStatusBadge = (status: Task['status']) => {
    if (status === 'cancelled') {
      return <Badge variant="outline" className="text-xs bg-gray-100 text-gray-500 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"><CircleSlash className="mr-1 h-3 w-3" />Cancelada</Badge>;
    }
    return null;
  }


  if (tasks.length === 0) {
    return <p className="text-muted-foreground text-center py-4">Nenhuma tarefa para hoje ainda!</p>;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "flex items-start space-x-3 p-3 rounded-md border transition-colors",
            task.status === 'completed' ? 'bg-muted/30 border-transparent opacity-70' : 
            task.status === 'cancelled' ? 'bg-gray-100/50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700 opacity-60' : 
            'bg-card hover:bg-muted/20',
          )}
        >
          <Checkbox
            id={`task-${task.id}`}
            checked={task.status === 'completed'}
            onCheckedChange={() => onToggleComplete(task.id)}
            disabled={task.status === 'cancelled'}
            aria-label={`Marcar tarefa "${task.title}" como ${task.status === 'completed' ? 'pendente' : 'concluída'}`}
            className={cn(
                "transition-transform transform hover:scale-110 mt-1",
                task.status === 'cancelled' && "cursor-not-allowed"
            )}
          />
          <div className="flex-1">
            <label
              htmlFor={`task-${task.id}`}
              className={cn(
                "font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                task.status === 'cancelled' ? "cursor-default" : "cursor-pointer",
                (task.status === 'completed' || task.status === 'cancelled') ? 'line-through text-muted-foreground' : 'text-foreground'
              )}
            >
              {task.title}
            </label>
            {task.time && (
              <p className={cn("text-xs", (task.status === 'completed' || task.status === 'cancelled') ? 'text-muted-foreground/70' : 'text-muted-foreground')}>
                {task.time}
              </p>
            )}
            {task.description && task.status !== 'cancelled' && (
              <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
            )}
             {task.date && (
              <p className={cn("text-xs", (task.status === 'completed' || task.status === 'cancelled') ? 'text-muted-foreground/70' : 'text-muted-foreground')}>
                Data: {new Date(task.date).toLocaleDateString('pt-PT')}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            {task.status === 'cancelled' ? getStatusBadge('cancelled') : (
                 <Badge variant={getPriorityBadgeVariant(task.priority)} className="capitalize flex items-center gap-1 px-2 py-0.5 text-xs">
                    {getPriorityIcon(task.priority)}
                    {getPriorityText(task.priority)}
                </Badge>
            )}
            {task.status !== 'cancelled' && (
                <div className="flex items-center mt-1">
                     <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-yellow-600 hover:text-yellow-700 dark:text-yellow-500 dark:hover:text-yellow-400"
                        onClick={() => onCancelTask(task.id)}
                        title="Cancelar Tarefa"
                        aria-label="Cancelar Tarefa"
                        disabled={task.status === 'completed'}
                    >
                        <XCircle className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive/90"
                        onClick={() => onDeleteTaskRequest(task.id)}
                        title="Eliminar Tarefa"
                        aria-label="Eliminar Tarefa"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )}
            {task.status === 'cancelled' && (
                 <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive/90 mt-1"
                    onClick={() => onDeleteTaskRequest(task.id)}
                    title="Eliminar Tarefa Permanentemente"
                    aria-label="Eliminar Tarefa Permanentemente"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
