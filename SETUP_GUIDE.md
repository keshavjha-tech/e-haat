# SETUP AND INSTALLATION GUIDE

## Table of Contents

1. Prerequisites
2. Project Structure Overview
3. Backend Setup
4. Frontend Setup
5. Environment Configuration
6. Running the Application
7. Troubleshooting
8. Development Workflow

---

## Prerequisites

### Required Software

- Node.js (v16 or higher) - Download from https://nodejs.org/
- npm or yarn (comes with Node.js)
- Git - Download from https://git-scm.com/
- MongoDB Atlas account (free tier available) - https://www.mongodb.com/cloud/atlas
- Cloudinary account - https://cloudinary.com/ (free tier for 25GB storage)
- Razorpay account - https://razorpay.com/ (test mode available)
- Resend account - https://resend.com/ (for email service)

### Optional Tools

- VS Code - https://code.visualstudio.com/
- Postman - https://www.postman.com/ (for API testing)
- MongoDB Compass - https://www.mongodb.com/products/compass (database GUI)
- Redux DevTools browser extension - For debugging Redux state

### System Requirements

- RAM: Minimum 4GB (8GB recommended)
- Disk Space: At least 1GB free
- OS: Windows, macOS, or Linux

---

## Step 1: Clone the Repository

```bash
# Clone the project
git clone https://github.com/keshavjha-tech/e-haat.git

# Navigate to project directory
cd e-haat
```

---

## Step 2: Backend Setup

### 2.1 Navigate to Server Directory

```bash
cd server
```

### 2.2 Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`:

- express: Web framework
- mongoose: MongoDB ODM
- jwt: Authentication
- bcrypt: Password hashing
- multer: File uploads
- dotenv: Environment variables
- And more...

### 2.3 Create Environment File

Create a `.env` file in the `server` directory:

```bash
touch .env
```

Add the following environment variables:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/e-haat

# JWT Secrets (Generate strong random strings)
ACCESS_TOKEN_SECRET_KEY=your_access_token_secret_key_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET_KEY=your_refresh_token_secret_key_here
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Service (Resend)
RESEND_API=your_resend_api_key

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email Configuration
SENDER_EMAIL=noreply@yourdomain.com
```

### 2.4 Get Required Credentials

#### MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Create a new cluster (choose free tier)
4. Create a database user with password
5. Get connection string
6. Replace `<username>` and `<password>` with your credentials
7. Add `/e-haat` at the end for database name
8. Example: `mongodb+srv://user:pass@cluster.mongodb.net/e-haat`

#### Cloudinary Setup

1. Go to https://cloudinary.com/
2. Sign up or log in
3. Go to Dashboard
4. Copy your Cloud Name, API Key, and API Secret

#### Razorpay Setup

1. Go to https://razorpay.com/
2. Sign up or log in
3. Go to Settings → API Keys
4. For development, use Test mode credentials
5. Copy Key ID and Key Secret

#### Resend Setup

1. Go to https://resend.com/
2. Sign up or log in
3. Create a new API token
4. Copy the API key

### 2.5 Verify Backend Setup

```bash
# Test if server starts
npm run start
```

You should see:

```
Server is running on port: 8080
DB Connected
Allowed CORS Origin: http://localhost:5173
```

Press `Ctrl+C` to stop the server.

---

## Step 3: Frontend Setup

### 3.1 Navigate to Client Directory

```bash
cd ../client
```

### 3.2 Install Dependencies

```bash
npm install
```

This will install:

- react: UI library
- react-router-dom: Routing
- redux: State management
- axios: HTTP client
- tailwindcss: CSS framework
- And more...

### 3.3 Create Environment File

Create a `.env.local` file in the `client` directory:

```bash
touch .env.local
```

Add the following:

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api/v1
VITE_RAZORPAY_KEY=your_razorpay_key_id
```

### 3.4 Verify Frontend Setup

```bash
# Start development server
npm run dev
```

You should see:

```
VITE v... dev server running at:

  > Local:   http://localhost:5173/
  > Press q to quit
```

Open http://localhost:5173 in your browser to see the application.

---

## Step 4: Running Both Applications

### Option 1: Separate Terminals

Terminal 1 (Backend):

```bash
cd e-haat/server
npm run start
```

Terminal 2 (Frontend):

```bash
cd e-haat/client
npm run dev
```

### Option 2: Run in Parallel

From the root directory:

```bash
# Using concurrently (if installed globally)
npm run dev:all

