#!/usr/bin/env python3
"""Exhaustive certificate for the classical Ramsey number R(3,3)."""
import json
from collections import Counter
from itertools import combinations


def triangle_masks(n):
    edges = list(combinations(range(n), 2))
    indices = {edge: i for i, edge in enumerate(edges)}
    masks = [sum(1 << indices[e] for e in combinations(vertices, 2))
             for vertices in combinations(range(n), 3)]
    return edges, masks


def monochromatic_count(coloring, masks):
    return sum((coloring & mask) in (0, mask) for mask in masks)


def enumerate_colorings(n):
    edges, masks = triangle_masks(n)
    histogram = Counter(monochromatic_count(bits, masks)
                        for bits in range(1 << len(edges)))
    return {"vertices": n, "colorings": sum(histogram.values()),
            "triangle_free": histogram.get(0, 0),
            "minimum_triangles": min(histogram),
            "histogram": dict(sorted(histogram.items()))}


def main():
    expected = {3: (8, 6), 4: (64, 18), 5: (1024, 12), 6: (32768, 0)}
    reports = []
    for n, (total, free) in expected.items():
        report = enumerate_colorings(n)
        if (report["colorings"], report["triangle_free"]) != (total, free):
            raise AssertionError(f"Unexpected enumeration: {report}")
        reports.append(report)
    edges, masks = triangle_masks(5)
    pentagon = sum(1 << i for i, (a, b) in enumerate(edges) if b-a in (1, 4))
    if monochromatic_count(pentagon, masks) != 0:
        raise AssertionError("Pentagon counterexample failed")
    edges, masks = triangle_masks(6)
    two_groups = sum(1 << i for i, (a, b) in enumerate(edges) if (a < 3) == (b < 3))
    if monochromatic_count(two_groups, masks) != 2:
        raise AssertionError("Tight two-triangle example failed")
    if reports[-1]["minimum_triangles"] != 2:
        raise AssertionError("Six-vertex minimum must be two")
    print(json.dumps({"verified": True, "results": reports}, indent=2))


if __name__ == "__main__":
    main()
