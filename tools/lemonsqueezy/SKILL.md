---
name: lemonsqueezy
description: >-
  Use when working with a Lemon Squeezy account or API: stores, products,
  variants, prices, customers, orders, refunds, subscriptions, checkouts,
  discounts, license keys, webhooks, sales reports, or customer support actions.
  Requires a Lemon Squeezy API key. For always-on typed tools or hosted account
  actions, consider a Codex plugin/MCP after this skill proves the workflow.
---

# Lemon Squeezy

Use this skill to inspect and operate a Lemon Squeezy account deliberately. Favor
read-only discovery first, then make state-changing calls only after a concrete
preview and explicit approval.

## Skill or Plugin Decision

Start as a skill when the user needs reusable agent judgment: support lookup,
refund verification, subscription diagnosis, checkout creation, sales reporting,
or API integration work.

Prefer a Codex plugin/MCP when the user needs always-available typed tools, UI
confirmation prompts, scoped credentials, audit logs, or repeated one-click account
operations across many tasks. Money-moving account actions eventually deserve a
plugin/MCP; this skill is the correct first layer because it captures workflow,
guardrails, and API shape before freezing tool contracts.

## Setup

Required environment:

```bash
export LEMONSQUEEZY_API_KEY="..."
```

Optional but recommended:

```bash
export LEMONSQUEEZY_STORE_ID="..."
```

Use test-mode API keys and test-mode store data whenever building or validating a
new integration. Never paste API keys into chat, source files, logs, screenshots,
or committed config.

The helper script is available at:

```bash
node tools/lemonsqueezy/scripts/lemonsqueezy-api.mjs GET /stores
```

Read [references/api-reference.md](references/api-reference.md) for endpoint
patterns, risk tiers, and examples. Read [references/prompt-pack.md](references/prompt-pack.md)
for copy-ready prompts.

## Operating Rules

1. Identify the exact store before doing anything. If multiple stores are returned,
   ask the user which store to use unless `LEMONSQUEEZY_STORE_ID` is set.
2. For read-only questions, fetch the smallest useful data set and summarize without
   leaking private customer data unnecessarily.
3. For writes, produce a preview first: target resource, current state, intended
   mutation, money/customer impact, rollback path, and exact API call shape.
4. Do not execute these without explicit approval in the same turn:
   refunds, subscription cancel/pause/resume/update, customer updates, discount
   creation/deletion, checkout creation with custom prices, webhook create/update/
   delete, license-key update/deactivation, or any DELETE request.
5. Treat amounts as integer cents unless the endpoint clearly says otherwise.
   Confirm currency and formatted amount before refunds or pricing changes.
6. Use pagination. Lemon Squeezy list endpoints are paginated; never assume the
   first page is the whole account.
7. Keep API modes separate. The main Lemon Squeezy API uses JSON:API headers.
   The License API is separate and uses different headers, form encoding for POST,
   and a lower rate limit.
8. Report what happened with resource IDs, status, and verification checks. Do not
   claim an email, refund, or webhook was received by the customer/system unless
   the API response or dashboard proves it.

## Workflow

### 1. Classify the request

Use this routing:

| Request | Default action |
| --- | --- |
| "Find this customer/order" | Read-only lookup by email, order number, ID, or customer ID |
| "Show sales/revenue" | Paginated order/report query; state date range, store, test/live mode |
| "Create checkout link" | Preview variant, price, email/custom data, expiry, test mode, then create |
| "Refund this" | Verify order status, refunded state, amount/currency, policy, then ask approval |
| "Cancel/pause/resume subscription" | Verify subscription and billing dates, preview impact, then ask approval |
| "Create discount" | Preview discount rules, duration, limits, products/variants, then ask approval |
| "Manage license" | Use normal API for license-key objects; use License API for activate/validate/deactivate |
| "Set up webhook" | Verify endpoint, event list, signing secret handling, then ask approval |

### 2. Discover safely

Start with:

```bash
node tools/lemonsqueezy/scripts/lemonsqueezy-api.mjs GET /stores
```

Then scope all follow-up calls by store where possible:

```bash
node tools/lemonsqueezy/scripts/lemonsqueezy-api.mjs GET "/orders?filter[store_id]=$LEMONSQUEEZY_STORE_ID"
```

For customer support lookup, prefer exact filters:

```bash
node tools/lemonsqueezy/scripts/lemonsqueezy-api.mjs GET "/orders?filter[user_email]=customer@example.com"
node tools/lemonsqueezy/scripts/lemonsqueezy-api.mjs GET "/customers?filter[email]=customer@example.com"
```

### 3. Preview mutations

Before any mutation, return:

- target store and resource ID;
- current API state;
- proposed endpoint, method, and sanitized body;
- customer/money impact;
- test/live mode signal;
- rollback or follow-up action;
- exact approval sentence needed.

Approval should be specific, for example:

```text
Approve refunding order 12345 for $10.00 USD in live mode.
```

Do not treat "looks good" as approval for a different amount, resource, or mode.

### 4. Execute and verify

Execute only the approved call. Save no secrets. Afterward, verify with a read call
when practical and report:

- endpoint called and resource ID;
- before/after status;
- API response status or returned object state;
- any remaining dashboard/customer-side step.

## Common Playbooks

### Customer lookup

1. Search customers by email.
2. Search orders by email.
3. Search subscriptions and license keys by customer relationship where useful.
4. Summarize: customer status, order count, paid/refunded orders, subscription
   status, license status, and portal URL if relevant.

### Refund

1. Retrieve the order by ID or list by order number/email.
2. Confirm `status`, `refunded`, `currency`, `total`, and previous refunds.
3. Decide full refund or partial amount in cents.
4. Ask for explicit approval with amount, currency, order ID, and live/test mode.
5. POST `/orders/:id/refund`, then retrieve the order again.

### Subscription update

1. Retrieve the subscription.
2. Confirm customer, product/variant, status, renewal, trial, pause, and `ends_at`.
3. Preview the exact PATCH body for `cancelled`, `pause`, `trial_ends_at`, or
   `billing_anchor`.
4. Ask for explicit approval, execute, then retrieve again.

### Checkout creation

1. Verify store, product, variant, and price.
2. Preview checkout options, custom price, custom data, email prefill, expiry, and
   test mode.
3. Create checkout and return the URL plus expiry and variant/product context.

### Discount management

1. List existing discounts to avoid duplicate codes.
2. Preview amount/type, duration, usage limits, product/variant restrictions, and
   expiration.
3. Create or delete only after explicit approval.

### Webhooks

1. List existing webhooks first.
2. Verify callback URL, event list, and signing secret storage.
3. Create/update/delete only after explicit approval.
4. For receivers, validate signatures and return `200` only after processing.

## Quality Gate

Before handoff, check:

- [ ] Correct store and live/test mode identified.
- [ ] Credentials were read only from environment or a secret store.
- [ ] Pagination was handled for list/report tasks.
- [ ] State-changing calls had explicit approval with exact resource and impact.
- [ ] Amounts were handled as cents and reported in formatted currency.
- [ ] Mutations were verified with a follow-up read where possible.
- [ ] Private customer data was minimized in the final answer.

