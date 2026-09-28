export interface Producer {
  id: number;
  name: string;
  slug: string;
  location: string;
  city?: string;
  district?: string;
  description: string;
  story?: string;
  image_url: string;
  specialty: string;
  featured: boolean;
  verified?: boolean;
  rating?: number;
  total_reviews?: number;
  completed_orders?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  product_count: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  producer_id: number;
  producer_name?: string;
  category_id: number;
  price: number;
  original_price?: number;
  unit: string;
  stock?: number;
  image_url: string;
  dietary_tags: string; // Comma-separated list like "Organic, Vegan"
  description: string;
  featured: boolean;
  in_stock?: boolean;
}

export interface QuizResponse {
  id?: number;
  zipcode: string;
  dietary_prefs: string[];
  shopping_type: string;
  household_size: number;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id?: number;
  name?: string;
  price?: number;
  quantity?: number;
  product?: Product;
}

export interface Order {
  id: number | string;
  user_id?: number;
  customer_name?: string;
  customer_email?: string;
  total_amount: number;
  status: 'Pending' | 'Packed' | 'In transit' | 'Ready to ship' | 'Delivered' | 'Cancelled';
  delivery_date: string;
  payment_method?: string;
  items_json: OrderItem[] | string;
  farmer_can_update_status?: boolean;
  shipping_address?: string;
  created_at?: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  zipcode?: string;
  address?: string;
  role?: 'customer' | 'farmer' | 'admin';
  subscriptionActive?: boolean;
  created_at?: string;
}

export interface Testimonial {
  id: number;
  author_name: string;
  author_role: string;
  stars: number;
  quote: string;
}

export interface DbStatus {
  connected: boolean;
  mode: 'mysql' | 'mock_fallback';
  message: string;
  host?: string;
  database?: string;
}

export interface AdminStats {
  grossRevenue: number;
  ordersToday: number;
  activeShoppers: number;
  lowStockItems: number;
  totalProducers: number;
  totalProducts: number;
  verifiedProducersCount: number;
}
