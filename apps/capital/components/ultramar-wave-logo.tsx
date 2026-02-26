export function UltramarWaveLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ultramar Capital Logo"
    >
      {/* Ocean waves - three layers representing depth */}
      
      {/* Bottom wave - deepest ocean */}
      <path
        d="M2 32 Q8 28 14 32 T26 32 T38 32 T46 32 L46 46 L2 46 Z"
        fill="oklch(0.35 0.10 240)"
        stroke="currentColor"
        strokeWidth="1"
      />
      
      {/* Middle wave - mid ocean */}
      <path
        d="M2 24 Q9 18 16 24 T30 24 T44 24 L46 46 L2 46 Z"
        fill="oklch(0.45 0.12 210)"
        stroke="currentColor"
        strokeWidth="1"
      />
      
      {/* Top wave - surface */}
      <path
        d="M2 16 Q10 10 18 16 T34 16 T46 16 L46 46 L2 46 Z"
        fill="oklch(0.55 0.15 230)"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      
      {/* Crest highlights */}
      <circle cx="18" cy="16" r="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="34" cy="16" r="1.5" fill="currentColor" opacity="0.4" />
      
      {/* Sun/moon rising over horizon */}
      <circle 
        cx="24" 
        cy="8" 
        r="4" 
        fill="none"
        stroke="currentColor" 
        strokeWidth="1.5"
      />
      <circle 
        cx="24" 
        cy="8" 
        r="2.5" 
        fill="oklch(0.65 0.12 220)"
        opacity="0.6"
      />
    </svg>
  )
}
