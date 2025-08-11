import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="w-full">
      <nav className="container flex items-center justify-between py-4">
        <a href="#" className="flex items-center gap-2" aria-label="Date Spark Crew home">
          <div className="h-7 w-7 rounded-md bg-primary/15" />
          <span className="font-display text-lg font-semibold tracking-tight">Date Spark Crew</span>
        </a>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it works</a>
          <a href="#cta" className="text-muted-foreground hover:text-foreground transition-colors">Get the app</a>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <a href="#cta">Sign in</a>
          </Button>
          <Button variant="hero" asChild>
            <a href="#cta">Get started</a>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
