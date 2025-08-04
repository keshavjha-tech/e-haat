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

    describe('POST /login', () => {
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

    

})