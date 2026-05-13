export interface IStreamable {
  analyzeStream(text: string, context?: unknown): AsyncGenerator<string, void, unknown>;
}
