# Employee Management System (MERN Stack)

A comprehensive, role-based Employee Management System built with a React & TypeScript frontend and an Express, MongoDB, & TypeScript backend.

---

## Project Structure

* `/frontend` — React Single Page Application (Vite + TypeScript + Tailwind CSS)
* `/backend` — Express.js Web API (Node + TypeScript + MongoDB + Mongoose)

---

## Core Features

1. **Role-Based Access Control (RBAC):** Customized dashboards and permissions for `admin` (HR/IT), `manager` (Department Head), and `employee` roles.
2. **Attendance & QR Check-In:** Log attendance via simulated QR badge scans or manual entry.
3. **Leave Management:** Custom approval workflow with integrated tenure checks, annual frequency limits, and calendar date validation.
4. **Payroll Processing:** Auto-calculate base pay from hours worked, bonuses, penalty deductions, and tax rates. Includes printable pay slip invoices.
5. **Work Hours Reports:** Daily matrix layout of monthly hours worked with SheetJS Excel export functionality.
6. **Performance Reviews:** Track manager reviews and automatically rank performance indices.
7. **Notifications:** Real-time notifications and unread badges.

---

## Prerequisites

Ensure you have the following installed locally:
* **Node.js** (v18 or higher)
* **npm** (v9 or higher)
* **MongoDB** (Running locally on `mongodb://localhost:27017` or via MongoDB Atlas connection string)

---

## Installation & Setup

### 1. Backend Server Setup

Navigate to the `backend` directory, install packages, and set up your environment variables:

```bash
cd backend
npm install
```

Create a `.env` file in the root of the `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ems
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
NODE_ENV=development
```

#### Seed Initial System Data:

Run the database seed scripts to configure initial departments, roster accounts, and the default system administrator:

```bash
# Seed the default admin account (admin@example.com / adminpassword123)
npx tsx seedAdmin.ts

# Seed test departments, employees, leaves, and attendance logs
npx tsx seedData.ts
```

#### Run the Backend Dev Server:

```bash
npm run dev
```

The backend server runs on [http://localhost:5000](http://localhost:5000).

---

### 2. Frontend SPA Setup

Navigate to the `frontend` directory, install dependencies, and run the development server:

```bash
cd ../frontend
npm install
npm run dev
```

The frontend application runs on [http://localhost:5173](http://localhost:5173).

---

## Default Login Credentials

* **System Admin (HR/IT):**
  * Email: `admin@example.com`
  * Password: `adminpassword123`
* **Department Head (Manager):**
  * Email: `john.doe@company.com` (Example manager seeded via `seedData.ts`)
  * Password: `Password@123`
* **Staff Member (Employee):**
  * Email: `jane.smith@company.com` (Example employee seeded via `seedData.ts`)
  * Password: `Password@123`

---

## License

This project is licensed under the MIT License.

---

## Production Deployment on Render

This repository includes a `render.yaml` blueprint file for zero-configuration, automated monorepo deployment on **Render**.

### Steps to Deploy:

1. **Push your code** to your own GitHub repository.
2. **Log into Render** ([dashboard.render.com](https://dashboard.render.com)).
3. Click **New +** and select **Blueprints**.
4. Connect your GitHub repository.
5. Render will automatically parse the `render.yaml` file and prepare:
   * **ems-backend:** Node/Express Web Service.
   * **ems-frontend:** React Static Site.
6. **Set Environment Variables:**
   * During the blueprint creation, you will be prompted to enter the `MONGODB_URI` connection string for the backend. Use a managed database connection string like **MongoDB Atlas**.
   * Other keys like `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` will be auto-generated securely by Render.
7. Click **Apply** to build and spin up the services.

