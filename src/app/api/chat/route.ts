import { NextResponse } from 'next/server';
import { DISCOVERY_PRODUCTS, DISCOVERY_FARMERS } from '@/lib/discovery-data';
import { INITIAL_PRODUCTS, INITIAL_PRODUCERS } from '@/lib/data';

interface ChatRequest {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

export interface StandardProductKnowledge {
  id: string | number;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  unit: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  image: string;
  farmerName: string;
  farmName: string;
  city: string;
  district: string;
  organic: boolean;
  sameDayPickup: boolean;
  preorderAvailable: boolean;
  bulkDeal: boolean;
  dietaryTags: string;
  description: string;
  synonyms: string[];
}

// Urdu & Roman Urdu Produce Synonyms mapping for 100% precision matching
const PRODUCE_SYNONYM_MAP: Record<string, string[]> = {
  // Vegetables
  'vine-ripened-tomatoes': ['tomato', 'tomatoes', 'tamatar', 'red tomato', 'fresh tomato', 'organic tomato'],
  'heirloom-tomatoes': ['heirloom tomato', 'tamatar', 'red gold tomatoes'],
  'baby-spinach': ['spinach', 'palak', 'paalak', 'baby spinach', 'leafy green'],
  'sweet-farm-carrots': ['carrot', 'carrots', 'gajar', 'gajjar', 'red carrot'],
  'rainbow-carrots': ['rainbow carrot', 'carrots', 'gajar'],
  'green-cucumbers': ['cucumber', 'cucumbers', 'kheera', 'kheere', 'green cucumber'],
  'gadap-red-potatoes': ['potato', 'potatoes', 'aaloo', 'aloo', 'gadap potato', 'red potato'],
  'golden-cooking-onions': ['onion', 'onions', 'pyaaz', 'pyaz', 'golden onion'],
  'sweet-green-capsicum': ['capsicum', 'capsicums', 'shimla mirch', 'green pepper', 'bell pepper'],
  'purple-brinjal': ['brinjal', 'eggplant', 'baingan', 'purple brinjal'],
  'white-cauliflower': ['cauliflower', 'gobhi', 'phool gobhi', 'cauliflowers'],
  'fresh-green-peas': ['peas', 'green peas', 'matar', 'mattar'],
  'fresh-farm-bhindi': ['bhindi', 'ladyfinger', 'okra', 'bhindi masala'],
  'organic-red-radish': ['radish', 'mooli', 'red radish', 'moli'],
  'tender-bottle-gourd': ['bottle gourd', 'lauki', 'loki', 'kaddoo', 'gourd'],

  // Fruits
  'chaunsa-mangoes': ['mango', 'mangoes', 'chaunsa', 'chaunsa mango', 'aam', 'sweet mango'],
  'sargodha-kinnow': ['kinnow', 'orange', 'oranges', 'kino', 'sargodha kinnow', 'citrus'],
  'fresh-strawberries': ['strawberry', 'strawberries', 'strawbery'],
  'pink-guava': ['guava', 'guavas', 'amrood', 'amrud', 'pink guava'],
  'sindh-sweet-bananas': ['banana', 'bananas', 'kela', 'kele', 'sindh banana'],
  'seasonal-black-jamun': ['jamun', 'black jamun', 'jaman'],
  'khairpur-soft-dates': ['dates', 'date', 'khajoor', 'khajur', 'soft dates'],
  'ruby-red-pomegranates': ['pomegranate', 'pomegranates', 'anar', 'anaar'],
  'kaghan-valley-apples': ['apple', 'apples', 'saeb', 'seb', 'kaghan apple'],
  'swat-sweet-watermelons': ['watermelon', 'watermelons', 'tarbooz', 'tarbuz'],
  'farm-fresh-papaya': ['papaya', 'papayas', 'papita', 'papeeta'],
  'sweet-muskmelon': ['muskmelon', 'melon', 'kharbooza', 'kharbuza'],
  'juicy-khanpur-lychee': ['lychee', 'lychees', 'lichee', 'litchi'],

  // Dairy & Poultry
  'free-range-desi-eggs': ['egg', 'eggs', 'anda', 'ande', 'desi egg', 'desi anday'],
  'farm-fresh-milk': ['milk', 'doodh', 'dudh', 'fresh milk', 'farm milk'],
  'fresh-creamy-buffalo-milk': ['buffalo milk', 'bhens ka doodh', 'heavy milk'],
  'grassfed-milk': ['grassfed milk', 'cow milk'],
  'traditional-dahi': ['dahi', 'yogurt', 'curd', 'yoghurt'],
  'fresh-malai-paneer': ['paneer', 'malai paneer', 'cheese', 'cottage cheese'],
  'farm-made-paneer-cubes': ['paneer cubes', 'paneer'],
  'bamboozle-cheese': ['goat cheese', 'bamboozle', 'artisanal cheese'],
  'cultured-farmhouse-butter': ['butter', 'makhan', 'fresh butter'],
  'free-range-desi-chicken': ['chicken', 'desi chicken', 'murgi', 'murghi', 'poultry'],
  'pure-golden-desi-ghee': ['ghee', 'desi ghee', 'pure ghee', 'makhan ghee'],
  'traditional-salted-lassi': ['lassi', 'salted lassi', 'dahi lassi'],
  'fresh-dairy-cream': ['cream', 'malai', 'dairy cream'],
  'artisanal-farm-khoya': ['khoya', 'mawa', 'khoya sweet'],
  'farm-fresh-quail-eggs': ['quail eggs', 'bater ke anday', 'small eggs'],

  // Grains & Staples
  'super-kernel-basmati': ['rice', 'basmati', 'basmati rice', 'chawal', 'super kernel'],
  'stoneground-whole-wheat-atta': ['atta', 'flour', 'wheat flour', 'gandum', 'chakki atta'],
  'stoneground-makai-atta': ['makai atta', 'corn flour', 'makki atta', 'makai'],
  'potohar-pearl-millet': ['bajra', 'millet', 'pearl millet'],
  'whole-potohar-barley': ['barley', 'jau', 'jowar'],
  'desi-brown-chickpeas': ['chana', 'brown chana', 'kala chana', 'chickpeas'],
  'white-kabuli-chana': ['kabuli chana', 'white chana', 'safaid chana', 'cholay'],
  'green-moong-daal': ['moong daal', 'green moong', 'daal moong', 'dal'],
  'washed-red-masoor-daal': ['masoor daal', 'red masoor', 'daal masoor', 'dal'],
  'yellow-chana-daal': ['chana daal', 'yellow daal', 'dal chana'],
  'unpolished-urad-daal': ['urad daal', 'daal mash', 'black gram'],
  'red-kidney-beans-rajma': ['rajma', 'kidney beans', 'red beans', 'lobia'],
  'whole-mustard-seeds': ['mustard seeds', 'rai', 'sarson'],

  // Herbs & Spices
  'fresh-coriander': ['coriander', 'dhaniya', 'dhania', 'fresh coriander'],
  'garden-fresh-mint': ['mint', 'pudina', 'podeena', 'fresh mint'],
  'fresh-green-chillies': ['chilli', 'chillies', 'green chilli', 'hari mirch'],
  'fresh-organic-ginger': ['ginger', 'adrak', 'fresh adrak'],
  'fresh-farm-garlic': ['garlic', 'lehsan', 'lahsun'],
  'fresh-raw-turmeric': ['turmeric', 'haldi', 'raw turmeric'],
  'fresh-sweet-basil': ['basil', 'niazbo', 'sweet basil'],
  'fresh-fenugreek-methi': ['fenugreek', 'methi', 'kasuri methi'],
  'fresh-curry-leaves': ['curry leaves', 'kadi patta', 'khatta patta'],
  'whole-cumin-seeds': ['cumin', 'zeera', 'zira', 'cumin seeds'],
  'whole-black-pepper': ['black pepper', 'kali mirch', 'pepper'],
  'organic-carom-seeds': ['carom seeds', 'ajwain', 'ajwain seeds'],
  'whole-green-fennel-seeds': ['fennel', 'saunf', 'fennel seeds'],

  // Prepared & Artisan
  'maple-granola': ['granola', 'oats', 'maple pecan'],
  'seeded-sourdough': ['sourdough', 'bread', 'sourdough bread'],
  'veggie-lasagna': ['lasagna', 'vegetable lasagna'],
  'pork-chops': ['pork', 'pork chops', 'meat']
};

/**
 * Builds the complete unified catalog knowledge base
 */
async function buildUnifiedCatalog(): Promise<StandardProductKnowledge[]> {
  const unified: StandardProductKnowledge[] = [];

  // 1. Add all DISCOVERY_PRODUCTS (50 items)
  for (const p of DISCOVERY_PRODUCTS) {
    const synonyms = PRODUCE_SYNONYM_MAP[p.slug] || [p.name.toLowerCase(), p.category.toLowerCase()];
    unified.push({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      unit: p.unit,
      stock: p.stock,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      image: p.image,
      farmerName: p.farmer.name,
      farmName: p.farmer.farmName,
      city: p.farmer.city,
      district: p.farmer.district,
      organic: p.organic,
      sameDayPickup: p.sameDayPickup,
      preorderAvailable: p.preorderAvailable,
      bulkDeal: p.bulkDeal,
      dietaryTags: p.organic ? 'Organic, Vegan, Pure Fresh' : 'Fresh Farm Produce',
      description: `${p.name} freshly harvested at ${p.farmer.farmName} in ${p.farmer.district}, ${p.farmer.city}.`,
      synonyms
    });
  }

  // 2. Add INITIAL_PRODUCTS (8 items) converted to PKR & normalized
  for (const p of INITIAL_PRODUCTS) {
    const producer = INITIAL_PRODUCERS.find((pr) => pr.id === p.producer_id);
    const slug = p.slug;
    const synonyms = PRODUCE_SYNONYM_MAP[slug] || [p.name.toLowerCase(), p.dietary_tags.toLowerCase()];
    const pricePKR = Math.round(p.price * 280);

    // Avoid duplications if slug matches
    if (!unified.some((u) => u.slug === slug)) {
      unified.push({
        id: `init-${p.id}`,
        name: p.name,
        slug: p.slug,
        category: 'Specialty & Artisan',
        price: pricePKR,
        originalPrice: Math.round(pricePKR * 1.15),
        unit: p.unit,
        stock: 25,
        rating: 4.8,
        reviewsCount: 42,
        image: p.image_url,
        farmerName: p.producer_name || producer?.name || 'Partner Artisan Farm',
        farmName: producer?.name || 'Specialty Local Farm',
        city: 'Pakistan',
        district: 'Regional Hub',
        organic: p.dietary_tags.toLowerCase().includes('organic'),
        sameDayPickup: true,
        preorderAvailable: false,
        bulkDeal: false,
        dietaryTags: p.dietary_tags,
        description: p.description || 'Specialty artisan farm produce.',
        synonyms
      });
    }
  }

  return unified;
}

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const userMsg = (body.message || '').trim().toLowerCase();

