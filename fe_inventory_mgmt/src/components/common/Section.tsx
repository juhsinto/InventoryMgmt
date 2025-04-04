import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center';
}

const Section: React.FC<SectionProps> = ({ 
  title, 
  children, 
  className = '',
  align = 'center'
}) => {
  return (
    <section className={`mb-8 w-full ${className}`}>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">{title}</h2>
      <div className={`max-w-3xl mx-auto ${align === 'center' ? 'text-center' : ''}`}>
        {children}
      </div>
    </section>
  );
};

export default Section; 