
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


// Productivity Tips Data
const productivityTips = [
  {
    id: 'pomodoro',
    title: 'Pomodoro Technique',
    tip: 'Work for 25 minutes, then take a 5-minute break. Repeat 4 times, then rest longer.',
    icon: Clock, // Represents ⏱️
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-500 dark:text-red-400',
  },
  {
    id: 'stretch',
    title: 'Stretch Break', // Updated title
    tip: 'Stand up and do a quick stretch to refresh your body between long tasks.',
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20M4 20h12a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4Z"/><path d="M4 12h8"/><path d="M12 12v8"/></svg>, // Represents 🤸‍♂️
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-500 dark:text-green-400',
  },
   {
    id: 'changeEnv',
    title: 'Change Environment',
    tip: 'Try working from a different location when you feel stuck or unfocused.', // Tip updated
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 12h20"/><path d="m5 12-1-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2l-1 7"/><path d="M12 12v8a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-8"/></svg>, // Represents 🌿
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-500 dark:text-yellow-400',
  },
  {
    id: 'hydrate',
    title: 'Hydration Reminder', // Updated title
    tip: 'Drink a glass of water every 2 hours to stay mentally sharp.', // Tip updated
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s5-4 5-10V6a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v6c0 6 5 10 5 10z"/><path d="M8.5 9a2.5 2.5 0 1 1 5 0"/></svg>, // Represents 💧
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-500 dark:text-blue-400',
  },
  {
    id: 'restProductive',
    title: 'Rest Is Productive',
    tip: 'Taking breaks helps your brain process and retain information better.', // Tip updated
    icon: Brain, // Represents 🧠
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-500 dark:text-purple-400',
  },
];

