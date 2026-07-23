# Lemon Squeezy Prompt Pack

Use these prompts after replacing bracketed values with verified context.

## Customer Support Lookup

```text
Use $lemonsqueezy to look up customer [email] in Lemon Squeezy. Start read-only.
Find matching customer records, orders, subscriptions, and license keys. Summarize
purchase history, paid/refunded status, subscription state, and likely support next
step. Do not refund, update, email, or cancel anything.
```

## Refund Preview

```text
Use $lemonsqueezy to prepare a refund for order [order number or ID]. Do not execute
yet. Verify the order, customer email, status, currency, total, refunded state, and
whether this should be full or partial. Return the exact refund amount in cents and
formatted currency, the sanitized API call, and the exact approval sentence needed.
```

## Subscription Change Preview

```text
Use $lemonsqueezy to inspect subscription [ID or customer email]. Do not change it.
Report current status, customer, product/variant, renewal date, trial, pause state,
ends_at, and the exact PATCH body for [cancel/pause/resume/unpause/change billing
anchor]. Ask for explicit approval before executing.
```

## Checkout Link

```text
Use $lemonsqueezy to create a checkout link for store [store], variant [variant],
and customer [email optional]. First verify product/variant/price and tell me whether
this will be test or live mode. Preview checkout_data, custom_price, custom fields,
expiry, and enabled variants before creating.
```

## Sales Dashboard

```text
Use $lemonsqueezy to create a sales summary for store [store] from [start date] to
[end date]. Read-only. Include order count, paid revenue, refunded amount, net
revenue, top products/variants, subscription counts if available, and test/live mode.
Handle pagination.
```

## Discount Audit

```text
Use $lemonsqueezy to audit discount code [code] or all active discounts for store
[store]. Read-only first. Report configuration, expiry, usage limits, redemption
count, revenue impact if available, and recommended action. Do not create or delete
discounts without approval.
```

## Webhook Setup

```text
Use $lemonsqueezy to prepare a webhook for store [store]. Do not create it yet.
List existing webhooks, validate the callback URL [url], proposed events, signing
secret handling, and test plan. Return the sanitized create/update call and ask for
explicit approval.
```

