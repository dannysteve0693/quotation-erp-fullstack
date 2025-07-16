'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { apiClient } from '@/lib/api';
import { Quotation } from '@/types';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { ArrowLeft, Check, X, ShoppingCart, User, Calendar, Package, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { LoadingCard } from '@/components/ui/loading-card';

export function QuotationDetail() {
  const { state, navigateTo, setSelectedSalesOrder } = useApp();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadQuotation();
  }, []);

  const loadQuotation = async () => {
    if (!state.token || !state.selectedQuotationId) return;

    setIsLoading(true);
    try {
      const data = await apiClient.getQuotationById(state.selectedQuotationId, state.token);
      setQuotation(data);
    } catch (error) {
      console.error('Failed to load quotation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!quotation || !state.token) return;

    setIsActionLoading('approve');
    try {
      const updatedQuotation = await apiClient.approveQuotation(quotation.id, state.token);
      setQuotation(updatedQuotation);
    } catch (error) {
      console.error('Failed to approve quotation:', error);
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!quotation || !state.token || !confirm('Are you sure you want to reject this quotation?')) {
      return;
    }

    setIsActionLoading('reject');
    try {
      const updatedQuotation = await apiClient.rejectQuotation(quotation.id, state.token);
      setQuotation(updatedQuotation);
    } catch (error) {
      console.error('Failed to reject quotation:', error);
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleCreateSalesOrder = async () => {
    if (!quotation || !state.token) return;

    setIsActionLoading('convert');
    try {
      const salesOrder = await apiClient.createSalesOrderFromQuotation(quotation.id, state.token);
      setSelectedSalesOrder(salesOrder.id);
      navigateTo('sales-order-detail');
    } catch (error) {
      console.error('Failed to create sales order:', error);
    } finally {
      setIsActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigateTo('quotations')}>
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

  if (!quotation) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigateTo('quotations')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quotation Not Found</h1>
          </div>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Quotation not found</h3>
            <p className="text-muted-foreground text-center mb-4">
              The requested quotation could not be found or you don't have permission to view it.
            </p>
            <Button onClick={() => navigateTo('quotations')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Quotations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigateTo('quotations')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              Quotation #{quotation.id}
            </h1>
            <Badge className={getStatusColor(quotation.status)}>
              {quotation.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Created on {formatDate(quotation.created_at)}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          {state.user?.role === 'sales' && quotation.status === 'pending' && (
            <>
              <Button
                variant="default"
                onClick={handleApprove}
                disabled={isActionLoading === 'approve'}
              >
                {isActionLoading === 'approve' ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isActionLoading === 'reject'}
              >
                {isActionLoading === 'reject' ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </>
                )}
              </Button>
            </>
          )}
          
          {state.user?.role === 'sales' && quotation.status === 'approved' && (
            <Button
              variant="default"
              onClick={handleCreateSalesOrder}
              disabled={isActionLoading === 'convert'}
            >
              {isActionLoading === 'convert' ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Create Sales Order
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quotation Details */}
        <Card>
          <CardHeader>
            <CardTitle>Quotation Details</CardTitle>
            <CardDescription>
              Basic information about this quotation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.user?.role === 'sales' && quotation.customer && (
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{quotation.customer.first_name} {quotation.customer.last_name}</p>
                  <p className="text-sm text-muted-foreground">{quotation.customer.email}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Created</p>
                <p className="text-sm text-muted-foreground">{formatDate(quotation.created_at)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Items</p>
                <p className="text-sm text-muted-foreground">
                  {quotation.items.length} item{quotation.items.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Total Amount</p>
                <p className="text-lg font-semibold">{formatCurrency(quotation.total_amount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <CardDescription>
              Products included in this quotation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quotation.items.map((item) => (
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
                      {formatCurrency(item.total_price)}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(quotation.total_amount)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Trail */}
      {quotation.audit_trail && quotation.audit_trail.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Audit Trail</CardTitle>
            <CardDescription>
              History of status changes for this quotation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quotation.audit_trail.map((entry) => (
                <div key={entry.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        Status changed from "{entry.previous_status}" to "{entry.new_status}"
                      </p>
                      <time className="text-sm text-muted-foreground">
                        {formatDate(entry.changed_at)}
                      </time>
                    </div>
                    {entry.user && (
                      <p className="text-sm text-muted-foreground">
                        Changed by {entry.user.first_name} {entry.user.last_name} ({entry.user.role})
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}