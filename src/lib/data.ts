import { Producer, Category, Product, Testimonial } from './types';

export const INITIAL_PRODUCERS: Producer[] = [
  {
    id: 1,
    name: 'Mighty Small Farm',
    slug: 'mighty-small-farm',
    location: 'Pittsburgh, PA',
    description: 'Regenerative organic vegetables and heirloom herbs grown with care in Southwestern Pennsylvania.',
    image_url: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80',
    specialty: 'Organic Vegetables',
    featured: true
  },
  {
    id: 2,
    name: 'Goat Rodeo Farm & Dairy',
    slug: 'goat-rodeo-farm',
    location: 'Allison Park, PA',
    description: 'Award-winning artisanal goat and cow milk cheeses crafted on a 130-acre family farm.',
    image_url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80',
    specialty: 'Artisanal Cheese',
    featured: true
  },
  {
    id: 3,
    name: 'Birch Creek Farmery',
    slug: 'birch-creek-farmery',
    location: 'Burgettstown, PA',
    description: 'Pasture-raised heritage breed meats raised with ethical standards and zero antibiotics.',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    specialty: 'Heritage Meats',
    featured: true
  },
  {
    id: 4,
    name: 'Best Ever Granola',
    slug: 'best-ever-granola',
    location: 'Pittsburgh, PA',
    description: 'Hand-crafted small-batch granola packed with toasted pecans, organic oats, and pure maple syrup.',
    image_url: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=800&q=80',
    specialty: 'Small-Batch Granola',
    featured: true
  },
  {
    id: 5,
    name: 'Mediterra Bakehouse',
    slug: 'mediterra-bakehouse',
    location: 'Pittsburgh, PA',
    description: 'Artisan sourdough breads baked in custom stone deck ovens using ancient stone-milled grains.',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    specialty: 'Sourdough & Breads',
    featured: false
  },
  {
    id: 6,
    name: 'Clarion River Organics',
    slug: 'clarion-river-organics',
    location: 'Sligo, PA',
    description: 'Cooperative of Amish family farms dedicated to certified organic produce and dairy.',
    image_url: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=800&q=80',
    specialty: 'Amish Organic Produce',
    featured: false
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'Produce', slug: 'produce', icon: 'Produce', product_count: 420 },
  { id: 2, name: 'Plant based', slug: 'plant-based', icon: 'Plant', product_count: 280 },
  { id: 3, name: 'Prepared foods', slug: 'prepared-foods', icon: 'Prepared', product_count: 195 },
  { id: 4, name: 'Bakery', slug: 'bakery', icon: 'Bakery', product_count: 160 },
  { id: 5, name: 'Meat & Seafood', slug: 'meat-seafood', icon: 'Meat', product_count: 215 },
  { id: 6, name: 'Dairy & Eggs', slug: 'dairy-eggs', icon: 'Dairy', product_count: 240 }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Organic Rainbow Carrots',
    slug: 'rainbow-carrots',
    producer_id: 1,
    producer_name: 'Mighty Small Farm',
    category_id: 1,
    price: 4.49,
    unit: '1 lb bunch',
    image_url: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=600&q=80',
    dietary_tags: 'Organic, Gluten-free, Vegan, Non-GMO',
    description: 'Crisp, colorful heirloom carrots freshly harvested from Pittsburgh soil.',
    featured: true,
    in_stock: true
  },
  {
    id: 2,
    name: 'Bamboozle Aged Goat Cheese',
    slug: 'bamboozle-cheese',
    producer_id: 2,
    producer_name: 'Goat Rodeo Farm & Dairy',
    category_id: 6,
    price: 8.99,
    unit: '6 oz wedge',
    image_url: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80',
    dietary_tags: 'Gluten-free, Fair trade',
    description: 'Beer-washed semi-soft goat and cow milk cheese with rich buttery flavor.',
    featured: true,
    in_stock: true
  },
  {
    id: 3,
    name: 'Pasture-Raised Pork Chops',
    slug: 'pork-chops',
    producer_id: 3,
    producer_name: 'Birch Creek Farmery',
    category_id: 5,
    price: 14.50,
    unit: '2 chops (1.2 lbs)',
    image_url: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=600&q=80',
    dietary_tags: 'Gluten-free, Non-GMO, Soy-free',
    description: 'Thick-cut heritage pork chops raised on lush green pastures.',
    featured: true,
    in_stock: true
  },
  {
    id: 4,
    name: 'Maple Pecan Small-Batch Granola',
    slug: 'maple-granola',
    producer_id: 4,
    producer_name: 'Best Ever Granola',
    category_id: 2,
    price: 7.99,
    unit: '12 oz bag',
    image_url: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=600&q=80',
    dietary_tags: 'Organic, Vegan, Non-GMO, Soy-free',
    description: 'Roasted organic oats with crunchy pecans and pure Pennsylvania maple syrup.',
    featured: true,
    in_stock: true
  },
  {
    id: 5,
    name: 'Seeded Country Sourdough',
    slug: 'seeded-sourdough',
    producer_id: 5,
    producer_name: 'Mediterra Bakehouse',
    category_id: 4,
    price: 6.75,
    unit: '1 loaf',
    image_url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80',
    dietary_tags: 'Organic, Vegan, Non-GMO',
    description: 'Naturally fermented sourdough crusty loaf toasted with toasted seeds.',
    featured: false,
    in_stock: true
  },
  {
    id: 6,
    name: 'Heirloom Tomato Trio',
    slug: 'heirloom-tomatoes',
    producer_id: 6,
    producer_name: 'Clarion River Organics',
    category_id: 1,
    price: 5.99,
    unit: '1 lb',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    dietary_tags: 'Organic, Gluten-free, Vegan, Non-GMO',
    description: 'Sweet, sun-ripened local heirloom tomatoes in red, gold, and purple.',
    featured: false,
    in_stock: true
  },
  {
    id: 7,
    name: 'Grass-Fed Cream-Top Milk',
    slug: 'grassfed-milk',
    producer_id: 6,
    producer_name: 'Clarion River Organics',
    category_id: 6,
    price: 5.49,
    unit: '1/2 gallon',
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    dietary_tags: 'Organic, Non-GMO, Gluten-free',
    description: 'Non-homogenized organic milk direct from pastured family cows.',
    featured: false,
    in_stock: true
  },
  {
    id: 8,
    name: 'Roasted Vegetable Lasagna',
    slug: 'veggie-lasagna',
    producer_id: 3,
    producer_name: 'Birch Creek Farmery',
    category_id: 3,
    price: 12.99,
    unit: '1 container (2 servings)',
    image_url: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=600&q=80',
    dietary_tags: 'Vegetarian, Organic',
    description: 'Handmade pasta layered with fresh ricotta, spinach, and roasted squash.',
    featured: false,
    in_stock: true
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    author_name: 'Lauren O.',
    author_role: 'MarketLink member in Pittsburgh',
    stars: 5,
    quote: '“MarketLink has helped shape the way my kids eat. I highly recommend it if you want to eat local!”'
  },
  {
    id: 2,
    author_name: 'Kelsey Halling',
    author_role: 'MarketLink member in Squirrel Hill',
    stars: 5,
    quote: '“Delicious food, brought to me, all while supporting farms more directly—with the most sustainable packaging I’ve seen.”'
  },
  {
    id: 3,
    author_name: 'Marcus Vance',
    author_role: 'MarketLink customer since 2021',
    stars: 5,
    quote: '“The ability to swap items in my weekly cart makes local grocery shopping easier than driving to three different supermarkets.”'
  }
];
