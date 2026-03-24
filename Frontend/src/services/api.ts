export const API_BASE = 'http://localhost:8000';

export interface Claim {
  claim_id: string;
  original_sentence: string;
  atomic_claim: string;
  is_temporal: boolean;
}

export interface Source {
  url: string;
  title: string;
  excerpt: string;
  tier: 'TIER1' | 'TIER2' | 'TIER3';
}

export interface ClaimVerdict {
  claim_id: string;
  claim: Claim;
  verdict: 'TRUE' | 'FALSE' | 'PARTIALLY_TRUE' | 'CONFLICTING' | 'UNVERIFIABLE';
  confidence: number;
  sources: Source[];
  reasoning: string;
  is_conflicting: boolean;
  conflict_position_a: string | null;
  conflict_position_b: string | null;
}

export interface AccuracyReport {
  report_id: string;
  overall_score: number;
  total_claims: number;
  verdict_breakdown: Record<string, number>;
  claims: ClaimVerdict[];
  ai_text_score: number | null;
  processing_time_seconds: number;
  media_results: { url: string; ai_probability: number; is_ai_generated: boolean }[];
}

export type SSEStage =
  | { stage: 'started'; data: { message: string; input_type: string } }
  | { stage: 'preprocessing'; data: { message: string } }
  | { stage: 'preprocessed'; data: { message: string; char_count: number } }
  | { stage: 'extracting'; data: { message: string } }
  | { stage: 'claims_found'; data: { message: string; claims: string[] } }
  | { stage: 'retrieving'; data: { message: string } }
  | { stage: 'verifying'; data: { message: string; claim_id: string } }
  | { stage: 'complete'; data: AccuracyReport }
  | { stage: 'error'; data: { message: string } };

export function startVerification(
  payload: { input_type: 'TEXT' | 'URL' | 'PDF'; content: string; url?: string },
  onEvent: (event: SSEStage) => void,
  onDone: () => void,
  onError: (err: string) => void
): () => void {
  const controller = new AbortController();

  fetch(`${API_BASE}/api/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: controller.signal,
  }).then(async (res) => {
    if (!res.ok) {
      onError(`HTTP error ${res.status}`);
      return;
    }
    
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const pump = async (): Promise<void> => {
      const { done, value } = await reader.read();

      // Decode current chunk even if done
      if (value) {
        buffer += decoder.decode(value, { stream: !done });
      }

      // Always process whatever is in the buffer
      // Split on double newline first, then single newline as fallback
      const parts = buffer.split('\n\n');

      // If done, process ALL parts including the last one
      // If not done, keep the last incomplete chunk in buffer
      if (done) {
        // Process every part including the last
        for (const part of parts) {
          processSSEPart(part);
        }
        onDone();
        return;
      } else {
        // Keep last potentially incomplete chunk
        buffer = parts.pop() ?? '';
        for (const part of parts) {
          processSSEPart(part);
        }
      }

      await pump();
    };

    // Extract the SSE processing into a helper function
    const processSSEPart = (part: string) => {
      if (!part.trim()) return;
      const lines = part.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.slice(6).trim();
          if (jsonStr) {
            try {
              const parsed = JSON.parse(jsonStr);
              console.log('[SSE received]', parsed.stage, parsed);
              onEvent(parsed as SSEStage);
            } catch (e) {
              console.error('[SSE parse error]', jsonStr, e);
            }
          }
        }
      }
    };

    await pump();
  }).catch((err) => {
    if (err.name !== 'AbortError') {
      console.error('[SSE connection error]', err);
      onError(err.message);
    }
  });

  return () => controller.abort();
}

export async function detectAIText(text: string): Promise<{ ai_score: number; label: string }> {
  const res = await fetch(`${API_BASE}/api/detect-ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res.json();
}
