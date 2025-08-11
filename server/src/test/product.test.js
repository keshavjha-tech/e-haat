import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app.js';
import { UserModel } from '../models/user.model.js';
import { ProductModel } from '../models/product.model.js';
import { CategoryModel } from '../models/category.model.js';


describe('Product API - /api/v1/products', () => {

    beforeAll(async () => {
        const testDbUri = process.env.MONGODB_TEST_URI
        if (!testDbUri) {
            throw new Error("MONGO_TEST_URI is not defined.")
        }
        await mongoose.connect(testDbUri);
    })

    afterAll(async () => {
        await mongoose.connection.close();
    })

    beforeEach(async () => {
        await UserModel.deleteMany({})
        await ProductModel.deleteMany({})
        await CategoryModel.deleteMany({})

        seller = await UserModel.create({ name: 'Test Seller', email: 'seller@example.com', store_name:"Gadget sphere", password: 'password123', role: 'SELLER' });
        user = await UserModel.create({ name: 'Test User', email: 'user@example.com', password: 'password123', role: 'USER' });
        category = await CategoryModel.create({ name: 'Electronics', image: { url: 'url', public_id: 'id' }, slug: 'electronics' });

        sellerToken = seller.generateAccessToken();
        userToken = user.generateAccessToken();
    })

    describe('POST /', () => {
        it('should allow a seller to create product', async()=>{
            const newProduct = {
                name: "Wireless keyboard",
                description: "A sleek new keyboard",
                price: 1299,
                stock: 50,
                category: category._id.toString()
            }

            const res = await request(app)
            .post('/api/v1/products')
            .set('Authorization', `Bearer ${sellerToken}`)
            .send(newProduct)

            expect(res.statusCode).toBe(201)
            expect(res.body.success).toBe(true)
            expect(res.body.data.name).toBe("Wireless keyboard")
        })
    })


})