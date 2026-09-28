'use client';

import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Clock,
  Database,
  Banknote,
  Download,
  Edit,
  Eye,
  Filter,
  Flame,
  Globe,
  Layers,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  PackageCheck,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
  Tag,
  Trash2,
  Truck,
  UserCheck,
  Users,
  X,
  PieChart as PieIcon,
  HelpCircle
} from 'lucide-react';
import type { Product, Producer, Category, Order, User, QuizResponse, DbStatus, AdminStats, OrderItem } from '@/lib/types';
import { INITIAL_CATEGORIES } from '@/lib/data';
import { resolveProductImage } from '@/lib/product-helpers';
import { clearStoredUser, setStoredUser } from '@/lib/auth';

type TabType = 'overview' | 'orders' | 'products' | 'producers' | 'customers' | 'quiz' | 'settings';

export default function AdminDashboardSuite() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notice, setNotice] = useState<string>('');

  // Data States
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [producers, setProducers] = useState<Producer[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [quizResponses, setQuizResponses] = useState<QuizResponse[]>([]);
  const [dbStatus, setDbStatus] = useState<DbStatus>({ connected: false, mode: 'mock_fallback', message: 'Loading status...' });
  const [stats, setStats] = useState<AdminStats>({
    grossRevenue: 0,
    ordersToday: 0,
    activeShoppers: 0,
    lowStockItems: 0,
    totalProducers: 0,
    totalProducts: 0,
    verifiedProducersCount: 0
  });

  // Filter & Search States
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | 'all'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [producerSearch, setProducerSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategoryId, setProductCategoryId] = useState('1');
  const [productProducerId, setProductProducerId] = useState('1');
  const [productUnit, setProductUnit] = useState('each');
  const [productStock, setProductStock] = useState('25');
  const [productDietary, setProductDietary] = useState('Organic');
  const [productImageData, setProductImageData] = useState('');
  const [productInStock, setProductInStock] = useState(true);
  const [productDescription, setProductDescription] = useState('');

  const [showProducerModal, setShowProducerModal] = useState(false);
  const [editingProducer, setEditingProducer] = useState<Producer | null>(null);
  const [producerName, setProducerName] = useState('');
  const [producerLocation, setProducerLocation] = useState('');
  const [producerCity, setProducerCity] = useState('');
  const [producerSpecialty, setProducerSpecialty] = useState('');
  const [producerDescription, setProducerDescription] = useState('');
  const [producerStory, setProducerStory] = useState('');
  const [producerVerified, setProducerVerified] = useState(true);

  const [viewingOrderDetails, setViewingOrderDetails] = useState<Order | null>(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('password123');
  const [newUserLocation, setNewUserLocation] = useState('');
  const [newUserRole, setNewUserRole] = useState<'customer' | 'farmer' | 'admin'>('customer');

  const openAddUserModal = () => {
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('password123');
    setNewUserLocation('');
    setNewUserRole('customer');
    setShowUserModal(true);
  };

  const handleSaveUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      setNotice('Please enter full name and email address.');
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUserEmail.trim(),
          password: newUserPassword,
          full_name: newUserName.trim(),
          address: newUserLocation.trim(),
          role: newUserRole
        })
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`Account for "${newUserName}" registered successfully.`);
        setShowUserModal(false);
        fetchInitialData();
      } else {
        setNotice(data.error || 'Failed to create user account.');
      }
    } catch {
      setNotice('Failed to connect to server.');
    }
  };

  // Check the signed server session on load.
  useEffect(() => {
    let active = true;
    fetch('/api/admin/auth')
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!active || data?.user?.role !== 'admin') return;
        setStoredUser(data.user);
        setIsAuthenticated(true);
        void fetchInitialData();
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  async function fetchInitialData() {
    setLoading(true);
    try {
      const [prodRes, procRes, ordRes, usrRes, quizRes, dbRes, statsRes] = await Promise.all([
        fetch('/api/products').then(r => r.json()).catch(() => ({ products: [] })),
        fetch('/api/producers').then(r => r.json()).catch(() => ({ producers: [] })),
        fetch('/api/orders').then(r => r.json()).catch(() => ({ orders: [] })),
        fetch('/api/users').then(r => r.json()).catch(() => ({ users: [] })),
        fetch('/api/quiz').then(r => r.json()).catch(() => ({ responses: [] })),
        fetch('/api/db-status').then(r => r.json()).catch(() => ({ connected: false, mode: 'mock_fallback', message: 'Fallback' })),
        fetch('/api/admin/stats').then(r => r.json()).catch(() => ({ stats: null }))
      ]);

      if (prodRes.products) setProducts(prodRes.products);
      if (procRes.producers) setProducers(procRes.producers);
      if (ordRes.orders) setOrders(ordRes.orders);
      if (usrRes.users) setUsers(usrRes.users);
      if (quizRes.responses) setQuizResponses(quizRes.responses);
      if (dbRes) setDbStatus(dbRes);
      if (statsRes.stats) setStats(statsRes.stats);
    } catch {
      setNotice('Failed to synchronize with live database API. Showing cached state.');
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword })
      });
      const data = await res.json();

      if (data.success) {
        const adminUser: User = data.user || {
          id: 1,
          email: adminEmail,
          full_name: 'Admin',
          role: 'admin',
          address: 'Karachi Central',
          zipcode: '15201',
          subscriptionActive: true
        };
        setStoredUser(adminUser);
        setIsAuthenticated(true);
        setNotice('Successfully logged into MarketLink Admin Panel.');
        fetchInitialData();
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch {
      setLoginError('Authentication failed. Check your network or credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' }).catch(() => {});
    clearStoredUser();
    setIsAuthenticated(false);
  };

  // Product CRUD
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductName('');
    setProductPrice('');
    setProductCategoryId(String(categories[0]?.id || 1));
    setProductProducerId(String(producers[0]?.id || 1));
    setProductUnit('each');
    setProductStock('20');
    setProductDietary('Organic');
    setProductImageData('');
    setProductInStock(true);
    setProductDescription('');
    setShowProductModal(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setProductName(prod.name);
    setProductPrice(String(prod.price));
    setProductCategoryId(String(prod.category_id));
    setProductProducerId(String(prod.producer_id));
    setProductUnit(prod.unit || 'each');
    setProductStock(String(prod.stock || 15));
    setProductDietary(prod.dietary_tags || 'Organic');
    setProductImageData(prod.image_url || '');
    setProductInStock(prod.in_stock !== false);
    setProductDescription(prod.description || '');
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !productPrice) {
      setNotice('Please specify product name and price.');
      return;
    }

    const payload = {
      id: editingProduct ? editingProduct.id : undefined,
      name: productName.trim(),
      price: Number(productPrice),
      category_id: Number(productCategoryId),
      producer_id: Number(productProducerId),
      unit: productUnit,
      stock: Number(productStock),
      dietary_tags: productDietary,
      image_url: resolveProductImage(productImageData),
      in_stock: productInStock,
      description: productDescription
    };

    try {
      const res = await fetch('/api/products', {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`Product "${productName}" saved successfully.`);
        setShowProductModal(false);
        fetchInitialData();
      } else {
        setNotice(data.error || 'Failed to save product.');
      }
    } catch {
      setNotice('Could not connect to server to save product.');
    }
  };

  const handleDeleteProduct = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotice(`Product "${name}" deleted.`);
        fetchInitialData();
      } else {
        setNotice(data.error || 'Failed to delete product.');
      }
    } catch {
      setNotice('Failed to delete product.');
    }
  };

  // Producer CRUD
  const openAddProducerModal = () => {
    setEditingProducer(null);
    setProducerName('');
    setProducerLocation('');
    setProducerCity('');
    setProducerSpecialty('');
    setProducerDescription('');
    setProducerStory('');
    setProducerVerified(true);
    setShowProducerModal(true);
  };

  const openEditProducerModal = (proc: Producer) => {
    setEditingProducer(proc);
    setProducerName(proc.name);
    setProducerLocation(proc.location);
    setProducerCity(proc.city || proc.location || '');
    setProducerSpecialty(proc.specialty);
    setProducerDescription(proc.description || '');
    setProducerStory(proc.story || proc.description || '');
    setProducerVerified(Boolean(proc.verified));
    setShowProducerModal(true);
  };

  const handleSaveProducer = async (e: FormEvent) => {
    e.preventDefault();
    if (!producerName.trim() || !producerLocation.trim()) {
      setNotice('Please specify producer name and location.');
      return;
    }

    const payload = {
      id: editingProducer ? editingProducer.id : undefined,
      name: producerName.trim(),
      location: producerLocation.trim(),
      city: producerCity.trim() || producerLocation.trim(),
      specialty: producerSpecialty.trim() || 'Organic Produce',
      description: producerDescription,
      story: producerStory || producerDescription,
      verified: producerVerified,
      image_url: editingProducer?.image_url || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80'
    };

    try {
      const res = await fetch('/api/producers', {
        method: editingProducer ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`Producer "${producerName}" saved successfully.`);
        setShowProducerModal(false);
        fetchInitialData();
      } else {
        setNotice(data.error || 'Failed to save producer.');
      }
    } catch {
      setNotice('Failed to save producer.');
    }
  };

  const handleToggleProducerVerified = async (id: number, currentName: string) => {
    try {
      const res = await fetch(`/api/producers?id=${id}`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        setNotice(`Verification status updated for ${currentName}.`);
        fetchInitialData();
      } else {
        setNotice(data.error || 'Verification update failed.');
      }
    } catch {
      setNotice('Verification update failed.');
    }
  };

  const handleDeleteProducer = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete producer "${name}"?`)) return;
    try {
      const res = await fetch(`/api/producers?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotice(`Producer "${name}" deleted.`);
        fetchInitialData();
      } else {
        setNotice(data.error || 'Failed to delete producer.');
      }
    } catch {
      setNotice('Failed to delete producer.');
    }
  };

  // Order Status Update
  const handleUpdateOrderStatus = async (orderId: string | number, newStatus: Order['status']) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`Order ${orderId} status set to ${newStatus}.`);
        setOrders(prev => prev.map(o => String(o.id) === String(orderId) ? { ...o, status: newStatus } : o));
      } else {
        setNotice(data.error || 'Failed to update order status.');
      }
    } catch {
      setNotice('Failed to update order status.');
    }
  };

  const handleDeleteOrder = async (orderId: string | number) => {
    if (!confirm(`Delete order ${orderId}?`)) return;
    try {
      const res = await fetch(`/api/orders?id=${orderId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotice(`Order ${orderId} removed.`);
        setOrders(prev => prev.filter(o => String(o.id) !== String(orderId)));
      } else {
        setNotice(data.error || 'Failed to delete order.');
      }
    } catch {
      setNotice('Failed to delete order.');
    }
  };

  // User Delete
  const handleDeleteUser = async (userId: number, name: string) => {
    if (!confirm(`Delete user "${name}"?`)) return;
    try {
      const res = await fetch(`/api/users?id=${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotice(`User ${name} removed.`);
        setUsers(prev => prev.filter(u => u.id !== userId));
      } else {
        setNotice(data.error || 'Failed to delete user.');
      }
    } catch {
      setNotice('Failed to delete user.');
    }
  };


  // Filtered lists
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          (p.producer_name && p.producer_name.toLowerCase().includes(productSearch.toLowerCase()));
      const matchCat = selectedCategoryFilter === 'all' || p.category_id === selectedCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, productSearch, selectedCategoryFilter]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const searchStr = `${o.id} ${o.customer_name || ''} ${o.customer_email || ''}`.toLowerCase();
      const matchSearch = searchStr.includes(orderSearch.toLowerCase());
      const matchStatus = orderStatusFilter === 'all' || o.status.toLowerCase() === orderStatusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  const filteredProducers = useMemo(() => {
    return producers.filter(p => {
      const searchStr = `${p.name} ${p.location} ${p.specialty}`.toLowerCase();
      return searchStr.includes(producerSearch.toLowerCase());
    });
  }, [producers, producerSearch]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const searchStr = `${u.full_name} ${u.email} ${u.zipcode || ''} ${u.address || ''}`.toLowerCase();
      return searchStr.includes(userSearch.toLowerCase());
    });
  }, [users, userSearch]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(val);

  // If not authenticated, render Admin Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#112319] text-[#E8E2D5] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#1B3627] border border-[#2D543F] rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <ShieldCheck className="w-48 h-48 text-[#E06D3B]" />
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E06D3B]/20 text-[#E06D3B] mb-4 border border-[#E06D3B]/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E06D3B]">MarketLink Control Center</p>
            <h1 className="font-serif text-3xl font-bold text-white mt-1">Admin Sign In</h1>
            <p className="text-xs text-[#A3B899] mt-2">Enter credentials to manage marketplace operations</p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A3B899] mb-1.5">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                className="w-full rounded-2xl bg-[#112319] border border-[#2D543F] px-4 py-3 text-sm text-white placeholder-emerald-700 focus:outline-none focus:border-[#E06D3B] transition"
                placeholder="admin@marketlink.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A3B899] mb-1.5">Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="w-full rounded-2xl bg-[#112319] border border-[#2D543F] px-4 py-3 text-sm text-white placeholder-emerald-700 focus:outline-none focus:border-[#E06D3B] transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full rounded-2xl bg-[#E06D3B] hover:bg-[#c95b2b] text-white py-3.5 px-4 font-bold text-sm transition shadow-lg shadow-[#E06D3B]/20 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-[#A3B899] hover:underline">← Back to MarketLink Storefront</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#1D3E2E] flex flex-col md:flex-row font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#1D3E2E] text-white p-4 flex items-center justify-between border-b border-[#2D543F]">
        <div className="flex items-center gap-2">
          <Store className="w-6 h-6 text-[#E06D3B]" />
          <span className="font-serif font-bold text-lg">MarketLink Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-[#2D543F] text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`w-full md:w-64 bg-[#1D3E2E] text-[#E8E2D5] p-5 shrink-0 flex flex-col justify-between ${mobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
        <div>
          <div className="hidden md:flex items-center gap-3 px-3 py-4 mb-6 border-b border-[#2D543F]">
            <div className="w-10 h-10 rounded-2xl bg-[#E06D3B] flex items-center justify-center text-white shadow-md">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-white leading-none">MarketLink</h1>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#E06D3B]">Admin Console</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#8B7355] mb-2">Main Navigation</p>

            <button
              onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-bold text-sm transition ${activeTab === 'overview' ? 'bg-[#E06D3B] text-white shadow-md' : 'text-[#A3B899] hover:bg-[#2D543F] hover:text-white'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Overview
            </button>

            <button
              onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-sm transition ${activeTab === 'orders' ? 'bg-[#E06D3B] text-white shadow-md' : 'text-[#A3B899] hover:bg-[#2D543F] hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-4 h-4" /> Orders
              </div>
              {orders.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/30 text-amber-200 border border-amber-500/40">{orders.length}</span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('products'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-sm transition ${activeTab === 'products' ? 'bg-[#E06D3B] text-white shadow-md' : 'text-[#A3B899] hover:bg-[#2D543F] hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <Boxes className="w-4 h-4" /> Products
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300">{products.length}</span>
            </button>

            <button
              onClick={() => { setActiveTab('producers'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-sm transition ${activeTab === 'producers' ? 'bg-[#E06D3B] text-white shadow-md' : 'text-[#A3B899] hover:bg-[#2D543F] hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <UserCheck className="w-4 h-4" /> Farmers / Producers
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-500/20 text-sky-300">{producers.length}</span>
            </button>

            <button
              onClick={() => { setActiveTab('customers'); fetchInitialData(); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-sm transition ${activeTab === 'customers' ? 'bg-[#E06D3B] text-white shadow-md' : 'text-[#A3B899] hover:bg-[#2D543F] hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" /> Customers & Users
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300">{users.length}</span>
            </button>

            <button
              onClick={() => { setActiveTab('quiz'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-bold text-sm transition ${activeTab === 'quiz' ? 'bg-[#E06D3B] text-white shadow-md' : 'text-[#A3B899] hover:bg-[#2D543F] hover:text-white'}`}
            >
              <PieIcon className="w-4 h-4" /> Dietary Quiz Analytics
            </button>

            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#8B7355] mt-6 mb-2">System</p>

            <button
              onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-bold text-sm transition ${activeTab === 'settings' ? 'bg-[#E06D3B] text-white shadow-md' : 'text-[#A3B899] hover:bg-[#2D543F] hover:text-white'}`}
            >
              <Settings className="w-4 h-4" /> Database & Settings
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="mt-8 pt-4 border-t border-[#2D543F]">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${dbStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span className="text-[11px] text-[#A3B899]">{dbStatus.mode === 'mysql' ? 'MySQL Connected' : 'Local Fallback'}</span>
            </div>
            <button onClick={fetchInitialData} title="Sync data" className="text-[#A3B899] hover:text-white">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <Link href="/" className="w-full flex items-center gap-2 justify-center px-3 py-2.5 rounded-xl border border-[#2D543F] bg-[#112319] text-xs font-bold text-[#A3B899] hover:text-white hover:border-[#E06D3B] transition mb-2">
            <Store className="w-3.5 h-3.5" /> View Public Storefront
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center px-3 py-2 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-950/40 transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout Admin
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl">
        {/* Banner Alert Notice */}
        {notice && (
          <div className="mb-6 p-4 rounded-2xl border border-[#C9DCCB] bg-[#EBF5EE] text-[#1D3E2E] flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#E06D3B] shrink-0" />
              <p className="text-sm font-bold">{notice}</p>
            </div>
            <button onClick={() => setNotice('')} className="text-[#8B7355] hover:text-[#1D3E2E]">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B7355]">MarketLink Executive Suite</p>
                <h1 className="font-serif text-3xl font-bold text-[#1D3E2E]">Operational Overview</h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={openAddProductModal}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1D3E2E] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#E06D3B]"
                >
                  <Plus className="w-4 h-4" /> Add New Product
                </button>
                <button
                  onClick={openAddProducerModal}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D5CCBA] bg-white px-4 py-2.5 text-xs font-bold text-[#1D3E2E] shadow-sm transition hover:border-[#E06D3B] hover:text-[#E06D3B]"
                >
                  <UserCheck className="w-4 h-4" /> Register Producer
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="rounded-[24px] border border-[#E8E2D5] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#8B7355]">Gross Revenue</span>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                </div>
                <p className="font-serif text-2xl font-bold text-[#1D3E2E]">
                  {formatCurrency(stats.grossRevenue || 124840)}
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF5EE] text-[#1D3E2E]">
                  +12.4% this week
                </span>
              </div>

              <div className="rounded-[24px] border border-[#E8E2D5] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#8B7355]">Orders Activity</span>
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                </div>
                <p className="font-serif text-2xl font-bold text-[#1D3E2E]">
                  {orders.length} Active
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                  {orders.filter(o => o.status === 'Pending').length} Pending Fulfillment
                </span>
              </div>

              <div className="rounded-[24px] border border-[#E8E2D5] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#8B7355]">Verified Farmers</span>
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                </div>
                <p className="font-serif text-2xl font-bold text-[#1D3E2E]">
                  {producers.filter(p => p.verified).length} / {producers.length}
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">
                  Local farm networks
                </span>
              </div>

              <div className="rounded-[24px] border border-[#E8E2D5] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#8B7355]">Low Stock Alert</span>
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <p className="font-serif text-2xl font-bold text-[#1D3E2E]">
                  {products.filter(p => !p.in_stock).length} Items
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  Needs replenishment
                </span>
              </div>
            </div>

            {/* Recent Orders & Category Breakdown */}
            <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
              {/* Recent Orders Card */}
              <div className="rounded-[28px] border border-[#E8E2D5] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B7355]">Recent Activity</p>
                    <h2 className="font-serif text-xl font-bold text-[#1D3E2E]">Latest Customer Orders</h2>
                  </div>
                  <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-[#E06D3B] hover:underline flex items-center gap-1">
                    View All Orders ({orders.length}) <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="divide-y divide-[#F0EBE1]">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#1D3E2E]">#{order.id}</span>
                          <span className="text-xs font-semibold text-[#8B7355]">• {order.customer_name || 'Customer'}</span>
                        </div>
                        <p className="text-xs text-[#8B7355] mt-0.5">
                          Delivery: {order.delivery_date}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[#1D3E2E]">{formatCurrency(order.total_amount)}</span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'Packed' ? 'bg-amber-100 text-amber-800' :
                          order.status === 'In transit' ? 'bg-sky-100 text-sky-800' :
                          'bg-[#F2EFE9] text-[#8B7355]'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Breakdown Card */}
              <div className="rounded-[28px] border border-[#E8E2D5] bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B7355]">Catalog Distribution</p>
                <h2 className="font-serif text-xl font-bold text-[#1D3E2E] mb-6">Categories Breakdown</h2>

                <div className="space-y-4">
                  {categories.map(cat => {
                    const count = products.filter(p => p.category_id === cat.id).length;
                    const percentage = Math.round((count / (products.length || 1)) * 100);
                    return (
                      <div key={cat.id}>
                        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                          <span className="text-[#1D3E2E]">{cat.name}</span>
                          <span className="text-[#8B7355]">{count} items ({percentage}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#F2EFE9] overflow-hidden">
                          <div
                            className="h-full bg-[#1D3E2E] rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(percentage, 5)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B7355]">Order Fulfillment System</p>
                <h1 className="font-serif text-3xl font-bold text-[#1D3E2E]">Customer Orders</h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#8B7355]">{filteredOrders.length} Orders Listed</span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="rounded-[24px] border border-[#E8E2D5] bg-white p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8B7355]" />
                <input
                  type="text"
                  placeholder="Search by Order ID or customer..."
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F9F6F0] border border-[#E8E2D5] text-xs font-semibold text-[#1D3E2E] focus:outline-none focus:border-[#E06D3B]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {['all', 'Pending', 'Packed', 'In transit', 'Ready to ship', 'Delivered', 'Cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
                      orderStatusFilter === status ? 'bg-[#1D3E2E] text-white' : 'bg-[#F2EFE9] text-[#8B7355] hover:bg-[#E8E2D5]'
                    }`}
                  >
                    {status === 'all' ? 'All Orders' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-[28px] border border-[#E8E2D5] bg-white overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#1D3E2E]">
                  <thead className="bg-[#F9F6F0] border-b border-[#E8E2D5] uppercase tracking-wider font-bold text-[#8B7355] text-[10px]">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Delivery Date</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EBE1]">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-[#8B7355]">
                          No orders match the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-[#F9F6F0]/60 transition">
                          <td className="px-6 py-4 font-mono font-bold text-[#1D3E2E]">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-[#1D3E2E]">{order.customer_name || 'Walk-in Customer'}</p>
                            <p className="text-[10px] text-[#8B7355]">{order.customer_email || 'No email'}</p>
                          </td>
                          <td className="px-6 py-4 text-[#8B7355] font-semibold">
                            {order.delivery_date}
                          </td>
                          <td className="px-6 py-4 font-bold text-[#1D3E2E]">
                            {formatCurrency(order.total_amount)}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={e => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                              className={`rounded-full px-3 py-1 text-[11px] font-bold border focus:outline-none cursor-pointer ${
                                order.status === 'Delivered' ? 'bg-emerald-100 border-emerald-300 text-emerald-800' :
                                order.status === 'Packed' ? 'bg-amber-100 border-amber-300 text-amber-800' :
                                order.status === 'In transit' ? 'bg-sky-100 border-sky-300 text-sky-800' :
                                order.status === 'Cancelled' ? 'bg-rose-100 border-rose-300 text-rose-800' :
                                'bg-[#F2EFE9] border-[#D5CCBA] text-[#8B7355]'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Packed">Packed</option>
                              <option value="Ready to ship">Ready to ship</option>
                              <option value="In transit">In transit</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setViewingOrderDetails(order)}
                                className="p-2 rounded-xl bg-[#F9F6F0] text-[#1D3E2E] hover:bg-[#1D3E2E] hover:text-white transition"
                                title="View Details & Receipt"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition"
                                title="Delete Order"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS & INVENTORY */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B7355]">Catalog Management</p>
                <h1 className="font-serif text-3xl font-bold text-[#1D3E2E]">Products Inventory</h1>
              </div>
              <button
                onClick={openAddProductModal}
                className="inline-flex items-center gap-2 rounded-full bg-[#1D3E2E] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#E06D3B]"
              >
                <Plus className="w-4 h-4" /> Add New Product
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="rounded-[24px] border border-[#E8E2D5] bg-white p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8B7355]" />
                <input
                  type="text"
                  placeholder="Search products by name or farm..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F9F6F0] border border-[#E8E2D5] text-xs font-semibold text-[#1D3E2E] focus:outline-none focus:border-[#E06D3B]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                <span className="text-xs font-bold text-[#8B7355] shrink-0">Category:</span>
                <select
                  value={selectedCategoryFilter}
                  onChange={e => setSelectedCategoryFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="rounded-xl px-3 py-1.5 text-xs font-bold bg-[#F9F6F0] border border-[#E8E2D5] text-[#1D3E2E] focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-[28px] border border-[#E8E2D5] bg-white overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#1D3E2E]">
                  <thead className="bg-[#F9F6F0] border-b border-[#E8E2D5] uppercase tracking-wider font-bold text-[#8B7355] text-[10px]">
                    <tr>
                      <th className="px-6 py-4">Item</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Producer Farm</th>
                      <th className="px-6 py-4">Price / Unit</th>
                      <th className="px-6 py-4">Stock Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EBE1]">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-[#8B7355]">
                          No products found in inventory.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(product => {
                        const catName = categories.find(c => c.id === product.category_id)?.name || 'General';
                        const farmName = producers.find(p => p.id === product.producer_id)?.name || product.producer_name || 'MarketLink Farm';
                        return (
                          <tr key={product.id} className="hover:bg-[#F9F6F0]/60 transition">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={resolveProductImage(product.image_url)}
                                  alt={product.name}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                                  }}
                                  className="w-10 h-10 rounded-xl object-cover border border-[#E8E2D5] shrink-0"
                                />
                                <div>
                                  <p className="font-bold text-[#1D3E2E]">{product.name}</p>
                                  <span className="text-[10px] text-[#8B7355]">{product.dietary_tags || 'Organic'}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-semibold text-[#8B7355]">
                              {catName}
                            </td>
                            <td className="px-6 py-4 font-semibold text-[#1D3E2E]">
                              {farmName}
                            </td>
                            <td className="px-6 py-4 font-bold text-[#1D3E2E]">
                              {formatCurrency(product.price)} <span className="text-[10px] font-normal text-[#8B7355]">/ {product.unit || 'each'}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                product.in_stock !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {product.in_stock !== false ? 'In Stock' : 'Low / Out of Stock'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEditProductModal(product)}
                                  className="p-2 rounded-xl bg-[#F9F6F0] text-[#1D3E2E] hover:bg-[#1D3E2E] hover:text-white transition"
                                  title="Edit Product"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id, product.name)}
                                  className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FARMERS & PRODUCERS */}
        {activeTab === 'producers' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B7355]">Farm Directory & Verification</p>
                <h1 className="font-serif text-3xl font-bold text-[#1D3E2E]">Local Farmers & Producers</h1>
              </div>
              <button
                onClick={openAddProducerModal}
                className="inline-flex items-center gap-2 rounded-full bg-[#1D3E2E] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#E06D3B]"
              >
                <Plus className="w-4 h-4" /> Register New Producer
              </button>
            </div>

            {/* Filter Bar */}
            <div className="rounded-[24px] border border-[#E8E2D5] bg-white p-4 shadow-sm">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8B7355]" />
                <input
                  type="text"
                  placeholder="Search farmers by farm name, location..."
                  value={producerSearch}
                  onChange={e => setProducerSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F9F6F0] border border-[#E8E2D5] text-xs font-semibold text-[#1D3E2E] focus:outline-none focus:border-[#E06D3B]"
                />
              </div>
            </div>

            {/* Producers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducers.map(producer => (
                <div key={producer.id} className="rounded-[28px] border border-[#E8E2D5] bg-white p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={producer.image_url || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80'}
                        alt={producer.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80';
                        }}
                        className="w-14 h-14 rounded-2xl object-cover border border-[#E8E2D5]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-serif font-bold text-lg text-[#1D3E2E]">{producer.name}</h3>
                          {producer.verified && (
                            <span title="Verified Farm">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#8B7355] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#E06D3B]" /> {producer.location}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#F9F6F0] rounded-2xl p-3 mb-4 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#8B7355]">Specialty:</span>
                        <span className="font-bold text-[#1D3E2E]">{producer.specialty}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[#8B7355]">Products Listed:</span>
                        <span className="font-bold text-[#1D3E2E]">
                          {products.filter(p => p.producer_id === producer.id).length} Products
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#8B7355] line-clamp-2 mb-4">
                      {producer.description || producer.story || 'Farm-fresh local organic grower committed to sustainable agriculture.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F0EBE1] flex items-center justify-between">
                    <button
                      onClick={() => handleToggleProducerVerified(producer.id, producer.name)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                        producer.verified
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      {producer.verified ? 'Verified Farm ✓' : 'Pending Verification'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditProducerModal(producer)}
                        className="p-2 rounded-xl bg-[#F9F6F0] text-[#1D3E2E] hover:bg-[#1D3E2E] hover:text-white transition"
                        title="Edit Producer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProducer(producer.id, producer.name)}
                        className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition"
                        title="Delete Producer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMERS & USERS */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B7355]">User Directory</p>
                <h1 className="font-serif text-3xl font-bold text-[#1D3E2E]">Registered Accounts</h1>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#8B7355]">{users.length} Users Total</span>
                <button
                  onClick={openAddUserModal}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1D3E2E] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#E06D3B]"
                >
                  <Plus className="w-4 h-4" /> Register New Account
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="rounded-[24px] border border-[#E8E2D5] bg-white p-4 shadow-sm">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8B7355]" />
                <input
                  type="text"
                  placeholder="Search user name, email, zipcode..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F9F6F0] border border-[#E8E2D5] text-xs font-semibold text-[#1D3E2E] focus:outline-none focus:border-[#E06D3B]"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-[28px] border border-[#E8E2D5] bg-white overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#1D3E2E]">
                  <thead className="bg-[#F9F6F0] border-b border-[#E8E2D5] uppercase tracking-wider font-bold text-[#8B7355] text-[10px]">
                    <tr>
                      <th className="px-6 py-4">User Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Location / Zip</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EBE1]">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-[#F9F6F0]/60 transition">
                        <td className="px-6 py-4 font-bold text-[#1D3E2E]">
                          {user.full_name}
                        </td>
                        <td className="px-6 py-4 text-[#8B7355] font-semibold">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-[#8B7355]">
                          {user.address || 'Standard Location'} {user.zipcode && `(${user.zipcode})`}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'farmer' ? 'bg-sky-100 text-sky-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {user.role || 'customer'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(user.id, user.full_name)}
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition"
                            title="Remove User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: QUIZ & DIETARY ANALYTICS */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B7355]">Demand Forecasting</p>
              <h1 className="font-serif text-3xl font-bold text-[#1D3E2E]">Customer Dietary Preferences & Quiz Data</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-[28px] border border-[#E8E2D5] bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B7355]">Total Responses</p>
                <h2 className="font-serif text-3xl font-bold text-[#1D3E2E] mt-1">{quizResponses.length} Submissions</h2>
                <p className="text-xs text-[#8B7355] mt-2">Active shopper survey records in system database.</p>
              </div>

              <div className="rounded-[28px] border border-[#E8E2D5] bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B7355]">Top Requested Preference</p>
                <h2 className="font-serif text-3xl font-bold text-[#E06D3B] mt-1">100% Organic</h2>
                <p className="text-xs text-[#8B7355] mt-2">Most frequent dietary requirement selected by shoppers.</p>
              </div>

              <div className="rounded-[28px] border border-[#E8E2D5] bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B7355]">Average Household</p>
                <h2 className="font-serif text-3xl font-bold text-[#1D3E2E] mt-1">2.6 Persons</h2>
                <p className="text-xs text-[#8B7355] mt-2">Ideal basket sizing for farm subscription deliveries.</p>
              </div>
            </div>

            {/* Quiz Submissions Table */}
            <div className="rounded-[28px] border border-[#E8E2D5] bg-white overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[#F0EBE1]">
                <h2 className="font-serif text-xl font-bold text-[#1D3E2E]">Recent Survey Log</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#1D3E2E]">
                  <thead className="bg-[#F9F6F0] border-b border-[#E8E2D5] uppercase tracking-wider font-bold text-[#8B7355] text-[10px]">
                    <tr>
                      <th className="px-6 py-4">Zip Code</th>
                      <th className="px-6 py-4">Dietary Tags</th>
                      <th className="px-6 py-4">Shopping Type</th>
                      <th className="px-6 py-4">Household Size</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EBE1]">
                    {quizResponses.map((qr, idx) => (
                      <tr key={idx} className="hover:bg-[#F9F6F0]/60 transition">
                        <td className="px-6 py-4 font-mono font-bold text-[#1D3E2E]">
                          {qr.zipcode}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(qr.dietary_prefs) && qr.dietary_prefs.map(tag => (
                              <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF5EE] text-[#1D3E2E]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-[#8B7355]">
                          {qr.shopping_type}
                        </td>
                        <td className="px-6 py-4 font-bold text-[#1D3E2E]">
                          {qr.household_size} Persons
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS & DATABASE STATUS */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B7355]">Infrastructure & Diagnostics</p>
              <h1 className="font-serif text-3xl font-bold text-[#1D3E2E]">Database & System Health</h1>
            </div>

            <div className="rounded-[28px] border border-[#E8E2D5] bg-white p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-[#F0EBE1]">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${dbStatus.connected ? 'bg-emerald-600' : 'bg-amber-500'}`}>
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#1D3E2E]">
                      {dbStatus.connected ? 'MySQL Active Database Connection' : 'In-Memory Standby Engine'}
                    </h2>
                    <p className="text-xs text-[#8B7355] mt-0.5">{dbStatus.message}</p>
                  </div>
                </div>
                <button
                  onClick={fetchInitialData}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1D3E2E] text-white text-xs font-bold hover:bg-[#E06D3B] transition"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Re-check Connection
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F9F6F0] p-4 rounded-2xl border border-[#E8E2D5]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B7355]">Configured Host</span>
                  <p className="font-mono text-sm font-bold text-[#1D3E2E] mt-1">{dbStatus.host || 'localhost'}</p>
                </div>

                <div className="bg-[#F9F6F0] p-4 rounded-2xl border border-[#E8E2D5]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B7355]">Target Database Name</span>
                  <p className="font-mono text-sm font-bold text-[#1D3E2E] mt-1">{dbStatus.database || 'marketlink_db'}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F0EBE1]">
                <h3 className="font-bold text-sm text-[#1D3E2E] mb-2">MySQL Setup Instructions:</h3>
                <p className="text-xs text-[#8B7355] leading-relaxed">
                  To connect your real MySQL server, run <code className="bg-[#F2EFE9] px-2 py-0.5 rounded text-[#1D3E2E]">mysql -u root -p &lt; schema.sql</code> and set your database environment variables in <code className="bg-[#F2EFE9] px-2 py-0.5 rounded text-[#1D3E2E]">.env.local</code>.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
              <h2 className="font-serif font-bold text-xl text-[#1D3E2E]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowProductModal(false)} className="text-[#8B7355] hover:text-[#1D3E2E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1D3E2E] mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F9F6F0] font-semibold text-[#1D3E2E]"
                  placeholder="e.g. Fresh Organic Carrots"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#1D3E2E] mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={productPrice}
                    onChange={e => setProductPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F9F6F0] font-semibold text-[#1D3E2E]"
                    placeholder="250"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1D3E2E] mb-1">Unit</label>
                  <input
                    type="text"
                    value={productUnit}
                    onChange={e => setProductUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F9F6F0] font-semibold text-[#1D3E2E]"
                    placeholder="kg / bunch"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1D3E2E] mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={productStock}
                    onChange={e => setProductStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F9F6F0] font-semibold text-[#1D3E2E]"
                    placeholder="20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1D3E2E] mb-1">Category</label>
                  <select
                    value={productCategoryId}
                    onChange={e => setProductCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F9F6F0] font-semibold text-[#1D3E2E]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1D3E2E] mb-1">Farmer / Producer</label>
                  <select
                    value={productProducerId}
                    onChange={e => setProductProducerId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F9F6F0] font-semibold text-[#1D3E2E]"
                  >
                    {producers.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1D3E2E] mb-1">Dietary Tags</label>
                <input
                  type="text"
                  value={productDietary}
                  onChange={e => setProductDietary(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F9F6F0] font-semibold text-[#1D3E2E]"
                  placeholder="e.g. Organic, Pesticide-Free, Gluten-Free"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D3E2E] mb-1">Image URL / Base64</label>
                <input
                  type="text"
                  value={productImageData}
                  onChange={e => setProductImageData(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F9F6F0] font-semibold text-[#1D3E2E]"
                  placeholder="https://images.unsplash.com/photo-1542838132-92c53300491e"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D3E2E] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productDescription}
                  onChange={e => setProductDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D5] bg-[#F9F6F0] text-[#1D3E2E]"
                  placeholder="Describe farm origin and organic details..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={productInStock}
                  onChange={e => setProductInStock(e.target.checked)}
                  className="w-4 h-4 text-[#1D3E2E] rounded"
                />
                <label htmlFor="inStockCheck" className="font-bold text-[#1D3E2E]">In Stock & Active on Marketplace</label>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-[#8B7355] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1D3E2E] text-white font-bold hover:bg-[#E06D3B] transition"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCER */}
      {showProducerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
              <h2 className="font-serif font-bold text-xl text-[#1D3E2E]">
                {editingProducer ? 'Edit Farmer Profile' : 'Register New Producer'}
              </h2>
              <button onClick={() => setShowProducerModal(false)} className="text-[#8B7355] hover:text-[#1D3E2E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProducer} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1D3E2E] mb-1">Farm / Producer Name</label>
                <input
                  type="text"
                  required
                  value={producerName}
                  onChange={e => setProducerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F9F6F0] font-semibold text-[#1D3E2E]"
                  placeholder="e.g. Swat Valley Organic Farms"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1D3E2E] mb-1">Location / Address</label>
                  <input
                    type="text"
                    required
                    value={producerLocation}
                    onChange={e => setProducerLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F9F6F0] font-semibold text-[#1D3E2E]"
                    placeholder="e.g. Swat, KP"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1D3E2E] mb-1">City / Region</label>
                  <input
                    type="text"
                    value={producerCity}
                    onChange={e => setProducerCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F9F6F0] font-semibold text-[#1D3E2E]"
                    placeholder="e.g. Swat"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1D3E2E] mb-1">Specialty</label>
                <input
                  type="text"
                  value={producerSpecialty}
                  onChange={e => setProducerSpecialty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F9F6F0] font-semibold text-[#1D3E2E]"
                  placeholder="e.g. Apples, Honey, Dairy"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D3E2E] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={producerDescription}
                  onChange={e => setProducerDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D5] bg-[#F9F6F0] text-[#1D3E2E]"
                  placeholder="Short description of the farm..."
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D3E2E] mb-1">Farm Heritage & Story</label>
                <textarea
                  rows={2}
                  value={producerStory}
                  onChange={e => setProducerStory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D5] bg-[#F9F6F0] text-[#1D3E2E]"
                  placeholder="Detailed heritage story..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="verifiedCheck"
                  checked={producerVerified}
                  onChange={e => setProducerVerified(e.target.checked)}
                  className="w-4 h-4 text-[#1D3E2E] rounded"
                />
                <label htmlFor="verifiedCheck" className="font-bold text-[#1D3E2E]">Verified MarketLink Partner Farm</label>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProducerModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E8E2D5] text-[#8B7355] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1D3E2E] text-white font-bold hover:bg-[#E06D3B] transition"
                >
                  Save Producer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DETAILS & INVOICE */}
      {viewingOrderDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B7355]">Order Receipt</span>
                <h2 className="font-serif font-bold text-2xl text-[#1D3E2E]">#{viewingOrderDetails.id}</h2>
              </div>
              <button onClick={() => setViewingOrderDetails(null)} className="text-[#8B7355] hover:text-[#1D3E2E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#F9F6F0] p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8B7355]">Customer Name:</span>
                <span className="font-bold text-[#1D3E2E]">{viewingOrderDetails.customer_name || 'Walk-in Customer'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7355]">Email:</span>
                <span className="font-semibold text-[#1D3E2E]">{viewingOrderDetails.customer_email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7355]">Delivery Address:</span>
                <span className="font-semibold text-[#1D3E2E] text-right">{viewingOrderDetails.shipping_address || 'Local MarketLink Hub'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7355]">Scheduled Date:</span>
                <span className="font-bold text-[#E06D3B]">{viewingOrderDetails.delivery_date}</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xs text-[#1D3E2E] uppercase tracking-wider mb-2">Item Breakdown</h3>
              <div className="divide-y divide-[#F0EBE1] border-y border-[#F0EBE1] py-2">
                {Array.isArray(viewingOrderDetails.items_json) && viewingOrderDetails.items_json.map((item: OrderItem, idx: number) => (
                  <div key={idx} className="py-2 flex justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#1D3E2E]">{item.name || item.product?.name || 'Farm Product'}</p>
                      <p className="text-[10px] text-[#8B7355]">Qty: {item.quantity || 1}</p>
                    </div>
                    <span className="font-bold text-[#1D3E2E]">
                      {formatCurrency((item.price || item.product?.price || 0) * (item.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-bold text-[#1D3E2E] pt-2">
              <span>Total Amount:</span>
              <span className="text-xl text-[#E06D3B]">{formatCurrency(viewingOrderDetails.total_amount)}</span>
            </div>

            <div className="pt-4 flex justify-between gap-2 border-t border-[#E8E2D5]">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D5CCBA] text-xs font-bold text-[#1D3E2E]"
              >
                <Printer className="w-4 h-4" /> Print Invoice
              </button>
              <button
                type="button"
                onClick={() => setViewingOrderDetails(null)}
                className="px-5 py-2 rounded-xl bg-[#1D3E2E] text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD REGISTERED USER */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
              <h2 className="font-serif font-bold text-xl text-[#1D3E2E]">Register New Account</h2>
              <button onClick={() => setShowUserModal(false)} className="text-[#8B7355] hover:text-[#1D3E2E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1D3E2E] uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  placeholder="e.g. Tariq Mahmood"
                  className="w-full rounded-xl bg-[#F9F6F0] border border-[#E8E2D5] px-3.5 py-2.5 text-xs text-[#1D3E2E] focus:outline-none focus:border-[#E06D3B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D3E2E] uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-xl bg-[#F9F6F0] border border-[#E8E2D5] px-3.5 py-2.5 text-xs text-[#1D3E2E] focus:outline-none focus:border-[#E06D3B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D3E2E] uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={e => setNewUserPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-[#F9F6F0] border border-[#E8E2D5] px-3.5 py-2.5 text-xs text-[#1D3E2E] focus:outline-none focus:border-[#E06D3B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D3E2E] uppercase mb-1">Location / Address</label>
                <input
                  type="text"
                  value={newUserLocation}
                  onChange={e => setNewUserLocation(e.target.value)}
                  placeholder="e.g. DHA Phase 5, Lahore"
                  className="w-full rounded-xl bg-[#F9F6F0] border border-[#E8E2D5] px-3.5 py-2.5 text-xs text-[#1D3E2E] focus:outline-none focus:border-[#E06D3B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D3E2E] uppercase mb-1">Account Role</label>
                <select
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value as 'customer' | 'farmer' | 'admin')}
                  className="w-full rounded-xl bg-[#F9F6F0] border border-[#E8E2D5] px-3.5 py-2.5 text-xs text-[#1D3E2E] focus:outline-none"
                >
                  <option value="customer">Customer</option>
                  <option value="farmer">Farmer / Producer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#E8E2D5]">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#D5CCBA] font-bold text-[#8B7355]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1D3E2E] text-white font-bold hover:bg-[#E06D3B] transition"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
