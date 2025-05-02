
'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Reminder {
  id: string;
  title: string;
  time: string; // Can be specific time or relative like "Tomorrow"
}

interface ReminderListProps {
  reminders: Reminder[];
}

export function ReminderList({ reminders }: ReminderListProps) {
  if (reminders.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No upcoming reminders.</p>;
  }

  return (
    <div className="space-y-3">
      {reminders.map((reminder) => (
        <div
          key={reminder.id}
          className={cn(
            "flex items-start space-x-3 p-3 rounded-md border bg-card hover:bg-muted/20 transition-colors"
          )}
        >
          <Bell className="h-5 w-5 text-accent mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium leading-none text-foreground">
              {reminder.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {reminder.time}
            </p>
          </div>
          {/* Add actions like 'Dismiss' or 'Snooze' later if needed */}
          {/* <Button variant="ghost" size="sm" className="text-xs">Dismiss</Button> */}
        </div>
      ))}
    </div>
  );
}
