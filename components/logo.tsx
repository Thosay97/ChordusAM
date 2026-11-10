import Image from "next/image";

/** AMPL mark plus the ChordusAM wordmark, styled like the website's nav brand. */
export function Logo({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Image src="/ampl-mark.png" width={size} height={size} alt="" priority />
      <span className="leading-none">
        <span className="font-display block text-[1.35em] font-bold tracking-[0.04em]">
          Chordus<span className="text-gold">AM</span>
        </span>
        <span className="text-muted mt-1 block font-mono text-[0.5em] tracking-[0.3em] uppercase">
          Alliance Media
        </span>
      </span>
    </span>
  );
}
