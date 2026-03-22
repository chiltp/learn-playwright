# Playwright Tutor Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. **This plan follows the writing-skills TDD process:** RED (baseline test) → GREEN (write skill) → REFACTOR (close loopholes).

**Goal:** Create a personal Claude Code skill that teaches Playwright and testing concepts through Socratic dialogue, cafe-themed analogies, and progressive exercises.

**Architecture:** Two-file skill (`SKILL.md` + `curriculum.md`) in `~/.claude/skills/playwright-tutor/`. SKILL.md defines teaching methodology and mode-switching. curriculum.md provides phase-by-phase content, exercises, and cafe analogies. Progress tracked via Claude Code memory system.

**Tech Stack:** Claude Code skills (Markdown with YAML frontmatter), Claude Code memory system

**Spec:** `docs/superpowers/specs/2026-03-21-playwright-tutor-design.md`

---

## File Structure

```
~/.claude/skills/playwright-tutor/
  SKILL.md          # Teaching methodology, modes, hint rules, flowcharts
  curriculum.md     # Phase-by-phase: concepts, cafe analogies, exercises, testing concepts
```

---

### Task 1: RED — Baseline Test Without Skill

**Purpose:** Run pressure scenarios without the skill to document how Claude naturally behaves. This establishes what the skill needs to fix.

**Files:**
- None created — this is observation only

- [ ] **Step 1: Run Lesson mode baseline**

Dispatch a subagent with this prompt (no skill loaded):

```
You are helping a user learn Playwright. They have a project at /Users/chiiphuonggchii/Desktop/projects/learn-playwright with login tests complete (Phase 1). They say: "teach me about selecting dropdown options in Playwright."

Rules: give hints not answers, use cafe/pastry analogies, connect to their existing code. Do NOT give them the full solution.
```

Document: Does the agent give away the answer? Skip analogies? Fail to reference their code? Overwhelm with multiple concepts?

- [ ] **Step 2: Run Challenge mode baseline**

Dispatch a subagent with this prompt (no skill loaded):

```
You are helping a user learn Playwright. They have login tests done. They say: "challenge me with something related to the inventory page."

Rules: give hints not answers, use cafe/pastry analogies. When they ask for a hint, give a small nudge, not the answer.
```

Then follow up as the user saying: "hint please"

Document: Does the agent give away too much? Does it use cafe analogies? Does it escalate hints properly?

- [ ] **Step 3: Run Review mode baseline**

Dispatch a subagent with this prompt (no skill loaded):

```
You are helping a user learn Playwright. They share this code and ask "is this right?":

test('sort products by price', async ({ page }) => {
  await page.goto('/inventory.html');
  await page.selectOption('.product_sort_container', 'lohi');
  await page.waitForTimeout(2000);
  const prices = await page.locator('.inventory_item_price').allTextContents();
  expect(prices[0]).toBe('$7.99');
});

Rules: Don't fix their code. Ask Socratic questions to guide them to find issues themselves. Use cafe/pastry analogies.
```

Document: Does the agent just fix the code? Does it ask questions? Does it notice the `waitForTimeout` anti-pattern?

- [ ] **Step 4: Document baseline findings**

Create a temporary file `docs/superpowers/plans/baseline-findings.md` documenting:
- What agents got wrong (verbatim rationalizations)
- What they got right
- Specific gaps the skill needs to address

- [ ] **Step 5: Commit baseline findings**

```bash
git add docs/superpowers/plans/baseline-findings.md
git commit -m "docs: add baseline findings for playwright-tutor skill testing"
```

---

### Task 2: GREEN — Write SKILL.md

**Purpose:** Write the main skill file addressing the specific gaps found in baseline testing.

**Files:**
- Create: `~/.claude/skills/playwright-tutor/SKILL.md`

- [ ] **Step 1: Create skill directory**

```bash
mkdir -p ~/.claude/skills/playwright-tutor
```

- [ ] **Step 2: Write SKILL.md**

Write `~/.claude/skills/playwright-tutor/SKILL.md` with this structure:

