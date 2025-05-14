
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lightbulb, Coffee, Clock, Terminal, Bell, RefreshCw, Brain, Briefcase, Palette } from 'lucide-react';
import { suggestTaskTimes, SuggestTaskTimesInput, SuggestTaskTimesOutput, TimeBlock } from '@/ai/flows/suggest-task-times';
import { recommendBreaks, RecommendBreaksInput, RecommendBreaksOutput } from '@/ai/flows/recommend-breaks';
import { generateUserReminders, GenerateUserRemindersInput, GenerateUserRemindersOutput } from '@/ai/flows/generate-user-reminders';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';


const productivityTips = [
  {
    id: 'pomodoro',
    title: 'Técnica Pomodoro',
    tip: 'Trabalhe por 25 minutos, depois faça uma pausa de 5 minutos. Repita 4 vezes, depois descanse mais.',
    icon: Clock, 
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-500 dark:text-red-400',
  },
  {
    id: 'stretch',
    title: 'Pausa para Alongamento', 
    tip: 'Levante-se e faça um alongamento rápido para refrescar o corpo entre tarefas longas.',
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20M4 20h12a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4Z"/><path d="M4 12h8"/><path d="M12 12v8"/></svg>, 
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-500 dark:text-green-400',
  },
   {
    id: 'changeEnv',
    title: 'Mude de Ambiente',
    tip: 'Tente trabalhar de um local diferente quando se sentir bloqueado ou desfocado.', 
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 12h20"/><path d="m5 12-1-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2l-1 7"/><path d="M12 12v8a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-8"/></svg>, 
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-500 dark:text-yellow-400',
  },
  {
    id: 'hydrate',
    title: 'Lembrete de Hidratação', 
    tip: 'Beba um copo de água a cada 2 horas para se manter mentalmente alerta.', 
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s5-4 5-10V6a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v6c0 6 5 10 5 10z"/><path d="M8.5 9a2.5 2.5 0 1 1 5 0"/></svg>, 
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-500 dark:text-blue-400',
  },
  {
    id: 'restProductive',
    title: 'Descansar é Produtivo',
    tip: 'Fazer pausas ajuda o seu cérebro a processar e reter informações melhor.', 
    icon: Brain, 
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-500 dark:text-purple-400',
  },
];

const timeBlockIcons: Record<string, React.ElementType> = {
  'Foco Matinal': Brain,
  'Ritmo do Meio-dia': Briefcase,
  'Criatividade Noturna': Palette,
  'Morning Focus': Brain, // Fallback
  'Midday Momentum': Briefcase, // Fallback
  'Evening Creativity': Palette, // Fallback
};


