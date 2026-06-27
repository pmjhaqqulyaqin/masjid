---
name: Modern Islamic Tranquility
colors:
  surface: '#f8faf6'
  surface-dim: '#d8dbd7'
  surface-bright: '#f8faf6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f1'
  surface-container: '#eceeeb'
  surface-container-high: '#e7e9e5'
  surface-container-highest: '#e1e3e0'
  on-surface: '#191c1b'
  on-surface-variant: '#404944'
  inverse-surface: '#2e312f'
  inverse-on-surface: '#eff1ee'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#2b6954'
  primary: '#003527'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#95d3ba'
  secondary: '#52625c'
  on-secondary: '#ffffff'
  secondary-container: '#d3e3dc'
  on-secondary-container: '#566660'
  tertiary: '#502000'
  on-tertiary: '#ffffff'
  tertiary-container: '#733100'
  on-tertiary-container: '#ff985a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#d5e6df'
  secondary-fixed-dim: '#bacac3'
  on-secondary-fixed: '#101e1a'
  on-secondary-fixed-variant: '#3b4a44'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb68e'
  on-tertiary-fixed: '#331200'
  on-tertiary-fixed-variant: '#763300'
  background: '#f8faf6'
  on-background: '#191c1b'
  surface-variant: '#e1e3e0'
  emerald-deep: '#064E3B'
  mint-fresh: '#D1FAE5'
  gold-spiritual: '#D97706'
  amber-soft: '#FDE68A'
  surface-white: '#FFFFFF'
  text-primary: '#1F2937'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  prayer-time-display:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 1.25rem
  gutter-md: 1rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
  section-padding: 1.5rem
---

## Brand & Style
The design system for the Masjid Haqqul Yaqin mobile application is built on the philosophy of **Modern Islamic Minimalism**. It aims to evoke a sense of spiritual peace, clarity, and community trust. By blending traditional Islamic motifs with a clean, contemporary UI, the system balances the solemnity of a religious institution with the high-utility expectations of a premium mobile experience.

The visual direction is **Corporate / Modern** with a **Tactile** edge. It utilizes generous whitespace to allow information to breathe, while employing subtle gold accents and geometric Islamic patterns to provide a prestigious, "premium" feel. The interface prioritizes transparency and information density—specifically for prayer times and financial reports—ensuring that the community feels both informed and spiritually connected.

## Colors
The palette is rooted in the Deep Emerald Green (`#064E3B`), a color deeply synonymous with Islamic identity, representing life and paradise. This is paired with Mint Green for secondary surfaces to maintain a sense of freshness and light. 

Gold and Amber accents are used sparingly as "spiritual highlights" for high-importance items like current prayer times, active donation goals, or premium heading ornaments. The background is a crisp, clean white to ensure maximum legibility for long-form content like "Tausiyah" (sermons).

**Color Usage Guidance:**
- **Primary:** Navigation bars, primary action buttons, and active state indicators.
- **Secondary (Mint):** Card backgrounds, subtle success alerts, and highlight areas.
- **Tertiary (Gold):** Call-to-action iconography, decorative dividers, and "Infaq" (donation) related highlights.
- **Neutral:** Dark grays are used for body text to reduce eye strain compared to pure black.

## Typography
The typography system uses a sophisticated pairing of an elegant serif and a functional sans-serif. 

**Libre Caslon Text** is used for all headers and display titles. Its historical, literary character adds a sense of authority and timelessness, suitable for religious headings.

**Inter** is the workhorse for the application. Its high x-height and neutral character ensure that dense information—such as the prayer schedule table or financial logs—remains highly legible on mobile screens. 

Special attention is given to "Prayer Time" displays, which use a bolded Inter variant to ensure they are readable at a quick glance, even in low-light environments (e.g., during Fajr or Maghrib).

## Layout & Spacing
The layout follows a **Fluid Grid** model optimized for the mobile portrait aspect ratio. It uses a 4-column system with a standard `1.25rem` (20px) safety margin on the left and right edges.

**Information Hierarchy:**
- **The Dashboard:** Follows a "Card-Stack" rhythm where vertical spacing between different features (Prayer Times, Agenda, Laporan Infaq) is consistent at `2rem`.
- **The Grid:** Small utility items like "Petugas Harian" (Daily Staff) use a 2-column grid within the safe area.
- **Safe Areas:** Interactive elements maintain a minimum tap target of 44px, with `1rem` gutters between adjacent cards.

The "Teks Berjalan" (Marquee) feature from the reference should be implemented as a sticky top-bar announcement just below the header, utilizing the Deep Emerald background with white text.

## Elevation & Depth
The design system employs **Tonal Layers** and **Ambient Shadows** to create a soft, non-distracting depth.

- **Level 0 (Base):** The main background using `#FFFFFF`.
- **Level 1 (Cards):** All main modules (Agenda, Laporan) use a white surface with a very soft, diffused shadow (`0px 4px 20px rgba(6, 78, 59, 0.05)`). This subtle green tint in the shadow creates a "holographic" brand cohesion.
- **Level 2 (Active States):** Elements like current prayer time or active CTA buttons use a slightly deeper shadow and a thin, 1px border of `#D1FAE5`.
- **Glassmorphism:** Used exclusively for the bottom navigation bar and sticky headers to allow the "spiritual patterns" in the background to subtly peek through during scrolling.

## Shapes
The shape language is **Rounded**, moving away from the sharper edges of the reference website to create a more "app-centric" and friendly feel. 

Corner radii are standardized at `0.5rem` (8px) for standard cards and `1rem` (16px) for larger containers like the "Laporan Infaq" dashboard. High-action elements like the "Mari Ber-Infaq" button use a **Pill-shaped** geometry to distinguish them from information-only cards.

**Islamic Patterns:** 
Subtle, low-opacity (3-5%) geometric Islamic patterns (Star-and-Cross or Arabesque) are used as background fills for the top header section and the main donation card to provide a premium texture without interfering with text legibility.

## Components
- **Buttons:** Primary buttons are Solid Deep Emerald with white text. Secondary buttons are Outline-style with Emerald text. The "Infaq" button is a special Gold/Amber gradient to signify prestige.
- **Prayer Cards:** A horizontal scrolling list or vertical stack where the "Current/Next Prayer" is highlighted with a Mint background and a Gold left-border accent.
- **Infaq Tracker:** A specialized card featuring a progress bar (Amber on Mint background) to show donation goals for mosque renovations or programs.
- **Staff Chips:** Small, rounded-pill chips for "Imam" or "Muadzin" roles, using the Label-sm typography.
- **Daily Agenda:** A vertical list component where the date is housed in a Deep Emerald circle, similar to the reference layout but with softer corners and improved typography.
- **Navigation:** A bottom-tab bar with minimalist line icons. The center icon (likely "Pray" or "Qibla") is oversized and housed in a circular Deep Emerald container.