import { useState } from 'react';

interface Props {
  data: any;
  onNext?: (data: any) => void;
  onPrevious: () => void;
  onSubmit?: (data: any) => void;
  loading?: boolean;
}

export default function AdditionalContextForm({ data, onPrevious, onSubmit, loading }: Props) {
  const [additionalContext, setAdditionalContext] = useState(data.additionalContext || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ additionalContext });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">📝 Additional Context</h3>
        <p className="text-sm text-gray-600 mb-4">
          Is there anything specific about your financial situation that wasn't covered? (Optional)
        </p>

        <textarea
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
          rows={8}
          placeholder="Examples:
• Special medical conditions requiring ongoing expenses
• Legal obligations (alimony, child support)
• Upcoming major life changes (marriage, moving, career change)
• Irregular income patterns or seasonal work
• Cultural/religious practices affecting finances
• Family dynamics impacting money decisions
• Previous financial mistakes you want to avoid
• Specific fears or concerns
• Anything else you think is relevant"
        />
      </div>

      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Privacy Notice:</strong> Your data is encrypted and stored securely. You can delete it anytime from your profile settings.
        </p>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={onPrevious}
          disabled={loading}
          className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-medium disabled:opacity-50"
        >
          ← Previous
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-10 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {loading ? 'Creating Profile...' : '✓ Create Profile'}
        </button>
      </div>
    </form>
  );
}
