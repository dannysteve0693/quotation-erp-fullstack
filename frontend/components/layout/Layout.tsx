'use client';

import React from 'react';
import { Header } from './Header';
import { useApp } from '@/context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-background">
      {state.user && <Header />}
      <main className={state.user ? 'container mx-auto px-4 py-8' : ''}>
        {children}
      </main>
    </div>
  );
}