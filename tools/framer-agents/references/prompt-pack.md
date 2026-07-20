# Framer Agents prompt pack

Use these as a starting point; replace brackets with verified project context.

## Native Agent: focused section revision

```text
Work only on the selected [section] on [page].

Goal: [measurable user-facing result].
Use the existing [component/style/spacing] system and preserve [neighboring sections,
content, interaction, or brand constraint]. Use the attached [assets/reference image]
as the source of truth for [specific aspect].

At desktop, [layout behavior]. At tablet and mobile, [layout behavior].
Do not change [explicit exclusions]. When finished, check hierarchy, contrast,
alignment, and overflow at all three sizes.
```

## External Agent: analysis before a high-impact edit

```text
Connect to [Framer project]. Inspect [page(s), component(s), CMS collection(s), and
locale(s)] only. Do not make changes yet.

Return:
1. Current structure and reusable styles/components involved.
2. Risks, dependencies, and responsive/CMS implications.
3. A minimal implementation plan with exact targets.
4. A change preview, including create/update/skip/delete counts if CMS data is involved.
5. Verification checks and what would require publishing.
```

## CMS import or synchronization

```text
Connect to [Framer project] and inspect the [Collection] schema and its dynamic page
dependencies. Read [source file/API]. Do not mutate the project yet.

Propose a field mapping. Match existing items by [slug/external ID]. Classify every
source item as create, update, or skip. Do not delete unmatched Framer items. Create
new records as drafts. Preserve [locale/reference/image/SEO] fields unless supplied.

Return the mapping, counts, validation errors, and a sample of 3 proposed records for
approval before applying.
```

## CMS cleanup

```text
Audit [Collection] for [missing fields/duplicate slugs/broken references/inconsistent
taxonomy]. Do not change or delete anything yet. Report each issue with item name,
stable ID/slug, exact field value, suggested correction, and whether it is safe to
automate. Separate safe edits from decisions requiring approval.
```

## Public CMS count label

```text
Connect to [Framer project]. I need the UI label [exact label/layer/component] on
[page/route] to show "Show all ([count])" for the [Collection] CMS collection.

Inspect the collection, filters, locale, dynamic page dependencies, and current
published/public state before proposing a solution. Do not edit yet.

Return:
1. The exact collection and filter definition used for the count.
2. Whether the requested number should be editor count, non-draft count, or
   published-site count. Default to published-site count for visitor-facing UI.
3. Whether Framer can prove the published-site count directly, or whether it needs
   verification against the published page/API output.
4. The recommended implementation lane: native Framer binding, External Agent
   project edit, Code Component/Override, Server API endpoint, or external worker.
5. Caching and publish behavior, including when the number updates after CMS edits.

After I approve the lane, implement the smallest change and verify the label at
desktop and mobile.
```

## Page generation with existing brand context

```text
Create [page/section] in [Framer project] using the existing design system. First
inspect the shared [header/footer/components/styles] and pages [reference pages].

Goal: [audience and conversion outcome]. Include [required blocks/content]. Use the
provided [assets/copy/CMS collection]. Preserve [brand rule].

Return a brief plan first. After approval, create the page with reusable components,
bound text/color styles, and responsive layouts. Do not publish. Verify desktop,
tablet, mobile, long text, and empty CMS states.
```

## Audit and polish

```text
Audit [page/project] for visual consistency and production readiness. Inspect rather
than edit first. Check hierarchy, spacing, alignment, typography, contrast, component
and style duplication, responsiveness, CMS states, links, alt text, SEO metadata, and
performance-sensitive embeds.

Return findings as Must fix / Recommended / Optional with exact target, evidence, and
proposed change. Do not apply changes until I approve a category or specific items.
```

## Server automation design

```text
Plan a server-side Framer automation for [scheduled sync/event-driven update].

Source: [API/database/file]. Target: [project and collection/pages]. Matching key:
[slug/external ID]. Draft/publish policy: [policy].

Use Framer Server API only; do not require the Framer editor to be open. Describe
authentication/secret handling, idempotency, rate/error handling, logging, dry-run
mode, rollback strategy, and the exact publish gate. Do not build an MCP server unless
the automation must be exposed as a tool to another MCP client.
```
