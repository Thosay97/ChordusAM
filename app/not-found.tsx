import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-burgundy text-2xl font-bold">Page not found</h1>
      <p className="text-ink/70">
        This page does not exist, or your role does not have access to it.
      </p>
      <Link href="/" className="text-burgundy underline underline-offset-2">
        Go to your home page
      </Link>
    </main>
  );
}
