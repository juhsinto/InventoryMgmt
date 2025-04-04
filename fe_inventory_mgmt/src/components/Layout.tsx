import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  headerTitle: string;
  headerSubtitle?: string;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  headerTitle,
  headerSubtitle,
  className = ''
}) => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className={`max-w-5xl w-full bg-white shadow-xl rounded-lg overflow-hidden ${className}`}>
        <Header title={headerTitle} subtitle={headerSubtitle} />
        <main className="p-8">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout; 