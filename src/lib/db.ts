import { INITIAL_TESTIMONIALS } from './data';
import { DISCOVERY_CATEGORIES, DISCOVERY_FARMER_LIST, DISCOVERY_PRODUCTS } from './discovery-data';
import { Producer, Category, Product, Testimonial, QuizResponse, Order, User, AdminStats } from './types';

type DbResult = [unknown, unknown];
type DbConnection = { ping: () => Promise<void>; release: () => void };
type DbPool = {
  getConnection: () => Promise<DbConnection>;
  query: (sql: string, params?: unknown[]) => Promise<DbResult>;
};

// Seed initial memory DB with orders and users for seamless fallback
const INITIAL_ORDERS: Order[] = [
  {
    id: 'MK-1024',
    user_id: 1,
    customer_name: 'Ayesha Khan',
    customer_email: 'ayesha.k@example.com',
    total_amount: 1280,
    status: 'Packed',
    delivery_date: '2026-09-28',
    shipping_address: 'House 42-B, Street 5, F-7/2, Islamabad',
    items_json: [
      { name: 'Organic Rainbow Carrots', price: 340, quantity: 2 },
      { name: 'Pure Clover Honey', price: 600, quantity: 1 }
    ],
    created_at: '2026-09-25T10:30:00Z'
  },
  {
    id: 'MK-1023',
    user_id: 2,
    customer_name: 'Bilal Raza',
    customer_email: 'bilal.raza@example.com',
    total_amount: 1798,
    status: 'In transit',
    delivery_date: '2026-09-26',
    shipping_address: 'Flat 4A, Green Heights, Gulberg III, Lahore',
    items_json: [
      { name: 'Aged Goat Cheese', price: 899, quantity: 2 }
    ],
    created_at: '2026-09-25T08:15:00Z'
  },
  {
    id: 'MK-1022',
    user_id: 3,
    customer_name: 'Sara Malik',
    customer_email: 'sara.m@example.com',
    total_amount: 940,
    status: 'Ready to ship',
    delivery_date: '2026-09-27',
    shipping_address: 'House 18, Block C, PECHS, Karachi',
    items_json: [
      { name: 'Seeded Country Sourdough', price: 470, quantity: 2 }
    ],
    created_at: '2026-09-24T16:45:00Z'
  },
  {
    id: 'MK-1021',
    user_id: 4,
    customer_name: 'Hamza Ali',
    customer_email: 'hamza.a@example.com',
    total_amount: 2460,
    status: 'Delivered',
    delivery_date: '2026-09-24',
    shipping_address: 'Plot 105, Phase 5, DHA, Lahore',
    items_json: [
      { name: 'Pasture-Raised Pork Chops', price: 1230, quantity: 2 }
    ],
    created_at: '2026-09-23T11:20:00Z'
  },
  {
    id: 'MK-1020',
    user_id: 5,
    customer_name: 'Zainab Fatima',
    customer_email: 'zainab.f@example.com',
    total_amount: 1550,
    status: 'Pending',
    delivery_date: '2026-09-29',
    shipping_address: 'Villa 12, Executive Farms, Chak Shahzad, Islamabad',
    items_json: [
      { name: 'Fresh Farm Milk (1L)', price: 250, quantity: 3 },
      { name: 'Organic Spinach Bundle', price: 160, quantity: 5 }
    ],
    created_at: '2026-09-25T14:10:00Z'
  }
];

const INITIAL_USERS: (User & { password?: string; password_hash?: string })[] = [
  { id: 1, full_name: 'Ayesha Khan', email: 'ayesha.k@example.com', zipcode: '44000', address: 'Islamabad', role: 'customer', password: 'password123', password_hash: 'password123', created_at: '2026-01-15' },
  { id: 2, full_name: 'Bilal Raza', email: 'bilal.raza@example.com', zipcode: '54000', address: 'Lahore', role: 'customer', password: 'password123', password_hash: 'password123', created_at: '2026-02-10' },
  { id: 3, full_name: 'Sara Malik', email: 'sara.m@example.com', zipcode: '75500', address: 'Karachi', role: 'customer', password: 'password123', password_hash: 'password123', created_at: '2026-03-01' },
  { id: 4, full_name: 'Hamza Ali', email: 'hamza.a@example.com', zipcode: '54000', address: 'Lahore', role: 'customer', password: 'password123', password_hash: 'password123', created_at: '2026-04-12' },
  { id: 5, full_name: 'Tariq Mehmood', email: 'tariq.m@example.com', zipcode: '47000', address: 'Rawalpindi', role: 'farmer', password: 'password123', password_hash: 'password123', created_at: '2025-11-20' },
  { id: 6, full_name: 'MarketLink Admin', email: 'admin@marketlink.com', zipcode: '44000', address: 'Headquarters', role: 'admin', password: 'admin123', password_hash: 'admin123', created_at: '2025-01-01' },
];

