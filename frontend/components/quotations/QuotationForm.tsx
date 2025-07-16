'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { apiClient } from '@/lib/api';
import { Product } from '@/types';
import { formatCurrency, validatePositiveInteger, safeArray } from '@/lib/utils';
import { Plus, Minus, ShoppingCart, Package, ArrowLeft, Loader2 } from 'lucide-react';

interface QuotationItem {
  product_id: string;
  product: Product;
  quantity: number;
  unit_price: number;
}

interface FormErrors {
  items?: string;
  general?: string;
}

export function QuotationForm() {
  const { state, navigateTo } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [updateKey, setUpdateKey] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    if (!state.token) return;

    setIsLoading(true);
    try {
      const data = await apiClient.getProducts(state.token);
      const productsArray = Array.isArray(data) ? data : [];
      setProducts(productsArray.filter(p => p.stock_quantity > 0));
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = (productId: string) => {
    if (!productId) return;

    const product = safeArray(products).find(p => p.id === productId);
    if (!product) {
      console.error('Product not found:', productId);
      return;
    }

    const existingItem = safeArray(items).find(item => item.product_id === product.id);
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      setItems(prev => {
        const newItems = [...prev, {
          product_id: product.id,
          product,
          quantity: 1,
          unit_price: product.price
        }];
        console.log('Adding item, new items:', newItems);
        return newItems;
      });
      setUpdateKey(prev => prev + 1);
    }

    if (errors.items) {
      console.log(errors)
      setErrors(prev => ({ ...prev, items: undefined }));
    }

    // Reset select value
    setSelectedProductId('');
  };

  const removeItem = (productId: string) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.product_id !== productId);
      console.log('Removing item, new items:', newItems);
      return newItems;
    });
    setUpdateKey(prev => prev + 1);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }

    const product = safeArray(products).find(p => p.id === productId);
    if (!product || quantity > product.stock_quantity) {
      return;
    }

    setItems(prev => {
      const newItems = prev.map(item =>
        item.product_id === productId
          ? { ...item, quantity, unit_price: item.product.price }
          : item
      );
      console.log('Updating quantity, new items:', newItems);
      return newItems;
    });
    setUpdateKey(prev => prev + 1);
  };

  const calculateTotal = () => {
    return safeArray(items).reduce((total, item) => total + (item.unit_price * item.quantity), 0);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (items.length === 0) {
      newErrors.items = 'Please add at least one item to your quotation';
    }

    for (const item of items) {
      if (!validatePositiveInteger(item.quantity)) {
        newErrors.items = 'All quantities must be positive integers';
        break;
      }
      if (item.quantity > item.product.stock_quantity) {
        newErrors.items = `Quantity for ${item.product.name} exceeds available stock (${item.product.stock_quantity})`;
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !state.token) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await apiClient.createQuotation({
        items: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      }, state.token);

      navigateTo('quotations');
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Failed to create quotation. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
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
            <h1 className="text-3xl font-bold tracking-tight">Create Quotation</h1>
            <p className="text-muted-foreground">
              Request a quote for your selected products
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const availableProducts = safeArray(products).filter(product =>
    !safeArray(items).some(item => item.product_id === product.id)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigateTo('quotations')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Quotation</h1>
          <p className="text-muted-foreground">
            Request a quote for your selected products
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Products</CardTitle>
              <CardDescription>
                Choose products to include in your quotation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {errors.general && (
                <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                  {errors.general}
                </div>
              )}

              <div className="space-y-2">
                <Label>Add Product</Label>
                <Select onValueChange={addItem} value={selectedProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a product to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts.length > 0 ? (
                      availableProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{product.name}</span>
                            <span className="ml-2 text-sm text-muted-foreground">
                              {formatCurrency(product.price)} • {product.stock_quantity} in stock
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-products" disabled>
                        {products.length === 0 ? 'No products available' : 'All available products added'}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {errors.items && (
                <p className="text-sm text-red-500">{errors.items}</p>
              )}

              {/* Selected Items */}
              <div className="space-y-3" key={updateKey}>
                {items.length > 0 ? (
                  items.map((item) => (
                    <div key={`${item.product_id}-${updateKey}`} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.unit_price)} each • {item.product.stock_quantity} available
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          max={item.product.stock_quantity}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value) || 1)}
                          className="w-20 text-center"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock_quantity}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.product_id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No items added yet. Select products from the dropdown above.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quotation Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Quotation Summary</CardTitle>
              <CardDescription>
                Review your quotation details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3" key={`summary-${updateKey}`}>
                {items.map((item) => (
                  <div key={`summary-${item.product_id}-${updateKey}`} className="flex items-center justify-between py-2 border-b">
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × {formatCurrency(item.unit_price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(item.unit_price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Your quotation summary will appear here
                    </p>
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigateTo('quotations')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={items.length === 0 || isSubmitting}
                className="flex-1"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Quotation
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}