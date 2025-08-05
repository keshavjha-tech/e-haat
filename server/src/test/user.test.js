import request, { agent } from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app.js'
import { UserModel } from '../models/user.model.js';
import sendEmail from '../config/sendEmail.js';
import { generateOTP } from '../services/otpService/generateOTP.js';


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

    describe('POST /:userId/report', () => {
        it('should allow a seller to report a user', async () => {
            const seller = await UserModel.create({
                name: "reporting seller",
                email: "seller@gmail.com",
                password: "seller@123",
                role: "SELLER",
                store_name: "Store247"
            })
            const userToReport = await UserModel.create({
                name: "Buyer",
                email: "buyer@gmail.com",
                password: "buyer@123"
            })
            const sellerToken = seller.generateAccessToken()
            const reportData = {
                reason: "Spamming or harassment",
                details: "User is spamming"
            }

            const res = await request(app)
                .post(`/api/v1/user/${userToReport._id}/report`)
                .set('Authorization', `Bearer ${sellerToken}`)
                .send(reportData)

            expect(res.statusCode).toBe(201)
            expect(res.body.success).toBe(true)
            expect(res.body.data.reporter).toBe(seller._id.toString())
            expect(res.body.data.user).toBe(userToReport._id.toString())
        })

        it('should block a regular user from reporting another user', async () => {
            const reporter = await UserModel.create({
                name: "Reporter", email: "reporter@gmail.com", password: "Reporter@123", store_name: "Store247"
            })
            const userToReport = await UserModel.create({
                name: "reported",
                email: "reported@gmail.com",
                password: "reported@123"
            })
            const reporterToken = reporter.generateAccessToken()
            const reportData = { reason: "Spamming or harassment" }

            const res = await request(app)
                .post(`/api/v1/user/${userToReport._id}/report`)
                .set('Authorization', `Beraer ${reporterToken}`)
                .send(reportData)

            expect(res.statusCode).toBe(403)
        })
    })

    describe('PUT /forgot-password and ', () => {
        it('should generate otp in case of user forgot password', async () => {
            const user = await UserModel.create({
                name: "Forgot Password",
                email: "forgot@gmail.com",
                password: "forgot@123"
            })

            const res = await request(app)
                .put('/api/v1/user/forgot-password')
                .send({ email: user.email })

            expect(res.statusCode).toBe(200)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe("OTP has been sent to your email address.")

            const updatedUser = await UserModel.findById(user._id)
            expect(updatedUser.forget_password_otp).toBeDefined()
            expect(updatedUser.forget_password_otp).not.toBeNull()
            expect(updatedUser.forget_password_expiry).toBeDefined()
        })

        it('should return a 404 error if email does not exist', async () => {
            const res = await request(app)
                .put('/api/v1/user/forgot-password')
                .send({ email: 'notexists@gmail.com' })

            expect(res.statusCode).toBe(404)
            expect(res.body.success).toBe(false)
        })

        
    })

    describe('PUT /verify-forgot-password-otp', () => {
        it('should verify otp in user forgot password', async () => {
            const user = await UserModel.create({
                name: 'Verify otp',
                email: 'verify@gmail.com',
                password: 'verify@123',
                forget_password_otp: '123456',
                forget_password_expiry: new Date(Date.now() + 10 * 60 * 1000)
            })

            const res = await request(app)
                .put('/api/v1/user/verify-forgot-password-otp')
                .send({ email: user.email, otp:  user.forget_password_otp})

            expect(res.statusCode).toBe(200)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe("OTP verified successfully.")
        })

        it('should be able to reset password ', async()=>{
            const user = await UserModel.create({
                name: "change password",
                email: "change@gmail.com",
                password:"change@123"
            })
            const updatedUser = {
                email : user.email,
                newPassword : "update@123", 
                confirmPassword: "update@123"
            }

            const res = await request(app)
            .put('/api/v1/user/reset-password')
            .send( updatedUser)

            expect(res.statusCode).toBe(200)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe("Password has been reset successfully.")
        })

        it('should throw error if new and old passwords are same', async()=>{
            const user = await UserModel.create({
                name: "change password",
                email: "change@gmail.com",
                password:"change@123"
            })
            const updatedUser = {
                email : user.email,
                newPassword : "change@123", 
                confirmPassword: "change@123"
            }

            const res = await request(app)
            .put('/api/v1/user/reset-password')
            .send(updatedUser)

            expect(res.statusCode).toBe(400)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe("New password cannot be same as old password.")
        })
    })

    describe('POST /refresh-token', () => {

        it('should refresh access token after its expiry', async() => {

             const userData = { name: 'Refresh User', email: 'refresh@example.com', password: 'password123' };
            await UserModel.create(userData);


            const loginResponse = await request(app)
            .post('/api/v1/user/login')
            .send({ email: userData.email, password: userData.password})

            const refreshToken = loginResponse.body.data.refreshToken

            const res = await request(app)
            .post('/api/v1/user/refresh-token')
             .send({ refreshToken: refreshToken })


            expect(res.statusCode).toBe(200)
            expect(res.body.success).toBe(true)
            expect(res.body.data).toHaveProperty('accessToken')

            expect(res.headers['set-cookie']).toBeDefined()
            expect(res.headers['set-cookie'][0]).toContain('accessToken=')
        })

        
    })
})