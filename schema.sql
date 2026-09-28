-- MarketLink farm-to-table grocery database schema
-- Run this script in your MySQL server: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS marketlink_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE marketlink_db;

-- 1. Producers Table
CREATE TABLE IF NOT EXISTS producers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  location VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  district VARCHAR(100),
  description TEXT,
  story TEXT,
  image_url VARCHAR(500),
  specialty VARCHAR(255),
  featured BOOLEAN DEFAULT FALSE,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  rating DECIMAL(2, 1) NOT NULL DEFAULT 0,
  total_reviews INT UNSIGNED NOT NULL DEFAULT 0,
  distance_km DECIMAL(6, 2) NOT NULL DEFAULT 0,
  pickup_available BOOLEAN NOT NULL DEFAULT FALSE,
  completed_orders INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(100),
  product_count INT DEFAULT 0
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  producer_id INT,
  category_id INT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'each',
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  rating DECIMAL(2, 1) NOT NULL DEFAULT 0,
  reviews_count INT UNSIGNED NOT NULL DEFAULT 0,
  image_url VARCHAR(500),
  dietary_tags VARCHAR(255), -- e.g. "Organic, Gluten-free, Vegan"
  description TEXT,
  organic BOOLEAN NOT NULL DEFAULT FALSE,
  same_day_pickup BOOLEAN NOT NULL DEFAULT FALSE,
  preorder_available BOOLEAN NOT NULL DEFAULT FALSE,
  bulk_deal BOOLEAN NOT NULL DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (producer_id) REFERENCES producers(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 4. Quiz Responses Table
CREATE TABLE IF NOT EXISTS quiz_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  zipcode VARCHAR(20) NOT NULL,
  dietary_prefs JSON,
  shopping_type VARCHAR(100),
  household_size INT DEFAULT 2,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  zipcode VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  delivery_date DATE,
  shipping_address TEXT NULL,
  items_json JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 7. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  author_name VARCHAR(100) NOT NULL,
  author_role VARCHAR(100) DEFAULT 'MarketLink member',
  stars INT DEFAULT 5,
  quote TEXT NOT NULL
);

-- Add discovery fields to databases created with an older version of this schema.
DELIMITER $$
DROP PROCEDURE IF EXISTS migrate_discovery_schema$$
CREATE PROCEDURE migrate_discovery_schema()
BEGIN
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'producers' AND COLUMN_NAME = 'city') THEN
    ALTER TABLE producers ADD COLUMN city VARCHAR(100) AFTER location;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'producers' AND COLUMN_NAME = 'district') THEN
    ALTER TABLE producers ADD COLUMN district VARCHAR(100) AFTER city;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'producers' AND COLUMN_NAME = 'story') THEN
    ALTER TABLE producers ADD COLUMN story TEXT AFTER description;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'producers' AND COLUMN_NAME = 'verified') THEN
    ALTER TABLE producers ADD COLUMN verified BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'producers' AND COLUMN_NAME = 'rating') THEN
    ALTER TABLE producers ADD COLUMN rating DECIMAL(2, 1) NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'producers' AND COLUMN_NAME = 'total_reviews') THEN
    ALTER TABLE producers ADD COLUMN total_reviews INT UNSIGNED NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'producers' AND COLUMN_NAME = 'distance_km') THEN
    ALTER TABLE producers ADD COLUMN distance_km DECIMAL(6, 2) NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'producers' AND COLUMN_NAME = 'pickup_available') THEN
    ALTER TABLE producers ADD COLUMN pickup_available BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'producers' AND COLUMN_NAME = 'completed_orders') THEN
    ALTER TABLE producers ADD COLUMN completed_orders INT UNSIGNED NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'original_price') THEN
    ALTER TABLE products ADD COLUMN original_price DECIMAL(10, 2) NOT NULL DEFAULT 0 AFTER price;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'stock') THEN
    ALTER TABLE products ADD COLUMN stock INT UNSIGNED NOT NULL DEFAULT 0 AFTER unit;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'rating') THEN
    ALTER TABLE products ADD COLUMN rating DECIMAL(2, 1) NOT NULL DEFAULT 0 AFTER stock;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'reviews_count') THEN
    ALTER TABLE products ADD COLUMN reviews_count INT UNSIGNED NOT NULL DEFAULT 0 AFTER rating;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'organic') THEN
    ALTER TABLE products ADD COLUMN organic BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'same_day_pickup') THEN
    ALTER TABLE products ADD COLUMN same_day_pickup BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'preorder_available') THEN
    ALTER TABLE products ADD COLUMN preorder_available BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'bulk_deal') THEN
    ALTER TABLE products ADD COLUMN bulk_deal BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;

  UPDATE products SET original_price = price WHERE original_price = 0;
  UPDATE products SET stock = 12 WHERE stock = 0 AND in_stock = TRUE;
