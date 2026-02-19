import { PERMISSIONS, USER_ROLES } from './constants';

// Permission type
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Role-permission mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [USER_ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.CHILD_CREATE,
    PERMISSIONS.CHILD_READ,
    PERMISSIONS.CHILD_UPDATE,
    PERMISSIONS.CHILD_DELETE,
    PERMISSIONS.VACCINE_CREATE,
    PERMISSIONS.VACCINE_READ,
    PERMISSIONS.VACCINE_UPDATE,
    PERMISSIONS.VACCINE_DELETE,
    PERMISSIONS.REPORT_GENERATE,
    PERMISSIONS.REPORT_READ,
    PERMISSIONS.REPORT_EXPORT,
    PERMISSIONS.FACILITY_MANAGE,
    PERMISSIONS.AUDIT_VIEW,
  ],
  
  [USER_ROLES.COUNTY_ADMIN]: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.CHILD_CREATE,
    PERMISSIONS.CHILD_READ,
    PERMISSIONS.CHILD_UPDATE,
    PERMISSIONS.VACCINE_READ,
    PERMISSIONS.VACCINE_UPDATE,
    PERMISSIONS.REPORT_GENERATE,
    PERMISSIONS.REPORT_READ,
    PERMISSIONS.REPORT_EXPORT,
    PERMISSIONS.FACILITY_MANAGE,
  ],
  
  [USER_ROLES.FACILITY_ADMIN]: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.CHILD_CREATE,
    PERMISSIONS.CHILD_READ,
    PERMISSIONS.CHILD_UPDATE,
    PERMISSIONS.VACCINE_READ,
    PERMISSIONS.VACCINE_UPDATE,
    PERMISSIONS.REPORT_GENERATE,
    PERMISSIONS.REPORT_READ,
  ],
  
  [USER_ROLES.HEALTH_WORKER]: [
    PERMISSIONS.CHILD_CREATE,
    PERMISSIONS.CHILD_READ,
    PERMISSIONS.CHILD_UPDATE,
    PERMISSIONS.VACCINE_READ,
    PERMISSIONS.REPORT_READ,
  ],
  
  [USER_ROLES.PARENT]: [
    PERMISSIONS.CHILD_READ,
    PERMISSIONS.CHILD_UPDATE,
    PERMISSIONS.REPORT_READ,
  ],
};

// Check if user has permission
export const hasPermission = (
  userRole: UserRole | null | undefined,
  permission: Permission | Permission[]
): boolean => {
  if (!userRole) return false;
  
  // Super admin has all permissions
  if (userRole === USER_ROLES.SUPER_ADMIN) return true;
  
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  
  const permissions = Array.isArray(permission) ? permission : [permission];
  return permissions.every(p => userPermissions.includes(p));
};

// Check if user has any of the permissions
export const hasAnyPermission = (
  userRole: UserRole | null | undefined,
  permissions: Permission[]
): boolean => {
  if (!userRole) return false;
  if (userRole === USER_ROLES.SUPER_ADMIN) return true;
  
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.some(p => userPermissions.includes(p));
};

// Check if user has role
export const hasRole = (
  userRole: UserRole | null | undefined,
  role: UserRole | UserRole[]
): boolean => {
  if (!userRole) return false;
  
  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(userRole);
};

// Check if user has any of the roles
export const hasAnyRole = (
  userRole: UserRole | null | undefined,
  roles: UserRole[]
): boolean => {
  if (!userRole) return false;
  return roles.includes(userRole);
};

// Get user permissions
export const getUserPermissions = (userRole: UserRole | null | undefined): Permission[] => {
  if (!userRole) return [];
  if (userRole === USER_ROLES.SUPER_ADMIN) return Object.values(PERMISSIONS);
  return ROLE_PERMISSIONS[userRole] || [];
};

