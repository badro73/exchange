import {
  BusinessPartner,
  Account,
  Transaction,
  CreateBusinessPartnerInput,
  CreateAccountInput,
  CreateTransactionInput,
  ExchangeInput
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface ApiResponse<T> {
  'hydra:member'?: T[];
  'hydra:totalItems'?: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Business Partners
  async getBusinessPartners(): Promise<BusinessPartner[]> {
    const response = await this.request<ApiResponse<BusinessPartner>>('/api/business_partners');
    return response['hydra:member'] || [];
  }

  async getBusinessPartner(id: number): Promise<BusinessPartner> {
    return this.request<BusinessPartner>(`/api/business_partners/${id}`);
  }

  async createBusinessPartner(data: CreateBusinessPartnerInput): Promise<BusinessPartner> {
    return this.request<BusinessPartner>('/api/business_partners', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Accounts
  async getAccounts(): Promise<Account[]> {
    const response = await this.request<ApiResponse<Account>>('/api/accounts');
    return response['hydra:member'] || [];
  }

  async getAccount(id: number): Promise<Account> {
    return this.request<Account>(`/api/accounts/${id}`);
  }

  async createAccount(data: CreateAccountInput): Promise<Account> {
    return this.request<Account>('/api/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    const response = await this.request<ApiResponse<Transaction>>('/api/transactions');
    return response['hydra:member'] || [];
  }

  async getTransaction(id: number): Promise<Transaction> {
    return this.request<Transaction>(`/api/transactions/${id}`);
  }

  async createPayin(data: CreateTransactionInput): Promise<Transaction> {
    return this.request<Transaction>('/api/transactions/payin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createPayout(data: CreateTransactionInput): Promise<Transaction> {
    return this.request<Transaction>('/api/transactions/payout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createExchange(data: ExchangeInput): Promise<Transaction> {
    return this.request<Transaction>('/api/transactions/exchange', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async executePayout(id: number): Promise<Transaction> {
    return this.request<Transaction>(`/api/transactions/${id}/payout/execute`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    });
  }
}

export const apiService = new ApiService();
