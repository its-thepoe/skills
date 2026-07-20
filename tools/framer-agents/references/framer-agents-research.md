# Framer Agents research and source guide

Research completed 2026-07-20. Framer Agents, External Agents, and Server API are
new/fast-moving surfaces; verify the linked primary sources before relying on a
specific command, permission, plan limit, or beta API capability.

## Distilled findings

### Native Framer Agent

- The canvas agent works in the current project and uses project content, structure,
  and styling as context. It can build sections/pages/animations/themes and work with
  a selected section as a focused context.
- Specific prompts produce better results than vague style adjectives. Reference images
  communicate visual direction; real assets should be attached instead of relying on
  placeholders. A screenshot plus live URL gives the best interaction-recreation
  context.
- Use it for visual canvas work where direct co-editing and the richest on-canvas
  context are more valuable than local files or automation.

### External Agents

- The official install path is `npx @framer/agent setup`; Framer also provides
  tool-specific install prompts on the External Agents page. After setup, invoke the
  Framer agent workflow and authorize a specific project in the browser.
- Connected external agents can access the project’s canvas, components, CMS, and
  project context. They can be used with Codex, Claude Code, Cursor, Antigravity CLI,
  Windsurf, and agents that can run terminal commands or call tools.
- Framer states that external-agent changes happen on a branch. The user can undo,
  review, merge, and publish; agents should not assume changes are live.
- External agents can read and write CMS collections, including creating, updating,
  and deleting items, but the user remains in control of publishing.
- External agents are strongest when work depends on local files, APIs, a coding
  environment, a custom skill, scheduled/repeatable workflows, CMS bulk operations,
  localization, redirects, or a technical audit.
- Trade-off: compared with the native canvas agent, external work may arrive in larger
  blocks and lacks the native agent’s rich open-canvas context; prompts therefore need
  more precise scope and constraints.

### MCP and Server API

- MCP is the open protocol for exposing tools, resources, and actions to AI agents.
- Framer does **not** require a separate MCP server for External Agents. Framer’s
  official agent bridge provides direct access to the project and is the preferred
  connection mechanism for Codex/Claude/Cursor workflows.
- Framer’s Server API exists for automation that should run on a server without the
  editor open: integrations, scheduled syncs, and an MCP server that itself updates a
  Framer project. Framer documents the Server API as open beta and says it can
  update and publish projects from a server-side script.
- The MCP Server Marketplace plugin is a third-party plugin, not the required official
  integration route. Treat it as a separate product with its own security review.

### Credits and safety

- Native Framer Agent work consumes workspace-level AI credits; cost varies with
  complexity. Check current plan/credit documentation instead of hardcoding amounts.
- External agents use the connected external tool’s model/workflow, while Framer keeps
  project authorization scoped to the projects explicitly connected. Permissions and
  publish control still require deliberate review.
- For visitor-facing CMS numbers, distinguish editor state, non-draft CMS state, and
  the most recently published site. If public parity matters, verify the published
  output rather than assuming the current editor-side collection is already visible.

## Sources supplied for this skill

### Primary Framer sources

- [Model Context Protocol dictionary](https://www.framer.com/dictionary/model-context-protocol)
- [Get Started with Framer Agents course](https://www.framer.com/academy/courses/get-started-with-framer-agents)
- [Generation, layout, and styling lesson](https://www.framer.com/academy/lessons/framer-agents-generation-layout-style)
- [Content, Components, and CMS lesson](https://www.framer.com/academy/lessons/framer-agents-content-scale)
- [Polish your Pages with Agents](https://www.framer.com/academy/lessons/polish-your-page-with-agents)
- [External Agents lesson](https://www.framer.com/academy/lessons/external-agents-with-framer)
- [Agents Academy topic](https://www.framer.com/academy/topics/agents)
- [Framer Agents](https://www.framer.com/agents/)
- [How to use Agents](https://www.framer.com/help/articles/how-to-use-agents/)
- [External Agent setup and FAQ](https://www.framer.com/agents/external/)
- [Framer 3 announcement](https://www.framer.com/blog/framer-3/)
- [Building Agents for Framer](https://www.framer.com/blog/building-framer-agents/)
- [AI credits, simpler plans, and lower prices](https://www.framer.com/blog/ai-credits-simpler-plans-and-lower-prices/)
- [AI credits and Agent pricing help](https://www.framer.com/help/articles/how-ai-credits-and-agents-pricing-work/)
- [Server API introduction](https://www.framer.com/developers/server-api-introduction)

### Non-primary context (do not override Framer documentation)

- [Frameplate: Framer 3 overview](https://frameplate.co/blog/framer-3-everything-you-need-to-know)
- [MCP AI marketplace plugin](https://www.framer.com/community/marketplace/plugins/mcp/)

## Update procedure

When this skill is revised, re-check first:

1. External Agent installation, supported clients, project authorization, branches,
   CMS permissions, and publish behavior.
2. Native Agent context controls, reference-asset support, and model/credit limits.
3. Server API beta status, authentication, available resources, and publish APIs.
4. Whether Framer still advises against manual MCP setup for ordinary External Agent
   connections.

If primary sources conflict with this skill, update the skill to follow Framer’s
current documentation and add the source/change date here.