```markdown
---
name: playwright-tutor
description: Use when the user wants to learn Playwright concepts, asks for explanations of test code, requests practice exercises, wants code reviewed for learning purposes, or says teach me, explain, quiz me, next lesson, or challenge
---

# Playwright Tutor

## Overview
[Core principle: Socratic teaching with cafe analogies, hints-first, progressive curriculum]

## Teaching Modes
[Mode detection flowchart: Lesson / Challenge / Review / Ad-hoc question]
[Explicit triggers for each mode]

## Teaching Rules
[1. Hints first, answers last — 3 hint escalation levels]
[2. Cafe/pastry analogies — mandatory for concept intros]
[3. One concept at a time]
[4. Connect to user's existing code in learn-playwright/]
[5. Level-aware — don't use concepts ahead of current phase]
[6. Broader testing thinking — weave in why, not just how]

## Hint Escalation
[Hint 1: Directional nudge]
[Hint 2: Specific guidance]
[Hint 3: Near-answer]
[Full answer: Only on explicit request]

## Progress Tracking
[Use memory system to track current phase/exercise]
[Check memory at start of each interaction]

## Red Flags — STOP
[Giving the full answer without being asked]
[Skipping cafe analogies]
[Introducing multiple new concepts at once]
[Fixing user's code directly instead of asking Socratic questions]

## Curriculum Reference
[Point to curriculum.md for phase content, loaded only when needed]
```

Incorporate specific counters to the baseline failures documented in Task 1.

- [ ] **Step 3: Verify file exists and frontmatter is valid**

```bash
head -5 ~/.claude/skills/playwright-tutor/SKILL.md
```

Expected: YAML frontmatter with `name: playwright-tutor` and `description: Use when...`

---

### Task 3: GREEN — Write curriculum.md

**Purpose:** Write the curriculum reference file with phase-by-phase content.

**Files:**
- Create: `~/.claude/skills/playwright-tutor/curriculum.md`

- [ ] **Step 1: Write curriculum.md**

Write `~/.claude/skills/playwright-tutor/curriculum.md` with content for each phase:

```markdown
# Playwright Tutor Curriculum

## How to Use This File
[Loaded by SKILL.md when running Lesson or Challenge mode]
[Each phase: concept intro with cafe analogy, Playwright patterns, broader testing concept, exercises]

## Phase 0: Async/Await
- Cafe analogy: "Ordering coffee" — you place an order (call), get a ticket (Promise), wait for your name (await)
- Broader concept: Why automated testing matters — manual testing is like tasting every single pastry yourself every morning
- Exercise: [Reference async-demo.js, already completed]

## Phase 1: Login Tests (Completed)
- Cafe analogy: "Recipe card" — POM is a laminated recipe card the whole bakery staff follows
- Broader concept: Test case design — happy path (perfect order), edge cases (no milk, wrong size, locked out customer)
- Review exercise: Look at your LoginPage.js — what happens if SauceDemo changes a data-test attribute? How does POM protect you?

## Phase 2: Inventory & Sorting
- Cafe analogy: "Menu board" — sorting/filtering is rearranging the pastry display case by price, name, popularity
- Key concepts: selectOption, allTextContents, array assertions, sorting verification
- Broader concept: What to test vs what not to test — test the customer experience (can they find the cheapest croissant?), not the oven internals
- Exercises:
  1. Write InventoryPage class with selectors for sort dropdown and product list
  2. Test sorting products by price (low to high) — verify order is correct
  3. Test sorting products by name (A to Z) — verify alphabetical order
- Challenge: "Pastry Display Challenge" — verify that every product has a name, price, and image (no empty display slots!)

## Phase 3: Cart
- Cafe analogy: "Shopping basket" — each customer (test) gets a fresh empty basket, items go in and come out
- Key concepts: toHaveCount, toBeVisible, toBeHidden, state changes (add/remove)
- Broader concept: Test independence & isolation — if one customer spills coffee, the next customer's basket shouldn't be wet
- Exercises:
  1. Write CartPage class
  2. Test adding a single item — badge shows "1"
  3. Test adding then removing — badge disappears
  4. Test cart persists after navigation (go to cart page, items still there)
- Challenge: "Croissant Challenge" — add 3 specific items, go to cart, verify exact items and total count

## Phase 4: Checkout
- Cafe analogy: "Full cafe experience" — from walking in (login) to paying (checkout complete), the whole customer journey
- Key concepts: Multi-step flows, chaining page objects, form filling, flow completion assertions
- Broader concept: E2E vs integration vs unit — the test pyramid. E2E = full cafe visit, integration = does the register talk to the kitchen?, unit = does the price calculator work?
- Exercises:
  1. Write CheckoutPage class
  2. Test complete checkout flow (login → add item → cart → checkout → confirmation)
  3. Test checkout validation (missing name, missing zip code)
- Challenge: "Grand Opening Challenge" — full end-to-end test covering login, browse, add to cart, checkout, and verify the confirmation page. The whole bakery experience!
```

