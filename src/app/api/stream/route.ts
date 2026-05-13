import { NextRequest } from "next/server";
import { linguisticAnalyzer, journalAnalyzer } from "@/backend/infrastructure/registry";
import { IStreamable } from "@/backend/domain/interfaces/IStreamable";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { text, type = "expression", userLevel = "B1" } = await req.json();

    if (!text) {
      return new Response("Missing text", { status: 400 });
    }

    const encoder = new TextEncoder();
    
    // Choose the right analyzer based on the request
    const analyzer = type === "journal" ? journalAnalyzer : linguisticAnalyzer;
    const streamableAnalyzer = analyzer as unknown as IStreamable;

    if (!streamableAnalyzer.analyzeStream) {
      return new Response("Streaming not supported for this analyzer", { status: 501 });
    }

    // Determine arguments based on type
    const generator = type === "journal" 
      ? streamableAnalyzer.analyzeStream(text, userLevel)
      : streamableAnalyzer.analyzeStream(text);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          let chunkCount = 0;
          for await (const chunk of generator) {
            chunkCount++;
            // Encode the chunk as an SSE message
            const sseMessage = `data: ${JSON.stringify({ text: chunk })}\n\n`;
            controller.enqueue(encoder.encode(sseMessage));
          }
          console.log(`[Stream Route] Successfully sent ${chunkCount} chunks for: ${text}`);
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (error) {
          console.error("[Stream Route] ERROR during streaming for:", text, error);
          const errorMessage = `data: ${JSON.stringify({ error: "Stream failed" })}\n\n`;
          controller.enqueue(encoder.encode(errorMessage));
        } finally {
          controller.close();
        }
      },
      cancel() {
        console.log("[Stream Route] Client disconnected");
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("[Stream Route] Setup error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
