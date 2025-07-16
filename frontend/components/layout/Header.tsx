'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { Sun, Moon, LogOut, User, Package, FileText, Home } from 'lucide-react';

export function Header() {
  const { state, logout, toggleTheme, navigateTo } = useApp();

  if (!state.user) {
    return null;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, show: true },
    { id: 'products', label: 'Products', icon: Package, show: state.user.role === 'sales' },
    { id: 'quotations', label: 'Quotations', icon: FileText, show: true },
  ];

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6" />
              <span className="font-bold text-lg">ERP Quotation</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                if (!item.show) return null;
                
                return (
                  <Button
                    key={item.id}
                    variant={state.currentPage === item.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => navigateTo(item.id as any)}
                    className="flex items-center space-x-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{state.user.first_name} {state.user.last_name}</span>
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                {state.user.role}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {state.theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="h-9 w-9"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <nav className="flex items-center space-x-2 overflow-x-auto">
            {navItems.map((item) => {
              if (!item.show) return null;
              
              return (
                <Button
                  key={item.id}
                  variant={state.currentPage === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigateTo(item.id as any)}
                  className="flex items-center space-x-2 flex-shrink-0"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>
          
          {/* Mobile User Info */}
          <div className="mt-2 flex items-center space-x-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{state.user.first_name} {state.user.last_name}</span>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              {state.user.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}