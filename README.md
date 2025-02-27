# Casino Adwall Website

A dynamic, user-friendly casino adwall website for affiliate ysivitonen95. The website features various casino banners, detailed casino information, and the ability to manage content seamlessly through an admin panel.

## Features

- **Front Page**: Displays featured casino banners and a filterable list of casinos
- **Casino Listings**: Browse all casinos with search and filter functionality
- **New Casinos**: View the latest casino additions
- **Top Payment & Payout**: Find casinos with the best payout rates and payment options
- **Giveaways**: Discover exclusive casino promotions and bonuses
- **Admin Panel**: Secure admin interface to manage all content

## Tech Stack

- **Frontend**: React, React Router, Bootstrap, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Uploads**: Multer

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd casino-adwall
   ```

2. Install dependencies:
   ```
   npm run install-all
   ```

3. Set up environment variables:
   - Create a `.env` file in the server directory with the following variables:
     ```
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/casino-adwall
     JWT_SECRET=your_jwt_secret_key_here
     NODE_ENV=development
     ```

4. Seed the database with an admin user:
   ```
   npm run seed
   ```
   This creates an admin user with:
   - Username: admin
   - Password: admin123

## Running the Application

### Development Mode

Run both the server and client concurrently:
```
npm run dev
```

Or run them separately:
```
npm run server
npm run client
```

### Production Build

Create a production build of the client:
```
npm run build
```

Then start the server:
```
npm start
```

## Admin Access

Access the admin panel at `/admin/login` with the credentials:
- Username: admin
- Password: admin123

## Project Structure

```
casino-adwall/
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # Reusable components
│       ├── pages/          # Page components
│       └── ...
├── server/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── uploads/            # Uploaded files
│   └── server.js           # Server entry point
└── ...
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user (admin only)
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Casinos
- `GET /api/casinos` - Get all casinos
- `GET /api/casinos/:id` - Get casino by ID
- `POST /api/casinos` - Create a new casino (admin only)
- `PUT /api/casinos/:id` - Update a casino (admin only)
- `DELETE /api/casinos/:id` - Delete a casino (admin only)

### Banners
- `GET /api/banners` - Get all banners
- `GET /api/banners/:id` - Get banner by ID
- `POST /api/banners` - Create a new banner (admin only)
- `PUT /api/banners/:id` - Update a banner (admin only)
- `DELETE /api/banners/:id` - Delete a banner (admin only)

### Giveaways
- `GET /api/giveaways` - Get all giveaways
- `GET /api/giveaways/:id` - Get giveaway by ID
- `POST /api/giveaways` - Create a new giveaway (admin only)
- `PUT /api/giveaways/:id` - Update a giveaway (admin only)
- `DELETE /api/giveaways/:id` - Delete a giveaway (admin only)
