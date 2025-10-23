import React, { useEffect, useState } from 'react';
import './index.css';

/*
 * Polished UI for TheBenjiBag order form.
 *
 * This component renders product cards for Indica and Sativa with
 * increment/decrement controls for quantity, a form for customer
 * details, and a list of recent orders.  It leverages Tailwind CSS for
 * styling and is designed to be responsive and accessible.  The
 * `API` constant can be updated to point at a custom backend domain
 * when deploying behind a custom domain.
 */

const API = 'https://thebenjibag-backend.onrender.com';

export default function App() {
  const [product, setProduct] = useState('indica');
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch existing orders on mount.
  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch(`${API}/orders`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      // Ensure orders are sorted by creation time descending
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error(err);
    }
  }

  function increment() {
    setQuantity((q) => Math.min(q + 1, 4));
  }

  function decrement() {
    setQuantity((q) => Math.max(q - 1, 1));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name.trim() || !deliveryTime) {
      setError('Please provide your name and desired delivery window.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, quantity, name, deliveryTime }),
      });
      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Failed to place order');
      }
      const newOrder = await res.json();
      setOrders((prev) => [newOrder, ...prev]);
      setName('');
      setDeliveryTime('');
      setQuantity(1);
      setProduct('indica');
      setSuccess('Order placed successfully!');
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-emerald-600 text-white px-4 py-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">TheBenjiBag</h1>
          <nav className="space-x-4 hidden sm:flex">
            <a href="#" className="hover:underline">Home</a>
            <a href="#admin" className="hover:underline">Admin</a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4">
        {/* Product selection */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Select a Product</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['indica', 'sativa'].map((p) => (
              <div
                key={p}
                role="button"
                tabIndex={0}
                onClick={() => setProduct(p)}
                onKeyDown={(e) => (e.key === 'Enter' ? setProduct(p) : null)}
                className={`border rounded-lg p-4 shadow-sm cursor-pointer focus:outline-none ${
                  product === p ? 'border-emerald-600 ring-2 ring-emerald-400' : 'border-gray-200'
                }`}
              >
                <h3 className="text-lg font-bold capitalize mb-1">{p}</h3>
                <p className="text-sm mb-2">
                  {p === 'indica'
                    ? 'A relaxing blend perfect for evening use.'
                    : 'An uplifting blend ideal for daytime creativity.'}
                </p>
                <span
                  className={`inline-block text-xs px-2 py-1 rounded-full ${
                    p === 'indica' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {p === 'indica' ? 'Relax' : 'Energize'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Quantity control */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Quantity</h2>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={decrement}
              disabled={quantity === 1}
              className="h-10 w-10 flex items-center justify-center border rounded-full bg-white shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              −
            </button>
            <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
            <button
              type="button"
              onClick={increment}
              disabled={quantity === 4}
              className="h-10 w-10 flex items-center justify-center border rounded-full bg-white shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Maximum 4 per order.</p>
        </section>

        {/* Order form */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Customer Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full border rounded p-2 focus:ring-2 focus:ring-emerald-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="delivery">
                Desired Delivery Time
              </label>
              <input
                id="delivery"
                type="time"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-emerald-400"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Placing Order…' : 'Place Order'}
            </button>
          </form>
        </section>

        {/* Orders list */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-gray-600">No orders yet.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li key={order.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold capitalize">{order.product}</h3>
                      <p className="text-sm text-gray-500">Quantity: {order.quantity}</p>
                    </div>
                    <span
                      className={`inline-block text-xs px-2 py-1 rounded-full ${
                        order.product === 'indica'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {order.product === 'indica' ? 'Relax' : 'Energize'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">
                    <span className="font-semibold">Name:</span> {order.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Delivery:</span> {order.deliveryTime || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Ordered at {new Date(order.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-600 py-4">
        <div className="max-w-4xl mx-auto text-center text-sm">
          &copy; {new Date().getFullYear()} TheBenjiBag. All rights reserved.
        </div>
      </footer>
    </div>
  );
}