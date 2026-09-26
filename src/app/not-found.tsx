import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F9F6F0] px-4 py-16 text-[#1D3E2E]">
      <div className="w-full max-w-xl rounded-[2rem] border border-[#E8E2D5] bg-white p-8 text-center shadow-[0_24px_60px_rgba(29,62,46,0.08)] sm:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FBE8DF] text-3xl text-[#E06D3B]">
          404
        </div>
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.28em] text-[#E06D3B]">
          Page not found
        </p>
        <h1 className="font-serif text-4xl font-bold tracking-[-0.05em] text-[#1D3E2E] sm:text-5xl">
          This page wandered off.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#55695E]">
          The item or page you were looking for is not available right now. Head back to the market and keep shopping locally.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[#1D3E2E] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#E06D3B]"
          >
            Return home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full border border-[#D9CFC2] bg-[#F9F6F0] px-6 py-3 text-sm font-bold text-[#1D3E2E] transition hover:border-[#E06D3B] hover:text-[#E06D3B]"
          >
            Browse products
          </Link>
        </div>
      </div>
    </main>
  );
}
