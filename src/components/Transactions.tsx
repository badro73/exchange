import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Transaction, Account, TransactionTypeEnum } from '../types';
import { Plus, RefreshCw, ArrowRightLeft, TrendingUp, TrendingDown, Repeat, X, CheckCircle, Clock } from 'lucide-react';

type TransactionFormType = 'payin' | 'payout' | 'exchange';

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState<TransactionFormType>('payin');
  const [formData, setFormData] = useState({
    amount: '',
    name: '',
    date: new Date().toISOString().split('T')[0],
    country: 'CH',
    iban: '',
    account: '',
    fromAccount: '',
    toAccount: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsData, accountsData] = await Promise.all([
        apiService.getTransactions(),
        apiService.getAccounts(),
      ]);
      setTransactions(transactionsData);
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formType === 'exchange') {
        await apiService.createExchange({
          fromAccount: formData.fromAccount,
          toAccount: formData.toAccount,
          amount: formData.amount,
          name: formData.name,
          date: formData.date,
        });
      } else {
        const data = {
          amount: formData.amount,
          name: formData.name,
          date: formData.date,
          country: formData.country,
          iban: formData.iban,
          account: formData.account,
        };
        if (formType === 'payin') {
          await apiService.createPayin(data);
        } else {
          await apiService.createPayout(data);
        }
      }
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleExecutePayout = async (id: number) => {
    try {
      await apiService.executePayout(id);
      loadData();
    } catch (error) {
      console.error('Error executing payout:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      name: '',
      date: new Date().toISOString().split('T')[0],
      country: 'CH',
      iban: '',
      account: '',
      fromAccount: '',
      toAccount: '',
    });
  };

  const openModal = (type: TransactionFormType) => {
    setFormType(type);
    resetForm();
    setShowModal(true);
  };

  const getTypeIcon = (type: TransactionTypeEnum) => {
    switch (type) {
      case TransactionTypeEnum.PAYIN:
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case TransactionTypeEnum.PAYOUT:
        return <TrendingDown className="w-5 h-5 text-orange-600" />;
      case TransactionTypeEnum.EXCHANGE:
        return <Repeat className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTypeBg = (type: TransactionTypeEnum) => {
    switch (type) {
      case TransactionTypeEnum.PAYIN:
        return 'bg-green-50';
      case TransactionTypeEnum.PAYOUT:
        return 'bg-orange-50';
      case TransactionTypeEnum.EXCHANGE:
        return 'bg-blue-50';
    }
  };

  const getAccountInfo = (transaction: Transaction) => {
    if (typeof transaction.account === 'object' && 'id' in transaction.account) {
      return `Account #${transaction.account.id}`;
    }
    return 'Unknown Account';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Transactions</h1>
          <p className="text-slate-600">Manage payments and exchanges</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => openModal('payin')}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <TrendingUp className="w-5 h-5" />
            Pay In
          </button>
          <button
            onClick={() => openModal('payout')}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            <TrendingDown className="w-5 h-5" />
            Pay Out
          </button>
          <button
            onClick={() => openModal('exchange')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Repeat className="w-5 h-5" />
            Exchange
          </button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <ArrowRightLeft className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No transactions yet</h3>
          <p className="text-slate-600 mb-6">Create your first transaction to get started</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => openModal('payin')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <TrendingUp className="w-5 h-5" />
              Pay In
            </button>
            <button
              onClick={() => openModal('payout')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              <TrendingDown className="w-5 h-5" />
              Pay Out
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getTypeBg(transaction.type)}`}>
                        {getTypeIcon(transaction.type)}
                        <span className="text-sm font-medium capitalize">{transaction.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{transaction.name}</div>
                      <div className="text-sm text-slate-500">{transaction.iban}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {getAccountInfo(transaction)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-semibold ${
                        transaction.type === TransactionTypeEnum.PAYIN ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {transaction.type === TransactionTypeEnum.PAYIN ? '+' : '-'}
                        {parseFloat(transaction.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.executed ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Executed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!transaction.executed && transaction.type === TransactionTypeEnum.PAYOUT && (
                        <button
                          onClick={() => handleExecutePayout(transaction.id)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Execute
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                {formType === 'payin' && 'Create Pay In'}
                {formType === 'payout' && 'Create Pay Out'}
                {formType === 'exchange' && 'Create Exchange'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formType === 'exchange' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      From Account
                    </label>
                    <select
                      required
                      value={formData.fromAccount}
                      onChange={(e) => setFormData({ ...formData, fromAccount: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select account</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={`/api/accounts/${account.id}`}>
                          Account #{account.id} ({account.currency} - {account.balance})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      To Account
                    </label>
                    <select
                      required
                      value={formData.toAccount}
                      onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select account</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={`/api/accounts/${account.id}`}>
                          Account #{account.id} ({account.currency} - {account.balance})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Account
                    </label>
                    <select
                      required
                      value={formData.account}
                      onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select account</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={`/api/accounts/${account.id}`}>
                          Account #{account.id} ({account.currency} - {account.balance})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={2}
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="CH"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        IBAN
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={34}
                        value={formData.iban}
                        onChange={(e) => setFormData({ ...formData, iban: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="CH93 0076 2011 6238 5295 7"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Transaction description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-colors font-medium ${
                    formType === 'payin'
                      ? 'bg-green-600 hover:bg-green-700'
                      : formType === 'payout'
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Create Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
