import React from "react";
import Header from "./common/Header";
import Footer from "./common/Footer";

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
  className = "",
}) => {
  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div
        className={`max-w-6xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden ${className}`}
      >
        <Header title={headerTitle} subtitle={headerSubtitle} />
        <main className="p-8 flex flex-col items-center">
          <div className="w-full max-w-4xl">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
