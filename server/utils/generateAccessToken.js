import jwt from 'jsonwebtoken'

export const generateAccessToken = async(userId) => {
    const access_token = await jwt.sign(
        { id : userId}, 
        process.env.ACCESS_TOKEN_SECRET_KEY, 
        {expiresIn : '5h'})

        return access_token;
}