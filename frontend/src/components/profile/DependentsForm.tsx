import { useState } from 'react';
import type { Dependents, DependentPerson, Child } from '../../types/finance';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
}

export default function DependentsForm({ data, onNext, onPrevious }: Props) {
  const [formData, setFormData] = useState<Dependents>(data.dependents || {});
  const [dependentsList, setDependentsList] = useState<DependentPerson[]>(
    data.dependents?.dependentsList || []
  );
  const [children, setChildren] = useState<Child[]>(data.dependents?.children || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      dependents: {
        ...formData,
        dependentsList,
        children,
        numberOfDependents: dependentsList.length,
        numberOfChildren: children.length,
      },
    });
  };

  const addDependent = () => {
    setDependentsList([
      ...dependentsList,
      { relationship: '', monthlySupportAmount: 0 },
    ]);
  };

  const removeDependent = (index: number) => {
    setDependentsList(dependentsList.filter((_, i) => i !== index));
  };

  const updateDependent = (index: number, field: keyof DependentPerson, value: any) => {
    const updated = [...dependentsList];
    updated[index] = { ...updated[index], [field]: value };
    setDependentsList(updated);
  };

  const addChild = () => {
    setChildren([...children, { age: 0, schoolType: '' }]);
  };

  const removeChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  const updateChild = (index: number, field: keyof Child, value: any) => {
    const updated = [...children];
    updated[index] = { ...updated[index], [field]: value };
    setChildren(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
            3
          </span>
          People You Support
        </h3>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">Add family members or others you financially support</p>
          <button
            type="button"
            onClick={addDependent}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
          >
            <span className="text-xl mr-1">+</span> Add Dependent
          </button>
        </div>

        {dependentsList.map((dep, index) => (
          <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-3">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-gray-700">Dependent #{index + 1}</span>
              <button
                type="button"
                onClick={() => removeDependent(index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <select
                  required
                  value={dep.relationship}
                  onChange={(e) => updateDependent(index, 'relationship', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                >
                  <option value="">Relationship...</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Extended family">Extended family</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <input
                  type="number"
                  min="0"
                  value={dep.age || ''}
                  onChange={(e) => updateDependent(index, 'age', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Age (optional)"
                />
              </div>

              <div>
                <input
                  type="number"
                  required
                  min="0"
                  value={dep.monthlySupportAmount}
                  onChange={(e) => updateDependent(index, 'monthlySupportAmount', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Monthly support (MAD)"
                />
              </div>

              <div className="md:col-span-3">
                <input
                  type="text"
                  value={dep.notes || ''}
                  onChange={(e) => updateDependent(index, 'notes', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Notes (e.g., School fees, Medical expenses)"
                />
              </div>
            </div>
          </div>
        ))}

        {dependentsList.length === 0 && (
          <p className="text-gray-500 text-sm italic text-center py-6 bg-gray-50 rounded-lg">
            No dependents added. If you support family members financially, click "Add Dependent" above.
          </p>
        )}
      </div>

      {/* Children */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Children Details</h3>
          <button
            type="button"
            onClick={addChild}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
          >
            <span className="text-xl mr-1">+</span> Add Child
          </button>
        </div>

        {children.map((child, index) => (
          <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-gray-700">Child #{index + 1}</span>
              <button
                type="button"
                onClick={() => removeChild(index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <input
                  type="number"
                  required
                  min="0"
                  max="30"
                  value={child.age}
                  onChange={(e) => updateChild(index, 'age', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Age"
                />
              </div>

              <div>
                <select
                  required
                  value={child.schoolType}
                  onChange={(e) => updateChild(index, 'schoolType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                >
                  <option value="">School type...</option>
                  <option value="Public school">Public school</option>
                  <option value="Private school">Private school</option>
                  <option value="University">University</option>
                  <option value="Not in school">Not in school</option>
                </select>
              </div>

              <div>
                <input
                  type="number"
                  min="0"
                  value={child.monthlyEducationCosts || ''}
                  onChange={(e) => updateChild(index, 'monthlyEducationCosts', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Education costs (MAD)"
                />
              </div>
            </div>
          </div>
        ))}

        {children.length === 0 && (
          <p className="text-gray-500 text-sm italic text-center py-6 bg-gray-50 rounded-lg">
            No children added. If you have children, click "Add Child" above.
          </p>
        )}
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
          Next: Fixed Expenses →
        </button>
      </div>
    </form>
  );
}
