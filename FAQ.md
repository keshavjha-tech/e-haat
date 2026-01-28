# FREQUENTLY ASKED QUESTIONS (FAQ)

## General Questions

### What is e-Haat?

e-Haat is a full-stack multi-vendor e-commerce platform designed to create a digital "online bazaar." It allows:

- Users to browse and purchase products
- Sellers to list and manage products
- Admins to moderate the marketplace

The platform is built with React (frontend), Node.js/Express (backend), and MongoDB (database).

### Is e-Haat open source?

Yes, e-Haat is open source and available on GitHub. You can view, use, and contribute to the code.

### What technologies does e-Haat use?

Frontend: React 19, Vite, Redux Toolkit, Tailwind CSS
Backend: Node.js, Express.js, MongoDB, Mongoose
Payment: Razorpay
Storage: Cloudinary
Email: Resend

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed tech stack.

### Can I use e-Haat for my business?

Yes! You can:

1. Deploy it as-is for your marketplace
2. Modify it for your specific needs
3. Contribute improvements back to the project

---

## Setup and Installation

### Q: What are the system requirements?

A: Minimum requirements:

- RAM: 4GB
- Disk Space: 1GB free
- Node.js v16 or higher
- npm or yarn
- MongoDB Atlas account (free tier available)
- Cloudinary account (free tier: 25GB)

### Q: How do I install e-Haat?

A: Follow the [SETUP_GUIDE.md](SETUP_GUIDE.md) which includes:

1. Prerequisites installation
2. Cloning the repository
3. Installing dependencies
4. Setting up environment variables
5. Starting the application

### Q: What environment variables do I need?

A: The key ones are:

- MONGODB_URI: MongoDB connection string
- ACCESS_TOKEN_SECRET_KEY: JWT secret
- CLOUDINARY credentials: For image storage
- RAZORPAY credentials: For payments
- RESEND_API: For emails
- FRONTEND_URL: For CORS

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete list.

### Q: How do I get MongoDB connection string?

A:

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (free tier)
4. Click "Connect"
5. Choose "Connect your application"
6. Copy the connection string
7. Replace `<username>`, `<password>`, and database name

### Q: Can I use local MongoDB instead of Atlas?

A: Yes! Install MongoDB locally and use:

```
MONGODB_URI=mongodb://localhost:27017/e-haat
```

### Q: How do I get Cloudinary credentials?

A:

1. Sign up at https://cloudinary.com/
2. Go to Dashboard
3. Find Cloud Name, API Key, API Secret
4. Add to .env file

### Q: Why am I getting CORS errors?

A: Check that:

1. FRONTEND_URL in backend .env matches your frontend URL
2. Frontend and backend are running on correct ports
3. Backend allows credentials in CORS config

---

## Development

### Q: How do I start development?

A:

1. Set up environment (see [SETUP_GUIDE.md](SETUP_GUIDE.md))
2. Run backend: `cd server && npm run start`
3. Run frontend: `cd client && npm run dev`
4. Open http://localhost:5173

### Q: What's the difference between develop and main branch?

A:

- `main`: Production-ready code
- `develop`: Development branch for new features
- Create feature branches from `develop`

### Q: How do I debug the application?

A: Frontend:

- Use Redux DevTools extension
- Browser DevTools (F12)
- React DevTools extension

Backend:

- Check console logs
- Use VS Code debugger
- Add console.log() statements

See [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) for details.

### Q: Where should I add new features?

A:

- Frontend: Add components in `client/src/components` or `features`
- Backend: Add controllers in `server/src/controllers` and routes in `server/src/routes`
- Models: Add database schemas in `server/src/models`

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed structure.

### Q: How do I test my changes?

A:
Frontend: `npm run lint` and `npm run build`
Backend: `npm run test`

See [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) for testing strategies.

---

## Features and Functionality

### Q: How does authentication work?

A: e-Haat uses JWT tokens:

1. User registers/logs in
2. Server generates access token (15 min) and refresh token (7 days)
3. Tokens stored in HTTP-only cookies
4. Protected routes check JWT via middleware
5. When access token expires, refresh token generates new one

See [ARCHITECTURE.md](ARCHITECTURE.md) for auth flow.

### Q: What are the user roles?

A:

1. **USER**: Browse products, place orders, leave reviews
2. **SELLER**: Manage products, view sales, respond to reviews (requires approval)
3. **ADMIN**: Moderate marketplace, manage categories, approve sellers

