# 🛍️ Product Microservice API

> A RESTful microservice for managing product information, built with Node.js, Express, and MongoDB.

## ✨ Features

- 📝 CRUD operations for products
- 💰 Price range filtering
- 🔍 Product name search
- 🏷️ Product type filtering
- 🐳 Docker containerization
- 🧪 Automated testing
- 🚀 CI/CD pipeline with GitHub Actions

## 🔧 Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- MongoDB
- npm or yarn

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/your-username/microservice-api-product.git
cd microservice-api-product
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
NODE_ENV=development
PORT=5002
MONGO_URI=mongodb://your-mongodb-uri
```

## 🏃‍♂️ Running the Application

### 🐳 Using Docker

```bash
docker-compose up -d
```

### 💻 Without Docker

```bash
npm run dev
```

## 🧪 Testing

```bash
npm test
```

## 🔌 API Endpoints

### 📦 Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### 🔍 Query Parameters

- `name` - Filter by product name
- `minPrice` - Filter by minimum price
- `maxPrice` - Filter by maximum price
- `productType` - Filter by product type

## 📝 Example Request

```json
POST /api/products
{
  "productName": "Test Laptop",
  "productCode": "TL123",
  "image": "http://example.com/image.jpg",
  "productType": "Electronics",
  "description": "Test Description",
  "price": 999.99
}
```

## 🚀 Deployments

### 🌐 Google Kubernetes Engine (GKE)
- Base URL: `http://35.185.181.247:5002`
- Endpoints:
  - Get all products: `GET http://35.185.181.247:5002/api/products`
  - Get product by ID: `GET http://35.185.181.247:5002/api/products/:id`
  - Create product: `POST http://35.185.181.247:5002/api/products`
  - Update product: `PUT http://35.185.181.247:5002/api/products/:id`
  - Delete product: `DELETE http://35.185.181.247:5002/api/products/:id`

### 🔧 GKE Environment
- Cluster Name: product-cluster
- Zone: us-central1-a
- Namespace: product-namespace
- Service Type: LoadBalancer
- Port: 5002

### 📝 Testing GKE Deployment
```bash
# Check service status
curl http://35.185.181.247:5002/api/products

# Create a product
curl -X POST http://35.185.181.247:5002/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Test Product",
    "productCode": "TP123",
    "image": "http://example.com/test.jpg",
    "productType": "Test",
    "description": "Test Description",
    "price": 99.99
  }'
```

## 🐳 Docker Features

- 🏗️ Multi-stage builds
- 💓 Health checks
- 📊 Resource limits
- 💾 Volume mounts
- 🌐 Network configuration

## 🚀 CI/CD Pipeline

- ✅ Automated testing
- 🔒 Security scanning with Snyk
- 🐳 Docker image building and pushing
- 📦 Deployment automation
- 🌐 GKE deployment pipeline
  - 🔑 Google Cloud authentication
  - 🏗️ Container Registry integration
  - 🚀 Kubernetes deployment
  - 🔄 Auto rollout updates
  - 📊 Deployment status verification
- 🔄 Continuous deployment workflow
  - 🧪 Test → Build → Push → Deploy
  - 🔍 Automated environment checks
  - 📡 Service health monitoring
  - 🌍 Load balancer configuration

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📄 License

This project is licensed under the MIT License

## 📞 Support

- ✉️ Email Support: IT21247804@my.sliit.lk
- 🌐 GKE Service Status: http://35.185.181.247:5002/api/products
- 🐳 Docker Hub: https://hub.docker.com/r/pasanbaddewithana1234/product-service
- 🔧 Technical Issues: Create a GitHub issue
- 📝 Documentation: Check Wiki section

## showing the CI/CD Pipeline

## BY Pasan Baddewithana


