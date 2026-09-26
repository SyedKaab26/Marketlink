'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Home, LogIn, LogOut, Menu, Search, ShoppingBag, Store, User as UserIcon, X } from 'lucide-react';
import { Category, Product } from '@/lib/types';

type HeaderUser = { full_name?: string; role?: 'customer' | 'farmer' | 'admin' } | null;

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenQuiz: () => void;
  onOpenAuth: () => void;
  user?: HeaderUser;
  onLogout?: () => void;
}

const primaryLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/#markets', label: 'Market', icon: Store },
  { href: '/shop', label: 'Products & Categories' },
  { href: '/producers', label: 'Farmers' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' }
];

const categoryMenu = [
  {
    label: 'Organic Vegetables',
    matches: ['vegetable', 'veg', 'tomato', 'spinach', 'carrot', 'cucumber', 'potato', 'onion', 'capsicum', 'brinjal', 'cauliflower'],
    categoryId: 1,
  },
  {
    label: 'Fresh Fruits',
    matches: ['fruit', 'mango', 'kinnow', 'orange', 'strawberry', 'guava', 'banana', 'jamun', 'date', 'apple', 'pomegranate'],
    categoryId: 2,
  },
  {
    label: 'Dairy & Poultry',
    matches: ['dairy', 'poultry', 'egg', 'milk', 'yogurt', 'dahi', 'cheese', 'paneer', 'butter', 'chicken', 'lassi', 'cream'],
    categoryId: 3,
  },
  {
    label: 'Grains & Staples',
    matches: ['grain', 'staple', 'rice', 'basmati', 'chickpea', 'atta', 'wheat', 'moong', 'daal', 'bajra', 'millet', 'corn', 'makai', 'barley', 'beans', 'rajma'],
    categoryId: 4,
  },
  {
    label: 'Seeds & Herbs',
    matches: ['seed', 'herb', 'coriander', 'mint', 'cumin', 'chili', 'turmeric', 'basil', 'garlic', 'fenugreek', 'methi', 'fennel'],
    categoryId: 5,
  },
];

