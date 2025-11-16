import { useState } from 'react';
import type { Skills } from '../../types/finance';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
}

export default function SkillsForm({ data, onNext, onPrevious }: Props) {
  const [formData, setFormData] = useState<Skills>(data.skills || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ skills: formData });
  };

  const updateField = (field: keyof Skills, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎓 Education & Experience</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select value={formData.highestEducationLevel || ''} onChange={(e) => updateField('highestEducationLevel', e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition">
            <option value="">Highest education level...</option>
            <option value="Primary school">Primary school</option>
            <option value="Secondary school">Secondary school</option>
            <option value="Baccalaureate">Baccalaureate</option>
            <option value="University diploma/license">University diploma/license</option>
            <option value="Master's degree">Master's degree</option>
            <option value="PhD">PhD</option>
            <option value="Professional certification">Professional certification</option>
            <option value="Self-taught">Self-taught</option>
          </select>

          <input type="number" min="0" max="50" value={formData.yearsOfExperience || ''} onChange={(e) => updateField('yearsOfExperience', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Years of work experience" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💼 Skills</h3>
        <textarea value={formData.otherMonetizableSkills || ''} onChange={(e) => updateField('otherMonetizableSkills', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" rows={4} placeholder="List your skills that could generate income (e.g., Web development, Graphic design, Teaching, Driving, etc.)" />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⏰ Side Income Potential</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="number" min="0" max="168" value={formData.availableTimePerWeek || ''} onChange={(e) => updateField('availableTimePerWeek', parseFloat(e.target.value))} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" placeholder="Available time per week (hours)" />

          <select value={formData.willingnessForSideIncome || ''} onChange={(e) => updateField('willingnessForSideIncome', e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition">
            <option value="">Willingness for side income...</option>
            <option value="Very interested">Very interested</option>
            <option value="Somewhat interested">Somewhat interested</option>
            <option value="Only if necessary">Only if necessary</option>
            <option value="Not interested">Not interested</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button type="button" onClick={onPrevious} className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-medium">← Previous</button>
        <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg">Next: Goals →</button>
      </div>
    </form>
  );
}
