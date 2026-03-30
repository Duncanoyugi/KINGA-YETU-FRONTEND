import React, { useState, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/hooks/useAuth';
import { useParentDashboard } from '@/features/parents/parentsHooks';
import { useUpdateParentProfileMutation } from '@/features/parents/parentsAPI';
import { toast } from 'react-hot-toast';
import { 
  UserCircleIcon,
  PhoneIcon,
  PencilIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface ParentProfileProps {
  isLayoutOnly?: boolean;
}

export const ParentProfile: React.FC<ParentProfileProps> = ({ isLayoutOnly = false }) => {
  const { user } = useAuth();
  const parentId = user?.parentProfile?.id || '';
  const { dashboard, isLoading: dashboardLoading, refetch } = useParentDashboard(parentId);
  const [updateParentProfileMutation] = useUpdateParentProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    emergencyContact: '',
    emergencyPhone: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load parent data from dashboard
  useEffect(() => {
    if (dashboard?.parent) {
      setFormData({
        emergencyContact: dashboard.parent.emergencyContact || '',
        emergencyPhone: dashboard.parent.emergencyPhone || '',
      });
    }
  }, [dashboard?.parent]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!parentId) {
      toast.error('Parent profile not found');
      return;
    }

    setIsSaving(true);
    try {
      await updateParentProfileMutation(formData).unwrap();
      toast.success('Profile updated successfully');
      setIsEditing(false);
      // Refresh dashboard data
      refetch();
    } catch (error: any) {
      console.error('Error updating parent:', error);
      toast.error(error?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Parent info from user object
  const parentInfo = {
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    emergencyContact: formData.emergencyContact || dashboard?.parent?.emergencyContact || '',
    emergencyPhone: formData.emergencyPhone || dashboard?.parent?.emergencyPhone || '',
  };

  if (!isLayoutOnly && dashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
              <p className="text-gray-500">Manage your personal information and emergency contacts</p>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                leftIcon={<PencilIcon className="h-5 w-5" />}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
              >
                Edit Profile
              </Button>
            )}
          </div>

          {/* Personal Information Card */}
          <Card className="mb-6">
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              <UserCircleIcon className="h-6 w-6 text-gray-400" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <p className="text-gray-900 font-medium">{parentInfo.fullName || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <p className="text-gray-900 font-medium">{parentInfo.email || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                  <p className="text-gray-900 font-medium">{parentInfo.phoneNumber || '-'}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Emergency Contact Card */}
          <Card className="mb-6">
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              <PhoneIcon className="h-6 w-6 text-gray-400" />
              <h3 className="text-lg font-semibold">Emergency Contact</h3>
            </div>
            <div className="p-6 space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Emergency Contact Name"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      placeholder="Enter emergency contact name"
                    />
                    <Input
                      label="Emergency Phone Number"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      placeholder="+254700000000"
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form to original values
                        if (dashboard?.parent) {
                          setFormData({
                            emergencyContact: dashboard.parent.emergencyContact || '',
                            emergencyPhone: dashboard.parent.emergencyPhone || '',
                          });
                        }
                      }}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      loading={isSaving}
                      leftIcon={<CheckIcon className="h-5 w-5" />}
                      className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
                    >
                      Save Changes
                    </Button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Contact Name</label>
                    <p className="text-gray-900 font-medium">{parentInfo.emergencyContact || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Contact Phone</label>
                    <p className="text-gray-900 font-medium">{parentInfo.emergencyPhone || 'Not set'}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Children Summary */}
          <Card>
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">My Children</h3>
            </div>
            <div className="p-6">
              {dashboard?.children && dashboard.children.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboard.children.map((child) => (
                    <div key={child.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {child.firstName} {child.middleName} {child.lastName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            DOB: {child.dateOfBirth ? new Date(child.dateOfBirth).toLocaleDateString() : '-'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          child.gender === 'MALE' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                        }`}>
                          {child.gender}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No children registered yet</p>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ParentProfile;