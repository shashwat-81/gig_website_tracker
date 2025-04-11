import React from 'react';
import { Checkbox, CheckboxProps, FormControlLabel } from '@mui/material';

interface CheckboxFieldProps extends Omit<CheckboxProps, 'component'> {
  name: string;
  label?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  checked,
  onChange,
  ...props
}) => {
  return label ? (
    <FormControlLabel
      control={
        <Checkbox
          name={name}
          checked={checked}
          onChange={onChange}
          {...props}
        />
      }
      label={label}
    />
  ) : (
    <Checkbox
      name={name}
      checked={checked}
      onChange={onChange}
      {...props}
    />
  );
};

export default CheckboxField; 