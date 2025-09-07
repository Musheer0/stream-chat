/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@clerk/nextjs/server";
import { StreamChat } from "stream-chat";

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

export async function sendSystemMessage(channelId: string) {
  const session = await auth();
  if (!session.userId) return;

  try {
    const channel = serverClient.channel("messaging", channelId);

    // normal system text
    await channel.sendMessage({
      text: "📹 Video call started",
      type: "system",
      user_id: session.userId,
      html:`/call/${channelId}`
    });


    return { success: true };
  } catch (err: any) {
    console.error("Failed to send system message:", err);
    return { success: false, error: err.message };
  }
}
export async function sendEndSystemMessage(channelId: string) {
  const session = await auth();
  if (!session.userId) return;

  try {
    const channel = serverClient.channel("messaging", channelId);

    // normal system text
    await channel.sendMessage({
      text: "📹 Video call ended",
      type: "system",
      user_id: session.userId,
    });


    return { success: true };
  } catch (err: any) {
    console.error("Failed to send system message:", err);
    return { success: false, error: err.message };
  }
}
