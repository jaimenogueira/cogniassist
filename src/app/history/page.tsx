
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart as BarChartIcon, TrendingUp, CheckCircle, XCircle, Award, Download, Info, CalendarCheck2, Clock } from 'lucide-react';
import { ResponsiveContainer, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, CartesianGrid, BarChart as RechartsBarChart, LineChart as RechartsLineChart, Line } from 'recharts';
import { ChartTooltipContent, ChartContainer, ChartConfig } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const taskCompletionDataDaily = [
  { date: 'Seg', completed: 5, missed: 1 },
  { date: 'Ter', completed: 7, missed: 0 },
  { date: 'Qua', completed: 4, missed: 2 },
  { date: 'Qui', completed: 6, missed: 1 },
  { date: 'Sex', completed: 8, missed: 0 },
  { date: 'Sáb', completed: 3, missed: 0 },
  { date: 'Dom', completed: 2, missed: 1 },
];

const productiveHoursDataWeekly = [
  { week: 'S1', hours: 25 },
  { week: 'S2', hours: 30 },
  { week: 'S3', hours: 22 },
  { week: 'S4', hours: 28 },
];

const taskCompletionPercentageWeekly = [
  { week: 'S1', completionRate: 75 },
  { week: 'S2', completionRate: 80 },
  { week: 'S3', completionRate: 70 },
  { week: 'S4', completionRate: 85 },
];

