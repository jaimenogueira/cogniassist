
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart as BarChartIcon, TrendingUp, CheckCircle, XCircle, Award, Download, Info, CalendarCheck2, Clock } from 'lucide-react';
import { ResponsiveContainer, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, CartesianGrid, BarChart as RechartsBarChart, LineChart as RechartsLineChart, Line } from 'recharts';
import { ChartTooltipContent, ChartContainer, ChartConfig } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// Mock data - replace with actual data fetching and aggregation
const taskCompletionDataDaily = [
  { date: 'Mon', completed: 5, missed: 1 },
  { date: 'Tue', completed: 7, missed: 0 },
  { date: 'Wed', completed: 4, missed: 2 },
  { date: 'Thu', completed: 6, missed: 1 },
  { date: 'Fri', completed: 8, missed: 0 },
  { date: 'Sat', completed: 3, missed: 0 },
  { date: 'Sun', completed: 2, missed: 1 },
];

const productiveHoursDataWeekly = [
  { week: 'W1', hours: 25 },
  { week: 'W2', hours: 30 },
  { week: 'W3', hours: 22 },
  { week: 'W4', hours: 28 },
];

const taskCompletionPercentageWeekly = [
  { week: 'W1', completionRate: 75 },
  { week: 'W2', completionRate: 80 },
  { week: 'W3', completionRate: 70 },
  { week: 'W4', completionRate: 85 },
];

