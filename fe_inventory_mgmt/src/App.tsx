import "./App.css";

function App() {
  return (
    <>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <header className="bg-indigo-600 py-6 px-8 text-white">
            <h1 className="text-3xl font-semibold">
              Inventory Management System
            </h1>
            <p className="mt-2 text-indigo-200">
              Streamline your stock, boost efficiency.
            </p>
          </header>

          {/* Main Content */}
          <main className="p-8">
            {/* Section: Overview */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Overview
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our Inventory Management System is designed to help businesses
                of all sizes track their inventory, manage stock levels, and
                optimize their supply chain. With our user-friendly interface
                and powerful features, you can easily monitor your inventory in
                real-time, reduce stockouts, and improve overall efficiency.
              </p>
            </section>

            {/* Section: Key Features */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Key Features
              </h2>
              <ul className="pl-5 text-gray-700">
                <li>Real-time inventory tracking</li>
                <li>Automated stock level alerts</li>
                <li>Order management and fulfillment</li>
                <li>Reporting and analytics</li>
                <li>Supplier management</li>
                <li>Integration with e-commerce platforms</li>
              </ul>
            </section>

            {/* Section: Benefits */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Benefits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Increased Efficiency
                  </h3>
                  <p className="text-gray-700">
                    Automate your inventory processes and free up valuable time
                    for your team.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Reduced Stockouts
                  </h3>
                  <p className="text-gray-700">
                    Receive alerts when stock levels are low, preventing costly
                    stockouts.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Improved Accuracy
                  </h3>
                  <p className="text-gray-700">
                    Minimize errors and improve the accuracy of your inventory
                    data.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Data-Driven Decisions
                  </h3>
                  <p className="text-gray-700">
                    Gain insights into your inventory performance and make
                    informed decisions.
                  </p>
                </div>
              </div>
            </section>

            {/* Section: Call to Action */}
            <section className="text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Ready to Get Started?
              </h2>
              <p className="text-gray-700 mb-6">
                Contact us today to learn more about how our Inventory
                Management System can help your business thrive.
              </p>
              <a
                href="#"
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Contact Us
              </a>
            </section>
          </main>

          {/* Footer */}
          <footer className="bg-gray-200 py-4 px-8 text-center text-gray-600">
            <p>&copy; 2025 Inventory Solutions. NO rights reserved.</p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
