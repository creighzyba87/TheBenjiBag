import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  items: CartItem[];
  onRemoveItem: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onCheckout: (promoCode?: string, referralCode?: string) => void;
}

export function ShoppingCart({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
}: ShoppingCartProps) {
  const [promoCode, setPromoCode] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal - promoDiscount);

  const isValidOrder = total >= 10000 && total <= 50000;

  const handleApplyPromo = async () => {
    // Validate promo code via API
    setPromoDiscount(500); // Example: $5 discount
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Your cart is empty
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shopping Cart</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between p-3 bg-muted rounded"
            >
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  ${(item.price / 100).toFixed(2)} each
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={item.quantity}
                  onChange={(e) =>
                    onUpdateQuantity(item.productId, parseInt(e.target.value))
                  }
                  className="w-16"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item.productId)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${(subtotal / 100).toFixed(2)}</span>
          </div>

          {promoDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Promo Discount:</span>
              <span>-${(promoDiscount / 100).toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${(total / 100).toFixed(2)}</span>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={handleApplyPromo}
              disabled={!promoCode}
            >
              Apply Promo
            </Button>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Referral code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
            />
          </div>

          {!isValidOrder && (
            <p className="text-sm text-red-600">
              {total < 10000
                ? `Minimum order: $100 (need $${((10000 - total) / 100).toFixed(2)} more)`
                : `Maximum order: $500 (reduce by $${((total - 50000) / 100).toFixed(2)})`}
            </p>
          )}

          <Button
            onClick={() => onCheckout(promoCode, referralCode)}
            disabled={!isValidOrder}
            className="w-full"
            size="lg"
          >
            Proceed to Checkout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
