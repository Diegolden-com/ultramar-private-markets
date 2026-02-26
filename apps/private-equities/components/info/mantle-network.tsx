import Image from "next/image";

export default function MantleNetwork() {
    return (
        <div className="max-w-5xl mx-auto">
            <section className="mt-24 mb-16 text-center">
                <div className="flex justify-center mb-8">
                    <Image
                        src="/mantle-logo-black.png"
                        alt="Mantle Network"
                        width={240}
                        height={48}
                        className="h-12 w-auto dark:hidden"
                    />
                    <Image
                        src="/mantle-logo-white.png"
                        alt="Mantle Network"
                        width={240}
                        height={48}
                        className="h-12 w-auto hidden dark:block"
                    />
                </div>
                <p className="font-mono text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    A world where finance is free, efficient, and accessible — powered by tokenized technology and open to all.
                </p>
            </section>
        </div>
    );
}