const chartConfig = {
  completed: {
    label: "Completed Tasks",
    color: "hsl(var(--chart-2))",
  },
  missed: {
    label: "Missed Tasks",
    color: "hsl(var(--chart-5))",
  },
  productiveHours: {
    label: "Productive Hours",
    color: "hsl(var(--chart-1))",
  },
  completionRate: {
    label: "Completion Rate (%)",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;


export default function HistoryPage() {
    const [totalCompleted, setTotalCompleted] = useState(0);
    const [totalMissed, setTotalMissed] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState('thisMonth');

    // Mock data for highlights and insights - in a real app, this would be dynamic
    const [mostProductiveDay, setMostProductiveDay] = useState("Wednesdays");
    const [bestFocusTime, setBestFocusTime] = useState("9 AM - 12 PM");
    const [aiInsight, setAiInsight] = useState("You tend to focus better before lunch, especially on complex tasks.");


    useEffect(() => {
        // Calculate totals from mock data
        const completed = taskCompletionDataDaily.reduce((sum, day) => sum + day.completed, 0);
        const missed = taskCompletionDataDaily.reduce((sum, day) => sum + day.missed, 0);
        setTotalCompleted(completed);
        setTotalMissed(missed);

        // In a real app, data for productiveDay, focusTime, and aiInsight
        // would be fetched or calculated based on selectedMonth
        if (selectedMonth === 'lastMonth') {
            setMostProductiveDay("Tuesdays (Last Month)");
            setBestFocusTime("10 AM - 1 PM (Last Month)");
            setAiInsight("Last month, your afternoon focus was slightly higher.");
        } else {
            setMostProductiveDay("Wednesdays");
            setBestFocusTime("9 AM - 12 PM");
            setAiInsight("You tend to focus better before lunch, especially on complex tasks.");
        }

    }, [selectedMonth]);


  const handleExportReport = () => {
    // Placeholder for PDF export functionality
    alert('PDF Export functionality coming soon!');
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
           <BarChartIcon className="mr-2 h-8 w-8 text-primary" /> History & Reports
        </h1>
         <Button onClick={handleExportReport} variant="outline">
           <Download className="mr-2 h-4 w-4" /> Export Weekly Report (PDF)
         </Button>
      </header>
        <p className="text-muted-foreground">
            Review your task completion history and productivity trends over time.
        </p>

      {/* Task Completion Stats (Daily) */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-accent" /> Task Completion Overview (Last 7 Days)</CardTitle>
          <CardDescription>Comparing completed vs. missed tasks on a daily basis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid grid-cols-2 gap-4 text-center">
             <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalCompleted}</p>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
             </div>
              <div className="p-4 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalMissed}</p>
                <p className="text-sm text-muted-foreground">Tasks Missed</p>
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
                  <Bar dataKey="completed" fill="var(--color-completed)" radius={4} name="Completed" />
                  <Bar dataKey="missed" fill="var(--color-missed)" radius={4} name="Missed" />
               </RechartsBarChart>
              </ChartContainer>
            </div>
        </CardContent>
      </Card>

       {/* Productivity Trends (Monthly) */}
       <Card className="shadow-sm hover:shadow-md transition-shadow">
         <CardHeader className="items-start gap-2 space-y-0">
            <div className="flex w-full justify-between items-start">
                <div>
                    <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-blue-500" /> Productivity Trends (Monthly)</CardTitle>
                    <CardDescription>Visualizing your focus, efficiency, and completion rates.</CardDescription>
                </div>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="thisMonth">This Month</SelectItem>
                        <SelectItem value="lastMonth">Last Month</SelectItem>
                    </SelectContent>
                </Select>
            </div>
         </CardHeader>
         <CardContent className="space-y-6">
            {/* Productive Hours per Week - Line Chart */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Productive Hours per Week</h3>
                <div className="h-[250px] w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <RechartsLineChart accessibilityLayer data={productiveHoursDataWeekly} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                            <RechartsTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Legend align="center" iconType="line" />
                            <Line type="monotone" dataKey="hours" stroke="var(--color-productiveHours)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-productiveHours)" }} activeDot={{ r: 6 }} name="Productive Hours" />
                        </RechartsLineChart>
                    </ChartContainer>
                </div>
            </div>

            <Separator />

            {/* Task Completion Rate per Week - Bar Chart */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Task Completion Rate per Week</h3>
                <div className="h-[250px] w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <RechartsBarChart accessibilityLayer data={taskCompletionPercentageWeekly} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis unit="%" domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={8} width={35} />
                            <RechartsTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Legend align="center" iconType="circle" />
                            <Bar dataKey="completionRate" fill="var(--color-completionRate)" radius={4} name="Completion Rate (%)" />
                        </RechartsBarChart>
                    </ChartContainer>
                </div>
            </div>
            
            <Separator />

            {/* Highlights Section */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center p-3 bg-muted/50 rounded-lg">
                        <CalendarCheck2 className="h-6 w-6 text-primary mr-3" />
                        <div>
                            <p className="text-sm font-medium text-foreground">Most Productive Days</p>
                            <p className="text-base font-semibold text-accent">{mostProductiveDay}</p>
                        </div>
                    </div>
                    <div className="flex items-center p-3 bg-muted/50 rounded-lg">
                        <Clock className="h-6 w-6 text-primary mr-3" />
                        <div>
                            <p className="text-sm font-medium text-foreground">Best Focus Time</p>
                            <p className="text-base font-semibold text-accent">{bestFocusTime}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            {/* AI Insights Section */}
            <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center"><Info className="h-5 w-5 text-blue-500 mr-2" /> AI Insights</h3>
                <p className="text-sm text-muted-foreground italic p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    "{aiInsight}"
                </p>
            </div>
         </CardContent>
       </Card>


      {/* Gamification / Rewards */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center"><Award className="mr-2 h-5 w-5 text-yellow-500" /> Achievements & Rewards</CardTitle>
          <CardDescription>Earn badges for your consistency and progress!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 items-center justify-center">
          <div className="text-center p-3 border rounded-lg bg-secondary w-24">
            <Award className="h-8 w-8 text-yellow-500 mx-auto mb-1" />
            <p className="text-xs font-medium">Streak Starter</p>
            <p className="text-xs text-muted-foreground">Complete tasks 3 days in a row</p>
          </div>
           <div className="text-center p-3 border rounded-lg bg-secondary w-24 opacity-50">
            <Award className="h-8 w-8 text-gray-400 mx-auto mb-1" />
            <p className="text-xs font-medium">Focus Master</p>
             <p className="text-xs text-muted-foreground">5 Pomodoro sessions</p>
          </div>
           <div className="text-center p-3 border rounded-lg bg-secondary w-24 opacity-50">
            <Award className="h-8 w-8 text-gray-400 mx-auto mb-1" />
            <p className="text-xs font-medium">Perfect Week</p>
            <p className="text-xs text-muted-foreground">0 missed tasks in a week</p>
          </div>
            <p className="w-full text-center text-muted-foreground text-sm mt-4">More achievements coming soon!</p>
        </CardContent>
      </Card>

       {/* Motivational Feedback */}
       <Card className="shadow-sm bg-gradient-to-r from-primary/20 to-accent/20 border-0">
           <CardContent className="p-4">
               <p className="text-center text-sm italic text-foreground/80">"The key is not to prioritize what's on your schedule, but to schedule your priorities." – Stephen Covey</p>
           </CardContent>
       </Card>

    </div>
  );
}
        
