import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Leaf, Truck, ShoppingBag } from "lucide-react";

export default function Home() {
  const { user, loading, logout, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'admin') {
      window.location.href = '/admin';
    } else if (user?.role === 'driver') {
      window.location.href = '/driver';
    } else {
      window.location.href = '/customer';
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-green-900">TheBenjiBag</h1>
          </div>
          <Button onClick={() => window.location.href = getLoginUrl()}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-gray-900">
              Premium Cannabis Delivery
            </h2>
            <p className="text-xl text-gray-600">
              Fast, discreet, and reliable delivery service for adults 21+
            </p>
          </div>

          <div className="bg-green-100 border-2 border-green-300 rounded-lg p-6 my-8">
            <p className="text-lg font-semibold text-green-900">
              ⚠️ Age Verification Required
            </p>
            <p className="text-green-800 mt-2">
              You must be 21 years or older to use this service
            </p>
          </div>

          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
            onClick={() => window.location.href = getLoginUrl()}
          >
            Get Started
          </Button>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-green-600" />
              <h3 className="text-lg font-semibold">Browse & Order</h3>
              <p className="text-gray-600">
                Browse our premium selection and place orders with ease
              </p>
            </div>

            <div className="space-y-3">
              <Truck className="w-12 h-12 mx-auto text-green-600" />
              <h3 className="text-lg font-semibold">Fast Delivery</h3>
              <p className="text-gray-600">
                Real-time tracking and delivery within your preferred window
              </p>
            </div>

            <div className="space-y-3">
              <Leaf className="w-12 h-12 mx-auto text-green-600" />
              <h3 className="text-lg font-semibold">Premium Quality</h3>
              <p className="text-gray-600">
                Curated selection of top-shelf products
              </p>
            </div>
          </div>

          {/* Product Categories */}
          <div className="mt-16 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">What We Offer</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Top Shelf Indica",
                "Premium Sativa",
                "Sativa Concentrate",
                "Indica Concentrate",
                "Sativa Vape Pens",
                "Indica Vape Pens",
              ].map((product) => (
                <div
                  key={product}
                  className="p-4 bg-white border rounded-lg hover:shadow-md transition"
                >
                  <p className="font-medium text-gray-900">{product}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              Ready to Order?
            </h3>
            <p className="text-gray-600">
              Sign in to browse products and place your first order
            </p>
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Sign In to Order
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>
            © 2025 TheBenjiBag. For adults 21+ only. Please consume responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
}
