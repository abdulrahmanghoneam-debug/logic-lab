# LOGIC LAB — Project Constitution

**Product Name:** LOGIC LAB  
**Tagline:** *Think. Connect. Prove.*  
**Course Domain:** University Discrete Structures (Propositional Logic, Truth Tables, Boolean Algebra, Digital Logic Circuits)  
**Target Live Audience:** Dr. Mahmoud and university computer science / mathematics faculty and students.

## 1. Product Identity & Mission
LOGIC LAB is an interactive computational mathematics environment—not a static slide deck or mockup—that transforms propositional logic expressions into live truth tables, canonical Boolean forms (SOP/POS), step-by-step algebraic proofs, and animated digital logic circuits. The platform introduces itself cinematically and collaborates with Dr. Mahmoud via an interactive voice-and-text assistant backed exclusively by a deterministic local Logic Engine.

## 2. Visual Design System — "Cinematic Computational Intelligence"
- **Primary Canvas:** Near-black `#050914` and Deep Navy `#0B132B`
- **Elevated Surfaces:** Slate Navy `#111C38` with crisp `1px solid rgba(56, 189, 248, 0.16)` structural hairlines
- **Primary Accent:** Electric Blue `#2563EB`
- **Signal / Active Accent:** Cyan `#06B6D4` / `#22D3EE`
- **Semantic Status:** Verified Emerald `#10B981`, Caution Amber `#F59E0B`, Contradiction/Error Rose `#F43F5E`
- **Typography:** `Space Grotesk` (Display & kinetic titles), `Inter` (UI & explanations), `JetBrains Mono` (Mathematical notation, truth tables, Boolean equations)
- **Design Restraint:** Clean geometric precision, subtle grid depth, zero gaudy gradients, zero cluttered glassmorphism, high WCAG contrast (`>= 4.5:1`), and full `prefers-reduced-motion` support.

## 3. Mathematical Accuracy Mandate
- **Zero Hallucinated Math:** The voice/AI assistant NEVER invents truth values, simplifications, or circuit outputs. Every mathematical operation executes through the deterministic `LogicEngine` module.
- **Full Operator Support:** Variables `P, Q, R, S`, constants `T/F` (`1/0`), operators `¬` (NOT), `∧` (AND), `∨` (OR), `⊕` (XOR), `→` (IMPLICATION), `↔` (BICONDITIONAL), plus digital gates `NAND`, `NOR`, `XNOR`.
- **Standard Textbook Precedence:** `¬` > `∧`/`NAND` > `⊕` > `∨`/`NOR` > `→` (right-associative) > `↔`/`XNOR`.
- **Equivalence Verification:** Every conversion (Expression → Truth Table → SOP/POS → Logic Circuit → Boolean Simplification) is mathematically verified via exhaustive truth-table comparison.

## 4. Motion Design & 15-Second Opening Storyboard
1. **0.0s – 3.0s (Ignition):** Deep navy-black spatial void; Three.js procedural 3D wireframe lattice and floating logical nodes (`¬, ∧, ∨, →, ↔, ⊕`) converge along geometric axes.
2. **3.0s – 6.5s (Structural Formation):** Abstract nodes snap into a luminous truth-matrix and circuit-wire topology (2D-to-3D parallax transition).
3. **6.5s – 10.0s (Identity Reveal):** Kinetic typography reveals **LOGIC LAB** and tagline **THINK. CONNECT. PROVE.** with precision cyan light sweep.
4. **10.0s – 15.0s (Assistant Welcome):** The 6-state animated AI orb materializes smoothly, greets Dr. Mahmoud with synchronized subtitles and natural browser speech synthesis, and offers direct entry into Guided Tutorial, Playground, Live Challenge, or Presentation Mode.
5. **Controls:** Always-visible Skip Intro, Mute/Audio toggle, Replay Intro, and Reduced-Motion respect.

## 5. Core Functional Modules
1. Cinematic Full-Screen Welcome Showreel
2. Animated 6-State Voice & Text Assistant (Idle, Listening, Thinking, Speaking, Processing, Error; English & Arabic; graceful fallback)
3. Propositional Logic Workspace (visual builder, AST precedence tree, equivalence checker, natural-language parser with ambiguity clarification)
4. Truth-Table Generator (intermediate columns, row explainer, Tautology/Contradiction/Contingency, T/F & 1/0 toggle, Copy & CSV/JSON export)
5. Interactive Digital Logic Circuit Simulator (SVG IEEE gates, clickable live inputs, animated signal pulses, circuit-to-expression)
6. Unified Conversion Studio (Expression ↔ Truth Table ↔ SOP ↔ POS ↔ Circuit with live equivalence badge)
7. Interactive Boolean Algebra Lab (all 9 law families + step-by-step simplifier with rule explanations)
8. 8-Stage Guided Interactive Tutorial (Skip, Pause, Replay, Lesson jump, Quiz feedback)
9. Live Challenge Mode (3 difficulty tiers + instant reveal of answer, steps, truth table, circuit, verification)
10. Professor Presentation Mode (clean full-screen stage, keyboard navigation, prominent assistant, instant demo triggers)
