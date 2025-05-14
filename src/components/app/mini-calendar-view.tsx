
'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isToday, isSameDay as fnsIsSameDay } from 'date-fns';
import { pt } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import type { Task, Reminder } from '@/app/page'; // Import types

interface Day {
  date: Date;
  dayName: string;
  dayNumber: string;
  isCurrentDay: boolean;
  itemCount: number;
}

interface MiniCalendarViewProps {
  tasks: Task[];
  reminders: Reminder[]; 
}

export function MiniCalendarView({ tasks, reminders }: MiniCalendarViewProps) {
  const [weekDays, setWeekDays] = useState<Day[]>([]);

  useEffect(() => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1, locale: pt }); // Monday as start of week

    const days: Day[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startOfCurrentWeek, i);
      
      const tasksForDay = tasks.filter(task => 
        task.date && 
        fnsIsSameDay(currentDate, task.date) && 
        task.status !== 'cancelled'
      );
      
      // Reminder counting remains a placeholder due to string-based time.
      const remindersForDayCount = 0; 
      
      const itemCount = tasksForDay.length + remindersForDayCount;

      days.push({
        date: currentDate,
        dayName: format(currentDate, 'E', { locale: pt }), // Short day name e.g., Seg
        dayNumber: format(currentDate, 'd', { locale: pt }),
        isCurrentDay: isToday(currentDate),
        itemCount: itemCount,
      });
    }
    setWeekDays(days);
  }, [tasks, reminders]); 


  if (weekDays.length === 0) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center text-base md:text-lg">
            <CalendarDays className="mr-2 h-5 w-5 text-primary" /> Mini Visão Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">A carregar visão semanal...</p>
        </CardContent>
      </Card>
    );
  }

  const handleDayClick = (date: Date) => {
    console.log(`Dia selecionado: ${format(date, 'PPP', { locale: pt })}. Items: ${weekDays.find(d => fnsIsSameDay(d.date, date))?.itemCount || 0}`);
    // Future: Implement logic to show tasks/reminders for this day.
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center text-base md:text-lg">
          <CalendarDays className="mr-2 h-5 w-5 text-primary" /> Mini Visão Semanal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-2"> {/* Added overflow-x-auto for horizontal scrolling on small screens */}
            <div className="grid grid-cols-7 gap-1 text-center min-w-[320px]"> {/* Ensure minimum width for grid items */}
            {weekDays.map((day) => (
                <div
                key={day.date.toISOString()}
                className={cn(
                    'p-1.5 md:p-2 border rounded-md flex flex-col items-center justify-start min-h-[70px] md:min-h-[90px] cursor-pointer transition-colors hover:bg-muted/50',
                    day.isCurrentDay ? 'bg-accent/30 border-accent ring-1 ring-accent' : 'bg-card border-border/50',
                )}
                onClick={() => handleDayClick(day.date)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDayClick(day.date);}}
                aria-label={`Ver itens para ${format(day.date, 'PPPP', { locale: pt })}, ${day.itemCount} item(s)`}
                >
                <p className={cn(
                    'text-xs font-medium capitalize', 
                    day.isCurrentDay ? 'text-accent-foreground font-semibold' : 'text-muted-foreground'
                    )}
                >
                    {day.dayName.substring(0,3)}
                </p>
                <p className={cn(
                    'text-lg md:text-xl font-bold mt-0.5',
                    day.isCurrentDay ? 'text-accent-foreground' : 'text-foreground'
                    )}
                >
                    {day.dayNumber}
                </p>
                <div className="mt-1 h-4 flex items-center justify-center w-full">
                    {day.itemCount > 0 && (
                    <div 
                        className={cn(
                            'h-2 w-2 rounded-full opacity-90',
                            day.isCurrentDay ? 'bg-accent-foreground' : 'bg-primary'
                        )}
                        title={`${day.itemCount} item(s) neste dia`}
                        data-ai-hint="indicador evento"
                    />
                    )}
                </div>
                </div>
            ))}
            </div>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Semana actual: {weekDays[0] ? format(weekDays[0].date, 'd MMM', { locale: pt }) : ''} - {weekDays[6] ? format(weekDays[6].date, 'd MMM, yyyy', { locale: pt }) : ''}
        </p>
      </CardContent>
    </Card>
  );
}
