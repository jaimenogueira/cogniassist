
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import { generateMemoryTips } from '@/ai/flows/generate-memory-tips'; // Import the AI flow

export function MemoryTipsCard() {
  const [tips, setTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Provide mock/default cognitive profile and past behavior for now
        // In a real app, fetch this from user settings or history
        const input = {
          cognitiveProfile: 'Standard User', // Example profile
          pastBehavior: 'User occasionally forgets tasks scheduled in the afternoon.', // Example behavior
        };
        const result = await generateMemoryTips(input);
        if (result?.memoryTips) {
          // The prompt asks for a numbered list, which might come back as a single string.
          // Attempt to parse it or handle different formats.
          if (Array.isArray(result.memoryTips)) {
             setTips(result.memoryTips);
          } else if (typeof result.memoryTips === 'string'){
             // Try splitting by newline and removing numbering
             const parsedTips = (result.memoryTips as string)
                .split('\n')
                .map(tip => tip.replace(/^\d+\.\s*/, '').trim()) // Remove "1. ", "2. ", etc.
                .filter(tip => tip.length > 0);
             setTips(parsedTips);
          } else {
             // Fallback if the format is unexpected
             setTips(["Could not parse tips from AI response."]);
          }
        } else {
             setTips(['No tips available at the moment.']);
        }
      } catch (err) {
        console.error('Error fetching memory tips:', err);
        setError('Failed to load memory tips. Please try again later.');
        setTips([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTips();
  }, []); // Fetch tips on component mount

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
          </div>
        ) : error ? (
           <Alert variant="destructive">
             <Terminal className="h-4 w-4" />
             <AlertTitle>Error</AlertTitle>
             <AlertDescription>
               {error}
             </AlertDescription>
           </Alert>
        ) : (
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
