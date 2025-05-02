
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Lightbulb, BarChart, Settings, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/suggestions', label: 'Suggestions', icon: Lightbulb },
  { href: '/history', label: 'History', icon: BarChart },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn('flex items-center space-x-2 lg:space-x-4 bg-card shadow-sm p-2 rounded-lg justify-between mb-6', className)}
      {...props}
    >
        <Link href="/" className="flex items-center space-x-2 text-lg font-semibold text-primary mr-4">
             <Brain className="h-6 w-6" />
             <span className="hidden sm:inline">CogniAssist</span>
        </Link>
        <div className="flex items-center space-x-1 md:space-x-2">
             <TooltipProvider delayDuration={100}>
              {navItems.map((item) => (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant={pathname === item.href ? 'default' : 'ghost'}
                      size="sm"
                      className={cn(
                        "justify-start px-2 py-1 h-8 md:px-3 md:py-2 md:h-9",
                        pathname === item.href && 'shadow-sm'
                      )}
                    >
                      <Link href={item.href} className="flex items-center">
                        <item.icon className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline text-sm">{item.label}</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="md:hidden">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
             </TooltipProvider>
        </div>
         {/* Placeholder for User Profile/Auth */}
         <div className="ml-auto">
            {/* <Button variant="ghost" size="sm">Login</Button> */}
            {/* Or Avatar/Dropdown if logged in */}
         </div>
    </nav>
  );
}
        