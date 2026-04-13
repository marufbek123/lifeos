'use client';

import { useEffect, useState } from 'react';
import { LANGUAGE } from '@/lib/language';
import { initializeMockData } from '@/lib/storage';
import { useMobileNav } from '@/hooks/useMobileNav';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import HomeView from '@/components/HomeView';
import TasksView from '@/components/TasksView';
import TemplatesView from '@/components/TemplatesView';
import SomedayView from '@/components/SomedayView';
import EntertainmentView from '@/components/EntertainmentView';
import IdeasView from '@/components/IdeasView';
import GymView from '@/components/GymView';
import FinanceView from '@/components/FinanceView';
import AnalyticsView from '@/components/AnalyticsView';
import { Button } from '@/components/ui/button';

type ViewType = 'home' | 'dashboard' | 'tasks' | 'templates' | 'someday' | 'entertainment' | 'ideas' | 'gym' | 'finance' | 'analytics';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, isMobile, toggleMenu, closeMenu } = useMobileNav();

  useEffect(() => {
    // Initialize mock data on first load
    initializeMockData();
    setIsLoading(false);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TasksView />;
      case 'templates':
        return <TemplatesView />;
      case 'someday':
        return <SomedayView />;
      case 'entertainment':
        return <EntertainmentView />;
      case 'ideas':
        return <IdeasView />;
      case 'gym':
        return <GymView />;
      case 'finance':
        return <FinanceView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <HomeView />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 text-3xl font-bold text-primary">{LANGUAGE.appTitle}</div>
          <div className="text-muted-foreground">{LANGUAGE.common.loading}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} isOpen={isOpen} onClose={closeMenu} />
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Mobile Header with Hamburger Menu */}
        <div className="md:hidden sticky top-0 z-40 bg-sidebar border-b border-sidebar-border flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-primary">{LANGUAGE.appTitle}</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMenu}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </Button>
        </div>

        {/* Content */}
        {renderView()}
      </main>
    </div>
  );
}
