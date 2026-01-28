# API DOCUMENTATION

## Base URL

```
http://localhost:8080/api/v1
```

## Authentication

Most endpoints require JWT authentication. Include the access token in one of these ways:

- HTTP-only cookie (automatically sent by browser)
- Authorization header: `Authorization: Bearer <access_token>`

## Response Format

All successful responses follow this structure:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success message",
  "success": true
}
```

Error responses:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "success": false
}
```

---

## User Endpoints

### 1. Register User

- **Endpoint:** `POST /user/register`
- **Authentication:** No
- **Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

- **Response:** User object (without password)
- **Status Codes:** 201 (Created), 409 (User exists), 400 (Invalid input)

### 2. Verify Email

- **Endpoint:** `POST /user/verify-email`
- **Authentication:** No
- **Request Body:**

```json
{
  "code": "userId"
}
```

- **Response:** Success message
- **Status Codes:** 200 (Success), 400 (Invalid code)

### 3. Login

- **Endpoint:** `POST /user/login`
- **Authentication:** No
- **Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

- **Response:** User object with tokens in HTTP-only cookies
- **Cookies Set:**
  - `accessToken` (15 minutes expiry)
  - `refreshToken` (7 days expiry)
- **Status Codes:** 200 (Success), 401 (Invalid credentials), 400 (Email not verified)

### 4. Logout

- **Endpoint:** `GET /user/logout`
- **Authentication:** Required
- **Response:** Success message
- **Status Codes:** 200 (Success), 401 (Unauthorized)

### 5. Get User Details

- **Endpoint:** `GET /user/user-detail`
- **Authentication:** Required
- **Response:** User object
- **Status Codes:** 200 (Success), 401 (Unauthorized)

### 6. Update User Details

- **Endpoint:** `PUT /user/update-user`
- **Authentication:** Required
- **Request Body:**

```json
{
  "name": "Jane Doe",
  "avatar": "cloudinary_url",
  "mobile": 9876543210
}
```

- **Response:** Updated user object
- **Status Codes:** 200 (Success), 400 (Invalid input), 401 (Unauthorized)

### 7. Forgot Password

- **Endpoint:** `PUT /user/forgot-password`
- **Authentication:** No
- **Request Body:**

```json
{
  "email": "john@example.com"
}
```

- **Response:** OTP sent to email
- **Status Codes:** 200 (Success), 404 (User not found)

### 8. Verify OTP

- **Endpoint:** `PUT /user/verify-forgot-password-otp`
- **Authentication:** No
- **Request Body:**

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

- **Response:** Success message
- **Status Codes:** 200 (Success), 400 (Invalid OTP)

### 9. Reset Password

- **Endpoint:** `PUT /user/reset-password`
- **Authentication:** No
- **Request Body:**

```json
{
  "email": "john@example.com",
  "newPassword": "newpass123"
}
```

- **Response:** Success message
- **Status Codes:** 200 (Success), 400 (Password invalid)

### 10. Refresh Access Token

- **Endpoint:** `POST /user/refresh-token`
- **Authentication:** No (uses refreshToken cookie)
- **Response:** Success message
- **Cookies Set:** New `accessToken`
- **Status Codes:** 200 (Success), 401 (Invalid refresh token)

### 11. Apply to be Seller

- **Endpoint:** `PUT /user/apply-seller`
- **Authentication:** Required
- **Request Body:**

```json
{
  "store_name": "My Store",
  "store_description": "Store description"
}
```

- **Response:** Updated user object with seller status
- **Status Codes:** 200 (Success), 400 (Store name required), 409 (Store name exists)

### 12. Report User

- **Endpoint:** `POST /user/:userId/report`
- **Authentication:** Required (SELLER role)
- **Request Body:**

```json
{
  "reason": "fraud",
  "description": "User description"
}
```

- **Response:** Report created
- **Status Codes:** 201 (Created), 400 (Invalid input)

---

## Product Endpoints

### 1. Get All Products

- **Endpoint:** `GET /products`
- **Authentication:** No
- **Query Parameters:**

```
?page=1
&limit=10
&category=categoryId
&price_min=100
&price_max=10000
&search=laptop
&sortBy=price
&order=asc
```

- **Response:** Array of products with pagination
- **Status Codes:** 200 (Success)

### 2. Get Product by ID

- **Endpoint:** `GET /products/:productId`
- **Authentication:** No
- **Response:** Product object with full details
- **Status Codes:** 200 (Success), 404 (Not found)

