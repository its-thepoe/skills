# Lemon Squeezy API Reference

Use this as a compact routing map. Re-check official docs for exact request bodies
before new or high-impact mutations.

## Core Facts

- Base URL: `https://api.lemonsqueezy.com/v1`
- Main API headers:
  - `Accept: application/vnd.api+json`
  - `Content-Type: application/vnd.api+json`
  - `Authorization: Bearer $LEMONSQUEEZY_API_KEY`
- Main API response format: JSON:API.
- Main API rate limit: 300 requests/minute.
- API keys exist in test and live modes. Match key mode to the intended store mode.
- License API is separate:
  - Base URL: `https://api.lemonsqueezy.com`
  - `Accept: application/json`
  - POST content type: `application/x-www-form-urlencoded`
  - Rate limit: 60 requests/minute.

## Risk Tiers

| Tier | Examples | Approval |
| --- | --- | --- |
| Read-only | list stores, products, customers, orders, subscriptions, license keys | No approval beyond user request |
| Low-impact write | create test checkout, create test webhook | Preview first |
| Customer-impact write | live checkout with custom price, customer update, discount create | Explicit approval |
| Money/account-impact write | refund, subscription cancel/pause/resume, webhook delete, discount delete, license disable/deactivate | Explicit approval with exact resource and impact |

## Common Endpoints

| Job | Endpoint |
| --- | --- |
| List stores | `GET /stores` |
| Retrieve store | `GET /stores/:id` |
| List products | `GET /products?filter[store_id]=:store_id` |
| Retrieve product | `GET /products/:id` |
| List variants | `GET /variants?filter[product_id]=:product_id` |
| List prices | `GET /prices?filter[variant_id]=:variant_id` |
| List customers | `GET /customers?filter[store_id]=:store_id` |
| Customer by email | `GET /customers?filter[email]=:email` |
| Update customer | `PATCH /customers/:id` |
| List orders | `GET /orders?filter[store_id]=:store_id` |
| Order by number | `GET /orders?filter[order_number]=:number` |
| Orders by email | `GET /orders?filter[user_email]=:email` |
| Retrieve order | `GET /orders/:id` |
| Refund order | `POST /orders/:id/refund` |
| List order items | `GET /order-items?filter[order_id]=:order_id` |
| List subscriptions | `GET /subscriptions?filter[store_id]=:store_id` |
| Retrieve subscription | `GET /subscriptions/:id` |
| Update subscription | `PATCH /subscriptions/:id` |
| Create checkout | `POST /checkouts` |
| Retrieve checkout | `GET /checkouts/:id` |
| List discounts | `GET /discounts?filter[store_id]=:store_id` |
| Create discount | `POST /discounts` |
| Delete discount | `DELETE /discounts/:id` |
| List license keys | `GET /license-keys?filter[store_id]=:store_id` |
| Retrieve license key | `GET /license-keys/:id` |
| Update license key | `PATCH /license-keys/:id` |
| List webhooks | `GET /webhooks?filter[store_id]=:store_id` |
| Create webhook | `POST /webhooks` |
| Update webhook | `PATCH /webhooks/:id` |
| Delete webhook | `DELETE /webhooks/:id` |

## JSON:API Body Shape

Most writes use this pattern:

```json
{
  "data": {
    "type": "orders",
    "id": "1",
    "attributes": {
      "amount": 100
    }
  }
}
```

The `type` must match the resource type expected by the endpoint.

## Pagination

List responses include `links` and `meta.page`. Keep fetching until there is no
`links.next` when a full account answer is needed. For support lookups, prefer exact
filters to avoid unnecessary pagination.

## Mutation Examples

Refund full order:

```bash
node tools/lemonsqueezy/scripts/lemonsqueezy-api.mjs POST /orders/123/refund \
  --body '{"data":{"type":"orders","id":"123","attributes":{}}}'
```

Refund partial order for 100 cents:

```bash
node tools/lemonsqueezy/scripts/lemonsqueezy-api.mjs POST /orders/123/refund \
  --body '{"data":{"type":"orders","id":"123","attributes":{"amount":100}}}'
```

Cancel subscription:

```bash
node tools/lemonsqueezy/scripts/lemonsqueezy-api.mjs PATCH /subscriptions/123 \
  --body '{"data":{"type":"subscriptions","id":"123","attributes":{"cancelled":true}}}'
```

Unpause subscription:

```bash
node tools/lemonsqueezy/scripts/lemonsqueezy-api.mjs PATCH /subscriptions/123 \
  --body '{"data":{"type":"subscriptions","id":"123","attributes":{"pause":null}}}'
```

Create checkout:

```bash
node tools/lemonsqueezy/scripts/lemonsqueezy-api.mjs POST /checkouts \
  --body '{"data":{"type":"checkouts","attributes":{"checkout_data":{"email":"customer@example.com"},"test_mode":true},"relationships":{"store":{"data":{"type":"stores","id":"1"}},"variant":{"data":{"type":"variants","id":"123"}}}}}'
```

## License API Examples

Validate a license key:

```bash
node tools/lemonsqueezy/scripts/lemonsqueezy-api.mjs POST /v1/licenses/validate \
  --license-api \
  --form license_key=XXXX-XXXX
```

Activate a license key:

```bash
node tools/lemonsqueezy/scripts/lemonsqueezy-api.mjs POST /v1/licenses/activate \
  --license-api \
  --form license_key=XXXX-XXXX \
  --form instance_name="Hassan MacBook"
```

Deactivate a license key:

```bash
node tools/lemonsqueezy/scripts/lemonsqueezy-api.mjs POST /v1/licenses/deactivate \
  --license-api \
  --form license_key=XXXX-XXXX \
  --form instance_id=INSTANCE_ID
```

## Source Notes

The community `adrianwedd/lemonsqueezy-claude-skills` repo splits common workflows
into separate Claude Code skills: customer lookup, resend receipt, refund order,
sales dashboard, discount performance, and campaign attribution. This skill keeps
one portable orchestrator instead, because Codex can route by task and load deeper
references only when needed.

