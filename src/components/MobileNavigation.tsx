'use client';

import React from 'react';
import { Home, BarChart3, Bell, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import Link from 'next/link';

interface MobileNavigationProps {
  userRole: 'CREATOR' | 'CLIPPER';
  currentPath: string;
}

export function MobileNavigation({ userRole, currentPath }: MobileNavigationProps) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications(user?.id);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: userRole === 'CREATOR' ? '/dashboard' : '/clipper',
      icon: Home,
      current: currentPath === '/dashboard' || currentPath === '/clipper'
    },
    {
      name: 'Analytics',
      href: '#',
      icon: BarChart3,
      current: false,
      onClick: () => {
        // This would be handled by the parent component
        const event = new CustomEvent('toggleAnalytics');
        window.dispatchEvent(event);
      }
    },
    {
      name: 'Notifications',
      href: '#',
      icon: Bell,
      current: false,
      badge: unreadCount > 0 ? unreadCount : undefined,
      onClick: () => {
        // This would be handled by the parent component
        const event = new CustomEvent('toggleNotifications');
        window.dispatchEvent(event);
      }
    },
    {
      name: 'Settings',
      href: '#',
      icon: Settings,
      current: false,
      onClick: () => {
        // This would be handled by the parent component
        const event = new CustomEvent('toggleSettings');
        window.dispatchEvent(event);
      }
    }
  ];

  return (
    <nav className="mobile-nav">
      <div className="flex items-center justify-around py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.name}
              variant={item.current ? 'default' : 'ghost'}
              size="sm"
              className="flex flex-col items-center space-y-1 h-auto py-2 px-3 touch-target"
              onClick={item.onClick}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-xs"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{item.name}</span>
            </Button>
          );
        })}
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center space-y-1 h-auto py-2 px-3 touch-target"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          <span className="text-xs font-medium">Logout</span>
        </Button>
      </div>
    </nav>
  );
}
