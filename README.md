# Ramsey six-person party problem

A small, reproducible example of agent-assisted mathematical research, with an interactive visualization and a complete proof.

**Problem:** What is the smallest number of people that guarantees either three mutual acquaintances or three mutual strangers? Relationships are mutual, and every pair is classified into exactly one of these categories.

**Answer: 6**, the classical Ramsey number R(3,3). This repository demonstrates an established theorem; it does not claim a new result or a solution to an open problem.

## The problem in simple words

Imagine you invite people to a party. For every pair, they either **know each other** or **have never met**.

We're looking for a group of three where either:

- **All three know each other**, or
- **None of the three know each other**.

The question is: **How many people must attend to guarantee that one of these groups exists?**

The answer is **six**. With five people, it's possible to avoid both kinds of group. With six, one must exist—whatever their relationships.

In the visualization, each dot is a person. Solid lines mean "know each other"; dashed lines mean "strangers." You're looking for a triangle made of **three solid lines or three dashed lines**.

## Visual walkthrough

![The walkthrough highlights Ben, Cara, and Dan connected by three dashed lines, meaning all three are strangers to each other.](docs/images/party-problem-walkthrough.png)

Here, Ben, Cara, and Dan are all strangers to each other. Their three dashed connections form one of the groups we are looking for.

## Explore

Open `index.html` in a modern browser. No server or installation is required. The page starts by explaining the party problem in plain words, then walks through nine illustrated steps, one compact screen at a time. The opening explanation appears on its own screen so it does not push the pictures and buttons below the fold. On larger screens, the explanation sits beside a larger diagram; on phones, the diagram uses the available width. Each forward button describes the next example. There are no relationship selectors or editing controls to learn. Solid lines mean two people know each other; dashed lines mean they are strangers. Only the named circles are people; crossings between lines are not extra people.

The editable source is `six-person-lab.html`; `index.html` is its standalone export, including presentation support. The fragment can also render inline in Codex.

## Reproduce the computation

Python 3.9 or later, with no third-party dependencies:

```sh
python3 verify.py
```

The verifier enumerates every labeled two-coloring for 3 through 6 vertices, checks every vertex triple, asserts independently expected counts, checks the explicit pentagon counterexample, and prints machine-readable JSON. Six vertices require checking 32,768 colorings, each containing 20 triples.

| People | Colorings | Colorings avoiding both types of triangle |
| --- | ---: | ---: |
| 3 | 8 | 6 |
| 4 | 64 | 18 |
| 5 | 1,024 | 12 |
| 6 | 32,768 | 0 |

Read [PROOF.md](PROOF.md) for the mathematical proof and [RESEARCH.md](RESEARCH.md) for the parallel investigation and rejected hypothesis.

The proof is written for human review; it is not machine-checked in a proof assistant. Exhaustive enumeration checks this finite instance independently. A browser is an exploration tool, not the basis of the proof.

## Optional browser checks

With Playwright and its Chromium browser installed in your development environment, run:

```sh
node test_ui.cjs
```

Set `CHROME_CHANNEL=chrome` to use an installed Google Chrome instead. The checks walk through all nine steps at phone and desktop widths, verify the example diagrams and navigation, and check for horizontal overflow and JavaScript errors. The visualization itself needs no dependencies.
