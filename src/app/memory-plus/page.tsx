
// src/app/memory-plus/page.tsx
'use client';

import React from 'react';
import { Brain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MemoryPlusPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <Brain className="mr-2 h-8 w-8 text-primary" /> Memory+
        </h1>
      </header>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Exercícios e Ferramentas de Memória</CardTitle>
          <CardDescription>
            Esta secção será dedicada a desafios diários de memória, recordação ativa, sistema de repetição espaçada e mais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Conteúdo e funcionalidades para Memory+ serão implementados aqui.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Desafios Diários</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Memorize sequências, encontre pares, etc. (Em breve)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Repetição Espaçada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Reveja notas e conteúdo em intervalos inteligentes. (Em breve)</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
