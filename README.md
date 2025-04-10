# 🧾 Order Manager

**A full-stack order management system** featuring a Laravel-powered REST API and a modern React-based frontend with Tailwind CSS.

This project was developed as part of a technical evaluation and showcases best practices in API design, authentication, state management, and user experience.

## Access to the Dashboard

Once the project is up and running, you can access the frontend at:

🔗 [http://localhost:5000](http://localhost:5000)

To log in, use the test user created by the database seeder:

- **Email**: `admin@example.com`  
- **Password**: `password`


---
## 🧩 Features

### Backend (Laravel 12)
- RESTful API with **Sanctum-authenticated** endpoints
- Models: Customers, Products, Orders
- Relationships:
  - Order → Customer (One-to-Many)
  - Order → Products (Many-to-Many with pivot: quantity)
- Enum-based order statuses (`new`,`pending`, `processing`, etc.)
- Form Requests with custom validation logic
- Seeders and Factories
- Pagination on all list endpoints
- Unit tests on login and orders (creation, validation, auth)
- Laravel Scribe integration for auto-documenting APIs
- Clean architectural separation and REST best practices

### 🎨 Frontend (React + Tailwind)
- Login/logout with JWT
- Protected routes via React Context + react-router
- CRUD for Customers, Products, and Orders
- Order filtering and inline status update with confirmation
- Responsive and clean dashboard (summary and navigation)
- Axios setup for JWT Bearer token
- Pagination on list views

---

## 🧠 Architectural Notes

- Sanctum chosen over Passport for simplicity and SPA integration.
- Enum class used in PHP for order statuses, alongside flexible DB storage as string.
- Custom validation via `FormRequest`.
- Code split for clarity (Form components, context, API utils).

## 📦 Tech Stack

- **Backend:** Laravel 12, PHP 8.4, Sanctum, Eloquent, PHPUnit
- **Frontend:** React, Tailwind CSS, Axios, React Router
- **Auth:** JWT via Sanctum

## 🚀 Local Setup with Laravel Sail + React

This project uses **Laravel Sail** to handle the backend and integrates a separate folder for the React frontend.

### 📦 Requirements
- Docker

---

### ⚙️ Setup and starting the project locally (Laravel + React)

1. Clone the repo:
```bash
git clone git@github.com:Tanquebu/order-manager.git
cd order-manager
```
2. Copy env config and build/start the Laravel container:
```bash
cd backend
cp .env.example .env
./vendor/bin/sail up -d
```
3. Run migrations and seeders
```bash
./vendor/bin/sail artisan migrate --seed
```
4. Copy env config and start the frontend. From the root folder:
```bash
cd frontend
cp .env.example .env
npm install
npm start
```
5. The backend will be available at: http://localhost

6. The React frontend will be available at: http://localhost:5000

## 📒 API Endpoints Overview
All API routes are protected and require JWT Bearer authentication via Laravel Sanctum.

### Authentication
- `POST /api/login`
- `POST /api/logout`
- `GET /api/user`

### Orders
- `GET /api/orders`
- `POST /api/orders`
- `PUT /api/orders/{id}`
- `DELETE /api/orders/{id}`

### Customers
- `GET /api/customers`
- `POST /api/customers`
- `PUT /api/customers/{id}`
- `DELETE /api/customers/{id}`

### Products
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

## 🧪 Running Tests

From the backend directory:

```bash
./vendor/bin/sail artisan test
```

Includes:
- Login test
- Order creation
- Validation failure
- Authorization checks
- Listing orders

## 📚 API Documentation (Optional)

To view the auto-generated API documentation using [Scribe](https://scribe.knuckles.wtf/), switch to the `feature/scribe-docs` branch:

```bash
git checkout feature/scribe-docs
```
Static documentation will be available at http://localhost/docs