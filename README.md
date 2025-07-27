#(e-haat: A Multi-Vendor E-commerce Platform (Backend))


This repository contains the complete backend source code for e-haat, a feature-rich, multi-vendor e-commerce platform inspired by the vision of creating a comprehensive "online bazaar." The project is built with a focus on creating a scalable, secure, and maintainable backend system using the MERN stack.

The core of this project is a sophisticated Role-Based Access Control (RBAC) system that manages complex interactions between three distinct user roles: Users, Sellers, and Admins.

# Key Features
 Authentication & Authorization
Secure User Authentication: Implemented a robust JWT-based authentication system with a two-token strategy (Access & Refresh Tokens) for persistent and safe user sessions.

Password Hashing: Utilizes bcryptjs for secure password hashing and verification.

Dynamic Role-Based Access Control (RBAC): A flexible authorizeRole middleware protects all sensitive API endpoints, allowing for granular control over what each user role can access.

# Seller & Admin Management
Full Seller Lifecycle: A complete workflow for users to apply to become sellers, with an admin dashboard to approve or reject applications.

Automated Notifications: Integrated email services to send automated notifications for seller approvals, rejections, and account status changes.

Admin Oversight: Admins have dedicated endpoints to manage categories, resolve reports, and suspend or reactivate seller accounts.

# Trust & Safety System
Two-Way Reporting: Users can report sellers for policy violations, and sellers can report users for problematic behavior.

Admin Review Workflow: A dedicated system for admins to view, review, and resolve reports, with the ability to take action against user or seller accounts.

# Cloud Media Management
Robust Image Handling: Integrated Multer for handling multipart/form-data and Cloudinary for cloud-based image storage.

Efficient Uploads: Supports parallel image uploads for products using Promise.all.

Asset Deletion: Includes logic to delete images from Cloudinary when a product or category is removed, ensuring no orphaned files and managing storage costs.

# Product & Category Management
Dynamic Categories: Admins can create, update, and delete product categories and sub-categories.

Flexible Relationships: A sub-category can be linked to multiple parent categories, allowing for flexible product organization.

Seller Product Management: Approved sellers have dedicated endpoints to create, update, and delete their own product listings.

# Tech Stack
Backend: Node.js, Express.js

Database: MongoDB with Mongoose

Authentication: JSON Web Tokens (JWT), bcryptjs

File Handling: Multer

Cloud Storage: Cloudinary

Email: Nodemailer (or your preferred service)

# Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js installed

MongoDB Atlas account (or a local MongoDB instance)

Cloudinary account

Installation
Clone the repository:

git clone https://github.com/your-username/e-haat.git

Navigate to the server directory:

cd e-haat/server

Install NPM packages:

npm install

Set up environment variables:
Create a .env file in the server directory and add the following variables:

PORT=8000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Run the server:

npm run dev

📞 Contact
Keshav Jha - keshavjha1081@gmail.com

Project Link: https://github.com/your-username/e-haat


