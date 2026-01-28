# DEVELOPMENT GUIDE

## Table of Contents

1. Project Structure
2. Coding Standards
3. Frontend Development
4. Backend Development
5. Database Operations
6. Git Workflow
7. Testing Strategy
8. Performance Tips
9. Debugging Guide
10. Common Tasks

---

## Project Structure

### Frontend Organization (React)

```
client/src/
├── api/                          # API layer
│   ├── axiosInstance.js         # Axios setup with interceptors
│   ├── summaryApi.js            # API endpoint definitions
│   ├── fetchUserDetail.js       # Data fetching utilities
│   └── AxiosToastError.js       # Error handling
│
├── components/                   # Reusable components
│   ├── ProductCard.jsx          # Product display
│   ├── SearchBar.jsx            # Search functionality
│   ├── layout/                  # Layout wrappers
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Layout.jsx
│   └── ui/                      # Generic UI components
│       ├── Button.jsx
│       ├── Modal.jsx
│       └── Card.jsx
│
├── features/                     # Feature modules (grouped by feature)
│   ├── auth/                    # Authentication
│   │   ├── RegisterPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── ForgotPasswordPage.jsx
│   ├── user/                    # User account
│   │   ├── UserDashboard.jsx
│   │   ├── UserProfilePage.jsx
│   │   └── ManageAddressesPage.jsx
│   ├── product/                 # Product features
│   │   └── ProductManagement.jsx
│   ├── cart/                    # Shopping cart
│   │   └── CartLogic.js
│   ├── checkout/                # Checkout process
│   │   └── CheckoutFlow.jsx
│   ├── seller/                  # Seller dashboard
│   │   └── SellerDashboard.jsx
│   └── admin/                   # Admin panel
│       └── AdminDashboard.jsx
│
├── hooks/                        # Custom React hooks
│   ├── useCartCount.jsx         # Cart item count
│   ├── useWishlistCount.jsx     # Wishlist count
│   ├── useWishlistStatus.jsx    # Check if in wishlist
│   └── useMobile.jsx            # Mobile detection
│
├── pages/                        # Page components
│   ├── Home.jsx
│   ├── CartPage.jsx
│   ├── CheckoutPage.jsx
│   ├── ProductDetailPage.jsx
│   ├── SearchPage.jsx
│   ├── ContactPage.jsx
│   ├── AboutPage.jsx
│   ├── SupportPage.jsx
│   └── Notification.jsx
│
├── routes/                       # Routing
│   ├── index.jsx               # Main router
│   ├── ProtectedRoute.jsx      # Auth required
│   └── GuestRoute.jsx          # Not logged in
│
├── store/                        # Redux state management
│   ├── store.js                # Store config
│   └── userSlice.js            # User reducer
│
├── lib/                          # Utilities
│   └── utils.js
│
├── utils/                        # App utilities
│   └── loadRazorpay.js         # Payment loading
│
├── App.jsx                       # Root component
├── main.jsx                      # Entry point
└── index.css                     # Global styles
```

### Backend Organization (Node.js)

