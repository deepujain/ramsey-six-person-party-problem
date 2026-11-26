# Investigation record

This is a short, real parallel-agent exercise on a known theorem. No hourly meetings, prolonged autonomous search, or new mathematical discovery are claimed.

## Starting hypotheses

1. Five people might suffice.
2. Six people suffice, via a local majority argument.
3. Exhaustive enumeration can independently check the threshold.

## Independent branches

- **proof:** Derived the six-vertex pigeonhole proof and identified the faulty assumption that four edges must contain three of one color.
- **counterexample:** Constructed complementary five-cycles on K5 and checked that neither contains a triangle. Flagged that pentagram crossings must not be treated as vertices.
- **enumeration:** Executed an independent Python bitmask enumeration. Found 12 triangle-free labeled colorings of K5, none of K6, and a minimum of two monochromatic triangles in K6.

## Synthesis

Reject hypothesis 1 using an explicit counterexample. Keep hypothesis 2 as the proof. Keep hypothesis 3 as reproducible corroboration. The failed five-person claim explains why the majority argument needs five incident edges rather than four.

The lead agent assembled the proof, added the counting proof of the stronger two-triangle bound, and built the interactive visualization and standalone verifier. The three branches received the same problem; their reports are not evidence of model or statistical independence.

## Evidence boundaries

- The theorem applies to complete undirected graphs with exactly two edge colors.
- Counts refer to labeled graphs with fixed color names; no symmetry reduction was used.
- Random examples in the visualization illustrate behavior. The exhaustive verifier and mathematical argument establish the result.
- This is not a literature review or a proof-assistant formalization.

## Playable presentation

The original graph walkthrough was replaced with Ramsey’s Garden after feedback that the explanation was too text-heavy and the picture too abstract. The garden uses selectable characters and shows only the relationships currently being explored. Its two proof scenes use the same argument in PROOF.md; the artwork introduces no new assumptions. Casa de Gemas inspired the watercolor-world presentation. The implementation and illustrations are original.
