import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  ContactMessage,
  DonationFilters,
  DonationStatus,
  FoodDonation,
  PickupRequest,
  RequestStatus,
  UserProfile
} from '../types';
import {
  INITIAL_CONTACT_MESSAGES,
  INITIAL_DONATIONS,
  INITIAL_PROFILES,
  INITIAL_REQUESTS
} from '../data/mockData';

// Local storage keys for standalone / demo / unconfigured mode
const STORAGE_KEYS = {
  PROFILES: 'foodbridge_profiles_v1',
  DONATIONS: 'foodbridge_donations_v1',
  REQUESTS: 'foodbridge_requests_v1',
  MESSAGES: 'foodbridge_messages_v1'
};

// Helper to load localStorage with initial fallback
function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(raw);
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error('LocalStorage write failed', err);
  }
}

// Check and mark expired items
function evaluateExpiredItems(donations: FoodDonation[]): FoodDonation[] {
  const currentTime = new Date().getTime();
  let changed = false;

  const updated = donations.map((item) => {
    const deadlineTime = new Date(item.safe_pickup_deadline).getTime();
    if (currentTime > deadlineTime && (item.status === 'available' || item.status === 'requested')) {
      changed = true;
      return { ...item, status: 'expired' as DonationStatus };
    }
    return item;
  });

  return changed ? updated : donations;
}

// ====================================================================
// DONATIONS API
// ====================================================================

export const getDonations = async (filters?: Partial<DonationFilters>): Promise<FoodDonation[]> => {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('donations').select('*');

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters?.dietaryType && filters.dietaryType !== 'all') {
        query = query.eq('dietary_type', filters.dietaryType);
      }
      if (filters?.city && filters.city.trim() !== '') {
        query = query.ilike('city', `%${filters.city.trim()}%`);
      }
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;

      let results: FoodDonation[] = data || [];

      // Check client-side expiry
      results = evaluateExpiredItems(results);

      // Client-side text filter if needed
      if (filters?.search && filters.search.trim()) {
        const q = filters.search.toLowerCase();
        results = results.filter(
          (d) =>
            d.food_name.toLowerCase().includes(q) ||
            d.location.toLowerCase().includes(q) ||
            d.city.toLowerCase().includes(q) ||
            d.donor_name.toLowerCase().includes(q) ||
            (d.description && d.description.toLowerCase().includes(q))
        );
      }

      return results;
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local dataset:', err);
    }
  }

  // Local fallback
  let items = getLocal<FoodDonation[]>(STORAGE_KEYS.DONATIONS, INITIAL_DONATIONS);
  items = evaluateExpiredItems(items);
  setLocal(STORAGE_KEYS.DONATIONS, items);

  if (filters) {
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (d) =>
          d.food_name.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q) ||
          d.donor_name.toLowerCase().includes(q) ||
          (d.description && d.description.toLowerCase().includes(q))
      );
    }
    if (filters.category && filters.category !== 'all') {
      items = items.filter((d) => d.category === filters.category);
    }
    if (filters.dietaryType && filters.dietaryType !== 'all') {
      items = items.filter((d) => d.dietary_type === filters.dietaryType);
    }
    if (filters.city && filters.city.trim() !== '') {
      items = items.filter((d) => d.city.toLowerCase().includes(filters.city!.toLowerCase()));
    }
    if (filters.status && filters.status !== 'all') {
      items = items.filter((d) => d.status === filters.status);
    }
    if (filters.urgency && filters.urgency !== 'all') {
      const now = new Date().getTime();
      if (filters.urgency === 'urgent') {
        // Less than 3 hours left
        items = items.filter((d) => {
          const diffHours = (new Date(d.safe_pickup_deadline).getTime() - now) / (1000 * 3600);
          return diffHours > 0 && diffHours <= 3;
        });
      } else if (filters.urgency === 'today') {
        items = items.filter((d) => {
          const diffHours = (new Date(d.safe_pickup_deadline).getTime() - now) / (1000 * 3600);
          return diffHours > 0 && diffHours <= 24;
        });
      }
    }

    if (filters.sortBy === 'deadline_asc') {
      items.sort((a, b) => new Date(a.safe_pickup_deadline).getTime() - new Date(b.safe_pickup_deadline).getTime());
    } else if (filters.sortBy === 'deadline_desc') {
      items.sort((a, b) => new Date(b.safe_pickup_deadline).getTime() - new Date(a.safe_pickup_deadline).getTime());
    } else if (filters.sortBy === 'quantity_desc') {
      items.sort((a, b) => b.quantity - a.quantity);
    } else {
      // newest
      items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }

  return items;
};

