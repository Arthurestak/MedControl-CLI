import { Link, useLocation } from "wouter";
import { Pill, Home, PlusCircle } from "lucide-react";
import { useHealthCheck } from "@workspace/api-client-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: health } = useHealthCheck();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <Pill className="w-6 h-6" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-foreground">MedControl</span>
          </Link>
          
          <nav className="flex items-center gap-1">
            <Link 
              href="/" 
              className={`p-2 rounded-lg transition-colors ${location === '/' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}
              data-testid="nav-home"
            >
              <Home className="w-5 h-5" />
            </Link>
            <Link 
              href="/medications/new" 
              className={`p-2 rounded-lg transition-colors ${location === '/medications/new' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}
              data-testid="nav-add"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container max-w-3xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-border/40 py-6 text-center text-sm text-muted-foreground">
        <p>Stay on track with MedControl.</p>
        {health?.status === 'ok' && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-primary/80 animate-pulse" />
            <span className="text-xs">Systems operational</span>
          </div>
        )}
      </footer>
    </div>
  );
}