### 3. Create Product (Seller)

- **Endpoint:** `POST /products`
- **Authentication:** Required (SELLER role)
- **Request Body:**

```json
{
  "name": "Laptop",
  "description": "High-end laptop",
  "price": 50000,
  "discount": 10,
  "category": "categoryId",
  "subCategories": ["subCatId1", "subCatId2"],
  "stock": 50,
  "unit": "piece",
  "more_details": {
    "processor": "Intel i7",
    "ram": "16GB"
  },
  "images": [File, File]  // Multipart form data
}
```

- **Response:** Created product object
- **Status Codes:** 201 (Created), 400 (Invalid input)

### 4. Update Product (Seller)

- **Endpoint:** `PUT /products/:productId`
- **Authentication:** Required (Product owner)
- **Request Body:** Same as create (partial update supported)
- **Response:** Updated product object
- **Status Codes:** 200 (Success), 403 (Unauthorized), 404 (Not found)

### 5. Delete Product (Seller)

- **Endpoint:** `DELETE /products/:productId`
- **Authentication:** Required (Product owner)
- **Response:** Success message
- **Status Codes:** 200 (Success), 403 (Unauthorized), 404 (Not found)

### 6. Get Seller Products

- **Endpoint:** `GET /products/seller/:sellerId`
- **Authentication:** No
- **Response:** Array of seller's products
- **Status Codes:** 200 (Success)

---

## Cart Endpoints

### 1. Get Cart

- **Endpoint:** `GET /cart`
- **Authentication:** Required
- **Response:**

```json
{
  "user": "userId",
  "items": [
    {
      "product": {},
      "quantity": 2
    }
  ]
}
```

- **Status Codes:** 200 (Success), 401 (Unauthorized)

### 2. Add to Cart

- **Endpoint:** `POST /cart/add`
- **Authentication:** Required
- **Request Body:**

```json
{
  "productId": "productId",
  "quantity": 1
}
```

- **Response:** Updated cart
- **Status Codes:** 200 (Success), 400 (Invalid product)

### 3. Update Cart Item Quantity

- **Endpoint:** `PUT /cart/update-quantity`
- **Authentication:** Required
- **Request Body:**

```json
{
  "productId": "productId",
  "quantity": 5
}
```

- **Response:** Updated cart
- **Status Codes:** 200 (Success), 400 (Invalid quantity)

### 4. Remove from Cart

- **Endpoint:** `DELETE /cart/remove/:productId`
- **Authentication:** Required
- **Response:** Updated cart
- **Status Codes:** 200 (Success), 404 (Item not in cart)

### 5. Clear Cart

- **Endpoint:** `DELETE /cart/clear`
- **Authentication:** Required
- **Response:** Success message
- **Status Codes:** 200 (Success)

---

## Wishlist Endpoints

### 1. Get Wishlist

- **Endpoint:** `GET /wishlist`
- **Authentication:** Required
- **Response:** Array of wishlist items
- **Status Codes:** 200 (Success)

### 2. Add to Wishlist

- **Endpoint:** `POST /wishlist/add`
- **Authentication:** Required
- **Request Body:**

```json
{
  "productId": "productId"
}
```

- **Response:** Updated wishlist
- **Status Codes:** 200 (Success), 400 (Product already in wishlist)

### 3. Remove from Wishlist

- **Endpoint:** `DELETE /wishlist/remove/:productId`
- **Authentication:** Required
- **Response:** Updated wishlist
- **Status Codes:** 200 (Success), 404 (Not in wishlist)

### 4. Check Wishlist Status

- **Endpoint:** `GET /wishlist/check/:productId`
- **Authentication:** Required
- **Response:**

```json
{
  "inWishlist": true
}
```

- **Status Codes:** 200 (Success)

---

## Order Endpoints

### 1. Get User Orders

- **Endpoint:** `GET /orders`
- **Authentication:** Required
- **Query Parameters:**

```
?page=1
&limit=10
&status=Delivered
```

- **Response:** Array of orders
- **Status Codes:** 200 (Success)

### 2. Get Order Details

- **Endpoint:** `GET /orders/:orderId`
- **Authentication:** Required
- **Response:** Order object with full details
- **Status Codes:** 200 (Success), 404 (Not found)

### 3. Get Seller's Orders

- **Endpoint:** `GET /orders/seller/:sellerId`
- **Authentication:** Required (Seller)
- **Response:** Array of seller's product orders
- **Status Codes:** 200 (Success)

