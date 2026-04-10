# Design System Specification: The Ethereal Assistant

## 1. Overview & Creative North Star
**Creative North Star: "The Liquid Sanctuary"**

This design system moves away from the sterile, robotic nature of traditional AI interfaces toward a "Liquid Sanctuary"—a space that feels intelligent yet organic, premium yet approachable. We reject the rigid, boxy layouts of standard Material Design in favor of **Tonal Layering** and **Liquid Glass** effects. 

To achieve a high-end editorial feel, we prioritize intentional asymmetry and massive breathing room. The UI should not feel like a collection of buttons; it should feel like a series of fine paper sheets and frosted glass panes floating in a warm, sun-drenched room. We break the "template" look by using exaggerated typographic scales and overlapping elements that defy the standard container-and-border logic.

---

## 2. Color & Surface Architecture

### The Palette
We utilize a sophisticated warm-neutral base to evoke "intelligence and calm." The primary accent is a high-energy vermillion, used sparingly to guide the eye.

*   **Core Background:** `#faf9f5` (A breath of warm air)
*   **Primary Accent:** `#a83300` (The spark of intelligence)
*   **Secondary Interaction:** `#b81847` (The "Stitch" of human touch)
*   **Surface Hierarchy:**
    *   `surface-container-lowest`: `#ffffff` (Purest lift)
    *   `surface-container-low`: `#f5f4f0` (Standard card base)
    *   `surface-container-high`: `#e9e8e4` (Deepest indentation)

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Content boundaries must be established exclusively through:
1.  **Background Shifts:** Transitioning from `surface` to `surface-container-low`.
2.  **Shadow Depth:** Using diffused ambient light to lift an element.
3.  **Negative Space:** Using the 8dp grid to create gaps that act as invisible dividers.

### The Glass & Gradient Rule
To achieve the "Liquid Glass" aesthetic, floating components (like the chat input or floating action buttons) must use `surface-container-lowest` with a **20-40px Backdrop Blur**. Apply a subtle linear gradient from `primary` to `primary-container` (vermillion to deep orange) for CTAs to give them a "soul"—a vibrating energy that flat hex codes cannot replicate.

---

## 3. Typography: Editorial Authority

We use a dual-font strategy to balance technical precision with human warmth.

*   **Display & Headlines (Manrope):** High-character, geometric sans-serif. Use `display-lg` (3.5rem) with tight letter-spacing for hero moments to create a "High-Fashion" editorial impact.
*   **Body & UI (Plus Jakarta Sans):** Modern, clean, and highly legible. 
    *   **Messages:** Use `body-lg` (16sp-18sp) with a generous 1.6 line-height to ensure the AI's "voice" feels calm and unhurried.
*   **Hierarchy Note:** Always lead with a strong `headline-sm` to frame a view, followed by significantly lighter `body-md` text. This high contrast in weight conveys startup-like confidence.

---

## 4. Elevation & Depth: Tonal Layering

Traditional "drop shadows" are too heavy for this system. We use **Tonal Layering** to create a 3D environment.

*   **The Layering Principle:** Instead of a shadow, place a `surface-container-lowest` card on a `surface-container-low` background. The slight shift in "warmth" creates a natural, sophisticated lift.
*   **Ambient Shadows:** For floating elements, use a "Cloud Shadow":
    *   *X: 0, Y: 12, Blur: 40, Spread: 0, Color: rgba(38, 37, 30, 0.06)*.
    *   The shadow color is never black; it is a tinted version of `on-surface` to mimic natural light.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., in high-contrast modes), use the `outline-variant` at **15% opacity**. This keeps the "Liquid" feel without creating a hard cage around the content.

---

## 5. Components

### The Chat Bubbles (Message Cards)
*   **Logic:** No borders. 
*   **Radius:** 20dp for the main body, with a "stitch" effect—a smaller 4dp radius on the corner pointing toward the sender.
*   **Color:** User messages utilize a subtle `surface-container-high`; AI responses utilize `surface-container-lowest` with a 4% ambient shadow.

### Liquid Input Field
*   **Shape:** 32dp+ Full Pill.
*   **Style:** `surface-container-lowest` with a 25px backdrop blur. 
*   **Interaction:** On focus, the `outline` token pulses at 20% opacity. Avoid a solid 100% stroke.

### Buttons (The "Glass" CTA)
*   **Primary:** Gradient fill (`primary` to `primary-container`). 24dp radius. No shadow.
*   **Secondary:** Ghost style. Transparent fill with a `secondary_fixed` text color. On hover, transition to `on_secondary_fixed_variant` background at 10% opacity.

### Navigation / Lists
*   **Rule:** **Forbid the use of divider lines.**
*   Separate list items using `body-md` vertical spacing (16dp-24dp). Use a `surface-container-low` hover state that bleeds to the edges of the screen, creating a "liquid" selection effect.

---

## 6. Do’s and Don’ts

### Do:
*   **DO** use asymmetric margins (e.g., 24dp left, 32dp right) to give the layout an editorial, "non-app" feel.
*   **DO** allow typography to breathe. If in doubt, add 8dp of extra vertical padding.
*   **DO** use "Liquid Glass" overlays for modal headers to keep the user grounded in the background context.

### Don't:
*   **DON'T** use 1px solid lines. They break the "Liquid" illusion and feel like a template.
*   **DON'T** use pure black (`#000000`). Our "on-surface" colors are warm charcoals to maintain the premium, soft aesthetic.
*   **DON'T** use standard Material shadows. They are too aggressive for this palette. Stick to the Cloud Shadow or Tonal Layering.
*   **DON'T** crowd the screen. This system is for an "Intelligent, Calm" experience—if the screen feels busy, the intelligence is lost.