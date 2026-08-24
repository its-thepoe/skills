# Copywriting Reference

Use this file for detailed review tables, reusable templates, and the distinctions
between marketing and product copy. The main `SKILL.md` is the operating workflow.

## Evidence Labels

| Label | Meaning |
| --- | --- |
| Verified | Directly observed in code, a supplied screen, a live flow, or product material |
| Inferred | A reasonable conclusion from verified context; explain the inference |
| Needs evidence | A possible issue that cannot be confirmed yet |
| Decision needed | Requires product, legal, design, engineering, or localization input |

Never present an inferred feature, claim, flow, or error as verified.

## Context Brief

```text
Product:
Surface: marketing | product | both
Mode: write | review | voice
Audience and job:
Product promise:
Primary action/outcome:
Desired emotion before -> after:
Known terminology and voice:
Constraints: legal | accessibility | localization | platform | length | other
Evidence:
Assumptions:
Open decisions:
```

## Marketing Page Map

| Section | Job | Evidence to use | Copy question |
| --- | --- | --- | --- |
| Headline | State the primary value | Audience problem and outcome | What changes for this user? |
| Subheadline | Add specificity and context | Product behavior and constraints | How does it work or for whom? |
| Primary CTA | Name the next action/result | Actual route and user commitment | What happens after the click? |
| Problem | Show understanding | Customer language and pain | What are they trying to avoid? |
| Benefits | Connect capability to outcome | Verified product capabilities | Why should they care? |
| Proof | Reduce uncertainty | Real metrics, testimonials, examples | What can we honestly prove? |
| How it works | Reduce complexity | Actual steps and requirements | What will the user do? |
| Objections/FAQ | Resolve hesitation | Research and support questions | What stops the decision? |
| Final CTA | Repeat the clearest path | Same promise and commitment | What should happen next? |

Use one primary action per page. Secondary actions should have a clear reason to
exist, not compete for attention.

### Marketing quality checks

- The headline communicates an outcome, not only a feature or category.
- Benefits are specific and supported by actual product behavior.
- The message matches the traffic/source context and the next page or flow.
- Claims do not imply guarantees, scarcity, or proof that does not exist.
- CTA labels communicate the commitment and immediate result.
- The page remains understandable when headings and links are scanned alone.

## Product Flow Coverage

| Flow | User goal | Entry point | States observed | Missing states | Copy surfaces | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Sign up | Create an account | `/signup` | Form, validation, success | Offline, duplicate email | Heading, fields, CTA, errors | `src/...` |

Minimum state set to check where relevant:

`initial`, `loading`, `empty`, `validation`, `success`, `error`, `offline`,
`permission denied`, `expired`, `retry`, and `destructive confirmation`.

## Product Finding Table

| Priority | Location | Evidence | Current copy | Problem | Impact | Recommendation | Next check |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P1 | Screen / key | Verified | Exact string | What confuses or misleads | User/task consequence | Replacement copy | Usability or regression check |

Useful impact categories:

- **Comprehension:** users cannot understand the product or action.
- **Action:** users do not know what to do next or expect the wrong result.
- **Recovery:** a failure becomes a dead end or causes repeat errors.
- **Trust:** copy hides, blames, pressures, or contradicts the product.
- **Accessibility:** users relying on assistive technology, plain language, or
  localization are disadvantaged.
- **Consistency:** the same concept or action is named differently.

## Voice System Template

### Voice

`[Product] sounds [attribute], [attribute], and [attribute] because [user/product reason].`

### Attributes

| Attribute | Do | Avoid | Strongest in | Softer in |
| --- | --- | --- | --- | --- |
| Clear | “Create a project” | “Initiate a workspace” | Labels, forms, errors | Brand moments |
| Calm | “Your payment did not go through. Try another card.” | “Payment catastrophe!” | Payments and security | Success moments |
| Warm | “Your report is ready.” | “The operation completed.” | Onboarding and success | Irreversible actions |

