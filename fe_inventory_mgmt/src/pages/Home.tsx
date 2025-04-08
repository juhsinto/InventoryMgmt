import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Section from "../components/common/Section";
import FeatureCard from "../components/FeatureCard";
import Button from "../components/common/Button";

const Home: React.FC = () => {
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

      <Section title="Key Features" align="center">
        <ul className="text-gray-700 inline-block text-left mx-auto">
          <li>Real-time inventory tracking</li>
          <li>Automated stock level alerts</li>
          <li>Order management and fulfillment</li>
          <li>Reporting and analytics</li>
          <li>Supplier management</li>
          <li>Integration with e-commerce platforms</li>
        </ul>
      </Section>

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

      <Section title="Ready to Get Started?" className="text-center">
        <p className="text-gray-700 mb-6">
          Sign in to access your inventory management dashboard.
        </p>
        <Link to="/signup">
          <Button>Sign Up</Button>
        </Link>
        <Link to="/signin">
          <Button>Sign In</Button>
        </Link>
      </Section>
    </Layout>
  );
};

export default Home;
