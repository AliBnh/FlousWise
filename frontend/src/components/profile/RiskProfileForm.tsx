import { useState } from 'react';
import type { RiskProfile } from '../../types/finance';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
}

export default function RiskProfileForm({ data, onNext, onPrevious }: Props) {
  const [formData, setFormData] = useState<RiskProfile>(data.riskProfile || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ riskProfile: formData });
  };

  const updateField = (field: keyof RiskProfile, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Financial Personality</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">How do you feel about risk?</label>
            <select value={formData.riskTolerance || ''} onChange={(e) => updateField('riskTolerance', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition">
              <option value="">Select...</option>
              <option value="Very conservative">Very conservative (safety first, no risks)</option>
              <option value="Somewhat conservative">Somewhat conservative (calculated risks only)</option>
              <option value="Moderate">Moderate (balanced approach)</option>
              <option value="Somewhat aggressive">Somewhat aggressive (willing to take risks)</option>
              <option value="Very aggressive">Very aggressive (maximize returns)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Financial stress level</label>
            <select value={formData.financialStressLevel || ''} onChange={(e) => updateField('financialStressLevel', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition">
              <option value="">Select...</option>
              <option value="Extremely stressed">Extremely stressed about money daily</option>
              <option value="Often worried">Often worried about finances</option>
              <option value="Sometimes concerned">Sometimes concerned</option>
              <option value="Rarely worried">Rarely worried</option>
              <option value="Financially comfortable">Financially comfortable</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Biggest financial fear</label>
            <textarea value={formData.biggestFinancialFear || ''} onChange={(e) => updateField('biggestFinancialFear', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" rows={3} placeholder="What worries you most about money?" />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Financial Habits</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input type="checkbox" checked={formData.trackExpenses || false} onChange={(e) => updateField('trackExpenses', e.target.checked)} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
            <span className="text-gray-700">I track my expenses currently</span>
          </label>

          <label className="flex items-center space-x-3">
            <input type="checkbox" checked={formData.hasBudget || false} onChange={(e) => updateField('hasBudget', e.target.checked)} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
            <span className="text-gray-700">I have a budget</span>
          </label>

          <label className="flex items-center space-x-3">
            <input type="checkbox" checked={formData.savesRegularly || false} onChange={(e) => updateField('savesRegularly', e.target.checked)} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
            <span className="text-gray-700">I save regularly</span>
          </label>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button type="button" onClick={onPrevious} className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-medium">← Previous</button>
        <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg">Next: Final Step →</button>
      </div>
    </form>
  );
}
