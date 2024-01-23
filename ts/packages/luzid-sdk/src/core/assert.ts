export function assert(expr: boolean, message?: string): asserts expr {
  if (!expr) {
    throw new Error(message ?? 'unknown assertion error')
  }
}
