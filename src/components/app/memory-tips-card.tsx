
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Scissors, Brain, Repeat, Video } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { LucideIcon } from 'lucide-react';

interface MemoryTip {
  id: string;
  text: string;
  icon: LucideIcon;
}

const predefinedTips: MemoryTip[] = [
  { id: 'tip1', text: "Divida a rotina em secções curtas.", icon: Scissors },
  { id: 'tip2', text: "Associe movimentos a palavras-chave ou imagens mentais.", icon: Brain },
  { id: 'tip3', text: "Repita os passos principais em voz alta.", icon: Repeat },
  { id: 'tip4', text: "Pratique frequentemente em frente a um espelho ou gravando vídeos.", icon: Video }
];

export function MemoryTipsCard() {
  const [tips, setTips] = useState<MemoryTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setTips(predefinedTips);
      setIsLoading(false);
    }, 500); 
  }, []);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" /> Dicas Rápidas de Memória
        </CardTitle>
        <CardDescription>Melhore a sua capacidade de lembrar hoje.</CardDescription>
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
                <p className="text-muted-foreground text-center py-2">Nenhuma dica de memória disponível no momento.</p>
             )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

