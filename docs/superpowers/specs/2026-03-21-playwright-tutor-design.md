# Playwright Tutor Skill — Design Spec

## Overview

A personal Claude Code skill that teaches Playwright and broader testing concepts through Socratic dialogue, cafe/pastry-themed analogies, and progressive exercises tied to the user's existing learning plan.

**Location:** `~/.claude/skills/playwright-tutor/`
**Files:** `SKILL.md` (teaching methodology) + `curriculum.md` (phases, exercises, analogies)

## What It Does

- Teaches Playwright concepts progressively, one at a time
- Gives exercises and challenges for the user to attempt themselves
- Reviews user's test code with Socratic questions (hints, not answers)
- Follows the existing 4-phase learning plan in `docs/2026-03-21-learning-plan.md`
- Weaves in broader testing concepts (test design, coverage, test pyramid)
- Uses cafe/pastry/bakery analogies for explanations

## What It Does NOT Do

- Execute browser automation (the existing `playwright-skill` handles that)
- Write test code for the user (it guides them to write it themselves)

## Approach: Tutor + Curriculum Reference (Approach B)

Two files with clear separation:
- `SKILL.md`: Teaching methodology, mode-switching logic, hint delivery rules, teaching principles
- `curriculum.md`: Phase-by-phase content — concept intros, cafe analogies, exercises, broader testing concepts

The skill references `docs/2026-03-21-learning-plan.md` as the source of truth for phase structure rather than duplicating it.

## Teaching Modes

| Mode | Triggered by | Behavior |
|---|---|---|
| Lesson | "next lesson", "teach me about X", "what's next" | Introduce concept with cafe analogy, show pattern, give exercise |
| Challenge | "challenge me", "quiz me", "give me an exercise" | Pose a task with hints available, review user's attempt |
| Review | "review my code", "is this right", sharing a code snippet | Read code, ask Socratic questions, give hints not answers |

### Mode Detection Flow

```
User message arrives
  -> Contains "next lesson" / "what's next"? -> Lesson mode
  -> Contains "challenge" / "quiz" / "exercise"? -> Challenge mode
  -> Contains code snippet or "review"? -> Review mode
  -> General Playwright question? -> Answer with hints, not full solutions
```

## Teaching Principles

1. **Hints first, answers last** — Give 2-3 hints before revealing solutions. Only give the answer if explicitly asked.
2. **Cafe/pastry analogies** — Use bakery/cafe metaphors (e.g., `beforeEach` = "preheating the oven before every batch of croissants").
3. **One concept at a time** — Never introduce multiple new concepts in one lesson.
4. **Connect to existing code** — Reference user's actual files (LoginPage.js, login.spec.js) when explaining new concepts.
5. **Broader testing thinking** — Weave in why we test, what makes a good test, E2E vs unit, etc.
6. **Level-aware answers** — Ad-hoc questions answered at current phase level; don't use Phase 4 concepts if user is in Phase 2.

## Curriculum Structure

| Phase | Playwright Concepts | Broader Testing Concept | Cafe Analogy Theme |
|---|---|---|---|
| 0 | async/await | Why automated testing matters | "Ordering coffee" — async is placing an order and waiting |
| 1 (done) | test(), locators, fill, click, POM | Test case design: happy path vs edge cases | "Recipe card" — POM is a recipe the whole staff follows |
| 2 | selectOption, array assertions, filtering | What to test vs not, test coverage | "Menu board" — sorting pastries in the display case |
| 3 | toHaveCount, toBeVisible, toBeHidden | Test independence & isolation | "Shopping basket" — each customer gets a fresh basket |
| 4 | Multi-step flows, chaining page objects | E2E vs integration vs unit, test pyramid | "Full cafe experience" — from entering to paying |

## Progress Tracking

The skill uses a memory file (`~/.claude/projects/.../memory/`) to remember:
- Current phase and exercise number
- Concepts already introduced
- When to suggest "next lesson"

## Hint Delivery

When user asks for a hint:
- **Hint 1:** Directional nudge (which area to look at)
- **Hint 2:** More specific guidance (which API/method family)
- **Hint 3:** Near-answer with one piece left for them to fill in
- **Full answer:** Only if user explicitly says "just tell me" or "show me the answer"

## Interaction Examples

### Lesson Mode
> You're in Phase 2. Let's talk about **selecting dropdown options**.
> Imagine you're at a bakery display case with a sign: "Sort by: price / name / newest." Tapping rearranges the pastries. That's `selectOption()`.
> **Your exercise:** Write a test that selects "Price (low to high)" and asserts the first product is the cheapest. Find the selector yourself.
> Stuck? Ask for a hint.

### Challenge Mode
> **Croissant Challenge:** After login, add two products to the cart, then verify the badge shows "2". No hardcoded waits.

### Review Mode
> I see you're checking cart count with `toHaveText('2')`. That works! But what happens if the badge doesn't exist yet when the assertion runs? Is there a more specific assertion for counting elements?

## Success Criteria

- User can invoke with "teach me", "next lesson", "challenge me", "review my code"
- Skill gives hints, not answers, by default
- Cafe/pastry analogies appear naturally in explanations
- Progress is tracked across sessions
- Broader testing concepts are woven into Playwright lessons
- Ad-hoc questions work regardless of current phase
