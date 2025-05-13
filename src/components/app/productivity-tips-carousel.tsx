'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Lightbulb, Clock, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductivityTip {
  id: string;
  title: string;
  tip: string;
  icon: React.ElementType;
  bgColor?: string;
  iconColor?: string;
}

// Adapted from src/app/suggestions/page.tsx for consistency and to match provided examples
const productivityTipsData: ProductivityTip[] = [
  {
    id: 'pomodoro',
    title: 'Técnica Pomodoro',
    tip: 'Trabalhe por 25 minutos, depois faça uma pausa de 5 minutos. Repita o ciclo 4 vezes, depois descanse mais tempo.',
    icon: Clock,
    bgColor: 'bg-red-50 dark:bg-red-900/30',
    iconColor: 'text-red-500 dark:text-red-400',
  },
  {
    id: 'stretch',
    title: 'Pausa para Alongamento',
    tip: 'Levante-se e faça um alongamento rápido para refrescar o corpo entre tarefas longas.',
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-stretch-horizontal"><path d="M16 20M4 20h12a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4Z"/><path d="M4 12h8"/><path d="M12 12v8"/></svg>, // Icon 🤸‍♂️ representation
    bgColor: 'bg-green-50 dark:bg-green-900/30',
    iconColor: 'text-green-500 dark:text-green-400',
  },
   {
    id: 'changeEnv',
    title: 'Mude de Ambiente',
    tip: 'Tente trabalhar de um local diferente quando se sentir bloqueado ou desfocado.',
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf"><path d="M12 22s5-4 5-10V6a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v6c0 6 5 10 5 10z"></path><path d="M2 12h20"></path></svg>, // Icon 🌿 representation
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-500 dark:text-yellow-400',
  },
  {
    id: 'hydrate',
    title: 'Lembrete de Hidratação',
    tip: 'Beba um copo de água a cada 2 horas para se manter mentalmente alerta.',
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-glass-water"><path d="M12 22s5-4 5-10V6a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v6c0 6 5 10 5 10z"/><path d="M8.5 9a2.5 2.5 0 1 1 5 0"/></svg>, // Icon 💧 representation
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    iconColor: 'text-blue-500 dark:text-blue-400',
  },
  {
    id: 'restProductive',
    title: 'Descansar é Produtivo',
    tip: 'Fazer pausas ajuda o seu cérebro a processar e reter informações melhor.',
    icon: Brain, // Icon 🧠
    bgColor: 'bg-purple-50 dark:bg-purple-900/30',
    iconColor: 'text-purple-500 dark:text-purple-400',
  },
];

export function ProductivityTipsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrevious = useCallback(() => {
    if (productivityTipsData.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? productivityTipsData.length - 1 : prevIndex - 1
    );
  }, []);

  const handleNext = useCallback(() => {
    if (productivityTipsData.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === productivityTipsData.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  useEffect(() => {
    if (!mounted || productivityTipsData.length <= 1) return; 

    const intervalId = setInterval(() => {
      handleNext();
    }, 7000); 
    return () => clearInterval(intervalId);
  }, [mounted, handleNext]);

  if (!mounted || productivityTipsData.length === 0) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3 pt-4">
                <CardTitle className="flex items-center text-base">
                  <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" /> Dicas de Produtividade
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 min-h-[140px] flex justify-center items-center">
                <p className="text-sm text-muted-foreground">A carregar dicas...</p>
            </CardContent>
        </Card>
    );
  }

  const currentTip = productivityTipsData[currentIndex];
  const IconComponent = currentTip.icon;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="flex items-center text-base">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" /> Dicas de Produtividade
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("p-4 pt-0 min-h-[140px] flex flex-col justify-center items-center text-center relative", currentTip.bgColor)}>
        <div className="mb-2">
          <IconComponent className={cn("h-8 w-8", currentTip.iconColor)} data-ai-hint="ilustração dica produtividade" />
        </div>
        <h3 className="font-semibold text-sm text-foreground mb-1">{currentTip.title}</h3>
        <p className="text-xs text-muted-foreground leading-snug px-2">{currentTip.tip}</p>

        {productivityTipsData.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-background/30 hover:bg-background/70 text-muted-foreground hover:text-foreground"
              aria-label="Dica Anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-background/30 hover:bg-background/70 text-muted-foreground hover:text-foreground"
              aria-label="Próxima Dica"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
