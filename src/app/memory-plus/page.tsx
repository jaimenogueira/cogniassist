
// src/app/memory-plus/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Puzzle, ListOrdered, LayoutGrid, Crosshair, BookOpenText, ClipboardCheck, HelpCircle, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface CognitiveGame {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  actionText: string;
  dataAiHint?: string;
}

const cognitiveGamesList: CognitiveGame[] = [
  { id: 'memory-sequence', title: 'Sequência de Memória', description: 'Memorize e repita a sequência apresentada. A dificuldade aumenta a cada nível.', icon: ListOrdered, actionText: 'Jogar (Em Breve)', dataAiHint: 'sequência memória' },
  { id: 'quick-pairing', title: 'Pares Rápidos', description: 'Encontre todos os pares de cartas escondidas no menor número de tentativas possível.', icon: LayoutGrid, actionText: 'Jogar (Em Breve)', dataAiHint: 'jogo cartas' },
  { id: 'focus-distractions', title: 'Foco com Distrações', description: 'Selecione os alvos corretos enquanto distrações aparecem. Teste a sua concentração!', icon: Crosshair, actionText: 'Jogar (Em Breve)', dataAiHint: 'alvo foco' },
  { id: 'quick-story', title: 'História Rápida', description: 'Leia uma pequena história e responda a uma pergunta relacionada para testar a sua compreensão.', icon: BookOpenText, actionText: 'Jogar (Em Breve)', dataAiHint: 'livro leitura' },
  { id: 'mental-list', title: 'Lista Mental', description: 'Visualize uma lista de itens por alguns segundos e depois recorde-os na ordem correta.', icon: ClipboardCheck, actionText: 'Jogar (Em Breve)', dataAiHint: 'lista notas' },
];

export default function MemoryPlusPage() {
  const [cognitiveGamePoints, setCognitiveGamePoints] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const savedCognitivePoints = localStorage.getItem('cognitiveGamePoints');
    if (savedCognitivePoints) setCognitiveGamePoints(parseInt(savedCognitivePoints, 10));
  }, []);

  useEffect(() => {
    localStorage.setItem('cognitiveGamePoints', cognitiveGamePoints.toString());
  }, [cognitiveGamePoints]);

  const handlePlayGame = (gameTitle: string) => {
    toast({
      title: `A Abrir ${gameTitle}`,
      description: "Esta funcionalidade de jogo estará disponível em breve!",
    });
    // Placeholder for earning points - uncomment to test
    // setCognitiveGamePoints(prev => prev + 5);
    // toast({ title: "Jogo Concluído!", description: "Ganhou 5 pontos cognitivos (simulado)." });
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <Brain className="mr-2 h-9 w-9 text-primary" /> Memory+
        </h1>
      </header>
      <p className="text-muted-foreground">
        Exercite a sua mente com jogos cognitivos e desafios de memória. Melhore o seu foco e capacidade de recordação.
      </p>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center"><Puzzle className="mr-2 h-6 w-6 text-accent" /> Jogos Cognitivos</CardTitle>
          <CardDescription>Desafie a sua mente e ganhe pontos cognitivos!</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cognitiveGamesList.map((game) => (
            <Card key={game.id} className="flex flex-col shadow-sm hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                    <game.icon className="h-8 w-8 text-accent mr-3" data-ai-hint={game.dataAiHint || 'jogo cognitivo'} />
                    <CardTitle className="text-md">{game.title}</CardTitle>
                </div>
                <CardDescription className="text-xs leading-relaxed h-16 overflow-y-auto">{game.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-3">
                <Button onClick={() => handlePlayGame(game.title)} variant="outline" size="sm" className="w-full" disabled>
                  {game.actionText.includes("Em Breve") ? <HelpCircle className="mr-2 h-4 w-4" /> : null}
                  {game.actionText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground italic w-full text-center">
              Pontos Cognitivos Atuais: {cognitiveGamePoints}. Lembretes para jogos cognitivos podem ser configurados nos Ajustes.
            </p>
        </CardFooter>
      </Card>

      <Separator />
       <Card className="shadow-sm">
        <CardHeader>
            <CardTitle className="flex items-center"><Brain className="mr-2 h-6 w-6 text-blue-500" /> Mais Ferramentas de Memória (Em Breve)</CardTitle>
            <CardDescription>Funcionalidades como Desafios Diários de Memória, Recordação Ativa e Sistema de Repetição Espaçada serão adicionadas aqui.</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50">
                <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Desafios Diários</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Memorize sequências, encontre pares, etc.</p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Repetição Espaçada</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Reveja notas e conteúdo em intervalos inteligentes.</p>
                </CardContent>
                </Card>
            </div>
        </CardContent>
      </Card>

      <Separator />

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center"><Trophy className="mr-2 h-6 w-6 text-yellow-400" /> Conquistas Cognitivas</CardTitle>
          <CardDescription>O seu mural de conquistas por exercitar a sua mente (em breve!).</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 items-center justify-center">
           <div className="text-center p-3 border rounded-lg bg-muted/50 w-32 opacity-50">
                <Brain className="h-8 w-8 text-gray-400 mx-auto mb-1" data-ai-hint="cérebro inteligência" />
                <p className="text-xs font-medium">Mente Afiada</p>
                <p className="text-xs text-muted-foreground">Jogue 5 jogos cognitivos</p>
           </div>
            <div className="text-center p-3 border rounded-lg bg-muted/50 w-32 opacity-50">
                <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-1" data-ai-hint="troféu prémio" />
                <p className="text-xs font-medium">Estrategista</p>
                <p className="text-xs text-muted-foreground">Complete um jogo difícil</p>
           </div>
           <div className="text-center p-3 border rounded-lg bg-muted/50 w-32 opacity-50">
                <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-1" data-ai-hint="troféu prémio" />
                <p className="text-xs font-medium">Mestre da Memória</p>
                <p className="text-xs text-muted-foreground">Acumule 100 pontos cognitivos</p>
           </div>
           <p className="w-full text-center text-muted-foreground text-sm mt-4">Mais conquistas e desafios cognitivos em breve!</p>
        </CardContent>
      </Card>

    </div>
  );
}
