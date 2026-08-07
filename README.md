# instaLILY-NYC

Agent definitions and working notes.

## Agents

| File | What it does |
|---|---|
| [`agent/business.md`](agent/business.md) | Business-lens code reviewer. Point it at code and it judges customer fit, production gaps, and whether the work overlaps InstaLILY's existing product line. Carries a dated reference on the company, products, customers, and positioning. |
| [`agent/designer.md`](agent/designer.md) | Component builder. Creates UI components and places them in the global components directory (`src/components`). Enforces structure, checks for existing components before creating, and matches project conventions. |
| [`agent/ENGINEERING-REVIEW-AGENT.md`](agent/ENGINEERING-REVIEW-AGENT.md) | Code-quality reviewer. Stack-agnostic — scopes the project first, then applies only the relevant sections. Covers correctness, security, observability, agent/LLM systems, edge runtimes, and InstaLILY's platform conventions. |

## Using it

It's a reference doc, not an auto-registered Claude Code subagent — invoke it by path:

```
Using @agent/business.md, review src/lib/scoring.ts
```

To make it auto-discoverable to Claude Code instead, copy it to `.claude/agents/` and add `name` / `description` frontmatter.

## Sourcing

`agent/business.md` is built entirely from public pages on instalily.ai, snapshot dated **2026-08-06**. Metrics in it are company-reported marketing claims, not audited figures.

The file carries its own freshness protocol — it re-checks `/products` and `/news` before making product-overlap calls, since that's the part most likely to have moved. Refresh the baseline by re-reading the source list at the bottom of the freshness section.
