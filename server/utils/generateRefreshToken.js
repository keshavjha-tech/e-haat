import  jwt  from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";


export const generateRefreshToken = async (userId) => {
    const refresh_token = await jwt.sign(
        {id : userId},
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {expiresIn : '7d'}
    )

    const update_refresh_token = await UserModel.updateOne(
        {_id : userId},
        {refresh_Token : refresh_token}
    )

    return refresh_token;

}