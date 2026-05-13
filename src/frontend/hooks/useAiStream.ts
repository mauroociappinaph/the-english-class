import { useState, useRef, useCallback } from 'react';
import { StreamOptions } from '@/frontend/types/hooks';

export function useAiStream() {
  const [streamedText, setStreamedText] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const startStream = useCallback(async (text: string, options?: StreamOptions) => {
    // Reset state
    setStreamedText('');
    setError(null);
    setIsStreaming(true);
    const clientStreamStart = performance.now();
    console.log(`[Client Stream] Starting stream for: "${text}"`);

    // Cancel previous stream if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          type: options?.type || 'expression',
          userLevel: options?.userLevel || 'B1',
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') {
              continue;
            }

            try {
              const data = JSON.parse(dataStr);
              if (data.error) {
                throw new Error(data.error);
              }
              if (data.text) {
                if (accumulatedText === '') {
                  const firstChunkTime = performance.now();
                  console.log(`[Client Stream] Received FIRST chunk in ${((firstChunkTime - clientStreamStart) / 1000).toFixed(2)}s`);
                }
                accumulatedText += data.text;
                setStreamedText(accumulatedText);
              }
            } catch (e) {
              // Ignore partial JSON parse errors for safety
            }
          }
        }
      }

      // Fire completion callback
      if (options?.onFinish) {
        options.onFinish(accumulatedText);
      }

    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') {
        console.log('[useAiStream] Stream aborted by user.');
      } else {
        const errMsg = (err as Error).message || 'Unknown stream error';
        setError(errMsg);
        if (options?.onError) {
          options.onError(err as Error);
        }
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
      const totalTime = performance.now();
      console.log(`[Client Stream] Stream FINISHED in ${((totalTime - clientStreamStart) / 1000).toFixed(2)}s`);
    }
  }, []);

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  return {
    streamedText,
    isStreaming,
    error,
    startStream,
    stopStream
  };
}
