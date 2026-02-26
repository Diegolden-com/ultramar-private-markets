import { TechSpecs } from "@/components/info/tech-specs"
import MantleNetwork from "@/components/info/mantle-network"

export default function InfoPage() {
    return (
        <main className="container mx-auto px-4 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TechSpecs />
            <MantleNetwork />
        </main >
    )
}
