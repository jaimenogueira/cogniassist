
'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

interface Day {
  date: Date;
  dayName: string;
  dayNumber: string;
  isCurrentMonth: boolean; 
  isCurrentDay: boolean;
  appointments: Appointment[];
}

interface Appointment {
  id: string;
  title: string;
  color: string; 
}

const MOCK_APPOINTMENTS_SOURCE: Record<string, Omit<Appointment, 'id'>[]> = {
  'default-0': [{ title: 'Sincronização da Equipe', color: 'bg-blue-500' }], 
  'default-2': [ 
    { title: 'Projeto Alfa', color: 'bg-green-500' },
    { title: 'Revisar Documentos', color: 'bg-yellow-500' },
  ],
  'default-4': [{ title: 'Chamada com Cliente', color: 'bg-purple-500' }], 
};


export function MiniCalendarView() {
  const [weekDays, setWeekDays] = useState<Day[]>([]);
  // Removed currentDate state as it wasn't used to trigger re-renders based on its value.
  // The useEffect with an empty dependency array handles initial setup.

  useEffect(() => {
    const today = new Date();
    // setCurrentDate(today); // Not strictly needed if only used for initial calculation

    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1, locale: ptBR }); 

    const days: Day[] = [];
    const localMockAppointments: Record<string, Appointment[]> = {};

    for (let i = 0; i < 7; i++) {
      const date = addDays(startOfCurrentWeek, i);
      const dateString = format(date, 'yyyy-MM-dd');
      
      const mockKey = `default-${i}`;
      if (MOCK_APPOINTMENTS_SOURCE[mockKey]) {
        localMockAppointments[dateString] = MOCK_APPOINTMENTS_SOURCE[mockKey].map((app, index) => ({
            ...app,
            id: `${dateString}-app-${index}`,
        }));
      }

      days.push({
        date,
        dayName: format(date, 'E', { locale: ptBR }), 
        dayNumber: format(date, 'd', { locale: ptBR }),
        isCurrentMonth: true, 
        isCurrentDay: isToday(date),
        appointments: localMockAppointments[dateString] || [],
      });
    }
    setWeekDays(days);
  }, []); 


  if (weekDays.length === 0) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center text-base md:text-lg">
            <CalendarDays className="mr-2 h-5 w-5 text-primary" /> Mini Visão Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Carregando visão semanal...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center text-base md:text-lg">
          <CalendarDays className="mr-2 h-5 w-5 text-primary" /> Mini Visão Semanal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map((day) => (
            <div
              key={day.date.toISOString()}
              className={cn(
                'p-1.5 md:p-2 border rounded-md flex flex-col items-center justify-start min-h-[60px] md:min-h-[80px]',
                day.isCurrentDay ? 'bg-accent/30 border-accent' : 'bg-card border-border/50',
              )}
            >
              <p className={cn(
                  'text-xs font-medium capitalize', 
                  day.isCurrentDay ? 'text-accent-foreground' : 'text-muted-foreground'
                )}
              >
                {day.dayName.substring(0,3)}
              </p>
              <p className={cn(
                  'text-lg md:text-xl font-bold',
                   day.isCurrentDay ? 'text-accent-foreground' : 'text-foreground'
                 )}
              >
                {day.dayNumber}
              </p>
              <div className="mt-1 space-y-0.5 flex flex-col items-center w-full">
                {day.appointments.slice(0, 2).map(app => ( 
                  <div key={app.id} className="w-full px-0.5">
                     <div
                        className={cn('h-1.5 w-full rounded-full opacity-75', app.color)}
                        title={app.title}
                        data-ai-hint="compromisso evento"
                      ></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Semana atual: {weekDays[0] ? format(weekDays[0].date, 'd MMM', { locale: ptBR }) : ''} - {weekDays[6] ? format(weekDays[6].date, 'd MMM, yyyy', { locale: ptBR }) : ''}
        </p>
      </CardContent>
    </Card>
  );
}