export const getDonationById = async (id: string): Promise<FoodDonation | null> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('donations').select('*').eq('id', id).single();
      if (!error && data) {
        const [updated] = evaluateExpiredItems([data]);
        return updated;
      }
    } catch (err) {
      console.warn('Supabase fetchById error:', err);
    }
  }

  const items = getLocal<FoodDonation[]>(STORAGE_KEYS.DONATIONS, INITIAL_DONATIONS);
  const found = items.find((d) => d.id === id);
  if (!found) return null;
  const [evaluated] = evaluateExpiredItems([found]);
  return evaluated;
};

export const createDonation = async (
  donation: Omit<FoodDonation, 'id' | 'created_at' | 'status'>
): Promise<FoodDonation> => {
  const newDonation: FoodDonation = {
    ...donation,
    id: 'donation-' + Math.random().toString(36).substring(2, 9),
    status: 'available',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('donations')
        .insert([{
          donor_id: donation.donor_id,
          donor_name: donation.donor_name,
          donor_phone: donation.donor_phone,
          food_name: donation.food_name,
          category: donation.category,
          quantity: donation.quantity,
          unit: donation.unit,
          dietary_type: donation.dietary_type,
          location: donation.location,
          city: donation.city,
          preparation_time: donation.preparation_time,
          safe_pickup_deadline: donation.safe_pickup_deadline,
          storage_instructions: donation.storage_instructions,
          description: donation.description,
          image_url: donation.image_url,
          status: 'available'
        }])
        .select()
        .single();

      if (!error && data) {
        return data as FoodDonation;
      }
      console.error('Supabase createDonation error:', error);
    } catch (err) {
      console.warn('Supabase createDonation failed:', err);
    }
  }

  // Local fallback
  const items = getLocal<FoodDonation[]>(STORAGE_KEYS.DONATIONS, INITIAL_DONATIONS);
  items.unshift(newDonation);
  setLocal(STORAGE_KEYS.DONATIONS, items);
  return newDonation;
};

export const updateDonation = async (
  id: string,
  updates: Partial<FoodDonation>
): Promise<FoodDonation | null> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('donations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase updateDonation error:', err);
    }
  }

  const items = getLocal<FoodDonation[]>(STORAGE_KEYS.DONATIONS, INITIAL_DONATIONS);
  const idx = items.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...updates, updated_at: new Date().toISOString() };
  setLocal(STORAGE_KEYS.DONATIONS, items);
  return items[idx];
};

export const deleteDonation = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('donations').delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase deleteDonation error:', err);
    }
  }

  const items = getLocal<FoodDonation[]>(STORAGE_KEYS.DONATIONS, INITIAL_DONATIONS);
  const filtered = items.filter((d) => d.id !== id);
  setLocal(STORAGE_KEYS.DONATIONS, filtered);
  return true;
};

// ====================================================================
// PICKUP REQUESTS API
// ====================================================================

export const getPickupRequests = async (params?: {
  donor_id?: string;
  ngo_id?: string;
}): Promise<PickupRequest[]> => {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('pickup_requests').select(`
        *,
        donation:donations(*),
        ngo_profile:profiles!pickup_requests_ngo_id_fkey(*),
        donor_profile:profiles!pickup_requests_donor_id_fkey(*)
      `);

      if (params?.donor_id) query = query.eq('donor_id', params.donor_id);
      if (params?.ngo_id) query = query.eq('ngo_id', params.ngo_id);

      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase getPickupRequests error:', err);
    }
  }

  let list = getLocal<PickupRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  const allDonations = getLocal<FoodDonation[]>(STORAGE_KEYS.DONATIONS, INITIAL_DONATIONS);

  // Hydrate donations
  list = list.map((req) => ({
    ...req,
    donation: req.donation || allDonations.find((d) => d.id === req.donation_id)
  }));

  if (params?.donor_id) {
    list = list.filter((r) => r.donor_id === params.donor_id);
  }
  if (params?.ngo_id) {
    list = list.filter((r) => r.ngo_id === params.ngo_id);
  }

  return list;
};

