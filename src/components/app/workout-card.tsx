
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Edit3, Trash2, Clock, CalendarDays, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import type { Workout, WorkoutStatus } from '@/app/training/page';
import { cn } from '@/lib/utils';

interface WorkoutCardProps {
  workout: Workout;
  onStatusChange: (workoutId: string, newStatus: WorkoutStatus) => void;
  onEdit: (workout: Workout) => void;
  onDelete: (workoutId: string) => void;
  sportIcon?: React.ElementType;
}

export function WorkoutCard({ workout, onStatusChange, onEdit, onDelete, sportIcon: SportIconComponent }: WorkoutCardProps) {
  const SportIcon = SportIconComponent || CalendarDays; // Default icon

  const handleAttendedChange = (attended: boolean | 'indeterminate') => {
    if (attended === true) {
      onStatusChange(workout.id, 'compareceu');
    } else if (workout.status === 'compareceu' || workout.status === 'concluido') {
      // If unchecking attended, revert to pending. Also resets completed.
      onStatusChange(workout.id, 'pendente');
    }
  };

  const handleCompletedChange = (completed: boolean | 'indeterminate') => {
     if (completed === true) {
      onStatusChange(workout.id, 'concluido');
    } else if (workout.status === 'concluido') {
      // If unchecking completed, revert to attended (as they must have attended to complete)
      onStatusChange(workout.id, 'compareceu');
    }
  };
  
  const getStatusBadge = () => {
    switch (workout.status) {
      case 'pendente':
        return <Badge variant="outline" className="text-xs"><MinusCircle className="mr-1 h-3 w-3" />Pendente</Badge>;
      case 'compareceu':
        return <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100 border-blue-300"><CheckCircle2 className="mr-1 h-3 w-3" />Compareceu</Badge>;
      case 'concluido':
        return <Badge variant="default" className="text-xs bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 border-green-300"><CheckCircle2 className="mr-1 h-3 w-3" />Concluído</Badge>;
      default:
        return null;
    }
  };


  return (
    <Card className={cn("transition-all hover:shadow-lg", 
        workout.status === 'concluido' ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' 
      : workout.status === 'compareceu' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700' 
      : 'bg-card'
    )}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-lg flex items-center">
                    <SportIcon className="mr-2 h-5 w-5 text-primary" />
                    {workout.name}
                </CardTitle>
                <CardDescription className="text-xs flex items-center gap-2 mt-1">
                    <span className="flex items-center"><CalendarDays className="mr-1 h-3 w-3"/>{workout.dayOfWeek}</span>
                    {workout.time && <span className="flex items-center"><Clock className="mr-1 h-3 w-3"/>{workout.time}</span>}
                </CardDescription>
            </div>
            {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {workout.description && <p className="text-sm text-muted-foreground mb-3">{workout.description}</p>}
        
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <div className="flex items-center space-x-2">
                <Checkbox
                id={`attended-${workout.id}`}
                checked={workout.status === 'compareceu' || workout.status === 'concluido'}
                onCheckedChange={handleAttendedChange}
                disabled={workout.status === 'concluido'} 
                aria-label="Marcar como compareceu"
                />
                <label htmlFor={`attended-${workout.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Compareci
                </label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                id={`completed-${workout.id}`}
                checked={workout.status === 'concluido'}
                onCheckedChange={handleCompletedChange}
                disabled={workout.status === 'pendente'} 
                aria-label="Marcar como concluído com sucesso"
                />
                <label htmlFor={`completed-${workout.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Concluído com Sucesso
                </label>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-0">
        <Button variant="ghost" size="sm" onClick={() => onEdit(workout)} aria-label="Editar treino">
          <Edit3 className="h-4 w-4 mr-1 md:mr-2" /> <span className="hidden md:inline">Editar</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(workout.id)} className="text-destructive hover:text-destructive" aria-label="Excluir treino">
          <Trash2 className="h-4 w-4 mr-1 md:mr-2" /> <span className="hidden md:inline">Excluir</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