### Q: How do I become a seller?

A:

1. Login as user
2. Click "Become a Seller"
3. Enter store name and description
4. Admin reviews and approves
5. Once approved, you can list products

### Q: How do payments work?

A:

1. User adds items to cart
2. Proceeds to checkout
3. Enters shipping address
4. Clicks "Pay Now"
5. Razorpay payment modal opens
6. User completes payment
7. Backend verifies signature
8. Order created and stock updated

See [RAZORPAY_SETUP.md](RAZORPAY_SETUP.md) for payment setup.

### Q: Can I test payments without real money?

A: Yes! Use test mode:

1. Get test credentials from Razorpay dashboard
2. Use test card: 4111 1111 1111 1111
3. Use any 3-digit CVV and future expiry
4. Payment completes without actual charge

### Q: How is product search implemented?

A: Products can be searched by:

- Product name
- Category
- Sub-category
- Price range
- Results are paginated

### Q: Can I upload images?

A: Yes! Images are uploaded via:

- Multer (file handling)
- Cloudinary (cloud storage)
- Maximum file size: As configured in Multer
- Supported formats: JPG, PNG, GIF, WebP

### Q: How are wishlists implemented?

A: Users can:

1. Add products to wishlist
2. View their wishlist
3. Check if product is in wishlist
4. Remove from wishlist

Products in wishlist are stored as references in user model.

---

## API Questions

### Q: How do I test the API?

A: Use tools like:

1. Postman: GUI for API requests
2. cURL: Command-line tool
3. Thunder Client: VS Code extension
4. Insomnia: API client

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for endpoints.

### Q: How do I authenticate API requests?

A: Include access token in one of these ways:

```javascript
// Option 1: Cookie (automatic)
// Browser automatically sends HTTP-only cookie

// Option 2: Authorization header
headers: {
  Authorization: `Bearer <access_token>`;
}
```

### Q: What's the API response format?

A: All responses follow this format:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success message",
  "success": true
}
```

Errors:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "success": false
}
```

### Q: What are the rate limits?

A: Currently no rate limits, but these are recommended:

- Auth endpoints: 5 requests/minute per IP
- General endpoints: 100 requests/minute per user
- Payment endpoints: 10 requests/minute per user

### Q: How do I handle API errors?

A:

```javascript
try {
  const response = await axiosInstance.get("/products");
  console.log(response.data.data);
} catch (error) {
  const message = error.response?.data?.message || "Error occurred";
  console.error(message);
}
```

---

## Database

### Q: How are relationships handled?

A: Using MongoDB references:

```javascript
// User has many orders
user: {
  orderHistory: [ObjectId]  // References to Order
}

// Order references products and user
order: {
  user: ObjectId,           // Reference to User
  orderItems: [{
    product: ObjectId       // Reference to Product
  }]
}
```

### Q: How do I run database queries?

A: Using Mongoose in Node.js:

```javascript
const user = await User.findById(id);
const products = await Product.find({ category });
await Product.findByIdAndUpdate(id, { stock: 5 });
```

### Q: Can I inspect the database?

A: Yes! Use MongoDB Compass:

1. Download and install
2. Connect with your MongoDB URI
3. Browse collections and documents

### Q: How do I backup my database?

A: MongoDB Atlas provides automated backups. For manual backups:

```bash
mongodump --uri "mongodb+srv://..." --out ./backup
```

### Q: Can I migrate from one MongoDB cluster to another?

A: Yes! You can:

1. Export data from old cluster
2. Import to new cluster
3. Update MONGODB_URI in .env
4. Restart application

---

## Deployment

### Q: How do I deploy to production?

A:

1. Build frontend: `npm run build`
2. Deploy backend to hosting (Heroku, AWS, etc.)
3. Deploy frontend to hosting (Vercel, Netlify, etc.)
4. Update environment variables on hosting
5. Use live API keys and database URI

### Q: What hosting services are recommended?

A:
Backend:

- Heroku
- AWS EC2
- DigitalOcean
- Railway

Frontend:

- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

### Q: How do I set up CI/CD?

A: Use GitHub Actions:

1. Create `.github/workflows/ci.yml`
2. Define tests and build steps
3. Auto-deploy on push to main

### Q: Should I use HTTPS in production?

A: Yes! Get SSL certificate from:

- Let's Encrypt (free)
- AWS ACM
- Your hosting provider

