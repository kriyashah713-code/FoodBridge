import { FoodDonation, PickupRequest, UserProfile } from '../types';

// Standard reference timestamps
const now = new Date();
const inHours = (hours: number) => new Date(now.getTime() + hours * 3600 * 1000).toISOString();
const pastHours = (hours: number) => new Date(now.getTime() - hours * 3600 * 1000).toISOString();

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'donor-1',
    email: 'donor@foodbridge.org',
    full_name: 'Aarav Sharma',
    role: 'donor',
    phone: '+91 98765 43210',
    organization_name: 'Royal Heritage Caterers',
    address: '42 MG Road, Bandra West',
    city: 'Mumbai',
    created_at: pastHours(72)
  },
  {
    id: 'donor-2',
    email: 'bakery@foodbridge.org',
    full_name: 'Priya Mehta',
    role: 'donor',
    phone: '+91 98231 67890',
    organization_name: 'Crust & Crumb Bakery',
    address: '15 Nehru Nagar, Shivaji Park',
    city: 'Pune',
    created_at: pastHours(48)
  },
  {
    id: 'ngo-1',
    email: 'ngo@foodbridge.org',
    full_name: 'Sunita Deshmukh',
    role: 'ngo',
    phone: '+91 97654 32109',
    organization_name: 'Annapurna Seva Trust',
    address: 'Plot 104, Shelter Complex, Andheri East',
    city: 'Mumbai',
    created_at: pastHours(96)
  },
  {
    id: 'ngo-2',
    email: 'hope@foodbridge.org',
    full_name: 'Vikram Joshi',
    role: 'ngo',
    phone: '+91 98111 22334',
    organization_name: 'Hope Foundation Child Care',
    address: '88 Kothrud Link Road',
    city: 'Pune',
    created_at: pastHours(60)
  },
  {
    id: 'admin-1',
    email: 'admin@foodbridge.org',
    full_name: 'Prof. Ramesh Kulkarni (Admin)',
    role: 'admin',
    phone: '+91 99999 88888',
    organization_name: 'FoodBridge Operations',
    address: 'Dept of Computer Engineering, Campus Tech Park',
    city: 'Mumbai',
    created_at: pastHours(120)
  }
];

