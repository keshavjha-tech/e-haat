import request, { agent } from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app.js'
import { UserModel } from '../models/user.model.js';
import sendEmail from '../config/sendEmail.js';


jest.mock('../config/sendEmail.js');

// This line tells the mock what to do for every test
sendEmail.mockResolvedValue({ success: true });



describe('User API - /api/v1/user', () => {

    beforeAll(async () => {
        const testDbUri = process.env.MONGODB_TEST_URI
        if (!testDbUri) {
            throw new Error("MONGO_TEST_URI is not defined.")
        }
        await mongoose.connect(testDbUri);
    })

    beforeEach(async () => {
        await UserModel.deleteMany({})
    })

    afterAll(async () => {
        await mongoose.connection.close();
    })

    describe('POST /register', () => {

        it('should register a new user successfully and retirn 201 status code', async () => {
            const newUser = {
                name: 'Test User',
                email: 'test@gmail.com',
                password: "test@123"
            }

            const res = await request(app)
                .post('/api/v1/user/register')
                .send(newUser)

            expect(res.statusCode).toBe(201)
            expect(res.body.success).toBe(true)
            expect(res.body.data.email).toBe(newUser.email)
            expect(res.body.data).not.toHaveProperty('password')
        })

        it('should fail a register with 409 status if email alrady exists', async () => {
            const userData = { name: 'Test User', email: 'test@example.com', password: 'test@123' };

            await UserModel.create(userData)

            const res = await request(app)
                .post('/api/v1/user/register')
                .send(userData) // attempt with same email

            expect(res.statusCode).toBe(409)
            expect(res.body.success).toBe(false)
        })
    })

    describe('POST /login and GET /logout', () => {
        it('login in existing user and return token with 200 statuscode.', async () => {
            await UserModel.create(
                {
                    name: 'Login User',
                    email: 'login@gmail.com',
                    password: "login@123"
                }
            )

            const res = await request(app)
                .post('/api/v1/user/login')
                .send({
                    email: 'login@gmail.com',
                    password: "login@123"
                })

            expect(res.statusCode).toBe(200)
            expect(res.body.data).toHaveProperty('accessToken')
            expect(res.headers['set-cookie']).toBeDefined()
        })

        it('should fail to login with 401 status code for incorrect password', async () => {
            await UserModel.create(
                {
                    name: 'Login User',
                    email: 'login@gmail.com',
                    password: "login@123"
                }
            )
            const res = await request(app).post('/api/v1/user/login')
                .send({
                    email: 'login@gmail.com',
                    password: "test@123"
                })

            expect(res.statusCode).toBe(401)

        })

        it('should logout user', async () => {

            const user = await UserModel.create({
                name: 'logout User',
                email: 'logout@gmail.com',
                password: "logout@123"
            })

            const token = user.generateAccessToken()

            const res = await request(app).get('/api/v1/user/logout')
                .set('Authorization', `Bearer ${token}`)


            expect(res.statusCode).toBe(200)
            expect(res.body.message).toBe("User logged out successfully.")

        })
    })

    describe('GET /user-detail and PUT /update-user', () => {
        it('should ge user details from an authenticated user', async () => {
            const user = await UserModel.create({
                name: "User Deatil",
                email: "detail@gmail.com",
                password: "detail@123"
            })
            const token = user.generateAccessToken();
            const res = await request(app).get('/api/v1/user/user-detail').set('Authorization', `Bearer ${token}`)

            expect(res.statusCode).toBe(200)
            expect(res.body.data.email).toBe('detail@gmail.com')
        })

        it('should update user details for an authenticated user', async () => {
            const user = await UserModel.create({
                name: "User update",
                email: "update@gmail.com",
                password: "update@123"
            })
            const token = user.generateAccessToken();
            const updates = {
                name: 'updated name',
                mobile: '1234567890'
            }

            const res = await request(app)
                .put('/api/v1/user/update-user')
                .set('Authorization', `Bearer ${token}`)
                .send(updates)

            expect(res.statusCode).toBe(200)
            const updatedUser = await UserModel.findById(user._id)
            expect(updatedUser.name).toBe('updated name')
        })
    })

    describe('PUT /apply-seller', () => {
        it('should apply a regular user to apply to become a seller', async () => {
            const user = await UserModel.create({
                name: "Seller Applicant",
                email: "applicant@gmail.com",
                password: "applicant@gmail.com"
            })
            const token = user.generateAccessToken()
            const storeData = {
                store_name: "My Awesome Store",
                store_description: "selling amazing products."
            }

            const res = await request(app)
                .put('/api/v1/user/apply-seller')
                .set('Authorization', `Bearer ${token}`)
                .send(storeData)

            expect(res.statusCode).toBe(200)
            const applicant = await UserModel.findById(user._id)
            expect(applicant.sellerStatus).toBe('Waiting Approval')
            expect(applicant.store_name).toBe("My Awesome Store")
        })

        it('should fail if user already applied',
            async () => {
                const user = await UserModel.create({
                    name: "Seller Applicant",
                    email: "applicant@gmail.com",
                    password: "applicant@gmail.com",
                    sellerStatus: 'Waiting Approval',
                })
                const token = user.generateAccessToken()
                const storeData = {
                    store_name: "My Awesome Store",
                    store_description: "selling amazing products."
                }

                const res = await request(app)
                .put('/api/v1/user/apply-seller')
                .set('Authorization', `Bearer ${token}`)
                .send(storeData)
                
                expect(res.statusCode).toBe(400)
                expect(res.body.success).toBe(false)

            })
    })

    describe('', () =>{

    })

})