export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return res.status(500).json({ error: "Supabase configuration missing" });
    }

    const response = await fetch(`${url}/rest/v1/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": key,
        "Authorization": `Bearer ${key}`,
        "Prefer": "return=representation"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Booking database error",
        details: data
      });
    }

    return res.status(200).json({
      success: true,
      booking: data
    });
  } catch (error) {
    return res.status(500).json({
      error: "Booking server error",
      details: error.message
    });
  }
}
