import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...rest }) => {
  return (
    <button className={`btn ${variant}`} {...rest}>
      {children}
    </button>
  );
};