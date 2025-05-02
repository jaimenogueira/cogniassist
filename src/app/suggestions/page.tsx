
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lightbulb, Coffee, Clock, Terminal } from 'lucide-react';
import { suggestTaskTimes, SuggestTaskTimesInput, SuggestTaskTimesOutput } from '@/ai/flows/suggest-task-times';
import { recommendBreaks, RecommendBreaksInput, RecommendBreaksOutput } from '@/ai/flows/recommend-breaks';
import { Skeleton } from '@/components/ui/skeleton';

export default function SuggestionsPage() {
  const [timeSuggestions, setTimeSuggestions] = useState<SuggestTaskTimesOutput | null>(null);
  const [breakRecommendations, setBreakRecommendations] = useState<RecommendBreaksOutput | null>(null);
  const [isLoadingTimes, setIsLoadingTimes] = useState(true);
  const [isLoadingBreaks, setIsLoadingBreaks] = useState(true);
  const [errorTimes, setErrorTimes] = useState<string | null>(null);
  const [errorBreaks, setErrorBreaks] = useState<string | null>(null);

  // Mock data for AI input - replace with actual user data later
  const mockFocusHistory = "High focus between 9 AM - 11 AM. Low focus around 2 PM. Usually finishes tasks quickly in the morning.";
  const mockPastCompletion = "Completed 'Project Report' at 10:30 AM yesterday. Finished 'Client Call Prep' at 9:15 AM today.";
  const mockTaskHistory = "Completed: Project Report (2h), Client Call Prep (1h). In Progress: Market Research (Est. 3h). Missed: Follow up email (due yesterday).";
  const mockFocusPatterns = "Peak focus 9-11 AM. Dip around 2 PM. Often distracted by notifications in the afternoon.";

  const fetchTimeSuggestions = async () => {
    setIsLoadingTimes(true);
    setErrorTimes(null);
    try {
      const input: SuggestTaskTimesInput = {
        taskType: 'Deep Work Session', // Example task type
        focusHistory: mockFocusHistory,
        pastTaskCompletionTimes: mockPastCompletion,
      };
      const result = await suggestTaskTimes(input);
      setTimeSuggestions(result);
    } catch (err) {
      console.error('Error fetching time suggestions:', err);
      setErrorTimes('Failed to load time suggestions.');
    } finally {
      setIsLoadingTimes(false);
    }
  };

  const fetchBreakRecommendations = async () => {
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
      console.error('Error fetching break recommendations:', err);
      setErrorBreaks('Failed to load break recommendations.');
    } finally {
      setIsLoadingBreaks(false);
    }
  };

  useEffect(() => {
    fetchTimeSuggestions();
    fetchBreakRecommendations();
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
           <Lightbulb className="mr-2 h-8 w-8 text-accent" /> Smart Suggestions
        </h1>
        {/* Add refresh button or other actions if needed */}
         <Button onClick={() => { fetchTimeSuggestions(); fetchBreakRecommendations(); }} variant="outline" disabled={isLoadingTimes || isLoadingBreaks}>
           {isLoadingTimes || isLoadingBreaks ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
           Refresh Suggestions
         </Button>
      </header>

       <p className="text-muted-foreground">
         Let AI analyze your patterns and suggest optimal times and breaks to enhance your productivity and well-being.
       </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ideal Task Times Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center"><Clock className="mr-2 h-5 w-5 text-primary" /> Ideal Task Times</CardTitle>
            <CardDescription>Based on your focus history.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoadingTimes ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : errorTimes ? (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorTimes}</AlertDescription>
              </Alert>
            ) : timeSuggestions ? (
              <>
                <p className="font-semibold">Suggested Times:</p>
                <p className="text-sm">{timeSuggestions.suggestedTimes || 'No specific times suggested.'}</p>
                <p className="font-semibold pt-2">Reasoning:</p>
                <p className="text-sm text-muted-foreground">{timeSuggestions.reasoning || 'No reasoning provided.'}</p>
              </>
            ) : (
              <p className="text-muted-foreground">No suggestions available.</p>
            )}
          </CardContent>
        </Card>

        {/* Break & Productivity Recommendations Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center"><Coffee className="mr-2 h-5 w-5 text-amber-600" /> Break & Productivity Tips</CardTitle>
            <CardDescription>Optimize your workflow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoadingBreaks ? (
               <div className="space-y-2">
                 <Skeleton className="h-4 w-3/4" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-5/6" />
               </div>
            ) : errorBreaks ? (
               <Alert variant="destructive">
                 <Terminal className="h-4 w-4" />
                 <AlertTitle>Error</AlertTitle>
                 <AlertDescription>{errorBreaks}</AlertDescription>
               </Alert>
            ) : breakRecommendations ? (
              <>
                <p className="font-semibold">Break Recommendation:</p>
                <p className="text-sm">{breakRecommendations.breakRecommendation || 'Take short breaks every hour.'}</p>
                 <p className="font-semibold pt-2">Productivity Technique:</p>
                <p className="text-sm">{breakRecommendations.productivityTechnique || 'Try the Pomodoro Technique.'}</p>
                <p className="font-semibold pt-2">Reasoning:</p>
                <p className="text-sm text-muted-foreground">{breakRecommendations.reasoning || 'Based on general best practices.'}</p>
              </>
            ) : (
              <p className="text-muted-foreground">No recommendations available.</p>
            )}
          </CardContent>
        </Card>
      </div>
       {/* Placeholder for auto-generated reminders */}
       <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-accent" /> Auto-Generated Reminders</CardTitle>
            <CardDescription>AI suggestions based on potential forgetfulness (Feature Coming Soon).</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">This section will show reminders automatically suggested by the AI based on your habits and commonly missed tasks.</p>
          </CardContent>
        </Card>
    </div>
  );
}
        