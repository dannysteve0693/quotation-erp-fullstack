'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { apiClient } from '@/lib/api';
import { SalesOrder } from '@/types';
import { formatCurrency, formatDate, getStatusColor, safeArray, safeFilter } from '@/lib/utils';
import { Search, Plus, Eye, Check, X, Filter, FileText, Calendar, DollarSign } from 'lucide-react';
import { LoadingCard } from '@/components/ui/loading-card';

export function SalesOrderList() {
  const { state, navigateTo, setSelectedSalesOrder } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    if (!state.token) return;

    setIsLoading(true);
    try {
      const data = await apiClient.getSalesOrders(state.token);
      setSalesOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load sales order:', error);
      setSalesOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewQuotation = (salesOrder: SalesOrder) => {
    setSelectedSalesOrder(salesOrder.id);
    navigateTo('sales-order-detail');
  };


  const filteredAndSortedSalesOrders = safeArray(salesOrders)
    .filter(salesOrder => {
      const matchesSearch = salesOrder.id.toString().includes(searchTerm) ||
        formatCurrency(salesOrder.total_amount).toLowerCase().includes(searchTerm.toLowerCase()) ;
      
      return matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else {
        comparison = a.total_amount - b.total_amount;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });


  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sales Order</h1>
            <p className="text-muted-foreground">
              {state.user?.role === 'sales' 
                ? 'Review Sales Orders' 
                : '-'}
            </p>
          </div>
        </div>
        
        <div className="grid gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Orders</h1>
          <p className="text-muted-foreground">
            {state.user?.role === 'sales' 
              ? 'Review Sales Orders' 
              : '-'}
          </p>
        </div>
        
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sales order..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [field, order] = value.split('-');
                setSortBy(field as 'date' | 'amount');
                setSortOrder(order as 'asc' | 'desc');
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Latest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="amount-desc">Highest Amount</SelectItem>
                  <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Order List */}
      <div className="space-y-4">
        {filteredAndSortedSalesOrders.length > 0 ? (
          filteredAndSortedSalesOrders.map((salesOrder) => (
            <Card key={salesOrder.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        {salesOrder.quotation_id}
                      </h3>
                    </div>
                    
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {state.user?.role === 'sales' && salesOrder.customer && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                          </div>
                          <span>{salesOrder.customer.email}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium text-foreground">
                          {formatCurrency(salesOrder.total_amount)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(salesOrder.created_at)}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {salesOrder.items ? safeArray(salesOrder.items).length : 0} item{(salesOrder.items ? safeArray(salesOrder.items).length : 0) !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewQuotation(salesOrder)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : <Card><CardContent><div>No Sales Order Found</div></CardContent></Card>}
      </div>
    </div>
  );
}