'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { apiClient } from '@/lib/api';
import { Quotation, Product, SalesOrder } from '@/types';
import { formatCurrency, safeArray, safeFilter, safeReduce } from '@/lib/utils';
import { Package, FileText, ShoppingCart, TrendingUp, Plus, Eye } from 'lucide-react';
import { LoadingCard } from '@/components/ui/loading-card';

export function Dashboard() {
  const { state, navigateTo, setSelectedQuotation, setSelectedSalesOrder } = useApp();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!state.token) return;

    setIsLoading(true);
    try {
      const [quotationsData, productsData, salesOrdersData] = await Promise.all([
        apiClient.getQuotations(state.token).catch(error => {
          console.error('Failed to load quotations:', error);
          return [];
        }),
        state.user?.role === 'sales' 
          ? apiClient.getProducts(state.token).catch(error => {
              console.error('Failed to load products:', error);
              return [];
            })
          : Promise.resolve([]),
        state.user?.role === 'sales' 
          ? apiClient.getSalesOrders(state.token).catch(error => {
              console.error('Failed to load sales orders:', error);
              return [];
            })
          : Promise.resolve([]),
      ]);

      setQuotations(Array.isArray(quotationsData) ? quotationsData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setSalesOrders(Array.isArray(salesOrdersData) ? salesOrdersData : []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Set empty arrays as fallback
      setQuotations([]);
      setProducts([]);
      setSalesOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewQuotation = (quotation: Quotation) => {
    setSelectedQuotation(quotation.id);
    navigateTo('quotation-detail');
  };

  const handleViewSalesOrder = (salesOrder: SalesOrder) => {
    setSelectedSalesOrder(salesOrder.id);
    navigateTo('sales-order-detail');
  };

  const pendingQuotations = safeFilter(quotations, q => q.status === 'pending');
  const recentQuotations = safeArray(quotations).slice(0, 5);
  const recentSalesOrders = safeArray(salesOrders).slice(0, 5);

  const stats = [
    {
      title: 'Total Quotations',
      value: safeArray(quotations).length,
      icon: FileText,
      description: `${pendingQuotations.length} pending`,
    },
    ...(state.user?.role === 'sales' ? [{
      title: 'Products',
      value: safeArray(products).length,
      icon: Package,
      description: `${safeFilter(products, p => p.stock_quantity > 0).length} in stock`,
    }] : []),
    ...(state.user?.role === 'sales' ? [{
      title: 'Sales Orders',
      value: safeArray(salesOrders).length,
      icon: ShoppingCart,
      description: `${safeArray(salesOrders).length} total`,
    }] : []),
    {
      title: 'Total Value',
      value: formatCurrency(safeReduce(quotations, (sum, q) => sum + q.total_amount, 0)),
      icon: TrendingUp,
      description: 'All quotations',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {state.user?.email}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <LoadingCard />
          <LoadingCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {state.user?.email}
          </p>
        </div>

        <div className="flex gap-2">
          {state.user?.role === 'customer' && (
            <Button onClick={() => navigateTo('quotation-form')}>
              <Plus className="mr-2 h-4 w-4" />
              New Quotation
            </Button>
          )}
          {state.user?.role === 'sales' && (
            <Button onClick={() => navigateTo('products')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Quotations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Quotations</CardTitle>
            <CardDescription>
              {state.user?.role === 'customer'
                ? 'Your latest quotation requests'
                : 'Latest quotations from customers'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQuotations.length > 0 ? (
                recentQuotations.map((quotation) => (
                  <div key={quotation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {quotation.quotation_number}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(quotation.total_amount)}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${quotation.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : quotation.status === 'approved'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                        {quotation.status}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewQuotation(quotation)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No quotations yet
                </p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="ghost" onClick={() => navigateTo('quotations')} className="w-full">
                View All Quotations
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sales Orders (Sales role only) or Actions (Customer role) */}
        {state.user?.role === 'sales' ? (
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales Orders</CardTitle>
              <CardDescription>
                Latest orders converted from quotations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSalesOrders.length > 0 ? (
                  recentSalesOrders.map((salesOrder) => (
                    <div key={salesOrder.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Order #{salesOrder.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(salesOrder.total_amount)}
                        </p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Created
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewSalesOrder(salesOrder)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No sales orders yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full justify-start"
                variant="ghost"
                onClick={() => navigateTo('quotation-form')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Quotation
              </Button>
              <Button
                className="w-full justify-start"
                variant="ghost"
                onClick={() => navigateTo('quotations')}
              >
                <FileText className="mr-2 h-4 w-4" />
                View All Quotations
              </Button>
              {pendingQuotations.length > 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    You have {pendingQuotations.length} pending quotation{pendingQuotations.length > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}