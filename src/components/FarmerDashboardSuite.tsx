'use client';

import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowUpRight,
  Award,
  Boxes,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Edit,
  Eye,
  Filter,
  Flame,
  Globe,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Package,
  PackageCheck,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Sprout,
  Store,
  Tag,
  Trash2,
  Truck,
  UserCheck,
  Users,
  Wallet,
  X
} from 'lucide-react';
import type { Product, Producer, Category, Order, OrderItem } from '@/lib/types';
import { INITIAL_CATEGORIES } from '@/lib/data';
import { resolveProductImage } from '@/lib/product-helpers';
import { getStoredUser } from '@/lib/auth';

type FarmerTabType =
  | 'overview'
  | 'products'
  | 'orders'
  | 'calendar'
  | 'profile'
  | 'payouts'
  | 'reviews';

interface CropCalendarItem {
  id: number;
  cropName: string;
  category: string;
  expectedHarvestDate: string;
  estimatedYield: string;
  status: 'Planted' | 'Growing' | 'Ready to Pick' | 'Harvested';
  preOrderEnabled: boolean;
}

interface ReviewItem {
  id: number;
  customerName: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
}

interface PayoutTransaction {
  id: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: 'Completed' | 'Processing' | 'Pending';
  date: string;
  bankAccount: string;
}

