'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Layout } from '@/components/layout/Layout';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ProductManagement } from '@/components/products/ProductManagement';
import { QuotationForm } from '@/components/quotations/QuotationForm';
import { QuotationList } from '@/components/quotations/QuotationList';
import { QuotationDetail } from '@/components/quotations/QuotationDetail';
import { SalesOrderDetail } from '@/components/sales-orders/SalesOrderDetail';
import { SalesOrderList } from '@/components/sales-orders/SalesOrderList';

function AppContent() {
  const { state } = useApp();

  const renderCurrentPage = () => {
    console.log('Current Page:', state.currentPage);
    if (!state.user) {
      switch (state.currentPage) {
        case 'login':
          return <LoginForm />;
        case 'register':
          return <RegisterForm />;
        default:
          return <LoginForm />;
      }
    }

    switch (state.currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return state.user.role === 'sales' ? <ProductManagement /> : <Dashboard />;
      case 'quotation-form':
        return state.user.role === 'customer' ? <QuotationForm /> : <Dashboard />;
      case 'quotations':
        return <QuotationList />;
      case 'quotation-detail':
        return <QuotationDetail />;
      case 'sales-order-detail':
        return <SalesOrderDetail />;
      case 'sales-order-list':
        return <SalesOrderList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderCurrentPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}