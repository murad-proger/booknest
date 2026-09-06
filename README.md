This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Stripe: локальный webhook

Для проверки оплаты локально нужен `stripe listen`, который форвардит события с аккаунта Stripe на `/api/stripe/webhook`.

⚠️ У аккаунта проекта включён **Stripe Sandbox** ("testing sandbox"), а не classic Test Mode. Обычный `stripe login` может залогинить CLI в другой аккаунт/сэндбокс — тогда события создаются у Stripe, но до локального листенера не доходят (платёж при этом "проходит", а статус в БД не обновляется).

Поэтому **всегда** запускайте `listen` с явным `--api-key`, используя значение `STRIPE_SECRET_KEY` из `.env`:

```bash
stripe listen --api-key <STRIPE_SECRET_KEY из .env> --forward-to localhost:3000/api/stripe/webhook
```

После запуска команда напечатает `Your webhook signing secret is whsec_...` — вставьте это значение в `STRIPE_WEBHOOK_SECRET` в `.env` и перезапустите `npm run dev`.

Тестовая карта: `4242 4242 4242 4242`, любой будущий срок, любой CVC.

Тестовая карта для проверки отказа (decline): `4000 0000 0000 0002`, любой будущий срок, любой CVC. Эмулирует `payment_intent.payment_failed` — используется для проверки failed payment flow (Payment → FAILED, Order остаётся PENDING).

### Проверка истечения сессии (checkout.session.expired)

Ждать реальные 24 часа непрактично, а `expires_at` нельзя выставить меньше 30 минут через `sessions.create`. Вместо этого сессию можно принудительно "истечь" через Stripe API — это вызовет настоящее событие `checkout.session.expired` в локальном webhook:

```powershell
curl.exe -u <STRIPE_SECRET_KEY>: https://api.stripe.com/v1/checkout/sessions/cs_test_XXXXXXXX/expire -X POST
```

Замените `cs_test_XXXXXXXX` на `session.id` неоплаченной сессии (лог `createCheckoutSession()`), `<STRIPE_SECRET_KEY>` — на значение из `.env` с двоеточием в конце (Basic Auth без пароля).

⚠️ В PowerShell используйте `curl.exe`, а не `curl` — обычный `curl` в PowerShell — это алиас `Invoke-WebRequest` с другим набором параметров (`-u` там неоднозначен).

Ожидаемый результат: `Order → CANCELLED`, `Payment → FAILED` (если был `PENDING`; уже `FAILED` не трогается).

### Payment retry (повторная попытка оплаты)

`POST /api/orders/[orderId]/retry` позволяет повторить оплату для Order, который ещё в статусе `PENDING` (например, после card decline).

Логика (`createRetryCheckoutSession` в `src/services/checkout.ts`):

- если у Order уже есть `PENDING` Payment с активной (`open`) Checkout Session — возвращается **та же** `session.url`, новый Payment не создаётся;
- если у `PENDING` Payment сессия оказалась не `open` (`expired`/`complete`) — этот Payment переводится в `FAILED`, после чего создаётся новый `Payment` и новая Checkout Session;
- если Order не в статусе `PENDING` — `409 Order is not retryable`.

⚠️ На практике вторая ветка (перевод "протухшего" Payment в `FAILED`) почти никогда не срабатывает: обычно webhook `checkout.session.expired` успевает перевести весь Order в `CANCELLED` раньше, чем пользователь вызовет retry, и retry блокируется на проверке статуса Order (`409`). Ветка остаётся в коде ради редкого race condition — запрос на retry делает `stripe.checkout.sessions.retrieve()` напрямую к Stripe и может увидеть `expired` раньше, чем локальный webhook успеет обработать событие `checkout.session.expired`.

Проверено вручную через `stripe checkout sessions expire <session_id> --api-key <STRIPE_SECRET_KEY>` (Stripe CLI) — после expire webhook переводит Order → CANCELLED, Payment → FAILED, и повторный retry на этом Order корректно возвращает `409`.