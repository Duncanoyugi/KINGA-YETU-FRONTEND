import React, { useState, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/hooks/useAuth';
import { useGetParentByIdQuery, useUpdateParentProfileMutation } from '@/features/parents/parentsAPI';
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
  
  // Use profile endpoint instead of dashboard (dashboard has issues)
  const { data: parentData, isLoading: parentLoading, refetch } = useGetParentByIdQuery(
    parentId,
    { skip: !parentId }
  );
  
  const [updateParentProfileMutation] = useUpdateParentProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    emergencyContact: '',
    emergencyPhone: '',
    county: '',
    subCounty: '',
    address: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load parent data
  useEffect(() => {
    if (parentData) {
      setFormData({
        emergencyContact: parentData.emergencyContact || '',
        emergencyPhone: parentData.emergencyPhone || '',
        county: parentData.county || '',
        subCounty: parentData.subCounty || '',
        address: parentData.address || '',
      });
    }
  }, [parentData]);

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
    emergencyContact: formData.emergencyContact || parentData?.emergencyContact || '',
    emergencyPhone: formData.emergencyPhone || parentData?.emergencyPhone || '',
    county: formData.county || parentData?.county || '',
    subCounty: formData.subCounty || parentData?.subCounty || '',
    address: formData.address || parentData?.address || '',
  };

  if (!isLayoutOnly && parentLoading) {
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
                        if (parentData) {
                          setFormData({
                            emergencyContact: parentData.emergencyContact || '',
                            emergencyPhone: parentData.emergencyPhone || '',
                            county: parentData.county || '',
                            subCounty: parentData.subCounty || '',
                            address: parentData.address || '',
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

          {/* Location Card */}
          <Card className="mb-6">
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-lg font-semibold">Location</h3>
            </div>
            <div className="p-6 space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="County"
                      value={formData.county}
                      onChange={(e) => handleInputChange('county', e.target.value)}
                      placeholder="e.g., Tharaka-Nithi"
                    />
                    <Input
                      label="Sub-County"
                      value={formData.subCounty}
                      onChange={(e) => handleInputChange('subCounty', e.target.value)}
                      placeholder="e.g., Chuka"
                    />
                  </div>
                  <div>
                    <Input
                      label="Address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Physical address"
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">County</label>
                    <p className="text-gray-900 font-medium">{formData.county || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Sub-County</label>
                    <p className="text-gray-900 font-medium">{formData.subCounty || 'Not set'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                    <p className="text-gray-900 font-medium">{formData.address || 'Not set'}</p>
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
              {parentData?.children && parentData.children.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parentData.children.map((child: any) => (
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