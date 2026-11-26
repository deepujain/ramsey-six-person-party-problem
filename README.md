# Ramsey’s Garden · the six-person party problem

**[Play in your browser](https://deepujain.github.io/ramsey-six-person-party-problem/)** — no download, installation, or account.

A watercolor garden party with a mathematical secret. Tap the guests, follow the ribbons, and discover why inviting one more person makes a pattern unavoidable.

![An illustrated garden party. Amy, Cara, and Fay are selected; their three blue ribbons show that they are all strangers to each other.](docs/images/party-problem-walkthrough.png)

## The problem in simple words

Imagine you invite people to a party. For every pair, they either **know each other** or **have never met**.

We're looking for a group of three where either:

- **All three know each other**, or
- **None of the three know each other**.

**How many people must attend to guarantee that one of these groups exists?**

The answer is **six**, the classical Ramsey number R(3,3). Five people can avoid both kinds of group. Six cannot, whatever their relationships. This is a demonstration of an established theorem, not a claim of a new discovery.

## How to play

1. Meet the five guests. Tap any three names to reveal their relationships. Gold ribbons mean they know each other; dashed blue ribbons mean they have never met. This particular party of five has no matching trio.
2. Invite Fay, the sixth guest. Find a trio with three matching ribbons. Tap the owl if you want a hint.
3. Discover why six always works through two illustrated possibilities. Then host another party with different relationships and find its hidden trio.

The artwork fills the screen, with touch and keyboard controls and no page scrolling at the tested phone and desktop sizes. Sound is optional and off by default. Reduced-motion preferences are respected. “The puzzle” opens the full plain-language explanation.

**Offline:** download [index.html](https://github.com/deepujain/ramsey-six-person-party-problem/raw/refs/heads/main/index.html) and open it in a modern browser.

## A little world, one file

`index.html` is both the source and the runnable game. Original Canvas 2D illustration, painted scenery, selectable characters, gently moving characters, and optional Web Audio chimes. No images, external libraries, external fonts, network requests, or build step are needed to play.

The visual approach is inspired by [Casa de Gemas](https://github.com/deepujain/casadegema): a hand-painted world, interactions in the scene, and short hints from an owl. The garden illustration and implementation here are original; this is not a copy of its game or source.

The complete human-readable argument is in [PROOF.md](PROOF.md). The parallel agents’ investigation is recorded in [RESEARCH.md](RESEARCH.md).

## Reproduce the mathematical check

Python 3.9 or later, with no third-party dependencies:

```sh
python3 verify.py
```

This enumerates every labeled two-coloring for 3 through 6 vertices, checks every vertex triple, verifies the pentagon counterexample and the tight two-triangle example, and prints machine-readable JSON.

| People | Possible relationship arrangements | Arrangements with neither kind of trio |
| --- | ---: | ---: |
| 3 | 8 | 6 |
| 4 | 64 | 18 |
| 5 | 1,024 | 12 |
| 6 | 32,768 | 0 |

The garden’s initial five-person arrangement is two complementary five-cycles. Adding Fay as a stranger to everyone reveals a trio. A single example alone does not establish the guarantee; the two-case proof and exhaustive check do.

The proof is for human review, not a proof-assistant formalization.

## Optional browser checks

With Playwright and Chromium installed in your development environment:

```sh
node test_ui.cjs
```

Set `CHROME_CHANNEL=chrome` to use installed Google Chrome. Tests cover the five-person counterexample, successful discovery with six, both proof cases, a randomized party, the rules dialog, and layout on phones, tablets, desktops, and a landscape phone. Optional screenshots are written to an existing directory given by `SCREENSHOT_DIR`.