Voice attributes must describe observable choices. “Friendly” is incomplete until it
specifies words, sentence length, punctuation, and boundaries.

### Tone by moment

| Moment | User may feel | Tone job | Copy behavior |
| --- | --- | --- | --- |
| Marketing discovery | Curious or skeptical | Earn attention and relevance | Specific, confident, evidence-led |
| Onboarding | Curious or uncertain | Orient | Explain value and the next step |
| Loading | Impatient | Set expectation | Say what is happening when useful |
| Empty | Unsure | Create momentum | Explain why it is empty and offer a relevant action |
| Validation | Focused | Prevent repeat error | Put the issue near the field and say how to fix it |
| Error | Frustrated or anxious | Restore control | State the problem, next step, and recovery path |
| Success | Relieved | Confirm outcome | Say what happened and what is now possible |
| Security/payment | Concerned | Protect trust | Be direct, precise, and never playful about consequences |

## Copy Patterns

| Situation | Weak pattern | Better pattern |
| --- | --- | --- |
| Generic marketing CTA | `Get started` | `[Specific action] [result]`, such as `Create your first project` |
| Generic product CTA | `Submit` | `Create project`, `Send invite`, or the actual outcome |
| Empty state | `No results` | `No projects yet. Create your first project.` |
| Validation | `Invalid input` | `Enter a 10-digit phone number.` |
| Recoverable error | `Something went wrong` | `We could not save your changes. Try again.` |
| Unknown failure | `Error 500` | `We could not load this page. Try again in a moment.` Include a reference ID only when support can use it. |
| Destructive action | `Are you sure?` | `Delete project? This permanently removes its files.` |
| Permission | `Access denied` | `Allow camera access to scan a receipt, or upload a photo instead.` |
| Consent | `Accept` | `Allow email updates` plus an equally clear decline/manage option |

These are patterns, not drop-in copy. Preserve the actual product behavior and legal
meaning.

## Scoring Rubric For Product Review

Score each relevant axis from 0 to 2. Use the score to expose reasoning, not to create
false precision.

| Axis | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Clarity | Ambiguous or misleading | Understandable with effort | Clear on first read |
| Actionability | No next step or wrong expectation | Next step is vague | Specific, correctly labeled action |
| Recovery | Dead end or blame | Generic retry/support | Explains the path to recovery |
| Context | Ignores user goal/state | Partly contextual | Fits the task and moment |
| Consistency | Conflicts with product language | Minor variation | Matches the copy system |
| Trust | Hides consequences or pressures | Incomplete explanation | Honest, respectful, user-controlled |
| Accessibility | Jargon, shame, or inaccessible pattern | Some accommodation | Plain, inclusive, localizable |

Prioritize low scores in actionability, recovery, context, and trust before stylistic
polish.

## Implementation Handoff

For every accepted rewrite, record:

- page section, screen, route, component, translation key, or content entry;
- triggering state and the action the user should be able to take;
- maximum practical length and text-expansion risk;
- analytics, support, or usability signal to monitor, if one exists;
- a test case for the happy path and each affected failure path;
- required review from product, design, engineering, legal, or localization.

## Source Synthesis

Across the UX writing sources, the durable overlap is clarity, concision, user
context, specific actions, consistent terminology, plain language, empathy,
accessibility, and a next step for errors and empty states. The marketing guidance
adds audience/problem/outcome framing, proof, message hierarchy, and a clear call to
action. Treat exact word counts, “positive” wording, relative dates, or playful copy
as conditional. Product truth, audience language, platform conventions, locale,
accessibility, and observed behavior decide the final recommendation.

Sources:

- https://builtin.com/articles/effective-ux-writing
- https://www.nngroup.com/articles/ux-writing-study-guide/
- https://blog.logrocket.com/ux-design/ux-writing-crafting-user-centric-content/
- https://technicalwriterhq.com/writing/ux-writing/ux-writing-examples/
