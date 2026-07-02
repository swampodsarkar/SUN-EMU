---
name: Nexus Console Interface
colors:
  surface: '#131318'
  surface-dim: '#131318'
  surface-bright: '#39383e'
  surface-container-lowest: '#0e0e13'
  surface-container-low: '#1b1b20'
  surface-container: '#1f1f25'
  surface-container-high: '#2a292f'
  surface-container-highest: '#35343a'
  on-surface: '#e4e1e9'
  on-surface-variant: '#c1c6d5'
  inverse-surface: '#e4e1e9'
  inverse-on-surface: '#303036'
  outline: '#8b919e'
  outline-variant: '#414752'
  surface-tint: '#a7c8ff'
  primary: '#a7c8ff'
  on-primary: '#003060'
  primary-container: '#0070d1'
  on-primary-container: '#f2f5ff'
  inverse-primary: '#005eb2'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#a9c7ff'
  on-tertiary: '#043061'
  tertiary-container: '#5171a6'
  on-tertiary-container: '#f3f5ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#004788'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#d6e3ff'
  tertiary-fixed-dim: '#a9c7ff'
  on-tertiary-fixed: '#001b3d'
  on-tertiary-fixed-variant: '#244779'
  background: '#131318'
  on-background: '#e4e1e9'
  surface-variant: '#35343a'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 72px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-lg:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  safe-area-x: 80px
  safe-area-y: 60px
  gutter-horizontal: 24px
  card-gap: 16px
  focus-scale: '1.1'
---

## Brand & Style

The design system is centered on the concept of "Immersive Futurism." It targets gamers who value a premium, cinematic experience that feels both high-tech and invisible, allowing game artistry to take center stage. 

The aesthetic is a sophisticated blend of **Modern Corporate** and **Glassmorphism**. It utilizes deep atmospheric depth, translucent layering, and subtle light-emittance (glows) to simulate a physical space within a digital screen. Interactions should feel fluid and expensive, evoking a sense of calm power and precision. The emotional goal is to move the user from the "utility" of a menu into the "emotion" of a game world seamlessly.

## Colors

The palette is anchored in **Deep Midnight Blue** and **Pure Black** to create an infinite sense of space. **PlayStation Blue (#0070d1)** is reserved strictly for interactive focus states, primary actions, and brand signatures. 

**White** is used for high-contrast legibility and iconography. To achieve the glassmorphic effect, use varying levels of opacity on neutral surfaces rather than solid grays. Backgrounds should be dynamic; the interface sits on top of a blurred, high-fidelity game asset or a slow-moving atmospheric gradient that responds to the selected content.

## Typography

This design system uses a hierarchy that prioritizes clarity at a distance (10-foot UI). 

- **Plus Jakarta Sans** provides the geometric, friendly yet professional weight required for massive display titles and game names. 
- **Hanken Grotesk** is used for descriptions and system messages, offering high legibility in dense blocks.
- **Geist** is employed for technical labels, button prompts, and metadata, providing a monospaced feel that reinforces the "tech" nature of a console.

All headings should lean towards tighter letter-spacing to feel "locked-in" and cinematic. Mobile variants scale significantly to handle secondary screen experiences (Remote Play/App).

## Layout & Spacing

The layout is a **Horizontal Fluid Grid** optimized for controller navigation. 

1. **The Global Rail:** A thin horizontal bar at the top or bottom for system-level navigation.
2. **The Content Row:** The primary focal point. Large, high-impact cards that scale up on focus.
3. **The Information Panel:** Below or beside the focused item, providing metadata in a fixed vertical or horizontal container.

Breakpoints are less about device width and more about "Safe Areas." Ensure all critical UI elements stay within the 80px/60px margin to avoid TV overscan. Spacing follows a strict 8px rhythm. Focused elements should use a scale-transform (1.1x) rather than just a border to indicate selection.

## Elevation & Depth

Depth is conveyed through **Optical Stack Levels** rather than traditional drop shadows:

- **Level 0 (Background):** Full-screen game artwork with a 40px background blur and a dark midnight overlay.
- **Level 1 (Surface):** Semi-transparent glass panels (`rgba(255, 255, 255, 0.05)`) with a 20px backdrop filter.
- **Level 2 (Active/Focus):** Elements glow from within. Use a `box-shadow` of `0 0 30px` using the primary PlayStation blue at 40% opacity. 

Outlines should be "Ghost Borders"—1px strokes with 15-20% white opacity—giving the appearance of etched glass.

## Shapes

The shape language is modern and approachable, avoiding the harshness of sharp corners. Standard components use a **0.5rem (8px)** corner radius to match the hardware's industrial design. 

For game tiles, the radius should be slightly more pronounced to feel like "objects," while system-level utility buttons (like "Filter" or "Sort") use pill shapes to distinguish them from content.

## Components

### Cards & Game Tiles
The core of the UI. Default state is a glass container with a subtle inner glow. On **Focus**, the card scales by 10%, the border turns PlayStation Blue, and a soft blue outer glow is applied. The metadata below the card should fade in only on focus.

### Buttons
Primary buttons are solid White or PlayStation Blue with bold black/white text. Secondary buttons are "Ghost" style: transparent background with a 1px white border. Button labels should always be paired with a geometric icon prompt (e.g., Cross, Circle symbols).

### Progress Bars
Ultra-slim (4px height). The background is a dark semi-transparent track, and the fill is a vibrant gradient of Primary Blue to a lighter cyan.

### Chips & Tags
Used for categories like "PS5," "Full Game," or "Plus." These should be small, high-contrast black pills with white text, or blue pills to indicate premium status.

### Input Fields
Minimalist lines rather than boxes. On focus, the line expands into a glowing PlayStation Blue underline. Use Geist for the input text to maintain a technical, precise feel.

### Hints (Button Prompts)
Small circular icons representing controller buttons (O, X, Square, Triangle) followed by Geist-font labels. These should be anchored to the bottom right of the screen at all times as a "Navigation Guide."