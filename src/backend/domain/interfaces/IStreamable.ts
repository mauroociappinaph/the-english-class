export interface IStreamable {
  analyzeStream(text: string): AsyncGenerator<string, void, unknown>;
}
