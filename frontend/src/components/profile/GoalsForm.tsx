import { useState } from 'react';
import type { FinancialGoal } from '../../types/finance';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
}

export default function GoalsForm({ data, onNext, onPrevious }: Props) {
  const [goals, setGoals] = useState<FinancialGoal[]>(data.financialGoals || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ financialGoals: goals });
  };

  const addGoal = () => {
    setGoals([...goals, { goalName: '', goalType: '', targetAmount: 0, priority: 'Medium' }]);
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const updateGoal = (index: number, field: keyof FinancialGoal, value: any) => {
    const updated = [...goals];
    updated[index] = { ...updated[index], [field]: value };
    setGoals(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">🎯 Financial Goals</h3>
          <p className="text-sm text-gray-600">What do you want to achieve financially?</p>
        </div>
        <button type="button" onClick={addGoal} className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center">
          <span className="text-xl mr-1">+</span> Add Goal
        </button>
      </div>

      {goals.map((goal, index) => (
        <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-700">Goal #{index + 1}</span>
            <button type="button" onClick={() => removeGoal(index)} className="text-red-600 hover:text-red-700 text-sm">Remove</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" required value={goal.goalName} onChange={(e) => updateGoal(index, 'goalName', e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Goal name (e.g., Emergency fund, Buy apartment)" />

            <select required value={goal.goalType} onChange={(e) => updateGoal(index, 'goalType', e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition">
              <option value="">Goal type...</option>
              <option value="Emergency fund">Emergency fund</option>
              <option value="Debt elimination">Debt elimination</option>
              <option value="Major purchase">Major purchase (home, car)</option>
              <option value="Education fund">Education fund</option>
              <option value="Business startup">Business startup</option>
              <option value="Retirement">Retirement</option>
              <option value="Travel">Travel</option>
              <option value="Wedding">Wedding</option>
              <option value="Other">Other</option>
            </select>

            <input type="number" required min="0" value={goal.targetAmount} onChange={(e) => updateGoal(index, 'targetAmount', parseFloat(e.target.value))} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Target amount (MAD)" />

            <input type="date" value={goal.targetDate || ''} onChange={(e) => updateGoal(index, 'targetDate', e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" />

            <input type="number" min="0" value={goal.currentProgress || ''} onChange={(e) => updateGoal(index, 'currentProgress', parseFloat(e.target.value))} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Current progress (MAD)" />

            <select required value={goal.priority} onChange={(e) => updateGoal(index, 'priority', e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition">
              <option value="Critical">Critical (within 6 months)</option>
              <option value="High">High (6-12 months)</option>
              <option value="Medium">Medium (1-3 years)</option>
              <option value="Low">Low (3+ years)</option>
            </select>

            <input type="text" value={goal.whyImportant || ''} onChange={(e) => updateGoal(index, 'whyImportant', e.target.value)} className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Why is this important to you?" />
          </div>
        </div>
      ))}

      {goals.length === 0 && (
        <p className="text-gray-500 text-sm italic text-center py-6 bg-gray-50 rounded-lg">No goals added. Click "Add Goal" to set your financial targets.</p>
      )}

      <div className="flex justify-between pt-6 border-t">
        <button type="button" onClick={onPrevious} className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-medium">← Previous</button>
        <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg">Next: Moroccan Info →</button>
      </div>
    </form>
  );
}
