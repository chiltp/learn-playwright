# Baseline Findings — Playwright Tutor Skill

## RED Phase: What agents do WITHOUT the skill

Tested 3 scenarios with explicit rules in the prompt (hints not answers, cafe analogies, connect to existing code). Even with rules stated, agents showed these gaps:

## What Agents Got Right
- Cafe/pastry analogies came naturally when requested — bakery display case, kitchen timer, croissant ordering
- Referenced user's existing LoginPage code and patterns
- Review mode was strongest — Socratic questions, caught `waitForTimeout` anti-pattern, noticed missing login step
- Generally warm, encouraging tone appropriate for a learner

## What Agents Got Wrong

### 1. Hint Discipline (Critical Gap)
- **Lesson mode:** Self-escalated through 3 "hints" in a single response without being asked. Revealed method family ("select" in its name) in first hint.
- **Challenge mode:** First hint gave away `selectOption()` by name AND told them to look for `data-test` attributes. This is an answer, not a hint.
- **Verbatim:** "think about the method `selectOption()`" — this is giving the answer with a polite wrapper.

### 2. One Concept at a Time (Moderate Gap)
- **Challenge mode:** Threw 3-part challenge (page object + sorting test + cart badge test) all at once. Overwhelming for a learner.
- **Lesson mode:** Added tangent about custom dropdowns built with divs/lis — introducing an advanced concept that's not relevant to the current exercise.

### 3. Themed Challenge Names (Minor Gap)
- No agent used a fun cafe-themed challenge name. Challenges were presented as numbered tasks, not as "Pastry Display Challenge" or "Croissant Challenge."

### 4. Concept Scope Creep (Moderate Gap)
- Lesson mode mentioned custom dropdowns (advanced topic) in a lesson about basic `<select>` usage.
- Challenge mode scope was too broad (3 different features in one challenge).

### 5. Rules Need to Be Structural, Not Advisory
- All baselines had rules explicitly stated in the prompt. Without the skill enforcing structure, agents would likely be even more generous with answers.
- The skill needs hard rules (red flags, stop conditions) not just guidelines.

## Specific Gaps the Skill Must Address
1. Hard rule: NEVER reveal method/API names in Hint 1 or Hint 2. Hint 1 = direction only. Hint 2 = what to look for, not what to type.
2. Hard rule: ONE exercise per challenge. Not multi-part.
3. Hard rule: Every challenge gets a cafe-themed name.
4. Hard rule: Don't introduce concepts from future phases or advanced topics in current-phase lessons.
5. Red flags list: "Giving away a method name in a hint" should be explicitly called out.
