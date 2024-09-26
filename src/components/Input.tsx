import React from 'react';

interface InputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  value,
  onChange,
  placeholder = '',
  required = false,
}) => {
  return (
    <input
      id={id}
      className='bg-[#1118270d] text-[1rem] py-2 px-3 border border-[#1118270d] rounded w-full focus-visible:outline-2 focus-visible:outline-transparent focus-visible:ring-2 focus-visible:ring-[#000] outline-none'
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
    />
  );
};

export default Input;
