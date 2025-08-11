import { MapPin, Sparkles, CalendarRange } from "lucide-react";

const steps = [
  {
    title: "Set your vibe",
    description: "Tell us what you like and your ideal pace for a great date night.",
    icon: Sparkles,
  },
  {
    title: "Pick an idea",
    description: "Browse curated experiences matched to your interests and city.",
    icon: MapPin,
  },
  {
    title: "Lock the plan",
    description: "Coordinate the details effortlessly, then just show up and enjoy.",
    icon: CalendarRange,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="container">
        <div className="max-w-2xl mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3">How it works</h2>
          <p className="text-muted-foreground text-lg">Three simple steps to plan a date that actually feels special.</p>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <li key={s.title} className="card-surface p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-md bg-primary/15 flex items-center justify-center">
                  <s.icon className="text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Step {i + 1}</span>
              </div>
              <h3 className="font-medium mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
