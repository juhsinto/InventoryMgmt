import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, className = "" }) => {
  return (
    <header className={`bg-amber-600 py-6 px-8 text-white ${className}`}>
      <h1 className="text-3xl font-semibold">{title}</h1>
      {subtitle && <p className="mt-2 text-white">{subtitle}</p>}
    </header>
  );
};

export default Header;
