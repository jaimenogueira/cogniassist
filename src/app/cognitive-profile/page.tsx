
// src/app/cognitive-profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { UserCircle, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface UserSettings {
  fullName?: string;
  age?: string;
  cognitiveGoal?: string;
  cognitiveMode?: string;
}

export default function CognitiveProfilePage() {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = () => {
      setIsLoading(true);
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        try {
          setUserSettings(JSON.parse(savedSettings));
        } catch (error) {
          console.error("Falha ao analisar configurações guardadas:", error);
          setUserSettings(null);
        }
      } else {
        setUserSettings(null);
      }
      setIsLoading(false);
    };
    loadSettings();
  }, []);

  const getCognitiveModeLabel = (modeKey?: string) => {
    if (!modeKey) return 'Não definido';
    switch (modeKey) {
      case 'standard': return 'Modo Padrão';
      case 'senior': return 'Modo Sénior';
      case 'adhd': return 'Modo PHDA';
      case 'assist': return 'Modo Assistência Cognitiva';
      default: return modeKey;
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <UserCircle className="mr-2 h-9 w-9 text-primary" /> Perfil Cognitivo
        </h1>
      </header>
      <p className="text-muted-foreground">
        Reveja as suas informações essenciais e modo cognitivo. Para editar, por favor, vá para a página de Ajustes.
      </p>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>As Suas Informações e Preferências</CardTitle>
          <CardDescription>
            Esta secção reflete as suas configurações atuais. Para modificá-las, utilize a página de Ajustes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="text-muted-foreground">A carregar perfil...</p>
          ) : userSettings ? (
            <>
              <InfoItem label="Nome Completo" value={userSettings.fullName || 'Não definido'} />
              <InfoItem label="Idade" value={userSettings.age || 'Não definida'} />
              <InfoItem label="Principal Objectivo Cognitivo" value={userSettings.cognitiveGoal || 'Não definido'} />
              <InfoItem label="Modo Cognitivo Atual" value={getCognitiveModeLabel(userSettings.cognitiveMode)} />
            </>
          ) : (
            <p className="text-muted-foreground">
              Nenhuma informação de perfil encontrada. Por favor, configure as suas informações essenciais na página de Ajustes.
            </p>
          )}
          <div className="pt-4">
            <Link href="/settings" passHref>
              <Button size="lg">
                <SlidersHorizontal className="mr-2 h-5 w-5" /> Ir para Ajustes para Editar
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Sobre os Modos Cognitivos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li><strong>Padrão:</strong> Experiência de utilização geral.</li>
            <li><strong>Sénior:</strong> Interface com texto maior e elementos simplificados.</li>
            <li><strong>PHDA:</strong> Design focado em minimizar distrações e ajudar na concentração.</li>
            <li><strong>Assistência Cognitiva:</strong> Suporte avançado para utilizadores com necessidades específicas de memória ou cognição, incluindo lembretes persistentes e orientação passo-a-passo.</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-3">
            Pode selecionar e personalizar o seu modo cognitivo na página de <Link href="/settings" className="text-primary hover:underline">Ajustes</Link>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground">{label}:</h3>
      <p className="text-md font-semibold text-foreground">{value}</p>
    </div>
  );
}
