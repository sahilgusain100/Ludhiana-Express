import http from 'http';
import dns from 'node:dns/promises';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import userRouter from './src/routes/user.routes.js';
import orderRouter from './src/routes/order.routes.js';
import { User } from './src/models/user.model.js';
import { Order } from './src/models/order.model.js';

dotenv.config();
dns.setServers(['1.1.1.1', '8.8.8.8']);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

let server;
const TEST_PORT = 5055;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}/api`;

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    method: options.method || 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('=== LUDHIANA EXPRESS FULL E2E TEST SUITE ===\n');

  // Step 0: Connect to MongoDB Atlas
  console.log('1. Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected to MongoDB successfully.');

  // Start HTTP test server
  server = app.listen(TEST_PORT);
  console.log(`✓ Test Express server listening on port ${TEST_PORT}\n`);

  const timestamp = Date.now();
  const customerA = {
    name: 'Harpreet Singh',
    email: `harpreet_${timestamp}@ludhianaexpress.test`,
    password: 'password123',
    phone: '9876543210',
    address: 'B-14 Civil Lines, Ludhiana',
  };

  const customerB = {
    name: 'Gurpreet Kaur',
    email: `gurpreet_${timestamp}@ludhianaexpress.test`,
    password: 'securePass456',
    phone: '9123456789',
    address: 'Saraba Nagar, Ludhiana',
  };

  // Step 1: Register Customer A
  console.log('2. Registering Customer A (Harpreet)...');
  const regResA = await request('/users/register', {
    method: 'POST',
    body: customerA,
  });
  console.log(`Response status: ${regResA.status}`);
  if (regResA.status !== 201) throw new Error('Customer A registration failed: ' + JSON.stringify(regResA.data));
  console.log('✓ Customer A registered successfully:', regResA.data.user);

  // Step 2: Login Customer A
  console.log('\n3. Logging in as Customer A...');
  const loginResA = await request('/users/login', {
    method: 'POST',
    body: { email: customerA.email, password: customerA.password },
  });
  if (loginResA.status !== 200 || !loginResA.data.token) {
    throw new Error('Customer A login failed');
  }
  const tokenA = loginResA.data.token;
  console.log('✓ Customer A logged in, received JWT token.');

  // Step 3: Validate persistent auth via /api/users/me
  console.log('\n4. Validating /api/users/me with Customer A token...');
  const meResA = await request('/users/me', {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  if (meResA.status !== 200 || meResA.data.user?.email !== customerA.email) {
    throw new Error('Failed to verify user profile via /users/me');
  }
  console.log('✓ Profile retrieved from JWT token:', meResA.data.user);

  // Step 4: Test security - Unauthenticated order placement
  console.log('\n5. Testing Security: placing order without token...');
  const unauthRes = await request('/orders', {
    method: 'POST',
    body: {
      items: [{ service: 'Wash and Fold', quantity: 1, price: 150 }],
      pickupAddress: 'Ludhiana',
      pickupDate: '2026-11-10',
      pickupTime: '10:00 AM',
    },
  });
  if (unauthRes.status !== 401) {
    throw new Error('Expected 401 Unauthorized but got ' + unauthRes.status);
  }
  console.log('✓ Correctly rejected with 401 Unauthorized when missing token.');

  // Step 5: Test validation - Invalid order payload
  console.log('\n6. Testing Validation: placing order with empty items array...');
  const invalidRes = await request('/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}` },
    body: {
      items: [],
      pickupAddress: 'Ludhiana',
      pickupDate: '2026-11-10',
      pickupTime: '10:00 AM',
    },
  });
  if (invalidRes.status !== 400) {
    throw new Error('Expected 400 Bad Request but got ' + invalidRes.status);
  }
  console.log('✓ Correctly rejected with 400 Bad Request for invalid order.');

  // Step 6: Place valid order for Customer A
  console.log('\n7. Placing valid order for Customer A...');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const pickupDateStr = tomorrow.toISOString();

  const orderPayloadA = {
    items: [
      { service: 'Wash and Fold', quantity: 2, price: 150 },
      { service: 'Ironing', quantity: 3, price: 100 },
    ],
    pickupAddress: customerA.address,
    pickupDate: pickupDateStr,
    pickupTime: '11:00 AM - 01:00 PM',
  };

  const orderResA = await request('/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}` },
    body: orderPayloadA,
  });

  if (orderResA.status !== 201 || !orderResA.data.order) {
    throw new Error('Failed to place order for Customer A: ' + JSON.stringify(orderResA.data));
  }
  const orderA = orderResA.data.order;
  console.log(`✓ Order placed successfully! ID: ${orderA._id}, Total Amount: ₹${orderA.totalAmount}, Status: ${orderA.status}`);
  if (orderA.totalAmount !== 600) {
    throw new Error(`Expected totalAmount 600, got ${orderA.totalAmount}`);
  }

  // Step 7: Verify order is saved in MongoDB Atlas directly
  console.log('\n8. Directly querying MongoDB Atlas for Customer A order...');
  const dbOrderA = await Order.findById(orderA._id);
  if (!dbOrderA) throw new Error('Order not found in MongoDB!');
  console.log(`✓ Verified order in MongoDB: user=${dbOrderA.user}, total=₹${dbOrderA.totalAmount}, items=${dbOrderA.items.length}`);

  // Step 8: Fetch Order History for Customer A via API
  console.log('\n9. Fetching order history for Customer A (/api/orders/my-orders)...');
  const historyResA = await request('/orders/my-orders', {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  if (historyResA.status !== 200 || !Array.isArray(historyResA.data.orders)) {
    throw new Error('Failed to fetch Customer A order history');
  }
  const foundOrder = historyResA.data.orders.find((o) => o._id === orderA._id);
  if (!foundOrder) throw new Error('Customer A order missing from order history');
  console.log(`✓ Order history returned ${historyResA.data.orders.length} order(s). Customer A order present.`);

  // Step 9: Register and Login Customer B (Customer Isolation Test)
  console.log('\n10. Testing Customer Isolation: Registering Customer B (Gurpreet)...');
  await request('/users/register', { method: 'POST', body: customerB });
  const loginResB = await request('/users/login', {
    method: 'POST',
    body: { email: customerB.email, password: customerB.password },
  });
  const tokenB = loginResB.data.token;
  console.log('✓ Customer B logged in.');

  // Step 10: Check Customer B's order history -> MUST BE EMPTY
  console.log('\n11. Fetching order history for Customer B (before placing any order)...');
  const historyResB1 = await request('/orders/my-orders', {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  if (historyResB1.status !== 200) throw new Error('Customer B history request failed');
  if (historyResB1.data.orders.length !== 0) {
    throw new Error('ISOLATION BREACH! Customer B should have 0 orders but got ' + historyResB1.data.orders.length);
  }
  console.log('✓ Customer isolation verified! Customer B sees 0 orders, cannot see Customer A orders.');

  // Step 11: Place order for Customer B
  console.log('\n12. Customer B places an order for Dry Cleaning...');
  const orderResB = await request('/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenB}` },
    body: {
      items: [{ service: 'Dry Cleaning', quantity: 2, price: 200 }],
      pickupAddress: customerB.address,
      pickupDate: pickupDateStr,
      pickupTime: '02:00 PM - 04:00 PM',
    },
  });
  const orderB = orderResB.data.order;
  console.log(`✓ Customer B order placed! ID: ${orderB._id}, Total: ₹${orderB.totalAmount}`);

  // Step 12: Verify Customer B only sees Customer B's order
  console.log('\n13. Verifying Customer B order history contains ONLY Customer B order...');
  const historyResB2 = await request('/orders/my-orders', {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  if (historyResB2.data.orders.length !== 1 || historyResB2.data.orders[0]._id !== orderB._id) {
    throw new Error('Customer B order history mismatch');
  }
  console.log('✓ Customer B sees exactly their 1 order.');

  // Step 13: Verify Customer A still sees only Customer A's orders
  console.log('\n14. Verifying Customer A order history is untouched...');
  const historyResA2 = await request('/orders/my-orders', {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const hasOrderB = historyResA2.data.orders.some((o) => o._id === orderB._id);
  if (hasOrderB) {
    throw new Error('ISOLATION BREACH! Customer A can see Customer B order!');
  }
  console.log('✓ Customer A cannot see Customer B order. Strict customer isolation 100% verified!');

  console.log('\n========================================');
  console.log('🎉 ALL 14 TEST STEPS PASSED SUCCESSFULLY!');
  console.log('========================================\n');

  // Clean up test data from MongoDB
  console.log('Cleaning up test records from MongoDB Atlas...');
  await Order.deleteMany({ _id: { $in: [orderA._id, orderB._id] } });
  await User.deleteMany({ email: { $in: [customerA.email, customerB.email] } });
  console.log('✓ Test records cleaned up successfully.');

  await mongoose.disconnect();
  server.close();
  process.exit(0);
}

runTests().catch((err) => {
  console.error('\n❌ TEST FAILED:', err);
  if (server) server.close();
  mongoose.disconnect();
  process.exit(1);
});
