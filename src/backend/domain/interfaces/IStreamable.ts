export interface IStreamable {
  analyzeStream(text: string, context?: any): AsyncGenerator<string, void, unknown>;
}
