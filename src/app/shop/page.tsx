'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import DbStatusBadge from '@/components/DbStatusBadge';
import { clearStoredUser, getStoredUser, setStoredUser } from '@/lib/auth';
import { useCart, addToCart as addProductToCart, updateCartQuantity, clearCart } from '@/lib/cart';
import type { User, Product } from '@/lib/types';
import {
  DISCOVERY_CATEGORIES,
  DISCOVERY_PRODUCTS,
  type DiscoveryCategory,
  type DiscoveryFarmer,
  type DiscoveryProduct,
} from '@/lib/discovery-data';
import {
  BadgeCheck, Check, ChevronDown, ChevronLeft, ChevronRight, Grid2X2, Heart, List,
  MapPin, Minus, Plus, Search, ShoppingBasket, SlidersHorizontal, Sparkles,
  Star, Store, X,
} from 'lucide-react';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'nearest';
type ProductView = 'grid' | 'list';

interface Filters {
  categories: DiscoveryCategory[];
  farmers: string[];
  minPrice: string;
  maxPrice: string;
  city: string;
  district: string;
  radius: string;
  rating: number;
  organic: boolean;
  sameDay: boolean;
  preorder: boolean;
  bulk: boolean;
}

const initialFilters: Filters = {
  categories: [], farmers: [], minPrice: '', maxPrice: '', city: '', district: '', radius: '',
  rating: 0, organic: false, sameDay: false, preorder: false, bulk: false,
};

const currency = (amount: number) => `Rs. ${Number(amount || 0).toLocaleString('en-PK')}`;
const cities = [...new Set(DISCOVERY_PRODUCTS.map((product) => product.farmer.city))].sort();
const districts = [...new Set(DISCOVERY_PRODUCTS.map((product) => product.farmer.district))].sort();
const farmerList = [...new Map(DISCOVERY_PRODUCTS.map((product) => [product.farmer.id, product.farmer])).values()];
const pageSize = 9;

interface FilterSidebarProps {
  filters: Filters;
  updateFilters: (change: Partial<Filters>) => void;
  clearFilters: () => void;
  onDone?: () => void;
}

