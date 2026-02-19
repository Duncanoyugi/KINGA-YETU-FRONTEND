import { useMemo, useCallback } from 'react';
import { useAuth } from './useAuth';

type Permission = string;
type Resource = string;

interface PermissionCheckOptions {
  requireAll?: boolean;
  resource?: Resource;
  ownerId?: string;
}

/**
 * Hook for checking user permissions with advanced features
 */
export const usePermissions = () => {
  const { user, isSuperAdmin } = useAuth();

  // Permission sets by role (simplified - would come from backend)
  const rolePermissions = useMemo(() => ({
    SUPER_ADMIN: ['*'],
    ADMIN: [
      'users:read', 'users:write', 'users:delete',
      'facilities:read', 'facilities:write', 'facilities:delete',
      'reports:read', 'reports:generate', 'reports:export',
      'analytics:read', 'analytics:export',
      'system:configure', 'audit:read',
    ],
    COUNTY_ADMIN: [
      'users:read',
      'facilities:read', 'facilities:write',
      'reports:read', 'reports:generate',
      'analytics:read',
    ],
    FACILITY_ADMIN: [
      'users:read',
      'children:read', 'children:write',
      'vaccines:read', 'vaccines:write',
      'reports:read',
    ],
    HEALTH_WORKER: [
      'children:read', 'children:write',
      'vaccines:read', 'vaccines:administer',
      'reports:read',
    ],
    PARENT: [
      'children:read', 'children:write',
    ],
  }), []);

  // Get user's permissions
  const userPermissions = useMemo(() => {
    if (!user) return [];
    if (isSuperAdmin) return ['*'];
    return rolePermissions[user.role as keyof typeof rolePermissions] || [];
  }, [user, isSuperAdmin, rolePermissions]);

  // Check if user has a specific permission
  const can = useCallback((
    permission: Permission | Permission[],
    options: PermissionCheckOptions = {}
  ): boolean => {
    if (!user) return false;
    if (isSuperAdmin) return true;

    const { requireAll = true, resource, ownerId } = options;
    const permissions = Array.isArray(permission) ? permission : [permission];

    // Check each permission
    const hasPermissions = permissions.map(p => {
      // Handle wildcard
      if (userPermissions.includes('*')) return true;
      
      // Handle resource ownership
      if (resource && ownerId && user.id === ownerId) {
        // Owners might have special permissions
        if (p.includes('write') || p.includes('delete')) {
          return userPermissions.includes(`${resource}:own`) || userPermissions.includes(p);
        }
      }
      
      return userPermissions.includes(p);
    });

    return requireAll ? hasPermissions.every(Boolean) : hasPermissions.some(Boolean);
  }, [user, isSuperAdmin, userPermissions]);

  // Check if user can access a resource
  const canAccess = useCallback((
    resource: string,
    action: 'create' | 'read' | 'update' | 'delete' | 'manage' = 'read',
    ownerId?: string
  ): boolean => {
    if (!user) return false;
    if (isSuperAdmin) return true;

    // Check ownership-based access
    if (ownerId && user.id === ownerId) {
      return can([`${resource}:own`, `${resource}:${action}`], { requireAll: false });
    }

    return can(`${resource}:${action}`);
  }, [user, isSuperAdmin, can]);

  // Get all permissions for debugging
  const getAllPermissions = useCallback((): string[] => {
    return userPermissions;
  }, [userPermissions]);

  // Check if user has role (one or more)
  const hasAnyRole = useCallback((role: string | string[]): boolean => {
    if (!user) return false;
    if (isSuperAdmin) return true;
    
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  }, [user, isSuperAdmin]);

  return {
    can,
    canAccess,
    hasAnyRole,
    getAllPermissions,
    isSuperAdmin,
    userRole: user?.role,
    userId: user?.id,
  };
};

export default usePermissions;