    if (!userMsg) {
      return NextResponse.json(
        {
          reply:
            'Assalam-o-Alaikum! Main Marco hoon, MarketLink ka AI Assistant. Main har product ki complete knowledge rakhta hoon. Aap price, stock, farmer name, ya origin poochna chahte hain?',
        },
        { status: 400 }
      );
    }

    const catalog = await buildUnifiedCatalog();

    let reply = '';
    let recommendedProducts: any[] = [];
    let suggestedActions: string[] = [];

    // Language & Tone detection
    const isUrduOrRoman = /salam|assalam|kaise|kya|shukriya|madad|hai|hain|chahiye|chahye|miley|karna|karu|meharbani|yar|bhai|batao|bataen|kahan|kitni|kitna|rate|qeemat|qeematain|dam|mangal|sasta|mehenga/i.test(
      userMsg
    );
    const isGreeting = /hi|hello|hey|salam|assalam|aoa|greetings|who are you|naam|name|marco/i.test(
      userMsg
    );

    // 1. MARCO IDENTIFICATION & GREETING
    if (
      isGreeting &&
      (userMsg.includes('who') ||
        userMsg.includes('naam') ||
        userMsg.includes('name') ||
        userMsg.includes('marco') ||
        userMsg.includes('hi') ||
        userMsg.includes('hello') ||
        userMsg.includes('salam'))
    ) {
      if (isUrduOrRoman) {
        reply =
          `**Assalam-o-Alaikum! Main Marco hoon 👋**\n\nMain MarketLink ka AI Assistant hoon aur mere paas store ke **tamam ${catalog.length}+ products** ki 100% detail hai:\n\n• 🥦 **Organic Vegetables:** Tomatoes, Baby Spinach, Red Potatoes, Carrots, Cucumbers, Bhindi, Matar, Lauki, Brinjal, etc.\n• 🍎 **Fresh Seasonals & Fruits:** Chaunsa Mangoes, Sargodha Kinnow, Strawberries, Pink Guava, Soft Dates, Watermelon, Lychee, etc.\n• 🥛 **Dairy & Farm Poultry:** Desi Eggs, Full-Cream Milk, Buffalo Milk, Pure Desi Ghee, Creamy Dahi, Malai Paneer, Desi Chicken.\n• 🌾 **Grains & Staples:** Super Kernel Basmati Rice, Whole Wheat Atta, Makai Atta, Pearl Millet (Bajra), Pulses (Moong, Masoor, Chana, Urad).\n• 🌿 **Fresh Herbs & Spices:** Ginger (Adrak), Garlic (Lehsan), Turmeric (Haldi), Mint, Coriander, Green Chillies, Cumin, Black Pepper.\n\nAap kisi bhi product ka **rate, stock, location, farmer name ya delivery status** poochain!`;
      } else {
        reply =
          `**Hello! I am Marco, your MarketLink AI Assistant 👋**\n\nI have 100% complete product knowledge across all **${catalog.length}+ fresh items** in our farm-to-table catalog:\n\n• 🥦 **Organic Produce:** Tomatoes, Baby Spinach, Gadap Potatoes, Sweet Carrots, Cucumbers, Ladyfinger, Green Peas, Brinjal.\n• 🍎 **Fresh Fruits & Seasonals:** Chaunsa Mangoes, Sargodha Kinnows, Strawberries, Pink Guava, Khairpur Soft Dates, Swat Watermelons, Lychee.\n• 🥛 **Dairy & Poultry:** Free-Range Desi Eggs, Farm Milk, Buffalo Milk, Pure Golden Desi Ghee, Traditional Dahi, Malai Paneer, Desi Chicken.\n• 🌾 **Grains & Staples:** Super Kernel Basmati Rice, Stoneground Atta, Makai Atta, Bajra, Brown & White Chickpeas, Moong & Masoor Daal.\n• 🌿 **Herbs & Spices:** Organic Ginger, Garlic, Raw Turmeric, Mint, Coriander, Chillies, Cumin, Black Pepper, Carom & Fennel Seeds.\n\nAsk Marco about any item's price, stock, farmer source, or origin!`;
      }
      suggestedActions = [
        '🥦 Organic Vegetables Rates',
        '🍎 Chaunsa Mangoes & Fruits',
        '🥛 Desi Milk & Ghee Stock',
        '🌾 Super Kernel Basmati Rice',
        '🚚 Delivery Hubs & Timing',
      ];
      return NextResponse.json({ reply, recommendedProducts, suggestedActions });
    }

