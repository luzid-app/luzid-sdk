export function assert(expr: boolean, message?: string) {
  if (!expr) {
    throw new Error(message ?? 'unknown assertion error')
  }
}
