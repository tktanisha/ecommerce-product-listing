// API Base URLs
export const API_BASE_URL = 'https://dummyjson.com/products';

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '',
  PRODUCT_BY_ID: (id: number) => `/${id}`,
  PRODUCTS_BY_CATEGORY: (category: string) => `/category/${category}`,
  CATEGORY_LIST: '/category-list',
};

// Products Shimmer Cards Count
export const SHIMMER_CARDS_COUNT = 9;

// Sorting Filter Constants
export const SORTING_CONSTANTS = {
  ORDERS: {
    ASCENDING: 'asc',
    DESCENDING: 'desc',
  },

  OPTIONS: [
    { label: 'Price: Low to High', value: 'asc' },
    { label: 'Price: High to Low', value: 'desc' },
  ],

  UI_TEXT: {
    LABEL: 'Sort By:',
    PLACEHOLDER: 'Select Sort Order',
  },
};

// Price Slider Constants
export const PRICE_SLIDER_CONSTANTS = {
  UI_TEXT: {
    HEADING: 'Price Range',
  },

  SLIDER_CONFIG: {
    DEFAULT_MIN: 0,
    DEFAULT_MAX: 1000,
    STEP: 2,
    IS_RANGE: true,
  },
};

// Category Filter Constants
export const CATEGORY_FILTER_CONSTANTS = {
  UI_TEXT: {
    TITLE: 'Categories',
  },

  LIMIT: 10,
};

// Product Card Constants
export const PRODUCT_CARD_CONSTANTS = {
  ON_VIEW_ROUTE: '/products',
};

// Products Constants
export const PRODUCTS_CONSTANTS = {
  DEFAULT_LIMIT: 9,
  DEFAULT_SKIP: 0,
  DEFAULT_SORT_BY: 'price',

  NO_PRODUCTS_FOUND_MSG: 'No products found.',
  FETCH_ERROR_MSG: 'Error occurred while fetching products.',

  NO_RESULTS_IMAGE:
    'https://media.geeksforgeeks.org/auth-dashboard-uploads/not_found.svg',
  NO_RESULTS_ALT: 'No Products Found',
  NO_RESULTS_TEXT: 'No products found',
  CLEAR_FILTERS_BUTTON: 'Clear Filters',
};


// Product Details Constants
export const PRODUCT_DETAILS_CONSTANTS = {
  ROUTES: {
    PRODUCTS: '/products',
    PRODUCT_NOT_FOUND: '/product-not-found',
  },
  UI_TEXT: {
    ADD_TO_CART_BUTTON: 'Add to Cart',
  },
};

// NOT FOUND Constants
export const PAGE_NOT_FOUND_CONSTANTS = {
  UI_TEXT: {
    MESSAGE: '404 - Page Not Found',
    IMAGE: 'https://media.geeksforgeeks.org/auth-dashboard-uploads/not_found.svg',
    ALT: 'Page Not Found',
  },
};