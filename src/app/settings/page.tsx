
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Eye, Bell, Palette, Contrast, Volume2, Accessibility } from 'lucide-react';
import { useTheme } from 'next-themes'; // Assuming next-themes is installed for theme switching
import { useToast } from "@/hooks/use-toast"


export default function SettingsPage() {
    const { toast } = useToast()
    // Theme switching (requires next-themes setup in layout/provider)
    const { theme, setTheme } = useTheme ? useTheme() : { theme: 'light', setTheme: () => console.warn("next-themes not configured") };

    // State for settings - Load from localStorage or backend in a real app
    const [cognitiveMode, setCognitiveMode] = useState('standard'); // 'standard', 'senior', 'adhd'
    const [notificationFrequency, setNotificationFrequency] = useState('medium'); // 'low', 'medium', 'high'
    const [notificationType, setNotificationType] = useState({ sound: true, visual: true, vibration: false });
    const [useHighContrast, setUseHighContrast] = useState(false); // Example state

    // Effect to apply high contrast class (example)
    useEffect(() => {
        if (useHighContrast) {
            document.body.classList.add('high-contrast'); // Define .high-contrast styles in globals.css
        } else {
            document.body.classList.remove('high-contrast');
        }
        // Cleanup on unmount
        return () => document.body.classList.remove('high-contrast');
    }, [useHighContrast]);


     const handleSaveChanges = () => {
        // --- Persistence Logic ---
        // In a real app, save these settings to localStorage, IndexedDB, or a backend service.
        console.log('Saving settings:', {
        cognitiveMode,
        notificationFrequency,
        notificationType,
        theme,
        useHighContrast,
        });

        localStorage.setItem('userSettings', JSON.stringify({
            cognitiveMode,
            notificationFrequency,
            notificationType,
            theme,
            useHighContrast,
        }));


        toast({
          title: "Settings Saved",
          description: "Your preferences have been updated.",
        })
      };

     // Effect to load settings on component mount
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
          } catch (error) {
            console.error("Failed to parse saved settings:", error);
            // Handle error or use defaults
          }
        }
      }, [setTheme, useTheme]); // Add setTheme dependency if useTheme is available


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

      {/* Cognitive Profile Section */}
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
          </RadioGroup>
           {/* Add specific adjustments based on mode later */}
        </CardContent>
      </Card>

       <Separator />

      {/* Notification Settings Section */}
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
              </SelectContent>
            </Select>
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

       {/* Appearance Settings Section */}
       <Card className="shadow-sm">
         <CardHeader>
           <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-purple-500" /> Appearance</CardTitle>
           <CardDescription>Customize the look and feel of the app.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            {useTheme && ( // Conditionally render if next-themes is setup
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

// Add high-contrast styles to src/app/globals.css if needed:
/*
.high-contrast {
  --foreground: 0 0% 0%;
  --background: 0 0% 100%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 0%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 0%;
  --primary: 240 100% 50%; // Stronger blue
  --primary-foreground: 0 0% 100%;
  --secondary: 0 0% 90%; // Lighter gray
  --secondary-foreground: 0 0% 0%;
  --muted: 0 0% 85%; // More distinct muted
  --muted-foreground: 0 0% 20%;
  --accent: 180 100% 30%; // Darker teal
  --accent-foreground: 0 0% 100%;
  --border: 0 0% 50%; // Darker border
  --input: 0 0% 100%;
  --ring: 240 100% 50%;
}

.dark .high-contrast {
   --foreground: 0 0% 100%;
   --background: 0 0% 0%;
   --card: 0 0% 0%;
   --card-foreground: 0 0% 100%;
   --popover: 0 0% 0%;
   --popover-foreground: 0 0% 100%;
   --primary: 60 100% 50%; // Bright yellow
   --primary-foreground: 0 0% 0%;
   --secondary: 0 0% 15%; // Darker secondary
   --secondary-foreground: 0 0% 100%;
   --muted: 0 0% 25%;
   --muted-foreground: 0 0% 80%;
   --accent: 180 100% 60%; // Brighter cyan
   --accent-foreground: 0 0% 0%;
   --border: 0 0% 70%; // Lighter border for dark high contrast
   --input: 0 0% 0%;
   --ring: 60 100% 50%;
}
*/

