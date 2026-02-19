import type { UseFormReturn, FieldValues, Path, FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodSchema } from 'zod';

import { useEffect } from 'react';

// Form submission handler with error handling
export const handleFormSubmit = async <T extends FieldValues>(
  data: T,
  onSubmit: (data: T) => Promise<void>,
  form: UseFormReturn<T>,
  options?: {
    resetOnSuccess?: boolean;
  }
) => {
  const { resetOnSuccess = false } = options || {};
  
  try {
    await onSubmit(data);
    if (resetOnSuccess) {
      form.reset();
    }
    return { success: true, data };
  } catch (error) {
    // Handle API validation errors
    if (error && typeof error === 'object' && 'data' in error) {
      const apiError = (error as any).data;
      
      if (apiError.errors) {
        // Set field errors
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          form.setError(field as Path<T>, {
            type: 'server',
            message: Array.isArray(messages) ? messages[0] : String(messages),
          });
        });
      }
    }
    
    return { success: false, error };
  }
};

// Get error message from form state
export const getFormErrorMessage = (
  form: UseFormReturn<any>,
  field: string
): string | undefined => {
  const error = form.formState.errors[field] as FieldError | undefined;
  return error?.message;
};

// Check if form has any errors
export const hasFormErrors = (form: UseFormReturn<any>): boolean => {
  return Object.keys(form.formState.errors).length > 0;
};

// Get first error field
export const getFirstErrorField = (form: UseFormReturn<any>): string | null => {
  const errors = form.formState.errors;
  const fieldNames = Object.keys(errors);
  return fieldNames.length > 0 ? fieldNames[0] : null;
};

// Create form options with Zod schema
export const createFormOptions = <T extends FieldValues>(
  schema: ZodSchema<T>,
  defaultValues?: Partial<T>
) => ({
  resolver: zodResolver(schema as any),
  defaultValues: defaultValues as any,
  mode: 'onBlur' as const,
  reValidateMode: 'onChange' as const,
  shouldFocusError: true,
});

// Format form data before submission
export const formatFormData = <T extends Record<string, any>>(
  data: T,
  options?: {
    trimStrings?: boolean;
    emptyToNull?: boolean;
    removeEmpty?: boolean;
  }
): T => {
  const { trimStrings = true, emptyToNull = false, removeEmpty = false } = options || {};
  
  const formatted: Record<string, unknown> = { ...data };
  
  Object.entries(formatted).forEach(([key, value]) => {
    // Trim strings
    if (trimStrings && typeof value === 'string') {
      formatted[key] = value.trim();
    }
    
    // Convert empty strings to null
    if (emptyToNull && value === '') {
      formatted[key] = null;
    }
    
    // Remove empty values
    if (removeEmpty && (value === '' || value === null || value === undefined)) {
      delete formatted[key];
    }
  });
  
  return formatted as T;
};

// Validate field value against schema
export const validateField = async <T>(
  schema: ZodSchema<T>,
  field: keyof T,
  value: unknown
): Promise<string | null> => {
  try {
    await schema.parseAsync({ [field]: value });
    return null;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Validation failed';
  }
};

// Reset form with confirmation
export const resetFormWithConfirm = (
  form: UseFormReturn<any>,
  message: string = 'Are you sure you want to reset the form?'
): boolean => {
  if (form.formState.isDirty && window.confirm(message)) {
    form.reset();
    return true;
  }
  return false;
};

// Track form changes
export const getFormChanges = <T extends FieldValues>(
  form: UseFormReturn<T>,
  initialValues: T
): Partial<T> => {
  const changes: Partial<T> = {};
  const currentValues = form.getValues();
  
  (Object.keys(currentValues) as Array<keyof T>).forEach((key) => {
    if (JSON.stringify(currentValues[key]) !== JSON.stringify(initialValues[key])) {
      changes[key] = currentValues[key];
    }
  });
  
  return changes;
};

// Check if form has changes
export const hasFormChanges = <T extends FieldValues>(
  form: UseFormReturn<T>,
  initialValues: T
): boolean => {
  return Object.keys(getFormChanges(form, initialValues)).length > 0;
};

// Disable form during submission
export const useFormSubmission = (form: UseFormReturn<any>) => {
  const isSubmitting = form.formState.isSubmitting;
  
  const getFieldProps = (name: string) => ({
    name,
    disabled: isSubmitting,
  });
  
  const getSubmitButtonProps = () => ({
    type: 'submit' as const,
    disabled: isSubmitting,
    loading: isSubmitting,
  });
  
  return {
    isSubmitting,
    getFieldProps,
    getSubmitButtonProps,
  };
};

// Form field dependency
export const useFieldDependency = <T extends FieldValues>(
  form: UseFormReturn<T>,
  watchField: Path<T>,
  dependentField: Path<T>,
  condition: (value: any) => boolean,
  action: 'enable' | 'disable' | 'show' | 'hide' | 'clear' | 'setValue',
  setValue?: any
) => {
  const watchedValue = form.watch(watchField);
  
  useEffect(() => {
    const shouldAct = condition(watchedValue);
    
    switch (action) {
      case 'enable':
      case 'disable':
        // This would need custom implementation with register
        break;
      case 'clear':
        if (!shouldAct) {
          form.setValue(dependentField, undefined as any);
        }
        break;
      case 'setValue':
        if (shouldAct && setValue !== undefined) {
          form.setValue(dependentField, setValue);
        }
        break;
    }
  }, [watchedValue, form, dependentField, condition, action, setValue]);
};

// Export all helpers
export const formHelpers = {
  handleSubmit: handleFormSubmit,
  getErrorMessage: getFormErrorMessage,
  hasErrors: hasFormErrors,
  getFirstError: getFirstErrorField,
  createOptions: createFormOptions,
  formatData: formatFormData,
  validateField,
  resetWithConfirm: resetFormWithConfirm,
  getChanges: getFormChanges,
  hasChanges: hasFormChanges,
};