```
server/src/
├── controllers/                  # Request handlers
│   ├── user.controller.js       # User operations
│   ├── admin.controller.js      # Admin operations
│   ├── seller.controller.js     # Seller operations
│   ├── product.controller.js    # Product CRUD
│   ├── cart.controller.js       # Cart operations
│   ├── order.controller.js      # Order handling
│   ├── payment.controller.js    # Payment processing
│   ├── address.controller.js    # Address CRUD
│   ├── category.controller.js   # Category CRUD
│   ├── wishlist.controller.js   # Wishlist CRUD
│   └── sellerReviewAndReport.controller.js
│
├── models/                       # Database schemas
│   ├── user.model.js           # User schema
│   ├── product.model.js        # Product schema
│   ├── order.model.js          # Order schema
│   ├── cart.model.js           # Cart schema
│   ├── address.model.js        # Address schema
│   ├── category.model.js       # Category schema
│   ├── subCategory.model.js    # SubCategory schema
│   ├── review.model.js         # Review schema
│   ├── sellerReview.model.js   # Seller rating schema
│   ├── wishlist.model.js       # Wishlist schema
│   ├── sellerReport.model.js   # Seller report schema
│   └── userReport.model.js     # User report schema
│
├── routes/                       # API routes
│   ├── user.route.js
│   ├── admin.routes.js
│   ├── seller.route.js
│   ├── product.routes.js
│   ├── cart.routes.js
│   ├── order.routes.js
│   ├── payment.routes.js
│   ├── address.routes.js
│   ├── category.routes.js
│   ├── subCategory.routes.js
│   └── wishlist.routes.js
│
├── middleware/                   # Express middleware
│   ├── auth.middleware.js       # JWT verification
│   ├── roles.middleware.js      # RBAC
│   └── multer.middleware.js     # File uploads
│
├── config/                       # Configuration
│   ├── connection.js            # DB connection
│   ├── cloudinary.js           # Cloud storage
│   └── sendEmail.js            # Email service
│
├── services/                     # Business logic
│   ├── email.service/
│   │   ├── verifyEmailTemplate.js
│   │   └── resetPasswordTemplate.js
│   └── otpService/
│       └── generateOTP.js
│
├── utils/                        # Utilities
│   ├── ApiError.js             # Error class
│   ├── ApiResponse.js          # Response class
│   ├── asyncHandler.js         # Error wrapper
│   └── errorHandler.js         # Global error handler
│
├── scripts/                      # Utility scripts
│   ├── seedProducts.js         # Seed data
│   └── fixStoreNameIndex.js    # Index fixes
│
├── app.js                        # Express app setup
├── index.js                      # Server entry
└── test/                         # Test files
```

---

## Coding Standards

### JavaScript/React Best Practices

#### 1. Naming Conventions

```javascript
// Constants (UPPER_CASE)
const MAX_ITEMS_PER_PAGE = 10;
const API_TIMEOUT = 5000;

// Variables and functions (camelCase)
let userCount = 0;
function getUserById(id) {}
const fetchUserData = async () => {};

// Components (PascalCase)
function UserProfile() {}
const ProductCard = () => {};

// Private functions (prefix with _)
const _formatDate = (date) => {};
```

#### 2. Component Structure

```jsx
// Imports first
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { someFunction } from "../utils";

// Component
function MyComponent({ prop1, prop2 }) {
  // Hooks at the top
  const [state, setState] = useState(null);
  const selector = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Effects
  useEffect(() => {
    // Logic
  }, []);

  // Event handlers
  const handleClick = () => {};

  // Render
  return <div>{/* JSX */}</div>;
}

export default MyComponent;
```

#### 3. Error Handling

```javascript
// Frontend
try {
  const response = await axiosInstance.get("/api/endpoint");
  return response.data;
} catch (error) {
  const message = error.response?.data?.message || "Error occurred";
  toast.error(message);
  return null;
}

// Backend
try {
  // Logic
  res.json(new ApiResponse(200, data, "Success"));
} catch (error) {
  next(new ApiError(500, "Server error"));
}
```

#### 4. Comments and Documentation

```javascript
// Use comments for why, not what
// Retry request 3 times if network fails
const retryRequest = async () => {
  // Bad: let x = 0;
  let attemptCount = 0;
};

// Document complex functions
/**
 * Calculate total price including shipping and discount
 * @param {number} itemsPrice - Total price of items
 * @param {number} discount - Discount percentage
 * @returns {number} Final price to be paid
 */
function calculateTotal(itemsPrice, discount) {
  const discountAmount = itemsPrice * (discount / 100);
  const shippingPrice = itemsPrice > 499 ? 0 : 50;
  return itemsPrice - discountAmount + shippingPrice;
}
```

#### 5. Code Organization

```javascript
// Bad: All in one file
function getUser() {}
function saveProduct() {}
function sendEmail() {}
function validateForm() {}

// Good: Separated by concern
// services/userService.js
export const getUser = () => {};
export const saveProduct = () => {};

// services/emailService.js
export const sendEmail = () => {};

// utils/validators.js
export const validateForm = () => {};
```

---

## Frontend Development

### 1. Creating a New Component

