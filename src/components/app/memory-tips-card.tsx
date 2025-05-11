
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Scissors, Brain, Repeat, Video } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { LucideIcon } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Terminal } from "lucide-react"
// import { generateMemoryTips } from '@/ai/flows/generate-memory-tips'; // Import the AI flow

interface MemoryTip {
  id: string;
  text: string;
  icon: LucideIcon;
}

const predefinedTips: MemoryTip[] = [
  { id: 'tip1', text: "Break the routine into short sections.", icon: Scissors },
  { id: 'tip2', text: "Associate movements with key words or mental images.", icon: Brain },
  { id: 'tip3', text: "Repeat the main steps out loud.", icon: Repeat },
  { id: 'tip4', text: "Practice frequently in front of a mirror or by recording videos.", icon: Video }
];

export function MemoryTipsCard() {
  const [tips, setTips] = useState<MemoryTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    // setError(null);
    // Simulate loading for a moment, then set predefined tips
    setTimeout(() => {
      setTips(predefinedTips);
      setIsLoading(false);
    }, 500); // Short delay to mimic loading, can be removed if not desired

    // Previous AI fetching logic:
    // const fetchTips = async () => {
    //   setIsLoading(true);
    //   setError(null);
    //   try {
    //     const input = {
    //       cognitiveProfile: 'Standard User', 
    //       pastBehavior: 'User occasionally forgets tasks scheduled in the afternoon.',
    //     };
    //     const result = await generateMemoryTips(input);
    //     if (result?.memoryTips) {
    //       // ... parsing logic ...
    //     } else {
    //          setTips([{id: 'empty', text: 'No tips available at the moment.', icon: Lightbulb}]);
    //     }
    //   } catch (err) {
    //     console.error('Error fetching memory tips:', err);
    //     setError('Failed to load memory tips. Please try again later.');
    //     setTips([]);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchTips();
  }, []);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" /> Quick Memory Tips
        </CardTitle>
        <CardDescription>Boost your recall today.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        ) 
        // : error ? (
        //    <Alert variant="destructive">
        //      <Terminal className="h-4 w-4" />
        //      <AlertTitle>Error</AlertTitle>
        //      <AlertDescription>
        //        {error}
        //      </AlertDescription>
        //    </Alert>
        // ) 
        : (
          <div className="space-y-3">
            {tips.length > 0 ? (
                tips.map((tip) => (
                  <div key={tip.id} className="flex items-start space-x-3 p-3 border border-border/50 rounded-lg bg-background hover:bg-muted/30 transition-colors">
                    <tip.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground flex-1">{tip.text}</p>
                  </div>
                ))
             ) : (
                <p className="text-muted-foreground text-center py-2">No memory tips available right now.</p>
             )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
