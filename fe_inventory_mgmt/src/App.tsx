import React from 'react';
import Layout from './components/Layout';
import Section from './components/Section';
import FeatureCard from './components/FeatureCard';
import Button from './components/Button';

function App() {
  return (
    <Layout
      headerTitle="Inventory Management System"
      headerSubtitle="Streamline your stock, boost efficiency."
    >
      <Section title="Overview">
        <p className="text-gray-700 leading-relaxed">
          Our Inventory Management System is designed to help businesses
          of all sizes track their inventory, manage stock levels, and
          optimize their supply chain. With our user-friendly interface
          and powerful features, you can easily monitor your inventory in
          real-time, reduce stockouts, and improve overall efficiency.
        </p>
      </Section>

      <Section title="Key Features">
        <ul className="pl-5 text-gray-700">
          <li>Real-time inventory tracking</li>
          <li>Automated stock level alerts</li>
          <li>Order management and fulfillment</li>
          <li>Reporting and analytics</li>
          <li>Supplier management</li>
          <li>Integration with e-commerce platforms</li>
        </ul>
      </Section>

      <Section title="Benefits">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          Contact us today to learn more about how our Inventory
          Management System can help your business thrive.
        </p>
        <Button>Contact Us</Button>
      </Section>
    </Layout>
  );
}

export default App;
