# Portfolio site (SSG, i18n, themes, order form → Telegram)

Site-визитка портфолио для фуллстек-разработчика на Next.js (SSG), с мультиязычностью (en, ru, de), двумя темами (светлая/тёмная) и формой «Заказать проект» с отправкой в Telegram.

## Стек

- **Next.js 15** (App Router, статическая генерация страниц)
- **next-intl** — маршруты по локалям: `/en/`, `/ru/`, `/de/`
- Темы: CSS-переменные + переключатель (localStorage + prefers-color-scheme)

## Дизайн

Макеты рисуются в Pencil по спецификации в папке **`design/`**:

- `design/DESIGN_SPEC.md` — список страниц, блоков, мобильная/десктоп, светлая/тёмная тема
- `design/wireframes/` — текстовые схемы блоков

## Запуск

```bash
npm install
cp .env.example .env
# Заполнить TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в .env
npm run dev
```

Откройте http://localhost:3000 — произойдёт редирект на `/en/`.

## Сборка

```bash
npm run build
npm run start
```

## Форма «Заказать проект»

1. Вопросы и варианты ответов задаются в **`src/config/order-form.ts`**.
2. Переводы для вопросов — в **`messages/*.json`** (ключи `orderQuestions.*`).
3. Приблизительная стоимость задаётся в **`src/config/cost-mapping.ts`** (ключ — комбинация option ID через запятую, например `website,small`).
4. После отправки форма шлёт POST на **`/api/order`**; сервер считает стоимость, собирает текст и отправляет его в Telegram через Bot API.

Переменные окружения: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (см. `.env.example`).

## SEO

- У каждой страницы и локали свои `title` и `description` (через `generateMetadata`).
- При необходимости можно добавить `alternates.languages` (hreflang) и `NEXT_PUBLIC_BASE_URL` для каноникала и Open Graph.
