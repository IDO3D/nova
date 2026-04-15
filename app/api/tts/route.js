export async function POST(request) {
  try {
    const body = await request.json();
    const { text, voiceId, apiKey } = body;

    // Debug — remove after fixing
    console.log("TTS called with voiceId:", voiceId);
    console.log("TTS apiKey length:", apiKey?.length);
    console.log("TTS apiKey starts with:", apiKey?.slice(0, 8));

    if (!apiKey || apiKey.length < 10) {
      return new Response(JSON.stringify({ error: "No API key received" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2",
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.80,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    console.log("ElevenLabs response status:", res.status);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("ElevenLabs error body:", JSON.stringify(err));
      return new Response(JSON.stringify({ error: err, status: res.status }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const audioBuffer = await res.arrayBuffer();
    return new Response(audioBuffer, {
      status: 200,
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (e) {
    console.error("TTS route exception:", e.message);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}