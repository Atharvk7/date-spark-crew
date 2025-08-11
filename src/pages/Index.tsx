import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Features from "@/components/site/Features";
import HowItWorks from "@/components/site/HowItWorks";
import Footer from "@/components/site/Footer";

const Index = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <section id="cta" className="py-16 md:py-24">
          <div className="container text-center">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3">Ready to spark something real?</h2>
            <p className="text-muted-foreground text-lg mb-6">Join Date Spark Crew and plan your next great date in minutes.</p>
            <a href="#" className="btn-hero inline-flex h-11 items-center justify-center rounded-md px-6 font-medium">Create your account</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
