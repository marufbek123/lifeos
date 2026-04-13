'use client';

import { LANGUAGE } from '@/lib/language';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: LANGUAGE.nav.dashboard },
  { id: 'tasks', label: LANGUAGE.nav.tasks },
  { id: 'templates', label: LANGUAGE.nav.templates },
  { id: 'someday', label: LANGUAGE.nav.someday },
  { id: 'entertainment', label: LANGUAGE.nav.entertainment },
  { id: 'ideas', label: LANGUAGE.nav.ideas },
  { id: 'gym', label: LANGUAGE.nav.gym },
  { id: 'finance', label: LANGUAGE.nav.finance },
  { id: 'analytics', label: LANGUAGE.nav.analytics },
];

export default function Sidebar({ currentView, onViewChange, isOpen, onClose }: SidebarProps) {
  const handleNavClick = (viewId: string) => {
    onViewChange(viewId);
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-label="Menu overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative md:z-auto z-50 left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col gap-6 p-6 transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">{LANGUAGE.appTitle}</h1>
          <p className="text-sm text-muted-foreground">Shaxsiy samaradorlik</p>
        </div>

        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              variant={currentView === item.id ? 'default' : 'ghost'}
              className="w-full justify-start text-left"
            >
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="border-t border-sidebar-border pt-4 text-xs text-muted-foreground">
          <p>v1.0.0</p>
        </div>
      </aside>
    </>
  );
}
