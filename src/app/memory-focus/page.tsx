
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Brain, Target, ListChecks, MessageSquareQuote, BookOpenText, Repeat, Timer, Headphones, TrendingUp, ShieldOff, Play, Pause, RotateCcw, SkipForward, Award } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FOCUS_DURATION = 25 * 60; // 25 minutes
const SHORT_BREAK_DURATION = 5 * 60; // 5 minutes
const LONG_BREAK_DURATION = 15 * 60; // 15 minutes

export default function MemoryFocusPage() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [pomodoroMode, setPomodoroMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [pomodorosCompletedThisCycle, setPomodorosCompletedThisCycle] = useState(0);
  const [totalPomodoros, setTotalPomodoros] = useState(0);
  const [focusPoints, setFocusPoints] = useState(0);

  const getCurrentModeDuration = useCallback(() => {
    if (pomodoroMode === 'focus') return FOCUS_DURATION;
    if (pomodoroMode === 'shortBreak') return SHORT_BREAK_DURATION;
    return LONG_BREAK_DURATION;
  }, [pomodoroMode]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPomodoroActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isPomodoroActive && timeLeft === 0) {
      setIsPomodoroActive(false);
      // TODO: Add sound notification here
      if (pomodoroMode === 'focus') {
        setTotalPomodoros(prev => prev + 1);
        setFocusPoints(prev => prev + 10); // Example points
        const newCycleCount = pomodorosCompletedThisCycle + 1;
        setPomodorosCompletedThisCycle(newCycleCount);
        if (newCycleCount >= 4) {
          setPomodoroMode('longBreak');
          setTimeLeft(LONG_BREAK_DURATION);
          setPomodorosCompletedThisCycle(0);
        } else {
          setPomodoroMode('shortBreak');
          setTimeLeft(SHORT_BREAK_DURATION);
        }
      } else { // Break finished
        setPomodoroMode('focus');
        setTimeLeft(FOCUS_DURATION);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPomodoroActive, timeLeft, pomodoroMode, pomodorosCompletedThisCycle]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePomodoroToggle = () => {
    setIsPomodoroActive(!isPomodoroActive);
  };

  const handlePomodoroReset = () => {
    setIsPomodoroActive(false);
    setPomodoroMode('focus');
    setTimeLeft(FOCUS_DURATION);
    setPomodorosCompletedThisCycle(0);
  };

  const handlePomodoroSkip = () => {
    setIsPomodoroActive(false);
     if (pomodoroMode === 'focus') {
        setTotalPomodoros(prev => prev + 1);
        // setFocusPoints(prev => prev + 10); // No points for skipping focus
        const newCycleCount = pomodorosCompletedThisCycle + 1;
        setPomodorosCompletedThisCycle(newCycleCount);
        if (newCycleCount >= 4) {
          setPomodoroMode('longBreak');
          setTimeLeft(LONG_BREAK_DURATION);
          setPomodorosCompletedThisCycle(0);
        } else {
          setPomodoroMode('shortBreak');
          setTimeLeft(SHORT_BREAK_DURATION);
        }
      } else { // Break finished
        setPomodoroMode('focus');
        setTimeLeft(FOCUS_DURATION);
      }
  };

  const pomodoroProgress = ((getCurrentModeDuration() - timeLeft) / getCurrentModeDuration()) * 100;
  const pomodoroStatusText = pomodoroMode === 'focus' ? 'A Focar' : pomodoroMode === 'shortBreak' ? 'Pausa Curta' : 'Pausa Longa';

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
           <Brain className="mr-2 h-8 w-8 text-primary" /> Memória e Foco
        </h1>
      </header>
      <p className="text-muted-foreground">
        Ferramentas e exercícios práticos para melhorar as suas capacidades cognitivas.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center"><Brain className="mr-2 h-6 w-6 text-accent" /> Exercícios de Memória</CardTitle>
            <CardDescription>Fortaleça a sua memória com desafios diários e técnicas comprovadas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-base">
                  <div className="flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" />Desafios Diários de Memória</div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                  <p>Tarefas simples e rápidas para exercitar a sua memória:</p>
                  <ul className="list-disc list-inside pl-4 text-muted-foreground space-y-1">
                    <li>Memorizar e repetir sequências (números, palavras, imagens).</li>
                    <li>Jogos de correspondência (ex: cartas de memória).</li>
                    <li>Recordar uma lista após alguns segundos.</li>
                  </ul>
                  <Button variant="outline" size="sm" className="mt-2" disabled>Iniciar Desafio (Em Breve)</Button>
                  <p className="text-xs text-muted-foreground italic mt-1">Gráfico de progresso semanal (Em Breve).</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-base">
                  <div className="flex items-center"><MessageSquareQuote className="mr-2 h-5 w-5 text-primary" />Recordação Ativa</div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                  <p>Notificações ou perguntas interativas ao longo do dia:</p>
                  <ul className="list-disc list-inside pl-4 text-muted-foreground space-y-1">
                    <li>"Consegue lembrar-se do que estava agendado para as 14h?"</li>
                    <li>"O que fez há duas horas?"</li>
                  </ul>
                   <p className="text-xs text-muted-foreground italic mt-1">Funcionalidade em desenvolvimento.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-base">
                 <div className="flex items-center"><BookOpenText className="mr-2 h-5 w-5 text-primary" />Histórias Incompletas</div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                  <p>Mostraremos uma pequena história ou sequência, e depois pediremos para completar o que faltava após um curto intervalo.</p>
                  <p className="text-xs text-muted-foreground italic mt-1">Funcionalidade em desenvolvimento.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-base">
                  <div className="flex items-center"><Repeat className="mr-2 h-5 w-5 text-primary" />Sistema de Repetição Espaçada</div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                  <p>Ajude a rever notas pessoais ou conteúdo guardado usando intervalos de tempo inteligentes (1h, 1 dia, 3 dias, 7 dias, etc.).</p>
                  <p className="text-xs text-muted-foreground italic mt-1">Funcionalidade em desenvolvimento.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center"><Target className="mr-2 h-6 w-6 text-accent" /> Foco e Concentração</CardTitle>
            <CardDescription>Melhore a sua capacidade de concentração e produtividade.</CardDescription>
          </CardHeader>
          <CardContent>
             <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-focus-1">
                    <AccordionTrigger className="text-base">
                        <div className="flex items-center"><Timer className="mr-2 h-5 w-5 text-primary" />Técnica Pomodoro com Gamificação</div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                        <div className="text-center space-y-2 p-4 border rounded-lg bg-muted/30">
                            <p className="text-sm font-medium text-muted-foreground">{pomodoroStatusText}</p>
                            <p className="text-5xl font-bold text-foreground">{formatTime(timeLeft)}</p>
                            <Progress value={pomodoroProgress} className="w-full h-2" />
                        </div>
                        <div className="flex justify-center space-x-2">
                            <Button onClick={handlePomodoroToggle} variant="outline" size="sm">
                                {isPomodoroActive ? <Pause className="mr-1 h-4 w-4" /> : <Play className="mr-1 h-4 w-4" />}
                                {isPomodoroActive ? 'Pausar' : 'Iniciar'}
                            </Button>
                            <Button onClick={handlePomodoroReset} variant="outline" size="sm">
                                <RotateCcw className="mr-1 h-4 w-4" /> Reiniciar
                            </Button>
                             <Button onClick={handlePomodoroSkip} variant="outline" size="sm" title="Saltar sessão atual">
                                <SkipForward className="mr-1 h-4 w-4" /> Saltar
                            </Button>
                        </div>
                        <div className="text-center text-sm text-muted-foreground space-y-1 mt-2">
                            <p>Pomodoros Concluídos: {totalPomodoros}</p>
                            <p>Pontos de Foco: <span className="font-semibold text-accent">{focusPoints}</span></p>
                            <p className="text-xs italic">Complete ciclos para aumentar a barra de foco e ganhar pontos!</p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-focus-2">
                    <AccordionTrigger className="text-base">
                        <div className="flex items-center"><Headphones className="mr-2 h-5 w-5 text-primary" />Sessões de Foco Assistido</div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                        <p>Temporizador acompanhado por sons da natureza, chuva, ou ruído branco.</p>
                        <p className="text-xs text-muted-foreground italic">Opção para registar distrações durante a sessão (Em Breve).</p>
                        <Button variant="outline" size="sm" className="mt-2" disabled>Iniciar Sessão (Em Breve)</Button>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-focus-3">
                    <AccordionTrigger className="text-base">
                        <div className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary" />Monitor Diário de Foco</div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                        <p>Avalie a sua concentração após cada sessão.</p>
                        <p className="text-xs text-muted-foreground italic">Mostraremos um gráfico semanal com pontuações médias de foco (Em Breve).</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-focus-4">
                    <AccordionTrigger className="text-base">
                        <div className="flex items-center"><ShieldOff className="mr-2 h-5 w-5 text-primary" />Modo Livre de Distrações</div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                        <p>Quando ativado, bloqueia notificações externas e limita o acesso apenas a ferramentas essenciais (treino, agenda, foco).</p>
                        <p className="text-xs text-muted-foreground italic">Pontos bónus por completar sessões sem sair deste modo (Em Breve).</p>
                        <Button variant="destructive" size="sm" className="mt-2" disabled>Ativar Modo (Em Breve)</Button>
                    </AccordionContent>
                </AccordionItem>
             </Accordion>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
            <CardTitle className="flex items-center"><Award className="mr-2 h-5 w-5 text-yellow-500" /> Integração com Outras Funcionalidades</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="list-disc list-inside pl-4 text-sm text-muted-foreground space-y-1">
                <li>Completar um treino <span className="text-primary font-medium">desbloqueia</span> um exercício de memória.</li>
                <li>Finalizar uma tarefa na agenda <span className="text-primary font-medium">ativa</span> um mini desafio cognitivo.</li>
                <li>Manter o foco por 3 dias consecutivos <span className="text-primary font-medium">desbloqueia</span> conteúdo especial ou dicas de neurociência.</li>
            </ul>
            <p className="text-xs text-muted-foreground italic mt-2">Estas integrações serão implementadas progressivamente.</p>
        </CardContent>
      </Card>

    </div>
  );
}
