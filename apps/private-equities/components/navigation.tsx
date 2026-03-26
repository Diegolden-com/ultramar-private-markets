"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Moon, Sun, LogOut, ChevronDown } from 'lucide-react'
import { useTheme } from "./theme-provider"
import { OakLeafLogo } from "./oak-leaf-logo"
import { usePrivy } from '@privy-io/react-auth'
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export function Navigation() {
    const pathname = usePathname()
    const { theme, toggleTheme } = useTheme()
    const { ready, authenticated, user, login, logout } = usePrivy()
    const [walletOpen, setWalletOpen] = useState(false)

    const walletAddress = user?.wallet?.address
        ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
        : 'No Wallet'

    const network = "Mantle Sepolia"

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/equities", label: "Equities" },
        { href: "/portfolio", label: "Portfolio" },
        { href: "/info", label: "Info" },
    ]

    return (
        <nav className="border-b border-border/60 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <OakLeafLogo className="w-10 h-10 md:w-11 md:h-11" />
                        </motion.div>
                        <span className="text-lg md:text-xl font-serif font-semibold tracking-wide text-foreground">
                            CX <span className="text-muted-foreground/60 italic font-normal">LAUNDRY</span>
                        </span>
                        <a 
                            href="https://www.cleanx.mx" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hidden lg:inline-flex items-center px-3 py-1 rounded-md bg-accent/10 text-accent text-xs font-mono hover:bg-accent/20 transition-colors"
                        >
                            cleanx.mx
                        </a>
                    </Link>

                    <div className="hidden md:flex gap-6 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative font-mono text-xs uppercase tracking-widest transition-colors hover:text-accent ${pathname === link.href ? "text-accent" : "text-muted-foreground"}`}
                            >
                                {link.label}
                                {pathname === link.href && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </Link>
                        ))}
                        
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleTheme}
                            className="p-2.5 rounded-lg border border-border/60 hover:bg-muted hover:border-accent/30 transition-all"
                            aria-label="Toggle dark mode"
                        >
                            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        </motion.button>

                        {ready && authenticated && user ? (
                            <div 
                                className="relative"
                                onMouseEnter={() => setWalletOpen(true)}
                                onMouseLeave={() => setWalletOpen(false)}
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border/60 hover:bg-muted hover:border-accent/30 transition-all"
                                >
                                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                    <span className="font-mono text-xs">{walletAddress}</span>
                                    <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${walletOpen ? "rotate-180" : ""}`} />
                                </motion.button>
                                
                                <AnimatePresence>
                                    {walletOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-full mt-3 w-72 border border-border/60 bg-card rounded-xl p-5 shadow-xl"
                                        >
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                                                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                                                    </div>
                                                    <div>
                                                        <p className="font-mono text-xs text-muted-foreground">Wallet Connected</p>
                                                        <p className="font-mono text-sm font-semibold text-foreground">{walletAddress}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="font-mono text-xs text-muted-foreground">Network</span>
                                                    <span className="font-mono text-xs font-medium text-accent">{network}</span>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={logout}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-destructive/10 text-destructive font-mono text-xs rounded-lg hover:bg-destructive/20 transition-colors"
                                                >
                                                    <LogOut className="w-3.5 h-3.5" />
                                                    Disconnect
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={login}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border/60 font-mono text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
                            >
                                <div className="w-2 h-2 rounded-full bg-destructive" />
                                Login
                            </motion.button>
                        )}
                    </div>

                    <div className="flex md:hidden items-center gap-3">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            className="p-2.5 rounded-lg border border-border/60 hover:bg-muted transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        </motion.button>

                        {ready && authenticated ? (
                            <div 
                                className="relative"
                                onClick={() => setWalletOpen(!walletOpen)}
                            >
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border/60"
                                >
                                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                </motion.button>
                            </div>
                        ) : (
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={login}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border/60 font-mono text-xs uppercase"
                            >
                                <div className="w-2 h-2 rounded-full bg-destructive" />
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