    // Stop words to exclude from raw keyword search
    const STOP_WORDS = new Set([
      'price', 'rate', 'qeemat', 'dam', 'daam', 'detail', 'details', 'kya', 'hai', 'hain',
      'kitna', 'kitni', 'kitne', 'batao', 'bataen', 'bataiye', 'den', 'do', 'miley', 'ga', 'gi',
      'stock', 'par', 'se', 'sy', 'ka', 'ki', 'ke', 'ko', 'mein', 'me', 'aur', 'and', 'the', 'is', 'are', 'bhi', 'kuch'
    ]);

    // Cleaned query tokens excluding stop words
    const queryTokens = userMsg
      .replace(/[^a-z0-9\s]/gi, '')
      .split(/\s+/)
      .filter((w) => w.length > 1 && !STOP_WORDS.has(w));

    // 1. SPECIFIC PRODUCT MATCH BY SYNONYMS & CLEAN KEYWORDS (Highest Priority)
    const matchedCatalogItems = catalog.filter((item) => {
      // 1a. Direct synonym match (e.g. "tamatar", "adrak", "ghee", "desieggs", "chaunsa")
      const hasSynonymMatch = item.synonyms.some((syn) => {
        if (syn.length <= 3) {
          // Exact word match for short synonyms like "aam", "seb", "kino"
          return new RegExp(`\\b${syn}\\b`, 'i').test(userMsg);
        }
        return userMsg.includes(syn);
      });

      if (hasSynonymMatch) return true;

      // 1b. Clean query token matching against product name or farmer
      const nameLower = item.name.toLowerCase();
      const farmerLower = item.farmerName.toLowerCase();
      return queryTokens.some(
        (token) => token.length >= 3 && (nameLower.includes(token) || farmerLower.includes(token))
      );
    });

