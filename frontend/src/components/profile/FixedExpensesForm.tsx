import { useState } from 'react';
import type { FixedExpenses, Subscription } from '../../types/finance';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
}

export default function FixedExpensesForm({ data, onNext, onPrevious }: Props) {
  const [formData, setFormData] = useState<FixedExpenses>(data.fixedExpenses || {});
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(
    data.fixedExpenses?.subscriptions || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = calculateTotal();
    onNext({ fixedExpenses: { ...formData, subscriptions, totalFixedExpenses: total } });
  };

  const calculateTotal = () => {
    const fields = [
      'rent', 'propertyTax', 'homeInsurance', 'electricity', 'water', 'gas',
      'internet', 'fixedPhoneLine', 'mobilePhonePlan', 'additionalPhones',
      'carLoanPayment', 'carInsurance', 'monthlyFuel', 'publicTransportPass',
      'parking', 'maintenanceReserve', 'healthInsurance', 'lifeInsurance',
      'otherInsurance', 'otherFixedExpensesAmount'
    ];
    
    const sum = fields.reduce((acc, field) => acc + (parseFloat(formData[field as keyof FixedExpenses] as any) || 0), 0);
    const subsTotal = subscriptions.reduce((acc, sub) => acc + (sub.monthlyCost || 0), 0);
    return sum + subsTotal;
  };

  const updateField = (field: keyof FixedExpenses, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const addSubscription = () => {
    setSubscriptions([...subscriptions, { serviceName: '', monthlyCost: 0 }]);
  };

  const removeSubscription = (index: number) => {
    setSubscriptions(subscriptions.filter((_, i) => i !== index));
  };

  const updateSubscription = (index: number, field: keyof Subscription, value: any) => {
    const updated = [...subscriptions];
    updated[index] = { ...updated[index], [field]: value };
    setSubscriptions(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Housing */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏠 Housing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            min="0"
            value={formData.rent || ''}
            onChange={(e) => updateField('rent', parseFloat(e.target.value))}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
            placeholder="Rent/Mortgage (MAD)"
          />
          <input
            type="number"
            min="0"
            value={formData.propertyTax || ''}
            onChange={(e) => updateField('propertyTax', parseFloat(e.target.value))}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
            placeholder="Property Tax (MAD)"
          />
          <input
            type="number"
            min="0"
            value={formData.homeInsurance || ''}
            onChange={(e) => updateField('homeInsurance', parseFloat(e.target.value))}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
            placeholder="Home Insurance (MAD)"
          />
        </div>
      </div>

      {/* Utilities */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Utilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="number"
            min="0"
            value={formData.electricity || ''}
            onChange={(e) => updateField('electricity', parseFloat(e.target.value))}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
            placeholder="Electricity (MAD)"
          />
          <input
            type="number"
            min="0"
            value={formData.water || ''}
            onChange={(e) => updateField('water', parseFloat(e.target.value))}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
            placeholder="Water (MAD)"
          />
          <input
            type="number"
            min="0"
            value={formData.gas || ''}
            onChange={(e) => updateField('gas', parseFloat(e.target.value))}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
            placeholder="Gas (MAD)"
          />
          <input
            type="number"
            min="0"
            value={formData.internet || ''}
            onChange={(e) => updateField('internet', parseFloat(e.target.value))}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
            placeholder="Internet (MAD)"
          />
        </div>
      </div>

      {/* Communication */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📱 Communication</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            min="0"
            value={formData.mobilePhonePlan || ''}
            onChange={(e) => updateField('mobilePhonePlan', parseFloat(e.target.value))}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
            placeholder="Mobile Plan (MAD)"
          />
          <input
            type="number"
            min="0"
            value={formData.fixedPhoneLine || ''}
            onChange={(e) => updateField('fixedPhoneLine', parseFloat(e.target.value))}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
            placeholder="Fixed Line (MAD)"
          />
          <input
            type="number"
            min="0"
            value={formData.additionalPhones || ''}
            onChange={(e) => updateField('additionalPhones', parseFloat(e.target.value))}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
            placeholder="Additional Phones (MAD)"
          />
        </div>
      </div>

      {/* Transportation */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🚗 Transportation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            min="0"
            value={formData.carLoanPayment || ''}
            onChange={(e) => updateField('carLoanPayment', parseFloat(e.target.value))}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
            placeholder="Car Loan (MAD)"
          />
          <input
            type="number"
            min="0"
            value={formData.carInsurance || ''}
            onChange={(e) => updateField('carInsurance', parseFloat(e.target.value))}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
            placeholder="Car Insurance (MAD)"
          />
          <input
            type="number"
            min="0"
            value={formData.monthlyFuel || ''}
            onChange={(e) => updateField('monthlyFuel', parseFloat(e.target.value))}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
            placeholder="Fuel (MAD)"
          />
          <input
            type="number"
            min="0"
            value={formData.publicTransportPass || ''}
            onChange={(e) => updateField('publicTransportPass', parseFloat(e.target.value))}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
            placeholder="Public Transport (MAD)"
          />
          <input
            type="number"
            min="0"
            value={formData.parking || ''}
            onChange={(e) => updateField('parking', parseFloat(e.target.value))}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
            placeholder="Parking (MAD)"
          />
        </div>
      </div>

      {/* Insurance */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🛡️ Insurance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            min="0"
            value={formData.healthInsurance || ''}
            onChange={(e) => updateField('healthInsurance', parseFloat(e.target.value))}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
            placeholder="Health Insurance (MAD)"
          />
          <input
            type="number"
            min="0"
            value={formData.lifeInsurance || ''}
            onChange={(e) => updateField('lifeInsurance', parseFloat(e.target.value))}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
            placeholder="Life Insurance (MAD)"
          />
          <input
            type="number"
            min="0"
            value={formData.otherInsurance || ''}
            onChange={(e) => updateField('otherInsurance', parseFloat(e.target.value))}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
            placeholder="Other Insurance (MAD)"
          />
        </div>
      </div>

      {/* Subscriptions */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📺 Subscriptions</h3>
          <button
            type="button"
            onClick={addSubscription}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            + Add Subscription
          </button>
        </div>

        {subscriptions.map((sub, index) => (
          <div key={index} className="flex gap-3 mb-3 items-start">
            <input
              type="text"
              required
              value={sub.serviceName}
              onChange={(e) => updateSubscription(index, 'serviceName', e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
              placeholder="Service name (e.g., Netflix)"
            />
            <input
              type="number"
              required
              min="0"
              value={sub.monthlyCost}
              onChange={(e) => updateSubscription(index, 'monthlyCost', parseFloat(e.target.value))}
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
              placeholder="Cost (MAD)"
            />
            <button
              type="button"
              onClick={() => removeSubscription(index)}
              className="text-red-600 hover:text-red-700 px-3 py-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total Fixed Expenses</span>
          <span className="text-2xl font-bold text-primary-600">{calculateTotal().toFixed(0)} MAD</span>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button type="button" onClick={onPrevious} className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-medium">
          ← Previous
        </button>
        <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg">
          Next: Variable Expenses →
        </button>
      </div>
    </form>
  );
}
