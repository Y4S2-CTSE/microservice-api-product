const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Product = require('../models/product');

let mongoServer;

beforeAll(async () => {
  try {
    // Create new in-memory database
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Connect to the in-memory database
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (error) {
    console.error('Setup failed:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    // Only attempt cleanup if mongoServer exists
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
  // Clear collections
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

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const response = await request(app)
        .post('/api/products')
        .send(testProduct);
      
      expect(response.status).toBe(201);
      expect(response.body.productName).toBe(testProduct.productName);
    });
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      // Create test product first
      await Product.create(testProduct);
      
      const response = await request(app)
        .get('/api/products');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
    });

    it('should filter products by name', async () => {
      await Product.create(testProduct);
      
      const response = await request(app)
        .get('/api/products?name=Laptop');
      
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product', async () => {
      const product = await Product.create(testProduct);
      
      const response = await request(app)
        .get(`/api/products/${product._id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.productName).toBe(testProduct.productName);
    });
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
  
    // ...existing POST and GET tests...
  
    describe('PUT /api/products/:id', () => {
      it('should update an existing product', async () => {
        const product = await Product.create(testProduct);
        const updateData = {
          productName: 'Updated Laptop',
          price: 1299.99
        };
  
        const response = await request(app)
          .put(`/api/products/${product._id}`)
          .send(updateData);
  
        expect(response.status).toBe(200);
        expect(response.body.productName).toBe(updateData.productName);
        expect(response.body.price).toBe(updateData.price);
      });
  
      it('should return 404 if product not found', async () => {
        const response = await request(app)
          .put('/api/products/654321654321654321654321')
          .send({ productName: 'Test' });
  
        expect(response.status).toBe(404);
      });
    });
  
    describe('DELETE /api/products/:id', () => {
      it('should delete an existing product', async () => {
        const product = await Product.create(testProduct);
  
        const response = await request(app)
          .delete(`/api/products/${product._id}`);
  
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Product deleted');
  
        // Verify product is actually deleted
        const deletedProduct = await Product.findById(product._id);
        expect(deletedProduct).toBeNull();
      });
  
      it('should return 404 if product not found', async () => {
        const response = await request(app)
          .delete('/api/products/654321654321654321654321');
  
        expect(response.status).toBe(404);
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
  
      it('should filter products by minimum price', async () => {
        const response = await request(app)
          .get('/api/products?minPrice=1000');
  
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body.every(p => p.price >= 1000)).toBe(true);
      });
  
      it('should filter products by maximum price', async () => {
        const response = await request(app)
          .get('/api/products?maxPrice=1000');
  
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body.every(p => p.price <= 1000)).toBe(true);
      });
  
      it('should filter products by price range', async () => {
        const response = await request(app)
          .get('/api/products?minPrice=600&maxPrice=1400');
  
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].price).toBe(1000);
      });
    });
  });
  });