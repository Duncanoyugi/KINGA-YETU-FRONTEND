import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { Tabs } from '@/components/common/Tabs';
import { ROUTES } from '@/routing/routes';

interface Facility {
  id: string;
  name: string;
  type: string;
  code: string;
  mflCode: string;
  county: string;
  subCounty: string;
  ward: string;
  address: string;
  phone: string;
  email: string;
  owner: string;
  level: string;
  status: 'OPERATIONAL' | 'NON_OPERATIONAL' | 'UNDER_CONSTRUCTION';
  bedCapacity?: number;
  staffCount: number;
  services: string[];
  isActive: boolean;
  createdAt: string;
}

const mockFacilities: Facility[] = [
  {
    id: 'fac1',
    name: 'Nairobi Hospital',
    type: 'HOSPITAL',
    code: 'NH001',
    mflCode: '12345',
    county: 'Nairobi',
    subCounty: 'Westlands',
    ward: 'Westlands',
    address: '123 Hospital Rd',
    phone: '+254207123456',
    email: 'info@nairobihospital.ke',
    owner: 'PRIVATE',
    level: 'LEVEL_4',
    status: 'OPERATIONAL',
    bedCapacity: 500,
    staffCount: 120,
    services: ['IMMUNIZATION', 'MATERNAL', 'EMERGENCY'],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fac2',
    name: 'Kenyatta National Hospital',
    type: 'HOSPITAL',
    code: 'KNH001',
    mflCode: '12346',
    county: 'Nairobi',
    subCounty: 'Kamukunji',
    ward: 'Ngara',
    address: '456 Hospital Ave',
    phone: '+254202723456',
    email: 'info@knh.ke',
    owner: 'GOVERNMENT',
    level: 'LEVEL_6',
    status: 'OPERATIONAL',
    bedCapacity: 1800,
    staffCount: 450,
    services: ['IMMUNIZATION', 'MATERNAL', 'EMERGENCY', 'HIV', 'TB'],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fac3',
    name: 'Mombasa Hospital',
    type: 'HOSPITAL',
    code: 'MH001',
    mflCode: '12347',
    county: 'Mombasa',
    subCounty: 'Mvita',
    ward: 'Mvita',
    address: '789 Coast Rd',
    phone: '+254417123456',
    email: 'info@mombasahospital.ke',
    owner: 'PRIVATE',
    level: 'LEVEL_4',
    status: 'OPERATIONAL',
    bedCapacity: 300,
    staffCount: 85,
    services: ['IMMUNIZATION', 'MATERNAL', 'EMERGENCY'],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const facilityTypes = [
  { value: 'HOSPITAL', label: 'Hospital' },
  { value: 'HEALTH_CENTER', label: 'Health Center' },
  { value: 'DISPENSARY', label: 'Dispensary' },
  { value: 'CLINIC', label: 'Clinic' },
  { value: 'MOBILE_CLINIC', label: 'Mobile Clinic' },
];

const counties = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu',
  'Kiambu', 'Machakos', 'Meru', 'Kakamega', 'Kilifi',
];

export const FacilityManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin } = useAuth();
  const { showToast } = useToast();
  
  const [facilities, setFacilities] = useState<Facility[]>(mockFacilities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [activeTab, setActiveTab] = useState('list');

  const tabs = [
    { id: 'list', label: 'Facilities List' },
    { id: 'map', label: 'Map View' },
    { id: 'stats', label: 'Statistics' },
  ];

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.mflCode.includes(searchTerm) ||
                         facility.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCounty = selectedCounty === 'all' || facility.county === selectedCounty;
    const matchesType = selectedType === 'all' || facility.type === selectedType;
    
    return matchesSearch && matchesCounty && matchesType;
  });

  const handleDeleteFacility = async () => {
    if (!selectedFacility) return;

    try {
      setFacilities(facilities.filter(f => f.id !== selectedFacility.id));
      showToast({
        type: 'success',
        message: 'Facility deleted successfully',
      });
      setShowDeleteModal(false);
      setSelectedFacility(null);
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to delete facility',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
        return <Badge variant="success">Operational</Badge>;
      case 'NON_OPERATIONAL':
        return <Badge variant="danger">Non-Operational</Badge>;
      case 'UNDER_CONSTRUCTION':
        return <Badge variant="warning">Under Construction</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Facility Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage health facilities and their details
          </p>
        </div>
        {(isAdmin || isSuperAdmin) && (
          <div className="mt-4 sm:mt-0">
            <Button
              variant="primary"
              leftIcon={<PlusIcon className="h-5 w-5" />}
              onClick={() => navigate(ROUTES.ADD_FACILITY)}
            >
              Add New Facility
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-primary-600">{facilities.length}</div>
            <div className="text-sm text-gray-600">Total Facilities</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {facilities.filter(f => f.status === 'OPERATIONAL').length}
            </div>
            <div className="text-sm text-gray-600">Operational</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {facilities.reduce((sum, f) => sum + f.staffCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Staff</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {facilities.reduce((sum, f) => sum + (f.bedCapacity || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Beds</div>
          </Card.Body>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* List View */}
      {activeTab === 'list' && (
        <>
          {/* Filters */}
          <Card>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search by name, MFL code, or facility code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <select
                    value={selectedCounty}
                    onChange={(e) => setSelectedCounty(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="all">All Counties</option>
                    {counties.map(county => (
                      <option key={county} value={county}>{county}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="all">All Types</option>
                    {facilityTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Facilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map((facility) => (
              <Card
                key={facility.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(ROUTES.FACILITY_DETAILS.replace(':id', facility.id))}
              >
                <Card.Body>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <BuildingOfficeIcon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{facility.name}</h3>
                        <p className="text-sm text-gray-500">MFL: {facility.mflCode}</p>
                      </div>
                    </div>
                    {getStatusBadge(facility.status)}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {facility.county} - {facility.subCounty}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      {facility.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      {facility.email}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {facility.services.slice(0, 3).map(service => (
                      <Badge key={service} variant="default" size="sm">
                        {service}
                      </Badge>
                    ))}
                    {facility.services.length > 3 && (
                      <Badge variant="default" size="sm">
                        +{facility.services.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-500">Staff:</span>{' '}
                      <span className="font-medium">{facility.staffCount}</span>
                    </div>
                    {facility.bedCapacity && (
                      <div>
                        <span className="text-gray-500">Beds:</span>{' '}
                        <span className="font-medium">{facility.bedCapacity}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Level:</span>{' '}
                      <span className="font-medium">{facility.level}</span>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  {(isAdmin || isSuperAdmin) && (
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(ROUTES.EDIT_FACILITY.replace(':id', facility.id));
                        }}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFacility(facility);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Map View (Placeholder) */}
      {activeTab === 'map' && (
        <Card>
          <Card.Body className="h-96 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Map View</h3>
              <p className="mt-2 text-sm text-gray-500">
                Interactive map showing facility locations will be displayed here.
                (Integration with mapping library required)
              </p>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Statistics View */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <Card.Header title="Facilities by County" />
            <Card.Body>
              <div className="space-y-3">
                {counties.slice(0, 5).map(county => {
                  const count = facilities.filter(f => f.county === county).length;
                  const percentage = (count / facilities.length) * 100;
                  
                  return (
                    <div key={county}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{county}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header title="Facilities by Type" />
            <Card.Body>
              <div className="space-y-3">
                {facilityTypes.map(type => {
                  const count = facilities.filter(f => f.type === type.value).length;
                  const percentage = (count / facilities.length) * 100;
                  
                  return (
                    <div key={type.value}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{type.label}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedFacility(null);
        }}
        title="Delete Facility"
        size="sm"
      >
        <Modal.Body>
          <p className="text-gray-600">
            Are you sure you want to delete {selectedFacility?.name}? This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedFacility(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteFacility}
            >
              Delete Facility
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FacilityManagement;