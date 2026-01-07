export function Manifesto() {
    return (
        <section className="container mx-auto max-w-4xl px-4 py-24 sm:py-32">
            <div className="border-l-2 border-foreground/20 pl-6 sm:pl-12">
                <h2 className="mb-12 font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
                    The Manifesto
                </h2>

                <div className="space-y-12 font-serif text-2xl leading-relaxed text-foreground sm:text-4xl">
                    <p>
                        The old world is built on gateways.
                        <span className="text-muted-foreground"> Gatekeepers asking for permission. Intermediaries extracting value. Systems designed to exclude.</span>
                    </p>

                    <p>
                        We believe in a different architecture for wealth.
                    </p>

                    <div className="grid gap-8 pt-8 sm:grid-cols-3 sm:gap-12">
                        <div>
                            <h3 className="mb-2 font-mono text-sm font-bold uppercase tracking-widest text-foreground">
                                Borderless
                            </h3>
                            <p className="font-sans text-base text-muted-foreground">
                                Capital flows like water, adhering only to the laws of mathematics, not the whims of jurisdictions.
                            </p>
                        </div>
                        <div>
                            <h3 className="mb-2 font-mono text-sm font-bold uppercase tracking-widest text-foreground">
                                Trustless
                            </h3>
                            <p className="font-sans text-base text-muted-foreground">
                                Don't trust us. Verify the assets. Verify the contracts. Verify the yield on-chain, in real-time.
                            </p>
                        </div>
                        <div>
                            <h3 className="mb-2 font-mono text-sm font-bold uppercase tracking-widest text-foreground">
                                Permissionless
                            </h3>
                            <p className="font-sans text-base text-muted-foreground">
                                Open to anyone with a wallet. No accreditation forms. No backroom deals. Just open finance.
                            </p>
                        </div>
                    </div>

                    <p className="pt-8">
                        Ultramar is not just an investment platform. It is a declaration of financial independence.
                    </p>
                </div>
            </div>
        </section>
    )
}
