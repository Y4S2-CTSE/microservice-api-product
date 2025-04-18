const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Product = require('../models/product');
const { setupTestDB, cleanupTestDB } = require('./testSetup');

const testProduct = {
  productName: 'Test Laptop',
  productCode: 'TL123',
  image: 'http://example.com/image.jpg',
  productType: 'Electronics',
  description: 'Test Description',
  price: 999.99
};

beforeAll(setupTestDB);
afterAll(cleanupTestDB);
beforeEach(() => Product.deleteMany({}));

describe('Product API', () => {
  describe('POST /api/products', testProductCreation);
  describe('GET /api/products', testProductRetrieval);
  describe('PUT /api/products/:id', testProductUpdate);
  describe('DELETE /api/products/:id', testProductDeletion);
  describe('Price Range Filtering', testPriceFiltering);
});

function testProductCreation() {
  it('should create a new product', async () => {
    const response = await request(app)
      .post('/api/products')
      .send(testProduct);
    
    expect(response.status).toBe(201);
    expect(response.body.productName).toBe(testProduct.productName);
  });
}

function testProductRetrieval() {
  it('should return all products', async () => {
    await Product.create(testProduct);
    const response = await request(app).get('/api/products');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  it('should filter products by name', async () => {
    await Product.create(testProduct);
    const response = await request(app).get('/api/products?name=Laptop');
    
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it('should return a single product', async () => {
    const product = await Product.create(testProduct);
    const response = await request(app).get(`/api/products/${product._id}`);
    
    expect(response.status).toBe(200);
    expect(response.body.productName).toBe(testProduct.productName);
  });
}

function testProductUpdate() {
  it('should update an existing product', async () => {
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
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.productName).toBe(updateData.productName);
    expect(response.body.price).toBe(updateData.price);
  });

  it('should return 404 if product not found', async () => {
    const response = await request(app)
      .put('/api/products/654321654321654321654321')
      .send({
        productName: 'Test Product',
        productCode: 'TP123',
        image: 'http://example.com/test.jpg',
        productType: 'Test',
        description: 'Test Description',
        price: 99.99
      });

    expect(response.status).toBe(404);
  });
}

function testProductDeletion() {
  it('should delete an existing product', async () => {
    const product = await Product.create(testProduct);
    const response = await request(app).delete(`/api/products/${product._id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Product deleted');

    const deletedProduct = await Product.findById(product._id);
    expect(deletedProduct).toBeNull();
  });

  it('should return 404 if product not found', async () => {
    const response = await request(app)
      .delete('/api/products/654321654321654321654321');

    expect(response.status).toBe(404);
  });
}

function testPriceFiltering() {
  beforeEach(async () => {
    await Product.create([
      { ...testProduct, price: 500 },
      { ...testProduct, price: 1000 },
      { ...testProduct, price: 1500 }
    ]);
  });

  it('should filter by price range', async () => {
    const response = await request(app)
      .get('/api/products?minPrice=600&maxPrice=1400');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].price).toBe(1000);
  });
}