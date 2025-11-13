import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { ShoppingCart } from 'lucide-react';

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface ProductCatalogProps {
  onAddToCart: (item: CartItem) => void;
}

export function ProductCatalog({ onAddToCart }: ProductCatalogProps) {
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  if (isLoading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  const handleAddToCart = (product: any) => {
    const quantity = quantities[product.id] || 1;
    onAddToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
    });
    setQuantities({ ...quantities, [product.id]: 1 });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products?.map((product: any) => (
        <Card key={product.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <CardDescription>{product.quantity}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <p className="text-sm text-muted-foreground">{product.description}</p>
            <div className="space-y-3">
              <div className="text-2xl font-bold">
                ${(product.price / 100).toFixed(2)}
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={quantities[product.id] || 1}
                  onChange={(e) =>
                    setQuantities({
                      ...quantities,
                      [product.id]: parseInt(e.target.value),
                    })
                  }
                  className="w-16 px-2 py-1 border rounded"
                />
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1"
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
