import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import LogPage from "./pages/LogPage";
import ChartsPage from "./pages/ChartsPage";
import { Activity, ClipboardList, LineChart } from "lucide-react";
import { clsx } from "clsx";
import { InsulinLogProvider } from "./hooks/useInsulinLog";

const queryClient = new QueryClient();

function NavLink({ href, children }) {
  const [location] = useLocation();
  const isActive = location === href;
  return (
    <Link href={href} className={clsx("flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors", isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
      {children}
    </Link>
  );
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-sm">GlucoseLog</span>
          </div>
          <nav className="flex items-center gap-1">
            <NavLink href="/"><ClipboardList className="h-4 w-4" />Log</NavLink>
            <NavLink href="/charts"><LineChart className="h-4 w-4" />Analytics</NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={LogPage} />
        <Route path="/charts" component={ChartsPage} />
        <Route><div className="text-center py-20 text-muted-foreground">Page not found.</div></Route>
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <InsulinLogProvider>
          <WouterRouter>
            <Router />
          </WouterRouter>
        </InsulinLogProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
