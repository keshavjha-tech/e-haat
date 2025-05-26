import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    }

}, {timestamps : true})

export const OrderModel = mongoose.model('order', orderSchema);