### 4. Update Order Status (Seller)

- **Endpoint:** `PUT /orders/:orderId/status`
- **Authentication:** Required (Seller or Admin)
- **Request Body:**

```json
{
  "status": "Shipped"
}
```

- **Response:** Updated order
- **Status Codes:** 200 (Success), 403 (Unauthorized)

### 5. Cancel Order (User)

- **Endpoint:** `PUT /orders/:orderId/cancel`
- **Authentication:** Required
- **Response:** Updated order
- **Status Codes:** 200 (Success), 400 (Cannot cancel)

---

## Payment Endpoints

### 1. Create Razorpay Order

- **Endpoint:** `POST /payment/create-order`
- **Authentication:** Required
- **Request Body:**

```json
{
  "addressId": "addressId"
}
```

- **Response:**

```json
{
  "orderId": "orderId",
  "razorpayOrderId": "razorpay_order_id",
  "amount": 50000,
  "currency": "INR",
  "key": "razorpay_key_id"
}
```

- **Status Codes:** 200 (Success), 400 (Cart empty), 401 (Unauthorized)

### 2. Verify Payment

- **Endpoint:** `POST /payment/verify`
- **Authentication:** Required
- **Request Body:**

```json
{
  "orderId": "orderId",
  "razorpay_order_id": "razorpay_order_id",
  "razorpay_payment_id": "razorpay_payment_id",
  "razorpay_signature": "razorpay_signature"
}
```

- **Response:**

```json
{
  "orderId": "orderId",
  "status": "Paid"
}
```

- **Status Codes:** 200 (Success), 400 (Invalid signature)

### 3. Get Payment Status

- **Endpoint:** `GET /payment/status/:orderId`
- **Authentication:** Required
- **Response:**

```json
{
  "status": "Paid",
  "razorpayOrderId": "razorpay_order_id",
  "razorpayPaymentId": "razorpay_payment_id"
}
```

- **Status Codes:** 200 (Success), 404 (Order not found)

---

## Address Endpoints

### 1. Get Addresses

- **Endpoint:** `GET /address`
- **Authentication:** Required
- **Response:** Array of user's addresses
- **Status Codes:** 200 (Success)

### 2. Add Address

- **Endpoint:** `POST /address`
- **Authentication:** Required
- **Request Body:**

```json
{
  "fullName": "John Doe",
  "mobile": "9876543210",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "pinCode": "10001",
  "country": "USA"
}
```

- **Response:** Created address
- **Status Codes:** 201 (Created), 400 (Invalid input)

### 3. Update Address

- **Endpoint:** `PUT /address/:addressId`
- **Authentication:** Required
- **Request Body:** Same as create (partial update)
- **Response:** Updated address
- **Status Codes:** 200 (Success), 404 (Not found)

### 4. Delete Address

- **Endpoint:** `DELETE /address/:addressId`
- **Authentication:** Required
- **Response:** Success message
- **Status Codes:** 200 (Success), 404 (Not found)

---

## Category Endpoints

### 1. Get All Categories

- **Endpoint:** `GET /category`
- **Authentication:** No
- **Response:** Array of categories
- **Status Codes:** 200 (Success)

### 2. Get Category by ID

- **Endpoint:** `GET /category/:categoryId`
- **Authentication:** No
- **Response:** Category object with subcategories
- **Status Codes:** 200 (Success), 404 (Not found)

### 3. Create Category (Admin)

- **Endpoint:** `POST /category`
- **Authentication:** Required (ADMIN role)
- **Request Body:**

```json
{
  "name": "Electronics",
  "image": File  // Multipart form data
}
```

- **Response:** Created category
- **Status Codes:** 201 (Created), 400 (Invalid input)

### 4. Update Category (Admin)

- **Endpoint:** `PUT /category/:categoryId`
- **Authentication:** Required (ADMIN role)
- **Request Body:** Same as create
- **Response:** Updated category
- **Status Codes:** 200 (Success), 404 (Not found)

### 5. Delete Category (Admin)

- **Endpoint:** `DELETE /category/:categoryId`
- **Authentication:** Required (ADMIN role)
- **Response:** Success message
- **Status Codes:** 200 (Success), 404 (Not found)

---

## SubCategory Endpoints

### 1. Get All SubCategories

- **Endpoint:** `GET /sub-category`
- **Authentication:** No
- **Response:** Array of subcategories
- **Status Codes:** 200 (Success)

### 2. Get SubCategory by ID

