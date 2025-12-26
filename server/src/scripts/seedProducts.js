import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/connection.js';

// Load environment variables
dotenv.config({ path: './.env' });
import { UserModel } from '../models/user.model.js';
import { CategoryModel } from '../models/category.model.js';
import { SubCategoryModel } from '../models/subCategory.model.js';
import { ProductModel } from '../models/product.model.js';

// Mock product data
const mockProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life. Perfect for music lovers and professionals.",
    price: 129.99,
    discount: 15,
    stock: 50,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", public_id: "headphones-1" },
      { url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500", public_id: "headphones-2" }
    ],
    categoryName: "Electronics",
    averageRating: 4.5,
    numOfReviews: 128
  },
  {
    name: "Smart Watch Pro",
    description: "Advanced fitness tracking smartwatch with heart rate monitor, GPS, and 7-day battery life. Water-resistant design.",
    price: 249.99,
    discount: 20,
    stock: 30,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", public_id: "watch-1" },
      { url: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500", public_id: "watch-2" }
    ],
    categoryName: "Electronics",
    averageRating: 4.7,
    numOfReviews: 89
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Comfortable 100% organic cotton t-shirt. Available in multiple colors. Sustainable and eco-friendly.",
    price: 24.99,
    discount: 10,
    stock: 100,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", public_id: "tshirt-1" },
      { url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500", public_id: "tshirt-2" }
    ],
    categoryName: "Clothing",
    averageRating: 4.3,
    numOfReviews: 256
  },
  {
    name: "Leather Crossbody Bag",
    description: "Genuine leather crossbody bag with adjustable strap. Perfect for everyday use. Multiple compartments for organization.",
    price: 79.99,
    discount: 0,
    stock: 45,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", public_id: "bag-1" },
      { url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500", public_id: "bag-2" }
    ],
    categoryName: "Accessories",
    averageRating: 4.6,
    numOfReviews: 142
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Insulated stainless steel water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and leak-proof.",
    price: 29.99,
    discount: 5,
    stock: 200,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500", public_id: "bottle-1" },
      { url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500", public_id: "bottle-2" }
    ],
    categoryName: "Accessories",
    averageRating: 4.4,
    numOfReviews: 203
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with precision tracking. Long battery life and comfortable design for extended use.",
    price: 34.99,
    discount: 12,
    stock: 75,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500", public_id: "mouse-1" },
      { url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500", public_id: "mouse-2" }
    ],
    categoryName: "Electronics",
    averageRating: 4.2,
    numOfReviews: 167
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes with cushioned sole and breathable mesh upper. Perfect for jogging and daily workouts.",
    price: 89.99,
    discount: 25,
    stock: 60,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", public_id: "shoes-1" },
      { url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500", public_id: "shoes-2" }
    ],
    categoryName: "Clothing",
    averageRating: 4.5,
    numOfReviews: 312
  },
  {
    name: "Laptop Stand",
    description: "Adjustable aluminum laptop stand for better ergonomics. Fits laptops up to 17 inches. Improves posture.",
    price: 39.99,
    discount: 0,
    stock: 40,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500", public_id: "stand-1" },
      { url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500", public_id: "stand-2" }
    ],
    categoryName: "Electronics",
    averageRating: 4.3,
    numOfReviews: 98
  },
  {
    name: "Yoga Mat",
    description: "Non-slip yoga mat with extra cushioning. Eco-friendly material. Perfect for yoga, pilates, and exercise.",
    price: 44.99,
    discount: 15,
    stock: 80,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500", public_id: "mat-1" },
      { url: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500", public_id: "mat-2" }
    ],
    categoryName: "Sports",
    averageRating: 4.6,
    numOfReviews: 189
  },
  {
    name: "Coffee Maker",
    description: "Programmable coffee maker with 12-cup capacity. Auto shut-off feature. Perfect for home or office.",
    price: 69.99,
    discount: 20,
    stock: 35,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500", public_id: "coffee-1" },
      { url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500", public_id: "coffee-2" }
    ],
    categoryName: "Home & Kitchen",
    averageRating: 4.4,
    numOfReviews: 234
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with 360-degree sound. Waterproof design. 20-hour battery life.",
    price: 59.99,
    discount: 18,
    stock: 55,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500", public_id: "speaker-1" },
      { url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500", public_id: "speaker-2" }
    ],
    categoryName: "Electronics",
    averageRating: 4.5,
    numOfReviews: 145
  },
  {
    name: "Denim Jacket",
    description: "Classic denim jacket with modern fit. Made from premium denim. Perfect for casual wear.",
    price: 64.99,
    discount: 0,
    stock: 50,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500", public_id: "jacket-1" },
      { url: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500", public_id: "jacket-2" }
    ],
    categoryName: "Clothing",
    averageRating: 4.3,
    numOfReviews: 178
  },
  {
    name: "Sunglasses",
    description: "UV protection sunglasses with polarized lenses. Stylish design with durable frame. Multiple color options.",
    price: 49.99,
    discount: 10,
    stock: 90,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500", public_id: "sunglasses-1" },
      { url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500", public_id: "sunglasses-2" }
    ],
    categoryName: "Accessories",
    averageRating: 4.4,
    numOfReviews: 267
  },
  {
    name: "Backpack",
    description: "Durable backpack with laptop compartment. Water-resistant material. Multiple pockets for organization.",
    price: 54.99,
    discount: 15,
    stock: 65,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", public_id: "backpack-1" },
      { url: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500", public_id: "backpack-2" }
    ],
    categoryName: "Accessories",
    averageRating: 4.5,
    numOfReviews: 198
  },
  {
    name: "Desk Lamp",
    description: "LED desk lamp with adjustable brightness and color temperature. USB charging port. Modern design.",
    price: 39.99,
    discount: 0,
    stock: 45,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500", public_id: "lamp-1" },
      { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500", public_id: "lamp-2" }
    ],
    categoryName: "Home & Kitchen",
    averageRating: 4.2,
    numOfReviews: 112
  },
  {
    name: "Wireless Earbuds",
    description: "True wireless earbuds with noise cancellation. 8-hour battery with charging case. Perfect for workouts.",
    price: 99.99,
    discount: 22,
    stock: 70,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500", public_id: "earbuds-1" },
      { url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500", public_id: "earbuds-2" }
    ],
    categoryName: "Electronics",
    averageRating: 4.6,
    numOfReviews: 289
  },
  {
    name: "Kitchen Knife Set",
    description: "Professional 6-piece knife set with wooden block. High-quality stainless steel blades. Dishwasher safe.",
    price: 119.99,
    discount: 30,
    stock: 25,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1594736797933-d0cbc0c0e0a1?w=500", public_id: "knife-1" },
      { url: "https://images.unsplash.com/photo-1594736797933-d0cbc0c0e0a1?w=500", public_id: "knife-2" }
    ],
    categoryName: "Home & Kitchen",
    averageRating: 4.7,
    numOfReviews: 156
  },
  {
    name: "Fitness Tracker",
    description: "Activity tracker with heart rate monitor. Tracks steps, calories, and sleep. Water-resistant design.",
    price: 79.99,
    discount: 25,
    stock: 85,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1579586337278-3befd40e17ee?w=500", public_id: "tracker-1" },
      { url: "https://images.unsplash.com/photo-1579586337278-3befd40e17ee?w=500", public_id: "tracker-2" }
    ],
    categoryName: "Electronics",
    averageRating: 4.4,
    numOfReviews: 203
  },
  {
    name: "Hoodie",
    description: "Comfortable cotton blend hoodie with front pocket. Perfect for casual wear. Available in multiple colors.",
    price: 49.99,
    discount: 10,
    stock: 120,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500", public_id: "hoodie-1" },
      { url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500", public_id: "hoodie-2" }
    ],
    categoryName: "Clothing",
    averageRating: 4.3,
    numOfReviews: 245
  },
  {
    name: "Phone Case",
    description: "Protective phone case with shock absorption. Clear design shows your phone's beauty. Multiple models available.",
    price: 19.99,
    discount: 0,
    stock: 200,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=500", public_id: "case-1" },
      { url: "https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=500", public_id: "case-2" }
    ],
    categoryName: "Accessories",
    averageRating: 4.1,
    numOfReviews: 334
  },
  {
    name: "Dumbbell Set",
    description: "Adjustable dumbbell set with weights from 5-25 lbs. Perfect for home workouts. Durable construction.",
    price: 149.99,
    discount: 20,
    stock: 30,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500", public_id: "dumbbell-1" },
      { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500", public_id: "dumbbell-2" }
    ],
    categoryName: "Sports",
    averageRating: 4.6,
    numOfReviews: 167
  },
  {
    name: "Tablet Stand",
    description: "Adjustable tablet stand for desk or bed. Holds tablets up to 12.9 inches. Foldable for easy storage.",
    price: 24.99,
    discount: 0,
    stock: 60,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500", public_id: "tablet-stand-1" },
      { url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500", public_id: "tablet-stand-2" }
    ],
    categoryName: "Electronics",
    averageRating: 4.2,
    numOfReviews: 98
  },
  {
    name: "Ceramic Coffee Mug",
    description: "Handcrafted ceramic coffee mug with ergonomic handle. Dishwasher and microwave safe. Perfect gift.",
    price: 14.99,
    discount: 5,
    stock: 150,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500", public_id: "mug-1" },
      { url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500", public_id: "mug-2" }
    ],
    categoryName: "Home & Kitchen",
    averageRating: 4.5,
    numOfReviews: 189
  },
  {
    name: "Resistance Bands Set",
    description: "5-piece resistance bands set with different resistance levels. Includes door anchor and exercise guide.",
    price: 29.99,
    discount: 15,
    stock: 95,
    unit: "piece",
    images: [
      { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500", public_id: "bands-1" },
      { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500", public_id: "bands-2" }
    ],
    categoryName: "Sports",
    averageRating: 4.4,
    numOfReviews: 201
  }
];

const categories = [
  { name: "Electronics", slug: "electronics" },
  { name: "Clothing", slug: "clothing" },
  { name: "Accessories", slug: "accessories" },
  { name: "Home & Kitchen", slug: "home-kitchen" },
  { name: "Sports", slug: "sports" }
];

async function seedDatabase() {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to database");

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("Clearing existing data...");
    await ProductModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await SubCategoryModel.deleteMany({});
    
    // Create or get seller
    let seller = await UserModel.findOne({ email: "seller@ehaat.com" });
    if (!seller) {
      seller = await UserModel.create({
        name: "Demo Seller",
        email: "seller@ehaat.com",
        password: "password123",
        role: "SELLER",
        sellerStatus: "Approved",
        store_name: "Demo Store",
        store_description: "Your one-stop shop for quality products",
        verify_email: true
      });
      console.log("Created seller:", seller.email);
    } else {
      console.log("Using existing seller:", seller.email);
    }

    // Create categories
    const categoryMap = {};
    for (const cat of categories) {
      const category = await CategoryModel.create({
        name: cat.name,
        slug: cat.slug,
        image: {
          url: `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500`,
          public_id: `category-${cat.slug}`
        }
      });
      categoryMap[cat.name] = category._id;
      console.log(`Created category: ${cat.name}`);
    }

    // Create products
    console.log("\nCreating products...");
    for (const productData of mockProducts) {
      const categoryId = categoryMap[productData.categoryName];
      if (!categoryId) {
        console.log(`Category not found for ${productData.name}, skipping...`);
        continue;
      }

      const product = await ProductModel.create({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        discount: productData.discount,
        stock: productData.stock,
        unit: productData.unit,
        images: productData.images,
        category: categoryId,
        seller: seller._id,
        isPublished: true,
        averageRating: productData.averageRating,
        numOfReviews: productData.numOfReviews
      });

      // Update seller's products_listed
      await UserModel.findByIdAndUpdate(seller._id, {
        $push: { products_listed: product._id }
      });

      console.log(`Created product: ${product.name}`);
    }

    console.log("\n✅ Database seeded successfully!");
    console.log(`Created ${mockProducts.length} products`);
    console.log(`Created ${categories.length} categories`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();

