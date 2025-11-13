import { useState, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { MapPin, Navigation, CheckCircle } from 'lucide-react';

export default function DriverMap() {
  const { user, loading } = useAuth();
  const [driverStatus, setDriverStatus] = useState('idle');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  const updateLocationMutation = trpc.drivers.updateLocation.useMutation();
  const updateStatusMutation = trpc.drivers.updateStatus.useMutation();

  // Get driver's current location every 5-10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          
          // Send location to server
          if (driverStatus !== 'idle') {
            updateLocationMutation.mutate({ lat: latitude, lng: longitude });
          }
        });
      }
    }, 7000); // Every 7 seconds

    return () => clearInterval(interval);
  }, [driverStatus, updateLocationMutation]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (user?.role !== 'driver') {
    return <div className="flex items-center justify-center min-h-screen">Access Denied</div>;
  }

  const handleStatusChange = (status: string) => {
    setDriverStatus(status);
    updateStatusMutation.mutate({ status: status as any });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Driver Navigation</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map area */}
          <div className="lg:col-span-2">
            <Card className="h-96 lg:h-full">
              <CardContent className="pt-6 h-full flex items-center justify-center bg-muted">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {currentLocation
                      ? `Current Location: ${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                      : 'Waiting for GPS...'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status and controls */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-muted rounded">
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  <p className="text-lg font-semibold capitalize">{driverStatus}</p>
                </div>

                <div className="space-y-2">
                  <Button
                    variant={driverStatus === 'idle' ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => handleStatusChange('idle')}
                  >
                    Go Idle
                  </Button>
                  <Button
                    variant={driverStatus === 'enroute' ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => handleStatusChange('enroute')}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    En Route
                  </Button>
                  <Button
                    variant={driverStatus === 'delivering' ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => handleStatusChange('delivering')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Delivering
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No active delivery assigned
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ETA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Waiting for delivery assignment
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
