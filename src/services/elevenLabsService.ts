
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
const client = new ElevenLabsClient({
  apiKey,
});

const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel

export const textToSpeech = async (text: string): Promise<ReadableStream<Uint8Array>> => {
  if (!apiKey) {
    throw new Error("ElevenLabs API key not found in environment variables.");
  }

  const audio = await client.textToSpeech.convert(voiceId, {
    text,
    model_id: "eleven_multilingual_v2",
  });

  return audio;
};
