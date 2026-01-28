# PROJECT STRUCTURE AND ARCHITECTURE

## Directory Overview

```
e-haat/
├── client/                          # React frontend application
│   ├── src/
│   │   ├── api/                    # API integration layer
│   │   │   ├── axiosInstance.js    # Axios configuration with interceptors
│   │   │   ├── summaryApi.js       # API endpoint definitions
│   │   │   ├── fetchUserDetail.js  # User fetching utility
│   │   │   └── AxiosToastError.js  # Error handling with toast
│   │   ├── components/             # Reusable React components
│   │   │   ├── ProductCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── layout/             # Layout components (Header, Footer)
│   │   │   └── ui/                 # UI components (buttons, cards, etc.)
│   │   ├── features/               # Feature-specific modules
│   │   │   ├── admin/              # Admin dashboard features
│   │   │   ├── auth/               # Authentication pages
│   │   │   ├── cart/               # Shopping cart
│   │   │   ├── checkout/           # Checkout process
│   │   │   ├── product/            # Product-related features
│   │   │   ├── seller/             # Seller dashboard
│   │   │   └── user/               # User profile and settings
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── useCartCount.jsx
│   │   │   ├── useMobile.jsx
│   │   │   ├── useWishlistCount.jsx
│   │   │   └── useWishlistStatus.jsx
│   │   ├── lib/                    # Utility functions
│   │   │   └── utils.js
│   │   ├── pages/                  # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   └── ...
│   │   ├── routes/                 # Route configuration
│   │   │   ├── index.jsx           # Main router setup
│   │   │   ├── ProtectedRoute.jsx  # Protected route wrapper
│   │   │   └── GuestRoute.jsx      # Guest-only route wrapper
│   │   ├── store/                  # Redux store
│   │   │   ├── store.js            # Store configuration
│   │   │   └── userSlice.js        # User state management
│   │   ├── utils/                  # Utilities
│   │   │   └── loadRazorpay.js
│   │   ├── App.jsx
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── public/                     # Static assets
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── index.html
│
├── server/                          # Node.js backend application
│   ├── src/
│   │   ├── controllers/            # Route handlers
│   │   │   ├── user.controller.js
│   │   │   ├── admin.controller.js
│   │   │   ├── seller.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── cart.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── payment.controller.js
│   │   │   ├── address.controller.js
│   │   │   ├── category.controller.js
│   │   │   ├── subCategory.controller.js
│   │   │   ├── wishlist.controller.js
│   │   │   └── sellerReviewAndReport.controller.js
│   │   ├── models/                 # Database schemas
│   │   │   ├── user.model.js
│   │   │   ├── product.model.js
│   │   │   ├── order.model.js
│   │   │   ├── cart.model.js
│   │   │   ├── address.model.js
│   │   │   ├── category.model.js
│   │   │   ├── subCategory.model.js
│   │   │   ├── wishlist.model.js
│   │   │   ├── review.model.js
│   │   │   ├── sellerReview.model.js
│   │   │   ├── sellerReport.model.js
│   │   │   └── userReport.model.js
│   │   ├── routes/                 # API route definitions
│   │   │   ├── user.route.js
│   │   │   ├── admin.routes.js
│   │   │   ├── seller.route.js
│   │   │   ├── product.routes.js
│   │   │   ├── cart.routes.js
│   │   │   ├── order.routes.js
│   │   │   ├── payment.routes.js
│   │   │   ├── address.routes.js
│   │   │   ├── category.routes.js
│   │   │   ├── subCategory.routes.js
│   │   │   └── wishlist.routes.js
│   │   ├── middleware/             # Express middleware
│   │   │   ├── auth.middleware.js  # JWT verification
│   │   │   ├── roles.middleware.js # Role-based access control
│   │   │   └── multer.middleware.js# File upload handling
│   │   ├── config/                 # Configuration files
│   │   │   ├── connection.js       # MongoDB connection
│   │   │   ├── cloudinary.js       # Cloud storage setup
│   │   │   └── sendEmail.js        # Email configuration
│   │   ├── services/               # Business logic services
│   │   │   ├── email.service/      # Email templates
│   │   │   └── otpService/         # OTP generation
│   │   ├── utils/                  # Utility functions
│   │   │   ├── ApiError.js         # Custom error class
│   │   │   ├── ApiResponse.js      # Standard response class
│   │   │   ├── asyncHandler.js     # Async error wrapper
│   │   │   └── errorHandler.js     # Global error handler
│   │   ├── scripts/                # Database and utility scripts
│   │   │   ├── seedProducts.js
│   │   │   ├── fixStoreNameIndex.js
│   │   │   └── fixStoreNameIndexFinal.js
│   │   ├── test/                   # Test files
│   │   ├── app.js                  # Express app setup
│   │   └── index.js                # Server entry point
│   ├── package.json
│   ├── babel.config.js
│   ├── jest.config.js
│   └── db-test.js
│
├── .github/                        # GitHub configuration
├── .gitignore
├── README.md                       # Main readme
├── RAZORPAY_SETUP.md               # Payment integration guide
├── BUG_FIXES_AND_DOCUMENTATION.md  # Bug fixes documentation
├── FIXES_SUMMARY.md                # Fixes summary
└── ARCHITECTURE.md                 # This file
```

