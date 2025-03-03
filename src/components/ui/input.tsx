import React from 'react';

interface InputProps {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea'; // Add 'textarea' to type options
  size?: 'large' | 'base' | 'small';
  required?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  placeholder?: string;
  rows?: number; // For textarea row customization
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  [key: string]: any;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type,
  size = 'base',
  required = false,
  backgroundColor = 'bg-primary-25',
  borderColor = 'border-gray-300',
  textColor = 'text-gray-900',
  placeholder = '',
  rows = 4, // Default rows for textarea
  value,
  onChange,
  ...rest
}) => {
  const inputClasses = {
    large: 'p-4 text-base',
    base: 'p-2.5 text-sm',
    small: 'p-2 text-xs',
  };

  const inputClass = inputClasses[size];

  return (
    <div className="mb-5">
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          placeholder={placeholder}
          rows={rows}
          value={value}
          onChange={onChange}
          className={`block w-full ${inputClass} ${backgroundColor} border ${borderColor} rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 ${textColor}`}
          required={required}
          {...rest}
        />
      ) : (
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`block w-full ${inputClass} ${backgroundColor} border ${borderColor} rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 ${textColor}`}
          required={required}
          {...rest}
        />
      )}
    </div>
  );
};

export default Input;