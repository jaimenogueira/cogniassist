
'use client';

import React from 'react';
import { Bell, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Reminder } from '@/app/page'; // Import Reminder type

interface ReminderListProps {
  reminders: Reminder[];
  onDeleteReminderRequest: (reminderId: string) => void;
}

export function ReminderList({ reminders, onDeleteReminderRequest }: ReminderListProps) {
  if (reminders.length === 0) {
    return <p className="text-muted-foreground text-center py-4">Nenhum lembrete futuro.</p>;
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
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive/90"
            onClick={() => onDeleteReminderRequest(reminder.id)}
            title="Eliminar Lembrete"
            aria-label="Eliminar Lembrete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
