#  e-Haat: A Multi-Vendor E-commerce Platform (Backend)

This repository hosts the **complete backend source code** for **e-Haat**, a feature-rich multi-vendor e-commerce platform envisioned as a digital "online bazaar." The backend is built with **Node.js**, **Express.js**, and **MongoDB**, designed to be **scalable**, **secure**, and **maintainable**.

At its core, e-haat features a **Role-Based Access Control (RBAC)** system managing interactions between three key user roles: **Users**, **Sellers**, and **Admins**.

---

##  Key Features

###  Authentication & Authorization

* **JWT-Based Auth System**: Dual-token strategy using Access and Refresh tokens for secure and persistent sessions.
* **Secure Passwords**: Uses `bcrypt` for hashing and verifying passwords.
* **Role-Based Access Control**: Middleware-based RBAC system for fine-grained route protection.

###  Seller & Admin Management

* **Seller Lifecycle**: Users can apply to become sellers. Admins can approve or reject via a dedicated dashboard.
* **Automated Notifications**: Email alerts for approvals, rejections, and status changes.
* **Admin Controls**: Endpoints to manage categories, resolve reports, and suspend/reactivate sellers.

###  Trust & Safety System

* **Two-Way Reporting**: Users and sellers can report each other for violations.
* **Admin Moderation**: Admins review, resolve, and take actions on reports.

###  Cloud Media Management

* **Image Uploads**: `Multer` + `Cloudinary` for efficient, cloud-based image storage.
* **Parallel Uploads**: Product images are uploaded simultaneously using `Promise.all`.
* **Auto Deletion**: Unused assets are deleted when a product/category is removed.

###  Product & Category Management

* **Dynamic Categories**: Admins can manage product categories and sub-categories.
* **Flexible Sub-Category Relations**: Sub-categories can link to multiple parents.
* **Seller Control**: Approved sellers manage their own product listings independently.

---

##  Tech Stack

| Category           | Technology                      |
| ------------------ | ------------------------------- |
| **Backend**        | Node.js, Express.js             |
| **Database**       | MongoDB with Mongoose           |
| **Authentication** | JWT, bcrypt                     |
| **File Handling**  | Multer                          |
| **Cloud Storage**  | Cloudinary                      |
| **Email**          | Resend                          |

---

##  Getting Started

Follow these steps to set up the project locally:

###  Prerequisites

* Node.js installed
* MongoDB Atlas account (or local MongoDB)
* Cloudinary account

###  Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/keshavjha205/e-haat.git
   ```

2. **Navigate to the backend folder:**

   ```bash
   cd e-haat/server
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Create a `.env` file** in the `/server` directory with the following content:

   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   RESEND_API=your_cloudinary_api_secret
   ```

5. **Run the server:**

   ```bash
   npm run start
   ```

---

##  Contact

**Keshav Jha**
 [keshavjha1081@gmail.com](mailto:keshavjha1081@gmail.com)

 Project Repository: [github.com/keshavjha205/e-haat](https://github.com/keshavjha205/e-haat)

---

>  *This project is under active development. Feedback and suggestions are welcome!*
