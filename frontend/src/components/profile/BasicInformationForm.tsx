import { useState } from 'react';
import type { BasicInformation } from '../../types/finance';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onPrevious?: () => void;
}

export default function BasicInformationForm({ data, onNext }: Props) {
  const [formData, setFormData] = useState<BasicInformation>(
    data.basicInformation || {}
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ basicInformation: formData });
  };

  const updateField = (field: keyof BasicInformation, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
            1
          </span>
          Personal Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.fullName || ''}
              onChange={(e) => updateField('fullName', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="Ahmed Bennani"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="18"
              max="100"
              value={formData.age || ''}
              onChange={(e) => updateField('age', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="28"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <select
              value={formData.gender || ''}
              onChange={(e) => updateField('gender', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.city || ''}
              onChange={(e) => updateField('city', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            >
              <option value="">Select city...</option>
              <option value="Casablanca">Casablanca</option>
              <option value="Rabat">Rabat</option>
              <option value="Marrakech">Marrakech</option>
              <option value="Fes">Fes</option>
              <option value="Tangier">Tangier</option>
              <option value="Agadir">Agadir</option>
              <option value="Meknes">Meknes</option>
              <option value="Oujda">Oujda</option>
              <option value="Kenitra">Kenitra</option>
              <option value="Tetouan">Tetouan</option>
              <option value="Safi">Safi</option>
              <option value="El Jadida">El Jadida</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Living Situation</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Living Status <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.livingStatus || ''}
              onChange={(e) => updateField('livingStatus', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            >
              <option value="">Select...</option>
              <option value="Living alone">Living alone</option>
              <option value="With family (parents/siblings)">With family (parents/siblings)</option>
              <option value="With spouse only">With spouse only</option>
              <option value="With spouse and children">With spouse and children</option>
              <option value="With roommates">With roommates</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Housing <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.housing || ''}
              onChange={(e) => updateField('housing', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            >
              <option value="">Select...</option>
              <option value="Own home (no mortgage)">Own home (no mortgage)</option>
              <option value="Own home (paying mortgage)">Own home (paying mortgage)</option>
              <option value="Renting">Renting</option>
              <option value="Living with family (no rent)">Living with family (no rent)</option>
            </select>
          </div>

          {(formData.housing === 'Renting' || formData.housing === 'Own home (paying mortgage)') && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Payment (MAD) <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.monthlyPayment || ''}
                onChange={(e) => updateField('monthlyPayment', parseFloat(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                placeholder="2500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t">
        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
        >
          Next: Income →
        </button>
      </div>
    </form>
  );
}
