# Mr.Fodee Backend 🚀

The server-side API for Mr.Fodee, built with Node.js, Express, and MongoDB.

## 🛠️ Tech Stack

- **Node.js**: Runtime environment
- **Express 5**: Web framework
- **Mongoose 9**: MongoDB object modeling
- **Multer & Cloudinary**: Image upload and storage
- **Bcryptjs**: Password hashing

## ⚙️ Configuration

Create a `.env` file in this directory with the following variables:

```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=admin@mrfodee.com
ADMIN_PASSWORD=your_admin_password
```

## 🚀 Running the Server

```bash
npm install
npm run dev
```

## 📂 Project Structure

- `index.js`: Entry point of the application
- `route/`: API routes definitions
- `module/`: Mongoose models/schemas
- `config/`: Configuration files
- `diagnostic_guide.js`: Utility for troubleshooting common issues
