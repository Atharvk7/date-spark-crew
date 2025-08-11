const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">© {year} Date Spark Crew. All rights reserved.</p>
        <nav className="flex items-center gap-6 text-sm">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it works</a>
          <a href="#cta" className="text-muted-foreground hover:text-foreground transition-colors">Get the app</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
