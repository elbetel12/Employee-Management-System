# Employee Management System

A modern, responsive Employee Management System built with React (TypeScript) and MongoDB.

## Features

- User Authentication with JWT
- Employee Management
- Department Management
- Leave Management
- Attendance Tracking
- Payroll Management
- Performance Evaluations
- Work Hours Reporting
- QR Code-based Attendance

## Tech Stack

### Backend

- Node.js
- Express
- TypeScript
- MongoDB (with Mongoose)
- JWT Authentication

### Frontend

- React
- TypeScript
- Redux Toolkit
- React Router
- Axios
- Bootstrap
- Chart.js

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository:

```
git clone <repository-url>
cd employee-management-system
```

2. Install backend dependencies:

```
cd backend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/employeeManagementSystem
JWT_SECRET=your_secret_key
```

4. Install frontend dependencies:

```
cd ../frontend
npm install
```

### Running the application

1. Start the backend server (from the backend directory):

```
npm run dev
```

2. Start the frontend server (from the frontend directory):

```
npm start
```

3. Open a browser and navigate to `http://localhost:3000`

## Default Admin User

Username: admin
Password: admin123

## License

This project is licensed under the MIT License.
