import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/common/Layout";
import Section from "../components/common/Section";
import FeatureCard from "../components/FeatureCard";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

const Home: React.FC = () => {
  const { logout, isAuthenticated } = useAuth();

  return (
    <Layout
      headerTitle="Inventory Management System"
      headerSubtitle="Streamline your stock, boost efficiency."
    >
      <Section title="Overview">
        <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
          Our Inventory Management System is designed to help businesses of all
          sizes track their inventory, manage stock levels, and optimize their
          supply chain. With our user-friendly interface and powerful features,
          you can easily monitor your inventory in real-time, reduce stockouts,
          and improve overall efficiency.
        </p>
      </Section>

      <img src="/oiia-cat.gif" alt="cat" className="w-20  mx-auto my-8" />

      <Section title="Benefits">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <FeatureCard
            title="Increased Efficiency"
            description="Automate your inventory processes and free up valuable time for your team."
          />
          <FeatureCard
            title="Reduced Stockouts"
            description="Receive alerts when stock levels are low, preventing costly stockouts."
          />
          <FeatureCard
            title="Improved Accuracy"
            description="Minimize errors and improve the accuracy of your inventory data."
          />
          <FeatureCard
            title="Data-Driven Decisions"
            description="Gain insights into your inventory performance and make informed decisions."
          />
        </div>
      </Section>

      <Section
        title={isAuthenticated ? "Having fun ?" : "Ready to Get Started?"}
        className="text-center"
      >
        {!isAuthenticated ? (
          <>
            <p className="text-gray-700 mb-6">
              Sign in to access your inventory management dashboard.
            </p>
            <div className="grid grid-cols-2">
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>

              <Link to="/signin">
                <Button>Sign In</Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-700 mb-6">You are already signed in</p>
            <div className="grid grid-cols-2">
              <Link to="/inventory">
                <Button variant="primary">View Dashboard</Button>
              </Link>

              <Link to="/">
                <Button onClick={logout}>Sign Out</Button>
              </Link>
            </div>
          </>
        )}
        {/* // if alredy signed in then show the sign out instead of sign in */}
      </Section>
    </Layout>
  );
};

export default Home;