- **Endpoint:** `GET /sub-category/:subCategoryId`
- **Authentication:** No
- **Response:** SubCategory object
- **Status Codes:** 200 (Success), 404 (Not found)

### 3. Create SubCategory (Admin)

- **Endpoint:** `POST /sub-category`
- **Authentication:** Required (ADMIN role)
- **Request Body:**

```json
{
  "name": "Laptops",
  "image": File,
  "categories": ["categoryId1", "categoryId2"]
}
```

- **Response:** Created subcategory
- **Status Codes:** 201 (Created)

### 4. Update SubCategory (Admin)

- **Endpoint:** `PUT /sub-category/:subCategoryId`
- **Authentication:** Required (ADMIN role)
- **Request Body:** Same as create
- **Response:** Updated subcategory
- **Status Codes:** 200 (Success)

### 5. Delete SubCategory (Admin)

- **Endpoint:** `DELETE /sub-category/:subCategoryId`
- **Authentication:** Required (ADMIN role)
- **Response:** Success message
- **Status Codes:** 200 (Success)

---

## Admin Endpoints

### 1. Get Dashboard Stats

- **Endpoint:** `GET /admin/dashboard`
- **Authentication:** Required (ADMIN role)
- **Response:**

```json
{
  "totalUsers": 100,
  "totalProducts": 500,
  "totalOrders": 1000,
  "totalRevenue": 500000,
  "pendingSellers": 5
}
```

- **Status Codes:** 200 (Success)

### 2. Get All Sellers

- **Endpoint:** `GET /admin/sellers`
- **Authentication:** Required (ADMIN role)
- **Query Parameters:**

```
?status=Waiting Approval
&page=1
&limit=10
```

- **Response:** Array of sellers
- **Status Codes:** 200 (Success)

### 3. Approve Seller

- **Endpoint:** `PUT /admin/sellers/:sellerId/approve`
- **Authentication:** Required (ADMIN role)
- **Response:** Updated seller
- **Status Codes:** 200 (Success)

### 4. Reject Seller

- **Endpoint:** `PUT /admin/sellers/:sellerId/reject`
- **Authentication:** Required (ADMIN role)
- **Request Body:**

```json
{
  "reason": "Rejection reason"
}
```

- **Response:** Updated seller
- **Status Codes:** 200 (Success)

### 5. Get Reports

- **Endpoint:** `GET /admin/reports`
- **Authentication:** Required (ADMIN role)
- **Query Parameters:**

```
?type=user_report
&status=pending
&page=1
&limit=10
```

- **Response:** Array of reports
- **Status Codes:** 200 (Success)

### 6. Resolve Report

- **Endpoint:** `PUT /admin/reports/:reportId/resolve`
- **Authentication:** Required (ADMIN role)
- **Request Body:**

```json
{
  "action": "suspend_user",
  "reason": "Report resolution"
}
```

- **Response:** Resolved report
- **Status Codes:** 200 (Success)

---

## HTTP Status Codes Reference

- **200 OK**: Request succeeded
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **500 Internal Server Error**: Server error

---

## Rate Limiting

Currently, there is no rate limiting implemented. Consider implementing rate limiting in production:

```
- Auth endpoints: 5 requests per minute per IP
- General endpoints: 100 requests per minute per user
- Payment endpoints: 10 requests per minute per user
```

---

## Error Codes

| Code | Message      | Action                             |
| ---- | ------------ | ---------------------------------- |
| 400  | Bad Request  | Check request body and parameters  |
| 401  | Unauthorized | Login again to refresh token       |
| 403  | Forbidden    | Not allowed to perform this action |
| 404  | Not Found    | Resource doesn't exist             |
| 409  | Conflict     | Resource already exists            |
| 500  | Server Error | Report the issue to support        |

---

## Webhook Endpoints (Future Implementation)

These endpoints should be implemented for production:

### Razorpay Payment Webhook

- **Endpoint:** `POST /payment/webhook`
- **Purpose:** Handle Razorpay payment callbacks

### Email Delivery Webhook

- **Endpoint:** `POST /email/webhook`
- **Purpose:** Track email delivery status

---

## Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:8080/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:8080/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }' \
  -c cookies.txt

# Get Products
curl -X GET http://localhost:8080/api/v1/products
```

### Using Postman

1. Import the API endpoints
2. Set up authorization with JWT token
3. Create test requests for each endpoint
4. Save requests to collection

---

## API Versioning

Current API version: `v1`

Future versions will maintain backward compatibility while adding new features.
