import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import { DISCOVERY_FARMER_LIST, DISCOVERY_PRODUCTS } from '@/lib/discovery-data';
import { ArrowLeft, BadgeCheck, MapPin, PackageCheck, Star } from 'lucide-react';

const currency = (amount: number) => `Rs. ${amount.toLocaleString('en-PK')}`;

export default async function FarmerStorefrontPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const farmer = DISCOVERY_FARMER_LIST.find((item) => item.slug === slug);
  if (!farmer) notFound();

  const products = DISCOVERY_PRODUCTS.filter((product) => product.farmer.id === farmer.id);

  return (
    <div className="min-h-screen bg-[#F5F7F4] text-[#24382B]">
      <header className="border-b border-[#DDE4DC] bg-white">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-lg font-extrabold text-[#1D3E2E]">MarketLink</Link>
          <Link href="/shop" className="inline-flex h-9 items-center gap-1.5 border border-[#DDE4DC] px-3 text-xs font-bold text-[#35483B] hover:border-[#1D6B4B]"><ArrowLeft className="h-3.5 w-3.5" />Back to products</Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-14 pt-5 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-[11px] text-[#758279]">
          <Link href="/" className="hover:text-[#1D6B4B]">Home</Link><span aria-hidden="true">/</span><Link href="/producers" className="hover:text-[#1D6B4B]">Farmers</Link><span aria-hidden="true">/</span><span className="font-semibold text-[#314538]">{farmer.farmName}</span>
        </nav>

        <section className="grid gap-6 border border-[#DDE4DC] bg-white p-5 sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-7 sm:p-8">
          <Image src={farmer.avatar} alt={`${farmer.name} from ${farmer.farmName}`} width={128} height={128} sizes="128px" className="h-28 w-28 rounded-full border border-[#E1E7E0] object-cover sm:h-32 sm:w-32" priority />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#C75A32]">Independent farm · Pakistan</p>
              {farmer.verified && <span className="inline-flex items-center gap-1 bg-[#E9F3EB] px-2 py-1 text-[10px] font-bold text-[#286441]"><BadgeCheck className="h-3.5 w-3.5" />Verified farmer</span>}
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1D3E2E] sm:text-3xl">{farmer.farmName}</h1>
            <p className="mt-1 text-sm text-[#647369]">Grown and shared by {farmer.name}</p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#526158]">{farmer.story}</p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#E9EDE8] pt-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4E5F54]"><MapPin className="h-4 w-4 text-[#C75A32]" />{farmer.district}, {farmer.city}</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4E5F54]"><Star className="h-4 w-4 fill-[#D89A28] text-[#D89A28]" />{Number(farmer.rating || 0).toFixed(1)} from {farmer.totalReviews} reviews</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4E5F54]"><PackageCheck className="h-4 w-4 text-[#1D6B4B]" />{farmer.completedOrders.toLocaleString()} completed orders</span>
            </div>
          </div>
        </section>

        <section className="mt-9" aria-labelledby="farm-harvest-heading">
          <div className="mb-4 flex items-end justify-between gap-3 border-b border-[#DDE4DC] pb-3">
            <div><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#C75A32]">From this farm</p><h2 id="farm-harvest-heading" className="mt-1 text-xl font-extrabold text-[#1D3E2E]">Available harvest</h2></div>
            <span className="text-xs text-[#718076]">{products.length} products</span>
          </div>
          {products.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => <article key={product.id} className="border border-[#E0E6DF] bg-white">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F0F3EF]"><Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover" /></div>
              <div className="p-3"><p className="text-[9px] font-bold uppercase tracking-wide text-[#77867B]">{product.category}</p><h3 className="mt-1 line-clamp-2 min-h-10 text-xs font-bold leading-5 text-[#2D4235]">{product.name}</h3><div className="mt-2 flex items-baseline gap-1"><span className="text-sm font-extrabold text-[#C75A32]">{currency(product.price)}</span><span className="text-[10px] text-[#718076]">/ {product.unit}</span></div><Link href={`/shop?search=${encodeURIComponent(product.name)}`} className="mt-3 flex h-9 items-center justify-center bg-[#1D3E2E] text-[10px] font-bold text-white hover:bg-[#28543E]">Shop this product</Link></div>
            </article>)}
          </div> : <p className="border border-dashed border-[#CAD6CA] bg-white p-8 text-center text-sm text-[#718076]">This farm has no products available right now.</p>}
        </section>
      </main>
      <Footer />
    </div>
  );
}