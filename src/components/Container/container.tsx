import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  [key: string]: any;
}

const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = '', 
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component className={`container ${className}`} {...props}>
      {children}
    </Component>
  );
};

export default Container; 