- [ ] **Step 2: Verify file exists**

```bash
wc -l ~/.claude/skills/playwright-tutor/curriculum.md
```

Expected: File exists with content.

---

### Task 4: GREEN — Test Skill With Same Scenarios

**Purpose:** Re-run the baseline scenarios WITH the skill loaded to verify improvement.

**Files:**
- None created — this is verification

- [ ] **Step 1: Test Lesson mode with skill**

Dispatch a subagent that loads the skill first (read both SKILL.md and curriculum.md), then responds to: "teach me about selecting dropdown options in Playwright"

Compare against baseline. Verify:
- Uses cafe analogy (menu board / pastry display)
- Gives exercise, not answer
- References user's existing LoginPage pattern
- Introduces one concept at a time

- [ ] **Step 2: Test Challenge mode with skill**

Dispatch a subagent that loads the skill, then responds to: "challenge me with something related to the inventory page"

Then follow up: "hint please"

Compare against baseline. Verify:
- Challenge is themed (pastry/cafe name)
- Hint 1 is a nudge, not an answer
- Connects to Phase 2 content

- [ ] **Step 3: Test Review mode with skill**

Dispatch a subagent that loads the skill, then responds to the same code review scenario from Task 1.

Compare against baseline. Verify:
- Asks Socratic questions (doesn't fix code)
- Catches `waitForTimeout` anti-pattern
- Uses cafe analogy in explanation
- Guides toward proper Playwright waiting strategies

- [ ] **Step 4: Document test results**

Update `docs/superpowers/plans/baseline-findings.md` with GREEN test results. Note any remaining gaps.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/baseline-findings.md
git commit -m "docs: add GREEN test results for playwright-tutor skill"
```

---

### Task 5: REFACTOR — Close Loopholes

**Purpose:** Address any remaining gaps found in GREEN testing. Iterate until skill is solid.

**Files:**
- Modify: `~/.claude/skills/playwright-tutor/SKILL.md`
- Modify: `~/.claude/skills/playwright-tutor/curriculum.md` (if needed)

- [ ] **Step 1: Identify gaps from GREEN testing**

Review Task 4 results. List specific issues:
- Did the agent still give away answers in any scenario?
- Were cafe analogies missing or forced?
- Did hint escalation work properly?
- Any new rationalizations to counter?

- [ ] **Step 2: Update SKILL.md with fixes**

Address each gap with explicit guidance in SKILL.md. Add to Red Flags or Teaching Rules as needed.

- [ ] **Step 3: Re-test any scenario that failed**

Dispatch subagent to re-test only the scenarios that had issues.

- [ ] **Step 4: Final commit**

```bash
git add ~/.claude/skills/playwright-tutor/SKILL.md ~/.claude/skills/playwright-tutor/curriculum.md
git commit -m "feat: finalize playwright-tutor skill after TDD refinement"
```

---

### Task 6: Save User Memory

**Purpose:** Record that this skill exists and the user's learning preferences.

**Files:**
- Create: `~/.claude/projects/-Users-chiiphuonggchii-Desktop-projects-learn-playwright/memory/user_learning_preferences.md`

- [ ] **Step 1: Save user memory**

Write memory file with:
- User is learning Playwright, currently completed Phase 1 (login tests)
- Prefers hint-based Socratic teaching, not direct answers
- Likes cafe/pastry-themed examples and analogies
- Has playwright-tutor skill installed at `~/.claude/skills/playwright-tutor/`

- [ ] **Step 2: Update MEMORY.md index**

Add pointer to the new memory file in MEMORY.md.

- [ ] **Step 3: Commit**

```bash
git add ~/.claude/projects/-Users-chiiphuonggchii-Desktop-projects-learn-playwright/memory/
git commit -m "docs: add user learning preferences to memory"
```