### Q: How do I scale the application?

A:

1. Use database indexes
2. Implement caching (Redis)
3. Use CDN for static files (Cloudinary)
4. Horizontal scaling with load balancer
5. Monitor performance and optimize

---

## Troubleshooting

### Q: "Port already in use" error

A:

```bash
# Find process using port
lsof -i :8080

# Kill process
kill -9 <PID>

# Or use different port
npm run dev -- --port 5174
```

### Q: "Cannot connect to MongoDB"

A: Check:

1. Connection string is correct
2. Database user exists
3. Password is correct (URL encoded if special chars)
4. IP whitelist includes your IP (use 0.0.0.0/0 for dev)
5. Network allows connection

### Q: "Module not found" errors

A:

```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Q: Application won't start

A: Check:

1. All environment variables are set
2. Node.js version is correct
3. Dependencies installed
4. No syntax errors
5. Check console logs for errors

### Q: Payment not working

A: Check:

1. Razorpay credentials are correct
2. Using test keys for development
3. Test card is valid: 4111 1111 1111 1111
4. Frontend is sending payment details correctly
5. Backend is verifying signature

### Q: Images not uploading

A: Check:

1. Cloudinary credentials correct
2. Account has available storage
3. File size within limits
4. Correct file format
5. Network allows Cloudinary connection

### Q: Getting 401 Unauthorized errors

A: Check:

1. User is logged in
2. Access token is valid
3. Token hasn't expired
4. Token is being sent correctly

### Q: Email not sending

A: Check:

1. Resend API key is correct
2. Sender email is verified
3. Email address is valid
4. Check spam folder
5. Check Resend dashboard for errors

---

## Contributing

### Q: How do I contribute?

A: See [CONTRIBUTING.md](CONTRIBUTING.md) for:

1. Fork and clone repository
2. Create feature branch
3. Make changes
4. Write tests
5. Submit pull request

### Q: What should I work on?

A: Check:

- GitHub Issues (bugs and features)
- Projects (organized tasks)
- "good first issue" label (for new contributors)

### Q: How are contributions reviewed?

A:

1. Automated checks run (linting, tests)
2. Maintainers review code
3. Feedback provided
4. Author makes changes
5. Reviewers approve
6. Code merged

### Q: How do I report a bug?

A:

1. Check if bug already reported
2. Create issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details

### Q: How do I request a feature?

A:

1. Check if feature already requested
2. Create issue with:
   - Clear description
   - Use cases
   - Implementation ideas (optional)
   - Mock-ups (optional)

---

## Performance and Optimization

### Q: How do I improve frontend performance?

A:

1. Use React.memo for expensive components
2. Implement code splitting
3. Use lazy loading for images
4. Debounce search/filters
5. Use redux selectors efficiently

### Q: How do I improve backend performance?

A:

1. Add database indexes
2. Use lean() for read-only queries
3. Implement pagination
4. Cache frequently accessed data
5. Optimize queries

### Q: How do I monitor performance?

A:
Frontend:

- Google PageSpeed Insights
- WebPageTest
- Browser DevTools

Backend:

- Application logs
- Database monitoring
- Server metrics
- Error tracking

---

## Security

### Q: Is the application secure?

A: We implement:

- Password hashing with bcrypt
- JWT-based authentication
- HTTP-only cookies
- CORS protection
- Helmet for security headers
- Input validation
- SQL injection prevention (MongoDB)

See [ARCHITECTURE.md](ARCHITECTURE.md) for security details.

### Q: Should I change default settings for production?

A: Yes! Change:

1. JWT secrets (use strong random strings)
2. Environment variables
3. API keys
4. Database passwords
5. CORS origins

### Q: How do I secure payment information?

A:

- Use HTTPS
- Never store card details
- Use Razorpay's secure payment processing
- Verify signatures on backend
- Follow PCI compliance

---

## Contact and Support

### Where can I get help?

- GitHub Issues: For bugs and features
- Discussions: For questions
- Email: keshavjha.tech@gmail.com
- Documentation: Check relevant .md files

### How do I report security issues?

- Email security concerns to: keshavjha.tech@gmail.com
- Don't create public issues for security vulnerabilities

### Is there a roadmap?

A: Check GitHub Projects for planned features and improvements.

---

This FAQ covers common questions. For more specific information, check the relevant documentation files or create an issue on GitHub.
