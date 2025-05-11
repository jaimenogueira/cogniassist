
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Terminal } from "lucide-react"
// import { generateMemoryTips } from '@/ai/flows/generate-memory-tips'; // Import the AI flow

const predefinedTips = [
  "Break the routine into short sections.",
  "Associate movements with key words or mental images.",
  "Repeat the main steps out loud.",
  "Practice frequently in front of a mirror or by recording videos."
];

export function MemoryTipsCard() {
  const [tips, setTips] = useState<string[]>([]);
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
    //       if (Array.isArray(result.memoryTips)) {
    //          setTips(result.memoryTips);
    //       } else if (typeof result.memoryTips === 'string'){
    //          const parsedTips = (result.memoryTips as string)
    //             .split('\n')
    //             .map(tip => tip.replace(/^\d+\.\s*/, '').trim()) 
    //             .filter(tip => tip.length > 0);
    //          setTips(parsedTips);
    //       } else {
    //          setTips(["Could not parse tips from AI response."]);
    //       }
    //     } else {
    //          setTips(['No tips available at the moment.']);
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
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
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
          <ul className="space-y-2 list-disc list-inside text-sm text-foreground">
            {tips.length > 0 ? (
                tips.map((tip, index) => <li key={index}>{tip}</li>)
             ) : (
                <li>No memory tips available right now.</li>
             )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