export const createPickupRequest = async (
  request: Omit<PickupRequest, 'id' | 'created_at' | 'status'>
): Promise<PickupRequest> => {
  // First verify donation is not expired or claimed
  const donation = await getDonationById(request.donation_id);
  if (!donation) throw new Error('Donation listing not found');

  if (donation.status === 'expired') {
    throw new Error('This donation has expired and cannot receive pickup requests.');
  }
  if (donation.status === 'claimed' || donation.status === 'completed') {
    throw new Error('This donation has already been claimed or fulfilled.');
  }

  const newReq: PickupRequest = {
    ...request,
    id: 'req-' + Math.random().toString(36).substring(2, 9),
    status: 'pending',
    created_at: new Date().toISOString(),
    donation
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('pickup_requests')
        .insert([{
          donation_id: request.donation_id,
          ngo_id: request.ngo_id,
          donor_id: request.donor_id,
          quantity_requested: request.quantity_requested,
          estimated_pickup_time: request.estimated_pickup_time,
          message: request.message,
          contact_person: request.contact_person,
          contact_phone: request.contact_phone,
          status: 'pending'
        }])
        .select(`
          *,
          donation:donations(*)
        `)
        .single();

      if (!error && data) {
        // Mark donation as requested
        await updateDonation(request.donation_id, { status: 'requested' });
        return data as PickupRequest;
      }
    } catch (err) {
      console.warn('Supabase createPickupRequest error:', err);
    }
  }

  // Local fallback
  const requests = getLocal<PickupRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  requests.unshift(newReq);
  setLocal(STORAGE_KEYS.REQUESTS, requests);

  // Update donation status to requested
  await updateDonation(request.donation_id, { status: 'requested' });

  return newReq;
};

export const updatePickupRequestStatus = async (
  requestId: string,
  status: RequestStatus,
  donorNote?: string
): Promise<PickupRequest | null> => {
  if (isSupabaseConfigured) {
    try {
      const updates: Record<string, unknown> = { status };
      if (donorNote !== undefined) updates.donor_note = donorNote;

      const { data, error } = await supabase
        .from('pickup_requests')
        .update(updates)
        .eq('id', requestId)
        .select(`*, donation:donations(*)`)
        .single();

      if (!error && data) {
        // If accepted -> mark donation as claimed
        if (status === 'accepted') {
          await updateDonation(data.donation_id, { status: 'claimed' });
        } else if (status === 'completed') {
          await updateDonation(data.donation_id, { status: 'completed' });
        } else if (status === 'rejected' || status === 'cancelled') {
          await updateDonation(data.donation_id, { status: 'available' });
        }
        return data as PickupRequest;
      }
    } catch (err) {
      console.warn('Supabase updatePickupRequestStatus error:', err);
    }
  }

  const requests = getLocal<PickupRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) return null;

  requests[idx] = {
    ...requests[idx],
    status,
    ...(donorNote !== undefined ? { donor_note: donorNote } : {}),
    updated_at: new Date().toISOString()
  };
  setLocal(STORAGE_KEYS.REQUESTS, requests);

  // Update associated donation status
  const donationId = requests[idx].donation_id;
  if (status === 'accepted') {
    await updateDonation(donationId, { status: 'claimed' });
  } else if (status === 'completed') {
    await updateDonation(donationId, { status: 'completed' });
  } else if (status === 'rejected' || status === 'cancelled') {
    await updateDonation(donationId, { status: 'available' });
  }

  return requests[idx];
};

// ====================================================================
// CONTACT MESSAGES API
// ====================================================================

export const sendContactMessage = async (
  msg: Omit<ContactMessage, 'id' | 'created_at' | 'status'>
): Promise<ContactMessage> => {
  const newMsg: ContactMessage = {
    ...msg,
    id: 'msg-' + Math.random().toString(36).substring(2, 9),
    status: 'unread',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([{
          name: msg.name,
          email: msg.email,
          subject: msg.subject,
          message: msg.message,
          status: 'unread'
        }])
        .select()
        .single();
      if (!error && data) return data as ContactMessage;
    } catch (err) {
      console.warn('Supabase sendContactMessage error:', err);
    }
  }

  const messages = getLocal<ContactMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_CONTACT_MESSAGES);
  messages.unshift(newMsg);
  setLocal(STORAGE_KEYS.MESSAGES, messages);
  return newMsg;
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase getContactMessages error:', err);
    }
  }
  return getLocal<ContactMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_CONTACT_MESSAGES);
};

export const updateContactMessageStatus = async (
  id: string,
  status: 'unread' | 'read' | 'resolved'
): Promise<boolean> => {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase updateContactMessageStatus error:', err);
    }
  }
  const messages = getLocal<ContactMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_CONTACT_MESSAGES);
  const idx = messages.findIndex((m) => m.id === id);
  if (idx !== -1) {
    messages[idx].status = status;
    setLocal(STORAGE_KEYS.MESSAGES, messages);
    return true;
  }
  return false;
};

// ====================================================================
// PROFILES & STATS (FOR ADMIN & AUDIT)
// ====================================================================

export const getAllProfiles = async (): Promise<UserProfile[]> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase getAllProfiles error:', err);
    }
  }
  return getLocal<UserProfile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
};

export const updateUserProfile = async (
  id: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase updateUserProfile error:', err);
    }
  }

  const profiles = getLocal<UserProfile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  const idx = profiles.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  profiles[idx] = { ...profiles[idx], ...updates, updated_at: new Date().toISOString() };
  setLocal(STORAGE_KEYS.PROFILES, profiles);
  return profiles[idx];
};
