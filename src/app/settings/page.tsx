
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Bell, Palette, Contrast, Volume2, Accessibility, Users, Tablet, ListChecks, Navigation, SlidersHorizontal, ClipboardList, UserCircle, AlertTriangle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useToast } from "@/hooks/use-toast";

interface CognitiveAssistSettings {
    caregiverIntegrationEnabled: boolean;
    caregiverContact: string;
    medicationAlertsEnabled: boolean;
    stepByStepTasksEnabled: boolean;
    audioFeedbackEnabled: boolean;
    simplifiedNavigationEnabled: boolean;
}

const initialCognitiveAssistSettings: CognitiveAssistSettings = {
    caregiverIntegrationEnabled: false,
    caregiverContact: '',
    medicationAlertsEnabled: false,
    stepByStepTasksEnabled: false,
    audioFeedbackEnabled: false,
    simplifiedNavigationEnabled: false,
};

export default function SettingsPage() {
    const { toast } = useToast()
    const { theme, setTheme } = useTheme ? useTheme() : { theme: 'light', setTheme: () => console.warn("next-themes não configurado") };

    // Essential Information State
    const [fullName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [cognitiveGoal, setCognitiveGoal] = useState('');
    const [essentialInfoSaved, setEssentialInfoSaved] = useState(false);

    // Existing Settings State
    const [cognitiveMode, setCognitiveMode] = useState('standard'); 
    const [notificationFrequency, setNotificationFrequency] = useState('medium');
    const [notificationType, setNotificationType] = useState({ sound: true, visual: true, vibration: false });
    const [useHighContrast, setUseHighContrast] = useState(false);
    const [cognitiveAssistSettings, setCognitiveAssistSettings] = useState<CognitiveAssistSettings>(initialCognitiveAssistSettings);


    useEffect(() => {
        if (useHighContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        return () => document.body.classList.remove('high-contrast');
    }, [useHighContrast]);


     const handleSaveChanges = (isContinuingFromEssential = false) => {
        if (isContinuingFromEssential) {
            if (!fullName.trim() || !age.trim() || !cognitiveGoal.trim()) {
                toast({
                  title: "Campos Obrigatórios",
                  description: "Por favor, preencha Nome Completo, Idade e Objetivo Cognitivo.",
                  variant: "destructive",
                });
                return false;
            }
        }

        const settingsToSave = {
            fullName,
            age,
            gender,
            cognitiveGoal,
            essentialInfoSaved: isContinuingFromEssential ? true : essentialInfoSaved,
            cognitiveMode,
            notificationFrequency,
            notificationType,
            theme,
            useHighContrast,
            cognitiveAssistSettings: cognitiveMode === 'assist' ? cognitiveAssistSettings : initialCognitiveAssistSettings,
        };

        localStorage.setItem('userSettings', JSON.stringify(settingsToSave));

        if (isContinuingFromEssential) {
             setEssentialInfoSaved(true);
             toast({
                title: "Informações Essenciais Salvas",
                description: "Agora você pode configurar o restante das suas preferências.",
             });
        } else {
            toast({
              title: "Configurações Salvas",
              description: "Suas preferências foram atualizadas.",
            });
        }
        return true;
      };

      const handleSaveEssentialAndContinue = () => {
        handleSaveChanges(true);
      }

      useEffect(() => {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
          try {
            const parsedSettings = JSON.parse(savedSettings);
            setFullName(parsedSettings.fullName || '');
            setAge(parsedSettings.age || '');
            setGender(parsedSettings.gender || '');
            setCognitiveGoal(parsedSettings.cognitiveGoal || '');
            setEssentialInfoSaved(parsedSettings.essentialInfoSaved || false);

            setCognitiveMode(parsedSettings.cognitiveMode || 'standard');
            setNotificationFrequency(parsedSettings.notificationFrequency || 'medium');
            setNotificationType(parsedSettings.notificationType || { sound: true, visual: true, vibration: false });
            if (useTheme && parsedSettings.theme && setTheme) setTheme(parsedSettings.theme);
            setUseHighContrast(parsedSettings.useHighContrast || false);
            if (parsedSettings.cognitiveAssistSettings) {
                setCognitiveAssistSettings(parsedSettings.cognitiveAssistSettings);
            } else {
                setCognitiveAssistSettings(initialCognitiveAssistSettings);
            }
          } catch (error) {
            console.error("Falha ao analisar configurações salvas:", error);
            setEssentialInfoSaved(false); // Fallback if parsing fails
          }
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [setTheme]);


  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-foreground flex items-center">
           <SlidersHorizontal className="mr-2 h-8 w-8 text-primary" /> Ajustes e Perfil
        </h1>
        <p className="text-muted-foreground">
            Personalize o CogniAssist para atender às suas necessidades e preferências cognitivas.
        </p>
      </header>

      <Card className="shadow-lg border-accent border-2">
        <CardHeader>
          <CardTitle className="flex items-center text-xl"><ClipboardList className="mr-2 h-6 w-6 text-accent" /> Informações Essenciais</CardTitle>
          <CardDescription>Estes dados são usados para personalizar sua experiência no CogniAssist. Por favor, preencha para continuar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <Label htmlFor="fullName">Nome Completo <span className="text-destructive">*</span></Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Seu nome completo" className="mt-1" />
                <p className="text-xs text-muted-foreground mt-1">Como devemos te chamar?</p>
            </div>
            <div>
                <Label htmlFor="age">Idade <span className="text-destructive">*</span></Label>
                <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Sua idade" className="mt-1" />
                 <p className="text-xs text-muted-foreground mt-1">Sua idade nos ajuda a adaptar sugestões.</p>
            </div>
            <div>
                <Label htmlFor="gender">Gênero</Label>
                <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger id="gender" className="w-full mt-1">
                        <SelectValue placeholder="Selecione seu gênero (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Feminino</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefiro não dizer</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                </Select>
                 <p className="text-xs text-muted-foreground mt-1">Esta informação é opcional.</p>
            </div>
            <div>
                <Label htmlFor="cognitiveGoal">Qual seu principal objetivo cognitivo? <span className="text-destructive">*</span></Label>
                <Textarea 
                    id="cognitiveGoal" 
                    value={cognitiveGoal} 
                    onChange={(e) => setCognitiveGoal(e.target.value)} 
                    placeholder="ex: Melhorar foco, memória, atenção, organização, controle de ansiedade..." 
                    className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Seu objetivo principal guia nossas sugestões de IA.</p>
            </div>
             <Button onClick={handleSaveEssentialAndContinue} size="lg" className="w-full mt-2">
                Salvar Informações Essenciais e Continuar
             </Button>
        </CardContent>
      </Card>

    {essentialInfoSaved && (
    <>
      <Separator />
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center"><Eye className="mr-2 h-5 w-5 text-primary" /> Perfil Cognitivo</CardTitle>
          <CardDescription>Escolha um modo que melhor se adapte às suas necessidades para ajustes visuais e de alerta.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={cognitiveMode} onValueChange={setCognitiveMode} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="mode-standard" />
              <Label htmlFor="mode-standard">Modo Padrão</Label>
            </div>
             <p className="text-sm text-muted-foreground pl-6">Experiência padrão.</p>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="senior" id="mode-senior" />
              <Label htmlFor="mode-senior">Modo Sênior</Label>
            </div>
             <p className="text-sm text-muted-foreground pl-6">Texto maior, layout mais simples, alertas visuais mais fortes.</p>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="adhd" id="mode-adhd" />
              <Label htmlFor="mode-adhd">Modo TDAH</Label>
            </div>
             <p className="text-sm text-muted-foreground pl-6">Blocos de tarefas visuais, alertas frequentes, distrações minimizadas.</p>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="assist" id="mode-assist" />
              <Label htmlFor="mode-assist">Modo Assistência Cognitiva</Label>
            </div>
             <p className="text-sm text-muted-foreground pl-6">Suporte aprimorado para déficits de memória, Alzheimer ou lesão cerebral. Inclui orientação passo a passo, lembretes repetitivos e integração opcional com cuidador.</p>
          </RadioGroup>
        </CardContent>
      </Card>

      {cognitiveMode === 'assist' && (
        <>
        <Separator />
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center"><Accessibility className="mr-2 h-5 w-5 text-green-500" /> Recursos de Assistência Cognitiva</CardTitle>
                <CardDescription>Personalize recursos para suporte cognitivo aprimorado.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="step-by-step-tasks"
                            checked={cognitiveAssistSettings.stepByStepTasksEnabled}
                            onCheckedChange={(checked) => setCognitiveAssistSettings(prev => ({ ...prev, stepByStepTasksEnabled: Boolean(checked) }))}
                        />
                        <Label htmlFor="step-by-step-tasks" className="flex items-center gap-2"><ListChecks className="h-4 w-4"/> Orientação de Tarefas Passo a Passo</Label>
                    </div>
                    <p className="text-xs text-muted-foreground pl-8">Divide tarefas em etapas menores e gerenciáveis com auxílios visuais.</p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="audio-feedback"
                            checked={cognitiveAssistSettings.audioFeedbackEnabled}
                            onCheckedChange={(checked) => setCognitiveAssistSettings(prev => ({ ...prev, audioFeedbackEnabled: Boolean(checked) }))}
                        />
                        <Label htmlFor="audio-feedback" className="flex items-center gap-2"><Volume2 className="h-4 w-4"/> Confirmação e Feedback por Áudio</Label>
                    </div>
                     <p className="text-xs text-muted-foreground pl-8">Fornece dicas de voz para ações e lembretes.</p>
                </div>
                 <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="simplified-navigation"
                            checked={cognitiveAssistSettings.simplifiedNavigationEnabled}
                            onCheckedChange={(checked) => setCognitiveAssistSettings(prev => ({ ...prev, simplifiedNavigationEnabled: Boolean(checked) }))}
                        />
                        <Label htmlFor="simplified-navigation" className="flex items-center gap-2"><Navigation className="h-4 w-4"/> Navegação Simplificada</Label>
                    </div>
                     <p className="text-xs text-muted-foreground pl-8">Reduz a complexidade em menus e interface.</p>
                </div>

                <Separator />

                 <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="caregiver-integration"
                            checked={cognitiveAssistSettings.caregiverIntegrationEnabled}
                            onCheckedChange={(checked) => setCognitiveAssistSettings(prev => ({ ...prev, caregiverIntegrationEnabled: Boolean(checked) }))}
                        />
                        <Label htmlFor="caregiver-integration" className="flex items-center gap-2"><Users className="h-4 w-4"/> Integração com Cuidador</Label>
                    </div>
                     <p className="text-xs text-muted-foreground pl-8">Permite que um cuidador designado receba notificações e ajude no gerenciamento.</p>
                    {cognitiveAssistSettings.caregiverIntegrationEnabled && (
                         <div className="pl-8 pt-2">
                            <Label htmlFor="caregiver-contact">Contato do Cuidador (Email ou Telefone)</Label>
                            <Input
                                id="caregiver-contact"
                                type="text"
                                placeholder="Insira o email ou telefone do cuidador"
                                value={cognitiveAssistSettings.caregiverContact}
                                onChange={(e) => setCognitiveAssistSettings(prev => ({...prev, caregiverContact: e.target.value}))}
                                className="mt-1"
                            />
                         </div>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="medication-alerts"
                            checked={cognitiveAssistSettings.medicationAlertsEnabled}
                            onCheckedChange={(checked) => setCognitiveAssistSettings(prev => ({ ...prev, medicationAlertsEnabled: Boolean(checked) }))}
                        />
                        <Label htmlFor="medication-alerts" className="flex items-center gap-2"><Tablet className="h-4 w-4"/> Sistema de Alerta de Medicação</Label>
                    </div>
                    <p className="text-xs text-muted-foreground pl-8">Configure e receba lembretes persistentes de medicação.</p>
                </div>
                 <p className="text-xs text-muted-foreground pt-2">Nota: Lembretes repetitivos são automaticamente aprimorados quando o Modo Assistência Cognitiva está ativo, com base nas suas Configurações de Notificação.</p>
            </CardContent>
        </Card>
        </>
      )}


       <Separator />

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-accent" /> Ajustes de Notificação</CardTitle>
          <CardDescription>Controle como e quando você recebe lembretes de tarefas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notif-freq" className="block mb-2">Frequência de Notificação</Label>
            <Select value={notificationFrequency} onValueChange={setNotificationFrequency}>
              <SelectTrigger id="notif-freq" className="w-[200px]">
                <SelectValue placeholder="Selecione a frequência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa (Mínima)</SelectItem>
                <SelectItem value="medium">Média (Equilibrada)</SelectItem>
                <SelectItem value="high">Alta (Frequente)</SelectItem>
                 {cognitiveMode === 'assist' && <SelectItem value="persistent">Persistente (Assist. Cognitiva)</SelectItem>}
              </SelectContent>
            </Select>
            {cognitiveMode === 'assist' && <p className="text-xs text-muted-foreground mt-1">Lembretes persistentes exigem interação do usuário para dispensar.</p>}
          </div>

          <div>
             <Label className="block mb-2">Tipos de Notificação</Label>
             <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Switch
                        id="notif-sound"
                        checked={notificationType.sound}
                        onCheckedChange={(checked) => setNotificationType(prev => ({ ...prev, sound: Boolean(checked) }))}
                    />
                    <Label htmlFor="notif-sound" className="flex items-center gap-2"><Volume2 className="h-4 w-4"/> Alertas Sonoros</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Switch
                        id="notif-visual"
                        checked={notificationType.visual}
                        onCheckedChange={(checked) => setNotificationType(prev => ({ ...prev, visual: Boolean(checked) }))}
                    />
                    <Label htmlFor="notif-visual" className="flex items-center gap-2"><Eye className="h-4 w-4"/> Alertas Visuais (Pop-ups)</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Switch
                        id="notif-vibration"
                        checked={notificationType.vibration}
                        onCheckedChange={(checked) => setNotificationType(prev => ({ ...prev, vibration: Boolean(checked) }))}
                    />
                    <Label htmlFor="notif-vibration" className="flex items-center gap-2"><Bell className="h-4 w-4"/> Vibração (Celular)</Label>
                </div>
             </div>
          </div>
        </CardContent>
      </Card>

       <Separator />

       <Card className="shadow-sm">
         <CardHeader>
           <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-purple-500" /> Aparência</CardTitle>
           <CardDescription>Personalize a aparência do aplicativo.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            {useTheme && setTheme && ( 
                 <div>
                    <Label className="block mb-2">Tema</Label>
                    <RadioGroup value={theme} onValueChange={setTheme} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="theme-light" />
                        <Label htmlFor="theme-light">Claro</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark">Escuro</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="theme-system" />
                        <Label htmlFor="theme-system">Sistema</Label>
                        </div>
                    </RadioGroup>
                 </div>
            )}

            <div className="flex items-center space-x-2">
                 <Switch
                    id="high-contrast"
                    checked={useHighContrast}
                    onCheckedChange={setUseHighContrast}
                  />
                  <Label htmlFor="high-contrast" className="flex items-center gap-2"><Contrast className="h-4 w-4"/> Modo de Alto Contraste</Label>
            </div>
            <p className="text-sm text-muted-foreground pl-8">Aumenta o contraste de texto e elementos para melhor visibilidade.</p>
         </CardContent>
       </Card>

        <div className="flex justify-end pt-4">
            <Button onClick={() => handleSaveChanges(false)} size="lg">Salvar Todas as Alterações</Button>
        </div>
    </>
    )}
    </div>
  );
}

