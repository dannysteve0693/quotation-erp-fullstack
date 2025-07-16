'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User } from '@/types';

type Theme = 'light' | 'dark';

type Page = 
  | 'login' 
  | 'register' 
  | 'dashboard' 
  | 'products' 
  | 'quotations' 
  | 'quotation-form' 
  | 'quotation-detail' 
  | 'sales-order-detail';

interface AppState {
  user: User | null;
  token: string | null;
  theme: Theme;
  currentPage: Page;
  selectedQuotationId: number | null;
  selectedSalesOrderId: number | null;
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_PAGE'; payload: Page }
  | { type: 'SET_SELECTED_QUOTATION'; payload: number | null }
  | { type: 'SET_SELECTED_SALES_ORDER'; payload: number | null }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  user: null,
  token: null,
  theme: 'light',
  currentPage: 'login',
  selectedQuotationId: null,
  selectedSalesOrderId: null,
  isLoading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        currentPage: 'dashboard',
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
        token: null,
        currentPage: 'login',
        selectedQuotationId: null,
        selectedSalesOrderId: null,
      };
    case 'SET_THEME':
      localStorage.setItem('theme', action.payload);
      return {
        ...state,
        theme: action.payload,
      };
    case 'SET_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      };
    case 'SET_SELECTED_QUOTATION':
      return {
        ...state,
        selectedQuotationId: action.payload,
      };
    case 'SET_SELECTED_SALES_ORDER':
      return {
        ...state,
        selectedSalesOrderId: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  login: (user: User, token: string) => void;
  logout: () => void;
  toggleTheme: () => void;
  navigateTo: (page: Page) => void;
  setSelectedQuotation: (id: number | null) => void;
  setSelectedSalesOrder: (id: number | null) => void;
  setLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme });
    }

    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'SET_USER', payload: { user, token: savedToken } });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  const login = (user: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'SET_USER', payload: { user, token } });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' });
  };

  const navigateTo = (page: Page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  };

  const setSelectedQuotation = (id: number | null) => {
    dispatch({ type: 'SET_SELECTED_QUOTATION', payload: id });
  };

  const setSelectedSalesOrder = (id: number | null) => {
    dispatch({ type: 'SET_SELECTED_SALES_ORDER', payload: id });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const value: AppContextType = {
    state,
    login,
    logout,
    toggleTheme,
    navigateTo,
    setSelectedQuotation,
    setSelectedSalesOrder,
    setLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}