## Architecture Overview

### Frontend Architecture (React + Vite)

```
Client Application
│
├── Entry Point (main.jsx)
│   │
│   ├── Redux Store (Redux Toolkit)
│   │   └── User Slice (Authentication State)
│   │
│   └── Router (React Router v7)
│       ├── Public Routes (Home, Search, Product Detail)
│       ├── Guest Routes (Login, Register)
│       └── Protected Routes (Dashboard, Orders)
│
├── API Layer (Axios)
│   ├── Base Configuration
│   ├── Request Interceptor
│   ├── Response Interceptor (Token Refresh)
│   └── Endpoint Definitions (summaryApi)
│
├── Components
│   ├── Layout Components (Header, Footer)
│   ├── Page Components
│   └── UI Components
│
└── Features (Feature Modules)
    ├── Auth (Registration, Login, Password Reset)
    ├── User (Profile, Orders, Wishlist, Addresses)
    ├── Product (Browsing, Search, Details)
    ├── Cart (Add, Update, Remove, Checkout)
    ├── Seller (Dashboard, Product Management)
    └── Admin (Dashboard, User Management)
```

### Backend Architecture (Node.js + Express + MongoDB)

```
Server Application
│
├── Entry Point (index.js)
│   └── Database Connection
│
├── Middleware Stack
│   ├── Security (Helmet)
│   ├── CORS
│   ├── JSON Parser
│   ├── Cookie Parser
│   ├── Logger (Morgan)
│   ├── Authentication (verifyJWT)
│   ├── Authorization (verifyRole)
│   └── Error Handler
│
├── API Routes (v1)
│   ├── /api/v1/user
│   ├── /api/v1/admin
│   ├── /api/v1/seller
│   ├── /api/v1/products
│   ├── /api/v1/cart
│   ├── /api/v1/orders
│   ├── /api/v1/payment
│   ├── /api/v1/address
│   ├── /api/v1/category
│   ├── /api/v1/wishlist
│   └── /api/v1/sub-category
│
├── Controllers (Business Logic)
│   └── Each route has dedicated controller(s)
│
├── Models (Database Schema)
│   └── Mongoose schemas for data validation
│
├── Services
│   ├── Email Service (Resend)
│   └── OTP Service
│
├── External Services
│   ├── Cloudinary (Image Storage)
│   ├── Razorpay (Payment Gateway)
│   └── MongoDB (Database)
│
└── Utilities
    ├── Error Handling
    ├── Response Formatting
    └── Async Wrapper
```

## Data Flow Diagram

### User Registration Flow

```
Client (Register Form)
    |
    v
POST /api/v1/user/register
    |
    v
Server: registerUserController
    |
    +-> Validate Input
    +-> Check Existing User
    +-> Hash Password (bcrypt)
    +-> Create User Document
    +-> Send Verification Email
    |
    v
Response (User Created)
    |
    v
Client: Redirect to Email Verification
```

### Product Browsing Flow

```
Client (Homepage)
    |
    v
useEffect: Fetch Products
    |
    v
GET /api/v1/products
    |
    v
Server: getProductsController
    |
    +-> Query Database
    +-> Apply Filters/Pagination
    +-> Return Products with Images
    |
    v
Response (Products Array)
    |
    v
Client: Render ProductCard Components
```

### Order & Payment Flow

