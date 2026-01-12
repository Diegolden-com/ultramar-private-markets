import { Hero } from "@/components/landing/hero";
import { Manifesto } from "@/components/landing/manifesto";
import { FeatureGallery } from "@/components/landing/feature-gallery";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background selection:bg-accent selection:text-accent-foreground">
      <Hero />
      <FeatureGallery />
      <Manifesto />
    </main>
  );
}