    if (matchedCatalogItems.length > 0) {
      // Pick top matches (up to 4 for product cards)
      const topMatches = matchedCatalogItems.slice(0, 4);

      recommendedProducts = topMatches.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        unit: p.unit,
        image: p.image,
        farmerName: p.farmerName,
        city: p.city,
        organic: p.organic,
        category: p.category
      }));

      // Generate detailed knowledge report for matched product(s)
      const detailedBullets = topMatches
        .map((p) => {
          const discountStr = p.originalPrice
            ? `~~(Rs. ${p.originalPrice})~~ **${Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF!**`
            : '';

          return (
            `📌 **${p.name}** (${p.category})\n` +
            `• 💰 **Price:** Rs. ${p.price} per ${p.unit} ${discountStr}\n` +
            `• 👨‍🌾 **Farmer / Origin:** ${p.farmerName} (${p.farmName} — ${p.district}, ${p.city})\n` +
            `• 📦 **Stock Available:** ${p.stock} units (${p.stock > 0 ? 'In Stock ✅' : 'Out of Stock ❌'})\n` +
            `• 🌱 **Quality Tags:** ${p.organic ? 'Certified Organic 🌿' : 'Fresh Standard 🍏'}, ${
              p.sameDayPickup ? 'Same-Day Pickup 🚚' : '24-48h Delivery'
            }${p.bulkDeal ? ', Bulk Savings Eligible 🏷️' : ''}`
          );
        })
        .join('\n\n');

      if (isUrduOrRoman) {
        reply =
          `**Marco found detailed information for your requested item(s)!** 🎯\n\n${detailedBullets}\n\nNiche product cards se aap direct **Add to Cart** kar sakte hain!`;
      } else {
        reply =
          `**Marco Product Specifications & Knowledge Report:** 🎯\n\n${detailedBullets}\n\nYou can click "Add to Cart" on any product card below to add it directly to your shopping basket!`;
      }

      suggestedActions = [
        'Add to Cart',
        `More in ${topMatches[0].category}`,
        'Check Delivery Schedule',
        'Explore All Products'
      ];
      return NextResponse.json({ reply, recommendedProducts, suggestedActions });
    }

    // 2. DISCOUNT / CHEAPEST / DEALS QUERY
    if (
      userMsg.includes('sasta') ||
      userMsg.includes('cheap') ||
      userMsg.includes('discount') ||
      userMsg.includes('deal') ||
      userMsg.includes('offer') ||
      userMsg.includes('sale') ||
      userMsg.includes('under') ||
      userMsg.includes('less than') ||
      userMsg.includes('saving')
    ) {
      const deals = catalog.filter((p) => p.bulkDeal || (p.originalPrice && p.originalPrice > p.price)).slice(0, 4);

      recommendedProducts = deals.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        unit: p.unit,
        image: p.image,
        farmerName: p.farmerName,
        city: p.city,
        organic: p.organic,
        category: p.category
      }));

      if (isUrduOrRoman) {
        reply =
          `🏷️ **MarketLink Best Discounted Produce & Bulk Deals:**\n\nHum ne local Pakistani farmers se direct sourcing kar ke in top items par special discounts aur bulk pricing arrange ki hai:\n\n` +
          deals
            .map(
              (p) =>
                `• **${p.name}**: Rs. ${p.price} / ${p.unit} ${
                  p.originalPrice ? `~~(Original: Rs. ${p.originalPrice})~~` : ''
                } — *Grown by ${p.farmerName} (${p.city})*`
            )
            .join('\n') +
          `\n\nAap in par click kar ke direct cart mein add kar sakte hain!`;
      } else {
        reply =
          `🏷️ **Marco's Highlighted Deals & Special Discounts:**\n\nHere are farm-direct items currently available with discounted prices and bulk deals:\n\n` +
          deals
            .map(
              (p) =>
                `• **${p.name}**: Rs. ${p.price} / ${p.unit} ${
                  p.originalPrice ? `~~(Original: Rs. ${p.originalPrice})~~` : ''
                } — *Source: ${p.farmerName}, ${p.city}*`
            )
            .join('\n');
      }

      suggestedActions = ['View All Shop Deals', '🥦 Sabziyan Under Rs 200', '🥛 Dairy & Ghee Deals'];
      return NextResponse.json({ reply, recommendedProducts, suggestedActions });
    }

    // 3. DIETARY / ORGANIC / VEGAN QUERY (Only if no specific produce matched)
    if (
      userMsg.includes('organic') ||
      userMsg.includes('vegan') ||
      userMsg.includes('gluten free')
    ) {
      const organicItems = catalog.filter((p) => p.organic).slice(0, 4);

      recommendedProducts = organicItems.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        unit: p.unit,
        image: p.image,
        farmerName: p.farmerName,
        city: p.city,
        organic: p.organic,
        category: p.category
      }));

      if (isUrduOrRoman) {
        reply =
          `🌿 **100% Certified Organic & Chemical-Free Harvests:**\n\nMarketLink par tamatar, carrots, spinach, mangoes, basmati rice, aur ghee bilkul organic tariqay se bina kisi chemical sprays ke ugai jaati hain:\n\n` +
          organicItems
            .map((p) => `• **${p.name}**: Rs. ${p.price} / ${p.unit} — Farmer: ${p.farmerName} (${p.city})`)
            .join('\n');
      } else {
        reply =
          `🌿 **100% Verified Organic & Chemical-Free Produce:**\n\nHere are top certified organic products direct from eco-friendly Pakistani family farms:\n\n` +
          organicItems
            .map((p) => `• **${p.name}**: Rs. ${p.price} / ${p.unit} — Source: ${p.farmerName} (${p.city})`)
            .join('\n');
      }

      suggestedActions = ['Filter Organic Shop', 'Take Grocery Quiz', 'View All Fruits'];
      return NextResponse.json({ reply, recommendedProducts, suggestedActions });
    }

    // 5. CATEGORY SEARCH (Vegetables, Fruits, Dairy, Grains, Herbs)
    let categoryFiltered: StandardProductKnowledge[] = [];
    let catTitle = '';

    if (
      userMsg.includes('sabzi') ||
      userMsg.includes('vegetable') ||
      userMsg.includes('veggie') ||
      userMsg.includes('tarkari')
    ) {
      categoryFiltered = catalog.filter((p) => p.category === 'Organic Vegetables');
      catTitle = '🥦 Organic Fresh Vegetables';
    } else if (
      userMsg.includes('phal') ||
      userMsg.includes('fruit') ||
      userMsg.includes('mango') ||
      userMsg.includes('seasonal')
    ) {
      categoryFiltered = catalog.filter((p) => p.category === 'Fresh Fruits');
      catTitle = '🍎 Farm Fresh Fruits & Seasonals';
    } else if (
      userMsg.includes('doodh') ||
      userMsg.includes('milk') ||
      userMsg.includes('dairy') ||
      userMsg.includes('egg') ||
      userMsg.includes('ghee') ||
      userMsg.includes('paneer')
    ) {
      categoryFiltered = catalog.filter((p) => p.category === 'Dairy & Poultry');
      catTitle = '🥛 Fresh Dairy & Free-Range Poultry';
    } else if (
      userMsg.includes('grain') ||
      userMsg.includes('rice') ||
      userMsg.includes('chawal') ||
      userMsg.includes('atta') ||
      userMsg.includes('daal') ||
      userMsg.includes('pulse')
    ) {
      categoryFiltered = catalog.filter((p) => p.category === 'Grains & Staples');
      catTitle = '🌾 Grains, Atta & Unpolished Pulses';
    } else if (
      userMsg.includes('herb') ||
      userMsg.includes('spice') ||
      userMsg.includes('masala') ||
      userMsg.includes('adrak') ||
      userMsg.includes('haldi')
    ) {
      categoryFiltered = catalog.filter((p) => p.category === 'Seeds & Herbs');
      catTitle = '🌿 Kitchen Herbs & Organic Spices';
    }

    if (categoryFiltered.length > 0) {
      const catSlice = categoryFiltered.slice(0, 4);

      recommendedProducts = catSlice.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        unit: p.unit,
        image: p.image,
        farmerName: p.farmerName,
        city: p.city,
        organic: p.organic,
        category: p.category
      }));

      const itemListSummary = categoryFiltered
        .map((p) => `• **${p.name}**: Rs. ${p.price} / ${p.unit} (${p.farmerName}, ${p.city})`)
        .slice(0, 6)
        .join('\n');

      if (isUrduOrRoman) {
        reply =
          `**${catTitle} Catalog (${categoryFiltered.length} items total):**\n\n${itemListSummary}\n\n*Niche kuch top items show ho rahe hain, jin ko aap cart mein add kar sakte hain!*`;
      } else {
        reply =
          `**${catTitle} Knowledge Summary (${categoryFiltered.length} total items):**\n\n${itemListSummary}\n\n*Below are top recommendations with direct Add to Cart options!*`;
      }

      suggestedActions = ['View All in Shop (/shop)', 'Filter Organic', 'Check Free Delivery Limit'];
      return NextResponse.json({ reply, recommendedProducts, suggestedActions });
    }

    // 6. FARMER & CITY LOCATION QUERY
    if (
      userMsg.includes('karachi') ||
      userMsg.includes('lahore') ||
      userMsg.includes('hyderabad') ||
      userMsg.includes('sargodha') ||
      userMsg.includes('islamabad') ||
      userMsg.includes('gadap') ||
      userMsg.includes('malir') ||
      userMsg.includes('raiwind') ||
      userMsg.includes('bhalwal')
    ) {
      const cityMatches = catalog.filter((p) =>
        userMsg.includes(p.city.toLowerCase()) || userMsg.includes(p.district.toLowerCase())
      );

      if (cityMatches.length > 0) {
        const citySlice = cityMatches.slice(0, 4);
        recommendedProducts = citySlice.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          unit: p.unit,
          image: p.image,
          farmerName: p.farmerName,
          city: p.city,
          organic: p.organic,
          category: p.category
        }));

        if (isUrduOrRoman) {
          reply =
            `📍 **Items Sourced From Local Farms in ${citySlice[0].city} / ${citySlice[0].district}:**\n\n` +
            cityMatches
              .map((p) => `• **${p.name}** (Rs. ${p.price}/${p.unit}) by ${p.farmerName}`)
              .slice(0, 5)
              .join('\n');
        } else {
          reply =
            `📍 **Produce Harvested in ${citySlice[0].city} / ${citySlice[0].district}:**\n\n` +
            cityMatches
              .map((p) => `• **${p.name}** (Rs. ${p.price}/${p.unit}) — Farm: ${p.farmName}`)
              .slice(0, 5)
              .join('\n');
        }

        suggestedActions = ['View Interactive Map Hubs', 'Shop All Local Items', 'Check Delivery Time'];
        return NextResponse.json({ reply, recommendedProducts, suggestedActions });
      }
    }

    // 7. PAGES / ROUTING / SITE HELP
    if (
      userMsg.includes('page') ||
      userMsg.includes('route') ||
      userMsg.includes('link') ||
      userMsg.includes('where') ||
      userMsg.includes('help')
    ) {
      if (isUrduOrRoman) {
        reply =
          '🌐 **MarketLink Navigation Guide:**\n\n1. **`/shop`**: 50+ items filterable by category, city, organic status, same-day pickup.\n2. **`/producers`**: Meet local Pakistani growers (Noor Baloch, Ali Raza, Sana Ahmed, Hamza Khan).\n3. **`/orders` / `/dashboard`**: Real-time order tracking (Pending ➔ Packed ➔ In Transit ➔ Delivered).\n4. **`/farmer`**: Dedicated portal for kisans to sell produce directly.\n5. **`/admin`**: Store revenue & inventory administration.\n6. **`/help`**: Support & FAQs.';
      } else {
        reply =
          '🌐 **MarketLink Complete Site Map & Features:**\n\n1. **`/shop`**: Complete marketplace catalog with search, price filters, and dietary tags.\n2. **`/producers`**: Verified partner farm profiles.\n3. **`/orders`**: Customer order tracking & history.\n4. **`/farmer`**: Farmer onboarding & listing management portal.\n5. **`/admin`**: Analytics & catalog control suite.';
      }
      suggestedActions = ['Go to Shop (/shop)', 'Check My Orders (/orders)', 'Farmer Portal (/farmer)'];
      return NextResponse.json({ reply, recommendedProducts, suggestedActions });
    }

    // 8. DEFAULT SMART FALLBACK - Full Catalog Sample
    const randomSamples = [...catalog].sort(() => 0.5 - Math.random()).slice(0, 4);

    recommendedProducts = randomSamples.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      unit: p.unit,
      image: p.image,
      farmerName: p.farmerName,
      city: p.city,
      organic: p.organic,
      category: p.category
    }));

    if (isUrduOrRoman) {
      reply =
        `Main **Marco (MarketLink AI)** hoon! Main MarketLink ke **tamam ${catalog.length}+ products** (tomatoes, spinach, chaunsa mangoes, kinnow, desi eggs, pure ghee, basmati rice, adrak, etc.) ki 100% price, farmer origin, aur stock detail janta hoon.\n\nAap kisi bhi specific produce, sabzi, phall, dairy item, ya delivery timing ke baare mein poochain!`;
    } else {
      reply =
        `I am **Marco (MarketLink AI)**! I hold 100% detailed knowledge of all **${catalog.length}+ items** in our store (including organic vegetables, fresh fruits, desi dairy, grains, and spices).\n\nFeel free to ask Marco about any specific item's price, stock, farmer source, or delivery schedule!`;
    }

    suggestedActions = [
      '🥦 Organic Vegetables Rates',
      '🍎 Chaunsa Mangoes & Fruits',
      '🥛 Pure Desi Ghee & Milk',
      '🌾 Super Kernel Basmati Rice',
      '🏷️ Highlighted Deals & Savings'
    ];

    return NextResponse.json({
      reply,
      recommendedProducts,
      suggestedActions
    });
  } catch (error: any) {
    console.error('Marco Chat API Error:', error);
    return NextResponse.json(
      { reply: `Marco experienced an error: ${error?.message || String(error)}` },
      { status: 500 }
    );
  }
}


