# Theorem: R(3,3) = 6

Model each person as a vertex of a complete graph. Color every edge red for acquaintances or blue for strangers. We seek a triangle whose three edges have the same color.

## Upper bound: six always suffice

Choose a vertex v. Of its five incident edges, at least three have the same color, by the pigeonhole principle. By symmetry, suppose va, vb, and vc are red.

- If any edge between a, b, and c is red, that edge and its two red edges to v form a red triangle.
- If no edge between them is red, all three edges ab, bc, and ca are blue. They form a blue triangle.

Both cases produce a monochromatic triangle. Thus R(3,3) <= 6.

## Lower bound: five can fail

Number five vertices 0 through 4 around a pentagon. Color ij red exactly when i-j is congruent to 1 or -1 modulo 5. Color the other edges blue.

The red graph is the pentagon cycle 0-1-2-3-4-0. The blue graph is the cycle 0-2-4-1-3-0. A cycle of length five contains no triangle. Thus neither color has a triangle, and R(3,3) > 5.

Combining the bounds proves R(3,3) = 6.

## Bonus: six actually force at least two triangles

Let d_v be the red degree of vertex v. Its blue degree is 5-d_v. The quantity d_v(5-d_v) counts pairs of incident edges with different colors at v.

A nonmonochromatic triangle has exactly two vertices where its two incident edges differ in color. A monochromatic triangle contributes zero. Therefore the number of nonmonochromatic triangles is

    (1/2) * sum_v d_v(5-d_v).

For integer d_v between 0 and 5, d_v(5-d_v) <= 6. There are six vertices and 20 triangles in total. Consequently the number of monochromatic triangles is at least

    20 - (1/2) * 6 * 6 = 2.

This bound is attainable: split the vertices into two groups of three, color edges within groups red and all edges between groups blue. The two red groups are the only monochromatic triangles.
