export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'customer' | 'sales';
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface QuotationItem {
  id: number;
  quotation_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: Product;
}

export interface Quotation {
  id: number;
  customer_id: number;
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'converted_to_order';
  created_at: string;
  updated_at: string;
  customer?: User;
  items: QuotationItem[];
  audit_trail?: AuditTrail[];
}

export interface AuditTrail {
  id: number;
  quotation_id: number;
  changed_by: number;
  previous_status: string;
  new_status: string;
  changed_at: string;
  user?: User;
}

export interface SalesOrder {
  id: number;
  quotation_id: number;
  customer_id: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
  customer?: User;
  quotation?: Quotation;
  items: SalesOrderItem[];
}

export interface SalesOrderItem {
  id: number;
  sales_order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: Product;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  field?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'customer' | 'sales';
  phone?: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
}

export interface CreateQuotationData {
  items: {
    product_id: number;
    quantity: number;
  }[];
}