END$$
CALL migrate_discovery_schema()$$
DROP PROCEDURE migrate_discovery_schema$$
DELIMITER ;

-- Dashboard and pre-order model. Keep the legacy discovery columns above intact
-- while adding normalized records for authenticated customer/vendor workflows.
DELIMITER $$
DROP PROCEDURE IF EXISTS migrate_dashboard_columns$$
CREATE PROCEDURE migrate_dashboard_columns()
BEGIN
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'phone') THEN
    ALTER TABLE users ADD COLUMN phone VARCHAR(40) NULL AFTER full_name;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'account_status') THEN
    ALTER TABLE users ADD COLUMN account_status ENUM('active', 'deactivated', 'banned') NOT NULL DEFAULT 'active' AFTER address;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'email_verified_at') THEN
    ALTER TABLE users ADD COLUMN email_verified_at DATETIME NULL AFTER account_status;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'stock_reserved') THEN
    ALTER TABLE products ADD COLUMN stock_reserved INT UNSIGNED NOT NULL DEFAULT 0 AFTER stock;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'currency') THEN
    ALTER TABLE products ADD COLUMN currency CHAR(3) NOT NULL DEFAULT 'PKR' AFTER price;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'listing_status') THEN
    ALTER TABLE products ADD COLUMN listing_status ENUM('draft', 'pending_review', 'published', 'rejected', 'taken_down') NOT NULL DEFAULT 'published' AFTER in_stock;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'shipping_address') THEN
    ALTER TABLE orders ADD COLUMN shipping_address TEXT NULL AFTER delivery_date;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'lifecycle_status') THEN
    ALTER TABLE orders ADD COLUMN lifecycle_status ENUM('placed', 'accepted', 'ready_for_pickup', 'completed', 'cancelled', 'partially_cancelled') NOT NULL DEFAULT 'placed' AFTER status;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'payment_status') THEN
    ALTER TABLE orders ADD COLUMN payment_status ENUM('not_required', 'pending', 'authorized', 'paid', 'failed', 'refunded', 'partially_refunded') NOT NULL DEFAULT 'pending' AFTER lifecycle_status;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'currency') THEN
    ALTER TABLE orders ADD COLUMN currency CHAR(3) NOT NULL DEFAULT 'PKR' AFTER total_amount;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'placed_at') THEN
    ALTER TABLE orders ADD COLUMN placed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER delivery_date;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'updated_at') THEN
    ALTER TABLE orders ADD COLUMN updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER placed_at;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'idempotency_key') THEN
    ALTER TABLE orders ADD COLUMN idempotency_key VARCHAR(128) NULL AFTER updated_at;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'orders' AND INDEX_NAME = 'orders_user_idempotency_unique') THEN
    ALTER TABLE orders ADD UNIQUE KEY orders_user_idempotency_unique (user_id, idempotency_key);
  END IF;
END$$
CALL migrate_dashboard_columns()$$
DROP PROCEDURE migrate_dashboard_columns$$
DELIMITER ;

UPDATE orders o
JOIN users u ON u.id = o.user_id
SET o.shipping_address = u.address
WHERE (o.shipping_address IS NULL OR o.shipping_address = '') AND u.address IS NOT NULL AND u.address <> '';

