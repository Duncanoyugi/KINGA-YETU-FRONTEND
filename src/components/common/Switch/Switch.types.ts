export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: SwitchSize;
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}
