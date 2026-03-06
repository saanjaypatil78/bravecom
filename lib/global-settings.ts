/**
 * GLOBAL SETTINGS - ANTIGRAVITY PLATFORM
 * 
 * Central configuration for the entire Brave Ecom platform.
 * Includes mall settings, SEO, integrations, and platform-wide configurations.
 * 
 * Version: 1.0.0
 * Last Updated: 2026-02-25
 */

export const GLOBAL_SETTINGS = {
  // Platform Identity
  platform: {
    name: 'Brave Ecom',
    fullName: 'Brave Ecom Pvt Ltd',
    tagline: 'Empowering Investors & Shoppers',
    description: 'A multi-functional investment and e-commerce platform combining shopping with 6-Level affiliate marketing opportunities.',
    website: 'https://braveecom.com',
    support: {
      email: 'support@braveecom.com',
      phone: '+91-XXX-XXX-XXXX',
      address: 'India',
    },
    social: {
      facebook: 'https://facebook.com/braveecom',
      instagram: 'https://instagram.com/braveecom',
      twitter: 'https://twitter.com/braveecom',
      youtube: 'https://youtube.com/braveecom',
    },
  },

  // Mall Configuration
  mall: {
    enabled: true,
    name: 'Sovereign Mall',
    tagline: 'Premium Shopping Experience',
    description: 'Discover curated products across 15 categories',
    categories: [
      'Electronics',
      'Fashion',
      'Home & Kitchen',
      'Health & Fitness',
      'Beauty & Personal Care',
      'Automotive',
      'Sports & Outdoors',
      'Books',
      'Toys & Games',
      'Grocery',
      'Pet Supplies',
      'Office Products',
      'Baby Products',
      'Musical Instruments',
      'Garden & Outdoors',
    ],
    features: {
      search: true,
      filters: true,
      sorting: true,
      pagination: true,
      reviews: true,
      ratings: true,
      wishlist: true,
      compare: false,
      recentlyViewed: true,
      recommendations: true,
    },
    display: {
      productsPerPage: 20,
      showOutOfStock: false,
      showDiscounts: true,
      showBadges: true,
    },
    pricing: {
      currency: 'INR',
      symbol: '₹',
      decimal: '.',
      thousand: ',',
      decimalPlaces: 0,
      taxIncluded: true,
      freeShippingThreshold: 299,
    },
    shipping: {
      freeThreshold: 299,
      standardDays: '5-7',
      expressDays: '1-2',
      codEnabled: true,
    },
    returns: {
      windowDays: 30,
      conditions: 'Original packaging required',
      processDays: 7,
    },
  },

  // Authentication
  auth: {
    providers: ['google', 'email-otp'],
    google: {
      enabled: true, // Set to false until credentials added
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    emailOtp: {
      enabled: true,
      fallback: true,
      otpLength: 6,
      otpExpiry: 300, // 5 minutes
      devOtp: '123456', // Only for development
    },
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    userTypes: ['buyer', 'investor'],
    defaultUserType: 'buyer',
  },

  // SEO Configuration
  seo: {
    siteName: 'Brave Ecom',
    siteDescription: 'Multi-functional investment and e-commerce platform',
    defaultMetaImage: '/images/og-default.jpg',
    twitterHandle: '@braveecom',
    locale: 'en_IN',
    currency: 'INR',
    robots: {
      index: true,
      follow: true,
    },
    structuredData: {
      organization: true,
      website: true,
      product: true,
      offer: true,
      review: true,
      breadcrumbList: true,
    },
  },

  // Investor/MLM Configuration
  investor: {
    enabled: true,
    features: {
      referral: true,
      commission: true,
      hierarchy: true,
      earnings: true,
      withdrawal: true,
    },
    tiers: [
      { name: 'Starter', minInvestment: 5000, commission: 5 },
      { name: 'Silver', minInvestment: 25000, commission: 10 },
      { name: 'Gold', minInvestment: 100000, commission: 15 },
      { name: 'Platinum', minInvestment: 500000, commission: 20 },
      { name: 'Diamond', minInvestment: 1000000, commission: 25 },
    ],
    referral: {
      bonus: 1000,
      levels: 5,
      percentagePerLevel: [10, 7, 5, 3, 2],
    },
  },

  // Admin Configuration
  admin: {
    dashboard: {
      aum: true,
      users: true,
      orders: true,
      commissions: true,
      audit: true,
    },
    features: {
      ecosystemMonitor: true,
      systemHealth: true,
      commissionSettings: true,
      franchiseManagement: true,
      aumDashboard: true,
      auditLogs: true,
      disbursementPortal: true,
      treasury: true,
    },
  },

  // API Configuration
  api: {
    version: 'v1',
    rateLimit: {
      enabled: true,
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100,
    },
    cors: {
      enabled: true,
      origins: ['http://localhost:3000'],
    },
  },

  // Feature Flags
  features: {
    mall: true,
    investor: true,
    admin: true,
    auth: true,
    cart: true,
    checkout: true,
    reviews: true,
    ratings: true,
    notifications: true,
    analytics: true,
  },

  // Third-Party Integrations
  integrations: {
    payment: {
      razorpay: {
        enabled: false, // Set to true with credentials
        keyId: process.env.RAZORPAY_KEY_ID || '',
        keySecret: process.env.RAZORPAY_KEY_SECRET || '',
      },
    },
    analytics: {
      googleAnalytics: {
        enabled: false,
        trackingId: process.env.GA_TRACKING_ID || '',
      },
    },
  },

  // Performance
  performance: {
    imageOptimization: true,
    lazyLoading: true,
    caching: {
      enabled: true,
      maxAge: 3600,
    },
    compression: true,
  },

  // Legal & Compliance
  legal: {
    privacyPolicy: '/legal/privacy',
    termsOfService: '/legal/terms',
    refundPolicy: '/legal/refund',
    shippingPolicy: '/legal/shipping',
    gstNumber: 'XXAABBCCDDZZZZ',
  },

  // Development Settings
  development: {
    debug: process.env.NODE_ENV === 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
};

export type GlobalSettings = typeof GLOBAL_SETTINGS;

export default GLOBAL_SETTINGS;
