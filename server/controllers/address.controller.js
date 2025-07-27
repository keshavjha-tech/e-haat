import { AddressModel } from '../models/address.model.js'
import { UserModel } from '../models/user.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import mongoose from 'mongoose'

const addAddress = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const { fullName, addressLine1, city, state, pinCode, country, mobile, addressType, isDefault } = req.body

    if (!fullName || !addressLine1 || !city || !state || !pinCode || !country || !mobile) {
        throw new ApiError(400, "All Required address fields must be provided.")
    }

    if (isDefault) {
        await AddressModel.updateMany({ user: userId }, { $set: { isDefault: false } })
    }

    const newAddress = await AddressModel.create({
        user: userId,
        fullName,
        addressLine1,
        city,
        state,
        pinCode,
        country,
        mobile,
        addressType,
        isDefault
    })

    await UserModel.findByIdAndUpdate(userId, {
        $push: { address_details: newAddress._id }
    })

    return res.status(201).json(
        new ApiResponse(201, newAddress, "Address added successsfully.")
    )

})

const getMyAddresses = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const addresses = await AddressModel.find({ user: userId }).sort({ isDefault: -1, createdAte: -1 })

    return res.status(200).json(
        new ApiResponse(200, addresses, "Addresses fetched successfully.")
    )
})

const updateAddress = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const { addressId } = req.params
    const { isDefault, ...updatedData } = req.body

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
        throw new ApiError(400, "Invalid address id.")
    }

    const address = await AddressModel.findById(addressId)
    if (!address) {
        throw new ApiError(404, "Address not found.")
    }

    if (address.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to update this address.")
    }

    if (isDefault) {
        await AddressModel.updateMany({ user: userId }, { $set: { isDefault: false } })
    }

    const updatedAddress = await AddressModel.findByIdAndUpdate(addressId,
        {
            $set: { ...updatedData, isDefault }
        },
        { new: true })

        return res.status(200).json(
            new ApiResponse(200, updatedAddress, "Address updated successfully.")
        )
})

const deleteAddress = asyncHandler(async(req, res) => {
    const { addressId } = req.params
    const userId = req.user._id

    if(!mongoose.Types.ObjectId.isValid(addressId)){
        throw new ApiError(400, "Ivalid address ID.")
    }

    const address = await AddressModel.findById(addressId)
    if(!address){
        throw new ApiError(404, "Address not found.")
    }

    if(address.user.toString() !== userId.toString()){
        throw new ApiError(403, "You are not authorized to delete this address.")
    }
    await AddressModel.findByIdAndDelete(addressId)

    await UserModel.findByIdAndUpdate(userId,
        {
            $pull: { address_details: addressId}
        }
    )
     return res.status(200).json(
        new ApiResponse(200, {}, "Address delete successfully")
     )
})

export {
    addAddress,
    getMyAddresses,
    updateAddress,
    deleteAddress
}