export type Successful<T> = Omit<Required<T>, 'error'>

export function maybeThrow<T extends { error?: string }>(
  res: T,
  method: string
): Successful<T> {
  if (res.error != null) {
    throw new Error(`${method} returned an error:\n${res.error}`)
  }
  const { error, ...rest } = res as Required<T>
  return rest
}
