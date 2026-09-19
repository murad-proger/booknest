# BookNest

An online bookstore with a full purchase cycle — from catalog to payment — built in a production-like style as a pet project to practice fullstack development with a real payment flow (Stripe), rather than a simplified demo.

## Demo

🔗 **Live:** https://murad-booknest.vercel.app

| Scenario           | Data                        |
| ------------------ | --------------------------- |
| Test user          | `user@gmail.com` / `123456` |
| Successful payment | `4242 4242 4242 4242`       |
| Card decline       | `4000 0000 0000 0002`       |

Any future expiry date, any CVC. Stripe runs in test mode — no real money is charged. The admin panel isn't publicly exposed on production — managing books, users and issuing refunds requires the admin role; test admin credentials are available on request. See the "Screenshots" section below for what the admin panel looks like.

## Stack

| Area           | Technologies |
| -------------- | ------------ |
| Frontend       | Next.js (App Router), React, TypeScript, TanStack Query, Redux Toolkit, React Hook Form, Zod |
| Backend        | Next.js API routes and Server Actions, PostgreSQL, Prisma ORM |
| Auth           | Auth.js (JWT-based authentication, user/admin roles) |
| Payments       | Stripe (Checkout, webhooks, idempotency, retry, refund) |
| UI             | CSS Modules with custom design tokens, a custom component library (Button, Card, Badge, etc.), Radix UI primitives (select, checkbox, dialog, radio-group), light/dark theme |
| Infrastructure | Supabase (PostgreSQL + Storage), Vercel, GitHub Actions |
| Testing        | Vitest, React Testing Library |

**CI/CD.** CI on GitHub Actions (install → lint → build → test on every push/PR to `main`). CD — automatic deploys to Vercel on push to `main` via the built-in GitHub integration. The production release is gated by Vercel Deployment Checks: until the test job is green, the build isn't promoted to the production domain — a deploy with failing tests never reaches users.

## Features

- Book catalog with filtering and search
- Cart and checkout
- Payment via Stripe Checkout with a full webhook flow (success, card decline, session expiration)
- Payment retry for failed orders
- Refunds — initiated by an admin; the source of truth is the Stripe webhook, not a direct DB write
- Idempotent webhook event handling (protection against duplicates)
- Protection against race conditions on concurrent/repeated webhook events
- Admin panel: manage books, users, orders
- Role-based access control (user/admin) at the middleware level
- Unit and component tests for key parts of the app

## Screenshots

### Storefront

Home page — light and dark theme:

<p align="center">
  <img src="docs/screenshots/01-home-light.jpg" width="49%" />
  <img src="docs/screenshots/02-home-dark.jpg" width="49%" />
</p>

Catalog with search and author/price filters:

![Catalog with search and author/price filters](docs/screenshots/FILENAME.jpg)

### Checkout

Cart:

![Cart](docs/screenshots/FILENAME.jpg)

Stripe Checkout:

![Stripe Checkout](docs/screenshots/FILENAME.jpg)

Successful payment:

![Successful payment](docs/screenshots/FILENAME.jpg)

### Admin panel

Admin home page:

![Admin home page](docs/screenshots/FILENAME.jpg)

Book management:

![Book management](docs/screenshots/FILENAME.jpg)

Order management — `PENDING` / `PAID` / `CANCELLED` / `REFUNDED` statuses, refunds right from the list:

![Order management](docs/screenshots/FILENAME.jpg)

## Running locally

```bash
git clone https://github.com/murad-proger/booknest.git
cd booknest
npm install
```

Create a `.env` file with the following variables:

