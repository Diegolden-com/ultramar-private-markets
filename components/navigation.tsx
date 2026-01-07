"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Moon, Sun, LogOut } from 'lucide-react'
import { useTheme } from "./theme-provider"
import { OakLeafLogo } from "./oak-leaf-logo"
import { usePrivy } from '@privy-io/react-auth'

export function Navigation() {
    const pathname = usePathname()
    const { theme, toggleTheme } = useTheme()
    const { ready, authenticated, user, login, logout } = usePrivy()

    const walletAddress = user?.wallet?.address
        ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
        : 'No Wallet'

    const network = "Arbitrum" // This could be dynamic if Privy/Wagmi exposes chain ID

    return (
        <nav className="border-b border-border bg-background sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <OakLeafLogo className="w-10 h-10 md:w-12 md:h-12 transition-transform group-hover:scale-105" />
                        <span className="text-xl md:text-2xl font-serif font-bold tracking-wide text-foreground">
                            ULTRAMAR <span className="text-muted-foreground italic font-normal">PRIVATE EQUITIES</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex gap-8 items-center">
                        <Link
                            href="/"
                            className={`font-mono text-xs uppercase tracking-widest hover:text-accent transition-colors ${pathname === "/" ? "text-accent" : ""}`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/app"
                            className={`font-mono text-xs uppercase tracking-widest hover:text-accent transition-colors ${pathname.startsWith("/app") ? "text-accent" : ""}`}
                        >
                            App
                        </Link>
                        <Link
                            href="/dashboard"
                            className={`font-mono text-xs uppercase tracking-widest hover:text-accent transition-colors ${pathname === "/dashboard" ? "text-accent" : ""}`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/info"
                            className={`font-mono text-xs uppercase tracking-widest hover:text-accent transition-colors ${pathname.startsWith("/info") ? "text-accent" : ""}`}
                        >
                            Info
                        </Link>
                        <button
                            onClick={toggleTheme}
                            className="border border-border p-2 hover:bg-muted hover:border-accent transition-all rounded-md"
                            aria-label="Toggle dark mode"
                        >
                            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        </button>

                        {/* Wallet Integration */}
                        {ready && authenticated && user ? (
                            <div className="relative group/wallet">
                                <button
                                    className="border border-border p-3 hover:bg-muted hover:border-accent transition-all flex items-center justify-center rounded-md gap-2"
                                    aria-label="Wallet status"
                                >
                                    <div className="w-2 h-2 rounded-full bg-accent" />
                                    <span className="font-mono text-xs hidden lg:inline-block">{walletAddress}</span>
                                </button>
                                <div className="absolute right-0 top-full mt-2 w-64 border border-border bg-card p-4 opacity-0 invisible group-hover/wallet:opacity-100 group-hover/wallet:visible transition-all duration-200 z-50 shadow-lg rounded-md">
                                    <p className="font-mono text-xs mb-2">
                                        La Wallet <span className="font-semibold">{walletAddress}</span> está conectada correctamente
                                    </p>
                                    <p className="font-mono text-xs text-muted-foreground mb-3">
                                        Red: <span className="text-accent">{network}</span>
                                    </p>
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-destructive/10 text-destructive text-xs font-mono hover:bg-destructive/20 rounded transition-colors"
                                    >
                                        <LogOut className="w-3 h-3" />
                                        Desconectar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={login}
                                className="border border-border px-4 py-2 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all font-mono text-xs uppercase tracking-widest rounded-md flex items-center gap-2 group/login"
                            >
                                <div className="w-2 h-2 rounded-full bg-destructive group-hover/login:bg-accent-foreground transition-colors" />
                                Login
                            </button>
                        )}
                    </div>

                    <div className="flex md:hidden items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="border border-border p-2 hover:bg-muted transition-colors rounded-md"
                            aria-label="Toggle dark mode"
                        >
                            {theme === "light" ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                        </button>

                        {/* Mobile Wallet Integration */}
                        {ready && authenticated ? (
                            <div className="relative group/wallet-mobile">
                                <button
                                    className="border border-border p-2 hover:bg-muted transition-colors flex items-center justify-center active:bg-muted rounded-md"
                                    aria-label="Wallet status"
                                >
                                    <div className="w-2 h-2 rounded-full bg-accent" />
                                </button>
                                <div className="absolute right-0 top-full mt-2 w-56 border border-border bg-card p-3 opacity-0 invisible group-hover/wallet-mobile:opacity-100 group-hover/wallet-mobile:visible group-active/wallet-mobile:opacity-100 group-active/wallet-mobile:visible transition-all duration-200 z-50 pointer-events-none shadow-lg rounded-md">
                                    <p className="font-mono text-xs mb-2">
                                        Wallet <span className="font-semibold">{walletAddress}</span>
                                    </p>
                                    {/* pointer-events-none on parent prevents clicking button, so we handle that if needed or remove pointer-events-none */}
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={login}
                                className="border border-border p-2 hover:bg-muted transition-colors rounded-md flex items-center gap-2"
                                aria-label="Login"
                            >
                                <div className="w-2 h-2 rounded-full bg-destructive" />
                                <span className="font-mono text-xs uppercase tracking-widest hidden sm:inline-block">Login</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
