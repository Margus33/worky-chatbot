export async function GET() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const modelId = process.env.MODEL_ID || "openai/gpt-4o-mini";

  // Test 1: check if key exists
  if (!apiKey) {
    return Response.json({ error: "OPENROUTER_API_KEY not set" });
  }

  // Test 2: check key validity
  try {
    const authRes = await fetch("https://openrouter.ai/api/v1/auth/key", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const authData = await authRes.json();

    // Test 3: try a simple completion
    const chatRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://worky-chatbot.vercel.app",
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: "user", content: "Rispondi solo: OK" }],
        max_tokens: 10,
      }),
    });
    const chatData = await chatRes.json();

    return Response.json({
      keyExists: true,
      keyPrefix: apiKey.substring(0, 10) + "...",
      model: modelId,
      auth: authData,
      chat: chatData,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown";
    return Response.json({ error: message });
  }
}
