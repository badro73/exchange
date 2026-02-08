export enum CurrencyEnum {
  CHF = 'CHF',
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP'
}

export enum TransactionTypeEnum {
  PAYIN = 'payin',
  PAYOUT = 'payout',
  EXCHANGE = 'exchange'
}

export enum BusinessPartnerStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'
}

export enum LegalFormEnum {
  SA = 'SA',
  SARL = 'SARL',
  SNC = 'SNC',
  INDIVIDUAL = 'individual'
}

export interface BusinessPartner {
  id: number;
  name: string;
  status: BusinessPartnerStatusEnum;
  legalForm: LegalFormEnum;
  address: string;
  city: string;
  zip: string;
  country: string;
  accounts?: Account[];
}

export interface Account {
  id: number;
  currency: CurrencyEnum;
  balance: string;
  businessPartner: BusinessPartner | { id: number };
  transactions?: Transaction[];
}

export interface Transaction {
  id: number;
  amount: string;
  name: string;
  date: string;
  executed: boolean;
  type: TransactionTypeEnum;
  country: string;
  iban: string;
  account: Account | { id: number };
}

export interface CreateBusinessPartnerInput {
  name: string;
  status: BusinessPartnerStatusEnum;
  legalForm: LegalFormEnum;
  address: string;
  city: string;
  zip: string;
  country: string;
}

export interface CreateAccountInput {
  currency: CurrencyEnum;
  balance: string;
  businessPartner: string;
}

export interface CreateTransactionInput {
  amount: string;
  name: string;
  date: string;
  country: string;
  iban: string;
  account: string;
}

export interface ExchangeInput {
  fromAccount: string;
  toAccount: string;
  amount: string;
  name: string;
  date: string;
}