const chartConfig = {
  completed: {
    label: "Tarefas Concluídas",
    color: "hsl(var(--chart-2))",
  },
  missed: {
    label: "Tarefas Perdidas",
    color: "hsl(var(--chart-5))",
  },
  productiveHours: {
    label: "Horas Produtivas",
    color: "hsl(var(--chart-1))",
  },
  completionRate: {
    label: "Taxa de Conclusão (%)",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;


export default function HistoryPage() {
    const [totalCompleted, setTotalCompleted] = useState(0);
    const [totalMissed, setTotalMissed] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState('thisMonth');

    const [mostProductiveDay, setMostProductiveDay] = useState("Quartas-feiras");
    const [bestFocusTime, setBestFocusTime] = useState("9h - 12h");
    const [aiInsight, setAiInsight] = useState("Você tende a se concentrar melhor antes do almoço, especialmente em tarefas complexas.");


    useEffect(() => {
        const completed = taskCompletionDataDaily.reduce((sum, day) => sum + day.completed, 0);
        const missed = taskCompletionDataDaily.reduce((sum, day) => sum + day.missed, 0);
        setTotalCompleted(completed);
        setTotalMissed(missed);

        if (selectedMonth === 'lastMonth') {
            setMostProductiveDay("Terças-feiras (Mês Passado)");
            setBestFocusTime("10h - 13h (Mês Passado)");
            setAiInsight("No mês passado, seu foco à tarde foi ligeiramente maior.");
        } else {
            setMostProductiveDay("Quartas-feiras");
            setBestFocusTime("9h - 12h");
            setAiInsight("Você tende a se concentrar melhor antes do almoço, especialmente em tarefas complexas.");
        }

    }, [selectedMonth]);


  const handleExportReport = () => {
    alert('Funcionalidade de exportação para PDF em breve!');
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
           <BarChartIcon className="mr-2 h-8 w-8 text-primary" /> Histórico e Relatórios
        </h1>
         <Button onClick={handleExportReport} variant="outline">
           <Download className="mr-2 h-4 w-4" /> Exportar Relatório Semanal (PDF)
         </Button>
      </header>
        <p className="text-muted-foreground">
            Revise seu histórico de conclusão de tarefas e tendências de produtividade ao longo do tempo.
        </p>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-accent" /> Visão Geral da Conclusão de Tarefas (Últimos 7 Dias)</CardTitle>
          <CardDescription>Comparando tarefas concluídas vs. perdidas diariamente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid grid-cols-2 gap-4 text-center">
             <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalCompleted}</p>
                <p className="text-sm text-muted-foreground">Tarefas Concluídas</p>
             </div>
              <div className="p-4 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalMissed}</p>
                <p className="text-sm text-muted-foreground">Tarefas Perdidas</p>
              </div>
           </div>
           <div className="h-[300px] w-full">
             <ChartContainer config={chartConfig} className="h-full w-full">
               <RechartsBarChart accessibilityLayer data={taskCompletionDataDaily} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30}/>
                  <RechartsTooltip
                     cursor={false}
                     content={<ChartTooltipContent hideLabel />}
                   />
                   <Legend align="center" iconType="circle" />
                  <Bar dataKey="completed" fill="var(--color-completed)" radius={4} name={chartConfig.completed.label} />
                  <Bar dataKey="missed" fill="var(--color-missed)" radius={4} name={chartConfig.missed.label} />
               </RechartsBarChart>
              </ChartContainer>
            </div>
        </CardContent>
      </Card>

       <Card className="shadow-sm hover:shadow-md transition-shadow">
         <CardHeader className="items-start gap-2 space-y-0">
            <div className="flex w-full justify-between items-start">
                <div>
                    <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-blue-500" /> Tendências de Produtividade (Mensal)</CardTitle>
                    <CardDescription>Visualizando seu foco, eficiência e taxas de conclusão.</CardDescription>
                </div>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione o mês" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="thisMonth">Este Mês</SelectItem>
                        <SelectItem value="lastMonth">Mês Passado</SelectItem>
                    </SelectContent>
                </Select>
            </div>
         </CardHeader>
         <CardContent className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">Horas Produtivas por Semana</h3>
                <div className="h-[250px] w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <RechartsLineChart accessibilityLayer data={productiveHoursDataWeekly} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} />
                            <RechartsTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Legend align="center" iconType="line" />
                            <Line type="monotone" dataKey="hours" stroke="var(--color-productiveHours)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-productiveHours)" }} activeDot={{ r: 6 }} name={chartConfig.productiveHours.label} />
                        </RechartsLineChart>
                    </ChartContainer>
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="text-lg font-semibold mb-2">Taxa de Conclusão de Tarefas por Semana</h3>
                <div className="h-[250px] w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <RechartsBarChart accessibilityLayer data={taskCompletionPercentageWeekly} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis unit="%" domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={8} width={35} />
                            <RechartsTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Legend align="center" iconType="circle" />
                            <Bar dataKey="completionRate" fill="var(--color-completionRate)" radius={4} name={chartConfig.completionRate.label} />
                        </RechartsBarChart>
                    </ChartContainer>
                </div>
            </div>
            
            <Separator />

            <div>
                <h3 className="text-lg font-semibold mb-3">Destaques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center p-3 bg-muted/50 rounded-lg">
                        <CalendarCheck2 className="h-6 w-6 text-primary mr-3" />
                        <div>
                            <p className="text-sm font-medium text-foreground">Dias Mais Produtivos</p>
                            <p className="text-base font-semibold text-accent">{mostProductiveDay}</p>
                        </div>
                    </div>
                    <div className="flex items-center p-3 bg-muted/50 rounded-lg">
                        <Clock className="h-6 w-6 text-primary mr-3" />
                        <div>
                            <p className="text-sm font-medium text-foreground">Melhor Horário de Foco</p>
                            <p className="text-base font-semibold text-accent">{bestFocusTime}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center"><Info className="h-5 w-5 text-blue-500 mr-2" /> Insights da IA</h3>
                <p className="text-sm text-muted-foreground italic p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    "{aiInsight}"
                </p>
            </div>
         </CardContent>
       </Card>


      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center"><Award className="mr-2 h-5 w-5 text-yellow-500" /> Conquistas e Recompensas</CardTitle>
          <CardDescription>Ganhe emblemas por sua consistência e progresso!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 items-center justify-center">
          <div className="text-center p-3 border rounded-lg bg-secondary w-24">
            <Award className="h-8 w-8 text-yellow-500 mx-auto mb-1" />
            <p className="text-xs font-medium">Início de Sequência</p>
            <p className="text-xs text-muted-foreground">Complete tarefas 3 dias seguidos</p>
          </div>
           <div className="text-center p-3 border rounded-lg bg-secondary w-24 opacity-50">
            <Award className="h-8 w-8 text-gray-400 mx-auto mb-1" />
            <p className="text-xs font-medium">Mestre do Foco</p>
             <p className="text-xs text-muted-foreground">5 sessões Pomodoro</p>
          </div>
           <div className="text-center p-3 border rounded-lg bg-secondary w-24 opacity-50">
            <Award className="h-8 w-8 text-gray-400 mx-auto mb-1" />
            <p className="text-xs font-medium">Semana Perfeita</p>
            <p className="text-xs text-muted-foreground">0 tarefas perdidas na semana</p>
          </div>
            <p className="w-full text-center text-muted-foreground text-sm mt-4">Mais conquistas em breve!</p>
        </CardContent>
      </Card>

       <Card className="shadow-sm bg-gradient-to-r from-primary/20 to-accent/20 border-0">
           <CardContent className="p-4">
               <p className="text-center text-sm italic text-foreground/80">"A chave não é priorizar o que está na sua agenda, mas agendar suas prioridades." – Stephen Covey</p>
           </CardContent>
       </Card>

    </div>
  );
}
