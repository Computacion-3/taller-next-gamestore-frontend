export function ErrorMessage({ message }: { message: string }) {
  return (
    <p
      role="alert"
      data-cy="error-message"
      className="rounded-lg border border-red-400/50 bg-red-950/70 px-4 py-3 text-sm text-red-100"
    >
      {message}
    </p>
  );
}
