import { useState } from 'react';
import type { Debt } from '../../types/finance';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
}

export default function DebtsForm({ data, onNext, onPrevious }: Props) {
  const [debts, setDebts] = useState<Debt[]>(data.debts || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ debts });
  };

  const addDebt = () => {
    setDebts([...debts, { debtType: '', creditorName: '', totalAmountOwed: 0, monthlyPayment: 0, interestRate: 0 }]);
  };

  const removeDebt = (index: number) => {
    setDebts(debts.filter((_, i) => i !== index));
  };

  const updateDebt = (index: number, field: keyof Debt, value: any) => {
    const updated = [...debts];
    updated[index] = { ...updated[index], [field]: value };
    setDebts(updated);
  };

  const totalDebt = debts.reduce((sum, debt) => sum + (debt.totalAmountOwed || 0), 0);
  const totalMonthlyPayment = debts.reduce((sum, debt) => sum + (debt.monthlyPayment || 0), 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">💳 Current Debts</h3>
          <p className="text-sm text-gray-600">Add all loans, credit cards, and other debts</p>
        </div>
        <button type="button" onClick={addDebt} className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center">
          <span className="text-xl mr-1">+</span> Add Debt
        </button>
      </div>

      {debts.map((debt, index) => (
        <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-700">Debt #{index + 1}</span>
            <button type="button" onClick={() => removeDebt(index)} className="text-red-600 hover:text-red-700 text-sm">Remove</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select required value={debt.debtType} onChange={(e) => updateDebt(index, 'debtType', e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition">
              <option value="">Debt type...</option>
              <option value="Bank personal loan">Bank personal loan</option>
              <option value="Car loan">Car loan</option>
              <option value="Mortgage">Mortgage</option>
              <option value="Credit card">Credit card</option>
              <option value="Microfinance loan">Microfinance loan</option>
              <option value="Family loan">Family loan (informal)</option>
              <option value="Store credit">Store credit / Buy now pay later</option>
            </select>

            <input type="text" required value={debt.creditorName} onChange={(e) => updateDebt(index, 'creditorName', e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Creditor (e.g., Attijariwafa Bank)" />

            <input type="number" required min="0" value={debt.totalAmountOwed} onChange={(e) => updateDebt(index, 'totalAmountOwed', parseFloat(e.target.value))} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Total amount owed (MAD)" />

            <input type="number" required min="0" value={debt.monthlyPayment} onChange={(e) => updateDebt(index, 'monthlyPayment', parseFloat(e.target.value))} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Monthly payment (MAD)" />

            <input type="number" min="0" max="100" step="0.1" value={debt.interestRate || ''} onChange={(e) => updateDebt(index, 'interestRate', parseFloat(e.target.value))} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Interest rate (%)" />

            <input type="number" min="0" value={debt.remainingPayments || ''} onChange={(e) => updateDebt(index, 'remainingPayments', parseFloat(e.target.value))} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Remaining payments (months)" />

            <input type="text" value={debt.originalPurpose || ''} onChange={(e) => updateDebt(index, 'originalPurpose', e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Purpose (e.g., Car purchase)" />

            <input type="text" value={debt.notes || ''} onChange={(e) => updateDebt(index, 'notes', e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Notes (optional)" />
          </div>
        </div>
      ))}

      {debts.length === 0 && (
        <p className="text-gray-500 text-sm italic text-center py-6 bg-gray-50 rounded-lg">No debts added. If you have any loans or debts, click "Add Debt" above.</p>
      )}

      {debts.length > 0 && (
        <div className="bg-red-100 border border-red-300 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-700">Total Debt:</span>
              <span className="text-xl font-bold text-red-600 ml-2">{totalDebt.toFixed(0)} MAD</span>
            </div>
            <div>
              <span className="text-sm text-gray-700">Total Monthly Payments:</span>
              <span className="text-xl font-bold text-red-600 ml-2">{totalMonthlyPayment.toFixed(0)} MAD</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-6 border-t">
        <button type="button" onClick={onPrevious} className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-medium">← Previous</button>
        <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg">Next: Assets →</button>
      </div>
    </form>
  );
}
