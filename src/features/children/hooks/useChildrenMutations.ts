import { useCallback } from 'react';
import { useAppDispatch } from '@/app/store/hooks';
import { useCreateChildMutation,
  useUpdateChildMutation,
  useDeleteChildMutation,
} from '../childrenAPI';
import { addChild as addChildAction, updateChild as updateChildAction, removeChild as removeChildAction } from '../childrenSlice';
import type { CreateChildRequest, UpdateChildRequest, Child } from '../childrenTypes';
import { toast } from 'react-hot-toast';

export const useChildrenMutations = () => {
  const dispatch = useAppDispatch();
  const [createChildMutation] = useCreateChildMutation();
  const [updateChildMutation] = useUpdateChildMutation();
  const [deleteChildMutation] = useDeleteChildMutation();

  const addChild = useCallback(async (childData: CreateChildRequest) => {
    try {
      const result = await createChildMutation(childData).unwrap();
      const newChild = result as Child;
      dispatch(addChildAction(newChild));
      toast.success('Child registered successfully');
      return newChild;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const message = err.data?.message || 'Failed to register child';
      toast.error(message);
      throw error;
    }
  }, [dispatch, createChildMutation]);

  const updateChild = useCallback(async (childId: string, childData: UpdateChildRequest) => {
    try {
      const result = await updateChildMutation({ id: childId, data: childData }).unwrap();
      const updatedChild = result as Child;
      dispatch(updateChildAction(updatedChild));
      toast.success('Child updated successfully');
      return updatedChild;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const message = err.data?.message || 'Failed to update child';
      toast.error(message);
      throw error;
    }
  }, [dispatch, updateChildMutation]);

  const deleteChild = useCallback(async (childId: string) => {
    try {
      await deleteChildMutation(childId).unwrap();
      dispatch(removeChildAction(childId));
      toast.success('Child deleted successfully');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const message = err.data?.message || 'Failed to delete child';
      toast.error(message);
      throw error;
    }
  }, [dispatch, deleteChildMutation]);

  return {
    addChild,
    updateChild,
    deleteChild,
  };
};
