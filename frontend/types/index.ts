export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: 'customer' | 'sales';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  contact_person?: string;
  phone_number?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface QuotationItem {
  id: string;
  quotation_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  sub_total: number;
  product?: Product;
  created_at: string;
  updated_at: string;
}

export interface Quotation {
  id: string;
  quotation_number: string;
  customer_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'converted_to_order';
  total_amount: number;
  created_by?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  customer?: User;
  items: QuotationItem[];
  audit_trail?: AuditTrail[];
}

export interface AuditTrail {
  id: string;
  quotation_id: string;
  event_type: 'created' | 'status_change' | 'approved' | 'rejected' | 'converted_to_order';
  old_status?: 'pending' | 'approved' | 'rejected' | 'converted_to_order';
  new_status?: 'pending' | 'approved' | 'rejected' | 'converted_to_order';
  changed_by?: string;
  change_reason?: string;
  changed_at: string;
  user?: User;
}

export interface SalesOrder {
  id: string;
  quotation_id: string;
  customer_id: string;
  order_date: string;
  total_amount: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  customer?: User;
  quotation?: Quotation;
  items: SalesOrderItem[];
}

export interface SalesOrderItem {
  id: string;
  sales_order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  sub_total: number;
  product?: Product;
  created_at: string;
  updated_at: string;
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
  email: string;
  password: string;
  role: 'customer' | 'sales';
}

export interface CreateProductData {
  name: string;
  description: string;
  sku: string;
  price: number;
  stock_quantity: number;
  category?: string;
}

export interface CreateQuotationData {
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
  }[];
}