```jsx
// Create component file: src/components/UserCard.jsx
import React from "react";
import PropTypes from "prop-types";

function UserCard({ user, onEdit, onDelete }) {
  if (!user) return null;

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-bold">{user.name}</h3>
      <p className="text-gray-600">{user.email}</p>
      <div className="flex gap-2 mt-4">
        <button onClick={() => onEdit(user._id)}>Edit</button>
        <button onClick={() => onDelete(user._id)}>Delete</button>
      </div>
    </div>
  );
}

UserCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.required,
    name: PropTypes.string.required,
    email: PropTypes.string.required,
  }),
  onEdit: PropTypes.func.required,
  onDelete: PropTypes.func.required,
};

export default UserCard;
```

### 2. Using Redux for State

```javascript
// In a component
import { useSelector, useDispatch } from "react-redux";
import { setUser, logout } from "../store/userSlice";

function MyComponent() {
  const userData = useSelector((state) => state.user?.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!userData) {
    return <div>Not authenticated</div>;
  }

  return <div>Welcome, {userData.name}</div>;
}
```

### 3. Making API Calls

```javascript
// Create a custom hook for API calls
// hooks/useFetchProducts.js
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import summaryApi from "../api/summaryApi";

function useFetchProducts(page = 1, limit = 10) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance({
          ...summaryApi.products,
          params: { page, limit },
        });
        setProducts(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit]);

  return { products, loading, error };
}

export default useFetchProducts;

// Use the hook in a component
function ProductList() {
  const { products, loading, error } = useFetchProducts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

### 4. Conditional Rendering

```jsx
// Bad
function Component() {
  if (loading) return <Loading />;
  if (error) return <Error />;
  if (data.length === 0) return <Empty />;
  if (data) return <List data={data} />;
}

// Good
function Component() {
  if (loading) return <Loading />;
  if (error) return <Error />;

  return data.length === 0 ? <Empty /> : <List data={data} />;
}
```

---

## Backend Development

### 1. Creating a New Controller

```javascript
// controllers/example.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ExampleModel } from "../models/example.model.js";

// Get all examples
const getAllExamples = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  const examples = await ExampleModel.find().skip(skip).limit(limit).lean(); // Use lean() for read-only data

  const total = await ExampleModel.countDocuments();

  res.json(
    new ApiResponse(
      200,
      {
        examples,
        pagination: { page, limit, total },
      },
      "Examples fetched successfully",
    ),
  );
});

// Get by ID
const getExampleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const example = await ExampleModel.findById(id);

  if (!example) {
    throw new ApiError(404, "Example not found");
  }

  res.json(new ApiResponse(200, example, "Example fetched"));
});

// Create
const createExample = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Name and description are required");
  }

  const example = await ExampleModel.create({ name, description });

  res
    .status(201)
    .json(new ApiResponse(201, example, "Example created successfully"));
});

// Update
const updateExample = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const example = await ExampleModel.findByIdAndUpdate(
    id,
    { name, description },
    { new: true, runValidators: true },
  );

  if (!example) {
    throw new ApiError(404, "Example not found");
  }

  res.json(new ApiResponse(200, example, "Example updated"));
});

// Delete
const deleteExample = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const example = await ExampleModel.findByIdAndDelete(id);

  if (!example) {
    throw new ApiError(404, "Example not found");
  }

  res.json(new ApiResponse(200, {}, "Example deleted"));
});

export {
  getAllExamples,
  getExampleById,
  createExample,
  updateExample,
  deleteExample,
};
```

### 2. Creating Routes

```javascript
// routes/example.routes.js
import { Router } from "express";
import {
  getAllExamples,
  getExampleById,
  createExample,
  updateExample,
  deleteExample,
} from "../controllers/example.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRole } from "../middleware/roles.middleware.js";

const exampleRouter = Router();

// Public routes
exampleRouter.get("/", getAllExamples);
exampleRouter.get("/:id", getExampleById);

// Protected routes
exampleRouter.post("/", verifyJWT, authorizeRole("ADMIN"), createExample);

exampleRouter.put("/:id", verifyJWT, authorizeRole("ADMIN"), updateExample);

exampleRouter.delete("/:id", verifyJWT, authorizeRole("ADMIN"), deleteExample);

