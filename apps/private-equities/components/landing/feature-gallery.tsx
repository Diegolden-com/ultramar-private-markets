"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function FeatureGallery() {
    const features = [
        {
            title: "INDUSTRIAL",
            subtitle: "Automated Warehousing",
            image: "/industrial-warehouse.png",
            description: "Yield from the physical backbone of global supply chains.",
            className: "md:col-span-2 md:row-span-2 h-[500px] md:h-[600px]",
        },
        {
            title: "LOGISTICS",
            subtitle: "Global Shipping",
            image: "/shipping-logistics.png",
            description: "Fractional ownership of trade routes and transport assets.",
            className: "md:col-span-1 md:row-span-1 h-[250px] md:h-[290px]",
        },
        {
            title: "DATA INFRASTRUCTURE",
            subtitle: "Server Farms",
            image: "/data-infrastructure.png",
            description: "The digital estate.",
            className: "md:col-span-1 md:row-span-1 h-[250px] md:h-[290px]",
        },
    ]

    return (
        <section className="bg-background py-20 sm:py-32 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,currentColor,transparent)] bg-[length:32px_32px]" />
            
            <div className="container mx-auto px-4 relative">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6"
                >
                    <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[0.9]">
                        Trending Firms
                    </h2>
                    <Link href="/equities" className="group flex items-center gap-3 font-mono text-sm font-medium tracking-tight text-muted-foreground hover:text-foreground transition-colors mb-2 md:mb-4">
                        <span>View all</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.6 }}
                            className={cn("relative", feature.className)}
                        >
                            <Link
                                href="/equities"
                                className="group relative overflow-hidden rounded-2xl border border-border/50 shadow-xl transition-all duration-500 hover:shadow-2xl hover:border-accent/30 block w-full h-full"
                            >
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    priority={index === 0}
                                />

                                {/* Ticker & Status Overlay */}
                                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                                    <span className="text-xs font-bold font-mono text-background bg-foreground/90 px-3 py-1.5 border border-transparent shadow-sm backdrop-blur-md">
                                        {feature.title}
                                    </span>
                                </div>

                                {/* Animated border glow on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute inset-0 rounded-2xl border border-accent/50 animate-pulse" />
                                </div>

                                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
                                    <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-xl p-5 transition-all duration-500 group-hover:bg-black/50 group-hover:border-white/20">
                                        <h3 className="mb-3 font-serif text-2xl md:text-3xl font-bold text-white tracking-tight">
                                            {feature.subtitle}
                                        </h3>
                                        <p className="font-sans text-sm text-white/70 font-medium leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
