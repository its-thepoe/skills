# Market Command Matrix — reference

Framework and narrative are based on **Patrick Campbell / Patticus**, [Competitor Research and Strategy (2023)](https://patticus.com/2023/12/16/competitive-research-playbook/). This package adapts that programme into a portable **Agent Skill**. A sibling-style repo with Hermes-oriented notes: [kastrah/market-command-matrix](https://github.com/kastrah/market-command-matrix).

---

## Signal checklist

Use for reconnaissance and ongoing monitoring (monthly or quarterly cadence for priority players):

- Website and landing-page messaging  
- Product pages and feature claims  
- Social profiles and recent themes  
- Visible ads or campaign pushes  
- App store listings and reviews (if relevant)  
- Pricing and onboarding flow  
- Press mentions and partnerships  
- Hiring, funding, and expansion signals  
- SEO / blog topics  
- Customer comments, FAQs, repeated objections  

Separate **verified** evidence from **assumptions**.

---

## Extraction questions

For each priority player on each review cycle:

1. What **promise** are they making?  
2. Who are they **speaking to**?  
3. What **pain** do they lead with?  
4. What **proof** do they show?  
5. What **CTA** do they push?  
6. What **channel** are they strongest on?  
7. What do they **avoid** saying?  
8. What **operational weakness** is visible?  
9. What **customer behaviour** are they trying to change?  

---

## Playbooks by category

Pick **one primary motion** per priority player. Expand only where the user asks for depth.

### Attack (high mindshare + high resources)

- Comparison page or landing  
- **Wedge** campaign (narrow audience, use case, geo, workflow, or belief gap)  
- Proof-led positioning (claims competitors cannot copy quickly)  
- Partnership attack (where legal and brand allow)  
- Content wedge  
- Sales battlecard  

Expect retaliation or fast copying—discipline matters.

### Monitor (low mindshare + high resources)

- Monthly or quarterly **watchlist**  
- Triggers: funding, hiring, pricing, messaging, partnerships, launches, channel moves  
- Messaging change log  
- Rules for when monitoring escalates to active competition  

### Harvest (high mindshare + low resources)

- Migration or switching offers  
- Gap content (what they educate on vs what they under-deliver)  
- Operational reliability proof, depth, support, trust  
- Local execution story  
- Integration strategy where relevant  

### Ignore (low mindshare + low resources)

- No strategic programme spend  
- Capture any **useful customer signal** they reveal  
- Revisit only if mindshare or resources shift materially  

### Partner (ecosystem / complementary)

- Ecosystem integration plan  
- Referral or reseller path  
- Joint campaign or audience swap  
- Co-branded trust proof  
- Clear value exchange; watch **channel conflict** and future competitive overlap  

### Defend (when you are the incumbent under pressure)

Use when **you** are the high-mindshare player under attack:

- Retention messaging  
- Customer education  
- Objection handling  
- Proof bank  
- Reinforce switching costs **ethically** (real lock-in from value, not dark patterns)  

---

## Market shapes

After matrix placement, name the **shape** when data supports it:

| Shape | Read | Strategic implication (typical) |
|-------|------|----------------------------------|
| **Intensely fragmented** | No clear winner | If market is large/early, grow fast; if small/low-value, re-check opportunity sizing. |
| **Challenger** | One or two dominant players | Attack leaders with wedges and/or partner other challengers. |
| **Ancient** | Stagnant incumbents, poor CX | Harvest aggressively with fulfilment and trust. |
| **Mature** | Active entrants and exits; mixed quadrants | Run **offensive and defensive** playbooks in parallel by segment. |

---

## Full analysis template

Use as markdown sections unless the user’s org template overrides.

### Strategic thesis

One sentence: what the market map **means** for where to play and how to win.

### Competitor map

- Direct competitors  
- Adjacent competitors  
- Substitute behaviours  
- Ecosystem actors  

### Evidence table

| Player | Signal | Source | Date checked | Confidence | Implication |
|--------|--------|--------|--------------|------------|-------------|

### Matrix placement

| Player | Mindshare (H/M/L) | Resources (H/M/L) | Category | Rationale | What would change placement |
|--------|-------------------|---------------------|----------|-----------|----------------------------|

### Whitespace and positioning

- What the market is missing  
- What you can **credibly** own  
- What **not** to copy  

### Recommended actions

| Action | Owner | Dependency | Output | Deadline / checkpoint |
|--------|-------|------------|--------|-------------------------|

### Market shape

Fragmented / challenger / ancient / mature — and what that implies.

### Milestones and triggers

- What to monitor  
- What would **change** the decision  
- When to **re-run** the matrix  

---

## One-page decision memo template

```text
Player: …
Placement: attack | monitor | harvest | ignore | partner
Evidence: … (1–2 strongest signals)
Meaning: … (what it changes strategically)
Action: … (one concrete next move)
Trigger: … (what to watch next)
```

---

## Survey and research hygiene

- **Unaided before aided** for mindshare questions.  
- Avoid anchoring on your brand or a named competitor in early questions when possible.  
- Prefer **anonymous or neutral** framing where compliance allows.  
- Be careful with incentives (direct payment to panelists vs raffle-style bias).  
- Survey sources (roughly easiest → hardest): your CRM/prospects (anonymous where possible), paid panels, prospects outside CRM (compliance), competitor customers from public proof, targeted ads to survey landers.  

---

## Hermes and other agents

- **Hermes:** install by copying this skill folder (or `SKILL.md` + `reference.md`) into your Hermes skills directory; load skill name **`market-command-matrix`**.  
- **Cursor / Claude Code / OpenCode / Windsurf:** use `npx @its-thepoe/skills@latest install market-command-matrix` (after publish) or symlink from this monorepo.

---

## License

MIT — framework narrative credited to Patticus / Patrick Campbell as above; skill packaging under `@its-thepoe` is maintained in [its-thepoe/skills](https://github.com/its-thepoe/skills).
