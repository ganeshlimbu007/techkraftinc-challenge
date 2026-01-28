export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900"
      style={{
        width: size,
        height: size,
      }}
    />
  );
}
