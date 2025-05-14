
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Lightbulb, BarChart3, Settings, Brain, Dumbbell, Menu, LayoutDashboard, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Separator } from '@/components/ui/separator';

const mainNavItems = [
  { href: '/', label: 'Painel', icon: LayoutDashboard },
  { href: '/training', label: 'Treino', icon: Dumbbell },
  { href: '/memory-plus', label: 'Memory+', icon: Brain },
  { href: '/suggestions', label: 'Sugestões', icon: Lightbulb },
  { href: '/history', label: 'Histórico', icon: BarChart3 },
  { href: '/cognitive-profile', label: 'Perfil Cognitivo', icon: UserCircle },
];

const settingsNavItem = { href: '/settings', label: 'Ajustes', icon: Settings };

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn('flex items-center justify-between bg-card shadow-sm p-3 rounded-lg mb-6 h-16', className)}
      {...props}
    >
      <Link href="/" className="flex items-center space-x-2 text-xl font-semibold text-primary">
        <Brain className="h-8 w-8" />
        <span className="hidden sm:inline">CogniAssist</span>
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden h-12 w-12"> {/* Increased button size */}
            <Menu className="h-9 w-9" strokeWidth={2.5} /> {/* Increased icon size and thickness */}
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-3/4 sm:max-w-xs p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <Link href="/" className="flex items-center space-x-2 text-lg font-semibold text-primary">
                <Brain className="h-7 w-7" />
                <span>CogniAssist</span>
              </Link>
            </div>
            <div className="flex-grow p-4 space-y-1">
              {mainNavItems.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 rounded-md px-3 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors h-12',
                      pathname === item.href ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : 'text-foreground'
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                    <span>{item.label}</span>
                  </Link>
                </SheetClose>
              ))}
            </div>
            <Separator className="my-2" />
            <div className="p-4">
              <SheetClose asChild>
                <Link
                  href={settingsNavItem.href}
                  className={cn(
                    'flex items-center space-x-3 rounded-md px-3 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors h-12',
                    pathname === settingsNavItem.href ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : 'text-foreground'
                  )}
                >
                  <settingsNavItem.icon className="h-6 w-6" />
                  <span>{settingsNavItem.label}</span>
                </Link>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Desktop Navigation (visible on screens larger than md) */}
      <div className="hidden md:flex items-center space-x-1">
        {mainNavItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant={pathname === item.href ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              "justify-start h-9",
              pathname === item.href && 'shadow-sm'
            )}
          >
            <Link href={item.href} className="flex items-center">
              <item.icon className="h-5 w-5 mr-2" />
              <span className="text-sm">{item.label}</span>
            </Link>
          </Button>
        ))}
         <Button
            asChild
            variant={pathname === settingsNavItem.href ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              "justify-start h-9",
              pathname === settingsNavItem.href && 'shadow-sm'
            )}
          >
            <Link href={settingsNavItem.href} className="flex items-center">
              <settingsNavItem.icon className="h-5 w-5 mr-2" />
              <span className="text-sm">{settingsNavItem.label}</span>
            </Link>
          </Button>
      </div>
    </nav>
  );
}