function FilterSidebar({ filters, updateFilters, clearFilters, onDone }: FilterSidebarProps) {
  const [sellerSearch, setSellerSearch] = useState('');
  const matchingFarmers = farmerList.filter((farmer) =>
    `${farmer.farmName} ${farmer.name}`.toLowerCase().includes(sellerSearch.toLowerCase())
  );
  const toggleCategory = (category: DiscoveryCategory) => updateFilters({
    categories: filters.categories.includes(category)
      ? filters.categories.filter((item) => item !== category)
      : [...filters.categories, category],
  });
  const toggleFarmer = (farmerId: string) => updateFilters({
    farmers: filters.farmers.includes(farmerId)
      ? filters.farmers.filter((item) => item !== farmerId)
      : [...filters.farmers, farmerId],
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-[#E5E9E5] pb-4">
        <div>
          <h2 className="text-base font-extrabold text-[#1D3E2E]">Filters</h2>
          <p className="mt-0.5 text-xs text-[#6E7D73]">Make this harvest yours</p>
        </div>
        <button type="button" onClick={clearFilters} className="text-xs font-bold text-[#C75A32] hover:underline">Clear all</button>
      </div>

      <section aria-labelledby="category-filter-title">
        <h3 id="category-filter-title" className="mb-2.5 text-sm font-bold text-[#293D31]">Categories</h3>
        <div className="space-y-2.5">
          {DISCOVERY_CATEGORIES.map((category) => (
            <label key={category} className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#526158]">
              <input type="checkbox" checked={filters.categories.includes(category)} onChange={() => toggleCategory(category)} className="h-4 w-4 accent-[#1D6B4B]" />
              <span>{category}</span>
              <span className="ml-auto text-[11px] text-[#98A49B]">{DISCOVERY_PRODUCTS.filter((item) => item.category === category).length}</span>
            </label>
          ))}
        </div>
      </section>

      <section aria-labelledby="farmer-filter-title" className="border-t border-[#E5E9E5] pt-4">
        <h3 id="farmer-filter-title" className="mb-2.5 text-sm font-bold text-[#293D31]">Farmer / seller</h3>
        <label className="relative mb-2.5 block">
          <Search aria-hidden="true" className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#8B978E]" />
          <input value={sellerSearch} onChange={(event) => setSellerSearch(event.target.value)} placeholder="Find a farm" className="h-9 w-full rounded border border-[#DDE3DD] bg-white pl-8 pr-2 text-xs outline-none focus:border-[#1D6B4B]" />
        </label>
        <div className="max-h-40 space-y-2.5 overflow-y-auto pr-1">
          {matchingFarmers.map((farmer) => (
            <label key={farmer.id} className="flex cursor-pointer items-center gap-2 text-xs text-[#526158]">
              <input type="checkbox" checked={filters.farmers.includes(farmer.id)} onChange={() => toggleFarmer(farmer.id)} className="h-4 w-4 accent-[#1D6B4B]" />
              <span className="min-w-0 flex-1 truncate">{farmer.farmName}</span>
              <span className="flex shrink-0 items-center gap-0.5 text-[10px] font-bold text-[#9A6A19]"><Star className="h-3 w-3 fill-current" />{Number(farmer.rating || 0).toFixed(1)}</span>
            </label>
          ))}
        </div>
      </section>

      <section aria-labelledby="price-filter-title" className="border-t border-[#E5E9E5] pt-4">
        <h3 id="price-filter-title" className="mb-2.5 text-sm font-bold text-[#293D31]">Price range</h3>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="min-price">Minimum price</label>
          <input id="min-price" type="number" min="0" value={filters.minPrice} onChange={(event) => updateFilters({ minPrice: event.target.value })} placeholder="Min" className="h-9 min-w-0 w-full rounded border border-[#DDE3DD] px-2 text-xs outline-none focus:border-[#1D6B4B]" />
          <span className="text-xs text-[#98A49B]">to</span>
          <label className="sr-only" htmlFor="max-price">Maximum price</label>
          <input id="max-price" type="number" min="0" value={filters.maxPrice} onChange={(event) => updateFilters({ maxPrice: event.target.value })} placeholder="Max" className="h-9 min-w-0 w-full rounded border border-[#DDE3DD] px-2 text-xs outline-none focus:border-[#1D6B4B]" />
        </div>
        <button type="button" onClick={() => updateFilters({ minPrice: filters.minPrice.trim(), maxPrice: filters.maxPrice.trim() })} className="mt-2.5 h-8 w-full rounded bg-[#1D3E2E] text-xs font-bold text-white transition hover:bg-[#28543E]">Apply price</button>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[['Under Rs. 200', '', '200'], ['Rs. 200-500', '200', '500'], ['Rs. 500+', '500', '']].map(([label, minPrice, maxPrice]) => (
            <button key={label} type="button" onClick={() => updateFilters({ minPrice, maxPrice })} className="rounded border border-[#DDE3DD] px-2 py-1 text-[10px] font-semibold text-[#59675E] hover:border-[#1D6B4B] hover:text-[#1D6B4B]">{label}</button>
          ))}
        </div>
      </section>

      <section aria-labelledby="location-filter-title" className="border-t border-[#E5E9E5] pt-4">
        <h3 id="location-filter-title" className="mb-2.5 text-sm font-bold text-[#293D31]">Location & proximity</h3>
        <label className="mb-2 block">
          <span className="sr-only">City</span>
          <select value={filters.city} onChange={(event) => updateFilters({ city: event.target.value, district: '' })} className="h-9 w-full rounded border border-[#DDE3DD] bg-white px-2 text-xs text-[#526158] outline-none focus:border-[#1D6B4B]">
            <option value="">All cities</option>{cities.map((city) => <option key={city}>{city}</option>)}
          </select>
        </label>
        <label className="mb-2 block">
          <span className="sr-only">District</span>
          <select value={filters.district} onChange={(event) => updateFilters({ district: event.target.value })} className="h-9 w-full rounded border border-[#DDE3DD] bg-white px-2 text-xs text-[#526158] outline-none focus:border-[#1D6B4B]">
            <option value="">All districts</option>{districts.filter((district) => !filters.city || DISCOVERY_PRODUCTS.some((item) => item.farmer.district === district && item.farmer.city === filters.city)).map((district) => <option key={district}>{district}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="sr-only">Distance radius</span>
          <select value={filters.radius} onChange={(event) => updateFilters({ radius: event.target.value })} className="h-9 w-full rounded border border-[#DDE3DD] bg-white px-2 text-xs text-[#526158] outline-none focus:border-[#1D6B4B]">
            <option value="">Any distance</option><option value="10">Within 10 km</option><option value="25">Within 25 km</option><option value="50">Within 50 km</option>
          </select>
        </label>
      </section>

      <section aria-labelledby="rating-filter-title" className="border-t border-[#E5E9E5] pt-4">
        <h3 id="rating-filter-title" className="mb-2.5 text-sm font-bold text-[#293D31]">Rating & reviews</h3>
        <div className="space-y-2">
          {[4, 3, 2].map((rating) => (
            <label key={rating} className="flex cursor-pointer items-center gap-2 text-xs text-[#526158]">
              <input type="radio" name="rating" checked={filters.rating === rating} onChange={() => updateFilters({ rating: filters.rating === rating ? 0 : rating })} className="h-4 w-4 accent-[#1D6B4B]" />
              <span className="flex items-center gap-1">{rating} Stars & Up <span className="flex text-[#D89A28]">{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-3 w-3 ${index < rating ? 'fill-current' : ''}`} />)}</span></span>
            </label>
          ))}
        </div>
      </section>

      <section aria-labelledby="perks-filter-title" className="border-t border-[#E5E9E5] pt-4">
        <h3 id="perks-filter-title" className="mb-2.5 text-sm font-bold text-[#293D31]">Badges & perks</h3>
        <div className="space-y-2.5">
          {([
            ['organic', 'Verified Organic'], ['sameDay', 'Same-Day Pickup'],
            ['preorder', 'Pre-Order Available'], ['bulk', 'Discounted / Bulk Deals'],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center gap-2.5 text-xs text-[#526158]">
              <input type="checkbox" checked={filters[key]} onChange={(event) => updateFilters({ [key]: event.target.checked })} className="h-4 w-4 accent-[#1D6B4B]" />{label}
            </label>
          ))}
        </div>
      </section>
      {onDone && <button type="button" onClick={onDone} className="h-11 w-full rounded bg-[#1D3E2E] text-sm font-bold text-white">Show products</button>}
    </div>
  );
}

function FarmerPreview({ farmer, onClose }: { farmer: DiscoveryFarmer; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-[#14251B]/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="farmer-preview-title" className="w-full max-w-md border border-[#DDE4DC] bg-white shadow-2xl">
        <div className="flex items-start gap-4 p-5">
          <Image src={farmer.avatar} alt="" width={64} height={64} sizes="64px" className="h-16 w-16 rounded-full border border-[#DFE6DD] object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1D6B4B]">{farmer.verified ? <><BadgeCheck className="h-4 w-4" /> Verified farmer</> : 'Local farmer'}</div>
            <h2 id="farmer-preview-title" className="mt-1 text-lg font-extrabold text-[#1D3E2E]">{farmer.farmName}</h2>
            <p className="mt-0.5 text-xs text-[#67766C]">{farmer.name} · {farmer.district}, {farmer.city}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close farmer profile" className="rounded p-1 text-[#66746A] hover:bg-[#F1F4F0]"><X className="h-5 w-5" /></button>
        </div>
        <div className="border-y border-[#E8ECE7] px-5 py-4">
          <p className="text-sm leading-6 text-[#506056]">{farmer.story}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#F4F7F3] px-2 py-3"><p className="text-base font-extrabold text-[#1D3E2E]">{Number(farmer.rating || 0).toFixed(1)} <span className="text-[#D89A28]">★</span></p><p className="mt-1 text-[10px] text-[#718076]">{farmer.totalReviews} reviews</p></div>
            <div className="bg-[#F4F7F3] px-2 py-3"><p className="text-base font-extrabold text-[#1D3E2E]">{farmer.completedOrders.toLocaleString()}</p><p className="mt-1 text-[10px] text-[#718076]">Completed orders</p></div>
            <div className="bg-[#F4F7F3] px-2 py-3"><p className="text-base font-extrabold text-[#1D3E2E]">{farmer.distanceKm} km</p><p className="mt-1 text-[10px] text-[#718076]">From market</p></div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 p-5">
          <span className="flex items-center gap-1.5 text-xs text-[#67766C]"><MapPin className="h-4 w-4 text-[#C75A32]" />{farmer.pickupAvailable ? 'Farm pickup available' : 'Delivery available'}</span>
          <Link href={`/producers/${farmer.slug}`} onClick={onClose} className="inline-flex h-10 items-center gap-2 bg-[#1D3E2E] px-4 text-xs font-bold text-white hover:bg-[#28543E]">Visit storefront <ChevronRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </div>
  );
}

export default function ShopPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#F5F7F4]" />}><ShopContent /></Suspense>;
}

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryById: Record<string, DiscoveryCategory> = {
    '1': 'Organic Vegetables', '2': 'Fresh Fruits', '3': 'Dairy & Poultry',
    '4': 'Grains & Staples', '5': 'Seeds & Herbs', '6': 'Dairy & Poultry',
  };
  const categoryBySlug: Record<string, DiscoveryCategory> = {
    'organic-vegetables': 'Organic Vegetables', 'fresh-fruits': 'Fresh Fruits',
    'dairy-poultry': 'Dairy & Poultry', 'grains-staples': 'Grains & Staples', 'seeds-herbs': 'Seeds & Herbs',
  };
  const [filters, setFilters] = useState<Filters>(() => {
    const categoryId = searchParams.get('categoryId');
    const categorySlug = searchParams.get('category');
    return {
      ...initialFilters,
      categories: categorySlug && categoryBySlug[categorySlug]
        ? [categoryBySlug[categorySlug]]
        : categoryId && categoryById[categoryId] ? [categoryById[categoryId]] : [],
      organic: searchParams.get('tag')?.toLowerCase() === 'organic',
    };
  });
  const [sort, setSort] = useState<SortOption>('featured');
  const [view, setView] = useState<ProductView>('grid');
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { cartItems, totalCartCount, updateQuantity, clearCart } = useCart();
  const [basketOpen, setBasketOpen] = useState(false);
  const [farmerPreview, setFarmerPreview] = useState<DiscoveryFarmer | null>(null);
  const [hoveredFarmer, setHoveredFarmer] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const updateFilters = (change: Partial<Filters>) => {
    setFilters((current) => ({ ...current, ...change }));
    setPage(1);
  };
  const clearFilters = () => { setFilters(initialFilters); setSearch(''); setPage(1); };

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const items = DISCOVERY_PRODUCTS.filter((product) => {
      const searchable = `${product.name} ${product.category} ${product.farmer.name} ${product.farmer.farmName} ${product.farmer.city} ${product.farmer.district}`.toLowerCase();
      return (!normalizedSearch || searchable.includes(normalizedSearch))
        && (!filters.categories.length || filters.categories.includes(product.category))
        && (!filters.farmers.length || filters.farmers.includes(product.farmer.id))
        && (!filters.minPrice || product.price >= Number(filters.minPrice))
        && (!filters.maxPrice || product.price <= Number(filters.maxPrice))
        && (!filters.city || product.farmer.city === filters.city)
        && (!filters.district || product.farmer.district === filters.district)
        && (!filters.radius || product.farmer.distanceKm <= Number(filters.radius))
        && (!filters.rating || product.rating >= filters.rating)
        && (!filters.organic || product.organic)
        && (!filters.sameDay || product.sameDayPickup)
        && (!filters.preorder || product.preorderAvailable)
        && (!filters.bulk || product.bulkDeal);
    });
    return items.sort((left, right) => {
      if (sort === 'price-asc') return left.price - right.price;
      if (sort === 'price-desc') return right.price - left.price;
      if (sort === 'rating') return right.rating - left.rating;
      if (sort === 'newest') return right.createdAt.localeCompare(left.createdAt);
      if (sort === 'nearest') return left.farmer.distanceKm - right.farmer.distanceKm;
      return Number(right.organic) - Number(left.organic) || right.rating - left.rating;
    });
  }, [filters, search, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const visibleProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);
  const activeFilterCount = filters.categories.length + filters.farmers.length + Number(Boolean(filters.minPrice || filters.maxPrice))
    + Number(Boolean(filters.city || filters.district || filters.radius)) + Number(Boolean(filters.rating))
    + Number(filters.organic) + Number(filters.sameDay) + Number(filters.preorder) + Number(filters.bulk);

  const toggleWishlist = (productId: string) => setWishlist((current) => current.includes(productId)
    ? current.filter((item) => item !== productId) : [...current, productId]);

  const handleAddProductToCart = (product: DiscoveryProduct) => {
    const prod: Product = {
      id: typeof product.id === 'number' ? product.id : parseInt(String(product.id).replace(/\D/g, '')) || Math.floor(Math.random() * 9000) + 1000,
      name: product.name,
      slug: product.slug,
      producer_id: 1,
      producer_name: product.farmer?.farmName,
      category_id: 1,
      price: product.price,
      original_price: product.originalPrice,
      unit: product.unit,
      stock: product.stock,
      image_url: product.image,
      dietary_tags: product.organic ? 'Organic' : 'Fresh',
      description: product.name,
      featured: true,
      in_stock: product.stock > 0,
    };
    addProductToCart(prod, 1);
  };

  const productCard = (product: DiscoveryProduct) => {
    const discount = Math.round((1 - product.price / product.originalPrice) * 100);
    const lowStock = product.stock <= 8;
    const farmer = product.farmer;
    const inCartQty = cartItems.find((i) => i.product.name === product.name || String(i.product.id) === String(product.id))?.quantity || 0;

    return (
      <article key={product.id} className={`group relative border border-[#E0E6DF] bg-white transition-shadow hover:border-[#C6D4C7] hover:shadow-[0_8px_24px_rgba(24,54,37,0.09)] ${view === 'list' ? 'grid grid-cols-[108px_minmax(0,1fr)] gap-3 p-3 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5' : 'flex min-w-0 flex-col'}`}>
        <div className={`relative overflow-hidden bg-[#F0F3EF] ${view === 'list' ? 'aspect-square' : 'aspect-[4/3]'}`}>
          <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.045]" />
          <span className="absolute left-2 top-2 bg-[#C75A32] px-2 py-1 text-[10px] font-extrabold text-white">-{discount}%</span>
          <span className={`absolute bottom-2 left-2 px-2 py-1 text-[9px] font-bold ${lowStock ? 'bg-[#FFF2D8] text-[#865B16]' : 'bg-[#E9F3EB] text-[#286441]'}`}>{lowStock ? 'Low stock' : 'In stock'}</span>
          {product.organic && <span className="absolute right-2 top-2 bg-white/95 px-2 py-1 text-[9px] font-bold text-[#286441]">Organic</span>}
          <button type="button" onClick={() => toggleWishlist(product.id)} aria-label={`${wishlist.includes(product.id) ? 'Remove from' : 'Add to'} wishlist: ${product.name}`} aria-pressed={wishlist.includes(product.id)} className={`absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center border border-[#E0E6DF] bg-white transition ${wishlist.includes(product.id) ? 'text-[#C75A32]' : 'text-[#53645A] hover:text-[#C75A32]'}`}><Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} /></button>
        </div>
        <div className={`flex min-w-0 flex-1 flex-col ${view === 'list' ? 'py-1' : 'p-3'}`}>
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="truncate text-[9px] font-bold uppercase tracking-[0.08em] text-[#77867B]">{product.category}</span>
            {product.bulkDeal && <span className="shrink-0 bg-[#F8F1E1] px-1.5 py-0.5 text-[9px] font-bold text-[#8A621A]">Bulk deal</span>}
          </div>
          <h2 className="line-clamp-2 min-h-10 text-[13px] font-bold leading-5 text-[#23392C]">{product.name}</h2>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-[15px] font-extrabold text-[#C75A32]">{currency(product.price)}</span>
            <span className="text-[10px] text-[#809087]">/ {product.unit}</span>
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#59685E]"><Star className="h-3.5 w-3.5 fill-[#D89A28] text-[#D89A28]" /><span className="font-bold text-[#34473A]">{Number(product.rating || 0).toFixed(1)}</span><span>({product.reviewsCount})</span><span className="mx-1 text-[#CED6CE]">|</span><span className="line-through">{currency(product.originalPrice)}</span></div>
          <div className="relative mt-3 border-t border-[#EDF0EB] pt-2.5" onMouseEnter={() => setHoveredFarmer(farmer.id)} onMouseLeave={() => setHoveredFarmer(null)}>
            <button type="button" onFocus={() => setHoveredFarmer(farmer.id)} onBlur={() => setHoveredFarmer(null)} onClick={() => setFarmerPreview(farmer)} className="flex w-full items-center gap-2 text-left" aria-label={`Preview ${farmer.farmName}`}>
              <Image src={farmer.avatar} alt="" width={28} height={28} sizes="28px" className="h-7 w-7 shrink-0 rounded-full object-cover" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 truncate text-[10px] font-bold text-[#314538]">{farmer.farmName}{farmer.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#23804E]" />}</span>
                <span className="mt-0.5 flex items-center gap-1 truncate text-[9px] text-[#7A887E]"><MapPin className="h-3 w-3 shrink-0" />{farmer.district}, {farmer.city} · {Number(farmer.rating || 0).toFixed(1)} ★</span>
              </span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#809087]" />
            </button>
            {hoveredFarmer === farmer.id && <div className="absolute bottom-full left-0 z-20 mb-2 hidden w-64 border border-[#DDE4DC] bg-white p-3 shadow-xl sm:block"><p className="text-xs font-extrabold text-[#1D3E2E]">{farmer.farmName}</p><p className="mt-1 text-[10px] leading-4 text-[#637268]">{farmer.story}</p><span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#1D6B4B]"><BadgeCheck className="h-3.5 w-3.5" />{farmer.completedOrders.toLocaleString()} completed orders</span></div>}
          </div>
          <button type="button" onClick={() => handleAddProductToCart(product)} className="mt-auto flex min-h-9 w-full items-center justify-center gap-1.5 bg-[#1D3E2E] px-2 py-2 text-[11px] font-bold text-white transition hover:bg-[#E06D3B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C75A32]">
            {inCartQty > 0 ? <><Check className="h-3.5 w-3.5" /> Added ({inCartQty})</> : <><ShoppingBasket className="h-3.5 w-3.5" /> Add to Cart (COD)</>}
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F7F4] text-[#24382B]">
      <Header cartCount={totalCartCount} onOpenCart={() => setBasketOpen(true)} onOpenQuiz={() => undefined} onOpenAuth={() => setAuthOpen(true)} onLogout={() => {
        setUser(null);
        clearStoredUser();
      }} user={user} />
      <main className="mx-auto min-h-[70vh] max-w-[1440px] px-3 pb-12 pt-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-[11px] text-[#758279]">
          <Link href="/" className="hover:text-[#1D6B4B]">Home</Link><ChevronRight className="h-3 w-3" /><span>Categories</span><ChevronRight className="h-3 w-3" /><span className="font-semibold text-[#314538]">Fresh from the farm</span>
        </nav>
        <div className="mb-4 flex flex-col justify-between gap-3 border-b border-[#DDE4DC] pb-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#C75A32]">Pakistan&apos;s local harvest</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#1D3E2E] sm:text-[30px]">Products & categories</h1>
            <p className="mt-1 text-xs text-[#6D7C72]">Good food, with a farmer&apos;s name behind it.</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="relative min-w-[188px] flex-1 sm:w-56 sm:flex-none">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#849188]" />
              <input aria-label="Search products and farms" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search products, farms..." className="h-9 w-full rounded border border-[#D9E1D8] bg-white pl-9 pr-3 text-xs outline-none focus:border-[#1D6B4B]" />
            </div>
            <button type="button" onClick={() => setBasketOpen(true)} aria-label={`Open basket, ${totalCartCount} items`} className="relative flex h-9 w-10 shrink-0 items-center justify-center border border-[#D9E1D8] bg-white text-[#1D3E2E] hover:border-[#1D6B4B]"><ShoppingBasket className="h-4 w-4" />{totalCartCount > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C75A32] px-1 text-[9px] font-bold text-white">{totalCartCount}</span>}</button>
          </div>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[236px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="sticky top-[92px] hidden max-h-[calc(100vh-108px)] overflow-y-auto border border-[#E0E6DF] bg-white p-4 lg:block" aria-label="Product filters">
            <FilterSidebar filters={filters} updateFilters={updateFilters} clearFilters={clearFilters} />
          </aside>
          <section aria-label="Products">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border border-[#E0E6DF] bg-white px-3 py-2.5 sm:px-4">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setMobileFiltersOpen(true)} className="inline-flex h-8 items-center gap-1.5 border border-[#DDE4DC] px-2.5 text-xs font-bold text-[#32473A] lg:hidden"><SlidersHorizontal className="h-3.5 w-3.5" />Filters{activeFilterCount > 0 && <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1D6B4B] px-1 text-[9px] text-white">{activeFilterCount}</span>}</button>
                <p className="text-[11px] text-[#68776D] sm:text-xs">Showing <strong className="text-[#283D30]">{filteredProducts.length ? (page - 1) * pageSize + 1 : 0}-{Math.min(page * pageSize, filteredProducts.length)}</strong> of <strong className="text-[#283D30]">{filteredProducts.length}</strong> items</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <label htmlFor="sort-products" className="hidden text-[11px] text-[#718076] sm:block">Sort by</label>
                <div className="relative">
                  <select id="sort-products" value={sort} onChange={(event) => { setSort(event.target.value as SortOption); setPage(1); }} className="h-8 appearance-none border border-[#DDE4DC] bg-white py-1 pl-2 pr-7 text-[11px] font-semibold text-[#35483B] outline-none focus:border-[#1D6B4B]">
                    <option value="featured">Recommended</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="rating">Top Rated</option><option value="newest">Newest Arrivals</option><option value="nearest">Nearest Farmer</option>
                  </select><ChevronDown className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 text-[#758279]" />
                </div>
                <div className="flex items-center border border-[#DDE4DC] bg-white p-0.5" aria-label="Product view">
                  <button type="button" aria-label="Grid view" aria-pressed={view === 'grid'} onClick={() => setView('grid')} className={`flex h-7 w-7 items-center justify-center ${view === 'grid' ? 'bg-[#E9F1E9] text-[#1D6B4B]' : 'text-[#78867C]'}`}><Grid2X2 className="h-4 w-4" /></button>
                  <button type="button" aria-label="List view" aria-pressed={view === 'list'} onClick={() => setView('list')} className={`flex h-7 w-7 items-center justify-center ${view === 'list' ? 'bg-[#E9F1E9] text-[#1D6B4B]' : 'text-[#78867C]'}`}><List className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            {activeFilterCount > 0 && <div className="mb-3 flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-[10px] font-semibold text-[#718076]">Active filters</span>
              {filters.categories.map((category) => <span key={category} className="inline-flex items-center gap-1 border border-[#DCE6DB] bg-white px-2 py-1 text-[10px] text-[#42604B]">{category}<button type="button" aria-label={`Remove ${category} filter`} onClick={() => updateFilters({ categories: filters.categories.filter((item) => item !== category) })}><X className="h-3 w-3" /></button></span>)}
              {filters.city && <span className="border border-[#DCE6DB] bg-white px-2 py-1 text-[10px] text-[#42604B]">{filters.city}</span>}
              {(filters.organic || filters.sameDay || filters.preorder || filters.bulk) && <span className="border border-[#DCE6DB] bg-white px-2 py-1 text-[10px] text-[#42604B]">Perks selected</span>}
              <button type="button" onClick={clearFilters} className="px-1 py-1 text-[10px] font-bold text-[#C75A32] hover:underline">Clear</button>
            </div>}

            {visibleProducts.length ? (
              <div className={view === 'grid' ? 'grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4' : 'grid grid-cols-1 gap-3'}>{visibleProducts.map(productCard)}</div>
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center border border-dashed border-[#CAD6CA] bg-white px-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF2EA] text-[#1D6B4B]"><Store className="h-7 w-7" /></div>
                <h2 className="text-lg font-extrabold text-[#263D2F]">No harvest found</h2>
                <p className="mt-1 max-w-sm text-sm text-[#718076]">Try a broader search or clear some filters to see what&apos;s growing.</p>
                <button type="button" onClick={clearFilters} className="mt-5 inline-flex h-10 items-center gap-2 bg-[#1D3E2E] px-4 text-xs font-bold text-white hover:bg-[#28543E]"><Sparkles className="h-4 w-4" />Reset filters</button>
              </div>
            )}

            {filteredProducts.length > 0 && <nav aria-label="Product pages" className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
              <button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="flex h-9 items-center gap-1 border border-[#DDE4DC] bg-white px-3 text-xs font-semibold text-[#526158] disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-4 w-4" />Previous</button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} type="button" aria-current={pageNumber === page ? 'page' : undefined} onClick={() => setPage(pageNumber)} className={`h-9 min-w-9 border px-3 text-xs font-bold ${pageNumber === page ? 'border-[#1D3E2E] bg-[#1D3E2E] text-white' : 'border-[#DDE4DC] bg-white text-[#526158] hover:border-[#1D6B4B]'}`}>{pageNumber}</button>)}
              <button type="button" disabled={page === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="flex h-9 items-center gap-1 border border-[#DDE4DC] bg-white px-3 text-xs font-semibold text-[#526158] disabled:cursor-not-allowed disabled:opacity-40">Next<ChevronRight className="h-4 w-4" /></button>
            </nav>}
          </section>
        </div>
      </main>
      <Footer />
      <DbStatusBadge />

      {mobileFiltersOpen && <div className="fixed inset-0 z-[1200] bg-[#14251B]/45 lg:hidden" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setMobileFiltersOpen(false); }}>
        <aside role="dialog" aria-modal="true" aria-label="Product filters" className="absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#E5E9E5] p-4"><span className="text-sm font-extrabold text-[#1D3E2E]">Refine products</span><button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters" className="p-1 text-[#53645A]"><X className="h-5 w-5" /></button></div>
          <div className="flex-1 overflow-y-auto p-4"><FilterSidebar filters={filters} updateFilters={updateFilters} clearFilters={clearFilters} onDone={() => setMobileFiltersOpen(false)} /></div>
        </aside>
      </div>}

      <CartDrawer
        isOpen={basketOpen}
        onClose={() => setBasketOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onClearCart={clearCart}
        onOpenAuth={() => setAuthOpen(true)}
      />

      {farmerPreview && <FarmerPreview farmer={farmerPreview} onClose={() => setFarmerPreview(null)} />}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onLoginSuccess={(nextUser) => {
        setUser(nextUser);
        setStoredUser(nextUser);
      }} />
    </div>
  );
}