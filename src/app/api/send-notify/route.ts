import redis from "@/lib/redis";
import { NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

async function getLocation(ip: string) {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function POST(req: Request) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return NextResponse.json(
      { error: "Missing Telegram configuration" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const email = body.email;

    // Oldin ro‘yxatdan o‘tganligini tekshiramiz
    const isRegistered = await redis.sismember("registered_emails", email);
    if (isRegistered) {
      return NextResponse.json(
        { error: "This email is already registered." },
        { status: 400 }
      );
    }

    // Yangi emailni Redisga qo‘shamiz
    await redis.sadd("registered_emails", email);
    await redis.expire("registered_emails", 20 * 24 * 60 * 60); // 20 kun

    // IP, qurilma va vaqt ma'lumotlarini olish
    const ip = req.headers.get("x-forwarded-for") || "Unknown";
    const userAgent = req.headers.get("user-agent") || "Unknown Device";
    const locationData = await getLocation(ip);
    const country = locationData?.country_name || "Unknown";
    const flag = locationData?.country_code ? `🇺🇿` : "";
    const city = locationData?.city || "Unknown";
    const timezone = locationData?.timezone || "UTC";
    const currentTime = new Date().toLocaleString("en-US", {
      timeZone: timezone,
    });

    const message = `
📩 <b>Yangi foydalanuvchi ro‘yxatdan o‘tdi:</b>

👤 <b>Email:</b> ${email}
🌍 <b>Davlat:</b> ${country} ${flag}
📌 <b>IP:</b> ${ip}
📱 <b>Qurilma:</b> ${userAgent}
⏰ <b>Vaqt:</b> ${currentTime} (${timezone})
    `;

    // Telegramga xabar yuborish
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
