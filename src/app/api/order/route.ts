import { NextRequest, NextResponse } from "next/server";
import { getApproximateCost } from "@/config/cost-mapping";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const LABELS: Record<string, Record<string, string>> = {
  project_type: {
    site: "Сайт",
    shop: "Интернет-магазин",
    tg_bot: "Telegram-бот",
    tg_miniapp: "Telegram Mini App",
    web3: "Web3",
  },
  has_design: {
    yes: "Да",
    no: "Нет",
    example: "Есть пример",
  },
};

const CONTACT_METHOD_LABELS: Record<string, string> = {
  telegram: "Телеграм",
  email: "Почта",
};

interface AnswerItem {
  questionId: string;
  optionId: string;
}

interface Body {
  answers: AnswerItem[];
  description?: string;
  contactMethod: "telegram" | "email";
  name: string;
  phone?: string;
  telegramUsername?: string;
  email?: string;
}

function getLabel(questionId: string, optionId: string): string {
  const map = LABELS[questionId];
  return map?.[optionId] ?? optionId;
}

function buildMessage(body: Body): string {
  const answersMap = Object.fromEntries(body.answers.map((a) => [a.questionId, a.optionId]));
  const lines: string[] = ["🆕 Новый заказ", ""];

  const projectType = answersMap.project_type;
  if (projectType) lines.push(`Тип: ${getLabel("project_type", projectType)}`);

  const hasDesign = answersMap.has_design;
  if (hasDesign) lines.push(`Дизайн: ${getLabel("has_design", hasDesign)}`);

  if (body.description?.trim()) {
    lines.push("", "Описание продукта:", `"${body.description.trim()}"`);
  }

  const costKey = ["project_type", "has_design"].map((id) => answersMap[id]).filter(Boolean);
  const cost = getApproximateCost(costKey);
  lines.push("", `Примерная стоимость: ${cost}`);

  lines.push("", "Контакт:", `Имя: ${body.name}`, `Метод: ${CONTACT_METHOD_LABELS[body.contactMethod] ?? body.contactMethod}`);

  if (body.contactMethod === "telegram") {
    if (body.phone?.trim()) lines.push(`Телефон: ${body.phone.trim()}`);
    if (body.telegramUsername?.trim()) lines.push(`Юзернейм: @${body.telegramUsername.replace(/^@/, "")}`);
  } else if (body.email?.trim()) {
    lines.push(`Email: ${body.email.trim()}`);
  }

  return lines.join("\n");
}

export async function POST(request: NextRequest) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    !Array.isArray(body.answers) ||
    !body.contactMethod ||
    !body.name ||
    typeof body.name !== "string" ||
    !body.name.trim()
  ) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  if (body.contactMethod === "telegram" && !body.phone?.trim()) {
    return NextResponse.json({ error: "Phone required for Telegram" }, { status: 400 });
  }
  if (body.contactMethod === "email" && !body.email?.trim()) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const text = buildMessage(body);
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Telegram API error:", res.status, err);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
