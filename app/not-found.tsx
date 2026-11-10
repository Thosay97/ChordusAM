import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="eyebrow">404</span>
      <h1 className="font-display text-5xl font-semibold uppercase">
        Page <em className="gold-text font-medium">not found.</em>
      </h1>
      <p className="text-cream/80 max-w-md">
        This page does not exist, or your role does not have access to it.
      </p>
      <Link href="/" className="btn btn-gold mt-2">
        Go to your home page
      </Link>
    </main>
  );
}
