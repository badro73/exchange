import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Account, BusinessPartner, CurrencyEnum } from '../types';
import { Plus, RefreshCw, Wallet, X, ChevronDown, Loader2 } from 'lucide-react';
import { Toast } from './Toast';

export function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [partners, setPartners] = useState<BusinessPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [expandedAccount, setExpandedAccount] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [formData, setFormData] = useState({
    currency: CurrencyEnum.CHF,
    balance: '0',
    businessPartner: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [accountsData, partnersData] = await Promise.all([
        apiService.getAccounts(),
        apiService.getBusinessPartners(),
      ]);
      setAccounts(accountsData);
      setPartners(partnersData);
    } catch (error) {
      console.error('Error loading data:', error);
      setToast({
        message: 'Failed to load accounts. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiService.createAccount(formData);
      setShowModal(false);
      setFormData({
        currency: CurrencyEnum.CHF,
        balance: '0',
        businessPartner: '',
      });
      setToast({
        message: 'Account created successfully!',
        type: 'success',
      });
      loadData();
    } catch (error) {
      console.error('Error creating account:', error);
      setToast({
        message: 'Failed to create account. Please try again.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getPartnerName = (account: Account) => {
    if (typeof account.businessPartner === 'object' && 'name' in account.businessPartner) {
      return account.businessPartner.name;
    }
    const partner = partners.find(p => p.id === (account.businessPartner as any).id);
    return partner?.name || 'Unknown';
  };

  const getCurrencySymbol = (currency: CurrencyEnum) => {
    switch (currency) {
      case CurrencyEnum.CHF:
        return 'CHF';
      case CurrencyEnum.EUR:
        return '€';
      case CurrencyEnum.USD:
        return '$';
      case CurrencyEnum.GBP:
        return '£';
      default:
        return currency;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Accounts</h1>
          <p className="text-slate-600">Manage your client accounts</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Account
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No accounts yet</h3>
          <p className="text-slate-600 mb-6">Create your first account to get started</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() => setExpandedAccount(expandedAccount === account.id ? null : account.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <Wallet className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Account #{account.id}
                      </h3>
                      <p className="text-sm text-slate-600">{getPartnerName(account)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">
                        {parseFloat(account.balance).toFixed(2)}
                      </div>
                      <div className="text-sm text-slate-600">{getCurrencySymbol(account.currency)}</div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        expandedAccount === account.id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              {expandedAccount === account.id && account.transactions && (
                <div className="border-t border-slate-200 bg-slate-50 p-6">
                  <h4 className="font-medium text-slate-900 mb-4">Transactions</h4>
                  {account.transactions.length === 0 ? (
                    <p className="text-slate-500 text-sm">No transactions yet</p>
                  ) : (
                    <div className="space-y-3">
                      {account.transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="bg-white rounded-lg p-4 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium text-slate-900">{transaction.name}</div>
                            <div className="text-sm text-slate-600">
                              {new Date(transaction.date).toLocaleDateString()} • {transaction.type}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${
                              transaction.type === 'payin' ? 'text-green-600' : 'text-orange-600'
                            }`}>
                              {transaction.type === 'payin' ? '+' : '-'}
                              {parseFloat(transaction.amount).toFixed(2)}
                            </div>
                            {transaction.executed ? (
                              <span className="text-xs text-green-600">Executed</span>
                            ) : (
                              <span className="text-xs text-yellow-600">Pending</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Add Account</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Business Partner
                </label>
                <select
                  required
                  value={formData.businessPartner}
                  onChange={(e) => setFormData({ ...formData, businessPartner: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a partner</option>
                  {partners.map((partner) => (
                    <option key={partner.id} value={`/api/business_partners/${partner.id}`}>
                      {partner.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as CurrencyEnum })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={CurrencyEnum.CHF}>CHF - Swiss Franc</option>
                  <option value={CurrencyEnum.EUR}>EUR - Euro</option>
                  <option value={CurrencyEnum.USD}>USD - US Dollar</option>
                  <option value={CurrencyEnum.GBP}>GBP - British Pound</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Initial Balance
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
