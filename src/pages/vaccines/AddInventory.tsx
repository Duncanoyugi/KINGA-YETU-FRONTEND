import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAddInventoryMutation } from '@/features/vaccines/vaccinesAPI';
import { useGetVaccinesQuery } from '@/features/vaccines/vaccinesAPI';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { Select } from '@/components/common/Select';
import { Spinner } from '@/components/common/Spinner';

interface AddStockFormData {
  vaccineId: string;
  quantity: number;
  batchNumber: string;
  expiryDate: string;
  manufacturer: string;
}

export const AddInventory: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [addInventory] = useAddInventoryMutation();
  const { data: vaccinesData, isLoading: vaccinesLoading } = useGetVaccinesQuery({});
  
  const [formData, setFormData] = React.useState<AddStockFormData>({
    vaccineId: '',
    quantity: 0,
    batchNumber: '',
    expiryDate: '',
    manufacturer: '',
  });
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const facilityId = (user as any)?.healthWorker?.facility?.id || (user as any)?.healthWorker?.facilityId;

  const handleChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!facilityId) {
      showToast({ type: 'error', message: 'Please set up your facility first' });
      return;
    }
    
    if (!formData.vaccineId || !formData.quantity || !formData.batchNumber || !formData.expiryDate) {
      showToast({ type: 'error', message: 'Please fill all required fields' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addInventory({
        vaccineId: formData.vaccineId,
        facilityId,
        quantity: Number(formData.quantity),
        batchNumber: formData.batchNumber,
        expiryDate: formData.expiryDate,
        manufacturer: formData.manufacturer || undefined,
      }).unwrap();
      
      showToast({ type: 'success', message: 'Stock added successfully!' });
      navigate('/dashboard/health-worker/inventory');
    } catch (error: any) {
      showToast({ type: 'error', message: error?.data?.message || 'Failed to add stock' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const vaccineOptions = vaccinesData?.data?.map((v: any) => ({
    value: v.id,
    label: v.name,
  })) || [];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeftIcon className="h-5 w-5" />}
        onClick={() => navigate('/dashboard/health-worker/inventory')}
        className="mb-4"
      >
        Back to Inventory
      </Button>
      
      <Card>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Add Vaccine Stock
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Select
            label="Vaccine"
            name="vaccineId"
            value={formData.vaccineId}
            onChange={(val) => handleChange('vaccineId', val)}
            options={[{ value: '', label: 'Select a vaccine' }, ...vaccineOptions]}
            required
            disabled={vaccinesLoading}
          />
          
          <Input
            label="Quantity (doses)"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            required
            min={1}
          />
          
          <Input
            label="Batch Number"
            name="batchNumber"
            value={formData.batchNumber}
            onChange={handleInputChange}
            required
            placeholder="e.g., LOT123456"
          />
          
          <Input
            label="Expiry Date"
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={handleInputChange}
            required
          />
          
          <Input
            label="Manufacturer"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleInputChange}
            placeholder="e.g., Pfizer, Moderna"
          />

          <div className="sticky bottom-0 -mx-6 border-t border-gray-200 bg-green px-6 pt-4 pb-2">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/dashboard/health-worker/inventory')}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !facilityId}
              className="w-full sm:w-auto shadow-sm"
            >
              {isSubmitting ? <Spinner size="sm" /> : 'Submit Stock'}
            </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddInventory;
