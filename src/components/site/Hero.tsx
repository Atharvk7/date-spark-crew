import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-dating.jpg";
import { useRef } from "react";

const Hero = () => {
  const ref = useRef<HTMLElement | null>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--cursor-x", `${x}px`);
    el.style.setProperty("--cursor-y", `${y}px`);
  };

  return (
    <section ref={ref} onMouseMove={handleMove} className="bg-hero">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-16 md:py-24">
        <div className="text-left">
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4">
            Dating app for real connections and unforgettable dates
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-8">
            Curated ideas, seamless coordination, and a sprinkle of magic. Plan better dates—without the back-and-forth.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="hero" size="lg" asChild>
              <a href="#cta">Get started free</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#features">Explore features</a>
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="card-surface p-3 md:p-4">
            <img
              src={heroImage}
              alt="Abstract romantic gradient illustration for a dating app hero"
              className="w-full h-auto rounded-md"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