export default function Header({ cartCount, onOpenCart, onOpenAuth, user, onLogout }: HeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryLoaded, setCategoryLoaded] = useState(false);
  const roleLabel = user?.role === 'farmer' ? 'Farmer' : user?.role === 'admin' ? 'Admin' : 'Customer';

  const loadCategoryData = async (forceRefresh = false) => {
    if (!forceRefresh && (categoryLoaded || categoryLoading)) return;
    setCategoryLoading(true);
    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products')
      ]);
      const [categoriesResult, productsResult] = await Promise.all([
        categoriesResponse.json(),
        productsResponse.json()
      ]);
      if (categoriesResult.success && Array.isArray(categoriesResult.categories)) {
        setCategoryData(categoriesResult.categories);
      }
      if (productsResult.success && Array.isArray(productsResult.products)) {
        setProducts(productsResult.products);
      }
      setCategoryLoaded(true);
    } catch (error) {
      console.error('Unable to load category menu:', error);
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    loadCategoryData();
  }, []);

  const productsForCategory = (label: string) => {
    const menuCategory = categoryMenu.find((category) => category.label === label);
    if (!menuCategory) return [];

    const matchedCategoryIds = categoryData
      .filter((cat) => {
        if (cat.name.toLowerCase() === label.toLowerCase()) return true;
        return menuCategory.matches.some((match) => cat.name.toLowerCase().includes(match));
      })
      .map((cat) => cat.id);

    if (menuCategory.categoryId && !matchedCategoryIds.includes(menuCategory.categoryId)) {
      matchedCategoryIds.push(menuCategory.categoryId);
    }

    const filtered = products.filter((product) => {
      if (matchedCategoryIds.includes(product.category_id)) return true;
      const searchableText = `${product.name} ${product.dietary_tags || ''} ${product.description || ''}`.toLowerCase();
      return menuCategory.matches.some((match) => searchableText.includes(match));
    });

    return filtered.slice(0, 4);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (query) router.push(`/shop?search=${encodeURIComponent(query)}`);
  };

  const handleMarketClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);
    if (window.location.pathname !== '/') return;
    event.preventDefault();
    window.history.replaceState(null, '', '/#markets');
    window.requestAnimationFrame(() => {
      document.getElementById('markets')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <header className="sticky top-0 z-[1100] border-b border-[#E8E2D5] bg-[#F9F6F0]/95 shadow-sm backdrop-blur-md">
      <div className="relative mx-auto flex min-h-[76px] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
            <Image src="/logo.png" alt="MarketLink logo" width={60} height={60} className="h-full w-full object-contain" priority />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold leading-none tracking-tight text-[#1D3E2E]">MarketLink</span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8B7355]">Farm Fresh Just a Click Away</span>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1.5 xl:gap-3.5 lg:flex" aria-label="Primary navigation">
          {primaryLinks.map(({ href, label }) => label === 'Products & Categories' ? (
            <div
              key={label}
              className="h-[76px] flex items-center"
              onMouseEnter={() => {
                setActiveCategory((current) => current || categoryMenu[0].label);
                loadCategoryData(true);
              }}
              onMouseLeave={() => setActiveCategory(null)}
              onFocus={() => {
                setActiveCategory((current) => current || categoryMenu[0].label);
                loadCategoryData(true);
              }}
            >
              <Link
                href={href}
                aria-haspopup="menu"
                aria-expanded={activeCategory !== null}
                className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold transition-colors after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-[#E06D3B] after:transition-transform ${activeCategory !== null ? 'bg-[#FFF0E8] text-[#E06D3B] after:scale-x-100' : 'text-[#2C3E35] after:scale-x-0 hover:bg-[#FFF0E8] hover:text-[#E06D3B] hover:after:scale-x-100'}`}
              >
                {label}
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeCategory !== null ? 'rotate-180 text-[#E06D3B]' : 'text-[#8B7355]'}`} />
              </Link>

              <div
                className={`invisible absolute left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 top-full z-50 rounded-2xl border border-[#E8E2D5] bg-white p-3.5 opacity-0 shadow-2xl transition-all duration-200 ${
                  activeCategory ? 'visible translate-y-0 opacity-100' : 'translate-y-2 pointer-events-none'
                }`}
              >
                <div className="grid min-h-[380px] grid-cols-[240px_1fr] overflow-hidden rounded-xl bg-[#F9F6F0]">
                  <div className="border-r border-[#E8E2D5] p-3 space-y-1 bg-[#F5F1E8]" role="menu" aria-label="Product categories">
                    <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#8B7355]">Categories</p>
                    {categoryMenu.map((category) => {
                      const count = productsForCategory(category.label).length;
                      const isActive = activeCategory === category.label;
                      return (
                        <Link
                          key={category.label}
                          href={`/shop?search=${encodeURIComponent(category.label)}`}
                          onMouseEnter={() => setActiveCategory(category.label)}
                          onFocus={() => setActiveCategory(category.label)}
                          className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-bold transition-all ${
                            isActive
                              ? 'bg-[#1D3E2E] text-white shadow-sm'
                              : 'text-[#2C3E35] hover:bg-[#E8E0D0] hover:text-[#1D3E2E]'
                          }`}
                        >
                          <span>{category.label}</span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                            isActive ? 'bg-[#29543E] text-[#D4F0DF]' : 'bg-[#E2DACB] text-[#6E5C46]'
                          }`}>
                            {count > 0 ? `${count} items` : 'Browse'}
                          </span>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="p-4 flex flex-col justify-between bg-white">
                    <div>
                      <div className="mb-3 flex items-center justify-between border-b border-[#E8E2D5] pb-2.5">
                        <div>
                          <h3 className="font-serif text-lg font-bold text-[#1D3E2E]">{activeCategory || 'Explore fresh goods'}</h3>
                          <p className="text-xs text-[#8B7355]">Fresh farm produce available for immediate order</p>
                        </div>
                        {activeCategory && (
                          <Link
                            href={`/shop?search=${encodeURIComponent(activeCategory)}`}
                            className="flex items-center gap-1 rounded-lg bg-[#FFF0E8] px-3 py-1.5 text-xs font-bold text-[#E06D3B] transition hover:bg-[#FFE3D4]"
                          >
                            View all in {activeCategory} &rarr;
                          </Link>
                        )}
                      </div>

                      {!activeCategory || categoryLoading ? (
                        <div className="flex h-64 items-center justify-center">
                          <p className="text-xs font-semibold text-[#8B7355]">Loading fresh products...</p>
                        </div>
                      ) : productsForCategory(activeCategory).length > 0 ? (
                        <div className="grid grid-cols-2 gap-3.5">
                          {productsForCategory(activeCategory).map((product) => (
                            <Link
                              key={product.id}
                              href={`/shop?search=${encodeURIComponent(product.name)}`}
                              className="group flex items-center gap-3.5 rounded-xl border border-[#E8E2D5] bg-[#FDFBF7] p-3 transition-all hover:border-[#E06D3B]/40 hover:bg-white hover:shadow-md"
                            >
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-20 w-20 shrink-0 rounded-lg object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-bold text-[#1D3E2E] group-hover:text-[#E06D3B]">
                                  {product.name}
                                </span>
                                {product.producer_name && (
                                  <span className="block truncate text-xs text-[#8B7355]">
                                    By {product.producer_name}
                                  </span>
                                )}
                                <div className="mt-1 flex items-center gap-2">
                                  <span className="text-sm font-extrabold text-[#E06D3B]">
                                    Rs. {Number(product.price || 0).toLocaleString()}
                                  </span>
                                  <span className="text-xs text-[#8B7355]">/ {product.unit}</span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="flex h-64 flex-col items-center justify-center text-center">
                          <p className="text-sm font-bold text-[#1D3E2E]">No products available in this category yet</p>
                          <p className="mt-1 text-xs text-[#8B7355]">Check back soon or explore our full shop catalog</p>
                          <Link
                            href="/shop"
                            className="mt-3 rounded-lg bg-[#1D3E2E] px-4 py-2 text-xs font-bold text-white hover:bg-[#28543E]"
                          >
                            Browse Shop Catalog
                          </Link>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 border-t border-[#E8E2D5] pt-2 flex items-center justify-between text-xs text-[#8B7355]">
                      <span> Direct from 170+ regional Pakistani farmers</span>
                      <Link href="/shop" className="font-bold text-[#1D3E2E] hover:underline">
                        Explore All Products &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link key={label} href={href} onClick={label === 'Market' ? handleMarketClick : undefined} className="whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-bold text-[#2C3E35] transition-colors hover:bg-[#FFF0E8] hover:text-[#E06D3B]">{label}</Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <Link href="/#markets" onClick={handleMarketClick} className="hidden items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-bold text-[#2C3E35] transition-colors hover:bg-[#FFF0E8] hover:text-[#E06D3B] sm:flex lg:hidden"><Store className="h-4 w-4" />Market</Link>
          <button onClick={() => router.push('/shop')} className="hidden rounded-full p-2 text-[#1D3E2E] transition hover:bg-[#FFF0E8] hover:text-[#E06D3B] md:flex" aria-label="Browse products" title="Browse products"><Search className="h-5 w-5" /></button>
          <button onClick={onOpenCart} className="relative rounded-full p-2 text-[#1D3E2E] transition hover:bg-[#FFF0E8] hover:text-[#E06D3B]" aria-label="Open shopping cart" title="Cart"><ShoppingBag className="h-5 w-5" />{cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E06D3B] text-[10px] font-bold text-white">{cartCount}</span>}</button>
          {user ? (
            <div className="group relative hidden md:block">
              <button className="flex items-center gap-2 rounded-full border border-[#D5CCBA] bg-white px-3 py-1.5 text-left transition hover:border-[#E06D3B]" aria-label="Open profile menu"><UserIcon className="h-4 w-4 text-[#E06D3B]" /><span className="max-w-20 truncate text-xs font-bold text-[#1D3E2E]">{user.full_name || roleLabel}</span></button>
              <div className="invisible absolute right-0 top-full mt-2 w-48 translate-y-1 rounded-2xl border border-[#E8E2D5] bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#8B7355]">{roleLabel} account</p>
                {user.role === 'farmer' && (
                  <Link href="/farmer" className="block rounded-xl px-3 py-2 text-xs font-semibold text-[#E06D3B] bg-[#FFF0E8] hover:bg-[#FFE6D9]">🌾 Farmer Portal</Link>
                )}
                {user.role === 'admin' && (
                  <Link href="/dashboard" className="block rounded-xl px-3 py-2 text-xs font-semibold text-[#1D3E2E] hover:bg-[#FFF0E8]">⚡ Admin Dashboard</Link>
                )}
                <Link href="/orders" className="block rounded-xl px-3 py-2 text-xs font-semibold text-[#1D3E2E] hover:bg-[#FFF0E8]">My Orders / Pre-orders</Link>
                <Link href="/profile" className="block rounded-xl px-3 py-2 text-xs font-semibold text-[#1D3E2E] hover:bg-[#FFF0E8]">Profile</Link>
                <button onClick={onLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#C85A29] hover:bg-[#FFF0E8]"><LogOut className="h-3.5 w-3.5" /> Logout</button>
              </div>
            </div>
          ) : <button onClick={onOpenAuth} className="hidden items-center gap-1.5 rounded-full bg-[#1D3E2E] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#E06D3B] md:flex"><LogIn className="h-4 w-4" /> Login / Register</button>}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-full p-2 text-[#1D3E2E] lg:hidden" aria-label="Toggle navigation menu">{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>

      {mobileMenuOpen && <div className="border-t border-[#E8E2D5] bg-[#F4EFE6] px-4 pb-5 pt-3 xl:hidden">
        <form onSubmit={handleSearch} className="relative mb-3 lg:hidden"><Search className="absolute left-3 top-3 h-4 w-4 text-[#8B7355]" /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search products, farmers, or markets" className="w-full rounded-xl border border-[#D5CCBA] bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#E06D3B]" /></form>
        <nav className="grid gap-1 sm:grid-cols-2" aria-label="Mobile navigation">
          {primaryLinks.map(({ href, label, icon: Icon }) => <Link key={label} href={href} onClick={label === 'Market' ? handleMarketClick : () => setMobileMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-[#1D3E2E] hover:bg-[#E8E0D0]">{Icon && <Icon className="h-4 w-4 text-[#E06D3B]" />}{label}</Link>)}
          {user ? (
            <>
              {user.role === 'farmer' && (
                <Link href="/farmer" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-bold text-[#E06D3B] hover:bg-[#E8E0D0]">🌾 Farmer Portal</Link>
              )}
              {user.role === 'admin' && (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-bold text-[#1D3E2E] hover:bg-[#E8E0D0]">⚡ Admin Dashboard</Link>
              )}
              <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-bold text-[#1D3E2E] hover:bg-[#E8E0D0]">My Orders / Pre-orders</Link>
              <button onClick={onLogout} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-[#C85A29] hover:bg-[#E8E0D0]"><LogOut className="h-4 w-4" />Logout</button>
            </>
          ) : <button onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-[#1D3E2E] hover:bg-[#E8E0D0]"><LogIn className="h-4 w-4 text-[#E06D3B]" />Login / Register</button>}
        </nav>
      </div>}
    </header>
  );
}

