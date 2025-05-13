
'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale'; // Changed to pt
import { CalendarIcon, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const taskFormSchema = z.object({
  title: z.string().min(1, { message: 'O título da tarefa é obrigatório.' }),
  date: z.date().optional(),
  time: z.string().optional(),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface AddTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: TaskFormValues) => void;
}

export function AddTaskDialog({ isOpen, onClose, onAddTask }: AddTaskDialogProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      time: '',
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    const taskData = {
      ...data,
      date: data.date || new Date(), 
    };
    onAddTask(taskData);
    form.reset(); 
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

                <div className="grid grid-cols-2 gap-4">
                   <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Data</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "pl-3 text-left font-normal",
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
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                locale={pt}
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hora (Opcional)</FormLabel>
                                <FormControl>
                                     <div className="relative">
                                        <Input type="time" {...field} className="pr-8"/>
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

