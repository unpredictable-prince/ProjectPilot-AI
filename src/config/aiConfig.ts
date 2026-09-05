export const DEFAULT_GEMINI_MODEL = 'gemini-1.5-flash';

export const CANDIDATE_GEMINI_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash-exp',
  'gemini-1.5-pro',
] as const;

export interface GeminiPart {
  text: string;
}

export interface GeminiContent {
  parts: GeminiPart[];
}

export interface GeminiCandidate {
  content: GeminiContent;
  finishReason?: string;
}

export interface GeminiResponsePayload {
  candidates?: GeminiCandidate[];
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

/**
 * Validates whether an incoming raw object matches expected Gemini JSON payload shape.
 */
export function isValidGeminiResponsePayload(data: unknown): data is GeminiResponsePayload {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  if (obj.candidates && Array.isArray(obj.candidates)) {
    return true;
  }
  return false;
}
