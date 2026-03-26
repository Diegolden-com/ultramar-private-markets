"use client"

import { motion } from "framer-motion"

export function Manifesto() {
    return (
        <section className="container mx-auto max-w-5xl px-4 py-24 sm:py-40">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center"
            >
                <h2 className="mb-16 font-mono text-xs font-bold uppercase tracking-[0.4em] text-accent">
                    OUR PHILOSOPHY
                </h2>

                <div className="space-y-28">
                    <p className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-foreground">
                        The old world is built on gateways. <br />
                        <span className="text-muted-foreground/40 italic">We then build a new world.</span>
                    </p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="grid gap-8 sm:grid-cols-3 pt-8"
                    >
                        <div className="group p-6 rounded-2xl border border-border/40 hover:border-accent/30 hover:bg-accent/5 transition-all duration-500">
                            <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-foreground group-hover:text-accent transition-colors">
                                Borderless
                            </h3>
                            <p className="font-sans text-base text-muted-foreground leading-relaxed">
                                Capital flows like water, take part on companies worldwide.
                            </p>
                        </div>
                        <div className="group p-6 rounded-2xl border border-border/40 hover:border-accent/30 hover:bg-accent/5 transition-all duration-500">
                            <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-foreground group-hover:text-accent transition-colors">
                                Community
                            </h3>
                            <p className="font-sans text-base text-muted-foreground leading-relaxed">
                                Preferential terms for both companies and investors.
                            </p>
                        </div>
                        <div className="group p-6 rounded-2xl border border-border/40 hover:border-accent/30 hover:bg-accent/5 transition-all duration-500">
                            <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-foreground group-hover:text-accent transition-colors">
                                Trustless
                            </h3>
                            <p className="font-sans text-base text-muted-foreground leading-relaxed">
                                Blockchain and AI enable real-time, 24/7 auditing.
                            </p>
                        </div>
                    </motion.div>

                    <div className="pt-16 border-t border-border/40">
                        <p className="font-sans text-xl text-muted-foreground">
                            Ultramar. <span className="text-foreground font-semibold">Private Equity, uncompromised.</span>
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
