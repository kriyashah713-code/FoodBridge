/**
 * Functional workflow simulation test
 * Tests full state machine:
 * Available -> Requested -> Accepted / Claimed -> Completed
 * Plus Safe Deadline Expiry validation
 */

import { INITIAL_DONATIONS, INITIAL_REQUESTS, INITIAL_PROFILES } from '../src/data/mockData.js';

console.log('--- Commencing Functional Lifecycle Simulation ---');

// Mock localStorage in Node
const storage = new Map();
global.localStorage = {
  getItem: (k) => storage.get(k) || null,
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k)
};

// Import services dynamically
async function runSimulation() {
  const {
    getDonations,
    createDonation,
    getDonationById,
    createPickupRequest,
    updatePickupRequestStatus,
    getPickupRequests
  } = await import('../src/services/api.js');

  // Step 1: Donor creates donation
  console.log('\n1. Testing Donation Creation:');
  const now = new Date();
  const deadline = new Date(now.getTime() + 4 * 3600 * 1000).toISOString();
  const prep = new Date(now.getTime() - 1 * 3600 * 1000).toISOString();

  const newDonation = await createDonation({
    donor_id: 'donor-1',
    donor_name: 'Aarav Sharma (Royal Heritage)',
    donor_phone: '+91 98765 43210',
    food_name: 'Fresh Paneer Biryani',
    category: 'Cooked Meals',
    quantity: 50,
    unit: 'servings',
    dietary_type: 'Vegetarian',
    location: 'Bandra West, Mumbai',
    city: 'Mumbai',
    preparation_time: prep,
    safe_pickup_deadline: deadline,
    storage_instructions: 'Thermal containers',
    description: 'Hot vegetarian meal surplus'
  });

  console.log(`  ✓ Created donation: ID=${newDonation.id}, Status=${newDonation.status}`);
  if (newDonation.status !== 'available') {
    throw new Error('Expected new donation status to be "available"');
  }

  // Step 2: Available Food Query & Filter
  console.log('\n2. Testing NGO Search & Category Filter:');
  const availableItems = await getDonations({ category: 'Cooked Meals', status: 'available' });
  const found = availableItems.find(d => d.id === newDonation.id);
  console.log(`  ✓ Found newly listed item in search results: ${Boolean(found)}`);
  if (!found) throw new Error('Newly created donation was not found in filtered search');

  // Step 3: NGO Submits Pickup Request
  console.log('\n3. Testing NGO Pickup Request Submission:');
  const pickupTime = new Date(now.getTime() + 2 * 3600 * 1000).toISOString();
  const request = await createPickupRequest({
    donation_id: newDonation.id,
    ngo_id: 'ngo-1',
    donor_id: 'donor-1',
    quantity_requested: 50,
    estimated_pickup_time: pickupTime,
    message: 'Annapurna Seva Trust rescue vehicle dispatch',
    contact_person: 'Sunita Deshmukh',
    contact_phone: '+91 97654 32109'
  });

  console.log(`  ✓ Pickup request created: ID=${request.id}, Status=${request.status}`);
  if (request.status !== 'pending') throw new Error('Expected request status to be "pending"');

  // Verify donation status changed to 'requested'
  const postReqDonation = await getDonationById(newDonation.id);
  console.log(`  ✓ Associated donation status automatically updated to: "${postReqDonation.status}"`);
  if (postReqDonation.status !== 'requested') throw new Error('Expected donation to transition to "requested"');

  // Step 4: Donor Accepts Pickup Request
  console.log('\n4. Testing Donor Acceptance & Note:');
  const acceptedReq = await updatePickupRequestStatus(
    request.id,
    'accepted',
    'Confirmed. Enter via Gate 2 for loading.'
  );
  console.log(`  ✓ Request status updated to: "${acceptedReq.status}", Note: "${acceptedReq.donor_note}"`);
  if (acceptedReq.status !== 'accepted') throw new Error('Expected request to be "accepted"');

  const claimedDonation = await getDonationById(newDonation.id);
  console.log(`  ✓ Donation status automatically updated to: "${claimedDonation.status}"`);
  if (claimedDonation.status !== 'claimed') throw new Error('Expected donation to transition to "claimed"');

  // Step 5: Mark Completed / Handover
  console.log('\n5. Testing Handover Fulfillment:');
  const completedReq = await updatePickupRequestStatus(request.id, 'completed', 'Food collected safely');
  console.log(`  ✓ Request completed: "${completedReq.status}"`);

  const completedDonation = await getDonationById(newDonation.id);
  console.log(`  ✓ Donation marked completed: "${completedDonation.status}"`);
  if (completedDonation.status !== 'completed') throw new Error('Expected donation to transition to "completed"');

  // Step 6: Test Expiry Rejection Protocol
  console.log('\n6. Testing Safe Pickup Deadline & Expiry Protocol:');
  const expiredDonation = await createDonation({
    donor_id: 'donor-1',
    donor_name: 'Test Donor',
    food_name: 'Expired Pastries',
    category: 'Bakery & Bread',
    quantity: 10,
    unit: 'boxes',
    dietary_type: 'Vegetarian',
    location: 'Mumbai',
    city: 'Mumbai',
    preparation_time: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(),
    safe_pickup_deadline: new Date(now.getTime() - 2 * 3600 * 1000).toISOString() // 2 hours in the past!
  });

  const checkedExpired = await getDonationById(expiredDonation.id);
  console.log(`  ✓ Past-deadline item status automatically evaluated to: "${checkedExpired.status}"`);
  if (checkedExpired.status !== 'expired') throw new Error('Expected past-deadline item to be "expired"');

  try {
    await createPickupRequest({
      donation_id: expiredDonation.id,
      ngo_id: 'ngo-1',
      donor_id: 'donor-1',
      quantity_requested: 5,
      estimated_pickup_time: new Date().toISOString(),
      contact_person: 'Volunteer',
      contact_phone: '+91 90000 00000'
    });
    console.error('  ✗ FAILED: Expired donation incorrectly allowed pickup request!');
    process.exit(1);
  } catch (err) {
    console.log(`  ✓ Correctly rejected pickup request on expired food: "${err.message}"`);
  }

  console.log('\n🎉 ALL WORKFLOW LIFECYCLE TESTS COMPLETED WITH 100% SUCCESS!');
}

runSimulation().catch(err => {
  console.error('Simulation error:', err);
  process.exit(1);
});
