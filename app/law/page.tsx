"use client"

import { RouteHeader } from "@/components/route-header"
import { ScrollText, Shield, FileSignature, ArrowDown } from "lucide-react"

export default function LawPage() {
    return (
        <main className="container mx-auto px-4 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
            <RouteHeader
                title="THE LAW"
                subtitle="Code is law. But law is also law."
            />

            <div className="max-w-3xl mx-auto text-center mb-16">
                <p className="font-serif text-2xl md:text-3xl leading-relaxed">
                    We don't just tokenize "vibes". <br />
                    We tokenize <span className="font-bold border-b-2 border-accent">claims.</span>
                </p>
            </div>

            {/* The Legal Stack Visualization */}
            <div className="max-w-2xl mx-auto space-y-4">

                {/* Layer 1: The Asset */}
                <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-lg relative hover:scale-[1.02] transition-transform">
                    <div className="absolute top-4 right-4 text-xs font-mono font-bold text-muted-foreground">LAYER 01</div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white dark:bg-black p-3 rounded-full border border-current">
                            <ScrollText className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-lg">Real World Asset</h3>
                            <p className="text-sm text-muted-foreground">Physical property, equity, or debt instrument.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center text-muted-foreground">
                    <ArrowDown className="w-6 h-6 animate-bounce opacity-50" />
                </div>

                {/* Layer 2: The SPV */}
                <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-lg relative hover:scale-[1.02] transition-transform border-l-4 border-l-accent">
                    <div className="absolute top-4 right-4 text-xs font-mono font-bold text-accent">LAYER 02</div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white dark:bg-black p-3 rounded-full border border-current">
                            <Shield className="w-6 h-6 text-accent" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-lg">Series LLC (SPV)</h3>
                            <p className="text-sm text-muted-foreground">
                                Usage of <span className="font-mono bg-accent/10 px-1">Delaware Series LLC</span> statutes.
                                Each asset is compartmentalized in its own liability silo.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center text-muted-foreground">
                    <ArrowDown className="w-6 h-6 animate-bounce opacity-50" />
                </div>

                {/* Layer 3: The Token */}
                <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-lg relative hover:scale-[1.02] transition-transform">
                    <div className="absolute top-4 right-4 text-xs font-mono font-bold text-muted-foreground">LAYER 03</div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white dark:bg-black p-3 rounded-full border border-current">
                            <FileSignature className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-lg">Blockchain Token</h3>
                            <p className="text-sm text-muted-foreground">
                                The ERC-20 token represents membership interest in the SPV.
                                <br /> Owning the token = Owning the legal rights.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Citations */}
            <div className="mt-24 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="p-6 border border-foreground/10 text-left">
                    <h4 className="font-mono font-bold mb-2">REGULATION D (506c)</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Exemption allowing general solicitation to Accredited Investors. This is why we can show you the deal, but strictly require KYC before investment.
                    </p>
                </div>
                <div className="p-6 border border-foreground/10 text-left">
                    <h4 className="font-mono font-bold mb-2">REGULATION S</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Exemption for offers and sales made outside of the United States, allowing global capital participation under specific conditions.
                    </p>
                </div>
            </div>
        </main>
    )
}
