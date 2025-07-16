'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/context/AppContext';
import { apiClient } from '@/lib/api';
import { Product, CreateProductData } from '@/types';
import { formatCurrency, validateRequired, validatePositiveNumber, validatePositiveInteger } from '@/lib/utils';
import { Plus, Edit, Trash2, Search, Package, DollarSign, Hash } from 'lucide-react';
import { LoadingCard } from '@/components/ui/loading-card';

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  stock_quantity?: string;
  general?: string;
}

export function ProductManagement() {
  const { state } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    description: '',
    price: 0,
    stock_quantity: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    if (!state.token) return;

    setIsLoading(true);
    try {
      const data = await apiClient.getProducts(state.token);
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Product name is required';
    }

    if (!validateRequired(formData.description)) {
      newErrors.description = 'Description is required';
    }

    if (!validatePositiveNumber(formData.price)) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!validatePositiveInteger(formData.stock_quantity)) {
      newErrors.stock_quantity = 'Stock quantity must be a positive integer';
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
      if (editingProduct) {
        const updatedProduct = await apiClient.updateProduct(editingProduct.id, formData, state.token);
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
      } else {
        const newProduct = await apiClient.createProduct(formData, state.token);
        setProducts(prev => [newProduct, ...prev]);
      }
      
      resetForm();
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Failed to save product. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock_quantity: product.stock_quantity,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (!state.token || !confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      await apiClient.deleteProduct(product.id, state.token);
      setProducts(prev => prev.filter(p => p.id !== product.id));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      stock_quantity: 0,
    });
    setErrors({});
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleInputChange = (field: keyof CreateProductData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'price' || field === 'stock_quantity' 
      ? parseFloat(e.target.value) || 0 
      : e.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
            <p className="text-muted-foreground">
              Manage your product catalog
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
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
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Product Form */}
      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </CardTitle>
            <CardDescription>
              {editingProduct ? 'Update product information' : 'Create a new product in your catalog'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                  {errors.general}
                </div>
              )}
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.price || ''}
                    onChange={handleInputChange('price')}
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">{errors.price}</p>
                  )}
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    type="text"
                    placeholder="Enter product description"
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Stock Quantity</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.stock_quantity || ''}
                    onChange={handleInputChange('stock_quantity')}
                    className={errors.stock_quantity ? 'border-red-500' : ''}
                  />
                  {errors.stock_quantity && (
                    <p className="text-sm text-red-500">{errors.stock_quantity}</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-semibold">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className={`font-medium ${
                      product.stock_quantity > 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {product.stock_quantity} in stock
                    </span>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(product.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm 
                    ? `No products match "${searchTerm}"`
                    : "You haven't added any products yet."}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Product
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}