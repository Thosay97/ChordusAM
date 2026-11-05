export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline font-bold tracking-tight ${className}`}>
      <span>Chordus</span>
      <span className="text-gold">AM</span>
    </span>
  );
}
