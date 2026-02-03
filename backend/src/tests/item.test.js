const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');
const Item = require('../models/Item');

describe('Item Endpoints', () => {
  let token;
  let user;

  beforeAll(async () => {
    const testDbUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/neighborhood-lending-test';
    await mongoose.connect(testDbUri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Item.deleteMany({});

    user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    token = user.getSignedJwtToken();
  });

  describe('POST /api/items', () => {
    it('should create a new item', async () => {
      const res = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Power Drill',
          description: 'Electric power drill, great for DIY projects',
          category: 'Tools',
          condition: 'Good',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Power Drill');
      expect(res.body.data.owner.toString()).toBe(user._id.toString());
    });

    it('should not create item without auth', async () => {
      const res = await request(app)
        .post('/api/items')
        .send({
          title: 'Power Drill',
          description: 'Electric power drill',
          category: 'Tools',
          condition: 'Good',
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/items', () => {
    beforeEach(async () => {
      await Item.create([
        {
          title: 'Power Drill',
          description: 'Electric power drill',
          category: 'Tools',
          condition: 'Good',
          owner: user._id,
        },
        {
          title: 'Board Game',
          description: 'Fun family board game',
          category: 'Games & Toys',
          condition: 'Like New',
          owner: user._id,
        },
      ]);
    });

    it('should get all available items', async () => {
      const res = await request(app).get('/api/items');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
    });

    it('should filter items by category', async () => {
      const res = await request(app).get('/api/items?category=Tools');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].category).toBe('Tools');
    });
  });

  describe('GET /api/items/:id', () => {
    it('should get single item by id', async () => {
      const item = await Item.create({
        title: 'Power Drill',
        description: 'Electric power drill',
        category: 'Tools',
        condition: 'Good',
        owner: user._id,
      });

      const res = await request(app).get(`/api/items/${item._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Power Drill');
    });

    it('should return 404 for non-existent item', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/items/${fakeId}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/items/:id', () => {
    it('should update own item', async () => {
      const item = await Item.create({
        title: 'Power Drill',
        description: 'Electric power drill',
        category: 'Tools',
        condition: 'Good',
        owner: user._id,
      });

      const res = await request(app)
        .put(`/api/items/${item._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Drill' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.title).toBe('Updated Drill');
    });

    it('should not update other user item', async () => {
      const otherUser = await User.create({
        name: 'Other User',
        email: 'other@example.com',
        password: 'password123',
      });

      const item = await Item.create({
        title: 'Power Drill',
        description: 'Electric power drill',
        category: 'Tools',
        condition: 'Good',
        owner: otherUser._id,
      });

      const res = await request(app)
        .put(`/api/items/${item._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Drill' });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete own item', async () => {
      const item = await Item.create({
        title: 'Power Drill',
        description: 'Electric power drill',
        category: 'Tools',
        condition: 'Good',
        owner: user._id,
      });

      const res = await request(app)
        .delete(`/api/items/${item._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);

      const deletedItem = await Item.findById(item._id);
      expect(deletedItem).toBeNull();
    });
  });
});
