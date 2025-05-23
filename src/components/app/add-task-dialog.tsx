
'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarIcon, Clock } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button'; // Added buttonVariants
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
// Label from form component is used
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile

const taskFormSchema = z.object({
  title: z.string().min(1, { message: 'O título da tarefa é obrigatório.' }),
  date: z.date().optional(),
  time: z.string().optional().refine(val => !val || /^([01]\d|2[0-3]):([0-5]\d)$/.test(val), {
    message: "Hora inválida. Use o formato HH:mm.",
  }),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

interface AddTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: TaskFormValues) => void;
}

export function AddTaskDialog({ isOpen, onClose, onAddTask }: AddTaskDialogProps) {
  const isMobile = useIsMobile();
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      time: '',
      // date: undefined, // Let it be undefined initially
    },
  });

  // Reset form when dialog opens/closes or default values change
  React.useEffect(() => {
    if (isOpen) {
        form.reset({
            title: '',
            description: '',
            priority: 'medium',
            time: '',
            date: undefined, // Explicitly reset date
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);


  const onSubmit = (data: TaskFormValues) => {
    const taskData = {
      ...data,
      // If no date is picked, it remains undefined. If a date is picked, it's used.
      // Time is already a string or undefined.
    };
    onAddTask(taskData);
    // form.reset(); // Handled by useEffect for isOpen
    onClose(); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
          <DialogDescription>
            Preencha os detalhes para a sua nova tarefa ou lembrete.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Título da Tarefa</FormLabel>
                        <FormControl>
                            <Input placeholder="ex: Comprar mantimentos" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Data (Opcional)</FormLabel>
                        {isMobile ? (
                           <FormControl>
                             <Input
                                type="date"
                                value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                                onChange={(e) => {
                                  if (e.target.value) {
                                    const [year, month, day] = e.target.value.split('-').map(Number);
                                    // JavaScript months are 0-indexed, so subtract 1 from the month
                                    // Ensure the date is parsed in UTC and then displayed, or consistently local.
                                    // new Date(year, monthIndex, day) treats these as local time components.
                                    const newDate = new Date(year, month - 1, day);
                                    field.onChange(newDate);
                                  } else {
                                    field.onChange(undefined);
                                  }
                                }}
                                className="w-full"
                              />
                           </FormControl>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "pl-3 text-left font-normal w-full justify-start", 
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, "PPP", { locale: pt })
                                    ) : (
                                        <span>Escolha uma data</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 max-w-[280px]" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    locale={pt}
                                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                    classNames={{
                                        cell: "h-8 w-8 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                        day: cn(
                                          "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
                                          buttonVariants({ variant: "ghost" })
                                        ),
                                        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                                      }}
                                />
                                </PopoverContent>
                            </Popover>
                        )}
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Hora (Opcional)</FormLabel>
                                <FormControl>
                                     <div className="relative">
                                        <Input type="time" {...field} className="pr-8 w-full"/> 
                                        <Clock className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                     </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Descrição / Notas (Opcional)</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Adicione detalhes extras aqui..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Prioridade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a prioridade" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="low">Baixa</SelectItem>
                            <SelectItem value="medium">Média</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                 />

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit">Guardar Tarefa</Button>
                </DialogFooter>
            </form>
         </Form>
      </DialogContent>
    </Dialog>
  );
}
