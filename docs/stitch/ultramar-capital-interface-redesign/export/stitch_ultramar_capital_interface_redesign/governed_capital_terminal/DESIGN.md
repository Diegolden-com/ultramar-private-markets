---
name: Governed Capital Terminal
colors:
  surface: '#121316'
  surface-dim: '#121316'
  surface-bright: '#38393c'
  surface-container-lowest: '#0d0e10'
  surface-container-low: '#1b1c1e'
  surface-container: '#1f2022'
  surface-container-high: '#292a2c'
  surface-container-highest: '#343537'
  on-surface: '#e3e2e5'
  on-surface-variant: '#c3c5d9'
  inverse-surface: '#e3e2e5'
  inverse-on-surface: '#2f3033'
  outline: '#8d90a2'
  outline-variant: '#434656'
  surface-tint: '#b6c4ff'
  primary: '#b6c4ff'
  on-primary: '#002780'
  primary-container: '#0055ff'
  on-primary-container: '#e3e6ff'
  inverse-primary: '#004dea'
  secondary: '#c5c7c8'
  on-secondary: '#2e3132'
  secondary-container: '#444749'
  on-secondary-container: '#b3b5b7'
  tertiary: '#c0c7d6'
  on-tertiary: '#2a313d'
  tertiary-container: '#616876'
  on-tertiary-container: '#e1e8f8'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b3'
  secondary-fixed: '#e1e2e4'
  secondary-fixed-dim: '#c5c7c8'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#dce2f3'
  tertiary-fixed-dim: '#c0c7d6'
  on-tertiary-fixed: '#151c27'
  on-tertiary-fixed-variant: '#404754'
  background: '#121316'
  on-background: '#e3e2e5'
  surface-variant: '#343537'
  surface-ink: '#07080A'
  surface-paper: '#FFFFFF'
  border-muted: '#1F2937'
  interactive-focus: '#0055FF'
  status-signal: '#0055FF'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.08em
  data-mono-lg:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: -0.01em
  data-mono-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
  headline-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
spacing:
  unit: 4px
  gutter: 1px
  margin-sm: 16px
  margin-md: 32px
  margin-lg: 48px
  grid-col-width: calc(100% / 12)
---

## Brand & Style

This design system establishes a "Governed Capital Terminal" aesthetic, designed for high-stakes institutional finance where clarity, auditability, and authority are paramount. The visual language is severe and disciplined, intentionally eschewing the "friendly" tropes of consumer fintech in favor of a raw, functional transparency that mirrors a Bloomberg terminal or a sovereign wealth fund's internal interface.

The design style is **High-Contrast / Modern Brutalist**. It leverages a rigid structural grid, thin 1px borders, and a monochromatic foundation to convey a sense of permanence and meticulousness. Emotional responses should range from "intellectually secure" to "operationally precise." The interface doesn't just display data; it validates it.

## Colors

The palette is strictly governed. The primary experience is anchored in a deep, "ink" black (`#07080A`) to minimize ocular strain during long sessions and maximize the contrast of data. Pure white (`#FFFFFF`) is used for primary typography and highlights, creating a razor-sharp read.

A restrained, high-chroma Blue (`#0055FF`) acts as the "Signal" color. It is reserved exclusively for interactive elements, primary call-to-actions, and active data states. Neutral grays are used sparingly for non-critical metadata and secondary borders, ensuring the hierarchy is dominated by the black/white relationship.

## Typography

Typography functions as a tool for classification. 

- **Authority (Playfair Display):** Used for large headlines, asset titles, and editorial "Memos." It signifies the institutional weight behind the data.
- **Utility (Inter):** The primary engine for functional UI, body descriptions, and interactive elements. It provides neutral legibility.
- **Verification (JetBrains Mono):** Reserved for all numbers, data points, status labels, and metadata. Monospacing ensures that columns of financial figures align perfectly for visual auditing.

Labels should frequently use **Uppercase Mono** with increased letter-spacing to distinguish them from actionable content.

## Layout & Spacing

The layout follows a **Fixed-Grid Terminal** model. The screen is partitioned into "cells" using a 12-column grid. Borders are used instead of negative space to define relationships; every container is explicitly bounded by a 1px border.

The spacing rhythm is dense but calm, utilizing a 4px baseline unit. 
- **Desktop:** 12-column grid with 1px borders between columns (no gutters, just lines). 48px outer margins.
- **Mobile:** 4-column fluid grid. 16px margins.
- **Hatch Textures:** Use subtle 45-degree hatch patterns (1px lines) for background empty states or "locked" data sections to provide tactile depth without adding color weight.

## Elevation & Depth

This design system rejects shadows. Depth is communicated through **Tonal Stacking** and **Line Weight**.

- **Level 0 (Floor):** The base terminal background (`#07080A`).
- **Level 1 (Cells):** Defined by 1px solid borders (`#1F2937`). 
- **Level 2 (Inlays):** For active risk blocks or signal modules, use a slightly lighter background (`#111827`) or a hatch texture.
- **Active Focus:** A 1px solid Primary Blue (`#0055FF`) border is the only indicator of "lift" or focus. 

Avoid all blur effects. Surfaces should appear as physical etched glass or digital ink on a screen.

## Shapes

Shapes are strictly **Sharp (0px)**. All containers, buttons, and input fields must have square corners to maintain the architectural integrity of the grid. 

A maximum of **2px radius** is permitted only on small UI chips or toggle switches to provide a subtle ergonomic distinction from the structural containers, but the default remains zero-radius.

## Components

- **Signal Tables:** Tables must use `JetBrains Mono` for all data rows. Alternating row highlights are not used; instead, use 1px horizontal dividers. Probability spreads are shown as horizontal bar fragments within a cell.
- **Risk Blocks:** Rectangular containers with a `label-mono-sm` header. If a risk is critical, the top 1px border becomes the Primary Blue.
- **Data Room Status:** Use small square indicators (not circles). Active status = solid Blue; Inactive = transparent with White border; Pending = 1px hatch fill.
- **Buttons:** Sharp 1px borders. Default state: Black background, White border. Hover state: Primary Blue background and border. All text in `label-mono-sm` uppercase.
- **Asset Memos:** These sections shift to `Inter` for body text with a `Playfair Display` header. They should feel like a physical printed document embedded within the terminal.
- **Input Fields:** Bottom-border only (1px white) for a "ledger" look, shifting to Primary Blue on focus. Labels sit permanently above the line in Mono.