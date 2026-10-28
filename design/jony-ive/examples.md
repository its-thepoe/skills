# Calibrating the feedback

These are fictional briefs and original example responses. They are not quotes,
predictions of Ive's exact response, or reports of user testing.

## 1. “This dashboard feels busy. Would Ive remove the labels?”

**Context:** A dispatch dashboard shows 40 deliveries. Operators must spot late
deliveries and reassign a driver. Actions already use unexplained icons.

**Example response:**

The main problem is that every delivery appears equally urgent. I would fix the
hierarchy before removing useful information. Keep the dense overview: an operator
may need it to compare several deliveries without switching pages.

1. **Make exceptions visible in the structure.** Keep the full list, but offer a
   clearly named view for deliveries needing intervention. Define that condition
   from actual dispatch rules. This applies structural simplicity (A12): reduce
   the operator's search and interpretation. The cost is another view to maintain;
   verify that grouping does not conceal a wider routing problem.
2. **Keep labels on consequential actions.** “Reassign driver” is clearer than an
   unfamiliar arrow. If space is tight, place the labelled action in a selected
   delivery's detail panel and keep its status visible in the list. This trades
   immediate access for room and clarity; test the frequency before moving it.
3. **Make the reassignment recoverable.** Preserve the existing selection while
   showing whether the update succeeded. Define what happens on a failed save.
   A quiet surface is little comfort if an operator cannot tell which driver owns
   the job. This is an application of care in use, not an Ive quote about dispatch.

Prototype the current list and an exception-first version using the same realistic
deliveries. Ask operators to identify and reassign the cases that need action.
Observe missed cases, wrong assignments, and how they recover. Keep the new
structure only if it improves intervention without undermining the overview.

**Why it works:** It preserves useful density, identifies an architectural issue,
and defines a test. “More whitespace, fewer labels” would not address the task.

## 2. “Choose a sealed aluminium controller or a serviceable polymer one”

**Context:** Both concepts control equipment in a workshop. Only renders exist.
The aluminium option hides all fasteners; the polymer option has a replaceable
battery and visible screws. No budget or ingress requirement has been supplied.

**Example response:**

My provisional preference is the serviceable concept, because battery replacement
is an explicit advantage and the sealed option's benefits are still visual claims.
That preference could change if sealing is necessary for the operating environment.

I cannot judge grip, durability, or a material's suitability from these renders.
The important question is the relationship between handling, protection, and
maintenance, not whether one material looks more like an Apple product.

Define the workshop conditions, cleaning agents, expected battery life, and
allowable downtime. Then build the grip and battery-access mechanism at full size.
Test operation with the intended gloves and perform a battery replacement using
the tools an owner will have. Include a dropped or contaminated unit in the
evaluation where the product requirements call for it.

The G5 access story (A03) supports treating service as part of the design;
iFixit's critique (D08) challenges sacrificing it for enclosure purity. Neither
source proves this controller must use polymer or visible screws. A service seam
could be carefully integrated into either concept.

**Why it works:** It makes a provisional decision without inventing ergonomic or
engineering evidence and tests the condition that could reverse the decision.

## 3. “We're building an AI assistant. What would Ive make?”

**Context:** The team proposes a floating chat window across every application.
Its goal is to help people prepare for recurring client meetings.

**Example response:**

The useful promise is arriving at a meeting informed and ready to decide. A
permanent chat window is one possible mechanism, but it also asks people to manage
another presence on screen. I would start by questioning that commitment.

Write down what “ready” means: the last decision, outstanding commitments, relevant
changes, and the next question. Then compare two mechanisms:

- A brief delivered in the existing calendar context before the meeting. It can
  be scanned and dismissed, but may be too passive when the meeting changes.
- An assistant invoked from the meeting entry to answer specific questions. It
  gives more control, but asks the person to know when and what to ask.

I would prototype the calendar brief first, with an explicit way to inspect its
sources and ask a follow-up. Use real meeting material the team has permission to
use. Test whether participants can correctly identify the unresolved commitment
and see where the information came from. Include missing and contradictory notes.

This applies problem framing (A20) and the choice of interaction for context
(A24). OpenAI's collaboration announcement (B22) does not establish what a future
product should contain. Privacy, permission boundaries, and correction are design
requirements here, not claims about undisclosed LoveFrom work.

**Why it works:** It proposes different mechanisms, makes a choice, and grounds
confidence in the experience rather than imagining an unreleased product.

## 4. “This hotel check-in needs to feel more premium”

**Context:** Guests repeat information already entered online, queue without an
estimate, and receive instructions over background music.

**Example response:**

The strongest improvement is to stop making guests repeat work. Keep the warmth
of a personal greeting, but fix the handoff between the online form and reception.
Verify which information legally or operationally must be checked again.

Give the guest a clear indication of what happens next, and provide room details
in a form they can revisit without remembering a spoken list. Offer an accessible
alternative where the current environment makes hearing or reading difficult.

Rehearse arrival with staff, including an early guest and a missing reservation.
Observe waits, repetition, who owns the exception, and whether the guest can
reach their room confidently. Finish or typography can support this experience;
they cannot resolve the handoff. This is an application of the wider scene in
Christie's (A25) and care beyond the primary function (A01).

**Why it works:** It transfers the concern for human encounters to a service
without disguising a service failure with visual luxury.
