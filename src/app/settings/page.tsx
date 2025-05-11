
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
import { Eye, Bell, Palette, Contrast, Volume2, Accessibility, Users, Tablet, ListChecks, Navigation } from 'lucide-react';
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
    const { theme, setTheme } = useTheme ? useTheme() : { theme: 'light', setTheme: () => console.warn("next-themes not configured") };

    const [cognitiveMode, setCognitiveMode] = useState('standard'); // 'standard', 'senior', 'adhd', 'assist'
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


     const handleSaveChanges = () => {
        console.log('Saving settings:', {
            cognitiveMode,
            notificationFrequency,
            notificationType,
            theme,
            useHighContrast,
            cognitiveAssistSettings: cognitiveMode === 'assist' ? cognitiveAssistSettings : undefined,
        });

        localStorage.setItem('userSettings', JSON.stringify({
            cognitiveMode,
            notificationFrequency,
            notificationType,
            theme,
            useHighContrast,
            cognitiveAssistSettings: cognitiveMode === 'assist' ? cognitiveAssistSettings : initialCognitiveAssistSettings,
        }));

        toast({
          title: "Settings Saved",
          description: "Your preferences have been updated.",
        })
      };

      useEffect(() => {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
          try {
            const parsedSettings = JSON.parse(savedSettings);
            setCognitiveMode(parsedSettings.cognitiveMode || 'standard');
            setNotificationFrequency(parsedSettings.notificationFrequency || 'medium');
            setNotificationType(parsedSettings.notificationType || { sound: true, visual: true, vibration: false });
            if (useTheme && parsedSettings.theme) setTheme(parsedSettings.theme);
            setUseHighContrast(parsedSettings.useHighContrast || false);
            if (parsedSettings.cognitiveAssistSettings) {
                setCognitiveAssistSettings(parsedSettings.cognitiveAssistSettings);
            } else {
                setCognitiveAssistSettings(initialCognitiveAssistSettings);
            }
          } catch (error) {
            console.error("Failed to parse saved settings:", error);
          }
        }
      }, [setTheme, useTheme]);


  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-foreground flex items-center">
           <Accessibility className="mr-2 h-8 w-8 text-primary" /> Settings & Profile
        </h1>
        <p className="text-muted-foreground">
            Personalize CogniAssist to fit your cognitive needs and preferences.
        </p>
      </header>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center"><Eye className="mr-2 h-5 w-5 text-primary" /> Cognitive Profile</CardTitle>
          <CardDescription>Choose a mode that best suits your needs for visual and alert adjustments.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={cognitiveMode} onValueChange={setCognitiveMode} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="mode-standard" />
              <Label htmlFor="mode-standard">Standard Mode</Label>
            </div>
             <p className="text-sm text-muted-foreground pl-6">Default experience.</p>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="senior" id="mode-senior" />
              <Label htmlFor="mode-senior">Senior Mode</Label>
            </div>
             <p className="text-sm text-muted-foreground pl-6">Larger text, simpler layout, stronger visual alerts.</p>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="adhd" id="mode-adhd" />
              <Label htmlFor="mode-adhd">ADHD Mode</Label>
            </div>
             <p className="text-sm text-muted-foreground pl-6">Visual task blocks, frequent alerts, minimized distractions.</p>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="assist" id="mode-assist" />
              <Label htmlFor="mode-assist">Cognitive Assist Mode</Label>
            </div>
             <p className="text-sm text-muted-foreground pl-6">Enhanced support for memory deficits, Alzheimer’s, or brain injury. Includes step-by-step guidance, repetitive reminders, and optional caregiver integration.</p>
          </RadioGroup>
        </CardContent>
      </Card>

      {cognitiveMode === 'assist' && (
        <>
        <Separator />
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center"><Accessibility className="mr-2 h-5 w-5 text-green-500" /> Cognitive Assist Features</CardTitle>
                <CardDescription>Customize features for enhanced cognitive support.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="step-by-step-tasks"
                            checked={cognitiveAssistSettings.stepByStepTasksEnabled}
                            onCheckedChange={(checked) => setCognitiveAssistSettings(prev => ({ ...prev, stepByStepTasksEnabled: checked }))}
                        />
                        <Label htmlFor="step-by-step-tasks" className="flex items-center gap-2"><ListChecks className="h-4 w-4"/> Step-by-Step Task Guidance</Label>
                    </div>
                    <p className="text-xs text-muted-foreground pl-8">Breaks tasks into smaller, manageable steps with visual aids.</p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="audio-feedback"
                            checked={cognitiveAssistSettings.audioFeedbackEnabled}
                            onCheckedChange={(checked) => setCognitiveAssistSettings(prev => ({ ...prev, audioFeedbackEnabled: checked }))}
                        />
                        <Label htmlFor="audio-feedback" className="flex items-center gap-2"><Volume2 className="h-4 w-4"/> Audio Confirmation & Feedback</Label>
                    </div>
                     <p className="text-xs text-muted-foreground pl-8">Provides voice cues for actions and reminders.</p>
                </div>
                 <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="simplified-navigation"
                            checked={cognitiveAssistSettings.simplifiedNavigationEnabled}
                            onCheckedChange={(checked) => setCognitiveAssistSettings(prev => ({ ...prev, simplifiedNavigationEnabled: checked }))}
                        />
                        <Label htmlFor="simplified-navigation" className="flex items-center gap-2"><Navigation className="h-4 w-4"/> Simplified Navigation</Label>
                    </div>
                     <p className="text-xs text-muted-foreground pl-8">Reduces complexity in menus and interface.</p>
                </div>

                <Separator />

                 <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="caregiver-integration"
                            checked={cognitiveAssistSettings.caregiverIntegrationEnabled}
                            onCheckedChange={(checked) => setCognitiveAssistSettings(prev => ({ ...prev, caregiverIntegrationEnabled: checked }))}
                        />
                        <Label htmlFor="caregiver-integration" className="flex items-center gap-2"><Users className="h-4 w-4"/> Caregiver Integration</Label>
                    </div>
                     <p className="text-xs text-muted-foreground pl-8">Allows a designated caregiver to receive notifications and assist with management.</p>
                    {cognitiveAssistSettings.caregiverIntegrationEnabled && (
                         <div className="pl-8 pt-2">
                            <Label htmlFor="caregiver-contact">Caregiver Contact (Email or Phone)</Label>
                            <Input
                                id="caregiver-contact"
                                type="text"
                                placeholder="Enter caregiver's email or phone"
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
                            onCheckedChange={(checked) => setCognitiveAssistSettings(prev => ({ ...prev, medicationAlertsEnabled: checked }))}
                        />
                        <Label htmlFor="medication-alerts" className="flex items-center gap-2"><Tablet className="h-4 w-4"/> Medication Alert System</Label>
                    </div>
                    <p className="text-xs text-muted-foreground pl-8">Set up and receive persistent medication reminders.</p>
                    {/* Placeholder for medication setup UI if enabled */}
                </div>
                 <p className="text-xs text-muted-foreground pt-2">Note: Repetitive reminders are automatically enhanced when Cognitive Assist Mode is active, based on your Notification Settings.</p>
            </CardContent>
        </Card>
        </>
      )}


       <Separator />

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-accent" /> Notification Settings</CardTitle>
          <CardDescription>Control how and when you receive task reminders.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notif-freq" className="block mb-2">Notification Frequency</Label>
            <Select value={notificationFrequency} onValueChange={setNotificationFrequency}>
              <SelectTrigger id="notif-freq" className="w-[200px]">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (Minimal)</SelectItem>
                <SelectItem value="medium">Medium (Balanced)</SelectItem>
                <SelectItem value="high">High (Frequent)</SelectItem>
                 {cognitiveMode === 'assist' && <SelectItem value="persistent">Persistent (Cognitive Assist)</SelectItem>}
              </SelectContent>
            </Select>
            {cognitiveMode === 'assist' && <p className="text-xs text-muted-foreground mt-1">Persistent reminders require user interaction to dismiss.</p>}
          </div>

          <div>
             <Label className="block mb-2">Notification Types</Label>
             <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Switch
                        id="notif-sound"
                        checked={notificationType.sound}
                        onCheckedChange={(checked) => setNotificationType(prev => ({ ...prev, sound: checked }))}
                    />
                    <Label htmlFor="notif-sound" className="flex items-center gap-2"><Volume2 className="h-4 w-4"/> Sound Alerts</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Switch
                        id="notif-visual"
                        checked={notificationType.visual}
                        onCheckedChange={(checked) => setNotificationType(prev => ({ ...prev, visual: checked }))}
                    />
                    <Label htmlFor="notif-visual" className="flex items-center gap-2"><Eye className="h-4 w-4"/> Visual Alerts (Pop-ups)</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Switch
                        id="notif-vibration"
                        checked={notificationType.vibration}
                        onCheckedChange={(checked) => setNotificationType(prev => ({ ...prev, vibration: checked }))}
                    />
                    <Label htmlFor="notif-vibration" className="flex items-center gap-2"><Bell className="h-4 w-4"/> Vibration (Mobile)</Label>
                </div>
             </div>
          </div>
        </CardContent>
      </Card>

       <Separator />

       <Card className="shadow-sm">
         <CardHeader>
           <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-purple-500" /> Appearance</CardTitle>
           <CardDescription>Customize the look and feel of the app.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            {useTheme && (
                 <div>
                    <Label className="block mb-2">Theme</Label>
                    <RadioGroup value={theme} onValueChange={setTheme} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="theme-light" />
                        <Label htmlFor="theme-light">Light</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark">Dark</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="theme-system" />
                        <Label htmlFor="theme-system">System</Label>
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
                  <Label htmlFor="high-contrast" className="flex items-center gap-2"><Contrast className="h-4 w-4"/> High Contrast Mode</Label>
            </div>
            <p className="text-sm text-muted-foreground pl-8">Increases text and element contrast for better visibility.</p>
         </CardContent>
       </Card>

        <div className="flex justify-end pt-4">
            <Button onClick={handleSaveChanges} size="lg">Save Changes</Button>
        </div>
    </div>
  );
}
