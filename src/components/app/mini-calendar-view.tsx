
'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isToday, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

interface Day {
  date: Date;
  dayName: string;
  dayNumber: string;
  isCurrentMonth: boolean; // Though for a week view, all might be same month or span two.
  isCurrentDay: boolean;
  appointments: Appointment[];
}

interface Appointment {
  id: string;
  title: string;
  color: string; // e.g., 'bg-red-500', 'bg-blue-500'
}

// Mock appointments - replace with actual data fetching if needed
const MOCK_APPOINTMENTS_SOURCE: Record<string, Omit<Appointment, 'id'>[]> = {
  // Dates should be in 'yyyy-MM-dd' format for easy lookup
  // These will be dynamically matched against the current week
  'default-0': [{ title: 'Team Sync', color: 'bg-blue-500' }], // Example: Monday
  'default-2': [ // Example: Wednesday
    { title: 'Project Alpha', color: 'bg-green-500' },
    { title: 'Review Docs', color: 'bg-yellow-500' },
  ],
  'default-4': [{ title: 'Client Call', color: 'bg-purple-500' }], // Example: Friday
};


export function MiniCalendarView() {
  const [weekDays, setWeekDays] = useState<Day[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); // To trigger re-render if needed, though week changes less often

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today); // Ensure we're using client-side date

    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // 1 for Monday

    const days: Day[] = [];
    const localMockAppointments: Record<string, Appointment[]> = {};

    for (let i = 0; i < 7; i++) {
      const date = addDays(startOfCurrentWeek, i);
      const dateString = format(date, 'yyyy-MM-dd');
      
      // Assign mock appointments based on day index in the week (0=Mon, 1=Tue, etc.)
      // This makes the mock data appear consistently regardless of current actual date
      const mockKey = `default-${i}`;
      if (MOCK_APPOINTMENTS_SOURCE[mockKey]) {
        localMockAppointments[dateString] = MOCK_APPOINTMENTS_SOURCE[mockKey].map((app, index) => ({
            ...app,
            id: `${dateString}-app-${index}`,
        }));
      }

      days.push({
        date,
        dayName: format(date, 'E'), // Short day name like 'Mon'
        dayNumber: format(date, 'd'),
        isCurrentMonth: true, // Simplified for week view
        isCurrentDay: isToday(date),
        appointments: localMockAppointments[dateString] || [],
      });
    }
    setWeekDays(days);
  }, []); // Empty dependency array: calculate week once on mount


  if (weekDays.length === 0) {
    // Can show a skeleton loader here if desired
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center text-base md:text-lg">
            <CalendarDays className="mr-2 h-5 w-5 text-primary" /> Mini Week View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Loading week view...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center text-base md:text-lg">
          <CalendarDays className="mr-2 h-5 w-5 text-primary" /> Mini Week View
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
                  'text-xs font-medium',
                  day.isCurrentDay ? 'text-accent-foreground' : 'text-muted-foreground'
                )}
              >
                {day.dayName}
              </p>
              <p className={cn(
                  'text-lg md:text-xl font-bold',
                   day.isCurrentDay ? 'text-accent-foreground' : 'text-foreground'
                 )}
              >
                {day.dayNumber}
              </p>
              <div className="mt-1 space-y-0.5 flex flex-col items-center w-full">
                {day.appointments.slice(0, 2).map(app => ( // Show max 2 appointments per day for mini view
                  <div key={app.id} className="w-full px-0.5">
                     <div
                        className={cn('h-1.5 w-full rounded-full opacity-75', app.color)}
                        title={app.title}
                        data-ai-hint="appointment event"
                      ></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Current week: {format(weekDays[0]?.date, 'MMM d')} - {format(weekDays[6]?.date, 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}
