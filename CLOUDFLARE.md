# Деплой на Cloudflare (Workers)

Сайт собирается через [OpenNext Cloudflare](https://opennext.js.org/cloudflare) и деплоится в Cloudflare Workers.

## Требования

- Node.js 18+
- Аккаунт Cloudflare
- Wrangler 3.99.0+

## Установка зависимостей

```bash
pnpm add @opennextjs/cloudflare
pnpm add -D wrangler@latest
```

## Локальная разработка

- `pnpm dev` — обычный Next.js dev-сервер.

## Сборка и деплой

- **Предпросмотр локально (Workers runtime):**
  ```bash
  pnpm run preview
  ```
- **Деплой в Cloudflare:**
  ```bash
  pnpm run deploy
  ```

Скрипт `deploy` выполняет сборку через OpenNext и публикует Worker через Wrangler.

## Конфигурация

- `wrangler.jsonc` — имя воркера, compatibility flags, assets, services.
- `open-next.config.ts` — конфиг адаптера (при необходимости можно добавить R2 для кэша).
- Переменные окружения для продакшена задаются в [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers → ваш Worker → Settings → Variables (или через `wrangler secret`).

## Переменные окружения на Cloudflare

Для формы заказа укажите в настройках воркера (или в `.dev.vars` для превью):

- `TELEGRAM_BOT_TOKEN` — токен бота от @BotFather.
- `TELEGRAM_CHAT_ID` — ID чата для уведомлений.

Опционально для сайта:

- `NEXT_PUBLIC_SITE_URL` — полный URL сайта (например `https://yoursite.pages.dev`).
- `NEXT_PUBLIC_SITE_NAME` — название (по умолчанию "Portfolio").

## CI/CD

В пайплайне используйте:

- **Build:** `pnpm run deploy` (собирает и деплоит) или раздельно: сначала `pnpm exec opennextjs-cloudflare build`, затем `pnpm exec wrangler deploy`.
- Убедитесь, что в CI заданы секреты/переменные (например `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` и т.д.).
