import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CustomerHome from "./pages/CustomerHome";
import AdminDashboard from "./pages/AdminDashboard";
import DriverMap from "./pages/DriverMap";
import { useAuth } from "./_core/hooks/useAuth";
import { SocketProvider } from "./contexts/SocketContext";

function Router({ user, loading }) {

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect based on user role
  if (user) {
    if (user.role === 'admin') {
      return (
        <Switch>
          <Route path={"/admin"} component={AdminDashboard} />
          <Route path={"/admin/*"} component={AdminDashboard} />
          <Route path={"/"} component={AdminDashboard} />
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      );
    } else if (user.role === 'driver') {
      return (
        <Switch>
          <Route path={"/driver"} component={DriverMap} />
          <Route path={"/driver/*"} component={DriverMap} />
          <Route path={"/"} component={DriverMap} />
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      );
    } else {
      return (
        <Switch>
          <Route path={"/customer"} component={CustomerHome} />
          <Route path={"/customer/*"} component={CustomerHome} />
          <Route path={"/"} component={CustomerHome} />
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      );
    }
  }

  // Not authenticated - show landing page
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { user, loading } = useAuth();
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
<TooltipProvider>
          <Toaster />
          <SocketProvider user={user}>
            <Router user={user} loading={loading} />
          </SocketProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