export default exampleRouter;
```

### 3. Model Best Practices

```javascript
// models/example.model.js
import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: [3, "Name must be at least 3 characters"],
      maxLength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "Status must be either active or inactive",
      },
      default: "active",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [String],
    metadata: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

// Index for performance
exampleSchema.index({ owner: 1, status: 1 });
exampleSchema.index({ name: "text", description: "text" });

// Virtual for computed fields
exampleSchema.virtual("isNew").get(function () {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.createdAt > oneDayAgo;
});

// Middleware
exampleSchema.pre("save", async function (next) {
  // Do something before saving
  next();
});

exampleSchema.post("save", function (doc) {
  // Do something after saving
});

export const ExampleModel = mongoose.model("Example", exampleSchema);
```

### 4. Async Handler Pattern

The `asyncHandler` wrapper handles errors automatically:

```javascript
// Without asyncHandler (lots of try-catch)
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// With asyncHandler (clean)
router.get(
  "/user/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, "Not found");
    res.json(new ApiResponse(200, user));
  }),
);
```

---

## Database Operations

### 1. MongoDB Query Patterns

```javascript
// Finding
const user = await User.findById(id);
const users = await User.find({ status: "active" });
const user = await User.findOne({ email });

// Updating
await User.findByIdAndUpdate(
  id,
  { name: "New Name" },
  { new: true, runValidators: true },
);

// Updating multiple
await User.updateMany({ status: "inactive" }, { status: "archived" });

// Deleting
await User.findByIdAndDelete(id);
await User.deleteMany({ status: "archived" });

// Pagination
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;
const users = await User.find().skip(skip).limit(limit);

// Sorting
const users = await User.find().sort({ createdAt: -1 });

// Selecting fields
const users = await User.find().select("name email -password");

// Populating references
const order = await Order.findById(id).populate("user", "name email");

// Lean query (read-only, faster)
const users = await User.find().lean();

// Aggregation
const stats = await User.aggregate([
  { $match: { status: "active" } },
  { $group: { _id: null, count: { $sum: 1 } } },
]);
```

### 2. Transactions (for data consistency)

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  // Operations
  await Order.create([order], { session });
  await Product.updateOne(
    { _id: productId },
    { $inc: { stock: -qty } },
    { session },
  );

  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  await session.endSession();
}
```

---

## Git Workflow

### 1. Branching Strategy

```bash
# Main branches
main              # Production-ready code
develop           # Development branch

# Feature branches
feature/user-auth
feature/product-search
feature/payment-integration

# Bug fix branches
bugfix/login-error
bugfix/cart-calculation

# Branch naming
feature/<short-description>
bugfix/<short-description>
hotfix/<short-description>
```

### 2. Git Commands

```bash
# Create and switch to new branch
git checkout -b feature/my-feature

# Commit with message
git commit -m "feat: add user authentication"

# Push to remote
git push origin feature/my-feature

# Create pull request (on GitHub)
# Request review from team

# After approval, merge
git checkout develop
git pull origin develop
git merge feature/my-feature
git push origin develop

# Delete branch
git branch -d feature/my-feature
```

### 3. Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>

Type: feat, fix, docs, style, refactor, test, chore
Scope: user, product, payment, etc.

Example:
feat(auth): add JWT token refresh mechanism

- Implement token refresh endpoint
- Add response interceptor for 401 errors
- Update auth middleware

Fixes #123
```

---

## Testing Strategy

### Frontend Testing

```javascript
// Install: npm install --save-dev @testing-library/react

import { render, screen, fireEvent } from "@testing-library/react";
import LoginComponent from "./LoginComponent";

test("renders login form", () => {
  render(<LoginComponent />);
  expect(screen.getByText("Login")).toBeInTheDocument();
});

test("submits form with credentials", async () => {
  render(<LoginComponent />);

  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "password123" },
  });

  fireEvent.click(screen.getByText("Login"));

  expect(screen.getByText("Logging in...")).toBeInTheDocument();
});
```

### Backend Testing

```javascript
// Install: npm install --save-dev jest supertest

const request = require("supertest");
const app = require("../app");