const INITIAL_QUIZ: QuizResponse[] = [
  { id: 1, zipcode: '54000', dietary_prefs: ['Organic', 'Gluten-free'], shopping_type: 'Weekly Subscription', household_size: 3, created_at: '2026-09-20' },
  { id: 2, zipcode: '44000', dietary_prefs: ['Organic', 'Vegan'], shopping_type: 'Bi-weekly Box', household_size: 2, created_at: '2026-09-21' },
  { id: 3, zipcode: '75500', dietary_prefs: ['Keto', 'Dairy-free'], shopping_type: 'On-Demand', household_size: 4, created_at: '2026-09-22' },
  { id: 4, zipcode: '54000', dietary_prefs: ['Organic'], shopping_type: 'Weekly Subscription', household_size: 1, created_at: '2026-09-24' },
];

// In-Memory Fallback State if MySQL DB is unreachable
const memoryDb: {
  producers: Producer[];
  categories: Category[];
  products: Product[];
  testimonials: Testimonial[];
  quizResponses: QuizResponse[];
  users: User[];
  orders: Order[];
} = {
  producers: DISCOVERY_FARMER_LIST.map((farmer, index) => ({
    id: index + 1,
    name: farmer.farmName,
    slug: farmer.slug,
    location: `${farmer.district}, ${farmer.city}, Pakistan`,
    city: farmer.city,
    district: farmer.district,
    description: farmer.story,
    story: farmer.story,
    image_url: farmer.avatar,
    specialty: farmerProductsSpecialty(farmer.id),
    featured: farmer.verified,
    verified: farmer.verified,
    rating: 4.8,
    total_reviews: 24,
    completed_orders: 142 + index * 18
  })),
  categories: DISCOVERY_CATEGORIES.map((category, index) => ({
    id: index + 1,
    name: category,
    slug: category.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    icon: category,
    product_count: DISCOVERY_PRODUCTS.filter((product) => product.category === category).length,
  })),
  products: DISCOVERY_PRODUCTS.map((product, index) => ({
    id: index + 1,
    name: product.name,
    slug: product.slug,
    producer_id: DISCOVERY_FARMER_LIST.findIndex((farmer) => farmer.id === product.farmer.id) + 1,
    producer_name: product.farmer.farmName,
    category_id: DISCOVERY_CATEGORIES.indexOf(product.category) + 1,
    price: product.price,
    original_price: product.price * 1.15,
    unit: product.unit,
    stock: product.stock,
    image_url: product.image,
    dietary_tags: [product.organic && 'Organic', product.organic && 'Vegan'].filter(Boolean).join(', '),
    description: product.name,
    featured: index < 5,
    in_stock: product.stock > 0,
  })),
  testimonials: [...INITIAL_TESTIMONIALS],
  quizResponses: [...INITIAL_QUIZ],
  users: [...INITIAL_USERS],
  orders: [...INITIAL_ORDERS],
};

function farmerProductsSpecialty(farmerId: string) {
  return DISCOVERY_PRODUCTS.find((product) => product.farmer.id === farmerId)?.category || 'Farm Produce';
}

// Connection pool settings
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD ?? '',
  database: process.env.MYSQL_DATABASE || 'marketlink_db',
  connectTimeout: 400,
};

let pool: DbPool | null = null;
let isMysqlAvailable: boolean | null = null;
let lastDbCheckTime = 0;
const DB_CHECK_COOLDOWN_MS = 30000;

