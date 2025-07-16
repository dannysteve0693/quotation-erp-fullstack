'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { apiClient } from '@/lib/api';
import { Quotation } from '@/types';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Search, Plus, Eye, Check, X, Filter, FileText, Calendar, DollarSign } from 'lucide-react';
import { LoadingCard } from '@/components/ui/loading-card';

export function QuotationList() {
  const { state, navigateTo, setSelectedQuotation } = useApp();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    if (!state.token) return;

    setIsLoading(true);
    try {
      const data = await apiClient.getQuotations(state.token);
      setQuotations(data);
    } catch (error) {
      console.error('Failed to load quotations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewQuotation = (quotation: Quotation) => {
    setSelectedQuotation(quotation.id);
    navigateTo('quotation-detail');
  };

  const handleApproveQuotation = async (quotation: Quotation) => {
    if (!state.token) return;

    try {
      const updatedQuotation = await apiClient.approveQuotation(quotation.id, state.token);
      setQuotations(prev => prev.map(q => 
        q.id === quotation.id ? updatedQuotation : q
      ));
    } catch (error) {
      console.error('Failed to approve quotation:', error);
    }
  };

  const handleRejectQuotation = async (quotation: Quotation) => {
    if (!state.token || !confirm('Are you sure you want to reject this quotation?')) {
      return;
    }

    try {
      const updatedQuotation = await apiClient.rejectQuotation(quotation.id, state.token);
      setQuotations(prev => prev.map(q => 
        q.id === quotation.id ? updatedQuotation : q
      ));
    } catch (error) {
      console.error('Failed to reject quotation:', error);
    }
  };

  const filteredAndSortedQuotations = quotations
    .filter(quotation => {
      const matchesSearch = quotation.id.toString().includes(searchTerm) ||
        formatCurrency(quotation.total_amount).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (quotation.customer ? `${quotation.customer.first_name} ${quotation.customer.last_name}` : '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
      
      return matchesSearch && matchesStatus;
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

  const statusCounts = {
    all: quotations.length,
    pending: quotations.filter(q => q.status === 'pending').length,
    approved: quotations.filter(q => q.status === 'approved').length,
    rejected: quotations.filter(q => q.status === 'rejected').length,
    converted_to_order: quotations.filter(q => q.status === 'converted_to_order').length,
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
            <p className="text-muted-foreground">
              {state.user?.role === 'customer' 
                ? 'Manage your quotation requests' 
                : 'Review and approve customer quotations'}
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
          <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground">
            {state.user?.role === 'customer' 
              ? 'Manage your quotation requests' 
              : 'Review and approve customer quotations'}
          </p>
        </div>
        
        {state.user?.role === 'customer' && (
          <Button onClick={() => navigateTo('quotation-form')}>
            <Plus className="mr-2 h-4 w-4" />
            New Quotation
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quotations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ({statusCounts.all})</SelectItem>
                  <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
                  <SelectItem value="approved">Approved ({statusCounts.approved})</SelectItem>
                  <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
                  <SelectItem value="converted_to_order">Orders ({statusCounts.converted_to_order})</SelectItem>
                </SelectContent>
              </Select>
              
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

      {/* Quotations List */}
      <div className="space-y-4">
        {filteredAndSortedQuotations.length > 0 ? (
          filteredAndSortedQuotations.map((quotation) => (
            <Card key={quotation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        Quotation #{quotation.id}
                      </h3>
                      <Badge className={getStatusColor(quotation.status)}>
                        {quotation.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {state.user?.role === 'sales' && quotation.customer && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                          </div>
                          <span>{quotation.customer.first_name} {quotation.customer.last_name}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium text-foreground">
                          {formatCurrency(quotation.total_amount)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(quotation.created_at)}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {quotation.items.length} item{quotation.items.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewQuotation(quotation)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    
                    {state.user?.role === 'sales' && quotation.status === 'pending' && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApproveQuotation(quotation)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRejectQuotation(quotation)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No quotations found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'No quotations match your current filters'
                  : state.user?.role === 'customer'
                  ? "You haven't created any quotations yet"
                  : 'No customer quotations available'}
              </p>
              {!searchTerm && statusFilter === 'all' && state.user?.role === 'customer' && (
                <Button onClick={() => navigateTo('quotation-form')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Quotation
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}