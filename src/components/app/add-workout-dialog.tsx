
'use client';

import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import type { Workout } from '@/app/training/page'; // Import Workout type
import { Clock } from 'lucide-react';

const workoutFormSchema = z.object({
  name: z.string().min(1, { message: 'O nome do treino é obrigatório.' }),
  dayOfWeek: z.enum(['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'], {
    required_error: "Selecione um dia da semana."
  }),
  time: z.string().optional(),
  description: z.string().optional(),
});

type WorkoutFormValues = z.infer<typeof workoutFormSchema>;

interface AddWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workout: Omit<Workout, 'id' | 'status' | 'sportIcon'> & { id?: string }) => void;
  workout?: Workout | null;
}

const daysOfWeek: Workout['dayOfWeek'][] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export function AddWorkoutDialog({ isOpen, onClose, onSave, workout }: AddWorkoutDialogProps) {
  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      name: '',
      dayOfWeek: 'Segunda',
      time: '',
      description: '',
    },
  });

  useEffect(() => {
    if (workout) {
      form.reset({
        name: workout.name,
        dayOfWeek: workout.dayOfWeek,
        time: workout.time || '',
        description: workout.description || '',
      });
    } else {
      form.reset({
        name: '',
        dayOfWeek: 'Segunda',
        time: '',
        description: '',
      });
    }
  }, [workout, form, isOpen]);

  const onSubmit = (data: WorkoutFormValues) => {
    onSave({ ...data, id: workout?.id });
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{workout ? 'Editar Treino' : 'Adicionar Novo Treino'}</DialogTitle>
          <DialogDescription>
            Preencha os detalhes para seu treino.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nome do Treino</FormLabel>
                        <FormControl>
                            <Input placeholder="ex: Corrida Matinal, Treino de Perna" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="dayOfWeek"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Dia da Semana</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o dia" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {daysOfWeek.map(day => (
                                    <SelectItem key={day} value={day}>{day}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
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
                            <Textarea placeholder="Adicione detalhes como exercícios, séries, repetições..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit">{workout ? 'Salvar Alterações' : 'Adicionar Treino'}</Button>
                </DialogFooter>
            </form>
         </Form>
      </DialogContent>
    </Dialog>
  );
}