const timeBlockIcons: Record<string, React.ElementType> = {
  'Morning Focus': Brain,
  'Midday Momentum': Briefcase,
  'Evening Creativity': Palette,
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


  // Mock data for AI input - replace with actual user data later
  const mockFocusHistory = "High focus between 9 AM - 11 AM. Low focus around 2 PM. Usually finishes tasks quickly in the morning.";
  const mockPastCompletion = "Completed 'Project Report' at 10:30 AM yesterday. Finished 'Client Call Prep' at 9:15 AM today.";
  const mockTaskHistory = "Completed: Project Report (2h), Client Call Prep (1h). In Progress: Market Research (Est. 3h). Missed: Follow up email (due yesterday). Habit: Language Practice (last done 3 days ago).";
  const mockFocusPatterns = "Peak focus 9-11 AM. Dip around 2 PM. Often distracted by notifications in the afternoon.";
  const mockUserHabits = "User often works late, checks emails first thing. Occasionally forgets to take breaks during long work sessions. Prefers visual reminders.";
  const mockCalendarEvents = "Team Meeting at 2 PM today. Dentist appointment tomorrow at 10 AM.";
  // const mockMood = "stressed"; // Optional: could be dynamic


  const fetchTimeSuggestions = useCallback(async () => {
    setIsLoadingTimes(true);
    setErrorTimes(null);
    try {
      const input: SuggestTaskTimesInput = {
        taskType: 'Deep Work Session',
        focusHistory: mockFocusHistory,
        pastTaskCompletionTimes: mockPastCompletion,
        adaptAutomatically: adaptTimeSuggestions,
      };
      const result = await suggestTaskTimes(input);
      setTimeSuggestions(result);
    } catch (err) {
      console.error('Error fetching time suggestions:', err);
      setErrorTimes('Failed to load time suggestions. Using default suggestions.');
      // Fallback to default time suggestions on error
      setTimeSuggestions({
        timeBlocks: [
          { title: 'Morning Focus', timeRange: '8 AM – 11 AM', description: 'Ideal for deep work and tasks requiring high concentration.' },
          { title: 'Midday Momentum', timeRange: '12 PM – 3 PM', description: 'Suitable for meetings, communication, and collaboration.' },
          { title: 'Evening Creativity', timeRange: '6 PM – 9 PM', description: 'Good for creative thinking or reflective tasks.' },
        ],
        reasoning: 'Default suggestions are shown due to an error fetching personalized data.',
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
      console.error('Error fetching break recommendations:', err);
      setErrorBreaks('Failed to load AI break recommendations.');
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
        // mood: mockMood, // Pass mood if available
      };
      const result = await generateUserReminders(input);
      setUserReminders(result);
    } catch (err) {
      console.error('Error fetching user reminders:', err);
      setErrorReminders('Failed to load smart reminders.');
      setUserReminders({
        reminders: ["Could not generate smart reminders at this time. Check back later!"],
        reasoning: "An error occurred while attempting to fetch smart reminders.",
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
     // Fetch initial static tip when break recommendations are (or would be) fetched
    handleRefreshStaticTip();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchBreakRecommendations]); 
  
  useEffect(() => {
    fetchUserReminders();
  }, [fetchUserReminders]);


  // Auto-rotation for productivity tips
  useEffect(() => {
    if (productivityTips.length === 0 || isLoadingBreaks) return;

    const intervalId = setInterval(() => {
      if (productivityTips.length > 0) {
        setCurrentTipIndex(prevIndex => (prevIndex + 1) % productivityTips.length);
      }
    }, 7000); // Rotate every 7 seconds

    return () => clearInterval(intervalId);
  }, [isLoadingBreaks]); 


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
           <Lightbulb className="mr-2 h-8 w-8 text-accent" /> Smart Suggestions
        </h1>
         <Button onClick={handleRefreshAll} variant="outline" disabled={isLoadingTimes || isLoadingBreaks || isLoadingReminders}>
           {(isLoadingTimes || isLoadingBreaks || isLoadingReminders) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
           Refresh All
         </Button>
      </header>

       <p className="text-muted-foreground">
         Let AI analyze your patterns and suggest optimal times, breaks, and reminders to enhance your productivity and well-being.
       </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ideal Task Times Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="flex items-center"><Clock className="mr-2 h-5 w-5 text-primary" /> Ideal Task Times</CardTitle>
                    <CardDescription>Based on your focus history & circadian rhythms.</CardDescription>
                </div>
                <div className="flex items-center space-x-2 pt-1">
                    <Switch
                        id="adapt-time-suggestions"
                        checked={adaptTimeSuggestions}
                        onCheckedChange={setAdaptTimeSuggestions}
                        aria-label="Adapt time suggestions automatically"
                    />
                    <Label htmlFor="adapt-time-suggestions" className="text-xs text-muted-foreground">Adapt AI</Label>
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
            ) : errorTimes && (!timeSuggestions || timeSuggestions.timeBlocks.length === 0) ? ( // Show error only if no fallback data
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
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
              <p className="text-muted-foreground">No time suggestions available.</p>
            )}
          </CardContent>
        </Card>

        {/* Break & Productivity Tip Card (Panel) */}
        <Card className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex-1">
                    <CardTitle className="flex items-center text-lg">
                        <Coffee className="mr-2 h-5 w-5 text-amber-600" /> Productivity Tip
                    </CardTitle>
                    <CardDescription className="text-xs">A new tip to optimize your workflow.</CardDescription>
                </div>
                <Button onClick={handleRefreshStaticTip} variant="ghost" size="icon" className="h-8 w-8 shrink-0" title="Next Tip" disabled={isLoadingBreaks && !currentProdTip}>
                    <RefreshCw className={cn("h-4 w-4", isLoadingBreaks && !currentProdTip && "animate-spin")} />
                    <span className="sr-only">Next Tip</span>
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
                        <currentProdTip.icon className={cn("h-10 w-10 my-1", currentProdTip.iconColor)} data-ai-hint="tip illustration" />
                        <p className="text-xs text-muted-foreground px-2 leading-relaxed">{currentProdTip.tip}</p>
                    </div>
                 ) : errorBreaks ? (
                    <Alert variant="destructive" className="w-full">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorBreaks}</AlertDescription>
                     </Alert>
                ) : (
                    <div className="flex flex-col items-center text-center">
                        <Lightbulb className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No productivity tips available right now.</p>
                    </div>
                )}
            </CardContent>
             {/* AI Break Recommendation (Optional - if API supports it and not part of static tips) */}
             {breakRecommendations && !isLoadingBreaks && !errorBreaks && (
              <CardFooter className="pt-3 border-t border-border/50">
                <div className="text-xs space-y-1">
                    <p className="font-semibold text-foreground">AI Suggested Break:</p>
                    <p className="text-muted-foreground"><span className="font-medium text-foreground/80">Recommendation:</span> {breakRecommendations.breakRecommendation}</p>
                    <p className="text-muted-foreground"><span className="font-medium text-foreground/80">Technique:</span> {breakRecommendations.productivityTechnique}</p>
                    <p className="text-muted-foreground italic"><span className="font-medium text-foreground/80">Reasoning:</span> {breakRecommendations.reasoning}</p>
                </div>
              </CardFooter>
            )}
        </Card>
      </div>

       {/* Smart Reminders Card */}
       <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex flex-wrap justify-between items-center gap-2">
                <div>
                    <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-fuchsia-500" /> Smart Reminders</CardTitle>
                    <CardDescription>AI-generated reminders based on your habits and context.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="reminder-tone" className="text-xs text-muted-foreground whitespace-nowrap">Reminder Tone:</Label>
                    <Select value={reminderTone} onValueChange={(value) => setReminderTone(value as typeof reminderTone)}>
                        <SelectTrigger id="reminder-tone" className="w-[150px] h-8 text-xs">
                            <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="motivational" className="text-xs">Motivational</SelectItem>
                            <SelectItem value="neutral" className="text-xs">Neutral</SelectItem>
                            <SelectItem value="gentle" className="text-xs">Gentle</SelectItem>
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
            ) : errorReminders && (!userReminders || userReminders.reminders.length === 0 || (userReminders.reminders[0] && userReminders.reminders[0].includes("Could not generate"))) ? (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
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
              <p className="text-muted-foreground text-sm text-center py-2">No smart reminders for you right now. Check back later!</p>
            )}
             {userReminders && userReminders.reasoning && !isLoadingReminders && (
                 <p className="text-xs text-muted-foreground italic pt-2 text-center">
                    {userReminders.reasoning}
                 </p>
             )}
          </CardContent>
          {/* Feedback system placeholder - to be implemented if needed */}
          {/* <CardFooter className="pt-3 border-t">
            <p className="text-xs text-muted-foreground">Was this reminder helpful?</p>
            <Button variant="ghost" size="sm" className="ml-auto text-xs">Yes</Button>
            <Button variant="ghost" size="sm" className="text-xs">No</Button>
          </CardFooter> */}
        </Card>
    </div>
  );
}
        

