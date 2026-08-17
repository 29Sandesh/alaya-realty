---
name: Alaya Sovereign Editorial
colors:
  surface: '#fdf9eb'
  surface-dim: '#dedacc'
  surface-bright: '#fdf9eb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f4e6'
  surface-container: '#f2eee0'
  surface-container-high: '#ece8da'
  surface-container-highest: '#e6e2d5'
  on-surface: '#1d1c14'
  on-surface-variant: '#45474b'
  inverse-surface: '#323127'
  inverse-on-surface: '#f5f1e3'
  outline: '#76777b'
  outline-variant: '#c6c6cb'
  surface-tint: '#5c5e65'
  primary: '#010306'
  on-primary: '#ffffff'
  primary-container: '#1a1d23'
  on-primary-container: '#82858c'
  inverse-primary: '#c4c6ce'
  secondary: '#745a34'
  on-secondary: '#ffffff'
  secondary-container: '#fedaaa'
  on-secondary-container: '#795e38'
  tertiary: '#000302'
  on-tertiary: '#ffffff'
  tertiary-container: '#022218'
  on-tertiary-container: '#6c8c7e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e2ea'
  primary-fixed-dim: '#c4c6ce'
  on-primary-fixed: '#191c22'
  on-primary-fixed-variant: '#44474d'
  secondary-fixed: '#ffddb1'
  secondary-fixed-dim: '#e3c193'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#5a431f'
  tertiary-fixed: '#c8eada'
  tertiary-fixed-dim: '#adcebf'
  on-tertiary-fixed: '#012017'
  on-tertiary-fixed-variant: '#2f4d41'
  background: '#fdf9eb'
  on-background: '#1d1c14'
  surface-variant: '#e6e2d5'
  paper-dark: '#E6E1D1'
  metallic-gold: '#A68B5B'
  forest-deep: '#081F18'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 64px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 40px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
  data-mono:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
spacing:
  margin-edge: 5vw
  gutter: 24px
  section-v-lg: 120px
  section-v-md: 80px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 40px
---

## Brand & Style

The brand personality is authoritative, convicted, and sophisticated. Designed for high-net-worth investors and institutional partners, the UI evokes the trust of a private wealth management firm while maintaining the aesthetic polish of a premium lifestyle journal.

The design style is a blend of **Editorial Minimalism** and **Corporate Modern**. It utilizes expansive whitespace to signify luxury and importance. High-contrast typography and a restricted, prestigious color palette create a sense of permanence and architectural stability. The visual mood is "Institutional Excellence"—clean, razor-sharp, and meticulously structured. Every element is intentional, avoiding decorative "fluff" in favor of clarity and conviction.

## Colors

The palette is anchored by "Paper" neutrals and "Ink" blacks to establish an editorial foundation. 

- **Primary (Ink):** Used for maximum contrast in typography and primary structural elements.
- **Secondary (Bronze):** A sophisticated metallic used for call-to-actions and subtle accents that suggest heritage and value.
- **Tertiary (Forest):** A deep, verdant green used for high-impact sections or premium backgrounds, providing depth without sacrificing the professional tone.
- **Neutral (Paper/Cream):** The primary canvas color, warmer and more premium than pure white, reducing eye strain and feeling more "physical" and tactile.

## Typography

Typography follows a classic editorial hierarchy. 

**EB Garamond** is used for all headlines and display text. It should be typeset with tight leading and slight negative letter-spacing for large displays to create a "locked-in" architectural feel.

**Hanken Grotesk** serves as the functional workhorse. Its geometric clarity ensures that complex property data and long-form advisory text remain highly legible. 

The system uses an **Uppercase Label** style for metadata and section overlines to provide a modern, structural counterpoint to the traditional serif headlines.

## Layout & Spacing

The layout is based on a **12-column fixed grid** for desktop, maximizing whitespace on ultra-wide screens to maintain a "centered boutique" feel.

- **Margins:** Generous 5vw side margins ensure content never feels cramped against the bezel.
- **Sectioning:** Large vertical gaps (120px+) are used to separate distinct thoughts and services, mimicking the pacing of a high-end physical prospectus.
- **Alignment:** Content is predominantly left-aligned or centered with asymmetrical balances to create visual interest.
- **Breakpoints:**
  - **Desktop (1440px+):** Full 12-column grid, 120px vertical spacing.
  - **Tablet (768px - 1024px):** 8-column grid, 80px vertical spacing, side margins reduced to 32px.
  - **Mobile (<768px):** 4-column grid, 60px vertical spacing, side margins 20px. Text-heavy blocks reflow to a single column.

## Elevation & Depth

This design system avoids heavy shadows in favor of **Tonal Layering** and **Razor-Sharp Outlines**.

- **Surfaces:** Use shifts between the neutral "Paper" (#F5F1E3) and "Paper-Dark" (#E6E1D1) to define containers and cards.
- **Outlines:** Use 1px solid borders in low-contrast tones (10-15% opacity of Ink) for container separation.
- **Shadows:** Only used sparingly on interactive elements (like primary buttons or active cards) as a "Soft Ambient" drop shadow: 0px 4px 20px rgba(0,0,0, 0.05).
- **Z-Index:** High-priority modals or navigation overlays use a subtle backdrop blur (8px) over a semi-transparent primary color to maintain focus without losing the editorial context.

## Shapes

The shape language is **Sharp**. To communicate precision, institutional rigor, and architectural permanence, all corners are set to 0px. 

This applies to:
- Buttons (Rectangular only).
- Input fields.
- Cards and containers.
- Image masks.

The only exception is for circular icons or numerical indicators, which should remain perfect circles to act as soft visual anchors within the rigid grid.

## Components

- **Buttons:** Primary buttons are sharp-edged, solid blocks of #8B6F47 or #1A1D23 with centered uppercase labels. Secondary buttons use a 1px border with an arrow icon (→) for directional clarity.
- **Cards:** Defined by 1px "Ink" borders or subtle tonal background shifts. No rounded corners. Content within cards should have generous internal padding (min 32px).
- **Input Fields:** Minimalist design—bottom border only (2px solid) when inactive, shifting to a full sharp-edged box when focused. Labels should be small-caps above the field.
- **Numerical Indicators:** Large, low-opacity serif numbers (e.g., 01, 02) used to guide the user through process steps or service categories.
- **Chips/Tags:** Sharp-edged, small-caps text inside a light-grey or bronze stroke container. Used for property status (e.g., "NOW SELLING").
- **Lists:** Clean, bulletless lists with horizontal dividers (1px hair-lines) between items to reinforce the grid.
- **Property Data Tables:** Use high-contrast headers in Hanken Grotesk Bold with light horizontal rules for row separation, prioritizing clarity of figures (sq. ft, price, location).