import { useState } from 'react';
import type { MoroccanSpecificInfo } from '../../types/finance';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
}

export default function MoroccanInfoForm({ data, onNext, onPrevious }: Props) {
  const [formData, setFormData] = useState<MoroccanSpecificInfo>(data.moroccanSpecificInfo || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ moroccanSpecificInfo: formData });
  };

  const updateField = (field: keyof MoroccanSpecificInfo, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🇲🇦 Government Programs</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input type="checkbox" checked={formData.receivesRAMED || false} onChange={(e) => updateField('receivesRAMED', e.target.checked)} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
            <span className="text-gray-700">I receive RAMED (free healthcare)</span>
          </label>

          <label className="flex items-center space-x-3">
            <input type="checkbox" checked={formData.receivesTayssir || false} onChange={(e) => updateField('receivesTayssir', e.target.checked)} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
            <span className="text-gray-700">My children receive Tayssir (education support)</span>
          </label>

          <label className="flex items-center space-x-3">
            <input type="checkbox" checked={formData.appliedForINDH || false} onChange={(e) => updateField('appliedForINDH', e.target.checked)} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
            <span className="text-gray-700">I have applied for INDH programs</span>
          </label>

          <label className="flex items-center space-x-3">
            <input type="checkbox" checked={formData.awareOfHousingSubsidies || false} onChange={(e) => updateField('awareOfHousingSubsidies', e.target.checked)} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
            <span className="text-gray-700">I am aware of government housing subsidies</span>
          </label>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🕌 Religious Obligations <span className="text-sm text-gray-500 font-normal">(Optional)</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="number" min="0" value={formData.regularCharity || ''} onChange={(e) => updateField('regularCharity', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Regular charity/month (MAD)" />
          <input type="number" min="0" value={formData.zakat || ''} onChange={(e) => updateField('zakat', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Zakat/year (MAD)" />
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button type="button" onClick={onPrevious} className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-medium">← Previous</button>
        <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg">Next: Risk Profile →</button>
      </div>
    </form>
  );
}