// Check if user can access resource
export const canAccessResource = (
  userRole: UserRole | null | undefined,
  resourceUserId?: string,
  currentUserId?: string,
  resourceFacilityId?: string,
  userFacilityId?: string
): boolean => {
  if (!userRole) return false;
  
  // Super admin and admin can access everything
  if (userRole === USER_ROLES.SUPER_ADMIN || userRole === USER_ROLES.ADMIN) {
    return true;
  }
  
  // Parents can only access their own resources
  if (userRole === USER_ROLES.PARENT) {
    return resourceUserId === currentUserId;
  }
  
  // Health workers can access resources in their facility
  if (userRole === USER_ROLES.HEALTH_WORKER) {
    return resourceFacilityId === userFacilityId;
  }
  
  // County admins can access resources in their county
  if (userRole === USER_ROLES.COUNTY_ADMIN) {
    // This would need county information
    return true; // Placeholder
  }
  
  // Facility admins can access resources in their facility
  if (userRole === USER_ROLES.FACILITY_ADMIN) {
    return resourceFacilityId === userFacilityId;
  }
  
  return false;
};

// Get role hierarchy (higher index = more permissions)
export const getRoleHierarchy = (role: UserRole): number => {
  const hierarchy: Record<UserRole, number> = {
    [USER_ROLES.SUPER_ADMIN]: 100,
    [USER_ROLES.ADMIN]: 80,
    [USER_ROLES.COUNTY_ADMIN]: 60,
    [USER_ROLES.FACILITY_ADMIN]: 40,
    [USER_ROLES.HEALTH_WORKER]: 20,
    [USER_ROLES.PARENT]: 10,
  };
  
  return hierarchy[role] || 0;
};

// Check if role has higher or equal permissions
export const hasHigherOrEqualRole = (role1: UserRole, role2: UserRole): boolean => {
  return getRoleHierarchy(role1) >= getRoleHierarchy(role2);
};

// Get role display name
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    [USER_ROLES.PARENT]: 'Parent',
    [USER_ROLES.HEALTH_WORKER]: 'Health Worker',
    [USER_ROLES.ADMIN]: 'Administrator',
    [USER_ROLES.SUPER_ADMIN]: 'Super Administrator',
    [USER_ROLES.COUNTY_ADMIN]: 'County Administrator',
    [USER_ROLES.FACILITY_ADMIN]: 'Facility Administrator',
  };
  
  return roleNames[role] || role;
};

// Get role color
export const getRoleColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    [USER_ROLES.SUPER_ADMIN]: 'purple',
    [USER_ROLES.ADMIN]: 'red',
    [USER_ROLES.COUNTY_ADMIN]: 'orange',
    [USER_ROLES.FACILITY_ADMIN]: 'blue',
    [USER_ROLES.HEALTH_WORKER]: 'green',
    [USER_ROLES.PARENT]: 'gray',
  };
  
  return colors[role] || 'default';
};

// Get role icon
export const getRoleIcon = (role: UserRole): string => {
  const icons: Record<UserRole, string> = {
    [USER_ROLES.SUPER_ADMIN]: 'crown',
    [USER_ROLES.ADMIN]: 'shield',
    [USER_ROLES.COUNTY_ADMIN]: 'map',
    [USER_ROLES.FACILITY_ADMIN]: 'building',
    [USER_ROLES.HEALTH_WORKER]: 'stethoscope',
    [USER_ROLES.PARENT]: 'user',
  };
  
  return icons[role] || 'user';
};

// Filter users by permission
export const filterUsersByPermission = <T extends { role: UserRole }>(
  users: T[],
  permission: Permission
): T[] => {
  return users.filter(user => hasPermission(user.role, permission));
};

// Get accessible routes for role
export const getAccessibleRoutes = (userRole: UserRole | null | undefined): string[] => {
  if (!userRole) return ['/login', '/register', '/forgot-password'];
  
  const routes: Record<UserRole, string[]> = {
    [USER_ROLES.SUPER_ADMIN]: ['/', '/dashboard', '/admin', '/users', '/facilities', '/reports', '/analytics', '/settings'],
    [USER_ROLES.ADMIN]: ['/', '/dashboard', '/users', '/facilities', '/reports', '/analytics', '/settings'],
    [USER_ROLES.COUNTY_ADMIN]: ['/', '/dashboard', '/facilities', '/reports', '/analytics'],
    [USER_ROLES.FACILITY_ADMIN]: ['/', '/dashboard', '/children', '/vaccines', '/reports'],
    [USER_ROLES.HEALTH_WORKER]: ['/', '/dashboard', '/children', '/vaccines', '/appointments'],
    [USER_ROLES.PARENT]: ['/', '/dashboard', '/my-children', '/appointments', '/reminders'],
  };
  
  return routes[userRole] || ['/'];
};