export default function SuggestionsPage() {
  const [timeSuggestions, setTimeSuggestions] = useState<SuggestTaskTimesOutput | null>(null);
  const [breakRecommendations, setBreakRecommendations] = useState<RecommendBreaksOutput | null>(null);
  const [userReminders, setUserReminders] = useState<GenerateUserRemindersOutput | null>(null);
  
  const [isLoadingTimes, setIsLoadingTimes] = useState(true);
  const [isLoadingBreaks, setIsLoadingBreaks] = useState(true); 
  const [isLoadingReminders, setIsLoadingReminders] = useState(true);

  const [errorTimes, setErrorTimes] = useState<string | null>(null);
  const [errorBreaks, setErrorBreaks] = useState<string | null>(null);
  const [errorReminders, setErrorReminders] = useState<string | null>(null);

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [adaptTimeSuggestions, setAdaptTimeSuggestions] = useState(true);
  const [reminderTone, setReminderTone] = useState<'motivational' | 'neutral' | 'gentle'>('neutral');

  const mockFocusHistory = "Foco alto entre 9h - 11h. Foco baixo por volta das 14h. Geralmente termina tarefas rapidamente pela manhã.";
  const mockPastCompletion = "Concluído 'Relatório do Projeto' às 10:30 de ontem. Finalizado 'Preparação Chamada Cliente' às 9:15 de hoje.";
  const mockTaskHistory = "Concluído: Relatório do Projeto (2h), Preparação Chamada Cliente (1h). Em Curso: Pesquisa de Mercado (Est. 3h). Perdido: E-mail de acompanhamento (venceu ontem). Hábito: Prática de Idioma (última vez há 3 dias).";
  const mockFocusPatterns = "Pico de foco 9-11h. Queda por volta das 14h. Frequentemente distraído por notificações à tarde.";
  const mockUserHabits = "Utilizador frequentemente trabalha até tarde, verifica e-mails logo cedo. Ocasionalmente esquece-se de fazer pausas durante longas sessões de trabalho. Prefere lembretes visuais.";
  const mockCalendarEvents = "Reunião de equipa às 14h hoje. Consulta no dentista amanhã às 10h.";

  const fetchTimeSuggestions = useCallback(async () => {
    setIsLoadingTimes(true);
    setErrorTimes(null);
    try {
      const input: SuggestTaskTimesInput = {
        taskType: 'Sessão de Trabalho Focado',
        focusHistory: mockFocusHistory,
        pastTaskCompletionTimes: mockPastCompletion,
        adaptAutomatically: adaptTimeSuggestions,
      };
      const result = await suggestTaskTimes(input);
      setTimeSuggestions(result);
    } catch (err) {
      console.error('Erro ao buscar sugestões de horários:', err);
      setErrorTimes('Falha ao carregar sugestões de horários. A utilizar sugestões padrão.');
      setTimeSuggestions({
        timeBlocks: [
          { title: 'Foco Matinal', timeRange: '8h – 11h', description: 'Ideal para trabalho focado e tarefas que exigem alta concentração e empenho cognitivo.' },
          { title: 'Ritmo do Meio-dia', timeRange: '12h – 15h', description: 'Adequado para reuniões, comunicação e trabalho colaborativo, quando os níveis de energia permanecem estáveis.' },
          { title: 'Criatividade Noturna', timeRange: '18h – 21h', description: 'Uma excelente janela para pensamento criativo, brainstorming ou tarefas reflexivas.' },
        ],
        reasoning: 'Sugestões padrão exibidas devido a um erro ao buscar dados personalizados.',
      });
    } finally {
      setIsLoadingTimes(false);
    }
  }, [adaptTimeSuggestions]);

  const fetchBreakRecommendations = useCallback(async () => {
    setIsLoadingBreaks(true);
    setErrorBreaks(null);
    try {
      const input: RecommendBreaksInput = {
        taskHistory: mockTaskHistory,
        focusPatterns: mockFocusPatterns,
      };
      const result = await recommendBreaks(input);
      setBreakRecommendations(result);
    } catch (err) {
      console.error('Erro ao buscar recomendações de pausa:', err);
      setErrorBreaks('Falha ao carregar recomendações de pausa da IA.');
    } finally {
      setIsLoadingBreaks(false);
    }
  }, []);

  const fetchUserReminders = useCallback(async () => {
    setIsLoadingReminders(true);
    setErrorReminders(null);
    try {
      const input: GenerateUserRemindersInput = {
        userHabits: mockUserHabits,
        currentTime: new Date().toISOString(),
        upcomingCalendarEvents: mockCalendarEvents,
        recentTaskActivity: mockTaskHistory,
        preferredTone: reminderTone,
      };
      const result = await generateUserReminders(input);
      setUserReminders(result);
    } catch (err) {
      console.error('Erro ao buscar lembretes do utilizador:', err);
      setErrorReminders('Falha ao carregar lembretes inteligentes.');
      setUserReminders({
        reminders: ["Não foi possível gerar lembretes inteligentes no momento. Verifique mais tarde!"],
        reasoning: "Ocorreu um erro ao tentar buscar lembretes inteligentes.",
      });
    } finally {
      setIsLoadingReminders(false);
    }
  }, [reminderTone]);

  const handleRefreshStaticTip = useCallback(() => {
    if (productivityTips.length > 0) {
      const randomIndex = Math.floor(Math.random() * productivityTips.length);
      setCurrentTipIndex(randomIndex);
    }
  }, []);

  useEffect(() => {
    fetchTimeSuggestions();
  }, [fetchTimeSuggestions]);

  useEffect(() => {
    fetchBreakRecommendations();
    handleRefreshStaticTip();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchBreakRecommendations]); 
  
  useEffect(() => {
    fetchUserReminders();
  }, [fetchUserReminders]);

  useEffect(() => {
    if (productivityTips.length === 0 || isLoadingBreaks) return;
    const intervalId = setInterval(() => {
      if (productivityTips.length > 0) {
        setCurrentTipIndex(prevIndex => (prevIndex + 1) % productivityTips.length);
      }
    }, 7000); 
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingBreaks, productivityTips.length]); 

  const handleRefreshAll = () => {
    fetchTimeSuggestions();
    fetchBreakRecommendations();
    fetchUserReminders();
    handleRefreshStaticTip();
  };
  
  const currentProdTip = productivityTips.length > 0 ? productivityTips[currentTipIndex] : null;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
           <Lightbulb className="mr-2 h-9 w-9 text-accent" /> Sugestões Inteligentes
        </h1>
         <Button onClick={handleRefreshAll} variant="outline" disabled={isLoadingTimes || isLoadingBreaks || isLoadingReminders}>
           {(isLoadingTimes || isLoadingBreaks || isLoadingReminders) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
           Atualizar Tudo
         </Button>
      </header>

       <p className="text-muted-foreground">
         Deixe a IA analisar os seus padrões e sugerir horários, pausas e lembretes ideais para melhorar a sua produtividade e bem-estar.
       </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="flex items-center"><Clock className="mr-2 h-6 w-6 text-primary" /> Horários Ideais para Tarefas</CardTitle>
                    <CardDescription>Com base no seu histórico de foco e ritmos circadianos.</CardDescription>
                </div>
                <div className="flex items-center space-x-2 pt-1">
                    <Switch
                        id="adapt-time-suggestions"
                        checked={adaptTimeSuggestions}
                        onCheckedChange={setAdaptTimeSuggestions}
                        aria-label="Adaptar sugestões de horário automaticamente"
                    />
                    <Label htmlFor="adapt-time-suggestions" className="text-xs text-muted-foreground">Adaptar IA</Label>
                </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingTimes ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-1">
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                    </div>
                ))}
                 <Skeleton className="h-4 w-5/6 mt-2" />
              </div>
            ) : errorTimes && (!timeSuggestions || timeSuggestions.timeBlocks.length === 0) ? ( 
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{errorTimes}</AlertDescription>
              </Alert>
            ) : timeSuggestions && timeSuggestions.timeBlocks && timeSuggestions.timeBlocks.length > 0 ? (
              <>
                <div className="space-y-3">
                    {timeSuggestions.timeBlocks.map((block: TimeBlock) => {
                        const IconComponent = timeBlockIcons[block.title] || Lightbulb;
                        return (
                            <div key={block.title} className="p-3 border rounded-md bg-muted/30">
                                <div className="flex items-center font-semibold text-foreground mb-1">
                                    <IconComponent className="mr-2 h-5 w-5 text-accent" />
                                    {block.title} <span className="ml-2 text-sm font-normal text-primary">({block.timeRange})</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{block.description}</p>
                            </div>
                        );
                    })}
                </div>
                <p className="text-xs text-muted-foreground italic pt-2">{timeSuggestions.reasoning}</p>
              </>
            ) : (
              <p className="text-muted-foreground">Nenhuma sugestão de horário disponível.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex-1">
                    <CardTitle className="flex items-center text-lg">
                        <Coffee className="mr-2 h-6 w-6 text-amber-600" /> Dica de Produtividade
                    </CardTitle>
                    <CardDescription className="text-xs">Uma nova dica para otimizar o seu fluxo de trabalho.</CardDescription>
                </div>
                <Button onClick={handleRefreshStaticTip} variant="ghost" size="icon" className="h-8 w-8 shrink-0" title="Próxima Dica" disabled={isLoadingBreaks && !currentProdTip}>
                    <RefreshCw className={cn("h-4 w-4", isLoadingBreaks && !currentProdTip && "animate-spin")} />
                    <span className="sr-only">Próxima Dica</span>
                </Button>
            </CardHeader>
            <CardContent className={cn("flex-grow p-4 pt-2 rounded-b-md", currentProdTip?.bgColor, !currentProdTip && "flex items-center justify-center")}>
                 {isLoadingBreaks && !currentProdTip ? ( 
                    <div className="flex flex-col items-center text-center h-full justify-center space-y-2 w-full">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />
                    </div>
                ) : currentProdTip ? (
                    <div className="flex flex-col items-center text-center h-full justify-center space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">{currentProdTip.title}</h3>
                        <currentProdTip.icon className={cn("h-10 w-10 my-1", currentProdTip.iconColor)} data-ai-hint="ilustração dica" />
                        <p className="text-xs text-muted-foreground px-2 leading-relaxed">{currentProdTip.tip}</p>
                    </div>
                 ) : errorBreaks ? (
                    <Alert variant="destructive" className="w-full">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Erro</AlertTitle>
                        <AlertDescription>{errorBreaks}</AlertDescription>
                     </Alert>
                ) : (
                    <div className="flex flex-col items-center text-center">
                        <Lightbulb className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Nenhuma dica de produtividade disponível no momento.</p>
                    </div>
                )}
            </CardContent>
             {breakRecommendations && !isLoadingBreaks && !errorBreaks && (
              <CardFooter className="pt-3 border-t border-border/50">
                <div className="text-xs space-y-1">
                    <p className="font-semibold text-foreground">Pausa Sugerida pela IA:</p>
                    <p className="text-muted-foreground"><span className="font-medium text-foreground/80">Recomendação:</span> {breakRecommendations.breakRecommendation}</p>
                    <p className="text-muted-foreground"><span className="font-medium text-foreground/80">Técnica:</span> {breakRecommendations.productivityTechnique}</p>
                    <p className="text-muted-foreground italic"><span className="font-medium text-foreground/80">Justificação:</span> {breakRecommendations.reasoning}</p>
                </div>
              </CardFooter>
            )}
        </Card>
      </div>

       <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex flex-wrap justify-between items-center gap-2">
                <div>
                    <CardTitle className="flex items-center"><Bell className="mr-2 h-6 w-6 text-fuchsia-500" /> Lembretes Inteligentes</CardTitle>
                    <CardDescription>Lembretes gerados por IA com base nos seus hábitos e contexto.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="reminder-tone" className="text-xs text-muted-foreground whitespace-nowrap">Tom do Lembrete:</Label>
                    <Select value={reminderTone} onValueChange={(value) => setReminderTone(value as typeof reminderTone)}>
                        <SelectTrigger id="reminder-tone" className="w-[150px] h-8 text-xs">
                            <SelectValue placeholder="Selecione o tom" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="motivational" className="text-xs">Motivacional</SelectItem>
                            <SelectItem value="neutral" className="text-xs">Neutro</SelectItem>
                            <SelectItem value="gentle" className="text-xs">Gentil</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoadingReminders ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : errorReminders && (!userReminders || userReminders.reminders.length === 0 || (userReminders.reminders[0] && userReminders.reminders[0].includes("Não foi possível gerar"))) ? (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{errorReminders}</AlertDescription>
              </Alert>
            ) : userReminders && userReminders.reminders && userReminders.reminders.length > 0 ? (
                userReminders.reminders.map((reminder, index) => (
                    <Alert key={index} variant="default" className="bg-muted/30">
                        <Bell className="h-4 w-4 text-fuchsia-500" />
                        <AlertDescription className="text-sm text-foreground">
                         {reminder}
                        </AlertDescription>
                    </Alert>
                ))
            ) : (
              <p className="text-muted-foreground text-sm text-center py-2">Nenhum lembrete inteligente para si no momento. Volte mais tarde!</p>
            )}
             {userReminders && userReminders.reasoning && !isLoadingReminders && (
                 <p className="text-xs text-muted-foreground italic pt-2 text-center">
                    {userReminders.reasoning}
                 </p>
             )}
          </CardContent>
        </Card>
    </div>
  );
}
