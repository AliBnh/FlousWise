import { useState } from 'react';
import type { Income, AdditionalIncomeSource } from '../../types/finance';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
}

export default function IncomeForm({ data, onNext, onPrevious }: Props) {
  const [formData, setFormData] = useState<Income>(data.income || {});
  const [additionalSources, setAdditionalSources] = useState<AdditionalIncomeSource[]>(
    data.income?.additionalSources || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalIncome = calculateTotalIncome();
    onNext({ income: { ...formData, additionalSources, totalMonthlyIncome: totalIncome } });
  };

  const calculateTotalIncome = () => {
    const salary = formData.monthlyNetSalary || 0;
    const business = formData.averageMonthlyIncome || 0;
    const additional = additionalSources.reduce((sum, source) => sum + (source.monthlyAmount || 0), 0);
    return salary + business + additional;
  };

  const updateField = (field: keyof Income, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const addIncomeSource = () => {
    setAdditionalSources([
      ...additionalSources,
      { sourceName: '', monthlyAmount: 0, frequency: 'Regular monthly', stability: 'Stable' },
    ]);
  };

  const removeIncomeSource = (index: number) => {
    setAdditionalSources(additionalSources.filter((_, i) => i !== index));
  };

  const updateIncomeSource = (index: number, field: keyof AdditionalIncomeSource, value: any) => {
    const updated = [...additionalSources];
    updated[index] = { ...updated[index], [field]: value };
    setAdditionalSources(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
            2
          </span>
          Primary Income
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employment Status <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.employmentStatus || ''}
              onChange={(e) => updateField('employmentStatus', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            >
              <option value="">Select...</option>
              <option value="Employed full-time">Employed full-time</option>
              <option value="Employed part-time">Employed part-time</option>
              <option value="Self-employed/Freelancer">Self-employed/Freelancer</option>
              <option value="Business owner">Business owner</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Student">Student</option>
              <option value="Retired">Retired</option>
            </select>
          </div>

          {(formData.employmentStatus === 'Employed full-time' || formData.employmentStatus === 'Employed part-time') && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Occupation <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.occupation || ''}
                    onChange={(e) => updateField('occupation', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="Software Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Net Salary (MAD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.monthlyNetSalary || ''}
                    onChange={(e) => updateField('monthlyNetSalary', parseFloat(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="9000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Income Stability <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <select
                    value={formData.incomeStability || ''}
                    onChange={(e) => updateField('incomeStability', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  >
                    <option value="">Select...</option>
                    <option value="Very stable">Very stable (same amount monthly)</option>
                    <option value="Mostly stable">Mostly stable (varies ±10%)</option>
                    <option value="Variable">Variable (seasonal/commission)</option>
                    <option value="Highly variable">Highly variable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Hours/Week <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="168"
                    value={formData.workHoursPerWeek || ''}
                    onChange={(e) => updateField('workHoursPerWeek', parseFloat(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="40"
                  />
                </div>
              </div>
            </div>
          )}

          {(formData.employmentStatus === 'Self-employed/Freelancer' || formData.employmentStatus === 'Business owner') && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Type <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.occupation || ''}
                    onChange={(e) => updateField('occupation', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="Web Design Agency"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Average Monthly Income (MAD) <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.averageMonthlyIncome || ''}
                    onChange={(e) => updateField('averageMonthlyIncome', parseFloat(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="12000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Income Variability <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <select
                    value={formData.incomeStability || ''}
                    onChange={(e) => updateField('incomeStability', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  >
                    <option value="">Select...</option>
                    <option value="Variable">High</option>
                    <option value="Mostly stable">Medium</option>
                    <option value="Very stable">Low</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Income Sources */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Additional Income Sources</h3>
          <button
            type="button"
            onClick={addIncomeSource}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
          >
            <span className="text-xl mr-1">+</span> Add Source
          </button>
        </div>

        {additionalSources.map((source, index) => (
          <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-gray-700">Source #{index + 1}</span>
              <button
                type="button"
                onClick={() => removeIncomeSource(index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <input
                  type="text"
                  required
                  value={source.sourceName}
                  onChange={(e) => updateIncomeSource(index, 'sourceName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="e.g., Freelance web design, Rental property"
                />
              </div>

              <div>
                <input
                  type="number"
                  required
                  min="0"
                  value={source.monthlyAmount}
                  onChange={(e) => updateIncomeSource(index, 'monthlyAmount', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Monthly amount (MAD)"
                />
              </div>

              <div>
                <select
                  value={source.frequency}
                  onChange={(e) => updateIncomeSource(index, 'frequency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                >
                  <option value="Regular monthly">Regular monthly</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Irregular">Irregular</option>
                  <option value="One-time">One-time</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {additionalSources.length === 0 && (
          <p className="text-gray-500 text-sm italic text-center py-4">
            No additional income sources. Click "Add Source" to add one.
          </p>
        )}
      </div>

      {/* Total Income Display */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total Monthly Income</span>
          <span className="text-2xl font-bold text-primary-600">{calculateTotalIncome().toFixed(0)} MAD</span>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={onPrevious}
          className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          ← Previous
        </button>
        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
        >
          Next: Dependents →
        </button>
      </div>
    </form>
  );
}
