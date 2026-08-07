# Available Agents

This repo is a **library of portable agent definitions** for InstaLILY work. It contains no application code — just the markdown below and in `agent/`.

That matters for how you use it: these agents are meant to be pointed at *other* projects. "Review the codebase" run against this repo would review the agent definitions themselves, which is almost never what you want.

## Using them

From inside a project you want to work on, reference the agent by path:

```
Using @agent/business.md, review src/lib/scoring.ts
```

If the target project is a different repo, either copy the file in or give the absolute path:

```
Using ~/repositories/instaLILY-NYC/agent/business.md, review this feature
```

---

## Designer Agent
**File:** `agent/designer.md`

Builds UI components and places them correctly. Matches the existing design system rather than introducing new patterns.

**Capabilities:**
- Component creation (buttons, forms, cards, modals, tables)
- Placement into `src/components/` by category, with feature- and page-local fallbacks
- Detects the target project's framework, styling, component library, and conventions before writing
- TypeScript types, accessibility, composition patterns
- Tests and Storybook stories where the project already has them

**Does not** decide whether a component should exist — that's already been decided.

**Usage:**
```
Using @agent/designer.md, create a Button component with primary and secondary variants
```
```
Using @agent/designer.md, build a Modal component with close button and overlay
```

---

## Business Agent
**File:** `agent/business.md`

Reviews work through a commercial lens. Judges customer fit, production gaps, and product overlap against InstaLILY's line.

**Capabilities:**
- Customer and segment fit — which workflow, which buyer, which measurable outcome
- Gap identification against what reaches production: integration, placement, audit, human-in-the-loop, adaptability
- Product overlap detection (Lily, FDE, InstaProspect, Platform, Small Data Center) on a four-level rubric
- Carries a dated reference on the company, products, customers, proof points, and positioning
- Live-checks `instalily.ai/products` and `/news` before any overlap call, since that's what changes

**Output is deliberately terse** — under 200 words, verdict first, no padding.

**Usage:**
```
Using @agent/business.md, review this feature for customer fit
```
```
Using @agent/business.md, check if this module overlaps with InstaProspect
```

---

## Engineering Review Agent
**File:** `agent/ENGINEERING-REVIEW-AGENT.md`

Code-quality review for production readiness. **Stack-agnostic** — works on web apps, backend services, agent/LLM systems, data pipelines, CLIs, and edge runtimes.

**Capabilities:**
- Scopes the project first (type, maturity, runtime, blast radius), then applies only the relevant sections — a prototype isn't judged as production
- Universal: architecture, correctness and bugs, security, error handling and observability, code quality
- Conditional: frontend, backend/API, data and persistence, scalability
- **Agent & LLM systems** — silent fabrication on fallback, unpinned or invalid model IDs, unmeasured run-to-run variance, tool output treated as data not instructions, human-in-the-loop on irreversible actions
- **Edge and on-prem** — degradation when the network is gone, resource ceilings, update and rollback on unattended hardware
- **InstaLILY platform conventions** — typed contracts, scoped connectors, secrets at the gateway, audit attribution, tenant isolation, no new system of record

**Usage:**
```
Using @agent/ENGINEERING-REVIEW-AGENT.md, review this codebase for production readiness
```
```
Using @agent/ENGINEERING-REVIEW-AGENT.md, review only the agent/LLM aspects
```

---

## Which agent when

| Question | Agent |
|---|---|
| "Build me a component" | Designer |
| "Is this code sound?" | Engineering Review |
| "Should this exist? Who buys it?" | Business |
| "Does this duplicate something we ship?" | Business |
| "Is this safe to put in front of a customer?" | Engineering Review, then Business |

Business and Engineering are complementary and don't overlap by design: **Engineering judges whether the code is sound. Business judges whether it should exist.** Running both gives you the full picture on anything customer-facing.

## Quick reference

| Agent | Purpose | Trigger |
|-------|---------|---------|
| Designer | Build UI components | `@agent/designer.md` |
| Business | Commercial and customer-fit review | `@agent/business.md` |
| Engineering | Code quality, security, production readiness | `@agent/ENGINEERING-REVIEW-AGENT.md` |
