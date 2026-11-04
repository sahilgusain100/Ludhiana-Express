import dns from 'node:dns/promises';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import userRouter from './src/routes/user.routes.js';
import orderRouter from './src/routes/order.routes.js';
import messageRouter from './src/routes/message.routes.js';
import { User } from './src/models/user.model.js';
import { Message } from './src/models/message.model.js';

dotenv.config();
dns.setServers(['1.1.1.1', '8.8.8.8']);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/messages', messageRouter);
app.use('/api/v1/messages', messageRouter);

let server;
const TEST_PORT = 5056;
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
  console.log('=== LUDHIANA EXPRESS MESSAGE HISTORY TEST SUITE ===\n');

  // Connect to MongoDB
  console.log('1. Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected to MongoDB Atlas.\n');

  server = app.listen(TEST_PORT);
  console.log(`✓ Test Server running on port ${TEST_PORT}\n`);

  const timestamp = Date.now();
  const customerA = {
    name: 'Amanpreet Singh',
    email: `amanpreet_${timestamp}@ludhianaexpress.test`,
    password: 'password123',
    phone: '9876543210',
    address: 'Mall Road, Ludhiana',
  };

  const customerB = {
    name: 'Simran Kaur',
    email: `simran_${timestamp}@ludhianaexpress.test`,
    password: 'password456',
    phone: '9876543211',
    address: 'BRS Nagar, Ludhiana',
  };

  // 1. Register & Login Customer A
  console.log('2. Registering & logging in Customer A...');
  await request('/users/register', { method: 'POST', body: customerA });
  const loginResA = await request('/users/login', {
    method: 'POST',
    body: { email: customerA.email, password: customerA.password },
  });
  const tokenA = loginResA.data.token;
  console.log('✓ Customer A authenticated.\n');

  // 2. Test Security: Send message without authentication
  console.log('3. Testing Security: Submitting message without token...');
  const unauthRes = await request('/messages', {
    method: 'POST',
    body: {
      name: 'Hacker',
      email: 'hacker@example.com',
      subject: 'Inquiry',
      message: 'Hello',
    },
  });
  if (unauthRes.status !== 401) {
    throw new Error('Expected 401 Unauthorized for unauthenticated message post');
  }
  console.log('✓ Correctly rejected with 401 Unauthorized.\n');

  // 3. Test Validation: Missing message body
  console.log('4. Testing Validation: Submitting message with empty content...');
  const emptyRes = await request('/messages', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}` },
    body: {
      subject: 'Pricing Query',
      message: '   ',
    },
  });
  if (emptyRes.status !== 400) {
    throw new Error('Expected 400 Bad Request for empty message');
  }
  console.log('✓ Correctly rejected with 400 Bad Request.\n');

  // 4. Customer A sends Message 1
  console.log('5. Customer A sends Message 1 (Pricing Query)...');
  const msgRes1 = await request('/messages', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}` },
    body: {
      subject: 'Pricing & Package Query',
      message: 'How much do you charge for delicate embroidered silk saree dry cleaning?',
    },
  });
  if (msgRes1.status !== 201 || !msgRes1.data.data?._id) {
    throw new Error('Failed to create Message 1: ' + JSON.stringify(msgRes1.data));
  }
  const msg1 = msgRes1.data.data;
  console.log(`✓ Message 1 created! ID: ${msg1._id}, Status: ${msg1.status}, Subject: "${msg1.subject}"\n`);

  // 5. Customer A sends Message 2
  console.log('6. Customer A sends Message 2 (Pickup Question)...');
  const msgRes2 = await request('/messages', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}` },
    body: {
      subject: 'Pickup & Delivery Question',
      message: 'Can your pickup van visit Mall Road around 6:30 PM on Friday?',
    },
  });
  if (msgRes2.status !== 201 || !msgRes2.data.data?._id) {
    throw new Error('Failed to create Message 2: ' + JSON.stringify(msgRes2.data));
  }
  const msg2 = msgRes2.data.data;
  console.log(`✓ Message 2 created! ID: ${msg2._id}, Status: ${msg2.status}, Subject: "${msg2.subject}"\n`);

  // 6. Directly query MongoDB Atlas to verify persistence
  console.log('7. Verifying messages saved in MongoDB Atlas...');
  const dbMsg1 = await Message.findById(msg1._id);
  const dbMsg2 = await Message.findById(msg2._id);
  if (!dbMsg1 || !dbMsg2) {
    throw new Error('Messages not found in MongoDB database!');
  }
  console.log(`✓ Verified in MongoDB: Both messages stored with user ID: ${dbMsg1.user}\n`);

  // 7. Customer A fetches message history
  console.log('8. Customer A fetches Message History (GET /api/messages/my-messages)...');
  const historyResA = await request('/messages/my-messages', {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  if (historyResA.status !== 200 || historyResA.data.count !== 2) {
    throw new Error('Expected 2 messages in Customer A history, got: ' + historyResA.data.count);
  }
  // Verify sorted newest first
  if (historyResA.data.messages[0]._id !== msg2._id) {
    throw new Error('Messages are not sorted newest first!');
  }
  console.log('✓ Successfully retrieved 2 messages, ordered newest to oldest.\n');

  // 8. Test single message detail retrieval
  console.log('9. Customer A retrieves single message details (GET /api/messages/:id)...');
  const detailRes = await request(`/messages/${msg1._id}`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  if (detailRes.status !== 200 || detailRes.data.message._id !== msg1._id) {
    throw new Error('Failed to retrieve single message detail');
  }
  console.log('✓ Message details successfully retrieved with full text and status.\n');

  // 9. Register & Login Customer B (Customer Isolation Test)
  console.log('10. Registering & logging in Customer B...');
  await request('/users/register', { method: 'POST', body: customerB });
  const loginResB = await request('/users/login', {
    method: 'POST',
    body: { email: customerB.email, password: customerB.password },
  });
  const tokenB = loginResB.data.token;
  console.log('✓ Customer B authenticated.\n');

  // 10. Customer B Message History MUST BE EMPTY
  console.log('11. Customer B checks message history (must be 0 messages)...');
  const historyResB1 = await request('/messages/my-messages', {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  if (historyResB1.status !== 200 || historyResB1.data.count !== 0) {
    throw new Error('ISOLATION BREACH! Customer B sees Customer A messages!');
  }
  console.log('✓ Strict isolation confirmed! Customer B sees 0 messages.\n');

  // 11. Customer B attempts to access Customer A's message directly by ID
  console.log('12. Customer B attempts to access Customer A message by ID...');
  const breachRes = await request(`/messages/${msg1._id}`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  if (breachRes.status !== 404) {
    throw new Error('Expected 404 Not Found for unauthorized message access, got ' + breachRes.status);
  }
  console.log('✓ Correctly rejected with 404 Not Found when attempting to access another user message.\n');

  // 12. Customer B sends their own message
  console.log('13. Customer B sends their own message...');
  const msgResB = await request('/messages', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenB}` },
    body: {
      subject: 'Order Status Update',
      message: 'Can I change my pickup time from morning to evening?',
    },
  });
  const msgB = msgResB.data.data;
  console.log(`✓ Customer B message sent! ID: ${msgB._id}\n`);

  // 13. Verify Customer B sees only their 1 message
  console.log('14. Verifying Customer B history contains only their 1 message...');
  const historyResB2 = await request('/messages/my-messages', {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  if (historyResB2.data.count !== 1 || historyResB2.data.messages[0]._id !== msgB._id) {
    throw new Error('Customer B message history mismatch');
  }
  console.log('✓ Customer B history confirmed: exactly 1 message.\n');

  // 14. Verify Customer A history is untouched and isolated
  console.log('15. Verifying Customer A history is untouched...');
  const historyResA2 = await request('/messages/my-messages', {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  if (historyResA2.data.count !== 2) {
    throw new Error('Customer A history altered');
  }
  const hasMsgB = historyResA2.data.messages.some((m) => m._id === msgB._id);
  if (hasMsgB) {
    throw new Error('ISOLATION BREACH! Customer A can see Customer B message');
  }
  console.log('✓ Customer A history untouched: exactly 2 messages.\n');

  // 15. Test /api/v1/messages alias route
  console.log('16. Testing /api/v1/messages/my-messages alias route...');
  const v1Res = await request('/v1/messages/my-messages', {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  if (v1Res.status !== 200 || v1Res.data.count !== 2) {
    throw new Error('Failed to retrieve messages via /api/v1/messages endpoint');
  }
  console.log('✓ Both /api/messages and /api/v1/messages work identically.\n');

  console.log('==============================================');
  console.log('🎉 ALL 16 MESSAGE HISTORY TESTS PASSED!');
  console.log('==============================================\n');

  // Clean up
  console.log('Cleaning up test data from MongoDB Atlas...');
  await Message.deleteMany({ _id: { $in: [msg1._id, msg2._id, msgB._id] } });
  await User.deleteMany({ email: { $in: [customerA.email, customerB.email] } });
  console.log('✓ Cleaned up test messages and test users.');

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