CREATE TABLE IF NOT EXISTS user_roles (
  user_id INT NOT NULL,
  role ENUM('customer', 'farmer', 'admin') NOT NULL,
  granted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash BINARY(32) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at DATETIME NULL,
  user_agent VARCHAR(500) NULL,
  ip_hash BINARY(32) NULL,
  KEY auth_sessions_user_expiry_idx (user_id, expires_at),
  CONSTRAINT fk_auth_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS farmer_profiles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  producer_id INT NOT NULL UNIQUE,
  user_id INT NULL UNIQUE,
  legal_name VARCHAR(255) NOT NULL,
  public_name VARCHAR(255) NOT NULL,
  approval_status ENUM('draft', 'pending_review', 'approved', 'rejected', 'suspended') NOT NULL DEFAULT 'draft',
  reviewed_by INT NULL,
  reviewed_at DATETIME NULL,
  review_note TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_farmer_profiles_producer FOREIGN KEY (producer_id) REFERENCES producers(id) ON DELETE RESTRICT,
  CONSTRAINT fk_farmer_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_farmer_profiles_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS farmer_documents (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  farmer_id BIGINT UNSIGNED NOT NULL,
  object_key VARCHAR(500) NOT NULL,
  document_type VARCHAR(80) NOT NULL,
  review_status ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
  reviewed_by INT NULL,
  reviewed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY farmer_documents_review_idx (review_status, created_at),
  CONSTRAINT fk_farmer_documents_farmer FOREIGN KEY (farmer_id) REFERENCES farmer_profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_farmer_documents_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS markets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100) NULL,
  country_code CHAR(2) NOT NULL DEFAULT 'PK',
  timezone VARCHAR(80) NOT NULL DEFAULT 'Asia/Karachi',
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  market_status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY markets_city_status_idx (city, market_status),
  KEY markets_coordinates_idx (latitude, longitude)
);

