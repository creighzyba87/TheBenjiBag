import { useState, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { AgeGate } from '@/components/AgeGate';
import { ProductCatalog } from '@/components/ProductCatalog';
import { ShoppingCart } from '@/components/ShoppingCart';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/lib/trpc';
import { Package, MapPin, Gift } from 'lucide-react';

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export default function CustomerHome() {
  const { user, loading } = useAuth();
  const [ageGateConfirmed, setAgeGateConfirmed] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState('products');

  const { data: orders } = trpc.orders.list.useQuery(undefined, {
    enabled: !!user,
  });

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!ageGateConfirmed) {
    return <AgeGate onConfirm={() => setAgeGateConfirmed(true)} />;
  }

  const handleAddToCart = (item: CartItem) => {
    const existing = cartItems.find((ci) => ci.productId === item.productId);
    if (existing) {
      setCartItems(
        cartItems.map((ci) =>
          ci.productId === item.productId
            ? { ...ci, quantity: ci.quantity + item.quantity }
            : ci
        )
      );
    } else {
      setCartItems([...cartItems, item]);
    }
  };

  const handleRemoveFromCart = (productId: number) => {
    setCartItems(cartItems.filter((item) => item.productId !== productId));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleCheckout = (promoCode?: string, referralCode?: string) => {
    // Navigate to checkout page
    console.log('Checkout:', { cartItems, promoCode, referralCode });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TheBenjiBag</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.name || 'Customer'}
            </span>
            <Button variant="outline" size="sm">
              Account
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              My Orders
            </TabsTrigger>
            <TabsTrigger value="referral" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Referral
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Browse Products</h2>
                <ProductCatalog onAddToCart={handleAddToCart} />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Cart</h2>
                <ShoppingCart
                  items={cartItems}
                  onRemoveItem={handleRemoveFromCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-xl font-semibold">Your Orders</h2>
            {orders && orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order: any) => (
                  <div
                    key={order.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{order.orderId}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${(order.totalAmount / 100).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {order.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No orders yet</p>
            )}
          </TabsContent>

          <TabsContent value="referral" className="space-y-4">
            <h2 className="text-xl font-semibold">Referral Program</h2>
            <div className="p-4 border rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-4">
                Share your unique referral code with friends and earn credits!
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Your referral code"
                  readOnly
                  className="w-full px-3 py-2 border rounded bg-background"
                  value={user?.referralCode || 'Loading...'}
                />
                <Button variant="outline" className="w-full">
                  Copy Code
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
