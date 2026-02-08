import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { BusinessPartner, Account, Transaction } from '../types';
import { Users, Wallet, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<BusinessPartner[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [partnersData, accountsData, transactionsData] = await Promise.all([
        apiService.getBusinessPartners(),
        apiService.getAccounts(),
        apiService.getTransactions(),
      ]);
      setPartners(partnersData);
      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalBalance = accounts.reduce((sum, account) => sum + parseFloat(account.balance), 0);
  const recentTransactions = transactions.slice(0, 5);
  const totalPayins = transactions.filter(t => t.type === 'payin').length;
  const totalPayouts = transactions.filter(t => t.type === 'payout').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Overview of your accounts and transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{partners.length}</div>
          <div className="text-sm text-slate-600">Business Partners</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Wallet className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{accounts.length}</div>
          <div className="text-sm text-slate-600">Active Accounts</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalPayins}</div>
          <div className="text-sm text-slate-600">Total Pay-ins</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalPayouts}</div>
          <div className="text-sm text-slate-600">Total Pay-outs</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Accounts Overview</h2>
          </div>
          <div className="p-6">
            {accounts.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No accounts yet</p>
            ) : (
              <div className="space-y-4">
                {accounts.slice(0, 5).map((account) => (
                  <div key={account.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900">
                        Account #{account.id}
                      </div>
                      <div className="text-sm text-slate-500">{account.currency}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">
                        {parseFloat(account.balance).toFixed(2)} {account.currency}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Recent Transactions</h2>
          </div>
          <div className="p-6">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No transactions yet</p>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900">{transaction.name}</div>
                      <div className="text-sm text-slate-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        transaction.type === 'payin' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {transaction.type === 'payin' ? '+' : '-'}
                        {parseFloat(transaction.amount).toFixed(2)}
                      </div>
                      <div className="text-xs text-slate-500 uppercase">{transaction.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