```
Client (Checkout)
    |
    v
POST /api/v1/payment/create-order
    |
    v
Server: createRazorpayOrder
    |
    +-> Fetch Cart Items
    +-> Calculate Total
    +-> Create Order in DB (Pending)
    +-> Create Razorpay Order
    +-> Return Order Details
    |
    v
Client: Open Razorpay Modal
    |
    v
User: Complete Payment
    |
    v
POST /api/v1/payment/verify
    |
    v
Server: verifyPayment
    |
    +-> Verify Signature
    +-> Update Order Status
    +-> Reduce Stock
    +-> Clear Cart
    +-> Send Confirmation Email
    |
    v
Response (Payment Verified)
    |
    v
Client: Redirect to Orders Page
```

## Database Schema Overview

### User Collection

```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String (Cloudinary URL),
  mobile: Number,
  role: 'USER' | 'SELLER' | 'ADMIN',
  verify_email: Boolean,
  status: 'Active' | 'Inactive' | 'Suspended',
  address_details: [ObjectId],        # Reference to Address
  shopping_cart: [ObjectId],          # Reference to Cart
  orderHistory: [ObjectId],           # Reference to Order

  # Seller-specific fields
  store_name: String,
  store_description: String,
  sellerStatus: 'Not Applied' | 'Waiting Approval' | 'Rejected' | 'Approved',
  averageRating: Number,
  ratingCount: Number,
  products_listed: [ObjectId],        # Reference to Product

  # Additional fields
  wishlist: [ObjectId],               # Reference to Product
  refreshToken: String,
  forget_password_otp: String,
  forget_password_expiry: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Collection

```
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  discount: Number,
  images: [
    {
      url: String (Cloudinary URL),
      public_id: String
    }
  ],
  category: ObjectId,                 # Reference to Category
  subCategories: [ObjectId],          # References to SubCategory
  stock: Number,
  unit: String ('kg', 'piece', 'liter'),
  seller: ObjectId,                   # Reference to User (Seller)
  isPublished: Boolean,
  averageRating: Number,
  numOfReviews: Number,
  more_details: Map,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Collection

```
{
  _id: ObjectId,
  user: ObjectId,                     # Reference to User
  orderItems: [
    {
      product: ObjectId,
      name: String,
      quantity: Number,
      price: Number,
      image: String,
      seller: ObjectId
    }
  ],
  shippingInfo: {
    fullName: String,
    mobile: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pinCode: String,
    country: String
  },
  orderTotals: {
    itemsPrice: Number,
    shippingPrice: Number,
    discountPrice: Number,
    totalPrice: Number
  },
  paymentInfo: {
    status: 'Pending' | 'Paid' | 'Failed',
    razorpayOrderId: String,
    razorpayPaymentId: String
  },
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered',
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication & Authorization Flow

### JWT Token Strategy

```
Client (Login)
    |
    v
POST /api/v1/user/login
    |
    v
Server: loginController
    |
    +-> Verify Credentials
    +-> Generate Access Token (15m expiry)
    +-> Generate Refresh Token (7d expiry)
    +-> Send tokens in HTTP-only cookies
    |
    v
Client: Store User State in Redux
    |
    v
API Request
    |
    +-> Attach accessToken from cookie
    |
    v
Server: verifyJWT Middleware
    |
    +-> Extract Token from headers or cookies
    +-> Verify Token
    +-> Attach User to Request
    |
    v
Controller Logic (Protected)
```

### Token Refresh Flow

```
API Response: 401 Unauthorized
    |
    v
Response Interceptor
    |
    +-> Check if 401 and not already retried
    |
    v
POST /api/v1/user/refresh-token
    |
    +-> Include refreshToken (HTTP-only cookie)
    |
    v
Server: refreshAccessToken
    |
    +-> Verify Refresh Token
    +-> Generate New Access Token
    +-> Send New Token in Cookie
    |
    v
Retry Original Request
    |
    v
Success or Final Error
```

### Role-Based Access Control (RBAC)

```
USER Role:
  - Browse products
  - Manage cart and wishlist
  - Place orders
  - View own orders
  - Leave reviews
  - Report sellers

SELLER Role (Approved):
  - Manage own products
  - View product sales
  - View seller ratings
  - Respond to reviews

ADMIN Role:
  - Manage all users
  - Approve/reject sellers
  - Manage categories
  - Review reports
  - Suspend accounts