export async function getDbPool() {
  if (pool) return pool;

  const now = Date.now();
  if (isMysqlAvailable === false && now - lastDbCheckTime < DB_CHECK_COOLDOWN_MS) {
    return null;
  }

  lastDbCheckTime = now;
  try {
    const mysql = eval("require('mysql2/promise')") as { createPool: (config: typeof dbConfig) => DbPool };
    const testPool = mysql.createPool(dbConfig);
    const connection = await testPool.getConnection();
    await connection.ping();
    connection.release();
    pool = testPool;
    isMysqlAvailable = true;
    console.log('[MySQL Engine] Connected successfully to MySQL database:', dbConfig.database);
    return pool;
  } catch {
    isMysqlAvailable = false;
    pool = null;
    return null;
  }
}

export async function checkDbStatus() {
  try {
    const db = await getDbPool();
    if (db && isMysqlAvailable) {
      return {
        connected: true,
        mode: 'mysql' as const,
        message: 'MySQL Database Connected',
        host: dbConfig.host,
        database: dbConfig.database
      };
    }
  } catch {
    // fallback
  }

  return {
    connected: false,
    mode: 'mock_fallback' as const,
    message: 'Local Standby Engine (Import schema.sql to connect MySQL)',
    host: dbConfig.host,
    database: dbConfig.database
  };
}

// Data Access Methods with Automatic Fallback

export async function fetchProducers(): Promise<Producer[]> {
  const db = await getDbPool();
  if (db) {
    try {
      const [rows] = await db.query('SELECT * FROM producers ORDER BY featured DESC, id ASC');
      return rows as Producer[];
    } catch (err) {
      console.error('MySQL Query Error (producers):', err);
    }
  }
  return memoryDb.producers;
}

export async function saveProducer(producerData: Partial<Producer>): Promise<Producer> {
  const db = await getDbPool();
  if (db) {
    try {
      if (producerData.id) {
        await db.query(
          'UPDATE producers SET name = ?, location = ?, specialty = ?, description = ?, image_url = ?, verified = ? WHERE id = ?',
          [producerData.name, producerData.location, producerData.specialty, producerData.description || '', producerData.image_url || '', producerData.verified ? 1 : 0, producerData.id]
        );
        return { ...producerData } as Producer;
      } else {
        const slug = (producerData.name || 'producer').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const [result] = await db.query(
          'INSERT INTO producers (name, slug, location, description, specialty, image_url, verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [producerData.name, slug, producerData.location, producerData.description || '', producerData.specialty, producerData.image_url || '', producerData.verified ? 1 : 0]
        );
        const insertId = (result as { insertId: number }).insertId;
        return { id: insertId, ...producerData, slug, featured: false } as Producer;
      }
    } catch (err) {
      console.error('MySQL Query Error (saveProducer):', err);
    }
  }

  if (producerData.id) {
    const index = memoryDb.producers.findIndex(p => p.id === Number(producerData.id));
    if (index !== -1) {
      memoryDb.producers[index] = { ...memoryDb.producers[index], ...producerData };
      return memoryDb.producers[index];
    }
  }
  const newId = memoryDb.producers.length + 1;
  const newProducer: Producer = {
    id: newId,
    name: producerData.name || 'New Producer',
    slug: (producerData.name || 'producer').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    location: producerData.location || 'Pakistan',
    description: producerData.description || 'Farm-fresh local producer.',
    image_url: producerData.image_url || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80',
    specialty: producerData.specialty || 'Organic Produce',
    featured: false,
    verified: Boolean(producerData.verified)
  };
  memoryDb.producers.push(newProducer);
  return newProducer;
}

