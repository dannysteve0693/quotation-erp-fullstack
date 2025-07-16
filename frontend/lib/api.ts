import { 
  User, 
  Product, 
  Quotation, 
  SalesOrder, 
  AuthResponse, 
  LoginData, 
  RegisterData, 
  CreateProductData, 
  CreateQuotationData,
  ApiError 
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }

  private async handleArrayResponse<T>(response: Response): Promise<T[]> {
    const data = await this.handleResponse<T[] | { [key: string]: T[] }>(response);
    
    // If response is wrapped in an object (e.g., { quotations: [...] })
    if (typeof data === 'object' && !Array.isArray(data)) {
      const keys = Object.keys(data);
      const arrayKey = keys.find(key => Array.isArray(data[key as keyof typeof data]));
      if (arrayKey) {
        return data[arrayKey as keyof typeof data] as T[];
      }
    }
    
    // If response is directly an array
    return Array.isArray(data) ? data : [];
  }

  // Auth endpoints
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<AuthResponse>(response);
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<AuthResponse>(response);
  }

  // Product endpoints
  async getProducts(token: string): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    return this.handleArrayResponse<Product>(response);
  }

  async createProduct(data: CreateProductData, token: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    return this.handleResponse<Product>(response);
  }

  async updateProduct(id: string, data: Partial<CreateProductData>, token: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    return this.handleResponse<Product>(response);
  }

  async deleteProduct(id: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }

  // Quotation endpoints
  async getQuotations(token: string): Promise<Quotation[]> {
    const response = await fetch(`${API_BASE_URL}/quotations`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    return this.handleArrayResponse<Quotation>(response);
  }

  async getQuotationById(id: string, token: string): Promise<Quotation> {
    const response = await fetch(`${API_BASE_URL}/quotations/${id}`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    return this.handleResponse<Quotation>(response);
  }

  async createQuotation(data: CreateQuotationData, token: string): Promise<Quotation> {
    const response = await fetch(`${API_BASE_URL}/quotations`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    return this.handleResponse<Quotation>(response);
  }

  async approveQuotation(id: string, token: string): Promise<Quotation> {
    const response = await fetch(`${API_BASE_URL}/quotations/${id}/approve`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify({ action: 'approve' }),
    });

    return this.handleResponse<Quotation>(response);
  }

  async rejectQuotation(id: string, token: string): Promise<Quotation> {
    const response = await fetch(`${API_BASE_URL}/quotations/${id}/approve`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify({ action: 'reject' }),
    });

    return this.handleResponse<Quotation>(response);
  }

  // Sales Order endpoints
  async getSalesOrders(token: string): Promise<SalesOrder[]> {
    const response = await fetch(`${API_BASE_URL}/sales-orders`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    return this.handleArrayResponse<SalesOrder>(response);
  }

  async getSalesOrderById(id: string, token: string): Promise<SalesOrder> {
    const response = await fetch(`${API_BASE_URL}/sales-orders/${id}`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    return this.handleResponse<SalesOrder>(response);
  }

  async createSalesOrderFromQuotation(quotationId: string, token: string): Promise<SalesOrder> {
    const response = await fetch(`${API_BASE_URL}/sales-orders/from-quotation/${quotationId}`, {
      method: 'POST',
      headers: this.getHeaders(token),
    });

    return this.handleResponse<SalesOrder>(response);
  }

  async updateSalesOrderStatus(id: string, status: string, token: string): Promise<SalesOrder> {
    const response = await fetch(`${API_BASE_URL}/sales-orders/${id}/status`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify({ status }),
    });

    return this.handleResponse<SalesOrder>(response);
  }
}

export const apiClient = new ApiClient();