export default function FarmerDashboardSuite() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [farmerEmail, setFarmerEmail] = useState('farmer@greenacres.com');
  const [farmerPassword, setFarmerPassword] = useState('farmer123');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Producer Context
  const [selectedProducerId, setSelectedProducerId] = useState<number>(1); // Default Green Acres Organic
  const [producersList, setProducersList] = useState<Producer[]>([]);
  const [currentProducer, setCurrentProducer] = useState<Producer | null>(null);

  // Active Tab & UX State
  const [activeTab, setActiveTab] = useState<FarmerTabType>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notice, setNotice] = useState<string>('');

  // Data States
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  // Filter & Search States
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | 'all'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategoryId, setProductCategoryId] = useState('1');
  const [productUnit, setProductUnit] = useState('kg');
  const [productStock, setProductStock] = useState('50');
  const [productImageData, setProductImageData] = useState('');
  const [productDietary, setProductDietary] = useState('Organic, Pesticide-Free');
  const [productDescription, setProductDescription] = useState('');
  const [productInStock, setProductInStock] = useState(true);

  // Packing Slip / Order Detail Modal
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [showPackingSlip, setShowPackingSlip] = useState(false);

  // Crop Calendar State
  const [cropList, setCropList] = useState<CropCalendarItem[]>([
    {
      id: 1,
      cropName: 'Organic Heirloom Strawberries',
      category: 'Fruits',
      expectedHarvestDate: '2026-10-15',
      estimatedYield: '250 kg',
      status: 'Growing',
      preOrderEnabled: true,
    },
    {
      id: 2,
      cropName: 'Winter Baby Spinach',
      category: 'Vegetables',
      expectedHarvestDate: '2026-10-05',
      estimatedYield: '100 kg',
      status: 'Ready to Pick',
      preOrderEnabled: false,
    },
    {
      id: 3,
      cropName: 'Honeycrisp Apples',
      category: 'Fruits',
      expectedHarvestDate: '2026-11-01',
      estimatedYield: '500 kg',
      status: 'Planted',
      preOrderEnabled: true,
    },
  ]);
  const [showCropModal, setShowCropModal] = useState(false);
  const [newCropName, setNewCropName] = useState('');
  const [newCropCategory, setNewCropCategory] = useState('Vegetables');
  const [newCropDate, setNewCropDate] = useState('');
  const [newCropYield, setNewCropYield] = useState('');

  // Profile Edit State
  const [profileName, setProfileName] = useState('');
  const [profileLocation, setProfileLocation] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profileSpecialty, setProfileSpecialty] = useState('');
  const [profileDescription, setProfileDescription] = useState('');
  const [profileStory, setProfileStory] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Payouts State
  const [bankDetails, setBankDetails] = useState({
    accountTitle: 'Green Acres Farm Ltd',
    bankName: 'Agri Business Bank',
    accountNumber: 'PK98 AGRI 0092 8841 2001',
  });
  const [payouts, setPayouts] = useState<PayoutTransaction[]>([
    {
      id: 'PAY-9821',
      amount: 450.0,
      fee: 36.0,
      netAmount: 414.0,
      status: 'Completed',
      date: '2026-09-20',
      bankAccount: 'PK98 AGRI **** 2001',
    },
    {
      id: 'PAY-8734',
      amount: 620.0,
      fee: 49.6,
      netAmount: 570.4,
      status: 'Completed',
      date: '2026-09-10',
      bankAccount: 'PK98 AGRI **** 2001',
    },
    {
      id: 'PAY-7612',
      amount: 310.0,
      fee: 24.8,
      netAmount: 285.2,
      status: 'Processing',
      date: '2026-09-25',
      bankAccount: 'PK98 AGRI **** 2001',
    },
  ]);
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: 1,
      customerName: 'Ayesha Khan',
      productName: 'Organic Heirloom Tomatoes',
      rating: 5,
      comment: 'Super fresh and juicy tomatoes! You can really taste the natural soil quality.',
      date: '2026-09-22',
      reply: 'Thank you Ayesha! Hand-picked directly from our south field.',
    },
    {
      id: 2,
      customerName: 'Tariq Mehmood',
      productName: 'Raw Unfiltered Wildflower Honey',
      rating: 5,
      comment: 'Best honey I have purchased online. Pure and authentic.',
      date: '2026-09-18',
    },
    {
      id: 3,
      customerName: 'Sara Ali',
      productName: 'Fresh Farm Spinach',
      rating: 4,
      comment: 'Very fresh leaves, arrived well packed.',
      date: '2026-09-15',
    },
  ]);
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});

  // Check auth session
  useEffect(() => {
    const savedAuth = localStorage.getItem('marketlink_farmer_auth');
    const storedUser = getStoredUser();
    if (savedAuth === 'true' || storedUser?.role === 'farmer' || storedUser?.role === 'admin') {
      setIsAuthenticated(true);
      if (savedAuth !== 'true') {
        localStorage.setItem('marketlink_farmer_auth', 'true');
      }
    }
    fetchInitialData();
  }, []);

  // Sync current producer details when selectedProducerId changes
  useEffect(() => {
    if (producersList.length > 0) {
      const found = producersList.find((p) => p.id === selectedProducerId) || producersList[0];
      setCurrentProducer(found);
      if (found) {
        setProfileName(found.name || '');
        setProfileLocation(found.location || '');
        setProfileCity(found.city || '');
        setProfileSpecialty(found.specialty || '');
        setProfileDescription(found.description || '');
        setProfileStory(found.story || '');
        setProfileImageUrl(found.image_url || '');
      }
    }
  }, [selectedProducerId, producersList]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [prodRes, procRes, ordRes] = await Promise.all([
        fetch('/api/products').then((r) => r.json()).catch(() => ({ products: [] })),
        fetch('/api/producers').then((r) => r.json()).catch(() => ({ producers: [] })),
        fetch('/api/orders').then((r) => r.json()).catch(() => ({ orders: [] })),
      ]);

      if (prodRes.products) setAllProducts(prodRes.products);
      if (procRes.producers && procRes.producers.length > 0) {
        setProducersList(procRes.producers);
        const first = procRes.producers[0];
        setSelectedProducerId(first.id);
        setCurrentProducer(first);
      }
      if (ordRes.orders) setAllOrders(ordRes.orders);
    } catch {
      setNotice('Could not connect to live API. Operating in offline mode.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    setTimeout(() => {
      if (farmerEmail.trim().length > 3 && farmerPassword === 'farmer123') {
        setIsAuthenticated(true);
        localStorage.setItem('marketlink_farmer_auth', 'true');
        setNotice('Successfully logged in to Farmer Portal.');
      } else {
        setLoginError('Invalid farmer credentials. Use password "farmer123".');
      }
      setIsLoggingIn(false);
    }, 600);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('marketlink_farmer_auth');
    setNotice('Logged out of Farmer Portal.');
  };

  // Products belonging to current farmer
  const farmerProducts = useMemo(() => {
    return allProducts.filter((p: Product) => p.producer_id === selectedProducerId);
  }, [allProducts, selectedProducerId]);

  // Filtered Farmer Products
  const filteredProducts = useMemo(() => {
    return farmerProducts.filter((product: Product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.description?.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCat =
        selectedCategoryFilter === 'all' || product.category_id === selectedCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [farmerProducts, productSearch, selectedCategoryFilter]);

  // Orders containing current farmer's products
  const farmerProductNames = useMemo(() => {
    return new Set(farmerProducts.map((p) => p.name.toLowerCase()));
  }, [farmerProducts]);

  const farmerOrders = useMemo(() => {
    return allOrders.filter((order: Order) => {
      let items: any[] = [];
      if (typeof order.items_json === 'string') {
        try {
          items = JSON.parse(order.items_json);
        } catch {
          items = [];
        }
      } else if (Array.isArray(order.items_json)) {
        items = order.items_json;
      }
      if (items.length === 0) return true;
      return items.some((item: any) => {
        if (item.product?.producer_id) {
          return item.product.producer_id === selectedProducerId;
        }
        if (item.producer_id) {
          return item.producer_id === selectedProducerId;
        }
        const itemName = (item.name || item.product?.name || '').toLowerCase();
        if (itemName && farmerProductNames.has(itemName)) {
          return true;
        }
        return true;
      });
    });
  }, [allOrders, selectedProducerId, farmerProductNames]);

  const filteredOrders = useMemo(() => {
    return farmerOrders.filter((order: Order) => {
      const matchesSearch =
        order.id.toString().includes(orderSearch) ||
        (order.customer_name && order.customer_name.toLowerCase().includes(orderSearch.toLowerCase()));
      const matchesStatus =
        orderStatusFilter === 'all' ||
        order.status.toLowerCase() === orderStatusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [farmerOrders, orderSearch, orderStatusFilter]);

  // Computed Farmer Stats
  const farmerStats = useMemo(() => {
    const totalRevenue = farmerOrders.reduce((sum: number, o: Order) => sum + (o.total_amount || 0), 0);
    const pendingOrdersCount = farmerOrders.filter((o: Order) => o.status === 'Pending' || o.status === 'Packed').length;
    const activeProductsCount = farmerProducts.filter((p: Product) => p.in_stock !== false).length;
    const lowStockCount = farmerProducts.filter((p: Product) => (p.stock ?? 10) < 10).length;

    return {
      totalRevenue,
      pendingOrdersCount,
      activeProductsCount,
      lowStockCount,
      completedOrders: farmerOrders.filter((o: Order) => o.status === 'Delivered').length,
    };
  }, [farmerOrders, farmerProducts]);

  // Toggle In-Stock Status
  const handleToggleStock = async (product: Product) => {
    const updated = { ...product, in_stock: !product.in_stock };
    setAllProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    setNotice(`Stock status for "${product.name}" updated.`);

    try {
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {
      // offline silent update
    }
  };

  // Open Product Modal for Add / Edit
  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductName(product.name);
      setProductPrice(product.price.toString());
      setProductCategoryId(product.category_id.toString());
      setProductUnit(product.unit || 'kg');
      setProductStock((product.stock ?? 50).toString());
      setProductImageData(product.image_url || '');
      setProductDietary(product.dietary_tags || 'Organic');
      setProductDescription(product.description || '');
      setProductInStock(product.in_stock !== false);
    } else {
      setEditingProduct(null);
      setProductName('');
      setProductPrice('');
      setProductCategoryId('1');
      setProductUnit('kg');
      setProductStock('50');
      setProductImageData('');
      setProductDietary('Organic, Pesticide-Free');
      setProductDescription('');
      setProductInStock(true);
    }
    setShowProductModal(true);
  };

  // Save Product
  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!productName || !productPrice) return;

    const payload: Partial<Product> = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: productName,
      slug: productName.toLowerCase().replace(/\s+/g, '-'),
      producer_id: selectedProducerId,
      producer_name: currentProducer?.name || 'My Farm',
      category_id: Number(productCategoryId) || 1,
      price: parseFloat(productPrice) || 0,
      unit: productUnit,
      stock: parseInt(productStock, 10) || 0,
      image_url: productImageData || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
      dietary_tags: productDietary,
      description: productDescription,
      featured: editingProduct ? editingProduct.featured : false,
      in_stock: productInStock,
    };

    if (editingProduct) {
      setAllProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? (payload as Product) : p)));
      setNotice(`Updated "${productName}" successfully.`);
    } else {
      setAllProducts((prev) => [payload as Product, ...prev]);
      setNotice(`Added new product "${productName}".`);
    }

    setShowProductModal(false);

    try {
      await fetch('/api/products', {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // offline fallback
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from your catalog?`)) return;
    setAllProducts((prev) => prev.filter((p) => p.id !== id));
    setNotice(`Removed product "${name}".`);

    try {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    } catch {
      // silent
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string | number, newStatus: Order['status']) => {
    setAllOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    setNotice(`Order #${orderId} status changed to ${newStatus}.`);

    try {
      await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
    } catch {
      // offline
    }
  };

  // Add Crop Entry to Calendar
  const handleAddCrop = (e: FormEvent) => {
    e.preventDefault();
    if (!newCropName || !newCropDate) return;

    const newItem: CropCalendarItem = {
      id: Date.now(),
      cropName: newCropName,
      category: newCropCategory,
      expectedHarvestDate: newCropDate,
      estimatedYield: newCropYield || '100 kg',
      status: 'Planted',
      preOrderEnabled: true,
    };

    setCropList((prev) => [newItem, ...prev]);
    setNotice(`Added upcoming crop "${newCropName}" to harvest calendar.`);
    setShowCropModal(false);
    setNewCropName('');
    setNewCropDate('');
    setNewCropYield('');
  };

  const handleAdvanceCropStatus = (cropId: number) => {
    setCropList((prev) =>
      prev.map((crop) => {
        if (crop.id !== cropId) return crop;
        const nextStatus: Record<CropCalendarItem['status'], CropCalendarItem['status']> = {
          Planted: 'Growing',
          Growing: 'Ready to Pick',
          'Ready to Pick': 'Harvested',
          Harvested: 'Planted',
        };
        const newStatus = nextStatus[crop.status];
        setNotice(`Crop "${crop.cropName}" status updated to ${newStatus}.`);
        return { ...crop, status: newStatus };
      })
    );
  };

  const handleDeleteCrop = (cropId: number) => {
    setCropList((prev) => prev.filter((c) => c.id !== cropId));
    setNotice('Removed crop item from harvest schedule.');
  };

  // Save Profile Details
  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    const updated: Producer = {
      id: selectedProducerId,
      name: profileName,
      slug: currentProducer?.slug || profileName.toLowerCase().replace(/\s+/g, '-'),
      location: profileLocation,
      city: profileCity,
      specialty: profileSpecialty,
      description: profileDescription,
      story: profileStory,
      image_url: profileImageUrl || '/placeholder-farm.jpg',
      featured: currentProducer?.featured || true,
      verified: currentProducer?.verified ?? true,
      rating: currentProducer?.rating || 4.9,
    };

    setCurrentProducer(updated);
    setProducersList((prev) => prev.map((p) => (p.id === selectedProducerId ? updated : p)));
    setNotice('Farm profile and story updated successfully!');
    setIsSavingProfile(false);

    try {
      await fetch('/api/producers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {
      // offline
    }
  };

  // Post Reply to Review
  const handlePostReviewReply = (reviewId: number) => {
    const text = replyText[reviewId];
    if (!text) return;

    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, reply: text } : r))
    );
    setReplyText((prev) => ({ ...prev, [reviewId]: '' }));
    setNotice('Response posted to customer review.');
  };

  // Request New Payout
  const handleRequestPayout = () => {
    if (farmerStats.totalRevenue <= 0) {
      alert('No available revenue balance for payout.');
      return;
    }
    const newTx: PayoutTransaction = {
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: farmerStats.totalRevenue,
      fee: farmerStats.totalRevenue * 0.1,
      netAmount: farmerStats.totalRevenue * 0.9,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      bankAccount: bankDetails.accountNumber.slice(0, 10) + '****',
    };
    setPayouts((prev) => [newTx, ...prev]);
    setShowPayoutModal(false);
    setNotice('Payout request submitted! Processing within 24 hours.');
  };

  // If NOT Logged In, Render Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#12231A] via-[#1D3E2E] to-[#0A1610] text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#E06D3B]/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#E06D3B] to-[#F59E0B] text-white shadow-lg mb-4">
              <Sprout className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-tight">Farmer & Vendor Portal</h1>
            <p className="text-xs text-emerald-200/80 mt-1">MarketLink Direct Producer Control Center</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-200/90 mb-1.5">Farmer Email</label>
              <input
                type="email"
                value={farmerEmail}
                onChange={(e) => setFarmerEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#E06D3B] focus:ring-1 focus:ring-[#E06D3B]"
                placeholder="farmer@greenacres.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-200/90 mb-1.5">Password</label>
              <input
                type="password"
                value={farmerPassword}
                onChange={(e) => setFarmerPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#E06D3B] focus:ring-1 focus:ring-[#E06D3B]"
                placeholder="••••••••"
              />
              <p className="text-[10px] text-emerald-300/70 mt-1">Default Demo Password: <code className="bg-black/30 px-1 py-0.5 rounded text-amber-300">farmer123</code></p>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#E06D3B] to-[#F59E0B] text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Accessing Portal...
                </>
              ) : (
                <>
                  <Sprout className="w-4 h-4" /> Enter Farmer Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link href="/" className="text-xs text-emerald-300 hover:underline inline-flex items-center gap-1">
              ← Return to MarketLink Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1E17] text-slate-100 flex flex-col font-sans">
      {/* Top Banner Notice */}
      {notice && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/30 text-emerald-200 text-xs px-4 py-2.5 flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice('')} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Top Header */}
      <header className="sticky top-0 z-40 bg-[#162B20]/95 backdrop-blur-md border-b border-emerald-900/60 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E06D3B] to-[#F59E0B] flex items-center justify-center text-white shadow-md">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-white block leading-none">MarketLink</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Vendor Portal</span>
            </div>
          </Link>

          {/* Farm Selector dropdown if multiple farms exist */}
          {producersList.length > 1 && (
            <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-emerald-800/60">
              <Store className="w-4 h-4 text-emerald-400" />
              <select
                value={selectedProducerId}
                onChange={(e) => setSelectedProducerId(Number(e.target.value))}
                className="bg-[#0F1E17] border border-emerald-800 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
              >
                {producersList.map((proc) => (
                  <option key={proc.id} value={proc.id}>
                    {proc.name} ({proc.city || proc.location})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right Side Header Items */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-[#0F1E17] px-3 py-1.5 rounded-full border border-emerald-800/80 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-200 font-medium">
              {currentProducer?.name || 'Green Acres Organic'}
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
              Verified Farmer
            </span>
          </div>

          <Link
            href="/"
            className="hidden lg:flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-800/50 hover:bg-emerald-900/30 transition"
          >
            <Globe className="w-3.5 h-3.5" /> View Public Store
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-emerald-900/60 text-emerald-200 hover:text-white transition"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-900/50 px-3 py-1.5 rounded-lg transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar + Tab Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className={`w-full md:w-64 bg-[#14261C] border-r border-emerald-900/50 p-4 shrink-0 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'products', label: 'Products & Inventory', icon: Boxes, badge: farmerProducts.length },
              { id: 'orders', label: 'Order Fulfillment', icon: Package, badge: farmerStats.pendingOrdersCount },
              { id: 'calendar', label: 'Crop & Harvest Calendar', icon: Calendar },
              { id: 'profile', label: 'Farm Profile & Story', icon: Store },
              { id: 'payouts', label: 'Earnings & Payouts', icon: Wallet },
              { id: 'reviews', label: 'Customer Reviews', icon: MessageSquare, badge: reviews.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as FarmerTabType);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E06D3B] to-[#F59E0B] text-white shadow-md'
                      : 'text-slate-300 hover:bg-emerald-900/40 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-emerald-800/80 text-emerald-200'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Farm Quick Summary Sidebar Card */}
          <div className="mt-8 p-4 rounded-2xl bg-black/20 border border-emerald-900/40 text-xs space-y-2">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span>Farm Rating</span>
              <span className="flex items-center gap-1 text-amber-400">⭐ {currentProducer?.rating || 4.9}</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {currentProducer?.specialty || 'Organic Produce & Artisanal Goods'}
            </p>
            <div className="pt-2 border-t border-emerald-900/40 text-[10px] text-slate-400 flex justify-between">
              <span>Location:</span>
              <span className="text-slate-200 font-medium">{currentProducer?.location || 'Green Valley'}</span>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Header Greeting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-[#183325] to-[#12261B] p-6 rounded-3xl border border-emerald-800/50 shadow-lg">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                    Welcome Back, {currentProducer?.name || 'Farmer'}! 👋
                  </h2>
                  <p className="text-xs text-emerald-300/80 mt-1">
                    Manage your fresh harvest, update stock, and process customer orders in real-time.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openProductModal()}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E06D3B] to-[#F59E0B] text-white font-bold text-xs shadow-md hover:brightness-110 transition flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Harvest Product
                  </button>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#14261C] border border-emerald-900/60 p-5 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Total Farm Sales</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    ${Number(farmerStats.totalRevenue || 0).toFixed(2)}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% from last month
                  </div>
                </div>

                <div className="bg-[#14261C] border border-emerald-900/60 p-5 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Pending Fulfillment</span>
                    <Package className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-amber-400">
                    {farmerStats.pendingOrdersCount} <span className="text-xs font-normal text-slate-400">orders</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    Ready to pack & dispatch
                  </div>
                </div>

                <div className="bg-[#14261C] border border-emerald-900/60 p-5 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Active Listed Products</span>
                    <Boxes className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {farmerStats.activeProductsCount} <span className="text-xs font-normal text-slate-400">items</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium">
                    {farmerStats.lowStockCount} low stock alerts
                  </div>
                </div>

                <div className="bg-[#14261C] border border-emerald-900/60 p-5 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Completed Orders</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {farmerStats.completedOrders}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium">
                    Delivered to happy customers
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Orders Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Recent Orders */}
                <div className="lg:col-span-2 bg-[#14261C] border border-emerald-900/60 p-5 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                      <Truck className="w-5 h-5 text-[#E06D3B]" /> Recent Orders Needing Packing
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-emerald-400 hover:underline font-semibold"
                    >
                      View All Orders →
                    </button>
                  </div>

                  {farmerOrders.length === 0 ? (
                    <p className="text-xs text-slate-400 py-8 text-center">No recent orders for your farm.</p>
                  ) : (
                    <div className="space-y-3">
                      {farmerOrders.slice(0, 4).map((order) => (
                        <div
                          key={order.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-black/20 border border-emerald-900/40 gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">Order #{order.id}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  order.status === 'Pending'
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : order.status === 'Packed'
                                    ? 'bg-blue-500/20 text-blue-300'
                                    : 'bg-emerald-500/20 text-emerald-300'
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">
                              Customer: {order.customer_name || 'Anonymous Buyer'} • ${Number(order.total_amount || 0).toFixed(2)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setViewingOrder(order);
                                setShowPackingSlip(true);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold flex items-center gap-1 transition"
                            >
                              <Printer className="w-3.5 h-3.5" /> Packing Slip
                            </button>
                            {order.status === 'Pending' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'Packed')}
                                className="px-3 py-1.5 rounded-lg bg-[#E06D3B] hover:brightness-110 text-white text-xs font-bold transition"
                              >
                                Mark Packed
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right 1 Col: Harvest Status & Crop Preview */}
                <div className="bg-[#14261C] border border-emerald-900/60 p-5 rounded-3xl space-y-4">
                  <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-emerald-400" /> Active Crop Calendar
                  </h3>

                  <div className="space-y-3">
                    {cropList.map((crop) => (
                      <div key={crop.id} className="p-3 rounded-2xl bg-black/20 border border-emerald-900/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{crop.cropName}</span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                            {crop.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Est. Harvest: {crop.expectedHarvestDate}</span>
                          <span className="text-emerald-400 font-semibold">{crop.estimatedYield}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveTab('calendar')}
                    className="w-full py-2.5 rounded-xl border border-emerald-800/80 hover:bg-emerald-900/40 text-xs font-bold text-emerald-300 transition"
                  >
                    Manage Crop Schedule →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS & INVENTORY */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white">Farm Products & Stock Control</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage prices, units, dietary tags, and live inventory status for your listed produce.
                  </p>
                </div>
                <button
                  onClick={() => openProductModal()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E06D3B] to-[#F59E0B] text-white font-bold text-xs shadow-md hover:brightness-110 transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add New Product
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 bg-[#14261C] p-4 rounded-2xl border border-emerald-900/60">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search your farm products..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/20 border border-emerald-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#E06D3B]"
                  />
                </div>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) =>
                    setSelectedCategoryFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
                  }
                  className="bg-black/20 border border-emerald-800 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#E06D3B]"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Products Grid / Table */}
              <div className="bg-[#14261C] border border-emerald-900/60 rounded-3xl overflow-hidden shadow-lg">
                {filteredProducts.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 space-y-3">
                    <Boxes className="w-12 h-12 text-emerald-800 mx-auto" />
                    <p className="text-sm">No products found matching your search.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-emerald-950/80 text-emerald-200 uppercase text-[10px] tracking-wider font-bold border-b border-emerald-900/60">
                        <tr>
                          <th className="px-4 py-3.5">Product</th>
                          <th className="px-4 py-3.5">Category</th>
                          <th className="px-4 py-3.5">Price & Unit</th>
                          <th className="px-4 py-3.5">Stock</th>
                          <th className="px-4 py-3.5">Status</th>
                          <th className="px-4 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-900/40">
                        {filteredProducts.map((prod) => (
                          <tr key={prod.id} className="hover:bg-emerald-900/20 transition">
                            <td className="px-4 py-3 font-semibold text-white flex items-center gap-3">
                              <img
                                src={resolveProductImage(prod.image_url)}
                                alt={prod.name}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                                }}
                                className="w-10 h-10 rounded-lg object-cover border border-emerald-900 shrink-0"
                              />
                              <div>
                                <span className="block font-bold text-white">{prod.name}</span>
                                <span className="text-[10px] text-emerald-400">{prod.dietary_tags || 'Organic'}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-400">
                              {categories.find((c) => c.id === prod.category_id)?.name || 'Produce'}
                            </td>
                            <td className="px-4 py-3 font-bold text-emerald-300">
                              ${Number(prod.price || 0).toFixed(2)} / {prod.unit || 'kg'}
                            </td>
                            <td className="px-4 py-3 font-medium">
                              <span className={(prod.stock ?? 10) < 10 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                                {prod.stock ?? 50} units
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleToggleStock(prod)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                                  prod.in_stock !== false
                                    ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                    : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                                }`}
                              >
                                {prod.in_stock !== false ? 'In Stock' : 'Out of Stock'}
                              </button>
                            </td>
                            <td className="px-4 py-3 text-right space-x-2">
                              <button
                                onClick={() => openProductModal(prod)}
                                className="p-1.5 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 transition"
                                title="Edit Product"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 transition"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ORDER FULFILLMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-serif font-bold text-white">Order Fulfillment & Dispatch</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Process orders containing items from your farm, update statuses, and print packing slips.
                </p>
              </div>

              {/* Order Filters */}
              <div className="flex flex-col sm:flex-row gap-3 bg-[#14261C] p-4 rounded-2xl border border-emerald-900/60">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by order ID or customer name..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/20 border border-emerald-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#E06D3B]"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-black/20 border border-emerald-800 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#E06D3B]"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="packed">Packed</option>
                  <option value="in transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="bg-[#14261C] border border-emerald-900/60 rounded-3xl p-12 text-center text-slate-400">
                    <Package className="w-12 h-12 text-emerald-800 mx-auto mb-2" />
                    <p className="text-sm">No orders matching the selected filter.</p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-[#14261C] border border-emerald-900/60 p-5 rounded-3xl space-y-4 shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-900/40">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">Order #{order.id}</span>
                            <span className="text-xs text-slate-400">• {order.delivery_date || 'Standard Delivery'}</span>
                          </div>
                          <p className="text-xs text-emerald-400 mt-0.5">
                            Customer: <strong className="text-white">{order.customer_name || 'Guest'}</strong> ({order.shipping_address || 'Address provided'}) • <span className="text-emerald-300 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">💵 Cash on Delivery (COD)</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-amber-400">${Number(order.total_amount || 0).toFixed(2)}</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="bg-black/30 border border-emerald-800 text-white text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Packed">Packed</option>
                            <option value="In transit">In transit</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => {
                              setViewingOrder(order);
                              setShowPackingSlip(true);
                            }}
                            className="p-2 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 text-xs font-bold transition"
                            title="Print Packing Slip"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="text-xs text-slate-300">
                        <span className="text-slate-400 text-[11px] block mb-1">Packed Items:</span>
                        <div className="bg-black/20 p-3 rounded-xl border border-emerald-900/40">
                          {typeof order.items_json === 'string'
                            ? order.items_json
                            : Array.isArray(order.items_json)
                            ? order.items_json.map((item, idx) => (
                                <div key={idx} className="flex justify-between py-1 border-b border-emerald-900/20 last:border-none">
                                  <span>{item.name || item.product?.name || 'Farm Product'} × {item.quantity || 1}</span>
                                  <span className="font-semibold text-emerald-300">${(Number(item.price || item.product?.price || 0) * Number(item.quantity || 1)).toFixed(2)}</span>
                                </div>
                              ))
                            : 'Standard Farm Box'}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CROP & HARVEST CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white">Seasonal Crop & Harvest Schedule</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Plan upcoming crops, inform buyers of future harvests, and enable pre-order bookings.
                  </p>
                </div>
                <button
                  onClick={() => setShowCropModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E06D3B] to-[#F59E0B] text-white font-bold text-xs shadow-md hover:brightness-110 transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Schedule New Crop
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cropList.map((crop) => (
                  <div key={crop.id} className="bg-[#14261C] border border-emerald-900/60 p-5 rounded-3xl space-y-3 relative overflow-hidden shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        {crop.category}
                      </span>
                      <span className="text-xs font-bold text-amber-400">{crop.status}</span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-white">{crop.cropName}</h3>

                    <div className="space-y-1 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Est. Harvest Date:</span>
                        <span className="font-bold text-white">{crop.expectedHarvestDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Estimated Yield:</span>
                        <span className="font-bold text-emerald-300">{crop.estimatedYield}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-emerald-900/40 flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleAdvanceCropStatus(crop.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 font-semibold text-[11px] transition"
                        title="Click to advance stage"
                      >
                        Stage: {crop.status} ➔
                      </button>
                      <button
                        onClick={() => handleDeleteCrop(crop.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 transition"
                        title="Remove Crop"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FARM PROFILE & STORY */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-serif font-bold text-white">Farm Profile & Branding</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update your farm description, story, location, and photos visible to all MarketLink buyers.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="bg-[#14261C] border border-emerald-900/60 p-6 rounded-3xl space-y-4 shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-200 mb-1">Farm Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-emerald-800 text-xs text-white focus:outline-none focus:border-[#E06D3B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-200 mb-1">Specialty & Tags</label>
                    <input
                      type="text"
                      value={profileSpecialty}
                      onChange={(e) => setProfileSpecialty(e.target.value)}
                      placeholder="e.g. Organic Produce, Artisanal Dairy"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-emerald-800 text-xs text-white focus:outline-none focus:border-[#E06D3B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-200 mb-1">Location / District</label>
                    <input
                      type="text"
                      value={profileLocation}
                      onChange={(e) => setProfileLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-emerald-800 text-xs text-white focus:outline-none focus:border-[#E06D3B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-200 mb-1">City / Region</label>
                    <input
                      type="text"
                      value={profileCity}
                      onChange={(e) => setProfileCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-emerald-800 text-xs text-white focus:outline-none focus:border-[#E06D3B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1">Short Description</label>
                  <input
                    type="text"
                    value={profileDescription}
                    onChange={(e) => setProfileDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-emerald-800 text-xs text-white focus:outline-none focus:border-[#E06D3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1">Full Farm Story & Farming Practices</label>
                  <textarea
                    rows={4}
                    value={profileStory}
                    onChange={(e) => setProfileStory(e.target.value)}
                    placeholder="Tell customers about your soil, history, non-GMO seed choices..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-emerald-800 text-xs text-white focus:outline-none focus:border-[#E06D3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1">Farm Image URL</label>
                  <input
                    type="text"
                    value={profileImageUrl}
                    onChange={(e) => setProfileImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-emerald-800 text-xs text-white focus:outline-none focus:border-[#E06D3B]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E06D3B] to-[#F59E0B] text-white font-bold text-xs shadow-md hover:brightness-110 transition disabled:opacity-50"
                  >
                    {isSavingProfile ? 'Saving Profile...' : 'Save Profile Details'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: EARNINGS & PAYOUTS */}
          {activeTab === 'payouts' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white">Earnings & Bank Payouts</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Track gross revenue, platform fee deductions (10%), net payouts, and bank transfers.
                  </p>
                </div>
                <button
                  onClick={() => setShowPayoutModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E06D3B] to-[#F59E0B] text-white font-bold text-xs shadow-md hover:brightness-110 transition flex items-center gap-1.5"
                >
                  <Wallet className="w-4 h-4" /> Request Payout
                </button>
              </div>

              {/* Earnings Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#14261C] border border-emerald-900/60 p-5 rounded-2xl space-y-2">
                  <span className="text-slate-400 text-xs font-semibold">Total Revenue</span>
                  <div className="text-2xl font-bold text-white">${Number(farmerStats.totalRevenue || 0).toFixed(2)}</div>
                </div>

                <div className="bg-[#14261C] border border-emerald-900/60 p-5 rounded-2xl space-y-2">
                  <span className="text-slate-400 text-xs font-semibold">Platform Fee (10%)</span>
                  <div className="text-2xl font-bold text-rose-400">
                    -${(Number(farmerStats.totalRevenue || 0) * 0.1).toFixed(2)}
                  </div>
                </div>

                <div className="bg-[#14261C] border border-emerald-900/60 p-5 rounded-2xl space-y-2">
                  <span className="text-slate-400 text-xs font-semibold">Net Eligible Payout</span>
                  <div className="text-2xl font-bold text-emerald-400">
                    ${(Number(farmerStats.totalRevenue || 0) * 0.9).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Payout History Table */}
              <div className="bg-[#14261C] border border-emerald-900/60 rounded-3xl overflow-hidden shadow-lg">
                <div className="p-4 border-b border-emerald-900/60 font-serif font-bold text-white text-sm">
                  Recent Payout Transactions
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-emerald-950/80 text-emerald-200 uppercase text-[10px] tracking-wider font-bold">
                      <tr>
                        <th className="px-4 py-3">Tx ID</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Bank Account</th>
                        <th className="px-4 py-3">Gross</th>
                        <th className="px-4 py-3">Net Received</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-900/40">
                      {payouts.map((tx) => (
                        <tr key={tx.id} className="hover:bg-emerald-900/20 transition">
                          <td className="px-4 py-3 font-bold text-white">{tx.id}</td>
                          <td className="px-4 py-3 text-slate-400">{tx.date}</td>
                          <td className="px-4 py-3 text-slate-300">{tx.bankAccount}</td>
                          <td className="px-4 py-3 text-slate-400">${Number(tx.amount || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 font-bold text-emerald-300">${Number(tx.netAmount || 0).toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                tx.status === 'Completed'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-serif font-bold text-white">Customer Reviews & Feedback</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  See what buyers say about your farm's products and respond to direct feedback.
                </p>
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-[#14261C] border border-emerald-900/60 p-5 rounded-3xl space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white text-sm">{rev.customerName}</span>
                        <span className="text-xs text-slate-400 ml-2">on {rev.productName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                        {'★'.repeat(rev.rating)}
                        <span className="text-slate-400 text-[10px] ml-1">({rev.date})</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 italic bg-black/20 p-3 rounded-xl border border-emerald-900/30">
                      "{rev.comment}"
                    </p>

                    {rev.reply ? (
                      <div className="ml-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-xs text-emerald-200">
                        <span className="font-bold text-emerald-400 block mb-0.5">Your Response:</span>
                        {rev.reply}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={replyText[rev.id] || ''}
                          onChange={(e) => setReplyText({ ...replyText, [rev.id]: e.target.value })}
                          placeholder="Type reply to customer..."
                          className="flex-1 px-3 py-1.5 rounded-lg bg-black/20 border border-emerald-800 text-xs text-white focus:outline-none focus:border-[#E06D3B]"
                        />
                        <button
                          onClick={() => handlePostReviewReply(rev.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#E06D3B] hover:brightness-110 text-white text-xs font-bold transition"
                        >
                          Reply
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#162B20] border border-emerald-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowProductModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-lg text-white">
              {editingProduct ? 'Edit Harvest Product' : 'Add New Harvest Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  placeholder="e.g. Fresh Organic Heirloom Tomatoes"
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-emerald-800 text-white text-xs focus:outline-none focus:border-[#E06D3B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    required
                    placeholder="4.99"
                    className="w-full px-3 py-2 rounded-xl bg-black/30 border border-emerald-800 text-white text-xs focus:outline-none focus:border-[#E06D3B]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit</label>
                  <select
                    value={productUnit}
                    onChange={(e) => setProductUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/30 border border-emerald-800 text-white text-xs focus:outline-none focus:border-[#E06D3B]"
                  >
                    <option value="kg">per kg</option>
                    <option value="lb">per lb</option>
                    <option value="dozen">per dozen</option>
                    <option value="each">per item / each</option>
                    <option value="box">per box</option>
                    <option value="jar">per jar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={productCategoryId}
                    onChange={(e) => setProductCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/30 border border-emerald-800 text-white text-xs focus:outline-none focus:border-[#E06D3B]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-black/30 border border-emerald-800 text-white text-xs focus:outline-none focus:border-[#E06D3B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dietary Tags</label>
                <input
                  type="text"
                  value={productDietary}
                  onChange={(e) => setProductDietary(e.target.value)}
                  placeholder="Organic, Pesticide-Free, Raw"
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-emerald-800 text-white text-xs focus:outline-none focus:border-[#E06D3B]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  value={productImageData}
                  onChange={(e) => setProductImageData(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-emerald-800 text-white text-xs focus:outline-none focus:border-[#E06D3B]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Freshly harvested this morning..."
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-emerald-800 text-white text-xs focus:outline-none focus:border-[#E06D3B]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={productInStock}
                  onChange={(e) => setProductInStock(e.target.checked)}
                  className="rounded text-[#E06D3B] focus:ring-0"
                />
                <label htmlFor="inStockCheck" className="text-xs text-slate-200 font-semibold">
                  Mark as Available In-Stock
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E06D3B] to-[#F59E0B] text-white font-bold shadow-md hover:brightness-110"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PACKING SLIP PREVIEW */}
      {showPackingSlip && viewingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 border border-slate-300 w-full max-w-xl rounded-3xl p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowPackingSlip(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1D3E2E]">MarketLink Packing Slip</h3>
                <p className="text-xs text-slate-500">Order #{viewingOrder.id}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#E06D3B]">{currentProducer?.name || 'Farm Producer'}</span>
                <p className="text-[10px] text-slate-400">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Customer Info:</span>
                <p className="font-semibold text-slate-900">{viewingOrder.customer_name || 'Valued Buyer'}</p>
                <p className="text-slate-600 mt-0.5">{viewingOrder.shipping_address || 'Delivery Address On File'}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Fulfillment Status:</span>
                <p className="font-bold text-emerald-700 uppercase">{viewingOrder.status}</p>
                <p className="text-slate-600 text-[11px] mt-0.5">Delivery: {viewingOrder.delivery_date}</p>
              </div>
            </div>

            <div className="border rounded-xl p-3 bg-slate-50 text-xs space-y-2">
              <span className="font-bold text-slate-800 block">Items to Pack:</span>
              {typeof viewingOrder.items_json === 'string'
                ? viewingOrder.items_json
                : Array.isArray(viewingOrder.items_json)
                ? viewingOrder.items_json.map((item, i) => (
                    <div key={i} className="flex justify-between border-b pb-1 last:border-none">
                      <span className="font-medium text-slate-800">{item.name || item.product?.name}</span>
                      <span className="font-bold text-slate-900">Qty: {item.quantity || 1}</span>
                    </div>
                  ))
                : 'Standard Produce Box'}
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-500 italic">Thank you for supporting direct local agriculture!</span>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-[#1D3E2E] text-white font-bold flex items-center gap-1.5 hover:bg-[#2C3E35]"
              >
                <Printer className="w-4 h-4" /> Print Order Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CROP SCHEDULER */}
      {showCropModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#162B20] border border-emerald-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowCropModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-lg text-white">Schedule Crop / Harvest</h3>

            <form onSubmit={handleAddCrop} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Crop / Produce Name</label>
                <input
                  type="text"
                  value={newCropName}
                  onChange={(e) => setNewCropName(e.target.value)}
                  required
                  placeholder="e.g. Organic Baby Carrots"
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-emerald-800 text-white focus:outline-none focus:border-[#E06D3B]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={newCropCategory}
                  onChange={(e) => setNewCropCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-emerald-800 text-white focus:outline-none focus:border-[#E06D3B]"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Dairy & Poultry">Dairy & Poultry</option>
                  <option value="Grains & Honey">Grains & Honey</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Expected Harvest Date</label>
                <input
                  type="date"
                  value={newCropDate}
                  onChange={(e) => setNewCropDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-emerald-800 text-white focus:outline-none focus:border-[#E06D3B]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Estimated Yield (e.g. 200 kg)</label>
                <input
                  type="text"
                  value={newCropYield}
                  onChange={(e) => setNewCropYield(e.target.value)}
                  placeholder="200 kg"
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-emerald-800 text-white focus:outline-none focus:border-[#E06D3B]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCropModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E06D3B] to-[#F59E0B] text-white font-bold shadow-md"
                >
                  Add Crop Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: PAYOUT REQUEST */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#162B20] border border-emerald-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 relative text-xs">
            <button
              onClick={() => setShowPayoutModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-lg text-white">Confirm Bank Payout Request</h3>

            <div className="bg-black/30 p-4 rounded-2xl border border-emerald-900/60 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Available Gross Revenue:</span>
                <span className="font-bold text-white">${Number(farmerStats.totalRevenue || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Platform Commission Fee (10%):</span>
                <span className="font-bold text-rose-400">-${(Number(farmerStats.totalRevenue || 0) * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-emerald-900/60 pt-2">
                <span className="text-emerald-300 font-bold">Net Payout to Bank:</span>
                <span className="font-bold text-emerald-400 text-sm">${(Number(farmerStats.totalRevenue || 0) * 0.9).toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Destination Bank Account</label>
              <input
                type="text"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-emerald-800 text-white font-mono focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPayoutModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestPayout}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E06D3B] to-[#F59E0B] text-white font-bold shadow-md"
              >
                Submit Payout Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
