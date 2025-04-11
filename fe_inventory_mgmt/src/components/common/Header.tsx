import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, className = "" }) => {
  const { logout, isAuthenticated } = useAuth();
  return (
    <header className={`bg-amber-600 py-6 px-8 text-white ${className}`}>
      <h1 className="text-3xl font-semibold">{title}</h1>
      {subtitle && <p className="mt-2 text-white">{subtitle}</p>}

      <div className="flex justify-between items-start">
        {isAuthenticated && (
          <Link to="/inventory">
            <p className="pt-3 text-white underline">Dashboard</p>
          </Link>
        )}

        {isAuthenticated && (
          <p
            onClick={() => {
              const confirmed = confirm("Are you sure ?");
              if (confirmed) logout();
            }}
            className="pt-3 font-semibold text-white underline cursor-pointer"
          >
            Signout
          </p>
        )}
      </div>
    </header>
  );
};

export default Header;
