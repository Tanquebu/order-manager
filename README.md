# 🧾 Order Manager

**A full-stack order management system** featuring a Laravel-powered REST API and a modern React-based frontend with Tailwind CSS.

This project was built as a technical assessment and demonstrates key full-stack capabilities including:

- Secure authentication with **Laravel Sanctum**
- Fully functional **CRUD APIs** for Customers, Products, and Orders
- Order state management: `pending → shipped → delivered`
- Admin dashboard with filters, form validation, and protected routes
- Clean architectural separation and REST best practices

---

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
2. Start the Laravel container:
```bash
cd backend
./vendor/bin/sail up -d
```
3. Run migrations
```bash
./vendor/bin/sail artisan migrate
```
4. Start the frontend
```bash
cd frontend
npm install
npm start
```
5. The backend will be available at: http://localhost

6. The React frontend will be available at: http://localhost:5173