```

## Key Features Architecture

### 1. Product Management

- Sellers upload products with images (Multer + Cloudinary)
- Parallel image uploads using Promise.all
- Auto-cleanup of images when product deleted
- Categories and sub-categories for organization

### 2. Shopping Cart

- One cart per user (unique constraint)
- Embedded cart items with product references
- Real-time quantity updates
- Cart persists across sessions

### 3. Order Processing

- Order creation with pending payment status
- Razorpay integration for payment processing
- Payment signature verification for security
- Automatic stock reduction on successful payment
- Order status tracking

### 4. Authentication & Security

- Password hashing with bcrypt
- JWT-based stateless authentication
- Refresh token for session persistence
- HTTP-only cookies prevent XSS attacks
- CORS protection

### 5. Cloud Media Management

- Cloudinary integration for image storage
- Automatic cleanup of unused images
- Public URL generation for frontend access

### 6. Email Notifications

- Resend API for transactional emails
- Verification email for new accounts
- Password reset emails with OTP
- Order confirmation emails

## Technology Stack Details

### Frontend Technologies

- React 19: Latest UI library
- Vite: Fast build tool and dev server
- Redux Toolkit: Predictable state management
- Axios: Promise-based HTTP client
- React Router v7: Client-side routing
- Tailwind CSS: Utility-first CSS framework
- React Hot Toast: Toast notifications

### Backend Technologies

- Node.js: JavaScript runtime
- Express.js v5: Web framework
- MongoDB: NoSQL database
- Mongoose: MongoDB ODM
- JWT: Token-based authentication
- bcrypt: Password hashing
- Multer: File upload middleware
- Cloudinary: Image hosting
- Razorpay: Payment gateway
- Resend: Email service

## Performance Considerations

### Frontend Optimization

- Code splitting with React Router
- Image lazy loading
- Redux state selectors optimization
- Debounced search functionality
- Caching strategies for API responses

### Backend Optimization

- Database indexing on frequently queried fields
- Pagination for large datasets
- Parallel file uploads with Promise.all
- Caching of user data with Redis (future)
- Query optimization with Mongoose lean()

## Security Best Practices Implemented

1. Password Security
   - Bcrypt hashing with salt rounds
   - Minimum 8 character requirement
   - Salted hashes prevent rainbow tables

2. Authentication
   - Dual-token strategy (access + refresh)
   - Short-lived access tokens
   - HTTP-only cookies prevent XSS

3. Authorization
   - Middleware-based role checking
   - Fine-grained route protection
   - Payload validation on all endpoints

4. Data Protection
   - Mongoose schema validation
   - Input sanitization
   - CORS configuration
   - Helmet security headers

5. Payment Security
   - Razorpay signature verification
   - Order amount validation
   - Transaction logging

## Deployment Architecture

### Environment Separation

```
Development
├── Local MongoDB
├── Cloudinary (test)
├── Razorpay (test mode)
└── Resend (test)

Staging
├── MongoDB Atlas (staging)
├── Cloudinary (production)
├── Razorpay (test mode)
└── Resend (production)

Production
├── MongoDB Atlas (production)
├── Cloudinary (production)
├── Razorpay (live mode)
└── Resend (production)
```

## Scalability Considerations

1. Database Scaling
   - MongoDB sharding for large datasets
   - Read replicas for high-traffic reads
   - Proper indexing for query optimization

2. Application Scaling
   - Horizontal scaling with load balancer
   - Stateless design enables distributed deployment
   - Session management via HTTP-only cookies

3. Content Delivery
   - Cloudinary CDN for image distribution
   - Browser caching headers optimization
   - Static asset minification

4. Payment Processing
   - Razorpay webhook integration (for future)
   - Transaction idempotency for retry safety
   - Async order processing

## Future Enhancements

1. Advanced Features
   - Wishlist sharing
   - Product recommendations
   - Seller ratings and reviews
   - Order tracking with real-time updates

2. Performance
   - Redis caching layer
   - Message queues for async tasks
   - CDN integration for static assets

3. Analytics
   - User behavior tracking
   - Sales analytics dashboard
   - Inventory management system

4. Marketplace Features
   - Commission structure
   - Seller payout system
   - Dispute resolution system

This architecture provides a solid foundation for a scalable, secure, and maintainable multi-vendor e-commerce platform.
