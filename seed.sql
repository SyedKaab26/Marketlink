-- MarketLink farm-to-table grocery database seed script
-- Run this script in your MySQL server: mysql -u root -p marketlink_db < seed.sql

USE marketlink_db;

-- Category ids map to the discovery page filters.
INSERT INTO categories (id, name, slug, icon, product_count) VALUES
(1, 'Organic Vegetables', 'organic-vegetables', 'Vegetable', 13),
(2, 'Fresh Fruits', 'fresh-fruits', 'Fruit', 13),
(3, 'Dairy & Poultry', 'dairy-poultry', 'Dairy', 13),
(4, 'Grains & Staples', 'grains-staples', 'Grain', 13),
(5, 'Seeds & Herbs', 'seeds-herbs', 'Herb', 13)
ON DUPLICATE KEY UPDATE
	name = VALUES(name), slug = VALUES(slug), icon = VALUES(icon), product_count = VALUES(product_count);

-- Farmer profiles used by the discovery catalog.
INSERT INTO producers (id, name, slug, location, city, district, description, story, image_url, specialty, featured, verified, rating, total_reviews, distance_km, pickup_available, completed_orders) VALUES
(1, 'Noor Baloch', 'noor-family-farm', 'Gadap, Karachi, Pakistan', 'Karachi', 'Gadap', 'Seasonal vegetables grown with compost-rich soil and careful water use.', 'A third-generation family farm growing seasonal vegetables with compost-rich soil and careful water use.', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=160&q=80', 'Organic Vegetables', TRUE, TRUE, 4.9, 186, 8, TRUE, 1240),
(2, 'Ali Raza', 'malir-green-acres', 'Malir, Karachi, Pakistan', 'Karachi', 'Malir', 'Fresh field produce harvested early each morning.', 'We harvest early each morning and bring our produce straight from the Malir fields to your table.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80', 'Vegetables & Grains', TRUE, TRUE, 4.8, 93, 6, TRUE, 710),
(3, 'Sana Ahmed', 'sindh-orchard-coop', 'Tando Allahyar, Hyderabad, Pakistan', 'Hyderabad', 'Tando Allahyar', 'Naturally ripened seasonal fruit from local orchard families.', 'Our cooperative brings together small orchard families for naturally ripened fruit and fair prices.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80', 'Fresh Fruits', TRUE, TRUE, 4.9, 241, 31, FALSE, 1860),
(4, 'Hamza Khan', 'potohar-dairy-fields', 'Raiwind, Lahore, Pakistan', 'Lahore', 'Raiwind', 'Family-run dairy and grain farm focused on animal welfare and quality.', 'A small family-run dairy and grain farm focused on clean feed, animal welfare and dependable quality.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80', 'Dairy & Staples', TRUE, TRUE, 4.7, 118, 42, TRUE, 960),
(5, 'Maryam Bibi', 'sargodha-citrus-grove', 'Bhalwal, Sargodha, Pakistan', 'Sargodha', 'Bhalwal', 'Citrus and seasonal orchard fruit picked at peak ripeness.', 'Our kinnow and citrus are picked at peak ripeness from orchards tended by our family for decades.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80', 'Citrus & Fruits', FALSE, TRUE, 4.8, 157, 56, FALSE, 1130),
(6, 'Farah Iqbal', 'green-basket-collective', 'Gadap, Karachi, Pakistan', 'Karachi', 'Gadap', 'Neighborhood collective sharing herbs, leafy greens and kitchen garden produce.', 'A neighborhood growing collective sharing herbs, leafy greens and kitchen garden favorites.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80', 'Seeds, Herbs & Greens', FALSE, FALSE, 4.6, 64, 14, TRUE, 430)
ON DUPLICATE KEY UPDATE
	name = VALUES(name), slug = VALUES(slug), location = VALUES(location), city = VALUES(city),
	district = VALUES(district), description = VALUES(description), story = VALUES(story),
	image_url = VALUES(image_url), specialty = VALUES(specialty), featured = VALUES(featured),
	verified = VALUES(verified), rating = VALUES(rating), total_reviews = VALUES(total_reviews),
	distance_km = VALUES(distance_km), pickup_available = VALUES(pickup_available), completed_orders = VALUES(completed_orders);

-- Product inventory: PKR prices, available stock, ratings, and discovery perks.
INSERT INTO products (id, name, slug, producer_id, category_id, price, original_price, unit, stock, rating, reviews_count, image_url, dietary_tags, description, organic, same_day_pickup, preorder_available, bulk_deal, featured, in_stock, created_at) VALUES
(1, 'Vine-Ripened Red Tomatoes', 'vine-ripened-tomatoes', 1, 1, 180, 220, 'kg', 34, 4.8, 86, 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Juicy tomatoes picked ripe from the vine.', TRUE, TRUE, FALSE, TRUE, TRUE, TRUE, '2026-09-24 07:00:00'),
(2, 'Tender Baby Spinach', 'baby-spinach', 2, 1, 95, 120, 'bunch', 8, 4.7, 41, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Tender leafy greens harvested fresh.', TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-23 07:00:00'),
(3, 'Sweet Farm Carrots', 'sweet-farm-carrots', 1, 1, 140, 160, 'kg', 52, 4.9, 103, 'https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Naturally sweet carrots grown in healthy soil.', TRUE, FALSE, TRUE, TRUE, TRUE, TRUE, '2026-09-22 07:00:00'),
(4, 'Crisp Green Cucumbers', 'green-cucumbers', 6, 1, 110, 125, 'kg', 6, 4.6, 28, 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=720&q=85', 'Vegan', 'Cool, crisp cucumbers picked to order.', FALSE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-24 08:00:00'),
(5, 'Chaunsa Mangoes, Sweet & Juicy', 'chaunsa-mangoes', 3, 2, 320, 380, 'kg', 24, 4.9, 134, 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Tree-ripened Chaunsa mangoes from Sindh orchards.', TRUE, FALSE, TRUE, TRUE, TRUE, TRUE, '2026-09-19 07:00:00'),
(6, 'Sargodha Kinnow Oranges', 'sargodha-kinnow', 5, 2, 210, 250, 'dozen', 45, 4.8, 76, 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=720&q=85', 'Vegan', 'Bright, juicy kinnow citrus from Sargodha.', FALSE, FALSE, TRUE, TRUE, TRUE, TRUE, '2026-09-20 07:00:00'),
(7, 'Fresh Picked Strawberries', 'fresh-strawberries', 6, 2, 450, 520, 'box', 5, 4.7, 53, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Small-batch berries picked at peak sweetness.', TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-24 06:30:00'),
(8, 'Pink Guava from the Orchard', 'pink-guava', 3, 2, 170, 190, 'kg', 18, 4.5, 34, 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Fragrant pink guavas from family orchards.', TRUE, FALSE, FALSE, FALSE, FALSE, TRUE, '2026-09-18 07:00:00'),
(9, 'Free-Range Desi Eggs', 'free-range-desi-eggs', 4, 3, 390, 440, 'dozen', 19, 4.9, 121, 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=720&q=85', 'Farm fresh', 'Desi eggs from free-ranging hens.', FALSE, TRUE, FALSE, TRUE, TRUE, TRUE, '2026-09-21 07:00:00'),
(10, 'Fresh Full-Cream Farm Milk', 'farm-fresh-milk', 4, 3, 240, 270, 'litre', 7, 4.8, 92, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=720&q=85', 'Organic', 'Fresh full-cream milk from a family dairy.', TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, '2026-09-24 06:00:00'),
(11, 'Traditional Creamy Dahi', 'traditional-dahi', 4, 3, 180, 200, '500 g', 22, 4.6, 47, 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=720&q=85', 'Farm fresh', 'Small-batch dahi cultured the traditional way.', FALSE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-22 07:00:00'),
(12, 'Aromatic Super Kernel Basmati', 'super-kernel-basmati', 4, 4, 480, 560, 'kg', 65, 4.9, 215, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=720&q=85', 'Organic', 'Long-grain aromatic basmati from local growers.', TRUE, FALSE, FALSE, TRUE, TRUE, TRUE, '2026-09-16 07:00:00'),
(13, 'Desi Brown Chickpeas', 'desi-brown-chickpeas', 2, 4, 260, 290, 'kg', 37, 4.7, 66, 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=720&q=85', 'Vegan', 'Locally grown brown chickpeas, naturally protein-rich.', FALSE, FALSE, FALSE, TRUE, FALSE, TRUE, '2026-09-17 07:00:00'),
(14, 'Fragrant Fresh Coriander', 'fresh-coriander', 6, 5, 45, 60, 'bunch', 11, 4.8, 39, 'https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Aromatic coriander cut fresh for your kitchen.', TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-24 06:00:00'),
(15, 'Garden-Fresh Mint', 'garden-fresh-mint', 1, 5, 50, 65, 'bunch', 26, 4.6, 31, 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Bright, fragrant mint grown without harsh chemicals.', TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-23 06:00:00'),
(16, 'Gadap Red Potatoes', 'gadap-red-potatoes', 2, 1, 125, 150, 'kg', 48, 4.7, 52, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Firm red potatoes harvested in Gadap.', TRUE, TRUE, FALSE, TRUE, FALSE, TRUE, '2026-09-25 06:00:00'),
(17, 'Golden Cooking Onions', 'golden-cooking-onions', 1, 1, 135, 155, 'kg', 62, 4.6, 44, 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=720&q=85', 'Vegan', 'Everyday golden onions from a family farm.', FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, '2026-09-24 06:00:00'),
(18, 'Sweet Green Capsicum', 'sweet-green-capsicum', 6, 1, 220, 260, 'kg', 17, 4.8, 37, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Crisp green capsicum picked fresh in small batches.', TRUE, TRUE, TRUE, FALSE, FALSE, TRUE, '2026-09-25 07:00:00'),
(19, 'Sindh Sweet Bananas', 'sindh-sweet-bananas', 2, 2, 180, 210, 'dozen', 39, 4.8, 68, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=720&q=85', 'Vegan', 'Naturally sweet bananas from Sindh farms.', FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, '2026-09-25 06:00:00'),
(20, 'Seasonal Black Jamun', 'seasonal-black-jamun', 3, 2, 280, 330, '500 g', 9, 4.7, 29, 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Seasonal black jamun collected from local orchards.', TRUE, FALSE, TRUE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00'),
(21, 'Khairpur Soft Dates', 'khairpur-soft-dates', 3, 2, 520, 600, 'kg', 28, 4.9, 88, 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Soft, naturally sweet dates from Sindh.', TRUE, FALSE, FALSE, TRUE, FALSE, TRUE, '2026-09-24 06:00:00'),
(22, 'Fresh Malai Paneer', 'fresh-malai-paneer', 4, 3, 520, 580, '500 g', 13, 4.8, 46, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=720&q=85', 'Vegetarian', 'Fresh paneer made in small batches with farm milk.', FALSE, TRUE, TRUE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00'),
(23, 'Cultured Farmhouse Butter', 'cultured-farmhouse-butter', 4, 3, 460, 520, '250 g', 16, 4.9, 57, 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=720&q=85', 'Organic', 'Rich cultured butter made from farm cream.', TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-24 06:00:00'),
(24, 'Free-Range Desi Chicken', 'free-range-desi-chicken', 4, 3, 980, 1100, 'kg', 7, 4.8, 63, 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=720&q=85', 'Farm raised', 'Desi chicken raised on a small family farm.', FALSE, FALSE, TRUE, FALSE, FALSE, TRUE, '2026-09-25 07:00:00'),
(25, 'Stoneground Whole Wheat Atta', 'stoneground-whole-wheat-atta', 4, 4, 230, 260, 'kg', 55, 4.8, 71, 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Whole wheat ground in small batches for fresh flavor.', TRUE, FALSE, FALSE, TRUE, FALSE, TRUE, '2026-09-24 06:00:00'),
(26, 'Unpolished Green Moong Daal', 'green-moong-daal', 2, 4, 390, 440, 'kg', 33, 4.7, 49, 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=720&q=85', 'Vegan', 'Locally grown green moong, gently cleaned and unpolished.', FALSE, FALSE, FALSE, TRUE, FALSE, TRUE, '2026-09-23 06:00:00'),
(27, 'Potohar Pearl Millet (Bajra)', 'potohar-pearl-millet', 4, 4, 210, 240, 'kg', 29, 4.6, 24, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Nutritious pearl millet grown in the Potohar region.', TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, '2026-09-24 06:00:00'),
(28, 'Whole Aromatic Cumin Seeds', 'whole-cumin-seeds', 6, 5, 340, 390, '250 g', 31, 4.9, 58, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Whole cumin seeds selected for a warm, fresh aroma.', TRUE, FALSE, FALSE, TRUE, FALSE, TRUE, '2026-09-23 06:00:00'),
(29, 'Fresh Green Chillies', 'fresh-green-chillies', 1, 5, 160, 190, 'kg', 21, 4.7, 33, 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=720&q=85', 'Vegan', 'Fresh green chillies picked from the farm each morning.', FALSE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00'),
(30, 'Fresh Raw Turmeric Root', 'fresh-raw-turmeric', 6, 5, 260, 300, '500 g', 14, 4.8, 27, 'https://images.unsplash.com/photo-1615485500704-8e990f9900f1?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Fragrant raw turmeric root freshly harvested.', TRUE, FALSE, TRUE, FALSE, FALSE, TRUE, '2026-09-24 06:00:00')
ON DUPLICATE KEY UPDATE
	name = VALUES(name), slug = VALUES(slug), producer_id = VALUES(producer_id), category_id = VALUES(category_id),
	price = VALUES(price), original_price = VALUES(original_price), unit = VALUES(unit), stock = VALUES(stock),
	rating = VALUES(rating), reviews_count = VALUES(reviews_count), image_url = VALUES(image_url),
	dietary_tags = VALUES(dietary_tags), description = VALUES(description), organic = VALUES(organic),
	same_day_pickup = VALUES(same_day_pickup), preorder_available = VALUES(preorder_available),
	bulk_deal = VALUES(bulk_deal), featured = VALUES(featured), in_stock = VALUES(in_stock), created_at = VALUES(created_at);

-- Additional catalog products use generated ids and unique slugs for safe reruns.
INSERT INTO products (name, slug, producer_id, category_id, price, original_price, unit, stock, rating, reviews_count, image_url, dietary_tags, description, organic, same_day_pickup, preorder_available, bulk_deal, featured, in_stock, created_at) VALUES
('Glossy Purple Brinjal', 'purple-brinjal', 1, 1, 190, 220, 'kg', 23, 4.7, 32, 'https://images.unsplash.com/photo-1652781403547-7c17a0ade1a9?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Glossy purple brinjal grown in Gadap.', TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Fresh White Cauliflower', 'white-cauliflower', 2, 1, 160, 185, 'piece', 15, 4.6, 25, 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=720&q=85', 'Vegan', 'Fresh cauliflower harvested at the right size.', FALSE, TRUE, TRUE, FALSE, FALSE, TRUE, '2026-09-24 06:00:00'),
('Ruby Red Pomegranates', 'ruby-red-pomegranates', 3, 2, 390, 450, 'kg', 20, 4.8, 43, 'https://images.unsplash.com/photo-1541344999736-83eca272f6fc?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Ruby red pomegranates from Sindh orchards.', TRUE, FALSE, FALSE, TRUE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Crisp Kaghan Valley Apples', 'kaghan-valley-apples', 5, 2, 360, 410, 'kg', 26, 4.7, 39, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=720&q=85', 'Vegan', 'Crisp apples sourced from northern valley growers.', FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, '2026-09-24 06:00:00'),
('Traditional Salted Lassi', 'traditional-salted-lassi', 4, 3, 150, 180, '500 ml', 12, 4.7, 30, 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?auto=format&fit=crop&w=720&q=85', 'Farm fresh', 'Traditional salted lassi made with fresh farm yogurt.', FALSE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Thick Fresh Dairy Cream', 'fresh-dairy-cream', 4, 3, 320, 360, '250 ml', 10, 4.8, 22, 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=720&q=85', 'Organic', 'Thick fresh cream from a family dairy.', TRUE, TRUE, TRUE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Farm-Made Paneer Cubes', 'farm-made-paneer-cubes', 4, 3, 540, 600, '500 g', 9, 4.8, 35, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=720&q=85', 'Vegetarian', 'Farm-made paneer cut into ready-to-cook cubes.', FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, '2026-09-24 06:00:00'),
('Washed Red Masoor Daal', 'washed-red-masoor-daal', 2, 4, 310, 350, 'kg', 38, 4.7, 45, 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=720&q=85', 'Vegan', 'Cleaned red masoor daal from local growers.', FALSE, FALSE, FALSE, TRUE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Stoneground Makai Atta', 'stoneground-makai-atta', 4, 4, 190, 220, 'kg', 27, 4.6, 21, 'https://images.unsplash.com/photo-1601593768794-7f71b4b2cdee?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Stoneground maize flour, milled in small batches.', TRUE, FALSE, FALSE, TRUE, FALSE, TRUE, '2026-09-24 06:00:00'),
('Whole Potohar Barley', 'whole-potohar-barley', 4, 4, 220, 250, 'kg', 32, 4.6, 18, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=720&q=85', 'Vegan', 'Whole barley grown in the Potohar region.', FALSE, FALSE, TRUE, FALSE, FALSE, TRUE, '2026-09-23 06:00:00'),
('Red Kidney Beans (Rajma)', 'red-kidney-beans-rajma', 2, 4, 420, 470, 'kg', 24, 4.8, 34, 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Locally sourced red kidney beans, rich in plant protein.', TRUE, FALSE, FALSE, TRUE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Fresh Sweet Basil Leaves', 'fresh-sweet-basil', 6, 5, 90, 110, 'bunch', 13, 4.7, 19, 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Fragrant sweet basil harvested in small bunches.', TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Fresh Farm Garlic Bulbs', 'fresh-farm-garlic', 1, 5, 320, 370, 'kg', 18, 4.8, 28, 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=720&q=85', 'Vegan', 'Fresh garlic bulbs harvested from the farm.', FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, '2026-09-24 06:00:00'),
('Fresh Fenugreek (Methi)', 'fresh-fenugreek-methi', 6, 5, 70, 90, 'bunch', 16, 4.6, 17, 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Fresh methi leaves picked for everyday cooking.', TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Whole Green Fennel Seeds', 'whole-green-fennel-seeds', 6, 5, 280, 320, '250 g', 25, 4.8, 26, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Whole green fennel seeds with a naturally sweet aroma.', TRUE, FALSE, FALSE, TRUE, FALSE, TRUE, '2026-09-23 06:00:00'),
('Fresh Green Peas (Matar)', 'fresh-green-peas', 1, 1, 160, 190, 'kg', 25, 4.8, 38, 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Sweet, tender green peas freshly podded from organic fields.', TRUE, TRUE, FALSE, TRUE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Farm Fresh Bhindi (Ladyfinger)', 'fresh-farm-bhindi', 2, 1, 140, 165, 'kg', 18, 4.7, 29, 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Crisp young ladyfinger harvested daily from Malir farms.', TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Organic Red Radish (Mooli)', 'organic-red-radish', 6, 1, 80, 100, 'bunch', 22, 4.6, 19, 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Crunchy and peppery red radishes grown in urban kitchen gardens.', TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Tender Green Bottle Gourd (Lauki)', 'tender-bottle-gourd', 1, 1, 100, 120, 'piece', 14, 4.8, 24, 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Freshly harvested light-green bottle gourd, rich in hydration.', TRUE, TRUE, TRUE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Swat Sweet Watermelons', 'swat-sweet-watermelons', 3, 2, 250, 300, 'piece', 15, 4.9, 51, 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Juicy, dark-red field watermelons naturally sweetened by Swat valley climate.', TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Farm Fresh Papaya', 'farm-fresh-papaya', 3, 2, 210, 240, 'kg', 12, 4.7, 33, 'https://images.unsplash.com/photo-1517260739337-6799d239ce83?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Tree-ripened golden papaya filled with rich flavor and natural enzymes.', TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Sweet Muskmelon (Kharbooza)', 'sweet-muskmelon', 5, 2, 190, 220, 'kg', 20, 4.8, 42, 'https://images.unsplash.com/photo-1598170845058-12ef4a457539?auto=format&fit=crop&w=720&q=85', 'Vegan', 'Aromatic sweet muskmelon harvested from Punjab sun-drenched fields.', FALSE, TRUE, TRUE, TRUE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Juicy Khanpur Lychee', 'juicy-khanpur-lychee', 3, 2, 480, 550, 'kg', 10, 4.9, 64, 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Fragrant, plump lychees picked fresh from orchards.', TRUE, FALSE, TRUE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Pure Golden Desi Ghee', 'pure-golden-desi-ghee', 4, 3, 1450, 1650, '500 g', 14, 4.9, 89, 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=720&q=85', 'Organic, Pure Dairy', 'Traditional slow-clarified butter ghee made from grass-fed farm milk.', TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Fresh Creamy Buffalo Milk', 'fresh-creamy-buffalo-milk', 4, 3, 260, 290, 'litre', 16, 4.8, 45, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=720&q=85', 'Farm fresh', 'Rich high-fat unpasteurized buffalo milk straight from Raiwind dairy.', FALSE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Artisanal Farm Khoya (Mawa)', 'artisanal-farm-khoya', 4, 3, 650, 720, '500 g', 8, 4.9, 31, 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=720&q=85', 'Organic, Farm fresh', 'Slow-cooked evaporated whole milk solid for traditional sweets and cooking.', TRUE, TRUE, TRUE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Farm Fresh Quail Eggs', 'farm-fresh-quail-eggs', 4, 3, 320, 360, 'pack (12 pcs)', 11, 4.7, 22, 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=720&q=85', 'Nutrient rich, Farm fresh', 'Small nutrient-dense speckled quail eggs raised on natural grains.', FALSE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Yellow Chana Daal', 'yellow-chana-daal', 2, 4, 280, 320, 'kg', 40, 4.8, 55, 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=720&q=85', 'Vegan, High protein', 'Split Bengal gram lentils, cleaned and sorted for rich daal dishes.', FALSE, FALSE, FALSE, TRUE, FALSE, TRUE, '2026-09-25 06:00:00'),
('White Kabuli Chana', 'white-kabuli-chana', 4, 4, 380, 420, 'kg', 30, 4.9, 62, 'https://images.unsplash.com/photo-1585059819970-07f912128926?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Large grain white chickpeas ideal for aromatic chana masala.', TRUE, FALSE, FALSE, TRUE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Organic Whole Mustard Seeds (Rai)', 'whole-mustard-seeds', 2, 4, 220, 250, '250 g', 25, 4.7, 28, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Pungent dark brown mustard seeds for traditional temperings.', TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Unpolished Urad Daal Split', 'unpolished-urad-daal', 4, 4, 360, 400, 'kg', 28, 4.7, 39, 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=720&q=85', 'Vegan', 'Nutritious split black gram, unpolished to retain natural fiber.', FALSE, FALSE, FALSE, TRUE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Fresh Organic Ginger Root (Adrak)', 'fresh-organic-ginger', 6, 5, 340, 390, '500 g', 19, 4.8, 41, 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Fragrant, zesty organic ginger roots harvested fresh.', TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Whole Black Pepper (Kali Mirch)', 'whole-black-pepper', 6, 5, 420, 480, '250 g', 22, 4.9, 53, 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Sun-dried whole black peppercorns with intense aroma.', TRUE, FALSE, FALSE, TRUE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Organic Carom Seeds (Ajwain)', 'organic-carom-seeds', 1, 5, 210, 240, '250 g', 20, 4.7, 31, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Thyme-scented organic carom seeds useful for stomach ease and baking.', TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00'),
('Fresh Green Curry Leaves', 'fresh-curry-leaves', 6, 5, 60, 75, 'bunch', 15, 4.8, 27, 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?auto=format&fit=crop&w=720&q=85', 'Organic, Vegan', 'Fragrant green curry leaves freshly plucked from garden bushes.', TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, '2026-09-25 06:00:00')
ON DUPLICATE KEY UPDATE
	name = VALUES(name), producer_id = VALUES(producer_id), category_id = VALUES(category_id),
	price = VALUES(price), original_price = VALUES(original_price), unit = VALUES(unit), stock = VALUES(stock),
	rating = VALUES(rating), reviews_count = VALUES(reviews_count), image_url = VALUES(image_url),
	dietary_tags = VALUES(dietary_tags), description = VALUES(description), organic = VALUES(organic),
	same_day_pickup = VALUES(same_day_pickup), preorder_available = VALUES(preorder_available),
	bulk_deal = VALUES(bulk_deal), featured = VALUES(featured), in_stock = VALUES(in_stock), created_at = VALUES(created_at);

-- Convert the previous seeded dairy category and refresh counts without removing products.
UPDATE products p
JOIN categories c ON c.id = p.category_id
SET p.category_id = 3
WHERE c.slug = 'dairy-eggs';

DELETE FROM categories WHERE slug = 'dairy-eggs';
UPDATE categories c
SET c.product_count = (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id);

-- Insert Testimonials
INSERT INTO testimonials (id, author_name, author_role, stars, quote) VALUES
(1, 'Lauren O.', 'MarketLink customer', 5, 'MarketLink has helped shape the way my kids eat. I highly recommend it if you want to eat local!'),
(2, 'Kelsey Halling', 'MarketLink customer', 5, 'Delicious food, brought to me, all while supporting farms more directly—with the most sustainable packaging I’ve seen.'),
(3, 'Marcus Vance', 'MarketLink customer since 2021', 5, 'The ability to swap items in my weekly cart makes local grocery shopping easier than driving to three different supermarkets.')
ON DUPLICATE KEY UPDATE
	author_name = VALUES(author_name), author_role = VALUES(author_role), stars = VALUES(stars), quote = VALUES(quote);

-- Demo market hubs for the existing producer catalog. Coordinates are market
-- center pins; operators should replace these with verified stall locations.
INSERT INTO markets (name, slug, address, city, district, country_code, timezone, latitude, longitude, market_status) VALUES
('Karachi Community Farmers Market', 'karachi-community-market', 'University Road, Karachi', 'Karachi', 'East', 'PK', 'Asia/Karachi', 24.9271, 67.1020, 'active'),
('Hyderabad Orchard Market', 'hyderabad-orchard-market', 'Autobahn Road, Hyderabad', 'Hyderabad', 'Hyderabad', 'PK', 'Asia/Karachi', 25.3960, 68.3578, 'active'),
('Lahore Fresh Market', 'lahore-fresh-market', 'Raiwind Road, Lahore', 'Lahore', 'Lahore', 'PK', 'Asia/Karachi', 31.4140, 74.2180, 'active'),
('Sargodha Citrus Market', 'sargodha-citrus-market', 'Bhalwal Road, Sargodha', 'Sargodha', 'Sargodha', 'PK', 'Asia/Karachi', 32.2650, 72.9000, 'active')
ON DUPLICATE KEY UPDATE
	name = VALUES(name), address = VALUES(address), city = VALUES(city), district = VALUES(district),
	country_code = VALUES(country_code), timezone = VALUES(timezone), latitude = VALUES(latitude), longitude = VALUES(longitude);

-- These are established demo vendors. New registrations must enter pending_review
-- and be approved by an administrator before product publishing is enabled.
INSERT INTO farmer_profiles (producer_id, legal_name, public_name, approval_status)
SELECT id, name, name, 'approved' FROM producers
ON DUPLICATE KEY UPDATE legal_name = VALUES(legal_name), public_name = VALUES(public_name);

-- Retain the legacy producer-to-product relationship while assigning each
-- producer a dashboard-managed stall at its city's market hub.
INSERT INTO stalls (producer_id, market_id, name, description, latitude, longitude, stall_status)
SELECT p.id, m.id, CONCAT(p.name, ' Farm Stall'), p.description, NULL, NULL, 'active'
FROM producers p
JOIN markets m ON m.slug = CASE p.city
	WHEN 'Karachi' THEN 'karachi-community-market'
	WHEN 'Hyderabad' THEN 'hyderabad-orchard-market'
	WHEN 'Lahore' THEN 'lahore-fresh-market'
	WHEN 'Sargodha' THEN 'sargodha-citrus-market'
END
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description);

-- Weekday convention: 0 = Sunday, 6 = Saturday. Seeded markets are open daily.
INSERT INTO market_hours (market_id, weekday, opens_at, closes_at)
SELECT m.id, weekdays.weekday, '08:00:00', '14:00:00'
FROM markets m
CROSS JOIN (
	SELECT 0 AS weekday UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
	UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
) weekdays
WHERE m.slug IN ('karachi-community-market', 'hyderabad-orchard-market', 'lahore-fresh-market', 'sargodha-citrus-market')
ON DUPLICATE KEY UPDATE closes_at = VALUES(closes_at);

INSERT INTO stall_hours (stall_id, weekday, opens_at, closes_at)
SELECT s.id, weekdays.weekday, '08:00:00', '14:00:00'
FROM stalls s
CROSS JOIN (
	SELECT 0 AS weekday UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
	UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
) weekdays
WHERE 1 = 1
ON DUPLICATE KEY UPDATE closes_at = VALUES(closes_at);

-- One upcoming demo pickup window per stall. Re-running the seed updates the
-- window configuration without reducing capacity below already reserved orders.
INSERT INTO pickup_slots (
	stall_id, starts_at, ends_at, order_cutoff_at, acceptance_deadline_at, capacity, slot_status
)
SELECT
	s.id,
	TIMESTAMP(DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY), '09:00:00'),
	TIMESTAMP(DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY), '12:00:00'),
	TIMESTAMP(DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY), '09:00:00'),
	TIMESTAMP(DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY), '07:00:00'),
	24,
	'open'
FROM stalls s
ON DUPLICATE KEY UPDATE
	order_cutoff_at = VALUES(order_cutoff_at),
	acceptance_deadline_at = VALUES(acceptance_deadline_at),
	capacity = GREATEST(reserved_count, VALUES(capacity));

-- Future products require an explicit approval transition; seed catalog items
-- stay published because these demo farmer profiles are pre-approved.
UPDATE products p
JOIN farmer_profiles fp ON fp.producer_id = p.producer_id
SET p.listing_status = 'published'
WHERE fp.approval_status = 'approved' AND p.listing_status = 'published';
