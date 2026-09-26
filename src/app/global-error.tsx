'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void error;

  return (
    <html>
      <body className="bg-[#F9F6F0] text-[#1D3E2E]">
        <main className="flex min-h-screen items-center justify-center px-4 py-16">
          <div className="w-full max-w-xl rounded-[2rem] border border-[#E8E2D5] bg-white p-8 text-center shadow-[0_24px_60px_rgba(29,62,46,0.08)]">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.28em] text-[#E06D3B]">
              Something went wrong
            </p>
            <h1 className="font-serif text-4xl font-bold tracking-[-0.05em] text-[#1D3E2E] sm:text-5xl">
              The market is taking a quick break.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#55695E]">
              We encountered an unexpected issue. Please refresh the page or try again in a moment.
            </p>
            <button
              onClick={() => reset()}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#1D3E2E] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#E06D3B]"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
