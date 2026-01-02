export function OakLeafLogo({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Ultramar Capital Logo"
        >
            {/* Main sail - represents momentum and growth */}
            <path
                d="M12 42 L32 6 C32 6 40 20 42 42 H12 Z"
                fill="currentColor"
                opacity="0.95"
            />

            {/* Secondary sail - represents depth and stability */}
            <path
                d="M8 42 L24 16 L30 42 H8 Z"
                fill="currentColor"
                opacity="0.55"
            />

            {/* Horizon/foundation line with gold accent */}
            <rect
                x="6"
                y="42"
                width="36"
                height="2"
                fill="oklch(0.70 0.10 85)"
            />

            {/* Subtle detail lines for precision */}
            <line x1="24" y1="16" x2="24" y2="42" stroke="oklch(0.70 0.10 85)" strokeWidth="0.5" opacity="0.3" />
            <line x1="32" y1="6" x2="32" y2="42" stroke="oklch(0.70 0.10 85)" strokeWidth="0.5" opacity="0.2" />
        </svg>
    )
}
