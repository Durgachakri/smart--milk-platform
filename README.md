# 🥛 MilkMitra – Smart Milk Subscription & Delivery Platform

MilkMitra is a full-stack dairy subscription and delivery platform that allows customers to browse dairy products, manage their cart, place orders, and subscribe to recurring milk deliveries.

The platform also provides an admin dashboard for managing products, orders, subscriptions, and users.

## 🚀 Features

### 👤 Customer Features

* User registration and login
* JWT-based authentication
* Browse dairy products
* View product details
* Add and remove products from cart
* Update product quantities
* Select delivery slots
* Place doorstep delivery orders
* Subscribe to recurring milk deliveries
* Support for daily, alternate-day, and weekly subscriptions
* Manage subscription details

### 🛠️ Admin Features

* Admin authentication
* Manage dairy products
* Add, update, and delete products
* Upload product images
* Manage customer orders
* Manage subscriptions
* Monitor platform activities

### 🔐 Authentication & Security

* JWT-based authentication
* Role-based access control
* Protected API routes
* Secure user and admin operations

## 🧑‍💻 Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication
* Multer

### Database

* MySQL

## 📂 Project Structure

```text
smart--milk-platform/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── uploads/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── ...
│
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Durgachakri/smart--milk-platform.git

cd smart--milk-platform
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smart_milk_db
JWT_SECRET=your_jwt_secret
```

Configure your MySQL database and make sure the database name matches the value in your `.env` file.

Start the backend server:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

### 3. Setup the Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Start the React application:

```bash
npm start
```

The frontend will run on:

```text
http://localhost:3000
```

## 🔄 Application Flow

```text
Customer
   │
   ▼
React.js Frontend
   │
   ▼
Express.js REST API
   │
   ▼
JWT Authentication
   │
   ▼
MySQL Database
   │
   ▼
Orders / Subscriptions / Products
```

## 📸 Screenshots

Add screenshots of your application here:

```markdown
![Home Page](screenshots/home.png)

![Products Page](screenshots/products.png)

![Cart Page](screenshots/cart.png)

![Admin Dashboard](screenshots/admin.png)
```

## 🎯 Project Highlights

* Developed a complete full-stack dairy delivery platform.
* Implemented recurring subscription functionality for milk deliveries.
* Built RESTful APIs using Node.js and Express.js.
* Integrated MySQL for persistent data management.
* Implemented JWT authentication and role-based access control.
* Added product image upload functionality using Multer.
* Implemented cart management, discount calculations, delivery slots, orders, and subscriptions.

## 🌐 Repository

**GitHub:**
https://github.com/Durgachakri/smart--milk-platform

## 👨‍💻 Author

**Durga Chakri Kamireddi**

GitHub: https://github.com/Durgachakri
