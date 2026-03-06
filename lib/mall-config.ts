/**
 * ANTIGRAVITY PRODUCT LISTING SKILLS
 * 
 * This configuration defines the product listing intelligence for the Sovereign Mall.
 * Based on Amazon's best practices for product listings, SEO, and customer trust.
 * 
 * Version: 1.0.0
 * Last Updated: 2026-02-25
 */

export const ANTIGRAVITY_MALL_CONFIG = {
  // Mall Identity
  mall: {
    name: 'Sovereign Mall',
    brand: 'Brave Ecom Pvt Ltd',
    tagline: 'Your Premium Shopping Destination',
    description: 'Discover curated products across 15 categories with authentic ratings, genuine reviews, and unbeatable prices.',
  },

  // Image Standards (Based on Amazon 2026 Guidelines)
  imageRequirements: {
    mainImage: {
      background: '#FFFFFF', // Pure white (RGB 255,255,255)
      minPixels: 1000,     // Minimum 1000px on longest side
      recommendedPixels: 2000, // Recommended 2000px for zoom
      maxPixels: 10000,
      fillPercentage: 85,  // Product must fill 85%+ of frame
      formats: ['JPEG', 'PNG', 'TIFF', 'GIF'],
      quality: 85,         // JPEG quality 85
      aspectRatio: '1:1',  // Square preferred
    },
    secondaryImages: {
      maxCount: 9,
      recommendedMix: [
        { type: 'lifestyle', description: 'Product in real-world use' },
        { type: 'angle', description: 'Multiple angles showing details' },
        { type: 'scale', description: 'Size reference with common objects' },
        { type: 'infographic', description: 'Feature callouts with text' },
        { type: 'packaging', description: 'Package contents' },
        { type: 'detail', description: 'Close-up texture/craftsmanship' },
      ],
    },
    prohibited: [
      'Watermarks',
      'Text overlays on main image',
      'Logos/badges on main image',
      'Illustrations/placeholders',
      'Packaging (unless key selling feature)',
      'Props/accessories not sold with product',
    ],
  },

  // SEO Optimization
  seo: {
    titleFormat: '{brand} {productName} - {keyFeature} | {mallName}',
    titleMaxLength: 200,
    descriptionMaxLength: 500,
    bulletPoints: {
      count: 5,
      maxLength: 500,
      format: 'Benefit-first, Feature-second',
    },
    keywords: {
      maxBackend: 249,
      recommendations: [
        'Include primary keyword in title',
        'Use natural language throughout',
        'Include synonyms and variations',
        'Add target market terms (India, online, buy)',
      ],
    },
    imageFileNaming: {
      format: '{SKU}-{variant}-{angle}.jpg',
      example: 'MALL-PRD-00001-black-front.jpg',
      tips: 'Use descriptive, keyword-rich file names for Google image SEO',
    },
  },

  // Review System (Amazon-Inspired)
  reviews: {
    display: {
      showHistogram: true,
      showVerifiedBadge: true,
      showHelpfulVotes: true,
      showPhotos: true,
      showDate: true,
      showOrigin: true, // "Reviewed in India"
    },
    ratingBreakdown: {
      showPercentages: true,
      allowFiltering: true,
    },
    verifiedPurchase: {
      enabled: true,
      badge: 'Verified Purchase',
      color: '#C7511F', // Amazon orange
    },
    helpfulVotes: {
      enabled: true,
      threshold: 10, // Show "Most helpful" above this
    },
    incentives: {
      // Following Amazon TOS - NO incentives for positive reviews
      allowed: [
        'Follow up emails (compliant)',
        'Exceptional product quality',
        'Great customer service',
        'Packaging inserts (non-incentivized)',
      ],
      prohibited: [
        'Paid reviews',
        'Review swaps',
        'Incentivized positive reviews',
        'Fake reviews',
        'Competitor negative reviews',
      ],
    },
    responsePolicy: {
      sellerResponses: true,
      maxDaysToRespond: 7,
      tone: 'Professional and helpful',
    },
  },

  // Pricing & Offers
  pricing: {
    display: {
      showOriginalPrice: true,
      showDiscountPercentage: true,
      showSavings: true,
      showTaxInfo: true,
      showShipping: true,
    },
    badges: {
      valuePick: {
        criteria: 'Best value in category',
        color: '#22C55E', // Green
      },
      trending: {
        criteria: 'High sales velocity',
        color: '#F59E0B', // Amber
      },
      bestseller: {
        criteria: 'Top seller in category',
        color: '#EF4444', // Red
      },
      deal: {
        criteria: 'Limited time offer',
        color: '#8B5CF6', // Purple
      },
    },
  },

  // Trust Signals
  trustSignals: {
    authentic: {
      enabled: true,
      badge: '100% Authentic',
      icon: 'verified',
    },
    securePayments: {
      enabled: true,
      methods: ['Razorpay', 'UPI', 'Cards', 'Net Banking', 'Wallets'],
    },
    easyReturns: {
      enabled: true,
      windowDays: 30,
      badge: 'Easy Returns',
    },
    fastShipping: {
      enabled: true,
      badge: 'Free Shipping',
      threshold: 299,
    },
    customerSupport: {
      enabled: true,
      hours: '24/7',
      channels: ['Chat', 'Phone', 'Email'],
    },
  },

  // Search & Discovery
  search: {
    features: [
      'Real-time suggestions',
      'Popular searches',
      'Category browsing',
      'Filter by price/rating/category',
      'Sort by relevance/price/rating/discount/newest',
    ],
    filters: {
      price: { min: true, max: true, ranges: true },
      rating: { stars: [1, 2, 3, 4, 5] },
      category: true,
      brand: true,
      availability: true,
      deals: true,
    },
  },

  // Product Card Display
  productCard: {
    show: {
      badge: true,
      image: true,
      brand: true,
      name: true,
      rating: true,
      reviews: true,
      originalPrice: true,
      currentPrice: true,
      discount: true,
      valuePick: true,
      prime: false, // Not applicable
    },
    image: {
      aspectRatio: '4:5',
      hoverZoom: true,
      lazyLoad: true,
    },
    cta: {
      primary: 'Add to Cart',
      secondary: 'Quick View',
    },
  },

  // Performance Metrics
  analytics: {
    track: [
      'Impressions',
      'Clicks',
      'Add to Cart',
      'Purchases',
      'Reviews',
      'Questions',
    ],
    targets: {
      minimumRating: 4.0,
      minimumReviews: 10,
      imageQuality: 'High resolution',
      descriptionLength: { min: 100, recommended: 500 },
    },
  },

  // Compliance
  compliance: {
    accurateRepresentation: true,
    prohibitedContent: [
      'Misleading claims',
      'False discounts',
      'Fake reviews',
      'Unauthorized trademarks',
    ],
    categoryRestrictions: {
      enforce: true,
      categories: ['Electronics', 'Beauty', 'Food', 'Health'],
    },
  },
};

export type MallConfig = typeof ANTIGRAVITY_MALL_CONFIG;

export default ANTIGRAVITY_MALL_CONFIG;