describe("User API", () => {
  it("should register a new user", async () => {
    const response = await request(app).post("/api/v1/user/register").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("_id");
  });

  it("should not register duplicate email", async () => {
    // First registration
    await request(app).post("/api/v1/user/register").send({
      name: "John",
      email: "john@example.com",
      password: "password123",
    });

    // Duplicate attempt
    const response = await request(app).post("/api/v1/user/register").send({
      name: "Jane",
      email: "john@example.com",
      password: "password456",
    });

    expect(response.status).toBe(409);
  });
});
```

---

## Performance Tips

### Frontend Optimization

```javascript
// 1. Use React.memo for expensive components
const ProductCard = React.memo(({ product }) => <div>{product.name}</div>);

// 2. Use useCallback for memoized functions
const handleClick = useCallback(() => {
  console.log("Clicked");
}, []);

// 3. Use useMemo for expensive calculations
const totalPrice = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);

// 4. Lazy load images
<img loading="lazy" src="image.jpg" />;

// 5. Code splitting with React.lazy
const AdminPanel = React.lazy(() => import("./AdminPanel"));

// 6. Debounce search input
const debouncedSearch = debounce((query) => {
  fetchResults(query);
}, 300);
```

### Backend Optimization

```javascript
// 1. Use lean() for read-only queries
const products = await Product.find().lean();

// 2. Select specific fields
const users = await User.find().select('name email');

// 3. Pagination instead of loading all
const users = await User.find().skip(skip).limit(limit);

// 4. Database indexes
schema.index({ email: 1 }); // Index frequently queried fields

// 5. Caching
const cachedUser = cache.get(userId);
if (cachedUser) return cachedUser;

// 6. Batch operations
await Product.bulkWrite([
  { updateOne: { filter: {...}, update: {...} } },
  { updateOne: { filter: {...}, update: {...} } }
]);
```

---

## Debugging Guide

### Frontend Debugging

```javascript
// 1. Browser Console
console.log("Value:", value);
console.table(arrayOfObjects);
console.time("operation");
// ... code ...
console.timeEnd("operation");

// 2. Redux DevTools
// Install extension and inspect state changes

// 3. Network Tab
// Check API requests and responses

// 4. React DevTools
// Inspect component hierarchy and props

// 5. Debugger statement
debugger; // Will pause execution

// 6. Error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.log("Error:", error, errorInfo);
  }
}
```

### Backend Debugging

```javascript
// 1. Console logs
console.log("User:", req.user);
console.error("Error:", error);

// 2. VS Code debugger
// Add breakpoints and use debugger

// 3. MongoDB logs
// Enable MongoDB query logging

// 4. Request logging with Morgan
app.use(morgan("dev"));

// 5. Custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});
```

---

## Common Tasks

### Add a New Product

1. Create route in `server/src/routes/product.routes.js`
2. Create controller in `server/src/controllers/product.controller.js`
3. Update model if needed in `server/src/models/product.model.js`
4. Test with Postman
5. Update frontend API definitions in `client/src/api/summaryApi.js`
6. Create frontend component to consume API

### Add User Role

1. Update User model: add new role to enum
2. Update `authorizeRole` middleware to include new role
3. Create specific routes for new role
4. Add role-based components on frontend

### Add Email Notification

1. Create email template in `server/src/services/email.service/`
2. Add controller logic to send email using Resend
3. Add trigger point (after registration, order, etc.)

### Database Migration

```javascript
// Create migration script in server/src/scripts/
const mongoose = require("mongoose");

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Make changes to database
  await User.updateMany({}, { $set: { newField: defaultValue } });

  await mongoose.connection.close();
}

migrate().catch(console.error);

// Run with: node src/scripts/migration.js
```

---

## Resources

- Node.js Docs: https://nodejs.org/docs/
- Express Docs: https://expressjs.com/
- MongoDB Docs: https://docs.mongodb.com/
- Mongoose Docs: https://mongoosejs.com/
- React Docs: https://react.dev/
- Redux Docs: https://redux.js.org/
- Vite Docs: https://vitejs.dev/

This guide provides the foundation for consistent, maintainable development across the e-Haat project.
