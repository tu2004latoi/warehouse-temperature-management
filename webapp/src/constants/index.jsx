// constants/index.js
export const CATEGORIES = ['all', 'Smartphone', 'Laptop', 'Headphones', 'Camera', 'Watch'];

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
  { id: 'products', label: 'Quản lý sản phẩm', icon: 'Package' },
  { id: 'analytics', label: 'Thống kê', icon: 'BarChart3' },
  { id: 'users', label: 'Người dùng', icon: 'Users' },
  { id: 'settings', label: 'Cài đặt', icon: 'Settings' }
];

export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  OUT_OF_STOCK: 'out-of-stock'
};

export const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    category: 'Smartphone',
    price: 29990000,
    stock: 25,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=150&h=150&fit=crop',
    brand: 'Apple',
    rating: 4.8,
    sales: 156
  },
  {
    id: 2,
    name: 'MacBook Pro M3',
    category: 'Laptop',
    price: 52990000,
    stock: 12,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=150&h=150&fit=crop',
    brand: 'Apple',
    rating: 4.9,
    sales: 89
  },
  {
    id: 3,
    name: 'AirPods Pro 2',
    category: 'Headphones',
    price: 6990000,
    stock: 0,
    status: 'out-of-stock',
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=150&h=150&fit=crop',
    brand: 'Apple',
    rating: 4.7,
    sales: 234
  },
  {
    id: 4,
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Smartphone',
    price: 31990000,
    stock: 18,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=150&h=150&fit=crop',
    brand: 'Samsung',
    rating: 4.6,
    sales: 143
  },
  {
    id: 5,
    name: 'Canon EOS R6 Mark II',
    category: 'Camera',
    price: 67990000,
    stock: 8,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=150&h=150&fit=crop',
    brand: 'Canon',
    rating: 4.8,
    sales: 67
  }
];