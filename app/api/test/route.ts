export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const modelId = process.env.MODEL_ID || "claude-haiku-4-5-20251001";

  if (!apiKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY not set" });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: modelId,
        max_tokens: 10,
        messages: [{ role: "user", content: "Rispondi solo: OK" }],
      }),
    });
    const data = await res.json();

    return Response.json({
      keyExists: true,
      keyPrefix: apiKey.substring(0, 10) + "...",
      model: modelId,
      status: res.status,
      response: data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown";
    return Response.json({ error: message });
  }
}
