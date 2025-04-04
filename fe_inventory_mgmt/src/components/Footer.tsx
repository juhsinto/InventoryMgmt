import React from 'react';

interface FooterProps {
  copyrightText?: string;
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ 
  copyrightText = '© 2025 Inventory Solutions. NO rights reserved.',
  className = ''
}) => {
  return (
    <footer className={`bg-gray-200 py-4 px-8 text-center text-gray-600 ${className}`}>
      <p>{copyrightText}</p>
    </footer>
  );
};

export default Footer; 