CREATE TABLE IF NOT EXISTS stalls (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  producer_id INT NOT NULL,
  market_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(180) NOT NULL,
  description TEXT NULL,
  latitude DECIMAL(10, 7) NULL,
  longitude DECIMAL(10, 7) NULL,
  stall_status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY stalls_producer_market_unique (producer_id, market_id),
  KEY stalls_market_status_idx (market_id, stall_status),
  CONSTRAINT fk_stalls_producer FOREIGN KEY (producer_id) REFERENCES producers(id) ON DELETE RESTRICT,
  CONSTRAINT fk_stalls_market FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS market_hours (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  market_id BIGINT UNSIGNED NOT NULL,
  weekday TINYINT UNSIGNED NOT NULL,
  opens_at TIME NOT NULL,
  closes_at TIME NOT NULL,
  CHECK (weekday BETWEEN 0 AND 6),
  CHECK (opens_at < closes_at),
  UNIQUE KEY market_hours_unique (market_id, weekday, opens_at),
  CONSTRAINT fk_market_hours_market FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS stall_hours (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  stall_id BIGINT UNSIGNED NOT NULL,
  weekday TINYINT UNSIGNED NOT NULL,
  opens_at TIME NOT NULL,
  closes_at TIME NOT NULL,
  CHECK (weekday BETWEEN 0 AND 6),
  CHECK (opens_at < closes_at),
  UNIQUE KEY stall_hours_unique (stall_id, weekday, opens_at),
  CONSTRAINT fk_stall_hours_stall FOREIGN KEY (stall_id) REFERENCES stalls(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pickup_slots (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  stall_id BIGINT UNSIGNED NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  order_cutoff_at DATETIME NOT NULL,
  acceptance_deadline_at DATETIME NOT NULL,
  capacity INT UNSIGNED NOT NULL,
  reserved_count INT UNSIGNED NOT NULL DEFAULT 0,
  slot_status ENUM('open', 'closed', 'cancelled') NOT NULL DEFAULT 'open',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (starts_at < ends_at),
  CHECK (order_cutoff_at <= starts_at),
  CHECK (acceptance_deadline_at <= starts_at),
  CHECK (capacity > 0),
  CHECK (reserved_count <= capacity),
  UNIQUE KEY pickup_slots_stall_time_unique (stall_id, starts_at, ends_at),
  KEY pickup_slots_available_idx (stall_id, slot_status, starts_at),
  CONSTRAINT fk_pickup_slots_stall FOREIGN KEY (stall_id) REFERENCES stalls(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS carts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  cart_status ENUM('active', 'checked_out', 'abandoned') NOT NULL DEFAULT 'active',
  active_customer_id INT GENERATED ALWAYS AS (CASE WHEN cart_status = 'active' THEN customer_id ELSE NULL END) STORED,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY carts_one_active_per_customer (active_customer_id),
  CONSTRAINT fk_carts_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cart_id BIGINT UNSIGNED NOT NULL,
  product_id INT NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (quantity > 0),
  UNIQUE KEY cart_items_product_unique (cart_id, product_id),
  CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS favorites (
  customer_id INT NOT NULL,
  producer_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (customer_id, producer_id),
  CONSTRAINT fk_favorites_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_favorites_producer FOREIGN KEY (producer_id) REFERENCES producers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vendor_orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  stall_id BIGINT UNSIGNED NOT NULL,
  pickup_slot_id BIGINT UNSIGNED NOT NULL,
  vendor_status ENUM('awaiting_acceptance', 'accepted', 'ready_for_pickup', 'completed', 'rejected', 'cancelled', 'expired') NOT NULL DEFAULT 'awaiting_acceptance',
  subtotal DECIMAL(10, 2) NOT NULL,
  acceptance_deadline_at DATETIME NOT NULL,
  accepted_at DATETIME NULL,
  ready_at DATETIME NULL,
  completed_at DATETIME NULL,
  cancelled_at DATETIME NULL,
  cancellation_reason VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY vendor_orders_order_stall_unique (order_id, stall_id),
  KEY vendor_orders_queue_idx (stall_id, vendor_status, created_at),
  KEY vendor_orders_deadline_idx (vendor_status, acceptance_deadline_at),
  CONSTRAINT fk_vendor_orders_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
  CONSTRAINT fk_vendor_orders_stall FOREIGN KEY (stall_id) REFERENCES stalls(id) ON DELETE RESTRICT,
  CONSTRAINT fk_vendor_orders_slot FOREIGN KEY (pickup_slot_id) REFERENCES pickup_slots(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  vendor_order_id BIGINT UNSIGNED NOT NULL,
  product_id INT NULL,
  product_name_snapshot VARCHAR(255) NOT NULL,
  unit_snapshot VARCHAR(50) NOT NULL,
  unit_price_snapshot DECIMAL(10, 2) NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  line_total DECIMAL(10, 2) NOT NULL,
  CHECK (unit_price_snapshot >= 0),
  CHECK (quantity > 0),
  CHECK (line_total >= 0),
  KEY order_items_vendor_order_idx (vendor_order_id),
  CONSTRAINT fk_order_items_vendor_order FOREIGN KEY (vendor_order_id) REFERENCES vendor_orders(id) ON DELETE RESTRICT,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS inventory_reservations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_item_id BIGINT UNSIGNED NOT NULL UNIQUE,
  product_id INT NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  reservation_status ENUM('active', 'committed', 'released', 'expired') NOT NULL DEFAULT 'active',
  expires_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (quantity > 0),
  KEY inventory_reservations_expiry_idx (reservation_status, expires_at),
  CONSTRAINT fk_inventory_reservations_item FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE RESTRICT,
  CONSTRAINT fk_inventory_reservations_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  provider VARCHAR(80) NOT NULL,
  provider_reference VARCHAR(255) NULL,
  payment_status ENUM('not_required', 'pending', 'authorized', 'paid', 'failed', 'refunded', 'partially_refunded') NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'PKR',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY payments_provider_reference_unique (provider, provider_reference),
  CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS reviews (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  vendor_order_id BIGINT UNSIGNED NOT NULL UNIQUE,
  rating TINYINT UNSIGNED NOT NULL,
  body TEXT NULL,
  moderation_status ENUM('visible', 'hidden', 'removed') NOT NULL DEFAULT 'visible',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT fk_reviews_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_reviews_vendor_order FOREIGN KEY (vendor_order_id) REFERENCES vendor_orders(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS review_replies (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  review_id BIGINT UNSIGNED NOT NULL UNIQUE,
  producer_id INT NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_review_replies_review FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_replies_producer FOREIGN KEY (producer_id) REFERENCES producers(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS inventory_movements (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  actor_user_id INT NULL,
  quantity_delta INT NOT NULL,
  reason VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY inventory_movements_product_time_idx (product_id, created_at),
  CONSTRAINT fk_inventory_movements_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  CONSTRAINT fk_inventory_movements_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_user_id INT NULL,
  action VARCHAR(120) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id VARCHAR(100) NOT NULL,
  reason TEXT NULL,
  metadata JSON NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY audit_logs_resource_idx (resource_type, resource_id, created_at),
  KEY audit_logs_actor_idx (actor_user_id, created_at),
  CONSTRAINT fk_audit_logs_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS outbox_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_type VARCHAR(120) NOT NULL,
  aggregate_type VARCHAR(80) NOT NULL,
  aggregate_id VARCHAR(100) NOT NULL,
  payload JSON NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at DATETIME NULL,
  attempts INT UNSIGNED NOT NULL DEFAULT 0,
  KEY outbox_pending_idx (processed_at, id)
);