export async function toggleProducerVerified(id: number): Promise<boolean> {
  const db = await getDbPool();
  if (db) {
    try {
      await db.query('UPDATE producers SET verified = NOT verified WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.error('MySQL Query Error (toggleProducerVerified):', err);
    }
  }

  const producer = memoryDb.producers.find(p => p.id === id);
  if (producer) {
    producer.verified = !producer.verified;
    return true;
  }
  return false;
}

export async function deleteProducer(id: number): Promise<boolean> {
  const db = await getDbPool();
  if (db) {
    try {
      await db.query('DELETE FROM producers WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.error('MySQL Query Error (deleteProducer):', err);
    }
  }

  const index = memoryDb.producers.findIndex(p => p.id === id);
  if (index !== -1) {
    memoryDb.producers.splice(index, 1);
    return true;
  }
  return false;
}

export async function fetchCategories(): Promise<Category[]> {
  const db = await getDbPool();
  if (db) {
    try {
      const [rows] = await db.query('SELECT * FROM categories ORDER BY id ASC');
      return rows as Category[];
    } catch (err) {
      console.error('MySQL Query Error (categories):', err);
    }
  }
  return memoryDb.categories;
}

export async function fetchProducts(categoryId?: number, tag?: string, search?: string): Promise<Product[]> {
  const db = await getDbPool();
  if (db) {
    try {
      let query = `
        SELECT p.*, pr.name as producer_name 
        FROM products p 
        LEFT JOIN producers pr ON p.producer_id = pr.id 
        WHERE 1=1
      `;
      const params: unknown[] = [];

      if (categoryId) {
        query += ' AND p.category_id = ?';
        params.push(categoryId);
      }
      if (tag) {
        query += ' AND p.dietary_tags LIKE ?';
        params.push(`%${tag}%`);
      }
      if (search) {
        query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      query += ' ORDER BY p.featured DESC, p.id ASC';
      const [rows] = await db.query(query, params);
      return (rows as Product[]).map((p) => ({
        ...p,
        price: Number(p.price || 0),
        original_price: p.original_price != null ? Number(p.original_price) : undefined
      }));
    } catch (err) {
      console.error('MySQL Query Error (products):', err);
    }
  }

  return memoryDb.products.filter(p => {
    if (categoryId && p.category_id !== categoryId) return false;
    if (tag && !p.dietary_tags.toLowerCase().includes(tag.toLowerCase())) return false;
    if (search) {
      const term = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(term);
      const matchDesc = p.description.toLowerCase().includes(term);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });
}

export async function saveProduct(productData: Partial<Product>): Promise<Product> {
  const db = await getDbPool();
  if (db) {
    try {
      if (productData.id) {
        await db.query(
          'UPDATE products SET name = ?, price = ?, category_id = ?, producer_id = ?, image_url = ?, description = ?, unit = ?, in_stock = ? WHERE id = ?',
          [
            productData.name,
            productData.price,
            productData.category_id,
            productData.producer_id,
            productData.image_url,
            productData.description || '',
            productData.unit || 'each',
            productData.in_stock ? 1 : 0,
            productData.id
          ]
        );
        return { ...productData } as Product;
      } else {
        const slug = (productData.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const [result] = await db.query(
          'INSERT INTO products (name, slug, price, category_id, producer_id, image_url, description, unit, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            productData.name,
            slug,
            productData.price,
            productData.category_id,
            productData.producer_id,
            productData.image_url,
            productData.description || '',
            productData.unit || 'each',
            productData.in_stock ? 1 : 0
          ]
        );
        const insertId = (result as { insertId: number }).insertId;
        return { id: insertId, ...productData, slug } as Product;
      }
    } catch (err) {
      console.error('MySQL Query Error (saveProduct):', err);
    }
  }

  if (productData.id) {
    const index = memoryDb.products.findIndex(p => p.id === Number(productData.id));
    if (index !== -1) {
      memoryDb.products[index] = { ...memoryDb.products[index], ...productData };
      return memoryDb.products[index];
    }
  }

  const newId = memoryDb.products.length + 1;
  const newProduct: Product = {
    id: newId,
    name: productData.name || 'New Product',
    slug: (productData.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    price: productData.price || 100,
    unit: productData.unit || 'kg',
    category_id: productData.category_id || 1,
    producer_id: productData.producer_id || 1,
    image_url: productData.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
    dietary_tags: 'Organic',
    description: productData.description || 'Farm-fresh organic item.',
    featured: false,
    in_stock: productData.in_stock !== false
  };
  memoryDb.products.push(newProduct);
  return newProduct;
}

export async function deleteProduct(id: number): Promise<boolean> {
  const db = await getDbPool();
  if (db) {
    try {
      await db.query('DELETE FROM products WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.error('MySQL Query Error (deleteProduct):', err);
    }
  }

  const index = memoryDb.products.findIndex(p => p.id === id);
  if (index !== -1) {
    memoryDb.products.splice(index, 1);
    return true;
  }
  return false;
}

export async function fetchOrders(): Promise<Order[]> {
  const db = await getDbPool();
  if (db) {
    try {
      const [rows] = await db.query(`
        SELECT o.*, u.full_name as customer_name, u.email as customer_email, u.address as shipping_address
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC, o.id DESC
      `);
      return (rows as Order[]).map(r => ({
        ...r,
        items_json: typeof r.items_json === 'string' ? JSON.parse(r.items_json) : r.items_json
      }));
    } catch (err) {
      console.error('MySQL Query Error (fetchOrders):', err);
    }
  }
  return memoryDb.orders as Order[];
}

export async function saveOrder(orderData: { user_id?: number; total: number; items: unknown[]; deliveryDate: string; shipping_address?: string }) {
  const db = await getDbPool();
  if (db) {
    try {
      const [result] = await db.query(
        'INSERT INTO orders (user_id, total_amount, status, delivery_date, shipping_address, items_json) VALUES (?, ?, ?, ?, ?, ?)',
        [
          orderData.user_id || null,
          orderData.total,
          'Pending',
          orderData.deliveryDate,
          orderData.shipping_address || 'Standard MarketLink Delivery Route',
          JSON.stringify(orderData.items)
        ]
      );
      return result;
    } catch (err) {
      console.error('MySQL Query Error (orders):', err);
    }
  }

  const newOrder: Order = {
    id: `MK-${1025 + memoryDb.orders.length}`,
    user_id: orderData.user_id || 1,
    customer_name: 'Walk-in Customer',
    customer_email: 'customer@marketlink.com',
    total_amount: orderData.total,
    status: 'Pending',
    delivery_date: orderData.deliveryDate,
    shipping_address: orderData.shipping_address || 'Standard MarketLink Delivery Route',
    items_json: orderData.items as any,
    created_at: new Date().toISOString()
  };
  memoryDb.orders.unshift(newOrder);
  return { insertId: newOrder.id };
}

export async function updateOrderStatus(id: string | number, status: Order['status']): Promise<boolean> {
  const db = await getDbPool();
  if (db) {
    try {
      await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
      return true;
    } catch (err) {
      console.error('MySQL Query Error (updateOrderStatus):', err);
    }
  }

  const order = (memoryDb.orders as Order[]).find(o => String(o.id) === String(id));
  if (order) {
    order.status = status;
    return true;
  }
  return false;
}

export async function deleteOrder(id: string | number): Promise<boolean> {
  const db = await getDbPool();
  if (db) {
    try {
      await db.query('DELETE FROM orders WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.error('MySQL Query Error (deleteOrder):', err);
    }
  }

  const index = (memoryDb.orders as Order[]).findIndex(o => String(o.id) === String(id));
  if (index !== -1) {
    memoryDb.orders.splice(index, 1);
    return true;
  }
  return false;
}

export async function fetchUsers(): Promise<User[]> {
  const db = await getDbPool();
  if (db) {
    try {
      const [rows] = await db.query(`
        SELECT u.id, u.email, u.full_name, u.zipcode, u.address, u.created_at, COALESCE(ur.role, 'customer') as role 
        FROM users u 
        LEFT JOIN user_roles ur ON u.id = ur.user_id 
        ORDER BY u.id DESC
      `);
      return rows as User[];
    } catch (err) {
      console.error('MySQL Query Error (fetchUsers):', err);
    }
  }
  return [...memoryDb.users].reverse() as User[];
}

export async function findUserByEmail(email: string): Promise<(User & { password?: string; password_hash?: string }) | null> {
  const cleanEmail = email.trim().toLowerCase();
  const db = await getDbPool();
  if (db) {
    try {
      const [rows] = await db.query(
        `SELECT u.*, ur.role 
         FROM users u 
         LEFT JOIN user_roles ur ON u.id = ur.user_id 
         WHERE LOWER(u.email) = ? 
         LIMIT 1`,
        [cleanEmail]
      );
      const userList = rows as (User & { password_hash?: string; password?: string })[];
      if (userList.length > 0) {
        return userList[0];
      }
    } catch (err) {
      console.error('MySQL Query Error (findUserByEmail):', err);
    }
  }

  const user = (memoryDb.users as (User & { password?: string; password_hash?: string })[]).find(
    (u) => u.email.toLowerCase() === cleanEmail
  );
  return user || null;
}

export async function saveUser(userData: {
  email: string;
  password: string;
  full_name: string;
  address?: string;
  zipcode?: string;
  role?: 'customer' | 'farmer' | 'admin';
}): Promise<User> {
  const cleanEmail = userData.email.trim().toLowerCase();
  const existing = await findUserByEmail(cleanEmail);
  if (existing) {
    throw new Error('An account with this email already exists');
  }

  const role = userData.role || 'customer';
  const zipcode = userData.zipcode || '75500';
  const db = await getDbPool();
  if (db) {
    try {
      const [result] = await db.query(
        'INSERT INTO users (email, password_hash, full_name, address, zipcode) VALUES (?, ?, ?, ?, ?)',
        [cleanEmail, userData.password, userData.full_name, userData.address || '', zipcode]
      );
      const insertId = (result as { insertId: number }).insertId;
      try {
        await db.query('INSERT INTO user_roles (user_id, role) VALUES (?, ?)', [insertId, role]);
      } catch {
        // ignore user_roles error if table missing
      }

      return {
        id: insertId,
        email: cleanEmail,
        full_name: userData.full_name,
        address: userData.address || '',
        zipcode,
        role
      };
    } catch (err) {
      console.error('MySQL Query Error (saveUser):', err);
    }
  }

  const newId = memoryDb.users.length + 1;
  const newUser: User & { password?: string; password_hash?: string } = {
    id: newId,
    email: cleanEmail,
    password: userData.password,
    password_hash: userData.password,
    full_name: userData.full_name,
    address: userData.address || 'Clifton, Karachi',
    role,
    created_at: new Date().toISOString()
  };
  memoryDb.users.push(newUser);

  return {
    id: newUser.id,
    email: newUser.email,
    full_name: newUser.full_name,
    address: newUser.address,
    role: newUser.role
  };
}

export async function deleteUser(id: number): Promise<boolean> {
  const db = await getDbPool();
  if (db) {
    try {
      await db.query('DELETE FROM users WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.error('MySQL Query Error (deleteUser):', err);
    }
  }

  const index = (memoryDb.users as User[]).findIndex(u => u.id === id);
  if (index !== -1) {
    memoryDb.users.splice(index, 1);
    return true;
  }
  return false;
}

export async function fetchQuizResponses(): Promise<QuizResponse[]> {
  const db = await getDbPool();
  if (db) {
    try {
      const [rows] = await db.query('SELECT * FROM quiz_responses ORDER BY created_at DESC');
      return (rows as any[]).map(r => ({
        ...r,
        dietary_prefs: typeof r.dietary_prefs === 'string' ? JSON.parse(r.dietary_prefs) : r.dietary_prefs
      }));
    } catch (err) {
      console.error('MySQL Query Error (fetchQuizResponses):', err);
    }
  }
  return memoryDb.quizResponses;
}

export async function saveQuizResponse(quizData: QuizResponse) {
  const db = await getDbPool();
  if (db) {
    try {
      const [result] = await db.query(
        'INSERT INTO quiz_responses (zipcode, dietary_prefs, shopping_type, household_size) VALUES (?, ?, ?, ?)',
        [
          quizData.zipcode,
          JSON.stringify(quizData.dietary_prefs),
          quizData.shopping_type,
          quizData.household_size
        ]
      );
      return result;
    } catch (err) {
      console.error('MySQL Query Error (quiz_responses):', err);
    }
  }

  const newQuiz = { id: memoryDb.quizResponses.length + 1, ...quizData, created_at: new Date().toISOString() };
  memoryDb.quizResponses.unshift(newQuiz);
  return { insertedId: newQuiz.id };
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const db = await getDbPool();
  if (db) {
    try {
      const [rows] = await db.query('SELECT * FROM testimonials ORDER BY id ASC');
      return rows as Testimonial[];
    } catch (err) {
      console.error('MySQL Query Error (testimonials):', err);
    }
  }
  return memoryDb.testimonials;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const [orders, products, producers, users] = await Promise.all([
    fetchOrders(),
    fetchProducts(),
    fetchProducers(),
    fetchUsers(),
  ]);

  const grossRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const ordersToday = orders.filter(o => o.status !== 'Cancelled').length;
  const activeShoppers = users.length > 0 ? users.length * 400 + 80 : 2480;
  const lowStockItems = products.filter(p => !p.in_stock || (p.stock && p.stock < 10)).length;
  const verifiedProducersCount = producers.filter(p => p.verified).length;

  return {
    grossRevenue,
    ordersToday,
    activeShoppers,
    lowStockItems,
    totalProducers: producers.length,
    totalProducts: products.length,
    verifiedProducersCount
  };
}

