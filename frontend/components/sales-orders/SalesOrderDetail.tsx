'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { apiClient } from '@/lib/api';
import { SalesOrder } from '@/types';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { ArrowLeft, User, Calendar, Package, DollarSign, FileText, Truck, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { LoadingCard } from '@/components/ui/loading-card';

export function SalesOrderDetail() {
  const { state, navigateTo, setSelectedQuotation } = useApp();
  const [salesOrder, setSalesOrder] = useState<SalesOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    loadSalesOrder();
  }, []);

  const loadSalesOrder = async () => {
    if (!state.token || !state.selectedSalesOrderId) return;

    setIsLoading(true);
    try {
      const data = await apiClient.getSalesOrderById(state.selectedSalesOrderId, state.token);
      setSalesOrder(data);
    } catch (error) {
      console.error('Failed to load sales order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!salesOrder || !state.token) return;

    setIsUpdatingStatus(true);
    try {
      const updatedOrder = await apiClient.updateSalesOrderStatus(salesOrder.id, newStatus, state.token);
      setSalesOrder(updatedOrder);
    } catch (error) {
      console.error('Failed to update sales order status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleViewQuotation = () => {
    if (salesOrder?.quotation_id) {
      setSelectedQuotation(salesOrder.quotation_id);
      navigateTo('quotation-detail');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigateTo('dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48 mt-2"></div>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <LoadingCard />
          <LoadingCard />
        </div>
      </div>
    );
  }

  if (!salesOrder) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigateTo('dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sales Order Not Found</h1>
          </div>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Sales order not found</h3>
            <p className="text-muted-foreground text-center mb-4">
              The requested sales order could not be found or you don't have permission to view it.
            </p>
            <Button onClick={() => navigateTo('dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: Clock },
    { value: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { value: 'shipped', label: 'Shipped', icon: Truck },
    { value: 'delivered', label: 'Delivered', icon: Package },
    { value: 'cancelled', label: 'Cancelled', icon: AlertCircle },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigateTo('dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              Sales Order #{salesOrder.id}
            </h1>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Active
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Created on {formatDate(salesOrder.created_at)}
          </p>
        </div>
        
        {/* Status Update */}
        {state.user?.role === 'sales' && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
              Active
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>
              Basic information about this sales order
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {salesOrder.customer && (
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{salesOrder.customer.email}</p>
                  <p className="text-sm text-muted-foreground">{salesOrder.customer.email}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Created</p>
                <p className="text-sm text-muted-foreground">{formatDate(salesOrder.created_at)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Items</p>
                <p className="text-sm text-muted-foreground">
                  {salesOrder.items.length} item{salesOrder.items.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Total Amount</p>
                <p className="text-lg font-semibold">{formatCurrency(salesOrder.total_amount)}</p>
              </div>
            </div>
            
            {salesOrder.quotation_id && (
              <div className="pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={handleViewQuotation}
                  className="w-full"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Original Quotation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>
              Products included in this sales order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesOrder.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product?.name || 'Unknown Product'}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.product?.description || 'No description available'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × {formatCurrency(item.unit_price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(item.sub_total)}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(salesOrder.total_amount)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Info */}
      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
          <CardDescription>
            Additional details about this sales order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Created:</span>
              <span className="text-sm text-muted-foreground">{formatDate(salesOrder.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Total Amount:</span>
              <span className="text-sm font-medium">{formatCurrency(salesOrder.total_amount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}