```env
DATABASE_URL=
AUTH_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The project uses Supabase for the database and for storing book covers — you'll need a public Storage bucket named `book-covers` in your Supabase project.

Apply Prisma migrations:

```bash
npx prisma migrate dev
```

Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000.

## Testing

```bash
npm run test
```

## Stripe: local webhook

To test payments locally you need `stripe listen`, which forwards events from your Stripe account to `/api/stripe/webhook`.

⚠️ This project's Stripe account has Stripe Sandbox enabled ("testing sandbox"), not classic Test Mode. A plain `stripe login` may log the CLI into a different account/sandbox — events get created on Stripe's side but never reach your local listener (the payment "goes through", but the status in the DB never updates).

So always run `listen` with an explicit `--api-key`, using the `STRIPE_SECRET_KEY` value from your `.env`:

```bash
stripe listen --api-key <STRIPE_SECRET_KEY from .env> --forward-to localhost:3000/api/stripe/webhook
```

After it starts, the CLI prints `Your webhook signing secret is whsec_...` — put that value into `STRIPE_WEBHOOK_SECRET` in `.env` and restart `npm run dev`.

Test card: `4242 4242 4242 4242`, any future expiry date, any CVC.

Decline test card: `4000 0000 0000 0002`, any future expiry date, any CVC. Emulates `payment_intent.payment_failed` — used to test the failed payment flow (Payment → `FAILED`, Order stays `PENDING`).

### Testing session expiration (`checkout.session.expired`)

Waiting a real 24 hours isn't practical, and `expires_at` can't be set to less than 30 minutes via `sessions.create`. Instead, you can force a session to expire through the Stripe API — this triggers a real `checkout.session.expired` event on your local webhook:

```powershell
curl.exe -u <STRIPE_SECRET_KEY>: https://api.stripe.com/v1/checkout/sessions/cs_test_XXXXXXXX/expire -X POST
```

Replace `cs_test_XXXXXXXX` with the `session.id` of an unpaid session (logged by `createCheckoutSession()`), and `<STRIPE_SECRET_KEY>` with the value from `.env` — keep the trailing colon (Basic Auth with no password).

⚠️ On PowerShell use `curl.exe`, not `curl` — plain `curl` in PowerShell is an alias for `Invoke-WebRequest` with a different set of flags (`-u` is ambiguous there).

Expected result: Order → `CANCELLED`, Payment → `FAILED` (if it was `PENDING`; an already-`FAILED` payment is left alone).

## Payment retry

`POST /api/orders/[orderId]/retry` lets you retry payment for an Order that's still `PENDING` (e.g. after a card decline).

Logic (`createRetryCheckoutSession` in `src/services/checkout.ts`):

- if the Order already has a `PENDING` Payment with an active (open) Checkout Session, the same `session.url` is returned and no new Payment is created;
- if the `PENDING` Payment's session turns out not to be open (expired/complete), that Payment is moved to `FAILED`, then a new Payment and a new Checkout Session are created;
- if the Order isn't `PENDING`, it returns `409 Order is not retryable`.

⚠️ In practice the second branch (moving a "stale" Payment to `FAILED`) almost never fires: the `checkout.session.expired` webhook usually moves the whole Order to `CANCELLED` before the user calls retry, and retry gets blocked by the Order status check (409). The branch stays in the code for a rare race condition — the retry request calls `stripe.checkout.sessions.retrieve()` directly against Stripe and can see `expired` before the local webhook has processed the `checkout.session.expired` event.

Verified manually via `stripe checkout sessions expire <session_id> --api-key <STRIPE_SECRET_KEY>` (Stripe CLI) — after expiring, the webhook moves Order → `CANCELLED`, Payment → `FAILED`, and a subsequent retry on that Order correctly returns 409.

## Refund

`POST /api/orders/[orderId]/refund` — an admin-only endpoint (checked via `requireAdmin()` in `src/lib/auth-utils.ts`), issues a refund for an already successfully paid order.

Logic (`refundPayment` in `src/services/checkout.ts`):

- finds the Order's payment with status `SUCCEEDED`;
- calls `stripe.refunds.create({ payment_intent: payment.providerPaymentId })`;
- doesn't modify the DB directly — just like with payment, the source of truth stays the Stripe webhook.

The webhook handles the `charge.refunded` event (not `refund.updated`/`refund.created`): for ordinary synchronous card refunds, `charge.refunded` is the reliable trigger, while `refund.updated` is primarily meant for asynchronous refunds (e.g. bank transfers). `charge.refunded` returns a Charge object, from which `payment_intent` is used to look up the local Payment (`providerPaymentId`), which along with the Order is moved to `REFUNDED`.

⚠️ A single call to `stripe.refunds.create()` actually makes Stripe send several events: `refund.created`, `charge.refunded`, `refund.updated`, `charge.refund.updated`. Only `charge.refunded` is handled — the other three are logged as unhandled and cause no side effects thanks to the existing `WebhookEvent` idempotency (each has its own unique `eventId`, but there's no business logic branch for them).

Verified manually: `POST /api/orders/[orderId]/refund` on a paid order → `200 { refundId, status: "succeeded" }` → the `stripe listen` logs show all four events → after processing `charge.refunded`, `Order.status = REFUNDED` and `Payment.status = REFUNDED` in the DB.