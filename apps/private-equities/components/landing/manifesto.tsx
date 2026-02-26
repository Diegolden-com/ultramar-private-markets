export function Manifesto() {
    return (
        <section className="container mx-auto max-w-5xl px-4 py-24 sm:py-36">
            <div className="text-center">
                <h2 className="mb-16 font-mono text-xs font-bold uppercase tracking-[0.3em] text-accent">
                    OUR PHILOSOPHY
                </h2>

                <div className="space-y-24">
                    <p className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight text-foreground">
                        The old world is built on gateways. <br />
                        <span className="text-muted-foreground/40 transition-colors hover:text-muted-foreground duration-700">We then build a new world.</span>
                    </p>

                    <div className="grid gap-12 sm:grid-cols-3 pt-12 text-left">
                        <div className="group">
                            <h3 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-foreground group-hover:text-accent transition-colors">
                                Borderless
                            </h3>
                            <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                                Capital flows like water, take part on companies worldwide.
                            </p>
                        </div>
                        <div className="group">
                            <h3 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-foreground group-hover:text-accent transition-colors">
                                Community
                            </h3>
                            <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                                Preferential terms for both companies and investors.
                            </p>
                        </div>
                        <div className="group">
                            <h3 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-foreground group-hover:text-accent transition-colors">
                                Trustless
                            </h3>
                            <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                                Blockchain and AI enable real-time, 24/7 auditing.
                            </p>
                        </div>
                    </div>

                    <div className="pt-20 border-t border-foreground/5">
                        <p className="font-sans text-xl text-muted-foreground">
                            Ultramar. <span className="text-foreground font-bold">Private Equity, uncompromised.</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
