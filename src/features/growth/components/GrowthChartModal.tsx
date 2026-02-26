import React, { useState } from 'react';
import { XMarkIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

interface GrowthChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  childName: string;
  childId: string;
  onAddRecord: (recordData: any) => void;
  isLoading?: boolean;
}

export const GrowthChartModal: React.FC<GrowthChartModalProps> = ({
  isOpen,
  onClose,
  childName,
  childId,
  onAddRecord,
  isLoading
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    measurementDate: '',
    weight: '',
    height: '',
    headCircumference: '',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRecord({
      childId,
      measurementDate: formData.measurementDate,
      weight: parseFloat(formData.weight),
      height: formData.height ? parseFloat(formData.height) : undefined,
      headCircumference: formData.headCircumference ? parseFloat(formData.headCircumference) : undefined,
      notes: formData.notes,
    });
    setShowAddForm(false);
    setFormData({
      measurementDate: '',
      weight: '',
      height: '',
      headCircumference: '',
      notes: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-2xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-medium text-gray-900">Growth Chart</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <p className="text-sm text-gray-500 mb-4">{childName}</p>

          {!showAddForm ? (
            <div className="text-center py-8">
              <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ChartBarIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No growth records yet</p>
              <Button variant="primary" onClick={() => setShowAddForm(true)}>
                Add Growth Record
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Measurement Date"
                  type="date"
                  value={formData.measurementDate}
                  onChange={(e) => setFormData({ ...formData, measurementDate: e.target.value })}
                  required
                />
                <Input
                  label="Weight (kg)"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Height (cm)"
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
                <Input
                  label="Head Circumference (cm)"
                  type="number"
                  step="0.1"
                  value={formData.headCircumference}
                  onChange={(e) => setFormData({ ...formData, headCircumference: e.target.value })}
                />
              </div>

              <Input
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes..."
              />

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" type="button" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" loading={isLoading}>
                  Save Record
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
