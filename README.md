# Mr.Fodee 🍔

Mr.Fodee is a modern food ordering and delivery platform built with a robust monorepo-style architecture. It consists of a user-facing client application, a dedicated admin panel, and a centralized Express backend.

## 🚀 Project Overview

The platform is designed to provide a seamless food ordering experience for users while offering comprehensive management tools for administrators to oversee restaurants, offers, and users.

---

## 🏗️ Project Structure

The repository is organized into three main directories:

- **[`/client`](./client)**: The main user-facing application built with Next.js.
- **[`/mr.fodee_admin`](./mr.fodee_admin)**: The administrator dashboard for managing the platform.
- **[`/server`](./server)**: The core API backend powered by Express and MongoDB.

---

## 💻 Tech Stack

### Frontend (Client & Admin)

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **State Management**: React Context API
- **Utilities**: Axios, React Hot Toast
- **PDF Generation**: jsPDF (used in client)

### Backend

- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB (via Mongoose)
- **Authentication**: bcryptjs
- **File Storage**: Cloudinary (via Multer)

---

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- Cloudinary Account (for image uploads)

### 1. Clone the repository

```bash
git clone <repository-url>
cd Mr.Fodee
```

### 2. Backend Setup ([`/server`](./server))

```bash
cd server
npm install
```

Create a `.env` file in the `/server` directory:

```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=admin@mrfodee.com
ADMIN_PASSWORD=your_admin_password
```

Run the server:

```bash
npm run dev
```

### 3. Client Setup ([`/client`](./client))

```bash
cd ../client
npm install
```

Create a `.env` file in the `/client` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Run the client:

```bash
npm run dev
```

### 4. Admin Panel Setup ([`/mr.fodee_admin`](./mr.fodee_admin))

```bash
cd ../mr.fodee_admin
npm install
```

Create a `.env` file in the `/mr.fodee_admin` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Run the admin panel:

```bash
npm run dev
```

---

## ✨ Key Features

- **Food Ordering**: Browse restaurants and menus with a modern UI.
- **Admin Dashboard**: Complete CRUD for Restaurants, Offers, and Users.
- **Interactive Map Support**: Integration for location-based services.
- **Invoice Generation**: Auto-generate PDFs for completed orders.
- **Cloud-based Media**: Efficient image management using Cloudinary.
- **Responsive Design**: Fully optimized for both desktop and mobile users.

---

## 📜 License

This project is licensed under the [ISC](LICENSE) License.
