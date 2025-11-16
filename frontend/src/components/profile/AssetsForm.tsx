import { useState } from 'react';
import type { AssetsAndSavings } from '../../types/finance';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
}

export default function AssetsForm({ data, onNext, onPrevious }: Props) {
  const [formData, setFormData] = useState<AssetsAndSavings>(data.assetsAndSavings || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = calculateTotalAssets();
    const debts = data.debts?.reduce((sum: number, debt: any) => sum + (debt.totalAmountOwed || 0), 0) || 0;
    onNext({ assetsAndSavings: { ...formData, totalAssets: total, netWorth: total - debts } });
  };

  const updateField = (field: keyof AssetsAndSavings, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const calculateTotalAssets = () => {
    const fields: (keyof AssetsAndSavings)[] = [
      'bankAccountBalance', 'cashAtHome', 'emergencyFund', 'otherLiquidSavings',
      'carValue', 'motorcycleValue', 'propertyValue', 'laptopValue', 'phoneValue',
      'goldJewelryValue', 'otherValuableItemsValue', 'stocks', 'mutualFunds',
      'businessInvestment', 'cryptocurrency', 'otherInvestmentsValue'
    ];
    return fields.reduce((sum, field) => sum + (parseFloat(formData[field] as any) || 0), 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Current Savings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="number" min="0" value={formData.bankAccountBalance || ''} onChange={(e) => updateField('bankAccountBalance', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Bank account balance (MAD)" />
          <input type="number" min="0" value={formData.cashAtHome || ''} onChange={(e) => updateField('cashAtHome', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Cash at home (MAD)" />
          <input type="number" min="0" value={formData.emergencyFund || ''} onChange={(e) => updateField('emergencyFund', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Emergency fund (MAD)" />
          <input type="number" min="0" value={formData.otherLiquidSavings || ''} onChange={(e) => updateField('otherLiquidSavings', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Other liquid savings (MAD)" />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🚗 Vehicles & Property</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="number" min="0" value={formData.carValue || ''} onChange={(e) => updateField('carValue', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Car value (MAD)" />
          <input type="number" min="0" value={formData.motorcycleValue || ''} onChange={(e) => updateField('motorcycleValue', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Motorcycle value (MAD)" />
          <input type="number" min="0" value={formData.propertyValue || ''} onChange={(e) => updateField('propertyValue', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Property value (MAD)" />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💎 Valuables & Electronics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="number" min="0" value={formData.laptopValue || ''} onChange={(e) => updateField('laptopValue', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Laptop (MAD)" />
          <input type="number" min="0" value={formData.phoneValue || ''} onChange={(e) => updateField('phoneValue', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Phone (MAD)" />
          <input type="number" min="0" value={formData.goldJewelryValue || ''} onChange={(e) => updateField('goldJewelryValue', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Gold/Jewelry (MAD)" />
          <input type="number" min="0" value={formData.otherValuableItemsValue || ''} onChange={(e) => updateField('otherValuableItemsValue', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Other valuables (MAD)" />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Investments</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="number" min="0" value={formData.stocks || ''} onChange={(e) => updateField('stocks', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Stocks/Shares (MAD)" />
          <input type="number" min="0" value={formData.mutualFunds || ''} onChange={(e) => updateField('mutualFunds', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Mutual funds (MAD)" />
          <input type="number" min="0" value={formData.businessInvestment || ''} onChange={(e) => updateField('businessInvestment', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Business investment (MAD)" />
          <input type="number" min="0" value={formData.cryptocurrency || ''} onChange={(e) => updateField('cryptocurrency', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Cryptocurrency (MAD)" />
          <input type="number" min="0" value={formData.otherInvestmentsValue || ''} onChange={(e) => updateField('otherInvestmentsValue', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Other investments (MAD)" />
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total Assets</span>
          <span className="text-2xl font-bold text-green-600">{calculateTotalAssets().toFixed(0)} MAD</span>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button type="button" onClick={onPrevious} className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-medium">← Previous</button>
        <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg">Next: Skills →</button>
      </div>
    </form>
  );
}