export const INITIAL_DONATIONS: FoodDonation[] = [
  {
    id: 'donation-101',
    donor_id: 'donor-1',
    donor_name: 'Aarav Sharma (Royal Heritage Caterers)',
    donor_phone: '+91 98765 43210',
    food_name: 'Vegetable Biryani & Dal Makhani',
    category: 'Cooked Meals',
    quantity: 65,
    unit: 'servings',
    dietary_type: 'Vegetarian',
    location: 'Royal Banquet Hall, 42 MG Road, Bandra West',
    city: 'Mumbai',
    preparation_time: pastHours(2),
    safe_pickup_deadline: inHours(4),
    storage_instructions: 'Kept hot in food-grade thermal containers. Consume within 5 hours.',
    description: 'Surplus wedding catering food prepared in clean hygienic facility. Completely untouched and fresh.',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    created_at: pastHours(2)
  },
  {
    id: 'donation-102',
    donor_id: 'donor-2',
    donor_name: 'Priya Mehta (Crust & Crumb Bakery)',
    donor_phone: '+91 98231 67890',
    food_name: 'Artisanal Multigrain Loaves & Croissants',
    category: 'Bakery & Bread',
    quantity: 35,
    unit: 'items',
    dietary_type: 'Vegetarian',
    location: '15 Nehru Nagar, Shivaji Park',
    city: 'Pune',
    preparation_time: pastHours(6),
    safe_pickup_deadline: inHours(14),
    storage_instructions: 'Store in cool dry place away from moisture.',
    description: 'Freshly baked today morning. Includes 20 loaves of sliced whole wheat bread and 15 butter croissants.',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    created_at: pastHours(6)
  },
  {
    id: 'donation-103',
    donor_id: 'donor-1',
    donor_name: 'Aarav Sharma (Royal Heritage Caterers)',
    donor_phone: '+91 98765 43210',
    food_name: 'Fresh Farm Spinach, Cauliflower & Potatoes',
    category: 'Fruits & Vegetables',
    quantity: 40,
    unit: 'kg',
    dietary_type: 'Vegan',
    location: 'Cold Storage Unit 3, Bandra West',
    city: 'Mumbai',
    preparation_time: pastHours(10),
    safe_pickup_deadline: inHours(28),
    storage_instructions: 'Keep in ventilated crates or cold room.',
    description: 'Fresh grade-A surplus raw vegetables delivered from farm today. Perfect for community shelters and kitchens.',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&auto=format&fit=crop&q=80',
    created_at: pastHours(10)
  },
  {
    id: 'donation-104',
    donor_id: 'donor-2',
    donor_name: 'Priya Mehta (Crust & Crumb Bakery)',
    donor_phone: '+91 98231 67890',
    food_name: 'Packaged Steamed Rice & Moong Dal Kits',
    category: 'Raw Ingredients / Groceries',
    quantity: 25,
    unit: 'packets',
    dietary_type: 'Vegetarian',
    location: 'Shivaji Park Distribution Warehouse',
    city: 'Pune',
    preparation_time: pastHours(24),
    safe_pickup_deadline: inHours(72),
    storage_instructions: 'Dry pantry storage.',
    description: 'Sealed dry grocery meal ration kits containing 2kg premium rice and 1kg lentils per pack.',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    created_at: pastHours(24)
  },
  {
    id: 'donation-105',
    donor_id: 'donor-1',
    donor_name: 'Aarav Sharma (Royal Heritage Caterers)',
    donor_phone: '+91 98765 43210',
    food_name: 'Paneer Butter Masala & Jeera Rice',
    category: 'Cooked Meals',
    quantity: 50,
    unit: 'servings',
    dietary_type: 'Vegetarian',
    location: 'Royal Banquet Hall, 42 MG Road, Bandra West',
    city: 'Mumbai',
    preparation_time: pastHours(18),
    safe_pickup_deadline: pastHours(4),
    storage_instructions: 'Kept chilled.',
    description: 'Prepared for corporate luncheon yesterday. Safely stored.',
    status: 'expired',
    image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
    created_at: pastHours(18)
  },
  {
    id: 'donation-106',
    donor_id: 'donor-1',
    donor_name: 'Aarav Sharma (Royal Heritage Caterers)',
    donor_phone: '+91 98765 43210',
    food_name: 'Mixed Fruit Salad Bowls & Fresh Juices',
    category: 'Fruits & Vegetables',
    quantity: 30,
    unit: 'boxes',
    dietary_type: 'Vegan',
    location: 'Royal Kitchen, Bandra West',
    city: 'Mumbai',
    preparation_time: pastHours(4),
    safe_pickup_deadline: inHours(2),
    storage_instructions: 'Refrigerated at 4°C.',
    description: 'Pre-portioned fruit salad containers with watermelon, papaya, kiwi, and pomegranate.',
    status: 'claimed',
    image_url: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=600&auto=format&fit=crop&q=80',
    created_at: pastHours(4)
  }
];

export const INITIAL_REQUESTS: PickupRequest[] = [
  {
    id: 'req-201',
    donation_id: 'donation-106',
    ngo_id: 'ngo-1',
    donor_id: 'donor-1',
    quantity_requested: 30,
    estimated_pickup_time: inHours(1.5),
    message: 'We will distribute these nutritious fruit bowls to children at our Andheri community center.',
    contact_person: 'Sunita Deshmukh',
    contact_phone: '+91 97654 32109',
    status: 'accepted',
    donor_note: 'Pickup confirmed! Our kitchen manager will assist with loading.',
    created_at: pastHours(3),
    donation: INITIAL_DONATIONS[5]
  },
  {
    id: 'req-202',
    donation_id: 'donation-101',
    ngo_id: 'ngo-1',
    donor_id: 'donor-1',
    quantity_requested: 40,
    estimated_pickup_time: inHours(2),
    message: 'Annapurna Seva Trust van is nearby and ready to collect for evening dinner shelter service.',
    contact_person: 'Rohan Patil (Driver/Logistics)',
    contact_phone: '+91 98200 11223',
    status: 'pending',
    created_at: pastHours(1),
    donation: INITIAL_DONATIONS[0]
  }
];

export const INITIAL_CONTACT_MESSAGES = [
  {
    id: 'msg-301',
    name: 'Dr. Anita Rao',
    email: 'anita.rao@healthorg.in',
    subject: 'Partnership for Nutritional Quality Standards',
    message: 'We love FoodBridge initiative! We would like to collaborate on offering safety test kits to food donors.',
    status: 'unread' as const,
    created_at: pastHours(12)
  },
  {
    id: 'msg-302',
    name: 'Karan Singhania',
    email: 'karan@singhaniagroup.com',
    subject: 'Bulk Corporate Cafeteria Onboarding',
    message: 'We have 3 major campus cafeterias in Mumbai and Pune producing daily excess meals. How can we onboard 500+ daily meals?',
    status: 'read' as const,
    created_at: pastHours(36)
  }
];
