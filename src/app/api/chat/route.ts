import { NextResponse } from 'next/server';
import { DISCOVERY_PRODUCTS } from '@/lib/discovery-data';
import { INITIAL_PRODUCTS } from '@/lib/data';

interface ChatRequest {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

// All combined products for Marco's complete knowledge base
const ALL_CATALOG_PRODUCTS = [
  ...DISCOVERY_PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    unit: p.unit,
    image: p.image,
    farmerName: p.farmer.name,
    city: p.farmer.city,
    organic: p.organic,
    category: p.category,
    stock: p.stock,
  })),
  ...INITIAL_PRODUCTS.map((p) => ({
    id: `init-${p.id}`,
    name: p.name,
    slug: p.slug,
    price: Math.round(p.price * 280),
    unit: p.unit,
    image: p.image_url,
    farmerName: p.producer_name || 'Partner Farm',
    city: 'Pakistan',
    organic: p.dietary_tags.toLowerCase().includes('organic'),
    category: 'Specialty & Artisan',
    stock: 25,
  })),
];

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const userMsg = (body.message || '').trim().toLowerCase();

    if (!userMsg) {
      return NextResponse.json(
        {
          reply:
            'Assalam-o-Alaikum! Main Marco hoon, MarketLink ka AI Shopping & Support Assistant. Main aap ki kya madad kar sakta hoon?',
        },
        { status: 400 }
      );
    }

    let reply = '';
    let recommendedProducts: any[] = [];
    let suggestedActions: string[] = [];

    // Language & Greeting detection
    const isUrduOrRoman = /salam|assalam|kaise|kya|shukriya|shukriyaa|madad|hai|hain|chahiye|miley|chahye|karna|karu|meharbani|yar|bhai|batao|bataen|kahan|kaise/i.test(
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
          '**Assalam-o-Alaikum! Main Marco hoon 👋**\n\nMain MarketLink ka Official AI Assistant hoon. Main aap ki MarketLink ke pure platform par madad kar sakta hoon:\n\n• 🥦 **Fresh Farm Produce:** 50+ organic sabziyan, phall, desi eggs, farm milk, basmati rice, etc.\n• 🚚 **Delivery Hubs:** Karachi, Lahore, Islamabad, Peshawar, Quetta, Multan & Hyderabad.\n• 👨‍🌾 **Farmer Network:** Direct local Pakistani growers se rabta.\n• 📦 **Orders & Account:** Order tracking, cart update, aur quiz guide.\n\nAap Marco se kuch bhi pooch sakte hain!';
      } else {
        reply =
          '**Hello! I am Marco, your MarketLink AI Assistant 👋**\n\nI have complete knowledge of our farm-to-table platform across Pakistan:\n\n• 🥦 **Products & Catalog:** 50+ organic vegetables, fruits, dairy, meats, grains & spices.\n• 🚚 **Delivery Logistics:** Hubs in Karachi, Lahore, Islamabad, Peshawar, Quetta, Multan & Hyderabad.\n• 👨‍🌾 **Farmers & Producers:** Direct sourcing from verified local growers.\n• 🛒 **Site Features:** Shop filters, Cart drawer, Order tracking (/dashboard), Farmer Portal (/farmer), & Admin Suite (/admin).\n\nHow can Marco assist you today?';
      }
      suggestedActions = [
        '🥦 Browse Organic Vegetables',
        '🍎 View Fruits & Mangoes',
        '🚚 Delivery Routes & Timing',
        '👨‍🌾 Join as a Farmer',
      ];
      return NextResponse.json({ reply, recommendedProducts, suggestedActions });
    }

    // 2. QUIZ / PREFERENCES HELP
    if (
      userMsg.includes('quiz') ||
      userMsg.includes('preference') ||
      userMsg.includes('custom') ||
      userMsg.includes('recommend') ||
      userMsg.includes('diet')
    ) {
      if (isUrduOrRoman) {
        reply =
          '🎯 **MarketLink Grocery Quiz Feature:**\n\nAap website ke top header par **"Take Grocery Quiz"** button par click kar ke apne ghar ki dietary preferences (Organic, Vegan, Gluten-Free) aur ZIP code set kar sakte hain. Is se Marco aur MarketLink aap ki pasand ke mutabiq best weekly harvest suggest karenge!';
      } else {
        reply =
          '🎯 **Personalized Grocery Quiz:**\n\nYou can click **"Take Grocery Quiz"** in our header to set your ZIP code, dietary tags (Organic, Vegan, Gluten-Free), and household size. This helps us customize your weekly fresh harvest drops!';
      }
      suggestedActions = ['Start Shop Search', 'View Organic Items', 'Delivery Cities'];
      return NextResponse.json({ reply, recommendedProducts, suggestedActions });
    }

    // 3. PAGES & SITE NAVIGATION HELP
    if (
      userMsg.includes('page') ||
      userMsg.includes('route') ||
      userMsg.includes('link') ||
      userMsg.includes('where') ||
      userMsg.includes('where is') ||
      userMsg.includes('section') ||
      userMsg.includes('map')
    ) {
      if (isUrduOrRoman) {
        reply =
          '🌐 **MarketLink Full Website Navigation Guide:**\n\n1. **`/` (Home Page):** Video Carousel, Timeline Story, About Us, Certified Farmers, aur Interactive Pakistan Leaflet Map Hubs (Karachi, Lahore, Islamabad, etc.).\n2. **`/shop` (Marketplace):** 50+ items filterable by category, city, organic status, same-day pickup, aur bulk deals.\n3. **`/producers` (Farmers Directory):** Local Pakistani growers ki stories aur un ki specialty produce.\n4. **`/dashboard` (My Account):** Live order status tracking (Pending, Packed, In Transit, Delivered), address, & subscription.\n5. **`/farmer` (Farmer Portal):** Kisano ke liye product listing, stock management, aur payouts portal.\n6. **`/admin` (Admin Control Suite):** Website gross revenue, stock alerts, aur user control dashboard.\n7. **`/help` (Support Center):** FAQs, return policy, aur customer care details.';
      } else {
        reply =
          '🌐 **MarketLink Complete Site Map & Features:**\n\n1. **`/` (Home):** Video Hero, Farm Timeline, Weekly Harvest Drops, Certified Farmers Strip, and Interactive Pakistan Map Hubs.\n2. **`/shop` (Shop):** Full catalog search with city radius filters, price sorting, and organic toggles.\n3. **`/producers` (Farms Directory):** Meet our verified local growers across Pakistan.\n4. **`/dashboard` (Customer Dashboard):** Order status tracking, order history, and account settings.\n5. **`/farmer` (Farmer Portal):** Dedicated portal for growers to list produce and withdraw earnings.\n6. **`/admin` (Admin Suite):** Operations management, revenue analytics, and catalog controls.\n7. **`/help` (Help Desk):** FAQs, shipping policies, and support team contact.';
      }
      suggestedActions = [
        'Go to Shop (/shop)',
        'Go to Farmer Portal (/farmer)',
        'Check My Orders (/dashboard)',
      ];
      return NextResponse.json({ reply, recommendedProducts, suggestedActions });
    }

    // 4. FARMERS / PRODUCERS SPECIFIC QUERY
    if (
      userMsg.includes('farmer') ||
      userMsg.includes('producer') ||
      userMsg.includes('noor') ||
      userMsg.includes('ali') ||
      userMsg.includes('sana') ||
      userMsg.includes('hamza') ||
      userMsg.includes('maryam') ||
      userMsg.includes('farah') ||
      userMsg.includes('kisan') ||
      userMsg.includes('grower')
    ) {
      if (
        userMsg.includes('join') ||
        userMsg.includes('register') ||
        userMsg.includes('bechna') ||
        userMsg.includes('sell')
      ) {
        if (isUrduOrRoman) {
          reply =
            '👨‍🌾 **Marco Guide for Pakistani Farmers & Producers:**\n\nAgar aap ek kisan hain, toh MarketLink par 0% middleman commission ke sath apne fruits, vegetables, dairy, ya grains direct hazaron buyers ko bechein.\n\n• **Direct Payouts:** Bank account ya EasyPaisa mein instant payment.\n• **Cold-Chain Logistics:** District level pickup assistance.\n\nRegister karne ke liye `/farmer` Portal par jayein!';
        } else {
          reply =
            '👨‍🌾 **Become a Certified MarketLink Partner Farmer:**\n\nGrowers & artisanal producers in Pakistan keep 100% of their fair margins with ZERO middleman cuts.\n\n• Direct payout options via Bank / EasyPaisa.\n• Cold-chain pickup arranged directly from your farm location.\n\nVisit our Farmer Suite at `/farmer` to get started!';
        }
      } else {
        if (isUrduOrRoman) {
          reply =
            '🌾 **MarketLink Key Partner Farmers:**\n\n• **Noor Baloch** (Gadap, Karachi) - Organic Vegetables & Tomatoes\n• **Ali Raza** (Malir Green Acres, Karachi) - Leafy greens & root veggies\n• **Sana Ahmed** (Sindh Orchard Co-op, Hyderabad) - Chaunsa Mangoes & Guava\n• **Hamza Khan** (Potohar Dairy, Raiwind Lahore) - Desi Eggs, Milk, Basmati Rice & Atta\n• **Maryam Bibi** (Sargodha Citrus Grove, Bhalwal) - Sargodha Kinnow Oranges\n• **Farah Iqbal** (Green Basket Collective, Karachi) - Herbs, Chillies & Turmeric';
        } else {
          reply =
            '🌾 **Featured Pakistani Partner Farmers:**\n\n• **Noor Baloch** (Gadap, Karachi) – Organic Tomatoes & Vegetables\n• **Ali Raza** (Malir, Karachi) – Fresh Spinach & Red Potatoes\n• **Sana Ahmed** (Hyderabad) – Chaunsa Mangoes & Soft Dates\n• **Hamza Khan** (Lahore/Potohar) – Free-Range Eggs, Milk & Basmati Rice\n• **Maryam Bibi** (Sargodha) – Sun-Ripened Kinnow Oranges\n• **Farah Iqbal** (Gadap) – Fresh Herbs, Mint & Turmeric Root';
        }
      }
      suggestedActions = [
        'Visit Farmer Portal (/farmer)',
        'Explore Producers Page (/producers)',
        'Shop Organic Produce',
      ];
      return NextResponse.json({ reply, recommendedProducts, suggestedActions });
    }

    // 5. DELIVERY / LOGISTICS / CITIES
    if (
      userMsg.includes('delivery') ||
      userMsg.includes('ship') ||
      userMsg.includes('city') ||
      userMsg.includes('karachi') ||
      userMsg.includes('lahore') ||
      userMsg.includes('islamabad') ||
      userMsg.includes('peshawar') ||
      userMsg.includes('quetta') ||
      userMsg.includes('multan') ||
      userMsg.includes('hyderabad') ||
      userMsg.includes('charges') ||
      userMsg.includes('timing')
    ) {
      if (isUrduOrRoman) {
        reply =
          '🚚 **Marco Delivery & Coverage Guide:**\n\n• **Supported Delivery Cities:** Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Quetta, Multan, & Hyderabad.\n• **Speed:** Standard delivery 24–48 hours direct from farms in thermal packaging.\n• **Same-Day Express:** Available in Karachi & Lahore hubs for select morning harvests.\n• **Free Shipping:** Rs. 1,500 se zyada ke orders par FREE delivery!';
      } else {
        reply =
          '🚚 **Marco Logistics & Delivery Guide:**\n\n• **Active Hub Cities:** Karachi, Lahore, Islamabad/Rawalpindi, Peshawar, Quetta, Multan, and Hyderabad.\n• **Delivery Speed:** Direct farm-to-table delivery within 24 to 48 hours.\n• **Same-Day Pickup/Delivery:** Operating in Karachi & Lahore hubs.\n• **Free Delivery:** Applies automatically on all orders above Rs. 1,500.';
      }
      suggestedActions = [
        'Check Shop Products',
        'View Interactive Map Hubs',
        'Track My Order',
      ];
      return NextResponse.json({ reply, recommendedProducts, suggestedActions });
    }

    // 6. ORDER TRACKING & PAYMENT METHODS
    if (
      userMsg.includes('order') ||
      userMsg.includes('track') ||
      userMsg.includes('status') ||
      userMsg.includes('payment') ||
      userMsg.includes('cod') ||
      userMsg.includes('cash') ||
      userMsg.includes('easypaisa') ||
      userMsg.includes('jazzcash') ||
      userMsg.includes('cart')
    ) {
      if (isUrduOrRoman) {
        reply =
          '📦 **Orders & Payment Options:**\n\n• **Order Status Tracker:** Aap Dashboard page `/dashboard` par live status dekhein (Pending ➔ Packed ➔ In Transit ➔ Ready to Ship ➔ Delivered).\n• **Payment Methods:** Cash on Delivery (COD), EasyPaisa, JazzCash Mobile Wallet, aur Credit/Debit Cards.\n• **Cart Management:** Right-side Cart Drawer se items ki quantity change karein ya discount coupons lagayein.';
      } else {
        reply =
          '📦 **Order & Payment Information:**\n\n• **Live Order Tracking:** Visit your `/dashboard` to view real-time status updates (Pending ➔ Packed ➔ In Transit ➔ Delivered).\n• **Payment Modes:** Cash on Delivery (COD), EasyPaisa, JazzCash, and Visa/MasterCard payments.\n• **Cart Drawer:** Click the cart icon anytime to review items, edit quantities, or proceed to checkout.';
      }
      suggestedActions = ['Go to My Dashboard', 'Open Cart Drawer', 'Browse Shop'];
      return NextResponse.json({ reply, recommendedProducts, suggestedActions });
    }

    // 7. PRODUCT SEARCH & MATCHING IN CATALOG (50+ ITEMS)
    const matchedProducts = ALL_CATALOG_PRODUCTS.filter((p) => {
      const pName = p.name.toLowerCase();
      const pCat = p.category.toLowerCase();
      const pFarmer = p.farmerName.toLowerCase();
      const pCity = p.city.toLowerCase();

      return userMsg
        .split(' ')
        .some(
          (word) =>
            word.length > 2 &&
            (pName.includes(word) ||
              pCat.includes(word) ||
              pFarmer.includes(word) ||
              pCity.includes(word))
        );
    });

    if (
      matchedProducts.length > 0 ||
      userMsg.includes('fruit') ||
      userMsg.includes('sabzi') ||
      userMsg.includes('vegetable') ||
      userMsg.includes('item') ||
      userMsg.includes('buy') ||
      userMsg.includes('daal') ||
      userMsg.includes('milk') ||
      userMsg.includes('egg') ||
      userMsg.includes('rice') ||
      userMsg.includes('mango') ||
      userMsg.includes('kinnow') ||
      userMsg.includes('chicken') ||
      userMsg.includes('honey')
    ) {
      let displayProducts =
        matchedProducts.length > 0 ? matchedProducts : ALL_CATALOG_PRODUCTS;

      if (userMsg.includes('sabzi') || userMsg.includes('vegetable')) {
        displayProducts = ALL_CATALOG_PRODUCTS.filter(
          (p) => p.category === 'Organic Vegetables'
        );
      } else if (
        userMsg.includes('phal') ||
        userMsg.includes('fruit') ||
        userMsg.includes('mango') ||
        userMsg.includes('kinnow')
      ) {
        displayProducts = ALL_CATALOG_PRODUCTS.filter(
          (p) => p.category === 'Fresh Fruits'
        );
      } else if (
        userMsg.includes('doodh') ||
        userMsg.includes('milk') ||
        userMsg.includes('egg') ||
        userMsg.includes('anda') ||
        userMsg.includes('paneer') ||
        userMsg.includes('butter') ||
        userMsg.includes('chicken')
      ) {
        displayProducts = ALL_CATALOG_PRODUCTS.filter(
          (p) => p.category === 'Dairy & Poultry'
        );
      } else if (
        userMsg.includes('chawal') ||
        userMsg.includes('rice') ||
        userMsg.includes('atta') ||
        userMsg.includes('daal') ||
        userMsg.includes('grain')
      ) {
        displayProducts = ALL_CATALOG_PRODUCTS.filter(
          (p) => p.category === 'Grains & Staples'
        );
      } else if (
        userMsg.includes('spice') ||
        userMsg.includes('herb') ||
        userMsg.includes('chill') ||
        userMsg.includes('turmeric') ||
        userMsg.includes('mint')
      ) {
        displayProducts = ALL_CATALOG_PRODUCTS.filter(
          (p) => p.category === 'Seeds & Herbs'
        );
      }

      recommendedProducts = displayProducts.slice(0, 4);

      if (isUrduOrRoman) {
        reply =
          '**Marco found these fresh farm items matching your request!** Aap inko direct niche Add to Cart button se khareed sakte hain:';
      } else {
        reply =
          '**Marco found these top fresh produce items for you!** Click "Add to Cart" directly below to add them to your basket:';
      }
      suggestedActions = [
        'View All Items in Shop (/shop)',
        'Filter Organic Items',
        'Check Delivery Time',
      ];
      return NextResponse.json({ reply, recommendedProducts, suggestedActions });
    }

    // 8. GENERAL SMART FALLBACK BY MARCO
    if (isUrduOrRoman) {
      reply =
        'Main **Marco (MarketLink AI)** hoon! Main aap ko MarketLink ke product catalog (sabziyan, phall, dairy, grains), order status (/dashboard), delivery hub timings, aur farmer portal (/farmer) ke baare mein Mukammal Information de sakta hoon.\n\nAap Marco se kya poochna chahte hain?';
    } else {
      reply =
        "I am **Marco (MarketLink AI)**! I have full access to MarketLink's 50+ product catalog, live delivery hubs, order tracking (/dashboard), farmer registration (/farmer), and store features.\n\nWhat can Marco help you discover right now?";
    }

    suggestedActions = [
      '🥦 Organic Vegetables',
      '🍎 Fresh Fruits & Mangoes',
      '🚚 Delivery Hubs & Timing',
      '👨‍🌾 Become a Farmer Partner',
      '🌐 Website Features & Pages',
    ];

    return NextResponse.json({
      reply,
      recommendedProducts,
      suggestedActions,
    });
  } catch (error: any) {
    console.error('Marco Chat API Error:', error);
    return NextResponse.json(
      { reply: 'Marco experienced a quick connection hiccup. Please ask again!' },
      { status: 500 }
    );
  }
}
