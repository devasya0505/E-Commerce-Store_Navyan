# DevMart MERN E-Commerce Platform

DevMart is an advanced MERN stack e-commerce project with customer shopping flows, admin product management, cart handling, simulated payments, and order tracking.
## Live Demo: https://e-commerce-store-navyan.vercel.app/

## Features

- User registration and login with JWT authentication.
- User and admin roles.
- Public product browsing with search and category filtering.
- Product details page.
- Authenticated cart system.
- Simulated checkout with payment method selection.
- Customer order history.
- Admin dashboard with product and order metrics.
- Admin product create, update, and delete.
- Admin order and payment status management.
- MongoDB seed script with demo users and products.

## Project Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seeders/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── .env.example
│   └── package.json
├── IMPLEMENTATION_PLAN.md
├── TASKS.md
├── README.md
└── walkthrough.md
```

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Lucide React
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT, bcryptjs
- Payment: simulated payment flow

## Setup

Install dependencies in both folders:

```bash
cd backend
npm install
```

```bash
cd ../frontend
npm install
```

Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Update `backend/.env` if your MongoDB URI is different.

## Seed Demo Data

From the project root:

```bash
npm run seed
```

Demo accounts:

```text
Admin: admin@example.com / admin123
User:  user@example.com / user123
```

## Run The Project

Start the backend:

```bash
npm run backend
```

Start the frontend in another terminal:

```bash
npm run frontend
```

Open:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:5000
```

## Main API Routes

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile

GET    /api/products
GET    /api/products/:id
POST   /api/products          Admin only
PUT    /api/products/:id      Admin only
DELETE /api/products/:id      Admin only

GET    /api/cart
POST   /api/cart
PUT    /api/cart/:productId
DELETE /api/cart/:productId
DELETE /api/cart

POST   /api/orders
GET    /api/orders/mine
GET    /api/orders/:id
GET    /api/orders/admin/all  Admin only
PUT    /api/orders/:id        Admin only
```

## Notes

- Payment is simulated. Selecting Card, UPI, or Wallet marks the order as paid and generates a fake transaction ID.
- Cash on delivery keeps payment status as pending.
- Admin users can manage inventory and update order status.
- Product stock decreases after a successful checkout.

