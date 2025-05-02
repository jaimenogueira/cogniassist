
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, TrendingUp, CheckCircle, XCircle, Award, Download } from 'lucide-react';
import { ResponsiveContainer, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, CartesianGrid, BarChart as RechartsBarChart } from 'recharts';
import { ChartTooltipContent, ChartContainer, ChartConfig } from "@/components/ui/chart"; // Assuming chart components are available

// Mock data - replace with actual data fetching and aggregation
const taskCompletionData = [
  { date: 'Mon', completed: 5, missed: 1 },
  { date: 'Tue', completed: 7, missed: 0 },
  { date: 'Wed', completed: 4, missed: 2 },
  { date: 'Thu', completed: 6, missed: 1 },
  { date: 'Fri', completed: 8, missed: 0 },
  { date: 'Sat', completed: 3, missed: 0 },
  { date: 'Sun', completed: 2, missed: 1 },
];

const productivityTrendData = [
  { week: 'W1', score: 75 },
  { week: 'W2', score: 80 },
  { week: 'W3', score: 70 },
  { week: 'W4', score: 85 },
];

const chartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-2))", // Example color mapping
  },
  missed: {
    label: "Missed",
    color: "hsl(var(--chart-5))", // Example color mapping
  },
} satisfies ChartConfig;


export default function HistoryPage() {
    const [totalCompleted, setTotalCompleted] = useState(0);
    const [totalMissed, setTotalMissed] = useState(0);

    useEffect(() => {
        // Calculate totals from mock data
        const completed = taskCompletionData.reduce((sum, day) => sum + day.completed, 0);
        const missed = taskCompletionData.reduce((sum, day) => sum + day.missed, 0);
        setTotalCompleted(completed);
        setTotalMissed(missed);
    }, []);


  const handleExportReport = () => {
    // Placeholder for PDF export functionality
    alert('PDF Export functionality coming soon!');
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
           <BarChart className="mr-2 h-8 w-8 text-primary" /> History & Reports
        </h1>
         <Button onClick={handleExportReport} variant="outline">
           <Download className="mr-2 h-4 w-4" /> Export Weekly Report (PDF)
         </Button>
      </header>
        <p className="text-muted-foreground">
            Review your task completion history and productivity trends over time.
        </p>

      {/* Task Completion Stats */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-accent" /> Task Completion Overview (Last 7 Days)</CardTitle>
          <CardDescription>Comparing completed vs. missed tasks.</CardDescription>
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
               <RechartsBarChart accessibilityLayer data={taskCompletionData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30}/>
                  <RechartsTooltip
                     cursor={false}
                     content={<ChartTooltipContent hideLabel />}
                   />
                   <Legend align="center" iconType="circle" />
                  <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
                  <Bar dataKey="missed" fill="var(--color-missed)" radius={4} />
               </RechartsBarChart>
              </ChartContainer>
            </div>
        </CardContent>
      </Card>

       {/* Productivity Trends (Placeholder) */}
       <Card className="shadow-sm hover:shadow-md transition-shadow">
         <CardHeader>
           <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-blue-500" /> Productivity Trends (Monthly)</CardTitle>
           <CardDescription>Visualizing your focus and efficiency scores over weeks.</CardDescription>
         </CardHeader>
         <CardContent>
           {/* Placeholder for Line Chart */}
           <div className="h-[250px] flex items-center justify-center text-muted-foreground bg-muted/30 rounded-md">
             <p>Productivity trend chart coming soon!</p>
             {/* Example: <LineChart data={productivityTrendData}>...</LineChart> */}
           </div>
         </CardContent>
       </Card>


      {/* Gamification / Rewards (Placeholder) */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center"><Award className="mr-2 h-5 w-5 text-yellow-500" /> Achievements & Rewards</CardTitle>
          <CardDescription>Earn badges for your consistency and progress!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 items-center justify-center">
          {/* Placeholder Badges */}
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
          {/* Add more badges */}
            <p className="w-full text-center text-muted-foreground text-sm mt-4">More achievements coming soon!</p>
        </CardContent>
      </Card>

       {/* Motivational Feedback */}
       <Card className="shadow-sm bg-gradient-to-r from-primary/20 to-accent/20 border-0">
           <CardContent className="p-4">
               <p className="text-center text-sm italic text-foreground/80">"The key is not to prioritize what's on your schedule, but to schedule your priorities." – Stephen Covey</p>
               {/* Add dynamic motivational messages based on performance */}
           </CardContent>
       </Card>

    </div>
  );
}
        