import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useVaccineInventory, useVaccineAlerts } from '@/features/vaccines/vaccinesHooks';
import type { VaccineInventory as VaccineInventoryItem, StockAlert } from '@/features/vaccines/vaccinesTypes';
import { useAuth } from '@/hooks/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Table } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';
import { Tabs } from '@/components/common/Tabs';
import { formatDate, formatExpiryStatus } from '@/utils/dateHelpers';
import { ROUTES } from '@/routing/routes';

export const VaccineInventory: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isHealthWorker } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const {
    inventory,
    isLoading,
    getLowStockItems,
    getExpiringItems,
    getExpiredItems,
  } = useVaccineInventory();

  const { getCriticalAlerts, getWarningAlerts } = useVaccineAlerts();

  const tabs = [
    { id: 'inventory', label: 'Current Stock' },
    { id: 'low-stock', label: 'Low Stock' },
    { id: 'expiring', label: 'Expiring Soon' },
    { id: 'transactions', label: 'Transactions' },
  ];

  const lowStockItems = getLowStockItems(10);
  const expiringItems = getExpiringItems(30);
  const expiredItems = getExpiredItems();
  const criticalAlerts = getCriticalAlerts();
  const warningAlerts = getWarningAlerts();

  const columns = [
    {
      header: 'Vaccine',
      accessor: (row: any) => (
        <div>
          <div className="font-medium text-gray-900">{row.vaccine?.name}</div>
          <div className="text-sm text-gray-500">Batch: {row.batchNumber}</div>
        </div>
      ),
    },
    {
      header: 'Facility',
      accessor: (row: any) => row.facility?.name || 'N/A',
    },
    {
      header: 'Quantity',
      accessor: (row: any) => (
        <div>
          <div className="font-medium">{row.quantity} doses</div>
          {row.quantity <= (row.minimumStock || 10) && (
            <Badge variant="warning" size="sm">Low Stock</Badge>
          )}
        </div>
      ),
    },
    {
      header: 'Expiry Date',
      accessor: (row: any) => {
        const { status, days } = formatExpiryStatus(row.expiryDate);
        const variant = status === 'expired' ? 'danger' : status === 'expiring' ? 'warning' : 'success';
        
        return (
          <div>
            <div>{formatDate(row.expiryDate)}</div>
            <Badge variant={variant} size="sm">
              {status === 'expired' ? 'Expired' : `${days} days left`}
            </Badge>
          </div>
        );
      },
    },
    {
      header: 'Manufacturer',
      accessor: (row: any) => row.manufacturer || 'N/A',
    },
    {
      header: 'Actions',
      accessor: (row: any) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(ROUTES.BATCH_TRACKING.replace(':id', row.batchNumber));
            }}
          >
            Track
          </Button>
          {isHealthWorker && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // Handle record usage
              }}
            >
              Record Usage
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Filter inventory based on search
  const filteredInventory = inventory.filter((item: VaccineInventoryItem) =>
    item.vaccine?.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    item.batchNumber?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Display appropriate items based on tab
  const displayItems = () => {
    switch (activeTab) {
      case 'low-stock':
        return lowStockItems;
      case 'expiring':
        return expiringItems;
      default:
        return filteredInventory;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vaccine Inventory</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage vaccine stock across all facilities
          </p>
        </div>
        {(isAdmin || isHealthWorker) && (
          <div className="flex space-x-3">
            <Button
              variant="outline"
              leftIcon={<DocumentArrowDownIcon className="h-5 w-5" />}
              onClick={() => {/* Handle export */}}
            >
              Export
            </Button>
            <Button
              variant="primary"
              leftIcon={<PlusIcon className="h-5 w-5" />}
              onClick={() => navigate(ROUTES.ADD_INVENTORY)}
            >
              Add Stock
            </Button>
          </div>
        )}
      </div>

      {/* Alerts */}
      {(criticalAlerts.length > 0 || warningAlerts.length > 0) && (
        <div className="space-y-3">
          {criticalAlerts.map((alert: StockAlert) => (
            <Alert
              key={alert.vaccineId}
              variant="danger"
              title="Critical Alert"
              message={`${alert.vaccineName} - ${alert.batchNumber}: ${alert.status}`}
            />
          ))}
          {warningAlerts.map((alert: StockAlert) => (
            <Alert
              key={alert.vaccineId}
              variant="warning"
              title="Warning"
              message={`${alert.vaccineName} - ${alert.batchNumber}: ${alert.status}`}
            />
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-primary-600">{inventory.length}</div>
            <div className="text-sm text-gray-600">Total Batches</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
            <div className="text-sm text-gray-600">Low Stock Items</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-orange-600">{expiringItems.length}</div>
            <div className="text-sm text-gray-600">Expiring Soon</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-red-600">{expiredItems.length}</div>
            <div className="text-sm text-gray-600">Expired</div>
          </Card.Body>
        </Card>
      </div>

      {/* Search and Tabs */}
      <Card>
        <Card.Body>
          <div className="space-y-4">
            <Input
              placeholder="Search by vaccine name or batch number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />}
            />

            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </Card.Body>
      </Card>

      {/* Inventory Table */}
      <Card>
        <Card.Body>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <Table
              data={displayItems()}
              columns={columns}
              onRowClick={(row) => navigate(ROUTES.BATCH_TRACKING.replace(':id', row.batchNumber))}
              emptyMessage={`No ${activeTab.replace('-', ' ')} items found`}
            />
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default VaccineInventory;