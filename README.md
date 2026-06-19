# Prescripto

A full-stack doctor appointment booking platform built with a production-focused architecture.

Prescripto enables patients to discover doctors, book appointments, manage bookings, and complete secure online payments. Doctors can manage appointments, availability, and profiles, while administrators can oversee the entire platform through a dedicated admin dashboard.

This project is designed to simulate a real-world healthcare booking system with secure authentication, payment processing, role-based access control, and scalable backend architecture.

---

## Live Demo

### Frontend

https://prescripto-frontend-livid-three.vercel.app

### Backend API

https://prescripto-backend-theta-two.vercel.app

### Admin Dashboard

https://prescripto-admin-eta-eight.vercel.app

---

## Repository

GitHub Repository:

https://github.com/baibhavsinhadev/prescripto.git

Monorepo Structure:

```bash
frontend/
backend/
admin/
```

---

## Features

### Patient Features

* User Registration & Login
* Secure JWT Authentication
* Cookie-Based Session Management
* Browse Available Doctors
* Filter Doctors by Speciality
* View Doctor Profiles
* Book Appointments
* Cancel Appointments
* Razorpay Payment Integration
* Stripe Payment Integration
* View Appointment History
* Update Profile Information
* Upload Profile Image

---

### Doctor Features

* Doctor Login
* Dashboard Overview
* Earnings Analytics
* Total Appointments Tracking
* Patient Count Statistics
* Appointment Management
* Cancel Appointments
* Mark Appointments as Completed
* Update Doctor Profile
* Change Availability Status
* Update Consultation Fees
* Upload Profile Image
* Change Password

---

### Admin Features

* Admin Authentication
* Dashboard Overview
* Add New Doctors
* View All Doctors
* View All Appointments
* Manage Platform Operations
* Cancel Appointments

---

## System Highlights

* Role-Based Access Control (Patient / Doctor / Admin)
* Secure Authentication & Authorization
* Cloud-Based Image Storage
* Online Payment Processing
* Appointment Management Workflow
* Scalable REST API Architecture
* Responsive User Interface
* Production Deployment

---

## Architecture Highlights

### Authentication System

* JWT-Based Authentication
* HTTP-Only Cookies
* Protected Routes
* Role-Based Authorization

### Appointment Workflow

* User books appointment
* Appointment stored in database
* Payment processed through Razorpay or Stripe
* Appointment status updated
* Doctor manages appointment lifecycle

### Media Management

* Profile images uploaded to Cloudinary
* Optimized image delivery

### Payment System

* Stripe Integration
* Razorpay Integration
* Secure Payment Verification

---

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS v4
* React Router
* Axios
* Context API

### Admin Panel

* React
* Vite
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Bcrypt

### Cloud Services

* Cloudinary

### Payments

* Razorpay
* Stripe

### Deployment

* Frontend → Vercel
* Admin → Vercel
* Backend → Vercel
* Database → MongoDB Atlas

---

## Security

The backend implements multiple layers of security:

* Helmet
* HPP (HTTP Parameter Pollution Protection)
* Rate Limiting
* CORS Configuration
* Cookie Parser
* Compression
* JWT Authentication
* Password Hashing with Bcrypt

---

## Project Structure

### Backend

```bash
backend/
├── configs/
├── controllers/
├── middlewares/
├── models/
├── routes/
└── server.js
```

### Frontend

```bash
frontend/
├── public/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── App.jsx
```

### Admin

```bash
admin/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── App.jsx
```

---

## Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=
NODE_ENV=development
CURRENCY=USD

JWT_ADMIN_SECRET=
JWT_DOCTOR_SECRET=
JWT_USER_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

ADMIN_EMAIL=
ADMIN_PASSWORD=

ADMIN_URL=
FRONTEND_URL=

RAZORPAY_API_KEY=
RAZORPAY_SECRET_KEY=

STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_KEY=
```

### Frontend (.env)

```env
VITE_BACKEND_URL=
VITE_RAZORPAY_KEY_ID=
```

### Admin (.env)

```env
VITE_BACKEND_URL=
VITE_CURRENCY=
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/baibhavsinhadev/prescripto.git
cd prescripto
```

---

### Setup Backend

```bash
cd backend

npm install

npm run dev
```

---

### Setup Frontend

```bash
cd frontend

npm install

npm run dev
```

---

### Setup Admin Panel

```bash
cd admin

npm install

npm run dev
```

---

## API Overview

### User Routes

```bash
/api/user
```

Features:

* Register User
* Login User
* Update Profile
* Book Appointment
* View Appointments

---

### Doctor Routes

```bash
/api/doctor
```

Features:

* Login
* Dashboard Data
* Appointment Management
* Profile Management

---

### Admin Routes

```bash
/api/admin
```

Features:

* Dashboard Data
* Add Doctors
* Manage Appointments
* Platform Management

---

## Payment Flow

### Razorpay

1. User books appointment
2. Razorpay order is created
3. User completes payment
4. Payment verified
5. Appointment marked as paid

### Stripe

1. User books appointment
2. Stripe checkout session created
3. User completes payment
4. Payment verified
5. Appointment marked as paid

---

## Future Improvements

* Real-Time Chat Between Doctor & Patient
* Automated Refund Initiation
* Appointment Reminder Notifications
* Prescription Management System
* Video Consultation Support
* Doctor Reviews & Ratings
* Advanced Analytics Dashboard

---

## Author

Built by Baibhav Sinha

Focused on building production-oriented web applications using modern technologies and real-world software architecture principles.

---

## License

This project is licensed under the MIT License.