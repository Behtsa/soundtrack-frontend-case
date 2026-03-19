/**
 * Generic error display for debugging (e.g. GraphQL/network errors in dev).
 * Prefer a user-facing message + logging in production.
 */
export function ErrorDisplay({
  error,
  title = 'Error',
}: {
  error?: unknown
  title?: string
}) {
  if (!error) return null

  return (
    <pre style={{ color: 'darkred' }} role="alert">
      {title}: {JSON.stringify(error, null, 2)}
    </pre>
  )
}
