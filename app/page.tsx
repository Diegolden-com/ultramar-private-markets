import { Hero } from "@/components/landing/hero";
import { Manifesto } from "@/components/landing/manifesto";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background selection:bg-accent selection:text-accent-foreground">
      <Hero />
      <Manifesto />

      <footer className="mt-auto border-t border-foreground/10 py-8 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          ULTRAMAR PRIVATE EQUITIES © {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
