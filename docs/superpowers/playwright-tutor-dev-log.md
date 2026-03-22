# Playwright Tutor Skill — Development Log

**Skill location:** `~/.claude/skills/playwright-tutor/`
**Files:** `SKILL.md` (teaching methodology) + `curriculum.md` (phases, exercises, analogies)
**Created:** 2026-03-22

## Design Decisions

- **Approach B chosen:** Two files — methodology separate from curriculum content. Curriculum loaded only when needed.
- **Three modes:** Lesson (teach concept), Challenge (exercise with cafe-themed name), Review (Socratic code review)
- **Hint escalation:** 4 levels (direction → narrowing → near-answer → full answer on explicit request)
- **Progress tracking:** Via Claude Code memory system, tracks current phase/exercise
- **References** `docs/2026-03-21-learning-plan.md` as source of truth for phase structure

## TDD Results

### RED — Baseline (no skill loaded)

Agents with explicit rules in the prompt still showed these gaps:

| Gap | Severity | Example |
|---|---|---|
| Hint discipline | Critical | First hint gave away `selectOption()` by name |
| One concept at a time | Moderate | Challenge mode threw 3 tasks at once |
| Themed challenge names | Minor | No cafe-themed names used |
| Scope creep | Moderate | Lesson added tangent about custom dropdowns |
| Rules need structure | Moderate | Advisory rules weren't enough — needed hard stops |

### GREEN — With skill loaded

All 5 gaps fixed:
- Hints use blanks `______()` instead of naming methods
- Challenges are single-focused with cafe names ("Espresso Menu Board Challenge")
- No scope creep — stayed on current-phase concepts
- Review mode remained strong (Socratic, caught anti-patterns)

### REFACTOR

Added rule against process-of-elimination hints ("NOT fill() and NOT click()" narrows it down). Added to both Hint 1 rules and Red Flags table in SKILL.md.
