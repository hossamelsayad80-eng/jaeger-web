import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const auth = req.headers.get("authorization");

  if (!url || !anon) {
    return NextResponse.json(
      { error: "Missing Supabase configuration." },
      { status: 500 }
    );
  }

  if (!auth) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { booking_id, requesting_user_id } = await req.json();
  if (!booking_id) {
    return NextResponse.json({ error: "Missing booking_id." }, { status: 400 });
  }

  const fnRes = await fetch(`${url}/functions/v1/create_room_token`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      apikey: anon,
      authorization: auth,
    },
    body: JSON.stringify({
      booking_id,
      requesting_user_id,
      role: "coach",
    }),
  });

  const text = await fnRes.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { error: text || "Could not get room token." };
  }

  return NextResponse.json(data, { status: fnRes.status });
}
