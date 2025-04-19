const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Product = require('../models/product');

let mongoServer;
let authToken;

// Generate test JWT token
const generateTestToken = () => {
  return jwt.sign({ userId: 'test-user' }, process.env.JWT_SECRET || 'test-secret');
};

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    authToken = generateTestToken();
  } catch (error) {
    console.error('Setup failed:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
});

beforeEach(async () => {
  await Product.deleteMany({});
});

describe('Product API Tests', () => {
  const testProduct = {
    productName: 'Test Laptop',
    productCode: 'TL123',
    image: 'http://example.com/image.jpg',
    productType: 'Electronics',
    description: 'Test Description',
    price: 999.99
  };

  describe('Authentication Tests', () => {
    it('should reject requests without token', async () => {
      const response = await request(app)
        .post('/api/products')
        .send(testProduct);
      
      expect(response.status).toBe(401);
    });

    it('should reject invalid tokens', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', 'Bearer invalid-token')
        .send(testProduct);
      
      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product with valid token', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testProduct);
      
      expect(response.status).toBe(201);
      expect(response.body.productName).toBe(testProduct.productName);
    });

    it('should validate required fields', async () => {
      const invalidProduct = { productName: 'Test' };
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidProduct);
      
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      await Product.create(testProduct);
    });

    it('should return all products without token (public)', async () => {
      const response = await request(app)
        .get('/api/products');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
    });

    it('should filter products by name', async () => {
      const response = await request(app)
        .get('/api/products?name=Laptop');
      
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product without token (public)', async () => {
      const product = await Product.create(testProduct);
      
      const response = await request(app)
        .get(`/api/products/${product._id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.productName).toBe(testProduct.productName);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/654321654321654321654321');
      
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update product with valid token', async () => {
      const product = await Product.create(testProduct);
      const updateData = {
        productName: 'Updated Laptop',
        productCode: 'UL123',
        image: 'http://example.com/updated.jpg',
        productType: 'Electronics',
        description: 'Updated Description',
        price: 1299.99
      };

      const response = await request(app)
        .put(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.productName).toBe(updateData.productName);
      expect(response.body.price).toBe(updateData.price);
    });

    it('should reject update without token', async () => {
      const product = await Product.create(testProduct);
      const response = await request(app)
        .put(`/api/products/${product._id}`)
        .send({ productName: 'Test Update' });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete product with valid token', async () => {
      const product = await Product.create(testProduct);

      const response = await request(app)
        .delete(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      const deletedProduct = await Product.findById(product._id);
      expect(deletedProduct).toBeNull();
    });

    it('should reject deletion without token', async () => {
      const product = await Product.create(testProduct);
      const response = await request(app)
        .delete(`/api/products/${product._id}`);

      expect(response.status).toBe(401);
    });
  });

  describe('Price Range Filtering', () => {
    beforeEach(async () => {
      await Product.create([
        { ...testProduct, price: 500 },
        { ...testProduct, price: 1000 },
        { ...testProduct, price: 1500 }
      ]);
    });

    it('should filter by price range (public)', async () => {
      const response = await request(app)
        .get('/api/products?minPrice=600&maxPrice=1400');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].price).toBe(1000);
    });
  });
});