# Or manually in different terminals as shown above
```

---

## Step 5: Initial Database Setup (Optional)

### 5.1 Seed Products (Optional)

If you want to populate the database with sample products:

```bash
cd server
npm run seed
```

This will insert sample products into your MongoDB database.

### 5.2 Fix Store Name Index (if needed)

```bash
cd server
npm run fix-index-final
```

---

## Step 6: Test the Application

### 6.1 Register a New User

1. Navigate to http://localhost:5173
2. Click on "Register"
3. Fill in name, email, and password
4. Submit the form

### 6.2 Login

1. Click on "Login"
2. Use the credentials you registered with
3. You should be logged in and see your profile

### 6.3 Test Cart Functionality

1. Browse products on homepage
2. Click on a product
3. Add to cart
4. Check cart by clicking cart icon

### 6.4 Test Payment (Test Mode)

1. Add items to cart
2. Go to checkout
3. Add shipping address
4. Click "Pay Now"
5. Use test card: 4111 1111 1111 1111
6. Any CVV and future expiry date
7. Complete payment

---

## Development Workflow

### 6.1 File Watching

Both development servers include automatic file watching:

- Frontend: Changes in `client/src` auto-reload
- Backend: Requires manual restart (or use nodemon)

### 6.2 Debug Mode

#### Frontend Debugging

- Open browser DevTools (F12)
- Go to Console tab to see logs
- Install Redux DevTools extension for state debugging

#### Backend Debugging

- Check server console for logs
- Use VS Code debugger for step-by-step debugging
- Add `console.log()` statements as needed

### 6.3 Database Inspection

Use MongoDB Compass to inspect database:

1. Download MongoDB Compass
2. Connect using your MongoDB URI
3. Browse collections and documents

### 6.4 API Testing

Use Postman to test API endpoints:

1. Download Postman
2. Create a new request
3. Set URL to `http://localhost:8080/api/v1/...`
4. Add headers and body as needed
5. Send request and inspect response

---

## Troubleshooting

### Issue: "Port 8080 already in use"

**Solution:**

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8080
kill -9 <PID>
```

### Issue: "Port 5173 already in use"

**Solution:**

```bash
# Run on different port
npm run dev -- --port 5174
```

### Issue: "Cannot connect to MongoDB"

**Check:**

1. MongoDB URI is correct in `.env`
2. Database user has access to the database
3. IP address is whitelisted in MongoDB Atlas (add 0.0.0.0/0 for development)
4. VPN/Network allows connection

### Issue: "Cloudinary upload fails"

**Check:**

1. Cloudinary credentials are correct
2. Account has storage available (25GB free)
3. Upload preset is configured (if using unsigned uploads)

### Issue: "Razorpay payment fails"

**Check:**

1. Using test mode credentials for development
2. Test card: 4111 1111 1111 1111
3. Test mode is enabled in Razorpay dashboard

### Issue: "Emails not sending"

**Check:**

1. Resend API key is correct
2. Sender email is verified in Resend
3. Check Resend dashboard for failed attempts

### Issue: "401 Unauthorized errors"

**Check:**

1. Access token is included in request
2. Token hasn't expired
3. User is logged in

### Issue: "CORS errors"

**Check:**

1. Frontend URL is correct in `FRONTEND_URL` env var
2. Backend CORS middleware allows frontend origin
3. Credentials are included in requests

### Issue: "Build errors in frontend"

**Solution:**

```bash
cd client
rm -rf node_modules
npm install
npm run build
```

### Issue: "Cannot find module errors"

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Production Deployment

### Before Deploying

1. Change NODE_ENV to production
2. Use production MongoDB URI
3. Use live Razorpay credentials (complete KYC first)
4. Enable HTTPS
5. Set strong JWT secrets
6. Configure CORS for production domain
7. Run tests: `npm run test`

### Build Frontend

```bash
cd client
npm run build
```

### Deploy Backend

- Use services like Heroku, AWS, or DigitalOcean
- Set environment variables on hosting platform
- Ensure Node.js version matches

### Deploy Frontend

- Use services like Vercel, Netlify, or AWS S3 + CloudFront
- Update API URL to production backend
- Enable caching and compression

---

## Environment Variables Summary

### Backend (.env)

```
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
ACCESS_TOKEN_SECRET_KEY=...
REFRESH_TOKEN_SECRET_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local)

```
VITE_API_URL=http://localhost:8080/api/v1
VITE_RAZORPAY_KEY=your_razorpay_key_id
```

---

## Scripts Available

### Backend Scripts

```bash
npm run start       # Start development server with nodemon
npm run test        # Run tests with Jest
npm run seed        # Seed sample products
npm run fix-index   # Fix store name index
npm run fix-index-final  # Final fix for index
```

### Frontend Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run lint        # Run ESLint
npm run preview     # Preview production build
```

---

## Next Steps

1. Read [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture
2. Read [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API endpoints
3. Read [BUG_FIXES_AND_DOCUMENTATION.md](BUG_FIXES_AND_DOCUMENTATION.md) for known issues
4. Start developing features

---

## Getting Help

If you encounter issues:

1. Check the Troubleshooting section above
2. Read error messages carefully
3. Check console logs for details
4. Search GitHub issues
5. Create a new issue with details

---

## Checklist for Setup

- [ ] Node.js and npm installed
- [ ] Project cloned
- [ ] Backend dependencies installed
- [ ] Backend `.env` file created with all variables
- [ ] MongoDB URI configured and tested
- [ ] Frontend dependencies installed
- [ ] Frontend `.env.local` file created
- [ ] Both servers running without errors
- [ ] Can access frontend at http://localhost:5173
- [ ] Can register and login
- [ ] Can add products to cart
- [ ] Can complete test payment
- [ ] Redux DevTools working (optional)
- [ ] MongoDB Compass connected (optional)

If all items are checked, your setup is complete!
