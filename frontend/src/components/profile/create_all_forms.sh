#!/bin/bash

# Variable Expenses Form
cat > VariableExpensesForm.tsx << 'EOF'
import { useState } from 'react';
import type { VariableExpenses } from '../../types/finance';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
}

export default function VariableExpensesForm({ data, onNext, onPrevious }: Props) {
  const [formData, setFormData] = useState<VariableExpenses>(data.variableExpenses || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = Object.values(formData).reduce((sum, val) => sum + (parseFloat(val as any) || 0), 0);
    onNext({ variableExpenses: { ...formData, totalVariableExpenses: total } });
  };

  const updateField = (field: keyof VariableExpenses, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const calculateTotal = () => {
    return Object.keys(formData).reduce((sum, key) => {
      if (key !== 'totalVariableExpenses') {
        return sum + (parseFloat(formData[key as keyof VariableExpenses] as any) || 0);
      }
      return sum;
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🍔 Food & Groceries</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="number" min="0" value={formData.groceryShopping || ''} onChange={(e) => updateField('groceryShopping', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Grocery Shopping (MAD)" />
          <input type="number" min="0" value={formData.eatingOut || ''} onChange={(e) => updateField('eatingOut', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Eating Out (MAD)" />
          <input type="number" min="0" value={formData.coffee || ''} onChange={(e) => updateField('coffee', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Coffee/Café (MAD)" />
          <input type="number" min="0" value={formData.foodDelivery || ''} onChange={(e) => updateField('foodDelivery', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Food Delivery (MAD)" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💊 Healthcare</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="number" min="0" value={formData.medications || ''} onChange={(e) => updateField('medications', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Medications (MAD)" />
          <input type="number" min="0" value={formData.doctorVisits || ''} onChange={(e) => updateField('doctorVisits', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Doctor Visits (MAD)" />
          <input type="number" min="0" value={formData.pharmacyItems || ''} onChange={(e) => updateField('pharmacyItems', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Pharmacy Items (MAD)" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎭 Entertainment & Personal</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="number" min="0" value={formData.moviesEvents || ''} onChange={(e) => updateField('moviesEvents', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Movies/Events (MAD)" />
          <input type="number" min="0" value={formData.hobbies || ''} onChange={(e) => updateField('hobbies', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Hobbies (MAD)" />
          <input type="number" min="0" value={formData.sportsGym || ''} onChange={(e) => updateField('sportsGym', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Sports/Gym (MAD)" />
          <input type="number" min="0" value={formData.clothingSpending || ''} onChange={(e) => updateField('clothingSpending', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Clothing (MAD)" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎓 Education</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="number" min="0" value={formData.schoolFees || ''} onChange={(e) => updateField('schoolFees', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="School Fees (MAD)" />
          <input type="number" min="0" value={formData.schoolSupplies || ''} onChange={(e) => updateField('schoolSupplies', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="School Supplies (MAD)" />
          <input type="number" min="0" value={formData.tutoring || ''} onChange={(e) => updateField('tutoring', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Tutoring (MAD)" />
          <input type="number" min="0" value={formData.onlineCourses || ''} onChange={(e) => updateField('onlineCourses', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Online Courses (MAD)" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎁 Social & Other</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="number" min="0" value={formData.gifts || ''} onChange={(e) => updateField('gifts', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Gifts (MAD)" />
          <input type="number" min="0" value={formData.charityDonations || ''} onChange={(e) => updateField('charityDonations', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Charity (MAD)" />
          <input type="number" min="0" value={formData.familyGatherings || ''} onChange={(e) => updateField('familyGatherings', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Family Gatherings (MAD)" />
        </div>
      </div>

      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total Variable Expenses</span>
          <span className="text-2xl font-bold text-primary-600">{calculateTotal().toFixed(0)} MAD</span>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button type="button" onClick={onPrevious} className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-medium">← Previous</button>
        <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg">Next: Debts →</button>
      </div>
    </form>
  );
}
EOF

echo "Created VariableExpensesForm"
