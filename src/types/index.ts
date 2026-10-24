// ====================================================================
// FoodBridge TypeScript Definitions
// ====================================================================

export type UserRole = 'donor' | 'ngo' | 'admin';

export type FoodCategory =
  | 'Cooked Meals'
  | 'Raw Ingredients / Groceries'
  | 'Packaged Foods'
  | 'Bakery & Bread'
  | 'Fruits & Vegetables'
  | 'Dairy Products'
  | 'Beverages'
  | 'Other';

export type FoodUnit = 'servings' | 'kg' | 'boxes' | 'packets' | 'liters' | 'trays' | 'items';

export type DietaryType = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Jain' | 'All / Mixed';

export type DonationStatus = 'available' | 'requested' | 'claimed' | 'completed' | 'cancelled' | 'expired';

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  organization_name?: string;
  address?: string;
  city?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface FoodDonation {
  id: string;
  donor_id: string;
  donor_name: string;
  donor_phone?: string;
  food_name: string;
  category: FoodCategory;
  quantity: number;
  unit: FoodUnit;
  dietary_type: DietaryType;
  location: string;
  city: string;
  preparation_time: string;
  safe_pickup_deadline: string;
  storage_instructions?: string;
  description?: string;
  status: DonationStatus;
  image_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface PickupRequest {
  id: string;
  donation_id: string;
  ngo_id: string;
  donor_id: string;
  quantity_requested: number;
  estimated_pickup_time: string;
  message?: string;
  contact_person: string;
  contact_phone: string;
  status: RequestStatus;
  donor_note?: string;
  created_at: string;
  updated_at?: string;
  // Hydrated references for display:
  donation?: FoodDonation;
  ngo_profile?: UserProfile;
  donor_profile?: UserProfile;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'resolved';
  created_at: string;
}

export interface DonationFilters {
  search: string;
  category: string;
  dietaryType: string;
  city: string;
  urgency: 'all' | 'urgent' | 'today';
  status: string;
  sortBy: 'deadline_asc' | 'deadline_desc' | 'newest' | 'quantity_desc';
}
