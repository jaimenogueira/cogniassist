
// src/app/cognitive-profile/page.tsx
'use client';

import React from 'react';
import { UserCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CognitiveProfilePage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <UserCircle className="mr-2 h-8 w-8 text-primary" /> Perfil Cognitivo
        </h1>
      </header>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>O seu Perfil e Preferências Cognitivas</CardTitle>
          <CardDescription>
            Esta área permitirá personalizar a sua experiência com base nas suas necessidades cognitivas.
            Muitas destas configurações podem ser encontradas na página de Ajustes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Ajuste os modos cognitivos, preferências de notificação e outros aspetos para otimizar o CogniAssist para si.
          </p>
          <Link href="/settings" passHref>
            <Button>Ir para Ajustes</Button>
          </Link>

          <div className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Modos Cognitivos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Escolha entre Padrão, Sénior, PHDA ou Assistência Cognitiva. (Configurável em Ajustes)</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="text-lg">Objetivos Cognitivos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Defina os seus objetivos principais como melhorar foco, memória, etc. (Configurável em Ajustes)</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
