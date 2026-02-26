"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

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
        }
    ]

    return (
        <section className="bg-background py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
                    <h2 className="font-serif text-5xl font-bold tracking-tighter text-foreground sm:text-7xl md:text-8xl lg:text-[10rem] leading-none">
                        Trending Firms
                    </h2>
                    <Link href="/equities" className="group flex items-center gap-2 font-mono text-lg md:text-xl font-bold tracking-tight text-muted-foreground hover:text-foreground transition-colors mb-2 md:mb-4">
                        View all <ArrowRight className="inline w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={cn(
                                "group relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl transition-all duration-700 hover:scale-[1.01]",
                                feature.className
                            )}
                        >
                            <Image
                                src={feature.image}
                                alt={feature.title}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                priority={index === 0}
                            />

                            {/* Gradient Overlay - Subtle Apple-style fade */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />

                            <div className="absolute bottom-0 left-0 w-full p-8 md:p-10">
                                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:bg-white/10">
                                    <p className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent/90">
                                        {feature.title}
                                    </p>
                                    <h3 className="mb-3 font-serif text-2xl md:text-4xl font-bold text-white tracking-tight">
                                        {feature.subtitle}
                                    </h3>
                                    <p className="font-sans text-sm md:text-base text-gray-300 font-medium">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
