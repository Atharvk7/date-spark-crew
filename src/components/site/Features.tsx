import { Heart, Lightbulb, CalendarCheck } from "lucide-react";

const features = [
  {
    title: "Curated date ideas",
    description: "Handpicked experiences tailored to your vibe and city.",
    icon: Lightbulb,
  },
  {
    title: "Effortless planning",
    description: "Coordinate times, places, and details without the back-and-forth.",
    icon: CalendarCheck,
  },
  {
    title: "Meaningful matches",
    description: "Prioritize shared interests and chemistry for the right spark.",
    icon: Heart,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container">
        <div className="max-w-2xl mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3">Designed for better dates</h2>
          <p className="text-muted-foreground text-lg">Simple, thoughtful tools inspired by what actually makes a great date.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <article key={f.title} className="card-surface p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-md bg-primary/15 flex items-center justify-center">
                  <f.icon className="text-primary" />
                </div>
                <h3 className="font-medium">{f.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
