import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hook for getting auth state
import { useMemo } from 'react';

export const useAuthState = () => {
  const auth = useAppSelector((state) => state.auth);
  
  return useMemo(() => ({
    user: auth.user,
    isAuthenticated: !!auth.user,
    isLoading: auth.isLoading,
    error: auth.error,
    token: auth.token,
  }), [auth]);
};

// Custom hook for getting user role checks
export const useUserRoles = () => {
  const { user } = useAuthState();
  
  return useMemo(() => ({
    isParent: user?.role === 'PARENT',
    isHealthWorker: user?.role === 'HEALTH_WORKER',
    isAdmin: user?.role === 'ADMIN',
    isSuperAdmin: user?.role === 'SUPER_ADMIN',
    role: user?.role,
  }), [user]);
};

// Custom hook for getting current child context (if any)
export const useCurrentChild = () => {
  return useAppSelector((state) => state.children?.currentChild);
};

// Custom hook for getting facility context (for health workers)
export const useFacilityContext = () => {
  const { user } = useAuthState();
  
  return useMemo(() => ({
    facilityId: user?.healthWorker?.facilityId,
    facilityName: user?.healthWorker?.facility?.name,
  }), [user]);
};