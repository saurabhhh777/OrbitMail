import Navbar from "../components/Navbar";

const Docs = () => {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md hidden md:block">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Documentation</h2>
          </div>
          <nav className="p-4 text-sm text-gray-700 space-y-2">
            <a href="#getting-started" className="block hover:text-black">Getting Started</a>
            <a href="#installation" className="block hover:text-black">Installation</a>
            <a href="#api" className="block hover:text-black">API Reference</a>
            <a href="#examples" className="block hover:text-black">Examples</a>
            <a href="#faq" className="block hover:text-black">FAQ</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12">
          <section id="getting-started" className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">Getting Started</h2>
            <p className="text-gray-600 text-sm">
              Welcome to the documentation. This guide will help you set up and use our platform efficiently.
            </p>
          </section>

          <section id="installation" className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">Installation</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              <code>npm install your-library-name</code>
            </pre>
          </section>

          <section id="api" className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">API Reference</h2>
            <p className="text-gray-600 text-sm">Detailed documentation of all available functions and endpoints.</p>
          </section>

          <section id="examples" className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">Examples</h2>
            <p className="text-gray-600 text-sm">See real usage examples to understand how it works in practice.</p>
          </section>

          <section id="faq">
            <h2 className="text-2xl font-semibold mb-2">FAQ</h2>
            <p className="text-gray-600 text-sm">Find answers to common questions about the platform.</p>
          </section>
        </main>
      </div>
    </>
  );
};

export default Docs;
