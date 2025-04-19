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

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📄 License

This project is licensed under the MIT License

## 📞 Support

For support, email your-email@example.com or join our Slack channel.
minor change - 2

## 🌟 Star History
small chnages
[![Star History Chart](https://api.star-history.com/svg?repos=your-username/microservice-api-product&type=Date)](https://star-history.com/#your-username/microservice-api-product&Date)
